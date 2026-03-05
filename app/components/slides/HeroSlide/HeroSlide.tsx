import { useContext } from "react";
import "./HeroSlide.css";
import { generateRandomState, GlobalStateContext, nextPageState } from "~/scripts/state";
import { openSimulation } from "~/scripts/lib/utils";

export function HeroSlide() {
  const { setState } = useContext(GlobalStateContext);
  return (
    <section className="hero-slide">
      <p className="subtitle">The Wizard Wizard</p>
      <h1>Bid Like a Wizard</h1>
      <p className="description">
        Run thousands of simulated rounds using your exact hand to discover the
        statistically best bid.
      </p>
      <div className="button-flex">
        <button className="default" onClick={() => setState(nextPageState())}>
         Bid Calculator
        </button>
        <button className="outline" onClick={()=>openSimulation(generateRandomState())}>Random Simulation</button>
        <a className="default" href="/trump-chooser">Trump Chooser</a>
      </div>      
    </section>
  );
}
