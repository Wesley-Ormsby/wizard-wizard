import { useContext } from "react";
import { GlobalStateContext, setPlayersState } from "~/scripts/state";
import "./PlayerCountSlide.css";

export function PlayerCountSlide() {
  const { setState } = useContext(GlobalStateContext);
  return (
    <section className="player-slide">
      <h1>How many players are in the game?</h1>

      <div className="button-container">
        {[3, 4, 5, 6].map((num) => (
          <button
            className="default player-button"
            key={num}
            onClick={() => setState(setPlayersState(num, true))}
          >
            {num}
          </button>
        ))}
      </div>
    </section>
  );
}
