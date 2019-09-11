import { NOTES }from "./notes";
import { DIATONIC }from "./interval";
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
	{ formula:"1-3-4-5", 		integer:"0-4-5-7", 			name:"Added fourth", 			  		suffix:"add4"		},
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
	{ formula:"1-b3-b5-b7-9", 	integer:"0-2-3-6-10", 		name:"Minor ninth flat fifth", 			suffix:"m9b5"		},
	{ formula:"1-3-5-7-9-11", 	integer:"0-4-5-11", 		name:"Major eleventh (no fifth, no ninth)", 					suffix:"Maj11"		},
	{ formula:"1-3-5-7-9-11", 	integer:"0-4-5-7-11", 		name:"Major eleventh (no ninth)", 					suffix:"Maj11"		},
	{ formula:"1-3-5-7-9-11", 	integer:"0-2-4-5-7-11", 	name:"Major eleventh", 					suffix:"Maj11"		},
	{ formula:"1-b3-5-b7-9-11-13",integer:"0-2-3-4-6-7-10",	name:"Minor thirteen", 					suffix:"m13"		},
	{ formula:"1-3-5-b7-#11", 	integer:"0-4-6-7-10", 	 	name:"Seventh, sharp eleventh",			suffix:"7#11"		},
	{ formula:"1-3-5-7-#11", 	integer:"0-4-6-7-11", 	 	name:"Major seventh, sharp eleventh",	suffix:"Maj7#11"	},
	{ formula:"1-3-5-7-9-13", 	integer:"0-2-4-7-9-11",		name:"Major thirteen", 					suffix:"Maj13"		},
	{ formula:"1", 				integer:"0", 			  	name:"Single note", 					suffix:""			},
	{ formula:"1-5", 			integer:"0-7", 			    name:"Power chord", 					suffix:"5"			}
];

/**
* @const {Object} | Short and Long version of quality names for chords
*/
const NAMING = {
	powerchord: ["5", "5 (powerchord)"],
	major: ["Maj", "Major"],
	minor: ["min", "Minor"],
	sharp5: ["#5", "Sharp 5th"], 
	sharp11: ["#11", "Sharp 11th"],
	aug5: ["aug", "Augmented"], // +5
	dim5: ["dim", "Diminished"], // -5
	flat5: ["b5", "Flat 5th"], 
	flat9: ["b9", "Flat 9th"], 
	doubleflat5: ["bb5", "Double Flat 5th"], 
	sus2: ["sus2", "Suspended 2nd"],
	sus4: ["sus4", "Suspended 4th"],
	b6: ["b6", "Flat 6th"],
	add2: ["add2", "Added 2nd"],
	add4: ["add4", "Added 4th"],
	addflat5: ["addb5", "Added Flat 5th"],
	add9: ["add9", "Added 9th"],
	major9: ["Maj9", "Major 9"],
	nine: ["9", "9th"],
	six: ["6", "6th"],
	sixnine: ["6/9", "Six Added Ninth"],
	seven: ["7", "7th"],
	major7: ["Maj7", "Major 7th"],
	eleven: ["11", "11th"],
	thirteen: ["13", "13th"],
};

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

export function name(semitones) {
	let formula = semitones.map(i => DIATONIC[i]).filter(x => x !== undefined);
	//let count = formula.reduce((acc, item) => (acc.includes(item) ? acc[item]++ : acc(item)));
	//console.log(count);
	let count2 = formula.filter(x => ["2"].includes(x)).length; // occurence of ninth
	let has = {
		seven: formula.some(x => ["b7", "7"].includes(x)),
		third: formula.some(x => ["b3", "3"].includes(x)),
		fifth: formula.some(x => ["b5", "5", "#5"].includes(x)),
		majorNinth: formula.includes("2")  && !(!formula.some(x => ["b3", "3"].includes(x)) && count2 < 2),
	};

	// for each quality entries, check is True or False depending on the chord intervals
	let extensions = [
		{ name: "powerchord", check: formula.includes("5") && formula.every(x => ["1", "5"].includes(x)) },
		{ name: "major", check: formula.includes("3") && !formula.some(x => ["6", "4"].includes(x) || has.seven || has.majorNinth) },
		{ name: "minor", check: formula.includes("b3") },
		{ name: "aug5", check: formula.includes("#5") && formula.includes("3") && !formula.includes("5") },
		{ name: "dim5", check: formula.includes("b5") && formula.includes("b3") && !formula.includes("5") && !has.majorNinth },
		{ name: "seven", check: formula.includes("b7") && !formula.some(x => ["6", "b9", "9"].includes(x) || has.majorNinth) },
		{ name: "major7", check: formula.includes("7") && !formula.some(x => ["6", "4"].includes(x) || has.majorNinth) },
		{ name: "major9", check: has.majorNinth && formula.includes("7") && !formula.includes("6")},
		{ name: "six", check: formula.includes("6") && !has.seven },
		{ name: "nine", check: has.majorNinth && formula.includes("b7") },
		{ name: "eleven", check: formula.includes("4") && has.seven && !formula.includes("6") },
		{ name: "thirteen", check: formula.includes("6") && has.seven },
		{ name: "add2", check: has.majorNinth && has.third && !has.seven && !formula.includes("6") },
		{ name: "add4", check: has.third && formula.includes("4") && !has.seven },
		{ name: "add9", check: has.majorNinth && has.third && !has.seven },
		{ name: "sus2", check: formula.includes("2") && !has.third },
		{ name: "sus4", check: formula.includes("4") && !has.third && !has.seven },
		{ name: "sharp5", check: formula.includes("#5") && !formula.some(x => ["5", "3"].includes(x)) },
		{ name: "flat5", check: formula.includes("b5") && !formula.some(x => ["5"].includes(x)) },
		{ name: "addflat5", check: ["5", "b5"].every(x => formula.includes(x)) && !has.seven },
		{ name: "sharp11", check: ["5", "b5"].every(x => formula.includes(x)) && has.seven },
		{ name: "flat9", check: formula.includes("b2") && has.third },
		{ name: "b6", check: formula.includes("#5") && formula.includes("5") },
		{ name: "doubleflat5", check: formula.includes("4") && has.third && !has.fifth && !has.seven},
	];

	// Incompatibility table; if key/value pair appears in the extension list it should be removed
	let incompatibilities = {
		add2: "add9",
		seven: "eleven", 
		nine: "eleven",
		minor: "dim5", 
		flat5: "dim5",
		major: "aug5",
	};

	let chordExt = extensions.filter(q => q.check).map(q => q.name);

	if (chordExt.length > 0) {
		// Remove incompatible extensions 
		chordExt = chordExt.filter(q => !chordExt.includes(incompatibilities[q]));

		if (["six", "add9"].every(x => chordExt.includes(x))) {
			chordExt.splice(chordExt.indexOf("six"), 1);
			chordExt[chordExt.indexOf("add9")] = "sixnine";
		}

		return { 
			semitones: semitones,
			formula: formula,
			qualityS: chordExt.map(q => NAMING[q][0]),
			qualityL: chordExt.map(q => NAMING[q][1])
		};
	} else {
		return false;
	}
}