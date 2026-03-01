import { validateSearchParams } from "~/scripts/lib/searchParams";
import type { Route } from "./+types/home";
import { useSearchParams } from "react-router";
import type {
  SimulationResult as SimulationResultType,
  workerMessage,
} from "~/scripts/types";
import { useEffect, useState } from "react";
import { SimulationError } from "~/components/simulationPageStates/SimulationError";
import { SimulationLoading } from "~/components/simulationPageStates/SimulationLoading";
import { SimulationResult } from "~/components/simulationPageStates/SimulationResult";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Wizard Wizard - Simulation" },
    { name: "description", content: "Wizard bid probability calculator" },
  ];
}

export default function SimulationPage() {
  const [searchParams] = useSearchParams();
  // Validate search params
  const searchParamData = validateSearchParams(searchParams);

  const [simResults, setSimResults] = useState<null | SimulationResultType>(
    null,
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!searchParamData.success) return;
    setSimResults(null);
    let worker = null;
    if (window.Worker) {
      worker = new Worker(
        new URL("../scripts/lib/simulation/webWorker.ts", import.meta.url),
        {
          type: "module",
        },
      );
      worker.onmessage = (e: MessageEvent<workerMessage>) => {
        if (e.data.type == "progress") {
          setProgress(e.data.progress);
        } else {
          setSimResults(e.data.result);
        }
      };
      worker.postMessage({
        trump: searchParamData.trump,
        players: searchParamData.players,
        position: searchParamData.players - 1,
        hand: searchParamData.hand,
        simulationCount: 1000000,
      });
    }
    return () => {
      if (worker) worker.terminate();
    };
  }, [searchParams]);

  if (!searchParamData.success)
    return <SimulationError searchParamData={searchParamData} />;

  if (simResults === null) return <SimulationLoading progress={progress} />;

  return (
    <SimulationResult
      simResults={simResults}
      searchParamData={searchParamData}
    />
  );
}
