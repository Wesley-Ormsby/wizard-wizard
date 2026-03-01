import { Nav } from "~/components/Nav/Nav";
import { generateRandomState } from "~/scripts/state";
import { openSimulation } from "~/scripts/lib/utils";

export function NotFound() {
  return (
    <>
    <Nav></Nav>
      <main className="not-found">
        <div className="slide">
          <h1>404</h1>
          <p>Page not found.</p>
          <div className="button-group">
            <button className="default" onClick={() => window.open("/", "_self")}>
              Home
            </button>
            <button
              className="outline"
              onClick={() => openSimulation(generateRandomState())}
            >
              Random Simulation
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
