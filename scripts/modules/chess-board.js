/*
 * Course: SENG 513
 * Date: OCT 23, 2023
 * Assignment 2
 * Name: Jacob Nguyen
 * UCID: 30087465
 */

import { ChessClock } from "./clock.js";
import { Modal } from "./modal.js";

/**
 * Represents a chess board and its game logic.
 * @class
 */
export class ChessBoard {
  // Current player's turn. White goes first.
  turn = 'white';
  /**
   * Creates a new instance of ChessBoard.
   */
  constructor() {
    // Players object.
    this.players = {
      white: {
        gainedMaterial: {
          pawn: 0,
          rook: 0,
          knight: 0,
          bishop: 0,
          queen: 0
        },
        materialValueTotal: 0
      },
      black: {
        gainedMaterial: {
          pawn: 0,
          rook: 0,
          knight: 0,
          bishop: 0,
          queen: 0
        },
        materialValueTotal: 0
      }
    };

    // The chessboard element from the DOM
    this.boardElement = document.getElementById('board');

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
    // Move counter for the 50-move rule
    this._moveCounter = 0;
    // Keep track of king position for checks
    this._kingPosition = { white: 'e1', black: 'e8' }
    // Keep track of check info
    this._checkInfo = { checks: [], pins: [], blockSquares: [] };
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
    if (!(value === 'white' || value === 'black')) {
      throw new Error("Invalid turn color");
    }
    this.turn = value;
  }


  /**
   * Returns the piece type and color of the piece at the given square.
   * @param {string} square - The square to get the piece from, in the format of a file and rank (e.g. "a1").
   * @returns {Object} An object containing the piece type and color, or null if there is no piece at the given square.
   */
  getPiece(square) {
    const [file, rank] = square.split('');
    const fileIndex = file.charCodeAt(0) - 97;
    const rankIndex = 8 - parseInt(rank);

    const pieceType = this.board[rankIndex][fileIndex];
    if (pieceType === ' ') {
      return null;
    } else {
      const color = pieceType === pieceType.toLowerCase() ? 'black' : 'white';
      return { pieceType, color };
    }
  }

  /**
   * Returns an array of all the pieces of the given color on the board.
   * @param {string} color - The color of the pieces to retrieve.
   * @returns {Array} An array of all the pieces of the given color on the board.
   */
  getPiecesByColor(color) {
    const pieces = [];
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = this.getPiece(String.fromCharCode(file + 97) + (8 - rank));
        if (piece && piece.color === color) {
          pieces.push({ pieceType: piece.pieceType, square: String.fromCharCode(file + 97) + (8 - rank) });
        }
      }
    }
    return pieces;
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
   * @param {string} e - The event object.
   */
  selectPiece(e) {
    // Handle piece selection and display legal moves
    let selectedPiece = e.target;

    const square = selectedPiece.classList[2]; // square in chess notation
    const piece = this.getPiece(square); // piece at square

    // if the player is moving a piece of the incorrect color, do not allow player to move
    if (!(piece.color !== this.turn)) {
      this._highlightLegalMoves(square);
      // Highlight square at selected piece
      this._highlightSquare(square);
    }

    // Allow cursor to pass through the piece while dragging
    selectedPiece.style.pointerEvents = 'none';
    selectedPiece.style.zIndex = 1000;
    this.boardElement.style.cursor = 'grabbing';

    const boundDrag = drag.bind(this);
    const boundDragEnd = dragEnd.bind(this);
    const boundClick = click.bind(this);
    // Even listeners for dragging and dropping the piece
    window.addEventListener('mousemove', boundDrag);
    window.addEventListener('mouseup', boundDragEnd);

    // On drag, move the piece with the cursor
    function drag(e) {
      if (selectedPiece === null) {
        return;
      }

      e.preventDefault();
      const boardRect = this.boardElement.getBoundingClientRect(); // position of the board
      const pieceWidth = selectedPiece.offsetWidth;
      const pieceHeight = selectedPiece.offsetHeight;
      const boardWidth = this.boardElement.offsetWidth;
      const boardHeight = this.boardElement.offsetHeight;

      // Get the current position of the piece
      let currentX = e.clientX - boardRect.left - pieceWidth / 2;
      let currentY = e.clientY - boardRect.top - pieceHeight / 2;

      // Bound piece to board
      currentX = Math.min(Math.max(currentX, -pieceWidth / 2), boardWidth - pieceWidth / 2);
      currentY = Math.min(Math.max(currentY, -pieceHeight / 2), boardHeight - pieceHeight / 2);

      // Move the piece
      selectedPiece.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    }

    // On drop, move the piece to the new square
    function dragEnd(e) {
      if (selectedPiece === null) {
        return;
      }

      selectedPiece.removeAttribute('style');
      this.boardElement.removeAttribute('style');

      // Check if the dragged piece is over a square that it can move to
      const squares = document.querySelectorAll('.movable, .capturable, .castle');
      const square = Array.from(squares).find((square) => {
        const squareRect = square.getBoundingClientRect(); // position of the square
        return e.clientX >= squareRect.left && e.clientX <= squareRect.right && e.clientY >= squareRect.top && e.clientY <= squareRect.bottom;
      });

      if (square) {
        // change position of piece to the new square
        const position = square.classList[1];
        // move the piece in the board array
        this._movePiece(selectedPiece.classList[2], position);

        // move the piece in the DOM
        selectedPiece.classList.remove(selectedPiece.classList[2]);
        selectedPiece.classList.add(position);

        // remove highlighted squares
        this._removeSquareEffects('movable', 'capturable', 'castle', 'selected');

        selectedPiece = null;
      }

      window.addEventListener('mousedown', boundClick, true);
      window.removeEventListener('mouseup', boundDragEnd);
      window.removeEventListener('mousemove', boundDrag);
    };

    function click(e) {
      if (selectedPiece === null) {
        return;
      }

      // Check if the clicked square is a movable square
      const squares = document.querySelectorAll('.movable, .capturable, .castle');
      const square = Array.from(squares).find((square) => {
        const squareRect = square.getBoundingClientRect(); // position of the square
        return e.clientX >= squareRect.left && e.clientX <= squareRect.right && e.clientY >= squareRect.top && e.clientY <= squareRect.bottom;
      });

      if (square) {
        // Move the piece to the new square with a transition animation
        const position = square.classList[1];
        this.animateMove(selectedPiece.classList[2], position);
      }

      // Remove all highlighted squares
      this._removeSquareEffects('movable', 'capturable', 'castle', 'selected');

      selectedPiece = null;
      window.removeEventListener('mousedown', boundClick);
    }
  }

  /**
   * Captures a piece.
   * @param {string} square - The square to capture in chess notation.
   * @param {string} piece - The piece to capture.
   */
  _capturePiece(square, piece) {
    // Handle piece capture
    // Get current piece on square and update player material (_updatePlayerMaterial())
    this._updatePlayerMaterial(piece);

    // Add animation for captured piece to shrink and move to player material
    const color = piece.color === 'white' ? 'w' : 'b';
    const capturedPiece = document.querySelector(`[class^=${color}].piece.${square}`);
    const materialElement = document.querySelector(`[data-player-color=${this.turn}] > .material`);
    const materialRect = materialElement.getBoundingClientRect();
    const boardRect = this.boardElement.getBoundingClientRect(); // position of the board

    // get position of player material relative to the board
    const relativeX = materialRect.right - boardRect.left - capturedPiece.offsetWidth / 2;
    const relativeY = materialRect.top - boardRect.top - capturedPiece.offsetHeight / 2;

    // animate the piece to the new square
    capturedPiece.style.zIndex = 0;
    capturedPiece.style.pointerEvents = 'none';
    capturedPiece.style.transition = 'transform 0.8s ease-in-out';
    capturedPiece.style.transform = `translate3d(${relativeX}px, ${relativeY}px, 0) scale(0.3)`;
    setTimeout(() => {
      // remove piece from DOM
      capturedPiece.remove();
    }, 800);
  }

  /**
   * Animates the movement of a chess piece from one square to another.
   * @param {string} from - The starting square of the piece.
   * @param {string} to - The destination square of the piece.
   */
  animateMove(from, to) {
    this._movePiece(from, to);
    // get piece element at "from" square
    const piece = document.querySelector(`.piece.${from}`);

    // get position of "to" square
    const toSquare = document.createElement('div');
    toSquare.classList.add(to);
    this.boardElement.appendChild(toSquare);
    const toPosition = window.getComputedStyle(toSquare).getPropertyValue('transform');
    toSquare.remove();
    const matrix = new DOMMatrixReadOnly(toPosition);
    const translateX = matrix.m41;
    const translateY = matrix.m42;

    // animate the piece to the new square
    piece.style.transition = 'transform 0.2s ease-in-out';
    piece.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    setTimeout(() => {
      piece.classList.remove(piece.classList[2]);
      piece.classList.add(to);
      piece.removeAttribute('style');
    }, 200);
  }

  /**
   * Moves a piece from one square to another.
   * @param {string} from - The square to move from in chess notation.
   * @param {string} to - The square to move to in chess notation.
   */
  _movePiece(from, to) {
    // check if the move is capturing a piece ("to" has an enemy piece). If so, call capturePiece()
    const capturedPiece = this.getPiece(to);
    if (capturedPiece !== null) {
      this._capturePiece(to, capturedPiece);
    }

    // Move a piece from one square to another
    const piece = this.getPiece(from);
    this.setPiece(from, ' ');
    this.setPiece(to, piece.pieceType);

    // if not, check if the move is a pawn promotion
    const endRow = this.turn === 'white' ? 8 : 1;
    if (parseInt(to[1]) === endRow && piece.pieceType.toLowerCase() === 'p') {
      this._promotePawn(to);
    }

    // if the piece is a king, update the king position
    if (piece.pieceType.toLowerCase() === 'k') {
      this._kingPosition[this.turn] = to;
    }


    // increment move counter if the move is not a pawn move or a capture
    if (piece.pieceType.toLowerCase() !== 'p' && capturedPiece === null) {
      this.moveCounter++;
    } else {
      this.moveCounter = 0;
    }

    // update the clock
    this._updateClock();

    // switch player turn
    this.switchPlayer();

    // get check info
    this._checkInfo = this._getCheckInfo();

    // After moving the piece, check if the move is a checkmate, stalemate, or the 50th move
    this._checkEndGame();


    this._removeSquareEffects('last-move', 'threat');

    // highlight the last move
    this._highlightSquare(from, 'last-move');
    this._highlightSquare(to, 'last-move');

    // highlight king if in check
    if (this._checkInfo.checks.length > 0) {
      this._highlightSquare(this._kingPosition[this.turn], 'threat');
    }
  }

  /**
   * Switches the current player turn between white and black.
   * @private
   */
  switchPlayer() {
    try {
      this.turn = this.turn === 'white' ? 'black' : 'white';
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Updates the clock for the current player and starts the clock for the next player.
   * @private
   */
  _updateClock() {
    // Stop the clock for the current player and start for next player
    if (this.turn === 'white') {
      this.whiteClock.stop();
      this.blackClock.start();
    } else {
      this.blackClock.stop();
      this.whiteClock.start();
    }
  }

  /**
   * Initializes the chess clock for the game.
   * @param {number} timeControl - The time control for the game.
   */
  initializeClock(timeControl) {
    // Create clock instances for each player
    this.whiteClock = new ChessClock('white', timeControl);
    this.blackClock = new ChessClock('black', timeControl);

    // Start the clock for white
    this.whiteClock.start();
  }

  /**
   * Stops the game clocks.
   */
  stopClock() {
    this.whiteClock.stop(true);
    this.blackClock.stop(true);
  }

  /**
   * Returns an object containing information about checks, pins, and blockSquares for the given king position.
   * @param {string} [kingPosition=this._kingPosition[this.turn]] - The position of the king to check for.
   * @returns {{checks: string[], pins: {square: string, direction: {row: number, col: number}}[], blockSquares: string[]}} - An object containing arrays of squares that are checking the king, squares that are blocking a check, and squares that are pinned to the king.
   * @private
   */
  _getCheckInfo(kingPosition = this._kingPosition[this.turn]) {
    // Get check info for the given king position

    let kingPiece, replacedPiece;
    if (kingPosition !== this._kingPosition[this.turn]) {
      // if the king position is not the current king position:
      // get check info for a hypothetical position with king moved
      kingPiece = this.getPiece(this._kingPosition[this.turn]);
      replacedPiece = this.getPiece(kingPosition);
      this.setPiece(this._kingPosition[this.turn], ' ');
      this.setPiece(kingPosition, kingPiece.pieceType);
    }

    const checks = [];
    this._getLegalMoves('p', kingPosition).forEach((move) => {
      if (move.type === 'capture') {
        const piece = this.getPiece(move.square);
        if (piece !== null && piece.pieceType.toLowerCase() === 'p' && piece.color !== this.turn) {
          checks.push(move.square)
        }
      }
    });
    this._getLegalMoves('n', kingPosition).forEach((move) => {
      if (move.type === 'capture') {
        const piece = this.getPiece(move.square);
        if (piece !== null && piece.pieceType.toLowerCase() === 'n' && piece.color !== this.turn) {
          checks.push(move.square)
        }
      }
    });

    // for orthogonal and diagonal moves, check if the move is a capture and if the piece is a rook, bishop, or queen
    // if the last square is an ally piece, set a potentialPin flag and continue searching beyond for threats
    // if the search hits another friendly piece, set the potentialPin flag to false and stop searching in that direction
    // if the search hits a threat, stop searching in that direction and set a pin flag to that piece.
    // a pinned piece can only move in the detected direction. If it is a knight, it cannot move at all.
    const pins = [];
    const blockSquares = [];
    const oppositeColor = this.turn === 'white' ? 'black' : 'white';
    const orthogonals = [
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 }
    ];
    for (const direction of orthogonals) {
      const threatSquares = [];
      this._getMovesInDirection(kingPosition, direction).forEach((move) => {
        if (move.type === 'capture') {
          const piece = this.getPiece(move.square);
          if (piece !== null && (piece.pieceType.toLowerCase() === 'r' || piece.pieceType.toLowerCase() === 'q') && piece.color !== this.turn) {
            checks.push(move.square);
            blockSquares.push(...threatSquares);
          }
        } else if (move.type === 'move') {
          threatSquares.push(move.square);
        }
      });

      // if getting check info for the current position, check for pins
      if (kingPosition === this._kingPosition[this.turn]) {
        // pose as opposite color and check captures to detect if friendly pieces are blocking the king
        this._getMovesInDirection(kingPosition, direction, oppositeColor).forEach((move) => {
          if (move.type === 'capture') {
            let pin = false;
            const piece = this.getPiece(move.square);
            if (piece !== null && piece.color === this.turn) {
              // check if there's a threat beyond the friendly piece
              this._getMovesInDirection(move.square, direction).forEach((move) => {
                if (move.type === 'capture') {
                  const piece = this.getPiece(move.square);
                  if (piece !== null && (piece.pieceType.toLowerCase() === 'r' || piece.pieceType.toLowerCase() === 'q') && piece.color !== this.turn) {
                    pin = true;
                  }
                }
              });
            }
            if (pin) {
              pins.push({ square: move.square, direction })
            }
          }
        });
      }
    }
    const diagonals = [
      { row: -1, col: -1 },
      { row: -1, col: 1 },
      { row: 1, col: -1 },
      { row: 1, col: 1 }
    ];
    for (const direction of diagonals) {
      const threatSquares = [];
      this._getMovesInDirection(kingPosition, direction).forEach((move) => {
        if (move.type === 'capture') {
          const piece = this.getPiece(move.square);
          if (piece !== null && (piece.pieceType.toLowerCase() === 'b' || piece.pieceType.toLowerCase() === 'q') && piece.color !== this.turn) {
            checks.push(move.square);
            blockSquares.push(...threatSquares);
          }
        } else if (move.type === 'move') {
          threatSquares.push(move.square);
        }
      });

      // if getting check info for the current position, check for pins
      if (kingPosition === this._kingPosition[this.turn]) {
        // pose as opposite color and check captures to detect if friendly pieces are blocking the king
        this._getMovesInDirection(kingPosition, direction, oppositeColor).forEach((move) => {
          if (move.type === 'capture') {
            let pin = false;
            const piece = this.getPiece(move.square);
            if (piece !== null && piece.color === this.turn) {
              // check if there's a threat beyond the friendly piece
              this._getMovesInDirection(move.square, direction).forEach((move) => {
                if (move.type === 'capture') {
                  const piece = this.getPiece(move.square);
                  if (piece !== null && (piece.pieceType.toLowerCase() === 'b' || piece.pieceType.toLowerCase() === 'q') && piece.color !== this.turn) {
                    pin = true;
                  }
                }
              });
            }
            if (pin) {
              pins.push({ square: move.square, direction })
            }
          }
        });
      }
    }

    if (kingPosition !== this._kingPosition[this.turn]) {
      // if the king position is not the current king position:
      // reset the hypothetical position
      this.setPiece(this._kingPosition[this.turn], kingPiece.pieceType);
      if (replacedPiece) {
        this.setPiece(kingPosition, replacedPiece.pieceType);
      } else {
        this.setPiece(kingPosition, ' ');
      }
    }

    return { checks, pins, blockSquares };
  }

  /**
   * Returns an array of legal moves for a given piece on a given square.
   * @param {string} piece - The type of piece (p, r, n, b, q, k).
   * @param {string} square - The square the piece is on (e.g. "e4").
   * @returns {Array} An array of legal moves, each represented as an object with properties "square" (the destination square) and "type" (the type of move, e.g. "move", "capture", "en-passant", "castle-king", or "castle-queen").
   * @private
   */
  _getLegalMoves(piece, square) {
    // get all legal moves based on piece type and square it is on
    const legalMoves = [];

    const { checks, pins, blockSquares } = this._checkInfo;
    const limitedMoves = checks.concat(blockSquares);

    if (checks.length > 1 && piece.toLowerCase() !== 'k') {
      // if the king is in multiple checks, only allow the king to move
      return legalMoves;
    }
    const pinned = pins.find(pin => pin.square === square);
    if (pinned) {
      // if the piece is pinned, only allow the piece to move in the direction of the pin
      const pinMoves = this._getMovesInDirection(square, pinned.direction).map(move => move.square);
      if (blockSquares.length > 0) {
        // if the piece is pinned and there are block squares, only allow the piece to move to the block squares
        limitedMoves.push(...pinMoves.filter(move => blockSquares.includes(move)));
      } else {
        limitedMoves.push(...pinMoves);
      }
    }

    // Iterate through the possible squares for the piece (diagonals for bishops, etc.)
    switch (piece.toLowerCase()) {
      case 'p': {
        // Check if the pawn can move one or two squares forward
        const direction = this.turn === 'white' ? 1 : -1;
        const startRow = this.turn === 'white' ? 2 : 7;
        const nextRow = parseInt(square[1]) + direction;
        const nextSquare = square[0] + nextRow; // concatenate the file and rank
        if (this.getPiece(nextSquare) === null) {
          // 1 square forward
          if (!limitedMoves.length || limitedMoves.some(move => move === nextSquare)) {
            legalMoves.push({ square: nextSquare, type: 'move' });
          }
          if (parseInt(square[1]) === startRow && this.getPiece(square[0] + (nextRow + direction)) === null) {
            // 2 squares forward if at start position
            const twoSquaresForward = square[0] + (nextRow + direction);
            if (!limitedMoves.length || limitedMoves.some(move => move === twoSquaresForward)) {
              legalMoves.push({ square: twoSquaresForward, type: 'move' });
            }
          }
        }

        // Check if the pawn can capture diagonally
        const leftSquare = String.fromCharCode(square[0].charCodeAt(0) - 1) + nextRow;
        const rightSquare = String.fromCharCode(square[0].charCodeAt(0) + 1) + nextRow;
        if (square[0].charCodeAt(0) > 97 && this.getPiece(leftSquare) !== null && this.getPiece(leftSquare).color !== this.turn) {
          if (!limitedMoves.length || limitedMoves.some(move => move === leftSquare)) {
            legalMoves.push({ square: leftSquare, type: 'capture' });
          }
        }
        if (square[0].charCodeAt(0) < 104 && this.getPiece(rightSquare) !== null && this.getPiece(rightSquare).color !== this.turn) {
          if (!limitedMoves.length || limitedMoves.some(move => move === rightSquare)) {
            legalMoves.push({ square: rightSquare, type: 'capture' });
          }
        }

        // Check if the pawn can capture en passant
        if (this._isEnPassantMove(square, leftSquare)) {
          if (!limitedMoves.length || limitedMoves.some(move => move === leftSquare)) {
            legalMoves.push({ square: leftSquare, type: 'en-passant' });
          }
        }
        if (this._isEnPassantMove(square, rightSquare)) {
          if (!limitedMoves.length || limitedMoves.some(move => move === rightSquare)) {
            legalMoves.push({ square: rightSquare, type: 'en-passant' });
          }
        }

        break;
      }
      case 'r': {
        // Check if the rook can move horizontally or vertically
        const directions = [
          { row: -1, col: 0 },
          { row: 1, col: 0 },
          { row: 0, col: -1 },
          { row: 0, col: 1 }
        ];
        for (const direction of directions) {
          const moves = this._getMovesInDirection(square, direction);
          for (const move of moves) {
            if (!limitedMoves.length || limitedMoves.some(limitedMove => limitedMove === move.square)) {
              legalMoves.push(move);
            }
          }
        }
        break;
      }
      case 'n': {
        // Check if the knight can move in an L shape
        const directions = [
          { row: -2, col: -1 },
          { row: -2, col: 1 },
          { row: -1, col: -2 },
          { row: -1, col: 2 },
          { row: 1, col: -2 },
          { row: 1, col: 2 },
          { row: 2, col: -1 },
          { row: 2, col: 1 }
        ];
        for (const direction of directions) {
          const nextSquare = this._getNextSquare(square, direction.row, direction.col);
          if (nextSquare !== null) {
            if (this.getPiece(nextSquare) === null) {
              if (!limitedMoves.length || limitedMoves.some(move => move === nextSquare)) {
                legalMoves.push({ square: nextSquare, type: 'move' });
              }
            } else if (this.getPiece(nextSquare).color !== this.turn) {
              if (!limitedMoves.length || limitedMoves.some(move => move === nextSquare)) {
                legalMoves.push({ square: nextSquare, type: 'capture' });
              }
            }
          }
        }
        break;
      }
      case 'b': {
        // Check if the bishop can move diagonally
        const directions = [
          { row: -1, col: -1 },
          { row: -1, col: 1 },
          { row: 1, col: -1 },
          { row: 1, col: 1 }
        ];
        for (const direction of directions) {
          const moves = this._getMovesInDirection(square, direction);
          for (const move of moves) {
            if (!limitedMoves.length || limitedMoves.some(limitedMove => limitedMove === move.square)) {
              legalMoves.push(move);
            }
          }
        }
        break;
      }
      case 'q': {
        // Check if the queen can move horizontally, vertically, or diagonally
        const directions = [
          { row: -1, col: -1 },
          { row: -1, col: 0 },
          { row: -1, col: 1 },
          { row: 0, col: -1 },
          { row: 0, col: 1 },
          { row: 1, col: -1 },
          { row: 1, col: 0 },
          { row: 1, col: 1 }
        ];
        for (const direction of directions) {
          const moves = this._getMovesInDirection(square, direction);
          for (const move of moves) {
            if (!limitedMoves.length || limitedMoves.some(limitedMove => limitedMove === move.square)) {
              legalMoves.push(move);
            }
          }
        }
        break;
      }
      case 'k': {
        // Check if the king can move one square in any direction
        const directions = [
          { row: -1, col: -1 },
          { row: -1, col: 0 },
          { row: -1, col: 1 },
          { row: 0, col: -1 },
          { row: 0, col: 1 },
          { row: 1, col: -1 },
          { row: 1, col: 0 },
          { row: 1, col: 1 }
        ];
        for (const direction of directions) {
          const nextSquare = this._getNextSquare(square, direction.row, direction.col);
          if (nextSquare !== null) {
            // Check if the king can move to the next square
            if (this._getCheckInfo(nextSquare).checks.length === 0) {
              // Square is not under threat
              if (this.getPiece(nextSquare) === null) {
                legalMoves.push({ square: nextSquare, type: 'move' });
              } else if (this.getPiece(nextSquare).color !== this.turn) {
                legalMoves.push({ square: nextSquare, type: 'capture' });
              }
            }
          }
        }

        // Check if the king can castle
        if (this._isCastlingMove(square)) {
          const kingSide = this._getNextSquare(square, 0, 2);
          const queenSide = this._getNextSquare(square, 0, -2);
          if (this.getPiece(kingSide) === null && this.getPiece(queenSide) === null) {
            legalMoves.push({ square: kingSide, type: 'castle-king' });
            legalMoves.push({ square: queenSide, type: 'castle-queen' });
          }
        }
        break;
      }
    }

    return legalMoves;
  }

  /**
   * Returns an array of valid moves in a given direction for a given square.
   *
   * @param {string} square - The square to get moves for.
   * @param {Object} direction - The direction to get moves in.
   * @param {string} [color=this.turn] - The color of the piece to get moves for.
   * @returns {Array} An array of valid moves in the given direction for the given square.
   * @private
   */
  _getMovesInDirection(square, direction, color = this.turn) {
    const moves = [];

    let nextSquare = this._getNextSquare(square, direction.row, direction.col);
    while (nextSquare !== null) {
      if (this.getPiece(nextSquare) === null) {
        moves.push({ square: nextSquare, type: 'move' });
      } else if (this.getPiece(nextSquare).color !== color) {
        moves.push({ square: nextSquare, type: 'capture' });
        break;
      } else {
        break;
      }
      nextSquare = this._getNextSquare(nextSquare, direction.row, direction.col);
    }

    return moves;
  }

  /**
   * Highlights the legal moves for a piece.
   * @param {string} square - The square to select in chess notation.
   * @private
   */
  _highlightLegalMoves(square) {
    // Get piece at square
    const piece = this.getPiece(square);

    // Get legal moves for piece
    const legalMoves = this._getLegalMoves(piece.pieceType, square);

    // Highlight legal moves
    legalMoves.forEach((move) => {
      switch (move.type) {
        case 'move':
          this._setMovable(move.square);
          break;
        case 'capture':
          this._setCapturable(move.square);
          break;
        case 'en-passant':
          this._setEnPassantSquare(move.square);
          break;
        case 'castle-king':
          this._setCastleSquare(move.square, 'king');
          break;
        case 'castle-queen':
          this._setCastleSquare(move.square, 'queen');
          break;
      }
    });
  }

  /**
   * Creates a square element with the given class name, square, and dataset.
   * @param {string} className - The class name to add to the square element.
   * @param {string} square - The square to add to the square element.
   * @param {Object} dataset - The dataset to add to the square element.
   * @returns {HTMLElement} The created square element.
   * @private
   */
  _createSquareElement(className, square, dataset) {
    const div = document.createElement('div');
    div.classList.add(className, square);
    if (dataset) {
      Object.entries(dataset).forEach(([key, value]) => {
        div.dataset[key] = value;
      });
    }

    this.boardElement.appendChild(div);
    return div;
  }

  /**
   * Sets the given square as movable by creating a square element with the 'movable' class.
   * @param {string} square - The square to set as movable.
   * @private
   */
  _setMovable(square) {
    this._createSquareElement('movable', square);
  }

  /**
   * Sets the given square as movable by creating a square element with the 'capturable' class.
   * @param {string} square - The square to set as capturable.
   * @private
   */
  _setCapturable(square) {
    this._createSquareElement('capturable', square);
  }

  /**
   * Sets a castle square on the chess board.
   * @param {string} square - The square to set the castle on.
   * @param {string} side - The side of the castle (either 'king' or 'queen').
   * @private
   */
  _setCastleSquare(square, side) {
    this._createSquareElement('castle', square, { castle: side });
  }

  /**
   * Sets the en passant square on the chess board.
   * @param {string} square - The square to set as en passant.
   * @private
   */
  _setEnPassantSquare(square) {
    this._createSquareElement('en-passant', square);
  }

  /**
   * Highlights a given square on the chess board.
   * @param {string} square - The square to highlight in algebraic notation (e.g. "e4").
   * @param {string} [type='selected'] - The type of highlight to apply (e.g. "selected", "check").
   * @private
   */
  _highlightSquare(square, type = 'selected') {
    const div = this._createSquareElement('highlight', square);
    div.classList.add(type);
  }

  /**
   * Returns the next square on the chess board given a starting square and row/column offsets.
   * @param {string} square - The starting square in algebraic notation (e.g. "a1").
   * @param {number} rowOffset - The number of rows to move (positive for down, negative for up).
   * @param {number} colOffset - The number of columns to move (positive for right, negative for left).
   * @returns {string|null} The next square in algebraic notation, or null if the resulting square is out of bounds.
   * @private
   */
  _getNextSquare(square, rowOffset, colOffset) {
    const row = parseInt(square[1]) + rowOffset;
    const col = square[0].charCodeAt(0) + colOffset;
    if (row < 1 || row > 8 || col < 97 || col > 104) {
      return null;
    }
    return String.fromCharCode(col) + row;
  }

  /**
   * Removes the specified effects from the chess board squares.
   * @param  {...string} effects - The CSS class names of the effects to remove.
   * @private
   */
  _removeSquareEffects(...effects) {
    effects.forEach((effect) => {
      const squares = document.querySelectorAll(`.${effect}`);
      squares.forEach((square) => {
        square.remove();
      });
    });
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
   * Checks if the game has ended due to checkmate, stalemate, or the fifty-move rule.
   * If the game has ended, calls the _endGame method with the appropriate end game type.
   * @private
   */
  _checkEndGame() {
    const isCheckmate = this._isCheckmate();
    const isStalemate = this._isStalemate();
    const isFiftyMoveRule = this._moveCounter >= 50;

    if (isCheckmate) {
      this._endGame(this.turn === 'white' ? 'black' : 'white', 'checkmate');
    } else if (isStalemate) {
      this._endGame(null, 'stalemate');
    } else if (isFiftyMoveRule) {
      this._endGame(null, 'fifty-move-rule');
    }
  }

  /**
   * Dispatches a custom event to indicate that the game has ended.
   * @param {string|null} winner - The color of the winning player, or null if the game is a draw.
   * @param {string} reason - The reason for the game end (e.g. "checkmate", "stalemate", "fifty-move-rule").
   * @private
   */
  _endGame(winner, reason) {
    document.dispatchEvent(new CustomEvent('gameOver', {
      detail: {
        winner: winner,
        reason: reason
      }
    }));
  }

  /**
   * Checks if the game is in checkmate.
   * @returns {boolean} True if the game is in checkmate, false otherwise.
   * @private
   */
  _isCheckmate() {
    // Check if the game is in checkmate
    // i.e. the King is in check and cannot move out of check
    const { checks } = this._checkInfo;
    if (checks.length === 0) {
      return false;
    }

    // Check if the king can move or capture out of check
    const kingPosition = this._kingPosition[this.turn];
    if (this._getLegalMoves('k', kingPosition).length > 0) {
      return false;
    }

    // Check if any piece can block or capture the check
    this.getPiecesByColor(this.turn).forEach((piece) => {
      const legalMoves = this._getLegalMoves(piece.pieceType, piece.square);
      if (legalMoves.length > 0) {
        return false;
      }
    });

    // The king cannot get out of check
    return true;
  }

  /**
   * Checks if the game is in stalemate.
   * @returns {boolean} True if the game is in stalemate, false otherwise.
   * @private
   */
  _isStalemate() {
    // Check if the game is in stalemate
    // i.e. the King is not in check and cannot move out of check
    const { checks } = this._checkInfo;
    if (checks.length > 0) {
      return false;
    }

    // Check if any piece can move
    const pieces = this.getPiecesByColor(this.turn);
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      const legalMoves = this._getLegalMoves(piece.pieceType, piece.square);
      if (legalMoves.length > 0) {
        return false;
      }
    }

    // The game is in stalemate
    return true;
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
   * Updates the player's material and reflects the changes in the UI.
   * @param {Object} piece - The piece that was captured.
   * @private
   */
  _updatePlayerMaterial(piece) {
    const pieceNames = {
      p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen'
    };
    // Material values for each piece
    const materialValues = {
      pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9
    }
    const pieceType = pieceNames[piece.pieceType.toLowerCase()];
    // Update the player's material
    this.players[this.turn].gainedMaterial[pieceType]++ === 0

    const materialElement = document.querySelector(`[data-player-color=${this.turn}] > .material > .${pieceType}-material`);
    const iconElement = document.createElement('i');
    iconElement.classList.add('fa-solid', `fa-chess-${pieceType}`, 'fa-xs');
    materialElement.appendChild(iconElement);

    // Add the value of the captured piece to the player's materialValueTotal
    this.players[this.turn].materialValueTotal += materialValues[pieceType];

    // Get the difference in material, and reflect it in the UI for whoever is up material
    const whiteMaterial = this.players.white.materialValueTotal;
    const blackMaterial = this.players.black.materialValueTotal;

    const difference = whiteMaterial - blackMaterial;

    const whiteMaterialElement = document.querySelector('[data-player-color="white"] > .material > .material-difference');
    const blackMaterialElement = document.querySelector('[data-player-color="black"] > .material > .material-difference');
    if (difference > 0) {
      // White is up material
      whiteMaterialElement.textContent = `+${difference}`;
      blackMaterialElement.textContent = '';
    } else if (difference < 0) {
      // Black is up material
      whiteMaterialElement.textContent = '';
      blackMaterialElement.textContent = `+${-difference}`;
    } else {
      // Material is even
      whiteMaterialElement.textContent = '';
      blackMaterialElement.textContent = '';
    }
  }
}