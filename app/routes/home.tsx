import type { Route } from "./+types/home";
import { HeroSlide } from "../components/slides/HeroSlide/HeroSlide";
import { useContext, useEffect, useState, type JSX } from "react";
import type { GlobalState } from "~/scripts/state";
import {
  defaultState,
  GlobalStateContext,
  previousPageState,
} from "~/scripts/state";
import { PlayerCountSlide } from "~/components/slides/PlayerCountSlide/PlayerCountSlide";
import { PositionSlide } from "~/components/slides/PositionSlide/PositionSlide";
import { TrumpSlide } from "~/components/slides/TrumpSlide/TrumpSlide";
import { HandSlide } from "~/components/slides/HandSlide/HandSlide";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "react-router";
import { openSimulation } from "~/scripts/lib/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Wizard Wizard" },
    { name: "description", content: "Wizard bid probability calculator" },
  ];
}

export default function Home() {
  const [state, setState] = useState<GlobalState>(defaultState);
  const location = useLocation();

  // This handles when you move from the simulation page to the next round
  useEffect(() => {
    if (!location.state) return;
    setState((prev) => ({
      page: location.state.page ?? prev.page,
      players: location.state.players ?? prev.players,
      position: location.state.position ?? prev.position,
      trump: location.state.trump ?? prev.trump,
      hand: location.state.hand ?? prev.hand,
    }));
  }, []);

  return (
    <div className="slide">
      <GlobalStateContext.Provider value={{ state, setState }}>
        <SlideBody />
      </GlobalStateContext.Provider>
      {state.page !== 1 && (
        <button
          className="outline back-button"
          onClick={() => setState(previousPageState())}
        >
          <ArrowLeft />
          Back
        </button>
      )}
      <p className="page-reminder">Page {state.page} of 5</p>
    </div>
  );
}

function SlideBody() {
  const { state } = useContext(GlobalStateContext);

  switch (state.page) {
    case 1:
      return <HeroSlide />;
    case 2:
      return <PlayerCountSlide />;
    case 3:
      return <PositionSlide />;
    case 4:
      return <TrumpSlide />;
    case 5:
      return <HandSlide runButtonText="Run Simulation" runFunction={() => openSimulation(state)}/>;
  }
}
