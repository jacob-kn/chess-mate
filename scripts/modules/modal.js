/*
 * Course: SENG 513
 * Date: OCT 23, 2023
 * Assignment 2
 * Name: Jacob Nguyen
 * UCID: 30087465
 */

/**
 * Creates a new instance of the Modal class.
 * @class
 */
export class Modal {
  constructor(modalType, winner, reason) {
    // Initialize modals for resign, draw, promotion, etc.
    this.modalType = modalType;
    this.winner = winner;
    this.reason = reason;
    this.modal = document.createElement("div");
    this.modal.classList.add("modal");
    const content = this.getContent();
    this.modal.innerHTML = `
        <div class="modal-content">
          <h2 class="modal-title">${content.title}</h2>
          <p class="modal-explanation">${content.explanation}</p>
          <div class="modal-buttons">
            <button class="modal-button modal-button-left">${content.buttons.left.text}</button>
            <button class="modal-button modal-button-right">${content.buttons.right.text}</button>
          </div>
        </div>
      `;

    this.modal.addEventListener("click", (event) => {
      if (event.target === this.modal) {
        this.closeModal();
      }
    });

    this.modal.querySelector(".modal-button-left").addEventListener("click", () => {
      content.buttons.left.action();
      this.closeModal();
    });
    this.modal.querySelector(".modal-button-right").addEventListener("click", () => {
      content.buttons.right.action();
      this.closeModal();
    });

    if (this.modalType === "game-over") {
      const modalExit = document.createElement("span");
      modalExit.classList.add("modal-exit");
      modalExit.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      modalExit.addEventListener("click", () => {
        this.closeModal();
      });

      this.modal.querySelector(".modal-content").appendChild(modalExit);
    }

    const boardElement = document.getElementById("board");
    boardElement.appendChild(this.modal);
  }

  getContent() {
    let title = "";
    let explanation = "";
    const buttons = { left: {}, right: {} };
    switch (this.modalType) {
      case "game-over":
        switch (this.reason) {
          case "checkmate":
            title = `${this.winner} won`;
            explanation = `by checkmate`;
            break;
          case "stalemate":
            title = `Draw`;
            explanation = `by stalemate`;
            break;
          case "fifty-move-rule":
            title = `Draw`;
            explanation = `by fifty-move rule`;
            break;
          case "time":
            title = `${this.winner} won`;
            explanation = `on time`;
            break;
          case "resignation":
            title = `${this.winner} won`;
            explanation = `by resignation`;
            break;
          case "draw-agreement":
            title = `Draw`;
            explanation = `by agreement`;
            break;
          default:
            console.error("Invalid reason for game over modal");
            break;
        }
        buttons.left = {
          text: `<i class="fa-solid fa-house"></i>Home`,
          action: () => {
            window.location.href = "index.html";
          }
        };
        buttons.right = {
          text: `<i class="fa-solid fa-arrows-rotate"></i>Rematch`,
          action: () => {
            document.dispatchEvent(new CustomEvent("newGame"));
          }
        };
        break;
      case "resign":
        title = "Resignation";
        explanation = "Are you sure you want to resign?";
        buttons.left = {
          text: `<i class="fa-solid fa-xmark"></i>Cancel`,
          action: () => { }
        };
        buttons.right = {
          text: `<i class="fa-solid fa-flag"></i>Resign`,
          action: () => {
            document.dispatchEvent(new CustomEvent("gameOver", { detail: { winner: this.winner, reason: "resignation" } }));
          }
        };
        break;
      case "draw":
        title = "Draw Offer";
        explanation = "Do you want to draw?";
        buttons.left = {
          text: `<i class="fa-solid fa-xmark"></i>Cancel`,
          action: () => { }
        };
        buttons.right = {
          text: `<i class="fa-solid fa-handshake"></i>Draw`,
          action: () => {
            document.dispatchEvent(new CustomEvent("gameOver", { detail: { winner: null, reason: "draw-agreement" } }));
          }
        };
        break;
      case "new-game":
        title = "New Game";
        explanation = "Are you sure you want to start a new game?";
        buttons.left = {
          text: `<i class="fa-solid fa-xmark"></i>Cancel`,
          action: () => { }
        };
        buttons.right = {
          text: `<i class="fa-solid fa-arrows-rotate"></i>New Game`,
          action: () => {
            document.dispatchEvent(new CustomEvent("newGame"));
          }
        };
        break;
      case "promotion":
        title = "Promotion";
        break;
      default:
        console.error("Invalid modal type");
        break;
    }

    return { title, explanation, buttons };
  }

  closeModal() {
    this.modal.remove();
  }
}
