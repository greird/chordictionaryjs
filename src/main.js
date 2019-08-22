/**Chordictionary v0.1.0-alpha.2, @license MIT, (c) 2016 Hubert Fauconnier + contributors*/

import { WORDING } from "./wordings";
import * as SCALE from "./scales";
import * as CHORD from "./chords";
import * as TUNING from "./tuning";
import * as TAB from "./tab";
import * as PARSER from "./parser";
import * as TOOLS from "./tools";

class Instrument {

	/** Constructor class
	* @param {String} tuning | Required | The instrument tuning
	* @param {Int} fretNumber | Required | The instrument frets number
	* @param {Int} fretsToDisplay | Optional | The number of frets to be displayed when printing a chord, default 0 (auto-resize)
	* @param {Int} maxSpan | Optional | The maximum number of frets that can be played in one chord, default 5
	*/
	constructor (tuning, fretNumber, fretsToDisplay, maxSpan) {
		try {
			if(TUNING.isValid(tuning)) {
				this.tuning = PARSER.splitTuning(tuning);
			} else {
				throw WORDING.invalidTuning;
			}
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
			semitones = [],	// Formulas of the chord in integer notation.
			formulas = "", // simplified formula (e.g "1-3-5")
			matches = [], // entries that match the formula in the dictionary
			results = { // Will contain every chord information to be returned
				"error": "",
				"tab": [],
				"notes": "",
				"tuning": this.tuning,
				"chords": []
			};

		try {
			if (TAB.isValid(tab)) {
				tab = PARSER.splitTab(tab);
				results.tab = tab;
			} else {
				throw WORDING.invalidTab;
			}
		} catch (e) {
			results.error = e;
			return results;
		}

		// 1 - Convert the tab into notes
		try {
			notes = TAB.toNotes(tab, this.tuning);
			results.notes = [...notes];
		} catch (e) {
			results.error = WORDING.failedToConvertTabIntoNotes;
			return results;
		}

		// 2 - Calculate interval between each note and get the formulas
		try {
			semitones = TAB.getSemitones(notes);
		} catch (e) {
			results.error = WORDING.failedToCalculateFormula;
			return results;
		}

		formulas = semitones.map(TAB.stripFormula);

		// 3 - Search the formulas dictionary for a match

		try {
			for (let i = 0; i < formulas.length; i++) {
				let match = CHORD.find(formulas[i]);
				if (match) {
					matches.push({ 
						"formula":match.formula, 
						"integer":match.integer, 
						"semitones": [...semitones][i],
						"name":match.name, 
						"suffix":match.suffix });
				}
			}

			if (matches.length > 0) {
				let duplicatesIndex = CHORD.dedupMatches(matches);
				matches = matches.filter((currentValue, index) => !duplicatesIndex.includes(index));
			} else {
				throw WORDING.noMatch;
			}
		} catch (e) {
			results.error = e;
			return results;
		}

		// 4 - Build the results object

		for (let r of matches) {

			var root = notes[r.semitones.indexOf(0)];

			results.chords.push({
				"name": root + r.suffix,
				"pitch": root,
				"formula": r.formula,
				"intervals": SCALE.convertIntToDiatonic(r.semitones),
				"semitones": r.semitones,
				"notes": [...notes],
				"quality": r.name,
				"suffix": r.suffix
			});
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
				chordName = PARSER.splitChordName(chordName);
				rootNote = chordName[0];	// Root note of the chord
				chordType = chordName[1];	// Type of chord (Min, Maj, Dom7, etc.)
				chordNotes.push(rootNote);
				rootIndex = SCALE.A.indexOf(rootNote);
			} else {
				throw WORDING.invalidChordName;
			}

			chordInfo = TOOLS.searchInObject(CHORD.FORMULAS, chordType);
			chordFormula = chordInfo.integer.split("-");
		} catch (e) {
			results.error = WORDING.invalidChordName;
			return results;
		}

		// 2 - Identify chord's notes
		// NOTE: Doesn't work with formulas containing integers > 9
		for (let i = 1; i < chordFormula.length; i++) {
			let index = parseInt(chordFormula[i]) + parseInt(rootIndex);
			if (index > (SCALE.A.length - 1)) {
				index = index - SCALE.A.length;
			}
			chordNotes.push(SCALE.A[index]);
		}

		// Find the position of theses notes on the fretboard and store it in tabPool
		let tabPool = [],
			fretPosition, 
			string = 0;

		for (string = 0; string < this.tuning.length; string++) {
			tabPool[string] = [];
			tabPool[string].push("x");
			for (let note = 0; note < chordNotes.length; note++) {
				fretPosition = SCALE.A.indexOf(chordNotes[note]) - SCALE.A.indexOf(this.tuning[string]);
				if (fretPosition < 0) {
					fretPosition = SCALE.A.length + fretPosition;
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
				
				if (Object.prototype.hasOwnProperty.call(source, statement)) {

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
				if (CHORD.isValid(chordPool[iChord], chordNotes, this.tuning)
					&& (TOOLS.arrayFind(chordPool[iChord], "max") - TOOLS.arrayFind(chordPool[iChord], "min")) < this.maxSpan) {

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
					} else {
						chordAnatomy.splittedChord = false;
					}

					// Check if there's any mutted string after the first note
					if (muteAfterFirstNotePattern.test(stringTab)) {
						chordAnatomy.noMuteAfterFirstNote = false;
					} else {
						chordAnatomy.noMuteAfterFirstNote = true;
					}

					// For each note of the chord
					for (let i = 0; i < chordPool[iChord].length; i++) {
						let noteFret = chordPool[iChord][i];

						if (!isNaN(noteFret)) {
							let noteIndex = noteFret + SCALE.A.indexOf(this.tuning[i]);
							
							if (noteFret === 0) chordAnatomy.openString = true;

							// It's the root !
							if (rootIndex === noteIndex) {
								if (chordAnatomy.frettedNotes === 0) {
									chordAnatomy.rootIsLowestNote = true;
								}
								chordAnatomy.rootBelow4thFret = (noteFret <= 4) ? true : false;
								chordAnatomy.rootOnLowestFret = (TOOLS.arrayFind(chordPool[iChord], "min") >= noteFret) ? true : false;
							}

							// Check for consecutive fretted notes
							if ((noteFret > 0 && i < chordPool[iChord].length - 1 && noteFret === chordPool[iChord][i-1])
								|| TOOLS.arrayFind(chordPool[iChord], noteFret) >= 3) {
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

					Object.getOwnPropertyNames(CHORD_TYPE).forEach((type) => {
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
	* @param {String} tab | Required | The tab notation
	* @param {Object} options | Optional | the easiest way is to pass a chord Object (e.g. getChordInfo("X32010").chords[0])
	* @return {String}
	*/
	getChordLayout (tab, options) {

		let frets,	// used guitar frets for this chord
			chordLayout,	// will contain the chord layout in html
			fretsToDisplay = this.fretsToDisplay;

		try {
			if (TAB.isValid(tab)) {
				frets = PARSER.splitTab(tab);
			} else {
				frets = [0,0,0,0,0,0];
			}
		} catch (e) {
			return false;
		}

		let fretsLabel = options.notes ? options.notes : frets,	
			chordLabel = options.name ? options.name : frets.join(" ");

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

			// Generate n strings (cols) for the current fret
			for (let gtrString = 0; gtrString < this.tuning.length; gtrString++) {
				// TODO: the parseInt check should be done in PARSER.splitTab(), thus this var declaration would be useless
				let fretOnString = parseInt(frets[gtrString]);

				if (gtrFret === 0) {

					if (fretOnString === 0) {
						chordLayout += '<th><div class="dot open"></div></th>';
					} else {
						chordLayout += "<th></th>";
					}
				} else if (fretOnString === (base + gtrFret - 1)) {
					chordLayout += '<td><div class="dot plain">'+ fretsLabel[gtrString] +"</div></td>";
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
		chordLayout += '<caption align="bottom">' + chordLabel + "</caption>";
		chordLayout += "</table>";

		//console.log(frets + " => base: " + base + " => highest fret: " + highestFret);

		return chordLayout;
	}
}

const isValidTab = TAB.isValid;
const isValidTuning = TUNING.isValid;

export { 
	Instrument,
	isValidTab, 
	isValidTuning
};
