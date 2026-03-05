import { Progress } from "../Progress/Progress";

export function SimulationLoading({progress}: {progress:number}) {
        return (
      <section className="slide">
        <h1>Running simulation...</h1>
        <p>Please wait a moment.</p>
        <Progress value={progress}/>
      </section>
    ); 
}