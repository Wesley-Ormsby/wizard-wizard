import {
  type Card,
  type Suit,
  SUITS,
  type ExtendedRank,
  EXTENDED_RANKS,
  type SimulationResult,
} from "../../types";

// Note: position is 0-based such that 0 means you go first
export function runSimulations(
  trump: Card | null,
  players: number,
  position: number,
  hand: Card[],
  simulationCount: number,
  progressUpdater: (progress: number) => void,
): SimulationResult {
  // Make a list of cards that opponents could have
  const ignore = trump ? [...hand, trump] : hand;
  const deck: Card[] = makeDeck(ignore);
  const handCopy = [...hand]; // So we don't mutate hand when shuffling

  // Used to calculate cumulative stats
  let mean = 0;
  let varianceSum = 0;
  const bidCounts: Record<number, number> = {};

  for (let i = 0; i < simulationCount; i++) {
    shuffle(handCopy); // Changes priority of which cards you play
    shuffle(deck);

    const tricks = playRound(trump, players, position, handCopy, deck);

    // Update cumulative stats
    const delta = tricks - mean;
    mean += delta / (i + 1);
    varianceSum += delta * (tricks - mean);
    bidCounts[tricks] = (bidCounts[tricks] ?? 0) + 1;

    // Progress update semi-randomly
    if (Math.random() < 0.0001 || i / simulationCount > 0.99) {
      progressUpdater((i + 1) / simulationCount);
    }
  }

  const standardDeviation = Math.sqrt(varianceSum / simulationCount);

  const percentages = getBidsAsPercentages(bidCounts, simulationCount);
  const expectedPoints = getExpectedBidPoints(percentages);

  return {
    mean,
    standardDeviation,
    expectedPoints,
    percentages,
  };
}

export function getBidsAsPercentages(
  bidCounts: Record<number, number>,
  simulationCount: number,
): Record<number, number> {
  const percentages: Record<number, number> = {};
  for (const tricksTaken in bidCounts) {
    percentages[tricksTaken] = bidCounts[tricksTaken] / simulationCount;
  }
  return percentages;
}

export function getExpectedBidPoints(
  percentages: Record<string, number>,
): Record<number, number> {
  const expectedPoints: Record<string, number> = {};
  for (const tricksTaken in percentages) {
    expectedPoints[tricksTaken] = Object.keys(percentages).reduce(
      (accumulator, tricks) => {
        if (tricksTaken === tricks) {
          return (
            accumulator + percentages[tricks] * (20 + 10 * Number(tricksTaken))
          );
        } else {
          return (
            accumulator -
            percentages[tricks] *
              (10 * Math.abs(Number(tricks) - Number(tricksTaken)))
          );
        }
      },
      0,
    );
  }
  return expectedPoints;
}

export function playRound(
  trump: Card | null,
  players: number,
  position: number,
  hand: Card[],
  deck: Card[],
): number {
  // Note: cards should already be randomized at this point
  const playerHands: Card[][] = new Array(players);
  const handSize = hand.length;
  let sliceStart = 0;
  for (let i = 0; i < players; i++) {
    if (i === position) {
      playerHands[i] = [...hand];
      continue;
    }
    const playerHand = deck.slice(sliceStart, sliceStart + handSize);
    playerHands[i] = playerHand;
    sliceStart += handSize;
  }

  let tricksTaken = 0;
  let startingPlayer = 0;

  for (let i = hand.length; i > 0; i--) {
    const winnerPosition = playTrick(
      trump,
      players,
      startingPlayer,
      playerHands,
    );
    if (position === winnerPosition) {
      tricksTaken += 1;
    }
    startingPlayer = winnerPosition;
  }

  return tricksTaken;
}

export function playTrick(
  trump: Card | null,
  players: number,
  whoStarts: number,
  playerHands: Card[][],
): number {
  const leadCard = playerHands[whoStarts].pop() as Card;
  let lead: "J" | "W" | Suit = leadCard.suit;
  let winner = whoStarts;
  let winningCard: Card = leadCard;
  if (leadCard.rank === "J" || leadCard.rank === "W") {
    lead = leadCard.rank;
  }

  for (let i = 1; i < players; i++) {
    const idOfCurrentPlayer = (whoStarts + i) % players;
    if (lead === "J") {
      const placedCard = playerHands[idOfCurrentPlayer].pop() as Card;
      // Every card but a jester beats a jester
      if (placedCard.rank !== "J") {
        lead = placedCard.rank === "W" ? "W" : placedCard.suit;
        winner = idOfCurrentPlayer;
        winningCard = placedCard;
      }
    } else if (lead === "W") {
      // No card beats a wizard
      playerHands[idOfCurrentPlayer].pop();
    } else {
      // Try to follow suit, if there is suit, you can also throw off a wizard or jester if it came first
      let playedCard: Card | null = null;
      let firstWizardOrJester: number = -1;
      for (let j = playerHands[idOfCurrentPlayer].length - 1; j >= 0; j--) {
        let card = playerHands[idOfCurrentPlayer][j];
        if (card.rank === "J" || card.rank === "W") {
          if (firstWizardOrJester === -1) {
            firstWizardOrJester = j;
          }
          continue;
        }
        if (card.suit === lead) {
          if (firstWizardOrJester !== -1) {
            playedCard = playerHands[idOfCurrentPlayer][firstWizardOrJester];
            // Remove the card by swapping it with the last card in the list, then popping it (faster than the .splice() shifts)
            playerHands[idOfCurrentPlayer][firstWizardOrJester] =
              playerHands[idOfCurrentPlayer][
                playerHands[idOfCurrentPlayer].length - 1
              ];
            playerHands[idOfCurrentPlayer].pop();
          } else {
            playedCard = card;
            // Remove the card by swapping it with the last card in the list, then popping it (faster than the .splice() shifts)
            playerHands[idOfCurrentPlayer][j] =
              playerHands[idOfCurrentPlayer][
                playerHands[idOfCurrentPlayer].length - 1
              ];
            playerHands[idOfCurrentPlayer].pop();
          }
          break;
        }
      }
      // Couldn't follow suit, so throw off a random card (wizard, jester, or other)
      if (playedCard === null) {
        playedCard = playerHands[idOfCurrentPlayer].pop() as Card;
      }
      if (isWinner(playedCard, winningCard as Card, trump)) {
        winningCard = playedCard;
        winner = idOfCurrentPlayer;
      }
    }
  }
  return winner;
}

// Makes a list of all cards except those in the ignore array
export function makeDeck(ignore: Card[]): Card[] {
  const ignored = new Set(ignore.map((card) => `${card.rank}-${card.suit}`)); // Set of cards to ignore (for faster lookup)
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of EXTENDED_RANKS) {
      if (!ignored.has(`${rank}-${suit}`)) {
        deck.push({ suit, rank });
      }
    }
  }
  return deck;
}

// Fisher–Yates (Knuth) Shuffle
export function shuffle(cards: Card[]) {
  let currentIndex = cards.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [cards[currentIndex], cards[randomIndex]] = [
      cards[randomIndex],
      cards[currentIndex],
    ];
  }
}

export function cardMatch(card: Card, rank: ExtendedRank, suit: Suit) {
  return card.rank === rank && card.suit === suit;
}

export function isWinner(
  playedCard: Card,
  winningCard: Card,
  trump: Card | null,
): boolean {
  // Deal with wizards and jesters
  if (winningCard.rank === "W") return false;
  if (winningCard.rank === "J") return playedCard.rank !== "J";
  if (playedCard.rank === "W") return true;
  if (playedCard.rank === "J") return false;

  // Highest card wins
  if (
    trump === null ||
    trump.rank === "J" ||
    (playedCard.suit != trump.suit && winningCard.suit != trump.suit)
  ) {
    return (
      playedCard.suit === winningCard.suit &&
      (playedCard.rank === 1 ||
        (playedCard.rank > winningCard.rank && winningCard.rank != 1))
    );
  }

  // If the winning card is trump
  if (trump && winningCard.suit === trump.suit)
    return (
      playedCard.suit === trump.suit &&
      (playedCard.rank === 1 ||
        (playedCard.rank > winningCard.rank && winningCard.rank != 1))
    );

  // The played card trumps a non-trump
  return true;
}
