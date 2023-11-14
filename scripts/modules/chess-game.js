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
    this.board.initializePieces();

    const resignButton = document.getElementById('resign');
    const drawButton = document.getElementById('draw');
    const newGameButton = document.getElementById('new-game');

    const controller = new AbortController();

    document.addEventListener('gameOver', (e) => {
      this.board.stopClock(true);
      const winner = e.detail.winner;
      const reason = e.detail.reason;
      if (winner === null) {
        const topPlayer = document.querySelector('#top-player');
        const bottomPlayer = document.querySelector('#bottom-player');
        topPlayer.querySelector('.score').textContent = parseFloat(topPlayer.querySelector('.score').textContent) + 0.5;
        bottomPlayer.querySelector('.score').textContent = parseFloat(bottomPlayer.querySelector('.score').textContent) + 0.5;
      } else {
        const winningPlayer = document.querySelector(`[data-player-color="${winner}"]`);
        winningPlayer.querySelector('.score').textContent = parseFloat(winningPlayer.querySelector('.score').textContent) + 1;
      }
      const boardElement = document.getElementById('board').children;
      for (const child of boardElement) {
        child.style.pointerEvents = 'none';
      };

      resignButton.disabled = true;
      drawButton.disabled = true;
      newGameButton.disabled = false;

      if (this.openModal) this.openModal.closeModal();
      this.openModal = new Modal('game-over', winner, reason);
    }, { once: true, signal: controller.signal });

    document.addEventListener('newGame', () => {
      const boardElement = document.getElementById('board').children;
      for (const child of boardElement) {
        child.removeAttribute('style');
      };
      if (this.mode === 'two') {
        drawButton.disabled = false;
      } else {
        newGameButton.disabled = true;
      }
      resignButton.disabled = false;

      controller.abort();
      this.start();
    }, { once: true });

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
      this.computer = new ChessComputer(this.board, this.color === 'black' ? 'white' : 'black');

      drawButton.disabled = true;
      newGameButton.disabled = true;
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

    // Add event listener for turn change
    document.addEventListener('turnChange', (e) => {
      const boardElement = document.getElementById('board').children;
      if (this.mode === 'computer' && e.detail.turn === this.computer.color) {
        for (const child of boardElement) {
          child.style.pointerEvents = 'none';
        };
        this.computer.makeMove();
      } else {
        for (const child of boardElement) {
          child.removeAttribute('style');
        };
      }
    }, { signal: controller.signal });
  }


  /**
   * Handles player resignation.
   */
  resign() {
    // Open the resign modal
    // If the player confirms resignation, update player score (+1 for opponent)
    // End the game by opening the game over modal with the result
    if (this.openModal) this.openModal.closeModal();
    this.openModal = new Modal('resign', this.board.turn === 'white' ? 'black' : 'white');
  }

  /**
   * Handles accepting a draw offer.
   */
  draw() {
    // Open the draw modal
    // If the player confirms draw, update player score (+0.5 for each player)
    // End the game by opening the game over modal with the result
    if (this.openModal) this.openModal.closeModal();
    this.openModal = new Modal('draw');
  }

  /**
   * Handles creating a new game
   */
  newGame() {
    // Open the new game modal
    // If the player confirms, start a new game
    if (this.openModal) this.openModal.closeModal();
    this.openModal = new Modal('new-game');
  }

}