import type { Suit } from "~/scripts/types";
import { Heart, Diamond, Spade, Club, Star } from "lucide-react";

const colourMap = {
    H: "red",
    D: "red",
    C: "black",
    S: "black",
  };

export function getColour(suit: Suit, isBlue: boolean) {
  return isBlue ? "blue" : colourMap[suit];
}

const suitToSVGMap = {
    H: Heart,
    D: Diamond,
    S: Spade,
    C: Club
}

export function SuitIcon({ suit, blue }: { suit: Suit; blue: boolean }) {
  const colour = getColour(suit, blue);

  if (blue) return <Star color={colour} fill={colour}></Star>;

  const Icon = suitToSVGMap[suit];
  return <Icon color={colour} fill={colour}></Icon>;
}