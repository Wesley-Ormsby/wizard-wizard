import type { ValidateSearchParamsReturn } from "~/scripts/lib/searchParams";
import { SUITS, type SimulationResult } from "~/scripts/types";
import { SimulationTable } from "./SimulationTable";
import { SimulationInputDetails } from "./SimulationInputDetails";
import { useMemo, useState } from "react";
import { SimulationTrumpSummary } from "./SimulationTrumpSummary/SimulationTrumpSummary";
import { getBestBid, suitLetterToName } from "~/scripts/lib/utils";
import { SuitIcon } from "../cardComponents/cardUtils";

interface SimulationResultProps {
  simResults: SimulationResult[];
  searchParamData: ValidateSearchParamsReturn;
  reloadSim: () => void;
}

export function SimulationTrumpChooserResults({
  simResults,
  searchParamData,
  reloadSim,
}: SimulationResultProps) {
  const [tab, setTab] = useState(0); // Index of the suit in SUITS
  const alteredSearchParamData: ValidateSearchParamsReturn = {
    ...searchParamData,
    position:searchParamData.players,
    trump: { rank: "W", suit: SUITS[tab] },
  };

  const bestTrumpChoice = useMemo(() => {
    let choice = 0;
    let max = simResults[0].expectedPoints[getBestBid(simResults[0])]
    for(let i = 1; i < 4; i++) {
        const curr = simResults[i].expectedPoints[getBestBid(simResults[i])]
        if(curr > max) {
            max = curr;
            choice = i;
        }
    }
    setTab(choice)
    return choice;
  }, [simResults]);

  return (
    <section className="slide simulation-page">
      <h1>Trump Chooser Results</h1>
      <div className="button-group">
        {simResults.map((result, i) => (
          <SimulationTrumpSummary
            key={i}
            simResult={result}
            trump={SUITS[i]}
            best={i == bestTrumpChoice}
          ></SimulationTrumpSummary>
        ))}
      </div>
      <h2>Simulation Details</h2>
      <div className="button-group">
        {SUITS.map((suit, i) => (
          <button className={`outline ${tab === i ? "selected" : ""}`} key={i} onClick={() => setTab(i)} aria-pressed={tab === i}>
            <SuitIcon suit={suit} yellow={true} aria-hidden/> {suitLetterToName(suit)}
          </button>
        ))}
      </div>
      <div>
        <p>
          Average Tricks Taken: {simResults[tab].mean.toFixed(2)} (&sigma; ={" "}
          {simResults[tab].standardDeviation.toFixed(3)})
        </p>
        <SimulationTable simResults={simResults[tab]} />
      </div>
      <div className="button-group">
        <button className="default" onClick={reloadSim}>
          Reload
        </button>
      </div>
      <SimulationInputDetails searchParamData={alteredSearchParamData} />
    </section>
  );
}
