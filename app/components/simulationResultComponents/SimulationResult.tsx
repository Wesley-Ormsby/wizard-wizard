import type { ValidateSearchParamsReturn } from "~/scripts/lib/searchParams";
import { cardToCode, roundToPrecision } from "~/scripts/lib/utils";
import type { SimulationResult } from "~/scripts/types";
import { Details } from "../Details/Details";
import { Card } from "../cardComponents/Card";
import { useNavigate } from "react-router";
import { SimulationTable } from "./SimulationTable";
import { SimulationInputDetails } from "./SimulationInputDetails";

interface SimulationResultProps {
  simResults: SimulationResult;
  searchParamData: ValidateSearchParamsReturn;
  reloadSim: () => void;
}

export function SimulationResult({
  simResults,
  searchParamData,
  reloadSim,
}: SimulationResultProps) {
  const navigate = useNavigate();

  function nextRound(stateData: ValidateSearchParamsReturn) {
    navigate("/", {
      state: {
        page: 4,
        players: stateData.players,
        position: (stateData.position % stateData.players) + 1,
      },
    });
  }

  const isLastRound = searchParamData.trump === null && searchParamData.hand.length === 60 / searchParamData.players
  
  return (
    <section className="slide simulation-page">
      <h1>Simulation Results</h1>
      <div>
        <p>
          Average Tricks Taken: {simResults.mean.toFixed(2)} (&sigma; ={" "}
          {simResults.standardDeviation.toFixed(3)})
        </p>
        <SimulationTable simResults={simResults}/>
      </div>
      <div className="button-group">
        <button className="default" onClick={reloadSim}>
          Reload
        </button>
        <button className="default" onClick={() => nextRound(searchParamData)} disabled={isLastRound}>
          Next Round
        </button>
      </div>
      <SimulationInputDetails searchParamData={searchParamData}/>
      
    </section>
  );
}
