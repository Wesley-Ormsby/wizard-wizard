import type { Route } from "./+types/home";
import { useContext, useEffect, useState, type JSX } from "react";
import type { GlobalState } from "~/scripts/state";
import {
  defaultTrumpChooserState,
  GlobalStateContext,
  previousPageState,
} from "~/scripts/state";
import { PlayerCountSlide } from "~/components/slides/PlayerCountSlide/PlayerCountSlide";
import { HandSlide } from "~/components/slides/HandSlide/HandSlide";
import { ArrowLeft } from "lucide-react";
import { openTrumpChooser } from "~/scripts/lib/utils";
import { useLocation } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Wizard Wizard — Trump Chooser" },
    { name: "description", content: "Wizard bid probability calculator" },
  ];
}

export default function TrumpChooserInput() {
  const [state, setState] = useState<GlobalState>(defaultTrumpChooserState);

    // This handles when you recover from an error on the trump selector simulation URL parameters
    const location = useLocation();
    useEffect(() => {
      if (!location.state) return;
      setState((prev) => ({
        ...prev,
        page: location.state.page ?? prev.page,
        players: location.state.players ?? prev.players,
        trump: location.state.trump ?? prev.trump,
        hand: location.state.hand ?? prev.hand,
      }));
    }, []);

  return (
    <div className="slide">
      <GlobalStateContext.Provider value={{ state, setState }}>
        <SlideBody />
      </GlobalStateContext.Provider>
      {state.page === 2 ? (
        <a
          className="outline back-button"
          href="/"
        >
          <ArrowLeft />
          Back
        </a>
      ) : (
        <button
          className="outline back-button"
          onClick={() => setState(previousPageState())}
        >
          <ArrowLeft />
          Back
        </button>
      )}

      <p className="page-reminder">Page {state.page} of 3</p>
    </div>
  );
}

function SlideBody() {
  const { state } = useContext(GlobalStateContext);

  switch (state.page) {
    case 2:
      return <PlayerCountSlide />;
    case 3:
      return <HandSlide runButtonText="Run Trump Chooser Simulation" runFunction={() => openTrumpChooser(state)}/>;
  }
}
