import { getBestBid, roundToPrecision } from "~/scripts/lib/utils";
import type { SimulationResult } from "~/scripts/types";

export function SimulationTable({
  simResults,
}: {
  simResults: SimulationResult;
}) {
  const bestChoice = getBestBid(simResults);

  return (
    <table>
      <thead>
        <tr>
          <th>Bid</th>
          <th>Success Rate</th>
          <th>Expected points</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(simResults.percentages).map((tricks) => (
          <tr
            key={tricks}
            className={bestChoice == tricks ? "best-choice" : ""}
          >
            <td>{tricks}</td>
            <td>
              {roundToPrecision(
                simResults.percentages[Number(tricks)] * 100,
                2,
              )}
              %
            </td>
            <td>
              {roundToPrecision(
                simResults.expectedPoints[Number(tricks)],
                2,
              )}{" "}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
