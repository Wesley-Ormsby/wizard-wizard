import type { WorkerRequest } from "~/scripts/types";
import { runSimulations } from "./simulation";

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const data = e.data;
  const result = runSimulations(
    data.trump,
    data.players,
    data.position,
    data.hand,
    data.simulationCount,
    (progress: number) => {
      postMessage({ type: "progress", progress });
    },
  );
  postMessage({ type: "result", result });
};
