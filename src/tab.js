import { WORDING } from "./wordings";
import * as SCALE from "./scales";

/** Return true if tab contains only digits or the letter x
* @param {String} tab | Required | The tab to check for validity
* @return {Boolean}
*/
export function isValid (tab) {
	let pattern = new RegExp("^[x0-9]*$", "i");
	if (pattern.test(tab)) {
		return true;
	} else {
		throw WORDING.invalidTab;
	}
}

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