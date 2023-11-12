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
   * @param {Object} timeControl - The time control for the game.
   * @param {number} timeControl.minutes - The time control in minutes.
   * @param {number} timeControl.increment - The time increment in seconds.
   */
  constructor(playerColor, timeControl) {
    this.playerColor = playerColor;
    this.timeControl = timeControl;
    this.clockElement = document.querySelector(`.clock[data-clock-color="${playerColor}"]`);
    this.clockElement.removeAttribute('style');
    if (timeControl.none) {
      this._initializeTurns();
    } else {
      this._initializeTimeControl();
    }

  }

  /**
   * Initializes the time control by setting the initial time left and creating the clock element.
   * @private
   */
  _initializeTimeControl() {
    this.timeLeft = this.timeControl.minutes * 60;
    this.intervalId = null;
    const div = document.createElement('div');
    this.iconElement = document.createElement('i');
    this.iconElement.classList.add('fa-regular', 'fa-clock', 'fa-xs');
    this.timeElement = document.createElement('span');
    div.appendChild(this.iconElement);
    div.appendChild(this.timeElement);
    this.clockElement.appendChild(div);
    this.updateClock();
  }

  /**
   * Initializes the clock element with turn text.
   * @private
   */
  _initializeTurns() {
    this.clockElement.textContent = this.playerColor === 'white' ? 'White to move' : 'Black to move';
    this.clockElement.style.whiteSpace = 'normal';
    this.clockElement.style.opacity = 0;
  }

  /**
   * Starts the clock.
   */
  start() {
    if (this.timeControl.none) {
      this.clockElement.style.opacity = 1;
      return;
    }
    this.clockElement.dataset.clockTurn = true;
    this.iconElement.classList.add('fa-fade');
    this.intervalId = setInterval(() => {
      this.timeLeft--;
      this.updateClock();
      if (this.timeLeft <= 30) {
        this.clockElement.classList.add('fa-fade');
      }
      if (this.timeLeft <= 0) {
        this.stop(true);
        // Signal to end the game
        document.dispatchEvent(new CustomEvent('gameOver', {
          detail: {
            winner: this.playerColor === 'white' ? 'black' : 'white',
            reason: 'time'
          }
        }));
      }
    }, 1000);
  }

  /**
   * Stops the clock.
   */
  stop(end = false) {
    if (this.timeControl.none) {
      this.clockElement.style.opacity = 0;
      return;
    }
    clearInterval(this.intervalId);
    this.clockElement.dataset.clockTurn = false;
    this.iconElement.classList.remove('fa-fade');
    this.clockElement.classList.remove('fa-fade');
    if (!end) {
      this.timeLeft += this.timeControl.increment;
    }
    this.updateClock();
  }

  /**
   * Updates the clock display.
   */
  updateClock() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}