# Code Explanation

## Legal Moves

### `scripts/modules/chess-board.js`

The `_getLegalMoves(piece, square)` method is used to calculate all the legal moves for a given piece on a specific square. It takes two parameters: `piece` which represents the type of the chess piece (p for pawn, r for rook, n for knight, b for bishop, q for queen, and k for king), and `square` which represents the current position of the piece on the chessboard in chess notation (e.g., "e4"). The method returns an array of legal moves, where each move is represented as an object with properties "square" (the destination square) and "type" (the type of move, e.g., "move", "capture", "en-passant", "castle-king", or "castle-queen").

The method first checks if the king is in multiple checks, and if so, returns an empty array if the piece is not a king, as only the king would be able to move. It also checks if there is only one check and if the pieces is pinned and if so, it limits the possible moves for the piece to either block or move in the direction of the pin. Then, it uses a switch statement to calculate the possible moves for each type of piece. For example, for a pawn, it checks if the pawn can move one or two squares forward, if it can capture diagonally, or if it can capture en passant. For a rook, it checks if the rook can move horizontally or vertically using the `_getMovesInDirection` method. The method does similar checks for the knight, bishop, queen, and king, each with their own unique movement logic. For the king, it also checks if the king can castle.

The `_getMovesInDirection(square, direction, color = this.turn)` method is used to calculate all the valid moves in a given direction for a piece on a specific square. It takes three parameters: `square` which represents the current position of the piece on the chessboard, `direction` which represents the direction to get moves in, and `color` which represents the color of the piece to get moves for. The method returns an array of valid moves in the given direction for the given square. It does this by iterating over the squares in the given direction until it hits a square that is either occupied by a piece of the same color or off the board. If it hits a square that is occupied by a piece of a different color, it includes that square as a capture and then stops.

## Check Info

### `scripts/modules/chess-board.js`

The `_getCheckInfo` method is designed to return an object containing information about checks, pins, and block squares for a given king's position on a chessboard.

The method accepts an optional parameter `kingPosition`, which defaults to the current position of the king whose turn it is. The method begins by checking if the provided `kingPosition` is different from the current king's position. If it is, the method simulates moving the king to the new position to calculate the check information. This is used when calculating legal moves for the king, as a king cannot move into check.

The method then calculates checks from pawns and knights. It does this by getting all the legal moves for a pawn and a knight from the king's position and checking if any of these moves result in a capture. If a move does result in a capture and the piece being captured is a pawn or a knight of the opposite color, the square of the captured piece is added to the `checks` array.

Next, the method calculates checks from rooks, bishops, and queens. It does this by getting all the moves in each orthogonal and diagonal direction from the king's position. If a move results in a capture and the piece being captured is a rook, bishop, or queen of the opposite color, the square of the captured piece is added to the `checks` array. Any squares that are threatened by these pieces are added to the `blockSquares` array. These are squares ally pieces can move into to block the check.

The method also checks for pins. A pin occurs when a piece is blocking a check on the king and therefore cannot move without exposing the king to check. The method checks for pins by simulating moves of the opposite color and checking if any of these moves result in a capture of a friendly piece with a threat beyond it. If such a move is found, the square of the pinned piece and the direction of the pin are added to the `pins` array.

Finally, if the king was hypothetically moved at the beginning of the method, the method resets the board to its original state. The method then returns an object containing the `checks`, `pins`, and `blockSquares` arrays.

## Computer AI

### `scripts/modules/computer.js`

The computer uses the minimax algorithm with alpha-beta pruning to decide its moves.

The `makeMove` method is responsible for making a move for the computer player on the board. It first initializes `bestMove` and `bestValue` variables. Then, it iterates over all legal moves for the computer player's color. For each move, it clones the current board state and applies the move to the clone. It then calls the `_minimax` method on the cloned board state to get a heuristic value for the move, with a depth of 3 moves. If the value is better than the current `bestValue`, it updates `bestValue` and `bestMove`. Once it has evaluated all moves, it resolves a promise with the `bestMove`. After the promise is resolved, it animates the move on the board.

The `_evaluateBoard` method is used to evaluate the current state of the board and return a heuristic value. It assigns values to each type of piece and then iterates over all squares on the board, adding or subtracting the value of the piece on the square from a `score` variable depending on whether the piece is the same color as the computer player. The resulting `score` is the heuristic value of the board.

The `_minimax` method implements the minimax algorithm with alpha-beta pruning. It is a recursive method that explores the game tree to a specified depth and returns a heuristic value for the current node (board state). If the current depth is 0, it simply returns the heuristic value of the node by calling `_evaluateBoard`. Otherwise, it iterates over all legal moves for the current player, applies each move to a clone of the current node, and recursively calls `_minimax` on the child node. It keeps track of the best value found so far and uses the alpha-beta pruning technique to cut off branches of the game tree that do not need to be explored. The method returns the best value found.

