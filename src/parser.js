import { WORDING } from "./wordings";

/** Split tuning into notes
* @param {String} tuning | Required | The tuning of the instrument (e.g: "EADGBE" or "E#A#D#G#B#E#")
* @return {Array} | Containing each note
*/
export function splitTuning(tuning) {
	let tuningArray = [],
		noSharps = new RegExp("^[a-g]+$", "i"),
		containSharps = new RegExp("^[#a-g]+$", "i");

	if (noSharps.test(tuning)) {
		return tuning.toUpperCase().split("");

	} else if (containSharps.test(tuning)) {
		tuning = tuning.toUpperCase();

		for (let i = 0; i < tuning.length; i++) {

			if (tuning.charAt(i) !== "#") {

				if (tuning.charAt(i+1) !== "#") {
					tuningArray.push(tuning.slice(i, i+1));
				} else {
					tuningArray.push(tuning.slice(i, i+2));
					i++;
				}
			}
		}
		return tuningArray;
	} else {
		throw WORDING.invalidTuning;
	}
}

/** Separates the chord root from the chord nature/quality;
* @param {String} chordName | The chord name (e.g: Amin7);
* @return {Array} | Containing the chord root [0] and the chord quality [1];
*/
export function splitChordName(chordName) {
	let root, 
		quality;

	try {
		if(typeof(chordName) !== "string") {
			throw WORDING.invalidChordName;
		} else {
			let sharp = chordName.search("#");

			if (sharp === -1) {
				root = chordName.charAt(0);
				quality = chordName.slice(1);
			} else {
				root = chordName.slice(0, 2).toUpperCase();
				quality = chordName.slice(2);
			}
			return [root, quality];
		}
	} catch (e) {
		return false;
	}
}