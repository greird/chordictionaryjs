var guitar = new chordictionary.Instrument("EADGBE", 24, 5, 4);

QUnit.test("chordictionary.isValidTab()", function(assert) {
	assert.ok(chordictionary.isValidTab("x32010") === true, "x32010 is a valid tab.");
	assert.ok(chordictionary.isValidTab("911111099") === true, "911111099 is a valid tab (['9','11','11','10','9','9']).");
	assert.ok(chordictionary.isValidTab("x3201A") === false, "x3201A is not a valid tab.");
});

QUnit.test("chordictionary.isValidTuning()", function(assert) {
	assert.ok(chordictionary.isValidTuning("EADGBE") === true, "EADGBE is a valid tuning.");
	assert.ok(chordictionary.isValidTuning("E#A#D#G#B#E#") === true, "E#A#D#G#B#E# is a valid tuning.");
	assert.ok(chordictionary.isValidTuning("DA#DGA#D") === true, "DADGA#D is a valid tuning.");
	assert.ok(chordictionary.isValidTuning("EADGB2") === false, "EADGB2 is not a valid tuning.");
});

QUnit.test("guitar.getChordInfo()", function(assert) {
	
	// Add chords to be tested below. [tab, name, notes, formula]
	var formula = {
		"min": "1-b3-5",
		"maj": "1-3-5",
		"power": "1-5",
		"dim": "1-b3-b5",
		"aug": "1-3-5#",
		"sus4": "1-4-5",
		"sus2": "1-2-5",
		"add9": "1-3-5-9",
		"madd9": "1-b3-5-9",
		"6": "1-3-6",
		"6/9": "1-3-5-6-9",
		"maj6": "1-3-5-6",
		"7": "1-3-5-b7",
		"m7": "1-b3-5-b7",
		"maj7": "1-3-5-7",
		"mmaj7": "1-b3-5-7",
		"mb6": "1-b3-5-b6",
		"m6": "1-b3-5-6",
		"m6/9": "1-b3-5-6-9",
		"m7b5": "1-b3-b5-b7",
		"maj9": "1-3-5-7-9",
		"m9": "1-b3-5-b7-9",
		"m9b5": "1-b3-b5-b7-9",
		"m9maj7": "1-b3-5-7-9",
		"maj7#11": "1-3-5-7-#11",
		"7#11": "1-3-5-b7-#11",
		"maj13": "1-3-5-7-9-13",
		"m13": "1-b3-5-b7-9-11-13"
	};
	var chords = [
		// Major
		["x02220", ["A"], "xAEAC#E", [formula.maj]], 
		["x24442", ["B"], "xBF#BD#F#", [formula.maj]], 
		["x32010", ["C"], "xCEGCE", [formula.maj]], 
		["xx0232", ["D"], "xxDADF#", [formula.maj]], 
		["022100", ["E"], "EBEG#BE", [formula.maj]], 
		["133211", ["F"], "FCFACF", [formula.maj]], 
		["320033", ["G"], "GBDGDG", [formula.maj]], 
		// Minor
		["x02210", ["Amin", "C6"], "xAEACE", [formula.min, formula["6"]]], 
		["x24432", ["Bmin", "D6"], "xBF#BDF#", [formula.min, formula["6"]]], 
		["x35543", ["Cmin", "D#6"], "xCGCD#G", [formula.min, formula["6"]]], 
		["xx0231", ["Dmin", "F6"], "xxDADF", [formula.min, formula["6"]]], 
		["022000", ["Emin", "G6"], "EBEGBE", [formula.min, formula["6"]]], 
		["133111", ["Fmin", "G#6"], "FCFG#CF", [formula.min, formula["6"]]], 
		["355333", ["Gmin", "A#6"], "GDGA#DG", [formula.min, formula["6"]]],
		// Sus4 / Sus2
		["x33563", ["Csus4", "Fsus2"], "xCFCFG", [formula.sus4, formula.sus2]],
		["x8101088", ["Fsus2", "Csus4"], "xFCFGC", [formula.sus2, formula.sus4]],
		// Powerchord
		["x355xx", ["C5"], "xCGCxx", [formula.power]],
		// 7
		["131211", ["F7"], "FCD#ACF", [formula["7"]]],
		["x35353", ["C7"], "xCGA#EG", [formula["7"]]],
		// Minor 7 or Major 6
		["8x798x", ["Cmaj6", "Am7"], "CxAEGx", [formula.maj6, formula.m7]],
		["x35555", ["Cmaj6", "Am7"], "xCGCEA", [formula.maj6, formula.m7]],
		["133231", ["Fmaj6", "Dm7"], "FCFADF", [formula.maj6, formula.m7]],
		// Major 7
		["x32000", ["Cmaj7", "Emb6"], "xCEGBE", [formula.maj7, formula.mb6]], 
		["xx10987", ["Cmaj7", "Emb6"], "xxCEGB", [formula.maj7, formula.mb6]], 
		// Major 9
		["102011", ["Fmaj9"], "FAEGCF", [formula.maj9]],
		// Minor 9
		["131113", ["Fm9"], "FCD#G#CG", [formula.m9]],
		// Minor 6 or Minor 7b5
		["xx5545", ["Cm6", "Am7b5"], "xxGCD#A", [formula.m6, formula.m7b5]],
		["8988xx", ["Cm7b5", "D#m6"], "CF#A#D#xx", [formula.m7b5, formula.m6]],
		// Augmented (aug)
		["x32110", ["Caug", "Eaug", "G#aug"], "xCEG#CE", [formula.aug, formula.aug, formula.aug]],
		["032110", ["Eaug", "Caug", "G#aug"], "ECEG#CE", [formula.aug, formula.aug, formula.aug]],
		// Minor, major seventh (m(maj7))
		["x31003", ["Cm(maj7)"], "xCD#GBG", [formula.mmaj7]],
		["8109888", ["Cm(maj7)"], "CGBD#GC", [formula.mmaj7]],
		["x35443", ["Cm(maj7)"], "xCGBD#G", [formula.mmaj7]],
		// Minor added ninth
		["x31033", ["Cm(add9)"], "xCD#GDG", [formula.madd9]],
		["x6x788", ["Cm(add9)"], "xD#xDGC", [formula.madd9]],
		// Add9
		["xx109810", ["Cadd9"], "xxCEGD", [formula.add9]],
		["x32030", ["Cadd9"], "xCEGDE", [formula.add9]],
		// Minor ninth, major seventh (m9(maj7))
		["81098810", ["Cm9(maj7)"], "CGBD#GD", [formula.m9maj7]],
		// 6/9 (6 added 9)
		["x1212121312", ["C6/9"], "xADGCE", [formula["6/9"]]],
		["x32233", ["C6/9"], "xCEADG", [formula["6/9"]]],
		["8x5755", ["C6/9"], "CxGDEA", [formula["6/9"]]],
		// Minor sixth, added ninth (m6/9)
		["867788", ["Cm6/9"], "CD#ADGC", [formula["m6/9"]]],
		// Minor eleventh (m9b5)
		["89881110", ["Cm9b5"], "CF#A#D#A#D", [formula.m9b5]],
		// Major 13
		["330200", ["Cmaj13"], "GCDABE", [formula.maj13]],
		// Diminished (dim)
		["x3454x", ["Cdim"], "xCF#CD#x", [formula.dim]],
		["89108xx", ["Cdim"], "CF#CD#xx", [formula.dim]],
		// maj7#11
		["x32002", ["Cmaj7#11"], "xCEGBF#", [formula["maj7#11"]]],
		// 7#11
		["898988", ["C7#11"], "CF#A#EGC", [formula["7#11"]]],
		/*		
		** NOT SUPPORTED YET ******************************
		// Minor ninth, major seventh (m9(maj7)) SKIPPED NOTES
		["x65433", "Cm9(maj7)", "xD#GBDG", formula.m9maj7], // no root
		["x3143x", "Cm9(maj7)", "xCD#BDx", formula.m9maj7], // no fifth
		// 6/9 (6 added 9) SKIPPED NOTES
		["xx1091010", "C6/9", "xxCEAD", formula["6/9"]], // no fifth
		// Minor thirteen (m13) TO BE CHECKED WITH 7 STRINGS
		["x11233", "Cm13", "xA#D#ADG", formula.m13], // no root
		["81088108", "Cm13", "CGA#D#AC", formula.m13],
		// Minor ninth (m9)
		["81088810", "Cm9", "CD#A#Dxx", formula.m9],
		// Minor ninth (m9) WITHOUT 5th
		["x3133x", "Cm9", "xCD#A#Dx", formula.m9],
		["8687xx", "Cm9", "CD#A#Dxx", formula.m9],
		// Minor sixth, added ninth (m6/9) WITHOUT root
		["xx1233", "Cm6/9", "xxD#ADG", formula["m6/9"]], // no root
		["xx7889", "Cm6/9", "xxAD#GC#", formula["m6/9"]], // no root
		// Major 9 WITHOUT 5th
		["x3243x", ["Cmaj9"], "xCEBDx", [formula.maj9]],
		["x35433", ["Cmaj9"], "xCGBDG", [formula.maj9]],
		["xx10121210", ["Cmaj9"], "xxCGBD", [formula.maj9]],
		["x02100", ["Amaj9"], "xAEG#BE", [formula.maj9]],
		*/		
	];

	for (var i = 0; i < chords.length; i++) {
		var raw_results = guitar.getChordInfo(chords[i][0]);
		var results = transform(raw_results);
		// Check chord formula(s)
		assert.deepEqual(results, chords[i], "getChordInfo(\"" + chords[i][0] + "\")");

		document.getElementById("layouts").innerHTML += "<div style='width:140px;height:180px;margin:20px;float:left'>" + guitar.getChordLayout(chords[i][0], raw_results.chords[0]) + "</div>";
	}
});

// transform the result obj into a proper array for testing
function transform(results) {
	try {
		var name = [];
		var formula = [];
		var tab = results.tab.join("");
		var notes = results.notes.join("");
		
		for (var i = 0; i < results.chords.length; i++) {
			name.push(results.chords[i].name);
			formula.push(results.chords[i].formula);		
		}
		return [tab, name, notes, formula];
	} 
	catch (e) {
		console.log(e);
	}
}