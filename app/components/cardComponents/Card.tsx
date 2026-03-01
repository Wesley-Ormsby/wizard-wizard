import "./CardComponents.css";
import {
  rankToRankName,
  rankToSymbol,
  suitLetterToName,
} from "~/scripts/lib/utils";
import { getColour, SuitIcon } from "./cardUtils";
import type { Card as CardType} from "~/scripts/types";
import { memo } from "react";

export interface CardProps {
  card: CardType;
  active: boolean;
  blue?: boolean;
}

export const Card = memo(function Card({ card, active = false, blue = false }: CardProps) {
  const label = `${rankToRankName(card.rank)} of ${suitLetterToName(card.suit)}`;
  return (
    <div
      aria-label={label}
      className={`card ${active ? "active" : ""}`}
    >
      <div className={getColour(card.suit, blue)}>
        {rankToSymbol(card.rank)}
      </div>
      <SuitIcon suit={card.suit} blue={blue}></SuitIcon>
    </div>
  );
})
