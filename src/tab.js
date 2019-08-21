import * as SCALE from "./scales";
import { removeDuplicates } from "./tools";

/** Return true if tab contains only digits or the letter x
* @param {String} tab | Required | The tab to check for validity
* @return {Boolean}
*/
export function isValid (tab) {
	let pattern = new RegExp("^[x0-9]*$", "i");
	if (pattern.test(tab)) {
		return true;
	} else {
		return false;
	}
}

/** Return a list of notes for a given tab (from lowest to highest note)
* @param {array} tab | Required | The tab to convert to notes
* @param {array} tuning | Required | The tuning of the instrument
* @return {array}
*/
export function toNotes(tab, tuning) {
	let index,  		// Position of the note in the scale
		stringRootNote, // Guitar string currently analysed
		notes = [];

	for (let i = 0; i < tab.length; i++) {
		// If it's not a fret number, else it IS a fret number
		if (isNaN(tab[i])) {
			notes.push("x");
		} else {
			// Convert the note to the given scale and get its position
			stringRootNote = tuning[i];
			index = parseInt(tab[i]) + SCALE.A.indexOf(stringRootNote);
			// Store each notes names
			if (index > (SCALE.A.length - 1)) {
				index = index - SCALE.A.length;
			}
			notes.push(SCALE.A[index]);
		}
	}
	return notes;
}

/** Return all the possible formulas in integer notation for a given tab such as [X, 0, 4, 0, 4, 7]
* @param {array} notes | Required | A list of all the notes of the chord (from lowest to highest note) 
* @return {object}
*/
export function getIntegerNotation(notes) {
	let integers = [];	// Raw formulas for each potential roots

	// For each string, consider a root and calculate intervals to get a formula
	for (let i = 0; i < notes.length; i++) {
		var formula = [];

		// Skip string if it is not played (x or undefined) as it can't be the root
		if (!notes[i] || notes[i].toLowerCase() === "x") {
			continue;
		}

		// For each note in the chord
		for (let j = 0; j < notes.length; j++) {
			// if it is not a note, there's no interval, push "x"
			if (!notes[j] || notes[j].toLowerCase() === "x") {
				formula.push("x");
				continue;
			}

			let interval = SCALE.getInterval(notes[i], notes[j]);

			// Store the formula
			formula.push(interval);
		}
		// Store the formula inly if it has a root
		if (formula.includes(0)) integers.push(formula);
	}
	return integers;
}

/** Return a simplified formula such as [0, 4, 7] from [X, 0, 4, 0, 4, 7]
* @param {array} rawFormula | Required | The raw integer formula such as [X, 0, 4, 0, 4, 7]
* @return {object}
*/
export function stripFormula(array) {
	let strippedFormula = array.slice(0);
	strippedFormula = strippedFormula.filter(interval => !isNaN(interval));
	return removeDuplicates(strippedFormula.sort(function(a,b) { return a-b; }));
}