import type { GlobalState } from "../state";
import type { Card, ExtendedRank, Suit } from "../types";

const suitToNameMap = {
  D: "Diamonds",
  H: "Hearts",
  S: "Spades",
  C: "Clubs",
};

const rankToRankNameMap = {
  1: "Ace",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven",
  8: "Eight",
  9: "Nine",
  10: "Ten",
  11: "Eleven",
  12: "Twelve",
  13: "Thirteen",
  J: "Jester",
  W: "Wizard",
};

const rankToSymbolPartialMap: Partial<Record<ExtendedRank, string>> = {
  1: "A",
  11: "J",
  12: "Q",
  13: "K",
  J: "JE",
};

export function suitLetterToName(suit: Suit) {
  return suitToNameMap[suit];
}

export function rankToRankName(rank: ExtendedRank) {
  return rankToRankNameMap[rank];
}

export function rankToSymbol(rank: ExtendedRank): string {
  return rankToSymbolPartialMap[rank] ?? String(rank);
}

export function cardToCode(card: Card) {
  return `${card.rank}${card.suit}`;
}

export function roundToPrecision(num: number, precision: number) {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

export function randomNumberInclusive(x: number, y: number) {
  const min = Math.ceil(Math.min(x, y));
  const max = Math.floor(Math.max(x, y));
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function openSimulation(state: GlobalState) {
  const trumpParam = state.trump
    ? `&trump=${encodeURIComponent(cardToCode(state.trump))}`
    : "";
  const encodedHand = encodeURIComponent(state.hand.map(cardToCode).join(""));
  const simulationHref = `/simulation?players=${state.players}&position=${state.position}${trumpParam}&hand=${encodedHand}`;
  window.open(simulationHref, "_self");
}

export function isSameCard(a:Card, b:Card) {
    return a.rank === b.rank && a.suit === b.suit;
}