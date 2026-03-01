import "./CardComponents.css";
import type { Card } from "~/scripts/types";
import {
  rankToRankName,
  rankToSymbol,
  suitLetterToName,
} from "~/scripts/lib/utils";
import { getColour, SuitIcon } from "./cardUtils";
import { memo } from "react";

interface CardProps {
  card: Card;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  blue?: boolean;
}
export const CardButton = memo(function CardButton({
  card,
  active,
  onClick,
  disabled = false,
  blue = false,
}: CardProps) {
  const label = `${rankToRankName(card.rank)} of ${suitLetterToName(card.suit)}`;
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={`card ${active ? "active" : ""} ignoreButtonStyles`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className={getColour(card.suit, blue)}>
        {rankToSymbol(card.rank)}
      </div>
      <SuitIcon suit={card.suit} blue={blue}></SuitIcon>
    </button>
  );
})
