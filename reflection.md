# Reflection

## Base game implementation
* Very little AI was able to be used in this section. It was difficult to get the AI to produce code that worked in the context of the entire project. This was most notable with the interactive components (dragging and dropping a piece, highlighting moves, animating pieces, etc.), which had to be written completely from scratch.
* The most time-consuming part of this section was working with the DOM for selecting a piece (with both drags and clicks), and capturing and moving pieces. Lots of work with getting the binding rectangles of elements for positions.
* Getting the squares different pieces can move to disregarding checks and the king position was relatively easy and involved simple logic.
* Implementing the check system and modifying the existing code to accept was challenging. I needed to account for not only the checks, pins, and squares that can block a check, but also prevent the king to move into check.
* Iterating through all the pieces and getting their legal moves for every single turn to get the threatened squares had two glaring issues:
  * It would be inefficient and use a lot of unnecessary computing power for a serverless web app,
  * Getting the currently threatened squares doesn't account for pinned pieces. 

  This led me to develop a way to get checks by posing as other pieces at the king's position, or a hypothetical king's position for king moves, and seeing if there were those pieces at the end of the path.
* For the most part, the logic went with the way I planned, however there were a lot of extra helper functions I added for code reuse.

## Clock and game over functionality
* The logic behind the chess clock was done mostly by AI: it initialized time left from the game settings and used math functions to display the time.
* The DOM element creation was done manually in order to work with the existing styling.
* The game over functionality didn't involve any AI assistance. It consists mostly of event dispatches and event listeners to handle when the game is ended and how it ended.

## Game settings
* The game settings involved little AI as I again had difficulty getting the AI to take in the context of the interface.
* This process involved extracting values from the various inputs in the landing/home page, dynamically changing the UI to give feedback as to what values were being selected.
* In order to get these values from the home page and into the play page, I decided to store the values in the local storage in the home page so I could retrieve them later.
* In terms of actually using these values in the game: 
  * the time control was already implemented from before,
  * the player names had to be reflected in the interface based on whether the mode was two players or against a computer,
  * if against a computer, a computer class instance had to be created,
  * if the player chose to play as black against the computer, the top and bottom players and clocks had to be swapped and the board had to be flipped. I had already made styling to flip the board using a class, so all that was needed was to flip the players and clocks.

## Computer
* The computer algorithm was mostly AI and pseudocode from wikipedia.
* Actually implementing this algorithm into the rest of the code proved challenging. I needed a way to make a move and evaluate the board in that state without affecting the main board, and get all the legal moves for each board state in order to iterate through them.
* I decided the easiest way to go about simulating moves on the board was to use a deep clone method, instead of implementing ways to move and undo moves from scratch. Since the UI was intertwined with methods that had logic, this would involve too much rewriting.
* Getting all the legal moves was simple, as I already had a method to get all pieces of a colour, and only had to iterate through the pieces and get the legal moves for them.
* Since the _movePiece method was tied to the UI and signalled the end of a turn and all of the logic behind that, I had to make a new, similar method that was entirely removed form the UI called falseMove. The minimax algorithm would call this.
* For the evaluation, I went with a simple material value assignment to pieces. Ideally, there would also be values assigned to each square for each piece, as some positions are stronger for pieces (for example, knights are bad on edges, and if there hasn't been a castle yet rooks are better at their starting positions). Right now there is a case where the computer repeats a rook move at the beginning of the game because it deems "safe" as it guarantees no value loss.
* Computer moves are triggered when a turn change event is dispatched when a player moves.
* It took a lot of time and debugging with promises to dispatch the turn change event only after all the board animations were finished. If they were still ongoing, the DOM wouldn't be updated with the most recent board state, which some functions rely on. Also, animations would pause on firefox if the computer started calculating its best move in parallel.

## Game options and game over modals
* The modal class went through a lot of changes from what I originally planned it. I was originally going to select modal divs that were already created in the HTML, but decided instead to create entirely new modal elements when the class is constructed and add it to the DOM, then completely remove it when it closes.
* This made it easier to account for the many different states a modal could have based on which player clicked which button, who won and how they won, etc.
* I also disabled some game options that didn't make sense: when playing against a computer, you shouldn't be able to offer a draw, and you shouldn't be able to make a new game if you didn't surrender. When the game is over, only the new game button can be clicked and the rest are disabled.

## Castling
* Castling was written mostly from scratch, with AI assistance to code blocks I described faster.
* I kept track of the castling rights of the game and updated it when the king or rooks moved.
* Based on these rights, I determine if castling is a legal move if there are no pieces in between the king and rook, and if the king does not move through check.
* Since this is the only case in chess where two pieces of the same colour moves on the same turn, I had to adjust the movePiece method so that the turn does not change in the middle of castling.
* This feature introduced more issues with promises and dispatching the turn change for the computer at the right time.
* In the end, I was able to get the timing correct for playing against a computer, however a visual bug was introduced where if multiple pieces are captured within the capture animation, only the first captured piece will have its animation played. The others with be static until it they are removed from the DOM after the timeout.

