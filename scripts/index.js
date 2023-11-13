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
			localStorage.setItem("gameType", e.target.value);
		});
	});

	// Handle time control toggle
	const toggleTime = document.getElementById("toggle-time-control");
	localStorage.setItem("timeControl", toggleTime.checked);
	toggleTime.addEventListener("click", () => {
		if (toggleTime.checked) {
			showOptions("time-toggle", "toggle");
			localStorage.setItem("timeControl", true);
		} else {
			showOptions("time-toggle", "hidden");
			localStorage.setItem("timeControl", false);
		}
	});

	// Handle time control selection
	const timeSlider = document.getElementById("minutes-per-side");
	const timeLabel = document.querySelector("#time-selection label span");
	const incrementSlider = document.getElementById("increment-seconds");
	const incrementLabel = document.querySelector("#increment-selection label span");

	// the range for minutes per side should be 1 to 60 and non-linear (e.g. 1, 2, 3, 5, 10, 15, 30, 60)
	const timeValues = { 1: 0.5, 2: 1, 3: 2, 4: 3, 5: 5, 6: 10, 7: 15, 8: 30, 9: 60 }
	timeLabel.innerHTML = timeValues[timeSlider.value];
	localStorage.setItem("minutesPerSide", timeValues[timeSlider.value]);
	timeSlider.addEventListener("input", () => {
		timeLabel.innerHTML = timeValues[timeSlider.value];
		localStorage.setItem("minutesPerSide", timeValues[timeSlider.value]);
	});

	// the range for increment in seconds should be 0 to 60 and non-linear (e.g. 0, 1, 2, 3, 4, 5, 10, 15, 30, 60)
	const incrementValues = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 10, 8: 15, 9: 30, 10: 60 }
	incrementLabel.innerHTML = incrementValues[incrementSlider.value];
	localStorage.setItem("incrementSeconds", incrementValues[incrementSlider.value]);
	incrementSlider.addEventListener("input", () => {
		incrementLabel.innerHTML = incrementValues[incrementSlider.value];
		localStorage.setItem("incrementSeconds", incrementValues[incrementSlider.value]);
	});

	// Handle color selection
	const colorButtons = document.querySelectorAll('input[name="color-choice"]');
	const colorLabel = document.querySelector("#play-as p span");

	const colorSelection = document.querySelector('input[name="color-choice"]:checked').value;
	colorLabel.innerHTML = colorSelection;
	localStorage.setItem("colorChoice", colorSelection);

	colorButtons.forEach((colorButton) => {
		colorButton.addEventListener("change", (e) => {
			colorLabel.innerHTML = e.target.value;
			localStorage.setItem("colorChoice", e.target.value);
		});
	});

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
