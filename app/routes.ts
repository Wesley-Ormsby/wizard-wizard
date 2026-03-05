import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/simulation", "./routes/simulation.tsx"),
  route("/trump-chooser", "./routes/trumpChooserInput.tsx"),
  route("/trump-chooser/simulation", "./routes/trumpChooserSimulation.tsx"),
] satisfies RouteConfig;
