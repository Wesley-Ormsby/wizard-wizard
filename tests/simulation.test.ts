import {
  cardMatch,
  getBidsAsPercentages,
  getExpectedBidPoints,
  isWinner,
  makeDeck,
  playRound,
  playTrick,
} from "~/scripts/lib/simulation/simulation";
import { makePlayerHands, newCard, newCardList } from "./utils";

describe("cardMatch", () => {
  test("Same suit, same rank", () => {
    expect(cardMatch(newCard(1, "C"), 1, "C")).toBe(true);
  });
  test("Same suit, different rank", () => {
    expect(cardMatch(newCard(1, "C"), 2, "C")).toBe(false);
  });
  test("Different suit, same rank", () => {
    expect(cardMatch(newCard(1, "C"), 1, "H")).toBe(false);
  });
  test("Different suit, different rank", () => {
    expect(cardMatch(newCard(1, "C"), 4, "D")).toBe(false);
  });
});

describe("isWinner", () => {
  test("Winning card is a Wizard", () => {
    expect(isWinner(newCard("W", "C"), newCard("W", "C"), null)).toBe(false);
  });
  test("Winning card is a Jester", () => {
    expect(isWinner(newCard(1, "C"), newCard("J", "C"), null)).toBe(true);
    expect(isWinner(newCard("J", "C"), newCard("J", "C"), null)).toBe(false);
  });
  test("Played card is a Wizard and no Wizard was played this round", () => {
    expect(isWinner(newCard("W", "C"), newCard(1, "S"), null)).toBe(true);
  });
  test("Played card is a Jester and the winning card is not a Jester", () => {
    expect(isWinner(newCard("J", "C"), newCard(1, "S"), null)).toBe(false);
  });
  test("No trump played, highest card wins if it follows the winning suit", () => {
    // Same suits
    expect(isWinner(newCard(2, "C"), newCard(3, "C"), null)).toBe(false);
    expect(isWinner(newCard(2, "C"), newCard(3, "C"), newCard("J", "C"))).toBe(
      false,
    );
    expect(isWinner(newCard(3, "C"), newCard(2, "C"), null)).toBe(true);
    expect(isWinner(newCard(3, "C"), newCard(2, "C"), newCard("J", "C"))).toBe(
      true,
    );
    expect(isWinner(newCard(3, "C"), newCard(2, "C"), newCard(1, "S"))).toBe(
      true,
    );
    expect(isWinner(newCard(2, "C"), newCard(3, "C"), newCard(1, "S"))).toBe(
      false,
    );
    // Off suits
    expect(isWinner(newCard(10, "S"), newCard(3, "C"), null)).toBe(false);
    expect(isWinner(newCard(10, "S"), newCard(3, "C"), newCard("J", "C"))).toBe(
      false,
    );
    expect(isWinner(newCard(10, "D"), newCard(3, "C"), newCard(1, "S"))).toBe(
      false,
    );
    // Ace High
    expect(isWinner(newCard(1, "C"), newCard(13, "C"), null)).toBe(true);
    expect(isWinner(newCard(13, "C"), newCard(1, "C"), null)).toBe(false);
  });
  test("Winning card is trump, so played card needs to be a higher trump", () => {
    expect(isWinner(newCard(5, "C"), newCard(4, "C"), newCard("W", "C"))).toBe(
      true,
    );
    expect(isWinner(newCard(1, "C"), newCard(4, "C"), newCard("W", "C"))).toBe(
      true,
    );
    expect(isWinner(newCard(4, "C"), newCard(1, "C"), newCard("W", "C"))).toBe(
      false,
    );
    expect(isWinner(newCard(3, "C"), newCard(4, "C"), newCard("W", "C"))).toBe(
      false,
    );
    expect(isWinner(newCard(5, "S"), newCard(4, "C"), newCard("W", "C"))).toBe(
      false,
    );
  });
  test("Player trumps non-Wizard, non-trump", () => {
    expect(isWinner(newCard(1, "C"), newCard(10, "S"), newCard("W", "C"))).toBe(
      true,
    );
  });
});

describe("makeDeck", () => {
  test("Make full deck", () => {
    expect(makeDeck([])).toEqual(
      newCardList(
        "1H2H3H4H5H6H7H8H9H10H11H12H13HJHWH1C2C3C4C5C6C7C8C9C10C11C12C13CJCWC1D2D3D4D5D6D7D8D9D10D11D12D13DJDWD1S2S3S4S5S6S7S8S9S10S11S12S13SJSWS",
      ),
    );
  });
  test("Make deck while ignoring cards", () => {
    expect(makeDeck(newCardList("WH10H1H10D6SJC"))).toEqual(
      newCardList(
        "2H3H4H5H6H7H8H9H11H12H13HJH1C2C3C4C5C6C7C8C9C10C11C12C13CWC1D2D3D4D5D6D7D8D9D11D12D13DJDWD1S2S3S4S5S7S8S9S10S11S12S13SJSWS",
      ),
    );
  });
});

describe("playTrick", () => {
  test("Lead Jester followed by all Jesters", () => {
    expect(
      playTrick(
        null, // Trump
        3, // Players
        0, // Who starts
        makePlayerHands("1HJS", "2HJC", "WHJD"),
      ),
    ).toBe(0);
    expect(
      playTrick(
        null, // Trump
        3, // Players
        1, // Who starts
        makePlayerHands("1HJS", "2HJC", "WHJD"),
      ),
    ).toBe(1);
  });
  test("Lead Jester followed a Jester, then some more cards", () => {
    expect(
      playTrick(
        null, // Trump
        4, // Players
        0, // Who starts
        makePlayerHands("1HJS", "2HJC", "WH4S", "1S2H"),
      ),
    ).toBe(3);
    expect(
      playTrick(
        null, // Trump
        4, // Players
        0, // Who starts
        makePlayerHands("1HJS", "2HJC", "WH4S", "7S2S"),
      ),
    ).toBe(2);
    expect(
      playTrick(
        newCard(1, "S"), // Trump
        4, // Players
        0, // Who starts
        makePlayerHands("1HJS", "2HJC", "WH1H", "7S2S"),
      ),
    ).toBe(3);
  });
  test("Lead Jester followed by a Wizard", () => {
    expect(
      playTrick(
        null, // Trump
        3, // Players
        0, // Who starts
        makePlayerHands("1HJS", "2HWC", "WHJD"),
      ),
    ).toBe(1);
  });
  test("Lead Jester followed by a regular card", () => {
    expect(
      playTrick(
        null, // Trump
        3, // Players
        0, // Who starts
        makePlayerHands("1HJS", "2H2H", "3H7C"),
      ),
    ).toBe(2);
    expect(
      playTrick(
        null, // Trump
        4, // Players
        0, // Who starts
        makePlayerHands("1HJS", "2H2H", "3HWC", "3H7C"),
      ),
    ).toBe(2);
    expect(
      playTrick(
        newCard("W", "S"), // Trump
        4, // Players
        0, // Who starts
        makePlayerHands("1HJS", "2H2H", "3H2S", "3H7S"),
      ),
    ).toBe(2);
  });
  test("Lead Wizard", () => {
    expect(
      playTrick(
        newCard(1, "S"), // Trump
        3, // Players
        0, // Who starts
        makePlayerHands("1HWC", "2H10S", "WHWD"),
      ),
    ).toBe(0);
  });
  test("Lead regular card", () => {
    expect(
      playTrick(
        newCard(1, "S"), // Trump
        3, // Players
        0, // Who starts
        makePlayerHands("1H3H", "2H10S", "10HJS"),
      ),
    ).toBe(0);
    expect(
      playTrick(
        newCard(1, "S"), // Trump
        3, // Players
        0, // Who starts
        makePlayerHands("1H3H", "2HWD", "10HJS"),
      ),
    ).toBe(1);
    expect(
      playTrick(
        newCard(1, "S"), // Trump
        3, // Players
        0, // Who starts
        makePlayerHands("1H3H", "2H1S", "2S4D"),
      ),
    ).toBe(0);
    expect(
      playTrick(
        newCard("J", "S"), // Trump
        3, // Players
        0, // Who starts
        makePlayerHands("1H2H", "3H4C", "5H"),
      ),
    ).toBe(2);
  });
});

describe("playRound", () => {
  
  test("Sample Round", () => {
    expect(
      playRound(
        newCard(2, "C"), // Trump
        4, // Players
        1, // User's position
        newCardList("5CJH4C12D10C"), // Hand
        // Deck to make player's hands
        // It should look like newCardList(NPC1, NPC2, NPC3, Rest of the deck)
        newCardList("2SWC8H8SJS", "9H11D11SWS13H", "3H10SJD1CWD"),
      ),
    ).toBe(1);
  });
  
  test("Sample Round 2", () => {
    expect(
      playRound(
        null, // Trump
        6, // Players
        0, // User's position
        newCardList("1DWC1C5D11H10C3S12S13DWD"), // Hand
        newCardList(
          "13CJS8C9D8H6C2C2S7S4S",
          "6SWHWS9SJC6H10S4H5C5H",
          "6D12H9C4C1H11D13H7D3H8D",
          "8S12D7H10H2H13S1S3D2D7C",
          "4D10DJH9H3C12CJD11S11C5S",
        ),
      ),
    ).toBe(3);
    expect(
      playRound(
        null, // Trump
        6, // Players
        1, // User's position
        newCardList("13CJS8C9D8H6C2C2S7S4S"), // Hand
        newCardList(
          "1DWC1C5D11H10C3S12S13DWD",
          "6SWHWS9SJC6H10S4H5C5H",
          "6D12H9C4C1H11D13H7D3H8D",
          "8S12D7H10H2H13S1S3D2D7C",
          "4D10DJH9H3C12CJD11S11C5S",
        ),
      ),
    ).toBe(0);
    expect(
      playRound(
        null, // Trump
        6, // Players
        2, // User's position
        newCardList("6SWHWS9SJC6H10S4H5C5H"), // Hand
        newCardList(
          "1DWC1C5D11H10C3S12S13DWD",
          "13CJS8C9D8H6C2C2S7S4S",
          "6D12H9C4C1H11D13H7D3H8D",
          "8S12D7H10H2H13S1S3D2D7C",
          "4D10DJH9H3C12CJD11S11C5S",
        ),
      ),
    ).toBe(3);
    expect(
      playRound(
        null, // Trump
        6, // Players
        3, // User's position
        newCardList("6D12H9C4C1H11D13H7D3H8D"), // Hand
        newCardList(
          "1DWC1C5D11H10C3S12S13DWD",
          "13CJS8C9D8H6C2C2S7S4S",
          "6SWHWS9SJC6H10S4H5C5H",
          "8S12D7H10H2H13S1S3D2D7C",
          "4D10DJH9H3C12CJD11S11C5S",
        ),
      ),
    ).toBe(3);
    expect(
      playRound(
        null, // Trump
        6, // Players
        4, // User's position
        newCardList("8S12D7H10H2H13S1S3D2D7C"), // Hand
        newCardList(
          "1DWC1C5D11H10C3S12S13DWD",
          "13CJS8C9D8H6C2C2S7S4S",
          "6SWHWS9SJC6H10S4H5C5H",
          "6D12H9C4C1H11D13H7D3H8D",
          "4D10DJH9H3C12CJD11S11C5S",
        ),
      ),
    ).toBe(1);
    expect(
      playRound(
        null, // Trump
        6, // Players
        5, // User's position
        newCardList("4D10DJH9H3C12CJD11S11C5S"), // Hand
        newCardList(
          "1DWC1C5D11H10C3S12S13DWD",
          "13CJS8C9D8H6C2C2S7S4S",
          "6SWHWS9SJC6H10S4H5C5H",
          "6D12H9C4C1H11D13H7D3H8D",
          "8S12D7H10H2H13S1S3D2D7C",
        ),
      ),
    ).toBe(0);
  });
});


describe("Result Statistics", () => {
  test("getBidsAsPercentages", () => {
    expect(getBidsAsPercentages({0:2, 1:4,2:2,3:1,5:1}, 10)).toEqual({
      0: 0.2,
      1: 0.4,
      2: 0.2,
      3: 0.1,
      5: 0.1,
    });
    expect(getBidsAsPercentages({0:2},2)).toEqual({
      0: 1,
    });
  });
  test("getExpectedBidPoints", () => {
    expect(getExpectedBidPoints({
      0: 0.2,
      1: 0.4,
      2: 0.2,
      3: 0.1,
      5: 0.1,
    })).toEqual({
      0: -12,
      1: 2,
      2: -4,
      3: -13,
      5: -27,
    });
  });
});