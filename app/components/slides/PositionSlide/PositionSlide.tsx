import { useContext } from "react";
import { GlobalStateContext, setPositionState } from "~/scripts/state";
import "./PositionSlide.css";

export function PositionSlide() {
  const { state, setState } = useContext(GlobalStateContext);
  if (!state.players) return null;
  const range = Array.from({ length: state.players }, (_, i) => i + 1);
  return (
    <section className="position-slide">
      <h1>What position are you in?</h1>

      <p>
        The starting player is position 1. They bid first and lead the first
        card. Positions continue clockwise from there.
      </p>

      <div className="button-container">
        {range.map((i) => (
          <button
            className="default position-button"
            key={i}
            onClick={() => setState(setPositionState(i, true))}
          >
            {i}
          </button>
        ))}
      </div>
    </section>
  );
}
