/*
 * Course: SENG 513
 * Date: OCT 23, 2023
 * Assignment 2
 * Name: Jacob Nguyen
 * UCID: 30087465
 */

/**
 * Represents a chess clock for a player.
 * @class
 */
export class ChessClock {
  /**
   * Creates a new instance of ChessClock.
   * @constructor
   * @param {string} playerColor - The color of the player for whom the clock is being initialized.
   * @param {number} timeControl - The time control for the game.
   */
  constructor(playerColor, timeControl) {
    // Initialize the clock for a player
  }

  /**
   * Starts the clock.
   */
  start() {
    // Start the clock
    // set data-clock-turn to true for the player whose turn it is
    // add fa-fade animation to the clock

    // When time is running low, add fa-pulse animation and change icon to red to the clock
    // If the clock reaches 0, stop the clock and end the game
  }

  /**
   * Stops the clock.
   */
  stop() {
    // Stop the clock
    // set data-clock-turn to false for the player whose turn it is
    // remove fa-fade animation to the clock
  }
}