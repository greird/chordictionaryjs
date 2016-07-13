var guitar = new Chordictionary.Instrument('EADGBE', 24, 5, 4);

QUnit.test("Chordictionary.isValidTab()", function(assert) {
	assert.ok(Chordictionary.isValidTab("x32010") === true, "x32010 is a valid tab.");
	assert.ok(Chordictionary.isValidTab("911111099") === true, "911111099 is a valid tab (['9','11','11','10','9','9']).");
});

QUnit.test("Chordictionary.isValidTuning()", function(assert) {
	assert.ok(Chordictionary.isValidTuning("EADGBE") === true, "EADGBE is a valid tuning.");
	assert.ok(Chordictionary.isValidTuning("E#A#D#G#B#E#") === true, "E#A#D#G#B#E# is a valid tuning.");
	assert.ok(Chordictionary.isValidTuning("DA#DGA#D") === true, "DADGA#D is a valid tuning.");
});

QUnit.test("guitar.getChordInfo()", function(assert) {
	
	// Add chords to be tested below. [tab, name, notes, formula]
	var 
		formula = {
			"min": "1-b3-5",
			"maj": "1-3-5",
			"power": "1-5",
			"sus4": "1-4-5",
			"sus2": "1-2-5",
			"add9": "1-3-5-9",
			"add9min": "1-3-5-b9",
			"6": "1-3-6",
			"6/9": "1-3-5-6-9",
			"maj6": "1-3-5-6",
			"7": "1-3-5-b7",
			"m7": "1-b3-5-b7",
			"maj7": "1-3-5-7",
			"mb6": "1-b3-5-b6",
			"m6": "1-b3-5-6",
			"m7b5": "1-b3-b5-b7",
			"maj9": "1-3-5-7-9",
			"maj7#11": "1-3-5-7-#11",
			"maj13": "1-3-5-7-9-13"
		},
		chords = [
		// Major
		['x02220', 'A', 'xAEAC#E', formula.maj], 
		['x24442', 'B', 'xBF#BD#F#', formula.maj], 
		['x32010', 'C', 'xCEGCE', formula.maj], 
		['xx0232', 'D', 'xxDADF#', formula.maj], 
		['022100', 'E', 'EBEG#BE', formula.maj], 
		['133211', 'F', 'FCFACF', formula.maj], 
		['320033', 'G', 'GBDGDG', formula.maj], 
		// Minor
		['x02210', ['Amin', 'C6'], 'xAEACE', [formula.min, formula['6']]], 
		['x24432', ["Bmin", "D6"], 'xBF#BDF#', [formula.min, formula['6']]], 
		['x35543', ["Cmin", "D#6"], 'xCGCD#G', [formula.min, formula['6']]], 
		['xx0231', ["Dmin", "F6"], 'xxDADF', [formula.min, formula['6']]], 
		['022000', ["Emin", "G6"], 'EBEGBE', [formula.min, formula['6']]], 
		['133111', ["Fmin", "G#6"], 'FCFG#CF', [formula.min, formula['6']]], 
		['355333', ["Gmin", "A#6"], 'GDGA#DG', [formula.min, formula['6']]],
		// Sus4 / Sus2
		['x33563', ["Csus4", "Fsus2"], 'xCFCFG', [formula.sus4, formula.sus2]],
		['x8101088', ["Csus4", "Fsus2"], 'xFCFGC', [formula.sus4, formula.sus2]],
		// Powerchord
		['x355xx', 'C5', 'xCGCxx', formula.power],
		// 7
		['131211', 'F7', 'FCD#ACF', formula['7']],
		['x35353', 'C7', 'xCGA#EG', formula['7']],
		// Minor 7 or 6
		['133231', ["F6", "Dm7"], 'FCFADF', [formula.maj6, formula.m7]], 
		// Major 7
		['x32000', ["Cmaj7", "Emb6"], 'xCEGBE', [formula.maj7, formula.mb6]], 
		['xx10987', ["Cmaj7", "Emb6"], 'xxCEGB', [formula.maj7, formula.mb6]], 
		// Minor 6 or Minor 7b5
		['xx5545', ["Cm6", "Am7b5"], 'xxGCD#A', [formula.m6, formula.m7b5]],
		['8988xx', ["D#m6", "Cm7b5"], 'CF#A#D#xx', [formula.m6, formula.m7b5]],
		// Add9
		['xx109810', "Cadd9", 'xxCEGD', formula.add9],
		['x32030', "Cadd9", 'xCEGDE', formula.add9],
		// 6/9 (6 added 9)
		['xx1091010', 'C6/9', 'xxCEAD', formula['6/9']],
		['x1212121312', 'C6/9', 'xADGCE', formula['6/9']],
		// Major 9
		['x3243x', "Cmaj9", 'xCEBDx', formula.maj9],
		['x35433', "Cmaj9", 'xCGBDG', formula.maj9],
		['xx10121210', "Cmaj9", 'xxCGBD', formula.maj9],
		['x02100', "Amaj9", 'xAEG#BE', formula.maj9],
		// maj7#11
		['x32002', "Cmaj7#11", 'xAEG#BE', formula["maj7#11"]]
		// Major 13
		['330200', "Cmaj13", 'GCDABE', formula.maj13]
	];

	for (var i = 0; i < chords.length; i++) {

		// Check chord name(s)
		if (chords[i][1].constructor === Array) {
			assert.deepEqual(guitar.getChordInfo(chords[i][0]).name, chords[i][1], chords[i][0] + " is an " + chords[i][1] + " chord");
		} else {
			assert.equal(guitar.getChordInfo(chords[i][0]).name, chords[i][1], chords[i][0] + " is an " + chords[i][1] + " chord");
		}

		// Check chord formula(s)
		if (chords[i][3].constructor === Array) {
			assert.deepEqual(guitar.getChordInfo(chords[i][0]).formula, chords[i][3], chords[i][0] + " formula is " + chords[i][3]);
		} else {
			assert.equal(guitar.getChordInfo(chords[i][0]).formula, chords[i][3], chords[i][0] + " formula is " + chords[i][3]);
		}

		// Check chord notes
		assert.equal(guitar.getChordInfo(chords[i][0]).notes, chords[i][2], chords[i][0] + " contains the following notes " + chords[i][2]);

		// Check chord tab
		assert.equal(guitar.getChordInfo(chords[i][0]).tab, chords[i][0], chords[i][0] + " tab is " + chords[i][0]);
	}
});