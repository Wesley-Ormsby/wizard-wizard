import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { Nav } from "./components/Nav/Nav";
import { NotFound } from "./routes/notFound";

export const links: Route.LinksFunction = () => [];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          name="description"
          content="The Wizard Wizard is a bid calculator for the trick tacking game Wizard."
        />
        <meta
          name="keywords"
          content="Wizard, Bid, Trick, Trick-taking, Simulation"
        />
        <meta name="author" content="Wesley Ormsby" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        <link rel="mask-icon" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#0a0a0a" />
        <meta name="theme-color" content="#f0b100" />

        <meta property="og:url" content="https://wizard-wizard.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="The Wizard Wizard" />
        <meta property="og:image" content="/example-img.png" />
        <meta
          property="og:image:alt"
          content="An example hand simulation result showcasing success rate and expected values of each potential bid."
        />
        <meta
          property="og:description"
          content="The Wizard Wizard is a bid calculator for the trick tacking game Wizard."
        />
        <meta property="og:site_name" content="The Wizard Wizard" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://wizard-wizard.vercel.app/" />
        <meta name="twitter:title" content="The Wizard Wizard" />
        <meta
          name="twitter:description"
          content="The Wizard Wizard is a bid calculator for the trick tacking game Wizard."
        />
        <meta name="twitter:image" content="/example-img.png" />
        <meta
          name="twitter:image:alt"
          content="An example hand simulation result showcasing success rate and expected values of each potential bid."
        />

        {/* To avoid the light mode / dark mode flicker on page change */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  const t = localStorage.getItem('theme');
  if (t === 'light') document.documentElement.classList.add('light');
})();
`,
          }}
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Nav></Nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export function meta() {
  return [{ title: "Wizard Wizard — 404" }];
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <Layout>
          <NotFound></NotFound>
      </Layout>
    );
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    return (
      <main>
        <h1>{error.message}</h1>
        <p>An unexpected error occurred</p>
        {error.stack && (
          <pre>
            <code>{error.stack}</code>
          </pre>
        )}
      </main>
    );
  }
}
