import { useContext, useMemo } from "react";
import { HandSelector } from "~/components/cardComponents/HandSelector";
import { openSimulation } from "~/scripts/lib/utils";
import { GlobalStateContext } from "~/scripts/state";

export function HandSlide() {
  const { state, setState } = useContext(GlobalStateContext);
  let maxHandSize = 60 / (state.players as number);
  if (state.trump) maxHandSize -= 1;

  const disableRunSimulationButton =
    state.hand.length === 0 ||
    (state.trump === null && state.hand.length !== maxHandSize) ||
    state.hand.length > maxHandSize;

  return (
    <section>
      <h1>Enter Your Hand</h1>

      <HandSelector maxHandSize={maxHandSize}></HandSelector>

      <div className="card-button-row">
        <button
          className="default"
          disabled={state.hand.length === 0}
          onClick={() =>
            setState((previousState) => ({ ...previousState, hand: [] }))
          }
        >
          Clear
        </button>
        <button
          className="default"
          disabled={disableRunSimulationButton}
          onClick={() => openSimulation(state)}
        >
          Run Simulation
        </button>
      </div>
    </section>
  );
}
