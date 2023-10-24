/*
 * Course: SENG 513
 * Date: OCT 23, 2023
 * Assignment 2
 * Name: Jacob Nguyen
 * UCID: 30087465
 */

// This file contains the javascript for the index.html page.

(() => {
	// Handle game type selection
	const gameTypeButtons = document.querySelectorAll('input[name="game-type"]');
	gameTypeButtons.forEach((gameType) => {
		gameType.addEventListener("change", (e) => {
			showOptions("type-selection", e.target.value);
		});
	});

	// Handle time control toggle
	const toggleTime = document.getElementById("toggle-time-control");
	toggleTime.addEventListener("click", () => {
		if (toggleTime.checked) {
			showOptions("time-toggle", "toggle");
		} else {
			showOptions("time-toggle", "hide");
		}
	});

	// Handle time control selection
	// query range sliders, and their respective labels
	// initialize the labels with the slider values
	// the range for minutes per side should be 1 to 60 and non-linear (e.g. 1, 2, 3, 5, 10, 15, 30, 60)
	// the range for increment in seconds should be 0 to 60 and non-linear (e.g. 0, 1, 2, 3, 4, 5, 10, 15, 30, 60)

	// Handle color selection
	// query the color selection radio buttons
	// update the color selection label with the selected color


	// Utility function to show options for the passed selection
	const showOptions = (selection, selected = "") => {
		const options = document.querySelectorAll(`div[data-${selection}]`);
		// reset
		options.forEach((option) => {
			option.classList.add("hidden");
			option.classList.remove("slide-down");

			// trigger reflow
			void option.offsetWidth;
		});

		// show options for the selected game type
		const selectedOptions = document.querySelectorAll(
			`div[data-${selection}*=${selected}]`
		);

		if (selectedOptions) {
			selectedOptions.forEach((selectedOption) => {
				selectedOption.classList.remove("hidden");
				selectedOption.classList.add("slide-down");
			});
		}
	};
})();
