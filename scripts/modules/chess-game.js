/*
 * Course: SENG 513
 * Date: OCT 23, 2023
 * Assignment 2
 * Name: Jacob Nguyen
 * UCID: 30087465
 */

// imports
import { ChessBoard } from "./chess-board.js";
import { ChessComputer } from "./computer.js";
import { ChessClock } from "./clock.js";
import { Modal } from "./modal.js";

/**
 * Represents a game of chess.
 * @class
 */
export class ChessGame {
  /**
   * Creates a new instance of ChessGame.
   * @constructor
   * @param {string} mode - The game mode (two players or against a computer).
   * @param {Object} timeControl - The time control for the game.
   * @param {string} color - The player's color (e.g. "white", "black").
   */
  constructor(mode, timeControl, color) {
    // Initialize the game based on mode, color, and time control
    this.mode = mode;
    this.timeControl = timeControl;
    this.color = color;
    this.start();
  }

  /**
   * Starts a new game with the specified settings.
   */

  start() {
    this.board = new ChessBoard();

    document.addEventListener('gameOver', (e) => {
      console.log(e.detail.winner, e.detail.reason);
      this.board.stopClock(true);
    });

    // If mode is against computer, initialize the computer player with the board object
    // In a loop, check if the current player is the computer player, and if so, call the makeMove() method
    // Otherwise, wait for the player to make a move

    // Change player names based on game mode
    const topPlayer = document.querySelector('#top-player .name');
    const bottomPlayer = document.querySelector('#bottom-player .name');
    const topClock = document.querySelector('#top-clock');
    const bottomClock = document.querySelector('#bottom-clock');
    if (this.mode === 'two') {
      // Two player mode
      topPlayer.textContent = 'Player 1';
      bottomPlayer.textContent = 'Player 2';
    } else {
      // Computer mode
      topPlayer.textContent = 'Computer';
      bottomPlayer.textContent = 'Player';

      // Initialize the computer player
      this.computer = new ChessComputer(this.board, this.color);
    }

    topPlayer.parentElement.dataset.playerColor = this.color === 'black' ? 'white' : 'black';
    bottomPlayer.parentElement.dataset.playerColor = this.color === 'black' ? 'black' : 'white';
    topClock.dataset.clockColor = this.color === 'black' ? 'white' : 'black';
    bottomClock.dataset.clockColor = this.color === 'black' ? 'black' : 'white';

    // Flip the board on the DOM if the player is black
    const boardElement = document.querySelector('#board');
    if (this.color === 'black') {
      boardElement.classList.add('flipped');
    } else {
      boardElement.classList.remove('flipped');
    }

    this.board.initializeClock(this.timeControl);
  }


  /**
   * Handles player resignation.
   */
  resign() {
    // Open the resign modal
    // If the player confirms resignation, update player score (+1 for opponent)
    // End the game by opening the game over modal with the result
  }

  /**
   * Handles accepting a draw offer.
   */
  draw() {
    // Open the draw modal
    // If the player confirms draw, update player score (+0.5 for each player)
    // End the game by opening the game over modal with the result
  }

  /**
   * Handles creating a new game
   */
  newGame() {
    // Open the new game modal
    // If the player confirms, start a new game
    this.start();
  }

}