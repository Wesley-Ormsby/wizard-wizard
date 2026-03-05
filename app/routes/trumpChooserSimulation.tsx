import {
  validateSearchParams,
  validateTrumpChooserSearchParams,
} from "~/scripts/lib/searchParams";
import type { Route } from "./+types/home";
import { useNavigate, useSearchParams } from "react-router";
import {
  SUITS,
  type Card,
  type SimulationResult as SimulationResultType,
  type Suit,
  type WorkerMessage,
} from "~/scripts/types";
import { useEffect, useState } from "react";
import { SimulationError } from "~/components/simulationResultComponents/SimulationError";
import { SimulationLoading } from "~/components/simulationResultComponents/SimulationLoading";
import { SimulationTrumpChooserResults } from "~/components/simulationResultComponents/SimulationTrumpChooserResults";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Wizard Wizard - Trump Chooser Simulation" },
    { name: "description", content: "Wizard bid probability calculator" },
  ];
}

function changeWizardSuits(hand: Card[], changeFromSuit:Suit) {
    let newHand = [...hand]
    let suitIndex = 0;
    for(let i = 0; i < newHand.length; i++) {
        if(newHand[i].rank === "W") {
            let suit = SUITS[suitIndex++]
            if(suit === changeFromSuit) {
                suit = SUITS[suitIndex++]
            }
            newHand[i].suit = suit;
        }
    }
    return hand;
}

export default function SimulationPage() {
  const [searchParams] = useSearchParams();
  // Validate search params
  const searchParamData = validateTrumpChooserSearchParams(searchParams);

  const [simResults, setSimResults] = useState<SimulationResultType[]>([]);
  const [progress, setProgress] = useState(0);

  const [simCounter, setSimCounter] = useState(0);
  const reloadSim = () => setSimCounter((prev) => prev + 1);

  useEffect(() => {
    if (!searchParamData.success) return;
    setSimResults([]);
    setProgress(0)
    let simsCompleted = 0;
    let worker = null;
    if (window.Worker) {
      worker = new Worker(
        new URL("../scripts/lib/simulation/webWorker.ts", import.meta.url),
        {
          type: "module",
        },
      );
      worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
        if (e.data.type == "progress") {
          setProgress(simsCompleted * 0.25 + e.data.progress * 0.25);
        } else {
          const newResult = e.data.result;
          setSimResults((prev) => [...prev, newResult]);
          simsCompleted += 1;
        }
      };
      for (const suit of SUITS) {
        worker.postMessage({
          trump: { rank: "W", suit },
          players: searchParamData.players,
          position: searchParamData.players - 1,
          hand: changeWizardSuits(searchParamData.hand, suit),
          simulationCount: 1000000,
        });
      }
    }
    return () => {
      if (worker) worker.terminate();
    };
  }, [searchParams, simCounter]);

  const navigate = useNavigate();
  function recoverErrorState() {
    navigate("/trump-chooser", {
      state: {
        page: searchParamData.recoverablePage,
        players: searchParamData.players,
        hand: searchParamData.hand,
        trump: searchParamData.trump
      },
    });
  }

  if (!searchParamData.success)
    return <SimulationError searchParamData={searchParamData} recoverErrorState={recoverErrorState}/>;

  if (simResults.length < 4) return <SimulationLoading progress={progress} />;

  return (
      <SimulationTrumpChooserResults
        simResults={simResults}
        searchParamData={searchParamData}
        reloadSim={reloadSim}
      />
  );
}
