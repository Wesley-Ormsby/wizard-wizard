import { useCallback, useContext } from "react";
import { GlobalStateContext, setTrumpState } from "~/scripts/state";
import { EXTENDED_RANKS, SUITS, type Card } from "~/scripts/types";
import "./CardComponents.css";
import { CardButton } from "./CardButton";

export function TrumpSelector() {
  const { state, setState } = useContext(GlobalStateContext);
  const selectTrump = useCallback(
    (card: Card | null) => {
      setState(setTrumpState(card, true));
    },
    [setState],
  );

  return (
      <div className="card-button-row-container">
        {SUITS.map((suit) => (
          <div key={suit} className="card-button-row">
            {EXTENDED_RANKS.filter((rank) => rank !== "J").map((rank) => (
              <CardButton
                key={`${rank}${suit}`}
                card={{ rank, suit }}
                active={
                  state.trump?.rank === rank && state.trump?.suit === suit
                }
                onClick={() => selectTrump({ rank, suit })}
              />
            ))}
          </div>
        ))}
        <div className="card-button-row">
          <button
            aria-pressed={state.trump != null && state.trump.rank === "J"}
            onClick={() => selectTrump({ rank: "J", suit: "H" })}
            className={`default
              ${state.trump && state.trump.rank === "J" ? "active" : ""}`}
          >
            Jester
          </button>
          <button
            aria-pressed={state.trump === null}
            onClick={() => selectTrump(null)}
            className={`default
              ${state.trump === null ? "active" : ""}`}
          >
            No Trump (last hand)
          </button>
        </div>
    </div>
  );
}
