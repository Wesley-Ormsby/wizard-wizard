import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Card } from "./types";
import { isSameCard, randomNumberInclusive } from "./lib/utils";
import { makeDeck, shuffle } from "./lib/simulation/simulation";

interface GlobalStateContextValue {
  state: GlobalState;
  setState: Dispatch<SetStateAction<GlobalState>>;
}

export interface GlobalState {
  page: number;
  players: number | null;
  position: number | null;
  trump: Card | null;
  hand: Card[];
}

export const defaultState = {
  page: 1,
  players: null,
  position: null,
  trump: null,
  hand: [],
};

export const GlobalStateContext = createContext<GlobalStateContextValue>({
  state: defaultState,
  setState: () => {},
});

// These function return a function that updates the state object when used with setState(...)
// i.e. a Dispatch<SetStateAction<GlobalState>> function
export function nextPageState() {
  return (prev: GlobalState): GlobalState => ({
    ...prev,
    page: Math.min(prev.page + 1, 5),
  });
}

export function previousPageState() {
  return (prev: GlobalState): GlobalState => ({
    ...prev,
    page: Math.max(prev.page - 1, 1),
  });
}

export function setPlayersState(count: number, goToNextPage: boolean = false) {
  return (prev: GlobalState): GlobalState => ({
    ...prev,
    players: count,
    page: goToNextPage ? Math.min(prev.page + 1, 5) : prev.page,
  });
}

export function setPositionState(position: number, goToNextPage: boolean = false) {
  return (prev: GlobalState): GlobalState => ({
    ...prev,
    position: position,
    page: goToNextPage ? Math.min(prev.page + 1, 5) : prev.page,
  });
}

export function setTrumpState(trump: Card | null, goToNextPage: boolean = false) {
  return (prev: GlobalState): GlobalState => {
    const newState = {
      ...prev,
      trump,
      page: goToNextPage ? Math.min(prev.page + 1, 5) : prev.page,
    };
    // Check if trump is in the user's hand an remove it
    if (goToNextPage && trump != null) {
      newState.hand = prev.hand.filter(
        (handCard) =>
          !isSameCard(trump, handCard)
      );
    }
    return newState;
  };
}

export function toggleCardInHandState(
  card: Card,
  isInHand: boolean,
  goToNextPage: boolean = false,
) {
  return (prev: GlobalState): GlobalState => {
    let hand;
    if (isInHand) {
      hand = prev.hand.filter(
        (handCard) =>
          !isSameCard(card, handCard)
      );
    } else {
      hand = [...prev.hand, card];
    }
    return {
      ...prev,
      hand,
      page: goToNextPage ? Math.min(prev.page + 1, 5) : prev.page,
    };
  };
}

export function generateRandomState(): GlobalState {
  const players = randomNumberInclusive(3, 6);
  const position = randomNumberInclusive(1, players);
  const trumpIndex = randomNumberInclusive(0, 60);
  const deck = makeDeck([]);
  shuffle(deck);
  const trump = trumpIndex === 60 ? null : deck[0];
  const handSize =
    trump === null ? 60 / players : randomNumberInclusive(1, 60 / players - 1);
  const hand = deck.splice(1, handSize);
  return { page: 5, players, position, trump, hand };
}
