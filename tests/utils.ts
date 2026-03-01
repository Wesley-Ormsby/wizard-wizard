import {
  SUITS,
  type Card,
  type ExtendedRank,
  type Suit,
} from "~/scripts/types";

export function newCard(rank: ExtendedRank, suit: Suit): Card {
  return { suit, rank };
}

export function newCardList(...cardStrList: string[]): Card[] {
  const cardStr = cardStrList.join("");
  let list: Card[] = [];
  let i = 0;
  while (i < cardStr.length) {
    let rank: ExtendedRank = "J";
    let rankChar = cardStr[i++];
    if (rankChar === "J" || rankChar === "W") {
      rank = rankChar;
    } else if (rankChar >= "0" && rankChar <= "9") {
      let rankStr = rankChar;
      if (i >= cardStr.length) {
        rank = Number(rankChar) as ExtendedRank;
      } else {
        let nextChar = cardStr[i];
        if (nextChar >= "0" && nextChar <= "9") {
          rank = Number(rankStr + nextChar) as ExtendedRank;
          i += 1;
        } else {
          rank = Number(rankStr) as ExtendedRank;
        }
      }
    } else {
      throw new Error(`Invalid newCardList string "${cardStr}".`)
    }
    if (i >= cardStr.length) return []
    let suitChar = cardStr[i++];
    if ((SUITS as Readonly<string[]>).includes(suitChar)) {
      list.push(newCard(rank, suitChar as Suit))
    } else {
      throw new Error(`Invalid newCardList string "${cardStr}".`)
    }
  }
  return list;
}

export function makePlayerHands(...handStrs: string[]): Card[][] {
    return handStrs.map(str => newCardList(str));
}