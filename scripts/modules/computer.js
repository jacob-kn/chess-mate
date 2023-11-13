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
    if (this.color === 'white') {
      // If white, start the game with a move
      this.makeMove();
    }
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
    // Psuedocode from https://en.wikipedia.org/wiki/Minimax#Pseudocode
    if (depth === 0) {
      return this._evaluateBoard(node);
    }

    let bestValue;
    if (maximizingPlayer) {
      bestValue = -Infinity;
      for (let move of node.getAllLegalMoves(this.color)) {
        let childNode = node.clone();
        childNode.falseMove(move.from, move.to);
        let value = this._minimax(childNode, depth - 1, alpha, beta, false);
        bestValue = Math.max(bestValue, value);
        alpha = Math.max(alpha, bestValue);
        if (beta <= alpha) {
          break;
        }
      }
    } else {
      bestValue = Infinity;
      for (let move of node.getAllLegalMoves(this.color === 'white' ? 'black' : 'white')) {
        let childNode = node.clone();
        childNode.falseMove(move.from, move.to);
        let value = this._minimax(childNode, depth - 1, alpha, beta, true);
        bestValue = Math.min(bestValue, value);
        beta = Math.min(beta, bestValue);
        if (beta <= alpha) {
          break;
        }
      }
    }
    return bestValue;
  }

  makeMove() {
    return new Promise((resolve) => {
      let bestMove;
      let bestValue = -Infinity;
      for (let move of this.board.getAllLegalMoves(this.color)) {
        let childNode = this.board.clone();
        childNode.falseMove(move.from, move.to);
        let value = this._minimax(childNode, 3, -Infinity, Infinity, false);
        if (value > bestValue) {
          bestValue = value;
          bestMove = move;
        }
      }
      resolve(bestMove);
    }).then((bestMove) => {
      this.board.animateMove(bestMove.from, bestMove.to);
    });
  }

  /**
   * Evaluates the current state of the board and returns a heuristic value.
   * @private
   * @param {Board} node - The current state of the board.
   * @returns {number} The heuristic value of the board.
   */
  _evaluateBoard(node) {
    const pieceValues = {
      'p': 1,
      'n': 3,
      'b': 3,
      'r': 5,
      'q': 9,
      'k': 100 // we don't want the king to be captured, so we give it a high value
    };

    let score = 0;

    // loop through all squares on the board
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = node.board[i][j];
        if (piece !== ' ') {
          const pieceColor = piece === piece.toUpperCase() ? 'white' : 'black';
          const value = pieceValues[piece.toLowerCase()];
          const sign = pieceColor === this.color ? 1 : -1;
          score += value * sign;
        }
      }
    }

    return score;
  }
}