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

export function validateSearchParams(
  searchParams: URLSearchParams,
): ValidateSearchParamsReturn {
  const addErr = (msg: string, page: number) => {
    returnObj.messages.push(msg);
    returnObj.success = false;
    returnObj.recoverablePage = Math.min(returnObj.recoverablePage, page);
  };
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
  const playersQuery = searchParams.get("players")?.trim();
  if (playersQuery === undefined) {
    addErr("No <code>players</code> query parameter provided.", 2);
  } else {
    if (["3", "4", "5", "6"].includes(playersQuery)) {
      returnObj.players = Number(playersQuery);
    } else {
      addErr(
        "The <code>players</code> query parameter is invalid. It should be a number between 3 and 6.",
        2,
      );
    }
  }

  // Position validation
  const positionQuery = searchParams.get("position")?.trim();
  if (positionQuery === undefined) {
    addErr("No <code>position</code> query parameter provided.", 3);
  } else if (returnObj.players != 0) {
    const position = Number(positionQuery);
    if (
      !Number.isInteger(position) ||
      position < 1 ||
      position > returnObj.players
    ) {
      addErr(
        `The <code>position</code> query parameter is invalid. It should be an integer between 1 and the player count (${returnObj.players}).`,
        3,
      );
    }
  }

  // Trump validation: if trump is empty, it defaults to `null`
  const trumpQuery = searchParams.get("trump")?.trim()?.toUpperCase();
  if (trumpQuery !== undefined && trumpQuery !== "NONE") {
    const match = trumpQuery.match(/^([1-9WJ]|10|11|12|13)([HDSC])$/);
    if (match === null) {
      addErr(`The <code>trump</code> query parameter is invalid.`, 4);
    } else {
      const rank =
        match[1] === "W" || match[1] === "J" ? match[1] : Number(match[1]);
      returnObj.trump = {
        suit: match[2] as Suit,
        rank: rank as ExtendedRank,
      };
    }
  }

  // Hand validation
  const handQuery = searchParams.get("hand")?.trim()?.toUpperCase();
  if (handQuery === undefined) {
    addErr("No <code>hand</code> query parameter provided.", 5);
  } else {
    // Try to parse the hand
    const match = handQuery.match(/^(([1-9WJ]|10|11|12|13)([HDSC]))+$/);
    if (match === null) {
      addErr(`The <code>hand</code> query parameter is invalid.`, 5);
    } else {
      const groups = handQuery.matchAll(/([1-9WJ]|10|11|12|13)([HDSC])/g);
      let card = groups.next();
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
          returnObj.hand.push(newCard);
        }
        card = groups.next();
      }
      // Check if the trump card is in their hand
      if (returnObj.trump !== null) {
        const trump = returnObj.trump;
        let index = returnObj.hand.findIndex(
          (card) => card.rank === trump.rank && card.suit === trump.suit,
        );
        if (index !== -1) {
          returnObj.hand.splice(index, 1);
          addErr(
            `The <code>hand</code> query parameter included the trump card. It must be removed before the simulation runs.`,
            5,
          );
        } else {
          // Check if the hand size is valid
          if (returnObj.players > 0) {
            let maxHandSize = 60 / returnObj.players;
            if (returnObj.trump !== null) maxHandSize -= 1;
            if (returnObj.hand.length > maxHandSize) {
              addErr(
                `The hand size from the <code>hand</code> query parameter is too large given the player number.`,
                5,
              );
            }
          }
        }
      }
    }
  }

  return returnObj;
}
