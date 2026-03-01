import type { ValidateSearchParamsReturn } from "~/scripts/lib/searchParams";
import { cardToCode, roundToPrecision } from "~/scripts/lib/utils";
import type { SimulationResult } from "~/scripts/types";
import { Details } from "../Details/Details";
import { Card } from "../cardComponents/Card";
import { useNavigate } from "react-router";

export function SimulationResult({
  simResults,
  searchParamData,
}: {
  simResults: SimulationResult;
  searchParamData: ValidateSearchParamsReturn;
}) {
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

  const bestChoice = Object.keys(simResults.expectedPoints).reduce(
    (max, item) =>
      simResults.expectedPoints[max] > simResults.expectedPoints[item]
        ? max
        : item,
    Object.keys(simResults.expectedPoints)[0],
  );

  return (
    <section className="slide simulation-page">
      <h1>Simulation Results</h1>
      <div>
        <p>
          Average Tricks Taken: {simResults.mean.toFixed(2)} (&sigma; ={" "}
          {simResults.standardDeviation.toFixed(3)})
        </p>
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
      </div>
      <div className="button-group">
        <button className="default" onClick={() => navigate(0)}>
          Reload
        </button>
        <button className="default" onClick={() => nextRound(searchParamData)}>
          Next Round
        </button>
      </div>
      <Details summary="View simulation input">
        <div className="trump-hand-container">
          <div className="trump-hand-sub-container">
            <b>Trump</b>
            <div>
              {searchParamData.trump ? (
                <Card
                  card={searchParamData.trump}
                  active={false}
                  blue={searchParamData.trump.rank === "J"}
                ></Card>
              ) : (
                <span className="no-text-wrap">No trump</span>
              )}
            </div>
          </div>
          <div className="trump-hand-sub-container">
            <b>Hand</b>
            <div className="card-row">
              {searchParamData.hand.map((card) => (
                <Card
                  key={cardToCode(card)}
                  card={card}
                  active={false}
                  blue={card.rank === "W" || card.rank === "J"}
                ></Card>
              ))}
            </div>
          </div>
        </div>
        <p>
          You started at position <b>{searchParamData.position + 1}</b> in a{" "}
          <b>{searchParamData.players}</b>-player game.
        </p>
      </Details>
    </section>
  );
}
