/*
 * Course: SENG 513
 * Date: OCT 23, 2023
 * Assignment 2
 * Name: Jacob Nguyen
 * UCID: 30087465
 */

import { ChessClock } from "./clock";
import { Modal } from "./modal";

/**
 * Represents a chess board and its game logic.
 * @class
 */
export class ChessBoard {
  /**
   * Creates a new instance of ChessBoard.
   */
  constructor(timeControl) {
    // Players object.
    this.players = {
      white: {
        gainedMaterial: {
          pawns: 0,
          rooks: 0,
          knights: 0,
          bishops: 0,
          queens: 0
        },
        materialValueTotal: 0
      },
      black: {
        gainedMaterial: {
          pawns: 0,
          rooks: 0,
          knights: 0,
          bishops: 0,
          queens: 0
        },
        materialValueTotal: 0
      }
    };
    // Current player's turn. White goes first.
    this.turn = "white";

    // Initialize the chessboard and pieces
    // Lowercase letters are black pieces, uppercase letters are white pieces
    this.board = [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
    // Flag for if the game is in check
    this._inCheck = false;
    // Move counter for the 50-move rule
    this._moveCounter = 0;
  }

  /**
   * Gets the current turn.
   * @returns {string} The current turn.
   */
  get turn() {
    return this.turn;
  }

  /**
   * Sets the current turn.
   * @param {string} value - The value to set the turn to.
   * @throws {Error} Invalid turn color.
   */
  set turn(value) {
    if (!(value === "white" || value === "black")) {
      throw new Error("Invalid turn color");
    }
    this.turn = value;
  }

  /**
   * Returns the piece at the given square in chess notation (e.g. 'a1', 'h8')
   * @param {string} square - The square to query in chess notation
   * @returns {string} The piece at the given square
   */
  getPiece(square) {
    const [file, rank] = square.split('');
    const fileIndex = file.charCodeAt(0) - 97;
    const rankIndex = 8 - parseInt(rank);
    return this.board[rankIndex][fileIndex];
  }

  /**
   * Sets the piece at the given square in chess notation (e.g. 'a1', 'h8')
   * @param {string} square - The square to set in chess notation
   * @param {string} piece - The piece to set at the given square
   */
  setPiece(square, piece) {
    const [file, rank] = square.split('');
    const fileIndex = file.charCodeAt(0) - 97;
    const rankIndex = 8 - parseInt(rank);
    this.board[rankIndex][fileIndex] = piece;
  }

  /**
   * Selects a piece and displays its legal moves.
   * @param {string} square - The square to select in chess notation.
   */
  selectPiece(square) {
    // Handle piece selection and display legal moves

    // Check if the King is in check (inCheck flag), if so, only allow the player to move the King
    // Check if the player is moving a piece of the correct color. If not, return
    // Highlight the legal moves for the piece (_highlightLegalMoves())
    // If the player clicks or drops the piece on a legal move, call movePiece()
  }

  /**
   * Captures a piece.
   * @param {string} square - The square to capture in chess notation.
   * @param {string} piece - The piece to capture.
   */
  capturePiece(square, piece) {
    // Handle piece capture

    // Get current piece on square and update player material (_updatePlayerMaterial())
    // Remove piece from board
    // If possible, add animation for captured piece to shrink and move to player material

    // Set piece that was capturing to the square
  }

  /**
   * Moves a piece from one square to another.
   * @param {string} from - The square to move from in chess notation.
   * @param {string} to - The square to move to in chess notation.
   */
  movePiece(from, to) {
    // Move a piece from one square to another

    // After moving the piece, check if the move is a checkmate, stalemate, or the 50th move
    // if not, check if the move is a pawn promotion
    // check if the move puts the opposing king in check. If so, set inCheck to true
    // check if the move is capturing a piece ("to" has an enemy piece). If so, call capturePiece()

    // increment move counter if the move is not a pawn move or a capture
  }

  /**
   * Switches to the next player's turn.
   */
  /**
   * Switches the current player turn between white and black.
   * @throws {Error} If there is an error while switching the player turn.
   */
  switchPlayer() {
    try {
      this.turn = this.turn === "white" ? "black" : "white";
    } catch (error) {
      // handle error
    }
  }


  /**
   * Initializes the chess clock for the game.
   * @param {number} timeControl - The time control for the game.
   */
  initializeClock(timeControl) {
    // Create clock instances for each player
    this.whiteClock = new ChessClock("white", timeControl);
    this.blackClock = new ChessClock("black", timeControl);

    // Start the clock for white
    this.whiteClock.start();
  }

  /**
   * Highlights the legal moves for a piece.
   * @param {string} square - The square to select in chess notation.
   * @private
   */
  _highlightLegalMoves(square) {
    // Get piece at square
    this.getPiece(square);

    // Iterate through the possible squares for the piece (diagonals for bishops, etc.)
    // For each, if the move is legal:
    // Check if the piece is moving to a valid square
    // Check if the piece is moving to a square with a friendly piece. Stop iterating past this square (blocked)
    // Check if the piece is moving to a square with an enemy piece.  Stop iterating past this square (blocked)
    // Check if the move is a castling move (_isCastlingMove())
    // Check if the move is an en passant capture (_isEnPassantMove()
    // Check if the piece is moving to a square that is not in its legal moves

    // Highlight the legal moves on the board
  }

  /**
   * Handles pawn promotion.
   * @param {string} square - The square to promote the pawn in chess notation.
   * @private
   */
  _promotePawn(square) {
    // Handle pawn promotion
    // Open promotion modal at square
    // If the player selects a piece, replace the pawn with the selected piece
    // If the player does not select a piece, replace the pawn with a queen
  }

  /**
   * Checks if the game is in checkmate.
   * @returns {boolean} True if the game is in checkmate, false otherwise.
   * @private
   */
  _isCheckmate() {
    // Check if the game is in checkmate
    // i.e. the King is in check and cannot move out of check
  }

  /**
   * Checks if the game is in stalemate.
   * @returns {boolean} True if the game is in stalemate, false otherwise.
   * @private
   */
  _isStalemate() {
    // Check if the game is in stalemate
    // i.e. the King is not in check and cannot move out of check
  }

  /**
   * Checks if the move is an en passant capture.
   * @param {string} from - The square to move from in chess notation.
   * @param {string} to - The square to move to in chess notation.
   * @returns {boolean} True if the move is an en passant capture, false otherwise.
   * @private
   */
  _isEnPassantMove(from, to) {
    // Check if the move is an en passant capture

    // Check if the move is a pawn move
    // Check if the move is a capture move
    // Check if the move is a diagonal move
    // Check if the move is to an empty square
    // Check if the move is to the square behind the pawn
    // Check if the pawn being captured has moved the previous turn
  }


  /**
   * Checks if the move is a castling move.
   * @param {string} from - The starting position of the piece.
   * @param {string} to - The ending position of the piece.
   * @returns {boolean} - Returns true if the move is a castling move, false otherwise.
   * @private
   */
  _isCastlingMove(from, to) {
    // Check if the move is a castling move

    // Check if the king is in check
    // Check if the king will move through check (2 squares on either side)
    // Check if the king or rook has moved
  }

  /**
   * Updates the player's material after a piece has been captured.
   * @param {string} piece - The type of piece that has been captured.
   * @returns {void}
   * @private
   */
  _updatePlayerMaterial(piece) {
    // Material values for each piece
    const materialValues = {
      pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9
    }

    // Update the player's material
    // Add the value of the captured piece to the player's materialValueTotal
    // Get the difference in material, and reflect it in the UI for whoever is up material
  }
}