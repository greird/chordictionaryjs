/*!Chordictionary v0.1.0, @license MIT, (c) 2016 Hubert Fauconnier + contributors*/
(function (window) {

  'use strict';
  function define() {
    var Chordictionary = {};

/**
 * CONSTANTS––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * Shared with all functions in this lib.
*/
    /**
     * @const {Object} | Wordings (mostly displayed on error)
    */
    var WORDING = {
      invalidTab: "The tab should only be composed of \"x\" and numbers from 1 to 9.",
      invalidTuning: "The tuning doesn't seem right. It should only be composed of 1 or more letters from A to G.",
      invalidChordName: "The chord name doesn't seem right. A valid chord name could be Amin, C, Gsus4...",
      failedToConvertTabIntoNotes: "Could not convert the tab into notes.",
      failedToCalculateFormula: "Could not calculate the formulas.",
      noMatch: "The tab didn't match any known chord."
    };

    /**
     * @const {Array} | Notes in a major scale in "A".
     * Helps us identify the interval between each notes.
     * e.g: if A is the Root (1), then B is the third (3) and bD the fifth (5).
    */
    var MDL_A_SCALE = ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];

    /**
     * @const {Object} | Formulas, names and suffix for each chord quality
     * Formulas will help us identify the quality of a chord and build any chord from scratch.
     * To keep our formulas in a numeric format, we're using the integer notation
     * https://en.wikipedia.org/wiki/Pitch_class#Integer_notation
    */
    var MDL_CHORD_FORMULAS = [
    	// Major
    	{formula:"1-3-5", 				integer:"047", 			name:"Major", 												suffix:""					},
    	{formula:"1-5", 					integer:"07", 			name:"Power chord", 									suffix:"5"				},
    	{formula:"1-4-5", 				integer:"057", 			name:"Suspended fourth", 							suffix:"sus4"			},
    	{formula:"1-2-5", 				integer:"027", 			name:"Suspended second", 							suffix:"sus2"			},
    	{formula:"1-3-5-9", 			integer:"04714", 		name:"Added ninth", 									suffix:"add9"			},
    	{formula:"1-3-5-6", 			integer:"0479", 		name:"Major Sixth", 									suffix:"6"				},
    	{formula:"1-3-5-6-9", 		integer:"047914", 	name:"Sixth, added ninth", 						suffix:"6/9"			},
    	{formula:"1-3-5-7", 			integer:"04711", 		name:"Major seventh", 								suffix:"maj7"			},
    	{formula:"1-3-5-7-9", 		integer:"0471114", 	name:"Major ninth", 									suffix:"maj9"			},
    	{formula:"1-3-5-7-#11", 	integer:"0471118", 	name:"Major seventh, sharp eleventh",	suffix:"maj7#11"	},
    	{formula:"1-3-5-7-9-13", 	integer:"047111421",name:"Major thirteen", 								suffix:"Maj13"		},
    	// Minor
    	{formula:"1-b3-5", 						integer:"037", 				name:"Minor", 										suffix:"min"			},
    	{formula:"1-b3-5-9", 					integer:"03714", 			name:"Minor, added ninth", 				suffix:"m(add9)"	},
    	{formula:"1-b3-5-6", 					integer:"0379", 			name:"Minor sixth", 							suffix:"m6"				},
    	{formula:"1-b3-5-b6", 				integer:"0378", 			name:"Minor, flat sixth", 				suffix:"mb6"			},
    	{formula:"1-b3-5-6-9", 				integer:"037914", 		name:"Minor sixth, added ninth",	suffix:"m6/9"			},
    	{formula:"1-b3-5-b7", 				integer:"03710", 			name:"Minor seventh", 						suffix:"m7"				},
    	{formula:"1-b3-5-7", 					integer:"03711", 			name:"Minor, major seventh", 			suffix:"m(maj7)"	},
    	{formula:"1-b3-5-b7", 				integer:"03610", 			name:"Minor seventh, flat fifth", suffix:"m7b5"			},
    	{formula:"1-b3-5-b7-9", 			integer:"0371014", 		name:"Minor ninth", 							suffix:"m9"				},
    	{formula:"1-b3-5-7-9", 				integer:"0371114", 		name:"Minor ninth, major seventh",suffix:"m9(maj7)"	},
    	{formula:"1-b3-b5-b7-9", 			integer:"0371014", 		name:"Minor eleventh", 						suffix:"m9b5"			},
    	{formula:"1-b3-5-b7-9-11-13", integer:"03710141721",name:"Minor thirteen", 						suffix:"m13"			},
    	// Others
    	{formula:"1-3-5-b7",	integer:"04710",	name:"Dominant seventh",	suffix:"7"		},
    	{formula:"1-3-5#", 		integer:"048", 		name:"Augmented", 				suffix:"aug"	},
    	{formula:"1-3-b5", 		integer:"046", 		name:"Diminished", 				suffix:"dim"	},
    	{formula:"1", 				integer:"0", 			name:"Single note", 			suffix:""			},
    	// No fifth
    	{formula:"1-3-b7",	integer:"0410",	name:"Seventh",	suffix:"7"		},
    	{formula:"1-3-6", 	integer:"049", 	name:"Sixth", 	suffix:"6"		}
    ];

/**
 * PUBLIC METHODS––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * Theses methods can be called outside this lib.
*/

// NOTE: Include splitTab/Tuning and isValidTab/Tuning/Chord as public functions

    /** This function aims to identify the maximum information about a chord, based on its tab notation and the instrument tuning
     * @param {String} tab | Required | The chord tab
     * @param {String} tuning | Required | The instrument tuning
     * @return {Object}
    */
    Chordictionary.getChordInfo = function(tab, tuning) {

    	var notes = [],	// Notes that compose the chord.
    	intFormulas = [],	// Formulas of the chord in integer notation.
    	roots = [],	// Potential roots for the chord.
    	results = { // Will contain every chord information to be returned
    		"error": "",
    		"name": "",
    		"tab": tab,
    		"notes": "",
    		"tuning": tuning,
    		"formula": ""
    	};

    	try {
    		if (this.isValidTab(tab)) {
          var tab = splitTab(tab);
          results.tab = tab.join(' ');
        }
    	} catch (e) {
    		results.error = e;
    		return results;
    	}

    	try {
    		if(this.isValidTuning(tuning)) var tuning = splitTuning(tuning);
    	} catch (e) {
    		results.error = e;
    		return results;
    	}

      // 1 - Convert the tab into notes

    	var index,  		// Position of the note in the scale
    	stringRootNote; // Guitar string currently analysed

    	try {
    		for (var i = 0; i < tab.length; i++) {
    			// It's not a fret number
    			if (isNaN(tab[i])) {
    				notes.push("x");
    			}
    			// It's a fret number
    			else {
    				// Convert the note to the given scale and get its position
    				stringRootNote = tuning[i];
    				index = parseInt(tab[i]) + MDL_A_SCALE.indexOf(stringRootNote);
    				// Store each notes names
    				if (index > (MDL_A_SCALE.length - 1)) index = index - MDL_A_SCALE.length;
    				notes.push(MDL_A_SCALE[index]);
    			}
    		}
    		results.notes = notes.join("");
    	} catch (e) {
    		results.error = WORDING.failedToConvertTabIntoNotes;
    		return results;
    	}

      // 2 - Calculate interval between each note and get the formulas

    	var rawFormulas = [];	// Will contain calculated formulas for each potential roots

    	try {
    		// For each string
    		for (var i = 0; i < tuning.length; i++) {

    			// Add a new root/formula entry
    			rawFormulas.push({
    				root:'',
    				formula:[]
    			});

    			// Skip string if it is not played (x or undefined)
    			if (!notes[i] || notes[i] == "x") continue;

    			// For each note in the chord
    			for (var j = 0; j < notes.length; j++) {

    				// Skip if it is not a note (x or undefined)
    				if (!notes[j] || notes[j] == "x") continue;

    				// Calculate interval between notes and the potential root
    				var interval = MDL_A_SCALE.indexOf(notes[j]) - MDL_A_SCALE.indexOf(notes[i]);

    				// When an octave is reached (0), the numbers begin again at 12
    				if (interval < 0) {
    					interval = (MDL_A_SCALE.length) + interval;
    				}
    				// 0 is the root
    				else if (interval == 0) {
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

    	for (var i = 0; i < rawFormulas.length; i++) {

    		if (rawFormulas[i].root == "") continue;	// If there's no root, do not keep the formula
    		roots.push(rawFormulas[i].root);	// Store the root
    		rawFormulas[i].formula.sort(function(a,b){return a-b});

    		var unique = removeDuplicates(rawFormulas[i].formula);

    		intFormulas.push(unique.join(""));	// Store clean formulas in new array
    	}

      // 4 - Search the chordFormulas dictionary for a match

    	var dictionary,
    	formulas = [],
    	regex,
    	matches = [];

    	try {
    		for (var i = 0; i < MDL_CHORD_FORMULAS.length; i++) {
    			dictionary = MDL_CHORD_FORMULAS[i].integer;

    			for (var j = 0; j < intFormulas.length; j++) {
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
    				var uniqueformulas = removeDuplicates(formulas);
    				results.formula = uniqueformulas;
    			} else {
    				results.formula = formulas;
    			}
    		}
    		else throw WORDING.noMatch;
    	} catch (e) {
    		results.error = e;
    		return results;
    	}

      // 5 - Remove duplicates and return a list of found chords

    	if (matches.length > 1) {
    		var uniqueMatches = removeDuplicates(matches);
    		results.name = uniqueMatches;
    	} else {
    		results.name = matches;
    	}
    	return results;
    }

    /** Return a list of tabs corresponding to a given chord
     * @param {String} chordName | Required | The chord name (e.g: Amin, G, Csus4)
     * @param {String} tuning | Required | The instrument tuning
     * @param {int} limit | Optional | The number of chords to return
     * @param {int} offset | Optional | Offset to skip a given number of chords
     * @return {Array} | A list of tabs
    */
    Chordictionary.getChordsList = function(chordName, tuning, limit, offset) {

    	var chordBox = 4, // Maximum distance between the lowest and highest fretted note on the fretboard
    	chordNotes = [],	// Will contain the generated chord notes, starting with the root
    	offset = offset || 0,
      above9thFret = false, // If true, will try to generate chords above the 9th fret of the instrument
      results = {
    		error: "",
    		chordList: [],
        offset: 0
    	};

    	try {
    		if (typeof(chordName) == "string") {
    			var chordName = splitChordName(chordName);
    			var rootNote = chordName[0];	// Root note of the chord
    			var chordType = chordName[1];	// Type of chord (Min, Maj, Dom7, etc.)
    			chordNotes.push(rootNote);
    		} else throw WORDING.invalidChordName;
    		if(this.isValidTuning(tuning)) var tuning = splitTuning(tuning);
    	} catch (e) {
    		results.error = e;
    		return results;
    	}

      // 1 - Fetch the right chord formula from the dictionary
    	try {
    		var chordInfo = searchInObject(MDL_CHORD_FORMULAS, chordType);
    		var chordFormula = chordInfo.integer;
    	} catch (e) {
        results.error = e;
    		return results;
    	}

      // 2 - Identify chord's notes
    	for (var i = 1; i < chordFormula.length; i++) {
    		var index = parseInt(chordFormula[i]) + parseInt(MDL_A_SCALE.indexOf(rootNote));
    		if (index > (MDL_A_SCALE.length - 1)) index = index - MDL_A_SCALE.length;
    		chordNotes.push(MDL_A_SCALE[index]);
    	}

    	// Find the position of theses notes on the fretboard and store it in tabPool
    	var tabPool = [];
    	var fretPosition;
    	for (var string = 0; string < tuning.length; string++) {
    		tabPool[string] = [];
    		tabPool[string].push('x');
    		for (var note = 0; note < chordNotes.length; note++) {
    			fretPosition = MDL_A_SCALE.indexOf(chordNotes[note]) - MDL_A_SCALE.indexOf(tuning[string]);
    			if (fretPosition < 0) fretPosition = MDL_A_SCALE.length + fretPosition;
    			tabPool[string].push(fretPosition);
    			if (above9thFret) tabPool[string].push(fretPosition + 12); // Finding the octave
    		}
    	}

      // 3 - Combine the tabs from tabPool and store store the result in chordPool
    	var chordPool = [];
    	// For each string
    	for (var string = 0; string < tuning.length; string++) {
    		// For each potential note on this string
    		var chordPoolLength = chordPool.length;
    		for (var i = 0; i < tabPool[string].length; i++) {
    			if(chordPool[i]) {
    				for (var chordIndex = 0; chordIndex < chordPoolLength; chordIndex++) {
    					if(i === 0  ) {
    						chordPool[chordIndex].push(tabPool[string][i]);
    					}	else {
    						// On the next loop, duplicate every entry and replace the last value by the new one
    						var tempChord = chordPool[chordIndex].slice(0);
    						tempChord.pop();
    						tempChord.push(tabPool[string][i]);
    						chordPool.push(tempChord);
    					}
    				}
    			}
    			else {
    				chordPool[i] = [tabPool[string][i]];
    			}
    		}
    	}

      // 4 - Post processing to remove invalid or unwanted chords from the pool
    	// NOTE: Here we apply a series of checks to sort the chord list by basic chords, triads, powerchords, "barrés", etc.
    	var validChords = [];
    	for (var iChord = offset; iChord < chordPool.length; iChord++) {
    		// 1. If the composition of the chord is wrong
    		// 2. If the gap between the highest and lowest fret of the chord is two wide
    		if (isValidChord(chordPool[iChord], chordNotes, tuning)
    		&& (arrayFind(chordPool[iChord], "max") - arrayFind(chordPool[iChord], "min")) < chordBox) {
    			// Find the basic chords :
    			for (var i = 0; i < chordPool[iChord].length; i++) {
    				if (isNaN(chordPool[iChord][i])) continue;
    				var noteIndex = chordPool[iChord][i] + MDL_A_SCALE.indexOf(tuning[i]);
    				if (chordPool[iChord][i] <= 4	// Note is is below the 4th fret.
    					&& MDL_A_SCALE.indexOf(rootNote) == noteIndex // It's the root !
    					&& chordPool[iChord].lastIndexOf("x") < i) // No mutted string after the root.
    				{
    					validChords.push(chordPool[iChord]);
    					break;
    				} else {
    					break;
    				}
    			}
    			// If limit is reached, stop the loop and store the current inden
    			if (limit > 0 && limit < chordPool[iChord].length && validChords.length >= limit) {
    				offset = iChord + 1;
    				break;
    			}
    		}
    	}

      results.chordList = validChords;
      results.offset = offset;
    	return results;
    }

    /** Converts a tab notation into its graphic representation
     * @param {String} name | Optional | The chord name
     * @param {String} tab | Required | The tab notation
     * @param {String} tuning | Required | The instrument tuning
     * @return {String}
    */
    Chordictionary.getChordLayout = function(name, tab, tuning, fretsToDisplay) {

    	var frets,	// used guitar frets for this chord
    	chordLayout,	// will contain the chord layout in html
    	fretsToDisplay = (!isNaN(fretsToDisplay)) ? fretsToDisplay : 0;	// number of guitar frets to dipslay

    	try {
    		if (this.isValidTab(tab)) var frets = splitTab(tab);
        else var frets = [0,0,0,0,0,0];
        if(this.isValidTuning(tuning)) var tuning = splitTuning(tuning)
        else var tuning = ['E','A','D','G','B','E'];
    	} catch (e) {
    		return false;
    	}

    	// exclude non-played strings from the chord notation
    	var notes = [];
    	for (var i = 0; i < frets.length; i++) {
    		if (isNaN(frets[i]) === false) notes.push(frets[i]);
    	}
    	// calculate the highest fret to display
    	var highestFret = Math.abs(Math.max.apply(Math, notes));
    	// Make sure the graphic starts at the first fret when it is in range or move up the neck if necessary
    	var base = 1;
    	if (highestFret > fretsToDisplay) base = Math.abs(Math.min.apply(Math, notes) - 1);
    	// base can be wrong in case of open strings, we're using the highest note to fix that
    	if (base === 1 && highestFret > 5) base = highestFret - 3;

      // Enable auto-resize of the chord layout
      if (fretsToDisplay === 0) fretsToDisplay = highestFret - base + 2;

    	chordLayout = '<table class="chord">';
    	// Generate guitar frets (rows)
    	for (var gtrFret = 0; gtrFret < fretsToDisplay; gtrFret++) {

    		var fretNumber = gtrFret + base - 1; // Fret number to be displayed

    		if (base == 1 && gtrFret == 0) chordLayout += '<thead>';
    		if (fretNumber % 2 && fretNumber > 0) chordLayout += '<tr><th class="fret-number">' + fretNumber + '</th>';
    		else chordLayout += '<tr><th></th>'; // exclude fret number column

    		// Generate 6 strings (cols) for the current fret
    		for (var gtrString = 0; gtrString < tuning.length; gtrString++) {
    			if (gtrFret == 0) {
    				if (frets[gtrString] == 0) chordLayout += '<th><div class="dot open"></div></th>';
    				else chordLayout += '<th></th>';
    			}
    			else {
    				if (frets[gtrString] == (base + gtrFret - 1)) chordLayout += '<td><div class="dot plain">'+ frets[gtrString] +'</div></td>';
    				else chordLayout += '<td></td>';
    			}
    		}

    		if (base == 1 && gtrFret == 0) chordLayout += '<tr></thead>';
    		else chordLayout += '</tr>';

    	}
    	chordLayout += '<caption align="bottom">' + name + '</caption>';
    	chordLayout += '</table>';

    	//console.log(frets + ' => base: ' + base + ' => highest fret: ' + highestFret);

    	return chordLayout;
    }

    /** Return true if tab contains only digits or the letter x
    * @param {String} tuning | Required | The instrument tuning
    * @return {Boolean}
    */
    Chordictionary.isValidTab = function(tab) {
      var pattern = new RegExp("^[x0-9]*$", "i");
      if (pattern.test(tab)) {
        return true;
      } else {
        throw WORDING.invalidTab;
        return false;
      }
    }

    /** Return true if tuning contains only letters from A to G
     * @param {String} tuning | Required | The instrument tuning
     * @return {Boolean}
    */
    Chordictionary.isValidTuning = function(tuning) {
      var pattern = new RegExp("^[#a-g]+$", "i");
      if (pattern.test(tuning)) {
        return true;
      } else {
        throw WORDING.invalidTuning;
        return false;
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

      var result, index, notesCount = {};

      for (var iFret = 0; iFret < tab.length; iFret++) {
        if (isNaN(tab[iFret])) continue;
        index = tab[iFret] + MDL_A_SCALE.indexOf(tuning[iFret]);
        if (index > (MDL_A_SCALE.length - 1)) index = index - MDL_A_SCALE.length;
        for (var iNote = 0; iNote < chordNotes.length; iNote++) {
          if (!notesCount[MDL_A_SCALE[index]]) notesCount[MDL_A_SCALE[index]] = 1;
          else if (MDL_A_SCALE[index] == MDL_A_SCALE[iNote]) notesCount[MDL_A_SCALE[index]]++;
        }
      }
      // If every note has appeared at least once, chord is valid
      for (var iNote = 0; iNote < chordNotes.length; iNote++) {
        if (chordNotes[iNote] in notesCount) result = true;
        else {
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
      var tuning = tuning || "EADGBE";
      var tabArray = [];
      try {
        if (tab.length <= tuning.length) return tab.split("");
        else if (tab.length == tuning.length * 2) {
          for (var i = 0; i < tab.length; i++) {
             if (!(i % 2)) tabArray.push(tab.slice(i, i+2));
          }
          return tabArray;
        }
        else if (tab.length > tuning.length) {
          if (arrayFind(tab.split(""), "max") > 1) {
            // NOTE: Split after each caracter from [2-9]
            for (var i = 0; i < tab.length; i++) {
              if (tab.charAt(i).search(/[x02-9]/i) != -1
                || (tab.charAt(i) == 1 && tab.charAt(i+1).search(/x/i) != -1))
              {
                tabArray.push(tab.slice(i, i+1));
              }
              else if (tab.charAt(i+1).search(/x/i) == -1) {
                tabArray.push(tab.slice(i, i+2));
                i++;
              }
            }
            return tabArray;
          } else throw WORDING.invalidTab;
        }
      } catch (e) {
        return false;
      }
    }

    /** Split tuning into notes
     * @param {String} tuning | Required | The tuning of the instrument (e.g: "EADGBE" or "E#A#D#G#B#E#")
     * @return {Array} | Containing each note
    */
    function splitTuning(tuning) {
      var tuningArray = [];
      var noSharps = new RegExp("^[a-g]+$", "i");
      var containSharps = new RegExp("^[#a-g]+$", "i");
      try {
        if (noSharps.test(tuning)) return tuning.toUpperCase().split("");
        else if (containSharps.test(tuning)) {
          tuning = tuning.toUpperCase();
          for (var i = 0; i < tuning.length; i++) {
            if (tuning.charAt(i) != "#") {
              if (tuning.charAt(i+1) != "#") tuningArray.push(tuning.slice(i, i+1));
              else {
                tuningArray.push(tuning.slice(i, i+2));
                i++;
              }
            }
          }
          return tuningArray;
        }
        else throw WORDING.invalidTuning;
      } catch (e) {
        return false;
      }
    }

    /** Separates the chord root from the chord nature/quality;
     * @param {String} chordName | The chord name (e.g: Amin7);
     * @return {Array} | Containing the chord root [0] and the chord quality [1];
    */
    function splitChordName(chordName) {
      var root;
      var quality;
      try {
        if(typeof(chordName) != "string") throw WORDING.invalidChordName;
        else {
          var sharp = chordName.search("#");
          if(sharp == -1) {
            root = chordName.charAt(0);
            quality = chordName.slice(1);
          } else {
            root = chordName.slice(0, 2).toUpperCase();
            quality = chordName.slice(2);
          }
          return [root, quality];
        }
        return result;
      } catch (e) {
        return false;
      }
    }

    /** Remove duplicates from an array;
     * @param {Array} | A simple array;
     * @return {Array} | An array with no duplicates;
    */
    function removeDuplicates(arr) {
      try {
        if (Array.isArray(arr)) var arr = arr;
        else throw arr + " is not an array.";
        return arr.filter(function(elem, index, self) {
          return index == self.indexOf(elem);
        });
      } catch (e) {
        return false;
      }
    }

    /** Search for a keyword inside an object
     * @param {Object} obj | The object to search in
     * @param {String} keyword | The string to search for
     * @return {Object} | Complete entry if found (NOT case sensitive)
     * @return {Boolean} | false if no result
    */
    function searchInObject(obj, keyword) {
      try {
        if(typeof obj === "object") {
          var obj = obj;
          if(typeof keyword == "string") var keyword = keyword.toLowerCase();
          for (var i = 0; i < obj.length; i++) {
            for (var key in obj[i]) {
              if (obj[i][key] == keyword) return obj[i];
              else if(typeof obj[i][key] == "string") {
                if (obj[i][key].toLowerCase() == keyword) return obj[i];
              }
            }
          }
          throw "Couldn't find " + keyword + " in " + obj;
        } else {
          throw obj +' is not an object.';
        }
        return false;
      } catch (e) {
        return false;
      }
    }

    /** Find the minimum/maximum int in an array ignoring any NaN value OR Find an occurrences of a keyword in an array
     * @return {Boolean} or {Int}
     * @param {Array} arr | Required | An array;
     * @param {String} what | Required | "min" or "max" or a keyword to search for
    */
    function arrayFind(arr, what) {
      var result;

      try {

        if (Array.isArray(arr)) var arr = arr;
        else throw arr + " is not an array.";

        if (what) var what = what;
        else throw "Missing parameter.";

        switch (what) {
          case "min":
          result = Math.min.apply(Math, arr);
          if(!isNaN(result)) return result;
          else {
            for (var i = 0; i < arr.length; i++) {
              if (isNaN(arr[i])) continue;
              else {
                if (isNaN(result)) {
                  result = arr[i];
                  continue;
                } else {
                  if (arr[i] < result) result = arr[i];
                  else continue;
                }
              }
            }
          }
          break;
          case "max":
          result = Math.max.apply(Math, arr);
          if(!isNaN(result)) return result;
          else {
            for (var i = 0; i < arr.length; i++) {
              if (isNaN(arr[i])) continue;
              else {
                if (isNaN(result)) {
                  result = arr[i];
                  continue;
                } else {
                  if (arr[i] > result) result = arr[i];
                  else continue;
                }
              }
            }
          }
          break;
          default:
            result = occurrences(arr.join(""), what);
          break;
        }

      } catch (e) {
        return false;
      }

      return result;
    }

    /** Function count the occurrences of substring in a string;
     * @param {String} string   Required. The string;
     * @param {String} subString    Required. The string to search for;
     * @param {Boolean} allowOverlapping    Optional. Default: false;
     * @author Vitim.us http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
     */
    function occurrences(string, subString, allowOverlapping) {
        string += "";
        subString += "";
        if (subString.length <= 0) return (string.length + 1);

        var n = 0,
            pos = 0,
            step = allowOverlapping ? 1 : subString.length;

        while (true) {
            pos = string.indexOf(subString, pos);
            if (pos >= 0) {
                ++n;
                pos += step;
            } else break;
        }
        return n;
    }

    /** Count the number of occurrences of every items in an array
     * @param {Array} array | Required
     * @return {Object}
     */
    function countOccurences(array) {
      if (Array.isArray(array)) {
        var result = {};
        for(i = 0; i < array.length; ++i) {
            if(!result[array[i]])
                result[array[i]] = 0;
            ++result[array[i]];
        }
        return result;
      } else throw array + " is not an array.";
    }

    return Chordictionary;
  }

  if (typeof(Chordictionary) === 'undefined') {
    window.Chordictionary = define();
  } else console.error();("Chordictionary is already defined.");

})(window);
