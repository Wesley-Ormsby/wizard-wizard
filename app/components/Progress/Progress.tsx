import { roundToPrecision } from "~/scripts/lib/utils";
import "./Progress.css"
// Value should be a number from 0-1
export function Progress({ value }: { value: number }) {
  return (
    <div className="progress-container">
      <p>{roundToPrecision(value * 100, 2)}%</p>
      <div className="progress-bar">
        <div className="inner-progress" style={{width:`${value*100}%`}}></div>
      </div>
    </div>
  );
}
