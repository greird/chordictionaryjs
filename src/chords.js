import { NOTES }from "./notes";
import { WORDING } from "./wordings";

/**
* @const {Object} | Formulas, names and suffix for each chord quality
* Formulas will help us identify the quality of a chord and build any chord from scratch.
* To keep our formulas in a numeric format, we're using the integer notation
* https://en.wikipedia.org/wiki/Pitch_class#Integer_notation
*/
export const FORMULAS = [			
	{ formula:"1-3-5",			integer:"0-4-7", 			name:"Major", 							suffix:""			},
	{ formula:"1-3-5#", 		integer:"0-4-8", 			name:"Augmented", 						suffix:"aug"		},
	{ formula:"1-b3-b5", 		integer:"0-3-6",    		name:"Diminished", 						suffix:"dim"		},
	{ formula:"1-b3-5", 		integer:"0-3-7", 			name:"Minor", 							suffix:"min"		},
	{ formula:"1-b3-5-9", 		integer:"0-2-3-7", 			name:"Minor, added ninth", 			  	suffix:"m(add9)"	},
	{ formula:"1-4-5", 			integer:"0-5-7", 			name:"Suspended fourth", 				suffix:"sus4"		},
	{ formula:"1-2-5", 			integer:"0-2-7", 			name:"Suspended second", 				suffix:"sus2"		},
	{ formula:"1-3-5-9", 		integer:"0-2-4-7", 	   		name:"Added ninth", 					suffix:"add9"		},
	{ formula:"1-3-b7",			integer:"0-4-10",			name:"Seventh",							suffix:"7"			},
	{ formula:"1-3-5-b7",		integer:"0-4-7-10",			name:"Dominant seventh",				suffix:"7"			},
	{ formula:"1-3-5-7", 		integer:"0-4-7-11", 	   	name:"Major seventh", 					suffix:"Maj7"		},
	{ formula:"1-b3-5-7", 		integer:"0-3-7-11",         name:"Minor, major seventh", 		  	suffix:"m(Maj7)"	},
	{ formula:"1-b3-5-b7", 		integer:"0-3-7-10", 		name:"Minor seventh", 					suffix:"m7"			},
	{ formula:"1-b3-b5-b7", 	integer:"0-3-6-10", 		name:"Minor seventh, flat fifth",  		suffix:"m7b5"		},
	{ formula:"1-3-6", 			integer:"0-4-9", 			name:"Sixth",							suffix:"6"			},
	{ formula:"1-b3-5-6", 		integer:"0-3-7-9", 			name:"Minor sixth", 					suffix:"m6"			},
	{ formula:"1-b3-5-b6", 		integer:"0-3-7-8", 			name:"Minor, flat sixth", 				suffix:"mb6"		},
	{ formula:"1-b3-5-6-9", 	integer:"0-2-3-7-9", 		name:"Minor sixth, added ninth",   		suffix:"m6/9"		},
	{ formula:"1-3-5-6", 		integer:"0-4-7-9", 		   	name:"Major Sixth", 					suffix:"Maj6"		},
	{ formula:"1-3-5-6-9", 		integer:"0-2-4-7-9",    	name:"Sixth, added ninth", 				suffix:"6/9"		},
	{ formula:"1-3-5-7-9", 		integer:"0-2-4-7-11", 	 	name:"Major ninth", 					suffix:"Maj9"		},
	{ formula:"1-b3-5-b7-9", 	integer:"0-2-3-7-10", 		name:"Minor ninth",                		suffix:"m9"			},
	{ formula:"1-b3-5-7-9", 	integer:"0-2-3-7-11", 		name:"Minor ninth, major seventh", 		suffix:"m9(Maj7)"	},
	{ formula:"1-b3-b5-b7-9", 	integer:"0-2-3-6-10", 		name:"Minor eleventh", 					suffix:"m9b5"		},
	//{ formula:"1-3-5-7-11", 	integer:"", 				name:"Major eleventh", 					suffix:"11"			},
	//{ formula:"1-3-5-7-9-11", 	integer:"", 				name:"Major eleventh", 					suffix:"11"			},
	{ formula:"1-b3-5-b7-9-11-13",integer:"0-2-3-4-6-7-10",	name:"Minor thirteen", 					suffix:"m13"		},
	{ formula:"1-3-5-b7-#11", 	integer:"0-4-6-7-10", 	 	name:"Seventh, sharp eleventh",			suffix:"7#11"		},
	{ formula:"1-3-5-7-#11", 	integer:"0-4-6-7-11", 	 	name:"Major seventh, sharp eleventh",	suffix:"Maj7#11"	},
	{ formula:"1-3-5-7-9-13", 	integer:"0-2-4-7-9-11",		name:"Major thirteen", 					suffix:"Maj13"		},
	//{ formula:"1-3-5-7-9-11-13", 	integer:"0-2-4-7-9-11",		name:"Major thirteen", 					suffix:"Maj13"		},
	//{ formula:"1-3-5-7-13", 	integer:"0-2-4-7-9-11",		name:"Major thirteen", 					suffix:"Maj13"		},
	//{ formula:"1-3-5-7-11-13", 	integer:"0-2-4-7-9-11",		name:"Major thirteen", 					suffix:"Maj13"		},
	{ formula:"1", 				integer:"0", 			  	name:"Single note", 					suffix:""			},
	{ formula:"1-5", 			integer:"0-7", 			    name:"Power chord", 					suffix:"5"			}
];

/** Check if a chord tab correspond to the chord notes composition
* @param {Array} tab | Required | The chord tab
* @param {Array} chordNotes | Required | The chord notes
* @param {Array} tuning | Required | The instrument tuning
* @return {Boolean}
*/
export function isValid(tab, chordNotes, tuning) {
	// TODO: check if tab is valid
	// TODO: check if notes is valid (valid tuning)
	// TODO: make it work with tabs and notes
	// TODO: add param to check for triads, open strings, etc.

	let result, 
		index,
		notesCount = {};

	for (let i = 0; i < tab.length; i++) {

		if (isNaN(tab[i])) {
			continue;
		}
		index = tab[i] + NOTES.indexOf(tuning[i]);

		if (index > (NOTES.length - 1)) {
			index = index - NOTES.length;
		}

		for (let j = 0; j < chordNotes.length; j++) {

			if (!notesCount[NOTES[index]]) {
				notesCount[NOTES[index]] = 1;
			} else if (NOTES[index] === NOTES[j]) {
				notesCount[NOTES[index]]++;
			}
		}
	}
	// If every note has appeared at least once, chord is valid
	for (let i = 0; i < chordNotes.length; i++) {
		if (chordNotes[i] in notesCount) {
			result = true;
		} else {
			result = false;
			break;
		}
	}
	return result;
}

/** Separates the chord root from the chord nature/quality;
* @param {String} chordName | The chord name (e.g: Amin7);
* @return {Array} | Containing the chord root [0] and the chord quality [1];
*/
export function parse(chordName) {
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

/** Find an integer formula "0-4-7" in the formula dictionary and return all available information
* @param {Array} intFormula | Required | The list of deduplicated semitones for the chord (e.g. [0, 4, 7])
* @return {Object}
*/
export function find(intFormula) {
	let integers = intFormula.join("-"),
		dictionary,
		regex;

	for (let i = 0; i < FORMULAS.length; i++) {
		dictionary = FORMULAS[i].integer;

		regex = new RegExp("^"+integers+"$", "g");

		if (dictionary.match(regex)) {
			return FORMULAS[i];
		}
	}

	return false;
}

/** Find duplicated entries in the matches array based on the integer formula
* @param {Array} matches | Required | The matches array generated in main.js
* @return {Array} The indexes of the diplicated entries
*/
export function dedupMatches(matches) {
	let haystack = [...matches];
	let seen = [];
	let duplicates = [];

	for (let i = 0; i < haystack.length; i++) {
		let needle = haystack[i].semitones.filter(n => (n != null)).join("");
		if (seen.includes(needle)) {
			duplicates.push(i);
		} else {
			seen.push(needle);
		}
	}
	return duplicates;
}