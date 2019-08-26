import { WORDING } from "./wordings";
import { NOTES } from "./notes";
import { removeDuplicates, arrayFind } from "./tools";
import * as INTERVAL from "./interval";

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

/** Split the tab into frets
* @param {String} tab | Required | The tab to be splitted (e.g: "x32010" or "911111099");
* @param {String} tuning | Optional | The tuning of the instrument (e.g: "EADGBE")
* @return {Array} | Containing each fret
*/
export function parse(tab, tuning) {
	tab = tab.toLowerCase();
	tuning = tuning || "EADGBE";

	let tabArray = []; 

	if (tab.length <= tuning.length) {
		return tab.split("");
	} else if (tab.length === tuning.length * 2) {

		for (let i = 0; i < tab.length; i++) {
			if (!(i % 2)) {
				tabArray.push(tab.slice(i, i+2));
			}
		}
		return tabArray;

	} else if (tab.length > tuning.length) {

		if (arrayFind(tab.split(""), "max") > 1) {
			// NOTE: Split after each caracter from [2-9]
			for (let i = 0; i < tab.length; i++) {

				if (tab.charAt(i).search(/[x02-9]/i) !== -1 || (tab.charAt(i) === 1 && tab.charAt(i+1).search(/x/i) !== -1)) {
					tabArray.push(tab.slice(i, i+1));

				} else if (tab.charAt(i+1).search(/x/i) === -1) {
					tabArray.push(tab.slice(i, i+2));
					i++;
				}
			}
			return tabArray;
		} else {
			throw WORDING.invalidTab;
		}
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
			index = parseInt(tab[i]) + NOTES.indexOf(stringRootNote);
			// Store each notes names
			if (index > (NOTES.length - 1)) {
				index = index - NOTES.length;
			}
			notes.push(NOTES[index]);
		}
	}
	return notes;
}

/** Return all the possible formulas in integer notation for a given tab such as [null, 0, 4, 0, 4, 7]
* The integer formula is the list of semitones interval between the root and a given note.
* @param {array} notes | Required | A list of all the notes of the chord (from lowest to highest note) 
* @return {object}
*/
export function getSemitones(notes) {
	let semitones = [];	// Raw formulas for each potential roots

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
				formula.push(null);
				continue;
			}

			let interval = INTERVAL.get(notes[i], notes[j]);

			// Store the formula
			formula.push(interval);
		}
		// Store the formula inly if it has a root
		if (formula.includes(0)) semitones.push(formula);
	}
	return semitones;
}

/** Return a simplified formula such as [0, 4, 7] from [null, 0, 4, 0, 4, 7]
* @param {array} rawFormula | Required | The raw integer formula such as [null, 0, 4, 0, 4, 7]
* @return {object}
*/
export function stripFormula(array) {
	let strippedFormula = [...array];
	strippedFormula = strippedFormula.filter(interval => (!isNaN(interval) && interval != null));
	return removeDuplicates(strippedFormula.sort(function(a,b) { 
		return a-b; 
	}));
}