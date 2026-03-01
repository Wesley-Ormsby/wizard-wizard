import { Github, SunMoon } from "lucide-react";
import "./Nav.css";
import { useTheme } from "~/scripts/useTheme";
import { Logo } from "./Logo";

export function Nav() {
  const { toggle } = useTheme();
  return (
    <nav>
      <a href="/" aria-label="Go to homepage">
        <Logo></Logo>
        The Wizard Wizard
      </a>

      <div className="button-group">
        <button
          className="svg-button"
          aria-label="Toggle theme"
          onClick={toggle}
        >
          <SunMoon aria-hidden />
        </button>
        <a
          href=""
          target="_blank"
          className="svg-button"
          aria-label="View project on GitHub"
        >
          <Github aria-hidden />
        </a>
      </div>
    </nav>
  );
}
