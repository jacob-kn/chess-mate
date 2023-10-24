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
  constructor(mode, timeControl, color = "white") {
    // Initialize the game based on mode, color, and time control
    this.mode = mode;
    this.timeControl = timeControl;
    this.color = color;
  }

  /**
   * Starts a new game with the specified settings.
   */
  start() {
    this.board = new ChessBoard();

    // Initialize the clock if time control is enabled
    this.board.initializeClock(this.timeControl);

    // If mode is against computer, initialize the computer player with the board object
    // In a loop, check if the current player is the computer player, and if so, call the makeMove() method
    // Otherwise, wait for the player to make a move
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