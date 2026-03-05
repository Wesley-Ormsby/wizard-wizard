import type { Card, ExtendedRank, Suit } from "../types";

export interface ValidateSearchParamsReturn {
  success: boolean;
  messages: string[];
  recoverablePage: number;
  players: number;
  trump: Card | null;
  position: number;
  hand: Card[];
}

function addErr(
  returnObj: ValidateSearchParamsReturn,
  msg: string,
  page: number,
) {
  returnObj.messages.push(msg);
  returnObj.success = false;
  returnObj.recoverablePage = Math.min(returnObj.recoverablePage, page);
}

function playerValidation(
  returnObj: ValidateSearchParamsReturn,
  searchParams: URLSearchParams,
  errPage: number,
) {
  const playersQuery = searchParams.get("players")?.trim();
  if (playersQuery === undefined) {
    addErr(
      returnObj,
      "No <code>players</code> query parameter provided.",
      errPage,
    );
  } else {
    if (["3", "4", "5", "6"].includes(playersQuery)) {
      returnObj.players = Number(playersQuery);
    } else {
      addErr(
        returnObj,
        "The <code>players</code> query parameter is invalid. It should be a number between 3 and 6.",
        errPage,
      );
    }
  }
}

function handValidation(
  returnObj: ValidateSearchParamsReturn,
  searchParams: URLSearchParams,
  validationKind: "trumpChooser" | "bidSimulation",
  errPage: number,
) {
  const handQuery = searchParams.get("hand")?.trim()?.toUpperCase();
  if (handQuery === undefined) {
    addErr(
      returnObj,
      "No <code>hand</code> query parameter provided.",
      errPage,
    );
    return;
  }

  // Try to parse the hand
  const match = handQuery.match(/^(([1-9WJ]|10|11|12|13)([HDSC]))+$/);
  if (match === null) {
    addErr(
      returnObj,
      `The <code>hand</code> query parameter is invalid.`,
      errPage,
    );
  }

  const groups = handQuery.matchAll(/([1-9WJ]|10|11|12|13)([HDSC])/g);
  let card = groups.next();
  let wizardCount = 0;
  while (!card.done) {
    const cardMatch = card.value;
    const rank =
      cardMatch[1] === "W" || cardMatch[1] === "J"
        ? cardMatch[1]
        : Number(cardMatch[1]);
    const newCard = {
      suit: cardMatch[2] as Suit,
      rank: rank as ExtendedRank,
    };
    // Ignore duplicate cards
    if (
      returnObj.hand.findIndex(
        (card) => card.rank === newCard.rank && card.suit === newCard.suit,
      ) === -1
    ) {
      if (validationKind === "trumpChooser" && rank === "W") {
        wizardCount += 1; 
        if(wizardCount >=4) {
          returnObj.trump = newCard;
          card = groups.next();
          continue;
        };
      }
      returnObj.hand.push(newCard);
    }
    card = groups.next();
  }

  // For the trump chooser, make sure less than 4 wizards are in their hand
  if (validationKind === "trumpChooser" && wizardCount >= 4) {
    addErr(
      returnObj,
      `The <code>hand</code> query parameter includes 4 wizards, meaning a wizard cannot be trump.`,
      errPage,
    );
    return;
  }

  // Check if the trump card is in their hand
  if (validationKind == "bidSimulation" && returnObj.trump !== null) {
    const trump = returnObj.trump;
    let index = returnObj.hand.findIndex(
      (card) => card.rank === trump.rank && card.suit === trump.suit,
    );
    if (index !== -1) {
      returnObj.hand.splice(index, 1);
      addErr(
        returnObj,
        `The <code>hand</code> query parameter included the trump card. It must be removed before the simulation runs.`,
        errPage,
      );
      return;
    }
  }

  // Check if the hand size is valid
  if (returnObj.players > 0) {
    let maxHandSize = 60 / returnObj.players;
    if (returnObj.trump !== null) maxHandSize -= 1;
    if (returnObj.hand.length > maxHandSize) {
      addErr(
        returnObj,
        `The hand size from the <code>hand</code> query parameter is too large given the player number.`,
        errPage,
      );
    }
  }
}

export function validateSearchParams(
  searchParams: URLSearchParams,
): ValidateSearchParamsReturn {
  const returnObj: ValidateSearchParamsReturn = {
    success: true,
    messages: [],
    recoverablePage: Infinity,
    players: 0,
    position: 0,
    trump: null,
    hand: [],
  };

  // Player validation
  playerValidation(returnObj, searchParams, 2);

  // Position validation
  const positionQuery = searchParams.get("position")?.trim();
  if (positionQuery === undefined) {
    addErr(returnObj, "No <code>position</code> query parameter provided.", 3);
  } else if (returnObj.players != 0) {
    const position = Number(positionQuery);
    if (
      !Number.isInteger(position) ||
      position < 1 ||
      position > returnObj.players
    ) {
      addErr(
        returnObj,
        `The <code>position</code> query parameter is invalid. It should be an integer between 1 and the player count (${returnObj.players}).`,
        3,
      );
    } else {
      returnObj.position = position;
    }
  }

  // Trump validation: if trump is empty, it defaults to `null`
  const trumpQuery = searchParams.get("trump")?.trim()?.toUpperCase();
  if (trumpQuery !== undefined && trumpQuery !== "NONE") {
    const match = trumpQuery.match(/^([1-9WJ]|10|11|12|13)([HDSC])$/);
    if (match === null) {
      addErr(
        returnObj,
        `The <code>trump</code> query parameter is invalid.`,
        4,
      );
    } else {
      const rank =
        match[1] === "W" || match[1] === "J" ? match[1] : Number(match[1]);
      returnObj.trump = {
        suit: match[2] as Suit,
        rank: rank as ExtendedRank,
      };
    }
  }

  handValidation(returnObj, searchParams, "bidSimulation", 5);

  // Validate that the hand is full if trump is null (last round)
  if(returnObj.success && returnObj.trump === null && returnObj.hand.length !== 60 / returnObj.players) {
    addErr(
        returnObj,
        `The <code>hand</code> is short cards for the final round in a ${returnObj.players}-player game.`,
        5,
      );
  }

  return returnObj;
}

export function validateTrumpChooserSearchParams(
  searchParams: URLSearchParams,
): ValidateSearchParamsReturn {
  const returnObj: ValidateSearchParamsReturn = {
    success: true,
    messages: [],
    recoverablePage: Infinity,
    players: 0,
    position: 1,
    trump: null,
    hand: [],
  };

  playerValidation(returnObj, searchParams, 2);

  handValidation(returnObj, searchParams, "trumpChooser", 3);

  return returnObj;
}
