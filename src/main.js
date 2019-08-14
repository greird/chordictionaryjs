/**Chordictionary v0.1.0-alpha.2, @license MIT, (c) 2016 Hubert Fauconnier + contributors*/

import { WORDING } from "./wordings";
import { MDL_A_SCALE } from "./scales";
import { MDL_CHORD_FORMULAS } from "./chords";
import { splitTuning, splitChordName } from "./parser";
import { removeDuplicates, searchInObject, arrayFind, occurrences, countOccurences } from "./tools";

class Instrument {

	/** Constructor class
	* @param {String} tuning | Required | The instrument tuning
	* @param {Int} fretNumber | Required | The instrument frets number
	* @param {Int} fretsToDisplay | Optional | The number of frets to be displayed when printing a chord, default 0 (auto-resize)
	* @param {Int} maxSpan | Optional | The maximum number of frets that can be played in one chord, default 5
	*/
	constructor (tuning, fretNumber, fretsToDisplay, maxSpan) {
		try {
			if(this.isValidTuning(tuning)) this.tuning = splitTuning(tuning);
			this.fretNumber = fretNumber;
			this.fretsToDisplay = (!isNaN(fretsToDisplay)) ? fretsToDisplay + 1 : 0;
			this.maxSpan = (!isNaN(maxSpan)) ? maxSpan : 4;
		} catch (e) {
			console.error(e);
			return false;
		}
		return this;
	}

	/** This function aims to identify the maximum information about a chord, based on its tab notation and the instrument tuning
	* @param {String} tab | Required | The chord tab
	* @return {Object}
	*/
	getChordInfo (tab) {
		let notes = [],	// Notes that compose the chord.
			intFormulas = [],	// Formulas of the chord in integer notation.
			roots = [],	// Potential roots for the chord.
			results = { // Will contain every chord information to be returned
				"error": "",
				"name": "",
				"tab": tab,
				"notes": "",
				"tuning": this.tuning.join(""),
				"formula": ""
			};

		try {
			if (this.isValidTab(tab)) {
				tab = splitTab(tab);
			}
		} catch (e) {
			results.error = e;
			return results;
		}

		// 1 - Convert the tab into notes

		let index,  		// Position of the note in the scale
			stringRootNote; // Guitar string currently analysed

		try {
			for (let i = 0; i < tab.length; i++) {
				// If it's not a fret number, else it IS a fret number
				if (isNaN(tab[i])) {
					notes.push("x");
				} else {
					// Convert the note to the given scale and get its position
					stringRootNote = this.tuning[i];
					index = parseInt(tab[i]) + MDL_A_SCALE.indexOf(stringRootNote);
					// Store each notes names
					if (index > (MDL_A_SCALE.length - 1)) {
						index = index - MDL_A_SCALE.length;
					}
					notes.push(MDL_A_SCALE[index]);
				}
			}
			results.notes = notes.join("");
		} catch (e) {
			results.error = WORDING.failedToConvertTabIntoNotes;
			return results;
		}

		// 2 - Calculate interval between each note and get the formulas

		let rawFormulas = [];	// Will contain calculated formulas for each potential roots

		try {
			// For each string
			for (let i = 0; i < this.tuning.length; i++) {
				// Add a new root/formula entry
				rawFormulas.push({
					root:"",
					formula:[]
				});

				// Skip string if it is not played (x or undefined)
				if (!notes[i] || notes[i].toLowerCase() === "x") {
					continue;
				}

				// For each note in the chord
				for (let j = 0; j < notes.length; j++) {
					// Skip if it is not a note (x or undefined)
					if (!notes[j] || notes[j].toLowerCase() === "x") {
						continue;
					}

					// Calculate interval between notes and the potential root
					let interval = MDL_A_SCALE.indexOf(notes[j]) - MDL_A_SCALE.indexOf(notes[i]);

					// When an octave is reached (0), the numbers begin again at 12
					if (interval < 0) {
						interval = (MDL_A_SCALE.length) + interval;
					} else if (interval === 0) { 
						// 0 is the root
						rawFormulas[i].root = notes[j];
					}

					// Store the formula
					rawFormulas[i].formula.push(interval);
				}
			}
		} catch (e) {
			results.error = WORDING.failedToCalculateFormula;
		}

		// 3 - Remove duplicates and invalid formulas

		for (let i = 0; i < rawFormulas.length; i++) {

			if (rawFormulas[i].root === "") {
				continue;	// If there's no root, do not keep the formula
			}
			roots.push(rawFormulas[i].root);	// Store the root
			rawFormulas[i].formula.sort(function(a,b) {
				return a-b;
			});

			let unique = removeDuplicates(rawFormulas[i].formula);

			intFormulas.push(unique.join("-"));	// Store clean formulas in new array
		}

		// 4 - Search the chordFormulas dictionary for a match

		let dictionary,
			formulas = [],
			regex,
			matches = [];

		try {
			for (let i = 0; i < MDL_CHORD_FORMULAS.length; i++) {
				dictionary = MDL_CHORD_FORMULAS[i].integer;

				for (let j = 0; j < intFormulas.length; j++) {
					regex = new RegExp("^"+intFormulas[j]+"$", "g");
					// Record the match if the root has been identified
					if (dictionary.match(regex) && roots[j]) {
						matches.push(roots[j] + MDL_CHORD_FORMULAS[i].suffix);
						formulas.push(MDL_CHORD_FORMULAS[i].formula);
					}
				}
			}

			if (formulas.length > 0) {
				if (formulas.length > 1) {
					let uniqueformulas = removeDuplicates(formulas);
					results.formula = uniqueformulas;
				} else {
					results.formula = formulas;
				}
			} else {
				throw WORDING.noMatch;
			}
		} catch (e) {
			results.error = e;
			return results;
		}

		// 5 - Remove duplicates and return a list of found chords

		if (matches.length > 1) {
			let uniqueMatches = removeDuplicates(matches);
			results.name = uniqueMatches;
		} else {
			results.name = matches;
		}
		return results;
	}

	/** Return a list of tabs corresponding to a given chord
	* @param {String} chordName | Required | The chord name (e.g: Amin, G, Csus4)
	* @param {int} limit | Optional | The number of chords to return
	* @param {int} offset | Optional | Offset to skip a given number of chords
	* @return {Array} | A list of tabs
	*/
	getChordsList (chordName, limit, offset) {

		offset = offset || 0;

		let	chordNotes = [],	// Will contain the generated chord notes, starting with the root
			chordType,	// Type of chord (Min, Maj, Dom7, etc.)
			chordInfo,
			chordFormula = [],
			rootNote,	// Root note of the chord
			rootIndex,
			results = {
				error: "",
				chordList: [],
				offset: 0
			};

		// We define a chord "anatomy" for each type of chord we want to recognize
		const CHORD_TYPE = {
			// FIXME: rootIsLowestNote prevents a standard D chord to be tagged
			basic: {
				rootBelow4thFret: true,
				noMuteAfterFirstNote: true,
				rootIsLowestNote: true,
				splittedChord: false,
				openString: true
			},	
			powerchord: {
				frettedNotes: [2, 3],
				rootIsLowestNote: true,
				rootOnLowestFret: true,
				splittedChord: false,
				openString: false
			},	
			// FIXME: chordAnatomy.rootIsLowestNote && chordAnatomy.rootOnLowestFret ==> Prevent some valid bar chords to be tagged..
			bar: {
				rootIsLowestNote: true,
				rootOnLowestFret: true,
				barredString: [3, 6],
				noMuteAfterFirstNote: true,
				splittedChord: false,
				openString: false
			}
		};

		// 1 - Fetch the right chord formula from the dictionary
		try {
			if (typeof(chordName) === "string") {
				chordName = splitChordName(chordName);
				rootNote = chordName[0];	// Root note of the chord
				chordType = chordName[1];	// Type of chord (Min, Maj, Dom7, etc.)
				chordNotes.push(rootNote);
				rootIndex = MDL_A_SCALE.indexOf(rootNote);
			} else {
				throw WORDING.invalidChordName;
			}

			chordInfo = searchInObject(MDL_CHORD_FORMULAS, chordType);
			chordFormula = chordInfo.integer.split("-");
		} catch (e) {
			results.error = WORDING.invalidChordName;
			return results;
		}

		// 2 - Identify chord's notes
		// NOTE: Doesn't work with formulas containing integers > 9
		for (let i = 1; i < chordFormula.length; i++) {
			let index = parseInt(chordFormula[i]) + parseInt(rootIndex);
			if (index > (MDL_A_SCALE.length - 1)) {
				index = index - MDL_A_SCALE.length;
			}
			chordNotes.push(MDL_A_SCALE[index]);
		}

		// Find the position of theses notes on the fretboard and store it in tabPool
		let tabPool = [],
			fretPosition, 
			string = 0;

		for (string = 0; string < this.tuning.length; string++) {
			tabPool[string] = [];
			tabPool[string].push("x");
			for (let note = 0; note < chordNotes.length; note++) {
				fretPosition = MDL_A_SCALE.indexOf(chordNotes[note]) - MDL_A_SCALE.indexOf(this.tuning[string]);
				if (fretPosition < 0) {
					fretPosition = MDL_A_SCALE.length + fretPosition;
				}
				tabPool[string].push(fretPosition);
				if (fretPosition + 12 < this.fretNumber) {
					tabPool[string].push(fretPosition + 12);
				}
			}
		}

		// 3 - Combine the tabs from tabPool and store store the result in chordPool
		let chordPool = [];
		// For each string
		for (string = 0; string < this.tuning.length; string++) {
			// For each potential note on this string
			let chordPoolLength = chordPool.length;
			for (let i = 0; i < tabPool[string].length; i++) {
				if(chordPool[i]) {
					for (let chordIndex = 0; chordIndex < chordPoolLength; chordIndex++) {
						if(i === 0  ) {
							chordPool[chordIndex].push(tabPool[string][i]);
						} else {
							// On the next loop, duplicate every entry and replace the last value by the new one
							let tempChord = chordPool[chordIndex].slice(0);
							tempChord.pop();
							tempChord.push(tabPool[string][i]);
							chordPool.push(tempChord);
						}
					}
				} else {
					chordPool[i] = [tabPool[string][i]];
				}
			}
		}

		// 4 - Post processing to remove invalid chords from the pool and sort them by categories

		let validChords = [];

		let haveSameAnatomy = (model, source) => {

			for (let statement in model) {

				if (source.hasOwnProperty(statement)) {

					if (typeof(model[statement]) === "object") {
						let min = model[statement][0],
							max = model[statement][1];

						if (source[statement] < min || source[statement] > max) {
							return false;
						}

					} else if (source[statement] !==  model[statement]) {
						return false;
					}
				} else {
					return false;
				}
			}
			return true;
		};

		try {
			for (let iChord = offset; iChord < chordPool.length; iChord++) {

				// Only if the composition of the chord is right and if the gap between the highest and lowest fret of the chord is ok
				if (isValidChord(chordPool[iChord], chordNotes, this.tuning)
					&& (arrayFind(chordPool[iChord], "max") - arrayFind(chordPool[iChord], "min")) < this.maxSpan) {

					let chordAnatomy = {
							openString: false,
							frettedNotes: 0
						},
						stringTab = chordPool[iChord].join(""),
						splittedChordPattern = /[0-9]+[x]+[0-9]+/gi,
						muteAfterFirstNotePattern = /[0-9]+[x]+/gi;

					// Check if there's any mutted string in the middle of the chord
					if (splittedChordPattern.test(stringTab)) {
						chordAnatomy.splittedChord = true;
					} else {
						chordAnatomy.splittedChord = false;
					}

					// Check if there's any mutted string after the first note
					if (muteAfterFirstNotePattern.test(stringTab)) {
						chordAnatomy.noMuteAfterFirstNote = false;
					} else {
						chordAnatomy.noMuteAfterFirstNote = true;
					}

					// For each note of the chord
					for (let i = 0; i < chordPool[iChord].length; i++) {
						let noteFret = chordPool[iChord][i];

						if (!isNaN(noteFret)) {
							let noteIndex = noteFret + MDL_A_SCALE.indexOf(this.tuning[i]);
							
							if (noteFret === 0) chordAnatomy.openString = true;

							// It's the root !
							if (rootIndex === noteIndex) {
								if (chordAnatomy.frettedNotes === 0) {
									chordAnatomy.rootIsLowestNote = true;
								}
								chordAnatomy.rootBelow4thFret = (noteFret <= 4) ? true : false;
								chordAnatomy.rootOnLowestFret = (arrayFind(chordPool[iChord], "min") >= noteFret) ? true : false;
							}

							// Check for consecutive fretted notes
							if ((noteFret > 0 && i < chordPool[iChord].length - 1 && noteFret === chordPool[iChord][i-1])
								|| arrayFind(chordPool[iChord], noteFret) >= 3) {
								chordAnatomy.barredString = !isNaN(chordAnatomy.barredString) ? (chordAnatomy.barredString + 1) : 1;
							}

							chordAnatomy.frettedNotes++;
						}
					}

					// Sort and filter the chords according to the previously defined criterias

					let thisChord = {
						tab: chordPool[iChord], 
						tag:[]
					};

					Object.getOwnPropertyNames(CHORD_TYPE).forEach((type, index) => {
						if (haveSameAnatomy(CHORD_TYPE[type], chordAnatomy) && thisChord.tag.indexOf(type)) {
							thisChord.tag.push(type);
						}
					});

					validChords.push(thisChord); // Add the chord to the list
				}

				// If limit is reached, stop the loop and store the current index
				if (limit > 0 && limit < chordPool[iChord].length && validChords.length === limit) {
					offset = iChord + 1;
					break;
				}
			}
		} catch (e) {
			console.error(e);
		}

		results.chordList = validChords;
		results.offset = offset;
		return results;
	}

	/** Converts a tab notation into its graphic representation
	* @param {String} name | Optional | The chord name
	* @param {String} tab | Required | The tab notation
	* @return {String}
	*/
	getChordLayout (name, tab) {

		let frets,	// used guitar frets for this chord
			chordLayout,	// will contain the chord layout in html
			fretsToDisplay = this.fretsToDisplay;

		try {
			if (this.isValidTab(tab)) {
				frets = splitTab(tab);
			} else {
				frets = [0,0,0,0,0,0];
			}
		} catch (e) {
			return false;
		}

		// exclude non-played strings from the chord notation
		let notes = [];
		for (let i = 0; i < frets.length; i++) {
			if (isNaN(frets[i]) === false) {
				notes.push(frets[i]);
			}
		}

		let // calculate the highest and lowest frets to display
			highestFret = Math.abs(Math.max.apply(Math, notes)),
			lowestFret =  Math.abs(Math.min.apply(Math, notes));

		// Make sure the graphic starts at the first fret when it is in range or move up the neck if necessary
		let base = 1;
		if (highestFret >= fretsToDisplay) {
			base = (lowestFret > 0 ? lowestFret : 1);
		}

		// base can be wrong in case of open strings, we're using the highest note to fix that
		if (base === 1 && highestFret > 5) {
			base = highestFret - fretsToDisplay + 2;
		}

		// Enable auto-resize of the chord layout
		// FIXME: in case of open string, if tab doesn't fit in the layout it should throw an error but doesn't.
		try {

			if (fretsToDisplay === 0) {
				fretsToDisplay = highestFret - base + 2;

			} else if (highestFret - base + 1 > fretsToDisplay - 1) {
				fretsToDisplay = highestFret - base + 2;
				throw WORDING.croppedChordLayout;
			}
		} catch (e) {
			console.error(e);
		}

		chordLayout = '<table class="chord">';
		// Generate guitar frets (rows)
		for (let gtrFret = 0; gtrFret < fretsToDisplay; gtrFret++) {

			let fretNumber = gtrFret + base - 1; // Fret number to be displayed

			if (base === 1 && gtrFret === 0) {
				chordLayout += "<thead>";
			}
			if (fretNumber % 2 && fretNumber > 0) {
				chordLayout += '<tr><th class="fret-number">' + fretNumber + "</th>";
			} else {
				chordLayout += "<tr><th></th>"; // exclude fret number column
			}

			// Generate 6 strings (cols) for the current fret
			for (let gtrString = 0; gtrString < this.tuning.length; gtrString++) {
				// TODO: the parseInt check should be done in splitTab(), thus this var declaration would be useless
				let fretOnString = parseInt(frets[gtrString]);

				if (gtrFret === 0) {

					if (fretOnString === 0) {
						chordLayout += '<th><div class="dot open"></div></th>';
					} else {
						chordLayout += "<th></th>";
					}
				} else if (fretOnString === (base + gtrFret - 1)) {
					chordLayout += '<td><div class="dot plain">'+ frets[gtrString] +"</div></td>";
				} else {
					chordLayout += "<td></td>";
				}
			}

			if (base === 1 && gtrFret === 0) {
				chordLayout += "<tr></thead>";
			} else {
				chordLayout += "</tr>";
			}
		}
		chordLayout += '<caption align="bottom">' + name + "</caption>";
		chordLayout += "</table>";

		//console.log(frets + " => base: " + base + " => highest fret: " + highestFret);

		return chordLayout;
	}

	/** Return true if tab contains only digits or the letter x
	* @param {String} tab | Required | The tab to check for validity
	* @return {Boolean}
	*/
	isValidTab (tab) {
		let pattern = new RegExp("^[x0-9]*$", "i");
		if (pattern.test(tab)) {
			return true;
		} else {
			throw WORDING.invalidTab;
		}
	}

	/** Return true if tuning contains only letters from A to G
	* @param {String} tuning | Required | The instrument tuning
	* @return {Boolean}
	*/
	isValidTuning (tuning) {
		let pattern = new RegExp("^[#a-g]+$", "i");
		if (pattern.test(tuning)) {
			return true;
		} else {
			throw WORDING.invalidTuning;
		}
	}
}

/**
* PRIVATE FUNCTIONS –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
* Theses functions can only be used inside the lib.
*/
/** Check if a chord tab correspond to the chord notes composition
* @param {Array} tab | Required | The chord tab
* @param {Array} chordNotes | Required | The chord notes
* @param {Array} tuning | Required | The instrument tuning
* @return {Boolean}
*/
function isValidChord(tab, chordNotes, tuning) {
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
		index = tab[i] + MDL_A_SCALE.indexOf(tuning[i]);

		if (index > (MDL_A_SCALE.length - 1)) {
			index = index - MDL_A_SCALE.length;
		}

		for (let j = 0; j < chordNotes.length; j++) {

			if (!notesCount[MDL_A_SCALE[index]]) {
				notesCount[MDL_A_SCALE[index]] = 1;
			} else if (MDL_A_SCALE[index] === MDL_A_SCALE[j]) {
				notesCount[MDL_A_SCALE[index]]++;
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

/** Split the tab into frets
* @param {String} tab | Required | The tab to be splitted (e.g: "x32010" or "911111099");
* @param {String} tuning | Optional | The tuning of the instrument (e.g: "EADGBE")
* @return {Array} | Containing each fret
*/
function splitTab(tab, tuning) {
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

export { Instrument };
