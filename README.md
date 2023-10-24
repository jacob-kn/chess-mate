<!--
Course: SENG 513
Date: OCT 23, 2023
Assignment 2
Name: Jacob Nguyen
UCID: 30087465
-->

# ChessMate

A local chess web application.

## Table of Contents
- [ChessMate](#chessmate)
  - [Table of Contents](#table-of-contents)
  - [Game Overview](#game-overview)
    - [Title: ChessMate](#title-chessmate)
    - [Target Platforms:](#target-platforms)
    - [Game Genre:](#game-genre)
    - [Game Objective:](#game-objective)
    - [Rules of the Game:](#rules-of-the-game)
    - [Game Mechanics:](#game-mechanics)
  - [Functionality](#functionality)
  - [Usage](#usage)
  - [Acknowledgements](#acknowledgements)
    - [Chess Pieces](#chess-pieces)
    - [Icons](#icons)
  - [Author](#author)

## Game Overview

### Title: ChessMate

### Target Platforms: 
Mobile and desktop using a mobile-first responsive web design

### Game Genre: 
Strategy board game

### Game Objective:  
It's chess! A two-player game where the objective is to checkmate your opponent's king. This means the opponent's king is in check, and cannot legally move out of check.  
Be careful though, because if there are no legal moves for the opposing player but the king is *not* in check, that's a stalemate and thus a draw!

### Rules of the Game:  
Most regular chess rules apply:  
1. White moves first, and players alternate turns by moving one piece per turn. You cannot skip a turn.
2. A piece may move to an empty square or to one with an opponent's piece, taking their place and removing it from play--"capturing" the piece.
3. There are 6 different pieces, each with a unique way of moving. *Pieces cannot move past/over another piece* (both ally and opposing) with the exception of the knight.
   1. Pawn- Can move forward once to an *empty* square, or forward twice to an empty square if it is the pawn's first move. A pawn can only capture on the two squares diagonally in front of it.
   2. Bishop- Can move diagonally by any amount of squares.
   3. Knight- Can move two squares vertically and one horizontally or two square horizontally and one vertically--an "L" shape. Can jump over any piece.
   4. Rook- Can move horizontally or vertically by any amount of squares.
   5. Queen- Can move horizontally, vertically, and diagonally by any amount of squares--a bishop and a rook combined!
   6. King- Can only move one square in any direction.
4. Special moves:
   1. En passant- If a pawn uses the two square move as its first move, then on the turn *immediately after* the move is made, the opponent's pawn can capture it by moving to the square behind that pawn, or the square the pawn passed over. This is the only move in the game that can capture a piece on a square that the piece is not on.
   2. Promotion- If a pawn reaches the last rank (row), it is promoted and the player can exchange it for either a queen, rook, bishop, or knight. The queen is most common, but in some very rare cases, a knight might be better with its unorthodox movement.
   3. Castling- A move involving two ally pieces: once per game, the king can move two squares towards an ally rook, and the rook on the square the king passed over, provided:
      1. neither the king nor the rook has yet to move,
      2. there are no pieces in between the king and rook,
      3. and the king is not in check and will not move through or end up in check.
5. Check: when a king can be captured on the opponent's next turn. If a king is in check, the player must get out of check by:
   1. moving the king to a safe square,
   2. blocking the threatening piece using another piece (a knight cannot be blocked),
   3. capturing the threatening piece to remove the threat.  

    Other than these moves, all other moves are illegal and cannot be made. If the player cannot get out of check, the player loses and the game ends in checkmate.
6. Stalemate: if a player has no legal moves and their king is *not* in check, the game ends in stalemate and is drawn.
7. At any time, a player can resign, giving their opponent the win. As well, a player can offer a draw and if the opponent accepts, the game will end in a draw.
8. When a player's time runs out, the game ends and that player loses.
9. If fifty (50) moves have passed without a pawn move or capture, the game will forcefully end in a draw.
10. The following chess rules exist, but are not implemented in the application: 
    1.  Dead position: If a player resigns or time runs out, but there is no sequence of moves that either player can make that will lead to checkmate, then the game ends in a draw.
    2.  Threefold repetition: If the same position repeats for three consecutive turns, the game will end in a draw.

### Game Mechanics:  
From the landing page, the user can change the game's settings: they can choose to play against another player at the device or against a computer, the time control in minutes per side and increment in seconds, and their colour if playing against the computer.  

Once the game starts, the player(s) can either click or drag and drop a piece to a highlighted square that indicates a legal move. On a right-click, the piece will be de-selected (and returned to its original square if being dragged). After a move is made, the game will automatically switch turns to the other player.  
During the game, player(s) can click buttons to offer a draw, start a new game, or resign.

## Functionality
As of the current build, only rudimentary navigation features have been implemented. The current user interface uses hard-coded, placeholder states. In future builds, the following functionality will be implemented using vanilla JavaScript:
1. **Custom Animations:** Animations for capturing pieces will be added (shrinking and moving the captured piece towards the material visualization) and a clock animation to signify urgency (e.g. red beating). Dragging and dropping a chess piece will also enlarge the piece and follow the cursor when held. Some animations, such as the pulsing clock icon for the current player and on-hover animations for movable and capturable squares have already been implemented.
2. **Custom Interaction Mechanism:** There will be logic to determine legal moves for selected pieces; mechanisms to check for check, checkmate, stalemate, en passant, promotion, and castling scenarios; clocks for time control that run down on each turn; a visual representation of each player's material and the value the player up in material is up by; and score tracking for the current game instance.
3. **Custom Algorithms:** The computer will use a minimax algorithm with alpha-beta pruning to determine the "best" move in the position.  

These functionalities have been outlined in comments in the JavaScript files.



## Usage
*Add instructions for production build*

## Acknowledgements

### Chess Pieces
Chess pieces adapted from "king", "queen", "rook", "bishop", "knight", and "pawn" by [Samsul Rizal](https://thenounproject.com/rizal2109) via [Noun Project](https://thenounproject.com/browse/collection-icon/chess-98934) (CC BY 3.0) / Outline and gradient fill added to original.

### Icons
Icons by [Font Awesome](https://fontawesome.com), [License](https://fontawesome.com/license/free) - (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License).

## Author
* **Jacob Nguyen** - [jacob-kn](https://github.com/jacob-kn)
