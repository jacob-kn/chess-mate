/*
 * Course: SENG 513
 * Date: OCT 23, 2023
 * Assignment 2
 * Name: Jacob Nguyen
 * UCID: 30087465
 */

/**
 * Represents a chess computer player.
 * @class
 */
export class ChessComputer {
  /**
   * Creates a new instance of ChessComputer.
   * @constructor
   * @param {Board} board - The chess board.
   * @param {string} color - The color of the computer player.
   */
  constructor(board, color) {
    // Initialize the computer player
    this.board = board;
    this.color = color;
  }

  /**
   * Determines the "best" move for the computer player using the minimax algorithm with alpha-beta pruning.
   */
  makeMove() {
    // Call the minimax algorithm with alpha-beta pruning to determine "best" move
    // Make move by calling board.movePiece()
  }

  /**
   * The minimax algorithm with alpha-beta pruning.
   * @private
   * @param {Node} node - The current node in the game tree.
   * @param {number} depth - The current depth of the game tree.
   * @param {number} alpha - The alpha value for alpha-beta pruning.
   * @param {number} beta - The beta value for alpha-beta pruning.
   * @param {boolean} maximizingPlayer - Whether the current player is maximizing or minimizing.
   * @returns {number} The heuristic value of the node.
   */
  _minimax(node, depth, alpha, beta, maximizingPlayer) {
    // Psuedocode from https://en.wikipedia.org/wiki/Minimax
    // if (depth == 0 || node is a terminal node) {
    //     return the heuristic value of node
    // }

    // if (maximizingPlayer) {
    //     value = -infinity
    //     for each child of node {
    //         value = max(value, minimax(child, depth - 1, alpha, beta, false))
    //         alpha = max(alpha, value)
    //         if (beta <= alpha) {
    //             break
    //         }
    //     }
    //     return value
    // } else {
    //     value = infinity
    //     for each child of node {
    //         value = min(value, minimax(child, depth - 1, alpha, beta, true))
    //         beta = min(beta, value)
    //         if (beta <= alpha) {
    //             break
    //         }
    //     }
    //     return value
    // }
  }
}