/*
 * Course: SENG 513
 * Date: OCT 23, 2023
 * Assignment 2
 * Name: Jacob Nguyen
 * UCID: 30087465
 */

/**
 * Represents a modal that can be opened and closed.
 * @class
 */
export class Modal {
  /**
   * Creates a new instance of the Modal class.
   */
  constructor() {
    // Initialize modals for resign, draw, promotion, etc.
    this.gameOverModal = document.getElementById("game-over-modal");
    this.resignModal = document.getElementById("resign-modal");
    this.drawModal = document.getElementById("draw-modal");
    this.newGameModal = document.getElementById("new-game-modal");
    this.promotionModal = document.getElementById("promotion-modal");
  }

  /**
   * Opens the specified modal.
   * @param {string} modalType - The type of modal to open.
   * @param {string} winner - The winner of the game (if applicable).
   */
  openModal(modalType, winner) {
    // Open the specified modal
    // switch (modalType) {
    //     case "gameOver":

    //         break;
    //     case "resign":

    //         break;
    //     case "draw":

    //         break;
    //     case "newGame":

    //         break;
    //     case "promotion":

    //         break;
    //     default:
    //         console.error("Invalid modal type");
    // }
  }

  /**
   * Closes the specified modal.
   * @param {string} modalType - The type of modal to close.
   */
  closeModal(modalType) {
    // Close the specified modal

    // switch (modalType) {
    //     case "gameOver":

    //         break;
    //     case "resign":

    //         break;
    //     case "draw":

    //         break;
    //     case "newGame":

    //         break;
    //     case "promotion":

    //         break;
    //     default:
    //         console.error("Invalid modal type");
    // }
  }
}