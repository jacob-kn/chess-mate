/*
 * Course: SENG 513
 * Date: OCT 23, 2023
 * Assignment 2
 * Name: Jacob Nguyen
 * UCID: 30087465
 */

import { ChessGame } from "./modules/chess-game.js";

// This file contains the javascript for the play.html page.

(() => {
  // Create a new ChessGame object from the settings
  const { mode, timeControl, color } = getGameSettings();
  const game = new ChessGame(mode, timeControl, color);

  document.querySelectorAll('.piece').forEach((piece) => {
    piece.addEventListener('mousedown', (e) => game.board.selectPiece(e));
  });

  // Handle resign, draw, and new game buttons
  document.getElementById('resign').addEventListener('click', () => {
    game.resign();
  });
  document.getElementById('draw').addEventListener('click', () => {
    game.draw();
  });
  document.getElementById('new-game').addEventListener('click', () => {
    game.newGame();
  });

  function getGameSettings() {
    const gameType = localStorage.getItem("gameType");
    const timeControlEnabled = localStorage.getItem("timeControl") === "true";
    const minutesPerSide = parseInt(localStorage.getItem("minutesPerSide"));
    const incrementSeconds = parseInt(localStorage.getItem("incrementSeconds"));
    let color = localStorage.getItem("colorChoice");

    if (color === 'random') {
      const random = Math.random();
      color = random < 0.5 ? 'white' : 'black';
    }

    const timeControl = timeControlEnabled ? { minutes: minutesPerSide, increment: incrementSeconds } : { none: true };

    return { mode: gameType, timeControl, color };
  }

})();