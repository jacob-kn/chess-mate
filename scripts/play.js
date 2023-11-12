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
  // Query the DOM for the game settings and create a new ChessGame object

  // Example settings:
  const timeControl = { minutes: 5, increment: 2 };
  const game = new ChessGame("two", timeControl, "white");

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
})();