import { useNavigate } from "react-router";
import type { ValidateSearchParamsReturn } from "~/scripts/lib/searchParams";

export function SimulationError({
  searchParamData,
}: {
  searchParamData: ValidateSearchParamsReturn;
}) {
  const navigate = useNavigate();
  function recoverErrorState() {
    navigate("/", {
      state: {
        page: searchParamData.recoverablePage,
        players: searchParamData.players,
        position: searchParamData.position,
        trump: searchParamData.trump,
        hand: searchParamData.hand,
      },
    });
  }

  return (
    <section className="slide simulation-page">
      <h1>Something went wrong</h1>
      {searchParamData.messages.map((msg, i) => (
        <p
          key={i}
          className="error-msg"
          dangerouslySetInnerHTML={{ __html: msg }}
        ></p>
      ))}
      <button className="default recovery-button" onClick={recoverErrorState}>
        Recover input and try again
      </button>
    </section>
  );
}
