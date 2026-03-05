import type { ValidateSearchParamsReturn } from "~/scripts/lib/searchParams";
import { Details } from "../Details/Details";
import { Card } from "../cardComponents/Card";
import { cardToCode } from "~/scripts/lib/utils";

export function SimulationInputDetails({searchParamData}: {searchParamData:ValidateSearchParamsReturn}) {
    return <Details summary="View simulation input">
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
          You started at position <b>{searchParamData.position}</b> in a{" "}
          <b>{searchParamData.players}</b>-player game.
        </p>
      </Details>
}