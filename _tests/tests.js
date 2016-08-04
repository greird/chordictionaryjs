var guitar = new Chordictionary('EADGBE', 24, 5, 4);

QUnit.test("guitar.isValidTab()", function(assert) {
	assert.ok(guitar.isValidTab("x32010") === true, "x32010 is a valid tab.");
	assert.ok(guitar.isValidTab("911111099") === true, "911111099 is a valid tab (['9','11','11','10','9','9']).");
});

QUnit.test("guitar.isValidTuning()", function(assert) {
	assert.ok(guitar.isValidTuning("EADGBE") === true, "EADGBE is a valid tuning.");
	assert.ok(guitar.isValidTuning("E#A#D#G#B#E#") === true, "E#A#D#G#B#E# is a valid tuning.");
	assert.ok(guitar.isValidTuning("DA#DGA#D") === true, "DADGA#D is a valid tuning.");
});

QUnit.test("guitar.getChordInfo()", function(assert) {
	
	// Add chords to be tested below. [tab, name, notes, formula]
	var 
		formula = {
			"min": "1-b3-5",
			"maj": "1-3-5",
			"power": "1-5",
			"dim": "1-3-b5",
			"aug": "1-3-5#",
			"sus4": "1-4-5",
			"sus2": "1-2-5",
			"add9": "1-3-5-9",
			"madd9": "1-3-5-b9",
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
			"maj13": "1-3-5-7-9-13",
			"m13": "1-b3-5-b7-9-11-13"
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
		// Minor 7 or Major 6
		['8x798x', ["Am7", "Cmaj6"], 'CxAEGx', [formula.m7, formula.maj6]],
		['x35555', ["Am7", "Cmaj6"], 'xCGCEA', [formula.m7, formula.maj6]],
		['133231', ["Dm7", "Fmaj6"], 'FCFADF', [formula.m7, formula.maj6]],
		// Major 7
		['x32000', ["Cmaj7", "Emb6"], 'xCEGBE', [formula.maj7, formula.mb6]], 
		['xx10987', ["Cmaj7", "Emb6"], 'xxCEGB', [formula.maj7, formula.mb6]], 
		// Minor 6 or Minor 7b5
		['xx5545', ["Am7b5", "Cm6"], 'xxGCD#A', [formula.m7b5, formula.m6]],
		['8988xx', ["Cm7b5", "D#m6"], 'CF#A#D#xx', [formula.m7b5, formula.m6]],
		// Augmented (aug)
		['x32110', ["Caug", "Eaug", "G#aug"], 'xCEG#CE', formula.aug],
		['032110', ["Eaug", "Caug", "G#aug"], 'ECEG#CE', formula.aug],
		['4321xx', ["G#aug", "Caug", "Eaug"], 'G#CEG#xx', formula.aug],
		// Minor, major seventh (m(maj7))
		['x31003', 'Cm(maj7)', 'xCD#GBG', formula.mmaj7],
		['8109888', 'Cm(maj7)', 'CGBD#GC', formula.mmaj7],
		['x35443', 'Cm(maj7)', 'xCGBD#G', formula.mmaj7],
		/*		
		** NOT SUPPORTED YET ******************************
		// Minor thirteen (m13)
		['x11233', 'Cm13', 'xA#D#ADG', formula.m13],
		['81088108', 'Cm13', 'CGA#D#AC', formula.m13],
		// Minor eleventh (m9b5)
		['89881110', 'Cm9b5', 'CF#A#D#A#D', formula.m9b5],
		// Minor ninth, major seventh (m9(maj7))
		['x65433', 'Cm9(maj7)', 'xD#GBDG', formula.m9maj7],
		['x3143x', 'Cm9(maj7)', 'xCD#BDx', formula.m9maj7],
		['81098810', 'Cm9(maj7)', 'CGBD#GD', formula.m9maj7],
		// Diminished (dim)
		['x3454x', 'Cdim', 'xCF#CD#x', formula.dim],
		['89108xx', 'Cdim', 'CF#CD#xx', formula.dim],
		// Minor ninth (m9)
		['x3133x', 'Cm9', 'xCD#A#Dx', formula.m9],
		['8687xx', 'Cm9', 'CD#A#Dxx', formula.m9],
		// Minor sixth, added ninth (m6/9)
		['xx1233', 'Cm6/9', 'xxD#ADG', formula['m6/9']],
		['xx7889', 'Cm6/9', 'xxAD#GC#', formula['m6/9']],
		// Minor added ninth
		['x31033', 'Cm(add9)', 'xCD#GDG', formula.madd9],
		['x6x788', 'Cm(add9)', 'xD#xDGC', formula.madd9],
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
		['x32002', "Cmaj7#11", 'xCEGBF#', formula["maj7#11"]],
		// Major 13
		['330200', "Cmaj13", 'GCDABE', formula.maj13],
		*/
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