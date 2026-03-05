import { SuitIcon } from "~/components/cardComponents/cardUtils";
import {
  getBestBid,
  roundToPrecision,
  suitLetterToName,
} from "~/scripts/lib/utils";
import type { SimulationResult, Suit } from "~/scripts/types";
import "./SimulationTrumpSummary.css";

interface SimulationTrumpSummaryProps {
  simResult: SimulationResult;
  trump: Suit;
  best: boolean;
}

export function SimulationTrumpSummary({
  simResult,
  trump,
  best,
}: SimulationTrumpSummaryProps) {
  const bestBid = getBestBid(simResult);
  return (
    <div className={`trump-summary-display ${best ? "best" : ""}`}>
      <div className="header">
        <SuitIcon suit={trump} yellow={true}/>{" "}
        <span>{suitLetterToName(trump)}</span>
      </div>
      <div>
      <div className="stat-container">
        <span className="stat">{bestBid}</span>
        <span className="stat-description">Bid</span>
      </div>
      <div className="stat-container">
        <span className="stat">
          {roundToPrecision(simResult.percentages[bestBid]* 100, 2)}%
        </span>
        <span className="stat-description">Success Rate</span>
      </div>
      <div className="stat-container">
        <span className="stat">
          {roundToPrecision(simResult.expectedPoints[bestBid], 2)}
        </span>
        <span className="stat-description">Expected Points</span>
      </div>
      </div>
    </div>
  );
}
