/**Chordictionary v0.1.0-alpha.2, @license MIT, (c) 2016 Hubert Fauconnier + contributors*/
(function (window) {

  "use strict";
  function define() {
/**
 * CONSTANTS––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * Shared with all functions in this lib.
*/
    /**
     * @const {Object} | Wordings (mostly displayed on error)
    */
    const WORDING = {
      croppedChordLayout: "Number of frets does not allow full display of the chord.",
      failedToConvertTabIntoNotes: "Could not convert the tab into notes.",
      failedToCalculateFormula: "Could not calculate the formulas.",
      invalidTab: "The tab should only be composed of \"x\" and numbers from 1 to 9.",
      invalidTuning: "The tuning doesn't seem right. It should only be composed of 1 or more letters from A to G.",
      invalidChordName: "The chord name doesn't seem right. A valid chord name could be Amin, C, Gsus4...",
      noMatch: "The tab didn't match any known chord."
    };

    /**
     * @const {Array} | Notes in a major scale in "A".
     * Helps us identify the interval between each notes.
     * e.g: if A is the Root (1), then B is the third (3) and bD the fifth (5).
    */
    const MDL_A_SCALE = ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];

    /**
     * @const {Object} | Formulas, names and suffix for each chord quality
     * Formulas will help us identify the quality of a chord and build any chord from scratch.
     * To keep our formulas in a numeric format, we're using the integer notation
     * https://en.wikipedia.org/wiki/Pitch_class#Integer_notation
    */
    const MDL_CHORD_FORMULAS = [
    	// Major
    	{formula:"1-3-5", 				integer:"0-4-7", 			   name:"Major", 												suffix:""					},
    	{formula:"1-5", 					integer:"0-7", 			     name:"Power chord", 									suffix:"5"				},
    	{formula:"1-4-5", 				integer:"0-5-7", 			   name:"Suspended fourth", 						suffix:"sus4"			},
    	{formula:"1-2-5", 				integer:"0-2-7", 			   name:"Suspended second", 						suffix:"sus2"			},
    	{formula:"1-3-5-9", 			integer:"0-4-7-14", 	   name:"Added ninth", 									suffix:"add9"			},
    	{formula:"1-3-5-6", 			integer:"0-4-7-9", 		   name:"Major Sixth", 									suffix:"6"				},
    	{formula:"1-3-5-6-9", 		integer:"0-4-7-9-14",    name:"Sixth, added ninth", 					suffix:"6/9"			},
    	{formula:"1-3-5-7", 			integer:"0-4-7-11", 	   name:"Major seventh", 								suffix:"maj7"			},
    	{formula:"1-3-5-7-9", 		integer:"0-4-7-11-14", 	 name:"Major ninth", 									suffix:"maj9"			},
    	{formula:"1-3-5-7-#11", 	integer:"0-4-7-11-18", 	 name:"Major seventh, sharp eleventh",suffix:"maj7#11"	},
    	{formula:"1-3-5-7-9-13", 	integer:"0-4-7-11-14-21",name:"Major thirteen", 							suffix:"Maj13"		},
    	// Minor
    	{formula:"1-b3-5", 						integer:"0-3-7", 				      name:"Minor", 										 suffix:"min"			},
    	{formula:"1-b3-5-9", 					integer:"0-3-7-14", 			    name:"Minor, added ninth", 			   suffix:"m(add9)"	},
    	{formula:"1-b3-5-6", 					integer:"0-3-7-9", 			      name:"Minor sixth", 							 suffix:"m6"			},
    	{formula:"1-b3-5-b6", 				integer:"0-3-7-8", 			      name:"Minor, flat sixth", 				 suffix:"mb6"			},
    	{formula:"1-b3-5-6-9", 				integer:"0-3-7-9-14", 		    name:"Minor sixth, added ninth",   suffix:"m6/9"		},
    	{formula:"1-b3-5-b7", 				integer:"0-3-7-10", 			    name:"Minor seventh", 					   suffix:"m7"			},
    	{formula:"1-b3-5-7", 					integer:"0-3-7-11",           name:"Minor, major seventh", 		   suffix:"m(maj7)"	},
    	{formula:"1-b3-5-b7", 				integer:"0-3-6-10", 			    name:"Minor seventh, flat fifth",  suffix:"m7b5"		},
    	{formula:"1-b3-5-b7-9", 			integer:"0-3-7-10-14", 		    name:"Minor ninth",                suffix:"m9"			},
    	{formula:"1-b3-5-7-9", 				integer:"0-3-7-11-14", 		    name:"Minor ninth, major seventh", suffix:"m9(maj7)"},
    	{formula:"1-b3-b5-b7-9", 			integer:"0-3-7-10-14", 		    name:"Minor eleventh", 					   suffix:"m9b5"		},
    	{formula:"1-b3-5-b7-9-11-13", integer:"0-3-7-10-14-17-21",  name:"Minor thirteen", 				     suffix:"m13"			},
    	// Others
    	{formula:"1-3-5-b7",	integer:"0-4-7-10",	name:"Dominant seventh",	suffix:"7"		},
    	{formula:"1-3-5#", 		integer:"0-4-8", 		name:"Augmented", 				suffix:"aug"	},
    	{formula:"1-3-b5", 		integer:"0-4-6",    name:"Diminished", 				suffix:"dim"	},
    	{formula:"1", 				integer:"0", 			  name:"Single note", 			suffix:""			},
    	// No fifth
    	{formula:"1-3-b7",	integer:"0-4-10",	name:"Seventh",	suffix:"7"		},
    	{formula:"1-3-6", 	integer:"0-4-9", 	name:"Sixth", 	suffix:"6"		}
    ];

/**
 * PUBLIC METHODS––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
 * Theses methods can be called outside this lib.
*/
    var Chordictionary = {};

    /** Constructor class
    * @param {String} tuning | Required | The instrument tuning
    * @param {Int} fretNumber | Required | The instrument frets number
    * @param {Int} fretsToDisplay | Optional | The number of frets to be displayed when printing a chord, default 0 (auto-resize)
    * @param {Int} maxSpan | Optional | The maximum number of frets that can be played in one chord, default 5
    */
    Chordictionary.Instrument = function (tuning, fretNumber, fretsToDisplay, maxSpan) {
      try {
    		if(Chordictionary.isValidTuning(tuning)) this.tuning = splitTuning(tuning);
        this.fretNumber = fretNumber;
        this.fretsToDisplay = (!isNaN(fretsToDisplay)) ? fretsToDisplay + 1 : 0;
        this.maxSpan = (!isNaN(maxSpan)) ? maxSpan : 4;
    	} catch (e) {
        console.error(e);
    		return false;
    	}
      return this;
    };

    /** This function aims to identify the maximum information about a chord, based on its tab notation and the instrument tuning
     * @param {String} tab | Required | The chord tab
     * @return {Object}
    */
    Chordictionary.Instrument.prototype.getChordInfo = function(tab) {

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
    		if (Chordictionary.isValidTab(tab)) {
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
    			// It's not a fret number
    			if (isNaN(tab[i])) {
    				notes.push("x");
    			}
    			// It's a fret number
    			else {
    				// Convert the note to the given scale and get its position
    				stringRootNote = this.tuning[i];
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
    				}
    				// 0 is the root
    				else if (interval === 0) {
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

    		if (rawFormulas[i].root === "") continue;	// If there's no root, do not keep the formula
    		roots.push(rawFormulas[i].root);	// Store the root
    		rawFormulas[i].formula.sort(function(a,b){return a-b;});

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
    		}
    		else throw WORDING.noMatch;
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
    };

    /** Return a list of tabs corresponding to a given chord
     * @param {String} chordName | Required | The chord name (e.g: Amin, G, Csus4)
     * @param {int} limit | Optional | The number of chords to return
     * @param {int} offset | Optional | Offset to skip a given number of chords
     * @return {Array} | A list of tabs
    */
    Chordictionary.Instrument.prototype.getChordsList = function(chordName, limit, offset) {

      offset = offset || 0;

    	let	chordNotes = [],	// Will contain the generated chord notes, starting with the root
      chordType,	// Type of chord (Min, Maj, Dom7, etc.)
      chordFormula = [],
      rootNote,	// Root note of the chord
      rootIndex,
      results = {
    		error: "",
    		chordList: [],
        offset: 0
    	};

      // 1 - Fetch the right chord formula from the dictionary
    	try {
    		if (typeof(chordName) === "string") {
    			chordName = splitChordName(chordName);
    			rootNote = chordName[0];	// Root note of the chord
    			chordType = chordName[1];	// Type of chord (Min, Maj, Dom7, etc.)
    			chordNotes.push(rootNote);
          rootIndex = MDL_A_SCALE.indexOf(rootNote);
    		} else throw WORDING.invalidChordName;

    		let chordInfo = searchInObject(MDL_CHORD_FORMULAS, chordType);
    		chordFormula = chordInfo.integer.split("-");
    	} catch (e) {
        results.error = WORDING.invalidChordName;
    		return results;
    	}

      // 2 - Identify chord's notes
      // NOTE: Doesn't work with formulas containing integers > 9
    	for (let i = 1; i < chordFormula.length; i++) {
    		let index = parseInt(chordFormula[i]) + parseInt(rootIndex);
    		if (index > (MDL_A_SCALE.length - 1)) index = index - MDL_A_SCALE.length;
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
    			if (fretPosition < 0) fretPosition = MDL_A_SCALE.length + fretPosition;
    			tabPool[string].push(fretPosition);
          if (fretPosition + 12 < this.fretNumber) tabPool[string].push(fretPosition + 12);
    		}
    	}

      // 3 - Combine the tabs from tabPool and store store the result in chordPool
    	let chordPool = [];
    	// For each string
    	for (string = 0; string < this.tuning.length; string++) {
    		// For each potential note on this string
    		var chordPoolLength = chordPool.length;
    		for (let i = 0; i < tabPool[string].length; i++) {
    			if(chordPool[i]) {
    				for (let chordIndex = 0; chordIndex < chordPoolLength; chordIndex++) {
    					if(i === 0  ) {
    						chordPool[chordIndex].push(tabPool[string][i]);
    					}	else {
    						// On the next loop, duplicate every entry and replace the last value by the new one
    						let tempChord = chordPool[chordIndex].slice(0);
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

      // 4 - Post processing to remove invalid chords from the pool and sort them by categories
      let validChords = [];
      try {
      	for (var iChord = offset; iChord < chordPool.length; iChord++) {

          // Here are all the criterias to check in order to sort the chord list by basic chords, triads, powerchords, "barrés", etc.
          var chordAnatomy = {
            rootBelow4thFret:false,
            rootIsLowestNote:false,
            rootOnLowestFret:false,
            noMuteAfterFirstNote:false,
            openString:false,
            barredString:0,
            frettedNotes:0,
            splittedChord:false
          };

      		// Only if the composition of the chord is right and if the gap between the highest and lowest fret of the chord is ok
      		if (isValidChord(chordPool[iChord], chordNotes, this.tuning)
      		  && (arrayFind(chordPool[iChord], "max") - arrayFind(chordPool[iChord], "min")) < this.maxSpan) {

      			// For each note of the chord
      			for (let i = 0; i < chordPool[iChord].length; i++) {
      				if (!isNaN(chordPool[iChord][i])) {
        				var noteIndex = chordPool[iChord][i] + MDL_A_SCALE.indexOf(this.tuning[i]);

                // It's the root !
                if (rootIndex === noteIndex) {
                  if (chordAnatomy.frettedNotes === 0) chordAnatomy.rootIsLowestNote = true;
                  if (chordPool[iChord][i] <= 4) chordAnatomy.rootBelow4thFret = true;
                  if (arrayFind(chordPool[iChord], "min") >= chordPool[iChord][i]) chordAnatomy.rootOnLowestFret = true;
                }

                if (chordPool[iChord].lastIndexOf("x") < i) chordAnatomy.noMuteAfterFirstNote = true;
                if (chordPool[iChord][i] === 0) chordAnatomy.openString = true;

                // Check for consecutive fretted notes
                if ((chordPool[iChord][i] > 0 && i < chordPool[iChord].length - 1 && chordPool[iChord][i] === chordPool[iChord][i-1])
                  || arrayFind(chordPool[iChord], chordPool[iChord][i]) >= 3) {
                  chordAnatomy.barredString++;
                }

                chordAnatomy.frettedNotes++;
              } else {

                // Check if there's any mutted string in the middle of the chord
                if (i > 0 && i < chordPool[iChord].length - 1
                  && ((chordPool[iChord][i+1] !== "x" && chordPool[iChord][i-1] !== "x")
                  || (chordPool[iChord].lastIndexOf("x") > 0 && chordPool[iChord].lastIndexOf("x") < chordPool[iChord].length - 1))) {
                  chordAnatomy.splittedChord = true;
                }
              }
      			}

            // Sort and filter the chords according to the previously defined criterias
            // TODO: Refactoring needed here !! There's probably a faster way to do this..

            let chordId = validChords.length;
            let tags = [];
            validChords.push({tab: chordPool[iChord], tag:[]});

            // Basic chord
            if (chordAnatomy.rootBelow4thFret
              && chordAnatomy.noMuteAfterFirstNote
              && chordAnatomy.rootIsLowestNote // FIXME: Prevent a standard D chord to be tagged
              && !chordAnatomy.splittedChord) {
              if (chordAnatomy.barredString >= 1) {
                if (chordAnatomy.rootOnLowestFret) if (tags.indexOf("basic")) tags.push("basic");
              } else if (tags.indexOf("basic")) tags.push("basic");
            }

            // Powerchord
            // FIXME: This doesn't work at all !!
            if (!chordAnatomy.noMuteAfterFirstNote
              && chordAnatomy.frettedNotes <= 3
              && chordAnatomy.rootIsLowestNote
              && chordAnatomy.rootOnLowestFret
              && !chordAnatomy.splittedChord
              && !chordAnatomy.openString) if (tags.indexOf("powerchord")) tags.push("powerchord");

            // Bar chord
            // FIXME: chordAnatomy.rootIsLowestNote && chordAnatomy.rootOnLowestFret ==> Prevent some valid bar chords to be tagged..
            if (chordAnatomy.rootIsLowestNote
              && chordAnatomy.rootOnLowestFret
              && chordAnatomy.barredString >= 1
              && chordAnatomy.noMuteAfterFirstNote
              && !chordAnatomy.splittedChord
              && !chordAnatomy.openString) if (tags.indexOf("bar")) tags.push("bar");

            // Apply the tags
            if (tags.length) validChords[chordId].tag = tags;
          }

          // If limit is reached, stop the loop and store the current index
          if (limit > 0 && limit < chordPool[iChord].length && validChords.length >= limit) {
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
    };

    /** Converts a tab notation into its graphic representation
     * @param {String} name | Optional | The chord name
     * @param {String} tab | Required | The tab notation
     * @return {String}
    */
    Chordictionary.Instrument.prototype.getChordLayout = function(name, tab) {

    	let frets,	// used guitar frets for this chord
    	 chordLayout,	// will contain the chord layout in html
    	 fretsToDisplay = this.fretsToDisplay;

    	try {
    		if (Chordictionary.isValidTab(tab)) {
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

    	// calculate the highest and lowest frets to display
    	let highestFret = Math.abs(Math.max.apply(Math, notes));
      let lowestFret =  Math.abs(Math.min.apply(Math, notes));

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
        }	else {
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
    			}	else {

    				if (fretOnString === (base + gtrFret - 1)) {
              chordLayout += '<td><div class="dot plain">'+ frets[gtrString] +"</div></td>";
            }	else {
              chordLayout += "<td></td>";
            }
    			}
    		}

    		if (base === 1 && gtrFret === 0) {
          chordLayout += "<tr></thead>";
        }	else {
          chordLayout += "</tr>";
        }

    	}
    	chordLayout += '<caption align="bottom">' + name + "</caption>";
    	chordLayout += "</table>";

    	//console.log(frets + " => base: " + base + " => highest fret: " + highestFret);

    	return chordLayout;
    };

    /** Return true if tab contains only digits or the letter x
    * @param {String} tab | Required | The tab to check for validity
    * @return {Boolean}
    */
    Chordictionary.isValidTab = function(tab) {
      let pattern = new RegExp("^[x0-9]*$", "i");
      if (pattern.test(tab)) {
        return true;
      } else {
        throw WORDING.invalidTab;
      }
    };

    /** Return true if tuning contains only letters from A to G
     * @param {String} tuning | Required | The instrument tuning
     * @return {Boolean}
    */
    Chordictionary.isValidTuning = function(tuning) {
      let pattern = new RegExp("^[#a-g]+$", "i");
      if (pattern.test(tuning)) {
        return true;
      } else {
        throw WORDING.invalidTuning;
      }
    };

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

      let result, index, iNote, notesCount = {};

      for (let iFret = 0; iFret < tab.length; iFret++) {

        if (isNaN(tab[iFret])) {
          continue;
        }
        index = tab[iFret] + MDL_A_SCALE.indexOf(tuning[iFret]);

        if (index > (MDL_A_SCALE.length - 1)) {
          index = index - MDL_A_SCALE.length;
        }

        for (iNote = 0; iNote < chordNotes.length; iNote++) {

          if (!notesCount[MDL_A_SCALE[index]]) {
            notesCount[MDL_A_SCALE[index]] = 1;

          } else if (MDL_A_SCALE[index] === MDL_A_SCALE[iNote]) {
            notesCount[MDL_A_SCALE[index]]++;
          }
        }
      }
      // If every note has appeared at least once, chord is valid
      for (iNote = 0; iNote < chordNotes.length; iNote++) {
        if (chordNotes[iNote] in notesCount) {
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

    /** Split tuning into notes
     * @param {String} tuning | Required | The tuning of the instrument (e.g: "EADGBE" or "E#A#D#G#B#E#")
     * @return {Array} | Containing each note
    */
    function splitTuning(tuning) {
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
    function splitChordName(chordName) {
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
      if (!Array.isArray(arr)) {
        throw arr + " is not an array.";
      } else {
        return arr.filter(function(elem, index, self) {
          return index === self.indexOf(elem);
        });
      }
    }

    /** Search for a keyword inside an object
     * @param {Object} obj | The object to search in
     * @param {String} keyword | The string to search for
     * @return {Object} | Complete entry if found (NOT case sensitive)
     * @return {Boolean} | false if no result
    */
    function searchInObject(obj, keyword) {
        if(typeof obj === "object") {
          if(typeof keyword === "string") {
            keyword = keyword.toLowerCase();
          }

          for (let i = 0; i < obj.length; i++) {

            for (let key in obj[i]) {

              if (obj[i][key] === keyword) {
                return obj[i];

              } else if(typeof obj[i][key] === "string") {

                if (obj[i][key].toLowerCase() === keyword) {
                  return obj[i];
                }
              }
            }
          }
          throw "Couldn't find " + keyword + " in " + obj;
        } else {
          throw obj +" is not an object.";
        }
    }

    /** Find the minimum/maximum int in an array ignoring any NaN value OR Find an occurrences of a keyword in an array
     * @return {Boolean} or {Int}
     * @param {Array} arr | Required | An array;
     * @param {String} what | Required | "min" or "max" or a keyword to search for
    */
    function arrayFind(arr, what) {
      let result = false;

      if (!Array.isArray(arr)) {
        throw arr + " is not an array.";
      }
      if (typeof what === "undefined") {
         throw "Missing parameter.";
      }

      switch (what) {

        case "min":
          result = Math.min.apply(Math, arr);

          if(!isNaN(result)) {
            return result;
          } else {

            for (let i = 0; i < arr.length; i++) {

              if (isNaN(arr[i])) {
                continue;
              } else {
                if (isNaN(result)) {
                  result = arr[i];
                  continue;
                } else {
                  if (arr[i] < result) {
                    result = arr[i];
                  } else {
                    continue;
                  }
                }
              }
            }
          }
          break;

        case "max":
          result = Math.max.apply(Math, arr);

          if(!isNaN(result)) {
            return result;
          } else {

            for (let i = 0; i < arr.length; i++) {

              if (isNaN(arr[i])) {
                continue;
              } else {
                if (isNaN(result)) {
                  result = arr[i];
                  continue;
                } else {
                  if (arr[i] > result) {
                    result = arr[i];
                  } else {
                    continue;
                  }
                }
              }
            }
          }
          break;

        default:
          result = occurrences(arr.join(""), what);
          break;
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

        if (subString.length <= 0) {
          return (string.length + 1);
        }

        let n = 0,
            pos = 0,
            step = allowOverlapping ? 1 : subString.length;

        while (true) {
            pos = string.indexOf(subString, pos);

            if (pos >= 0) {
                ++n;
                pos += step;
            } else {
              break;
            }
        }
        return n;
    }

    /** Count the number of occurrences of every items in an array
     * @param {Array} array | Required
     * @return {Object}
     */
    function countOccurences(array) {

      if (Array.isArray(array)) {
        let result = {};

        for(i = 0; i < array.length; ++i) {

            if(!result[array[i]])
                result[array[i]] = 0;
            ++result[array[i]];
        }
        return result;
      } else {
        throw array + " is not an array.";
      }
    }

    return Chordictionary;
  }

  if (typeof(Chordictionary) === "undefined") {
    window.Chordictionary = define();
  } else {
    console.error("Chordictionary is already defined.");
  }

})(window);
