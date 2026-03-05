import { useCallback, useContext, useMemo } from "react";
import { GlobalStateContext, toggleCardInHandState } from "~/scripts/state";
import { RANKS, SUITS, type Card, type ExtendedRank } from "~/scripts/types";
import "./CardComponents.css";
import { CardButton } from "./CardButton";

export function HandSelector({maxHandSize}:{maxHandSize:number}) {
  const { state, setState } = useContext(GlobalStateContext);

  const handSet = useMemo(
    () => new Set(state.hand.map((c) => `${c.rank}${c.suit}`)),
    [state.hand],
  );

  const toggleCard = useCallback(
    (card: Card) => {
      const isInHand = handSet.has(`${card.rank}${card.suit}`);
      if (isInHand || state.hand.length < maxHandSize)
        setState(toggleCardInHandState(card, isInHand, false));
    },
    [handSet],
  );

  return (
    <div>
      <p className="selected-count">
        {state.hand.length}/{maxHandSize} selected
      </p>
      <div className="card-button-row-container">
        {SUITS.map((suit) => (
          <div key={suit} className="card-button-row">
            {RANKS.map((rank) => (
              <CardButton
                key={`${rank}${suit}`}
                card={{ rank, suit }}
                disabled={
                  state.trump?.rank === rank && state.trump?.suit === suit
                }
                active={handSet.has(`${rank}${suit}`)}
                onClick={() => toggleCard({ suit, rank })}
              />
            ))}
          </div>
        ))}
        <div key={"specials"} className="card-button-row">
          {(["J", "W"] as ExtendedRank[]).map((rank) =>
            SUITS.map((suit) => (
              <CardButton
                key={`${rank}${suit}`}
                card={{ rank, suit }}
                disabled={
                  state.trump?.rank === rank && state.trump?.suit === suit
                }
                active={handSet.has(`${rank}${suit}`)}
                onClick={() => toggleCard({ suit, rank })}
                blue
              />
            )),
          )}
        </div>
        {state.hand.length > maxHandSize && (
          <p className="danger-reminder">
            You have too many cards in your hand.
          </p>
        )}
      </div>
    </div>
  );
}
