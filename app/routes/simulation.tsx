import { validateSearchParams } from "~/scripts/lib/searchParams";
import type { Route } from "./+types/home";
import { useNavigate, useSearchParams } from "react-router";
import type {
  SimulationResult as SimulationResultType,
  WorkerMessage,
} from "~/scripts/types";
import { useEffect, useState } from "react";
import { SimulationError } from "~/components/simulationResultComponents/SimulationError";
import { SimulationLoading } from "~/components/simulationResultComponents/SimulationLoading";
import { SimulationResult } from "~/components/simulationResultComponents/SimulationResult";

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

  const [simCounter, setSimCounter] = useState(0);
  const reloadSim = () => setSimCounter(prev=>prev+1)

  useEffect(() => {
    if (!searchParamData.success) return;
    setProgress(0)
    setSimResults(null);
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
  }, [searchParams, simCounter]);

  const navigate = useNavigate();
  function recoverErrorState() {
    navigate("/", {
      state: {
        page: searchParamData.recoverablePage,
        players: searchParamData.players,
        position: searchParamData.position,
        trump: searchParamData.trump,
        hand: searchParamData.hand,
      },
    });
  }

  if (!searchParamData.success)
    return <SimulationError searchParamData={searchParamData} recoverErrorState={recoverErrorState}/>;

  if (simResults === null) return <SimulationLoading progress={progress} />;

  return (
    <SimulationResult
      simResults={simResults}
      searchParamData={searchParamData}
      reloadSim={reloadSim}
    />
  );
}
