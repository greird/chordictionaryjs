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
	var chords = [
		// Major
		['x02220', 'A', 'xAEAC#E', '1-3-5'], 
		['x24442', 'B', 'xBF#BD#F#', '1-3-5'], 
		['x32010', 'C', 'xCEGCE', '1-3-5'], 
		['xx0232', 'D', 'xxDADF#', '1-3-5'], 
		['022100', 'E', 'EBEG#BE', '1-3-5'], 
		['133211', 'F', 'FCFACF', '1-3-5'], 
		['320033', 'G', 'GBDGDG', '1-3-5'], 
		// Minor
		['x02210', ['Amin', 'C6'], 'xAEACE', ['1-b3-5', '1-3-6']], 
		['x24432', ["Bmin", "D6"], 'xBF#BDF#', ['1-b3-5', '1-3-6']], 
		['x35543', ["Cmin", "D#6"], 'xCGCD#G', ['1-b3-5', '1-3-6']], 
		['xx0231', ["Dmin", "F6"], 'xxDADF', ['1-b3-5', '1-3-6']], 
		['022000', ["Emin", "G6"], 'EBEGBE', ['1-b3-5', '1-3-6']], 
		['133111', ["Fmin", "G#6"], 'FCFG#CF', ['1-b3-5', '1-3-6']], 
		['355333', ["Gmin", "A#6"], 'GDGA#DG', ['1-b3-5', '1-3-6']],
		// 7
		['131211', 'F7', 'FCD#ACF', '1-3-5-b7'],
		// Minor 7 or 6
		['133231', ["F6", "Dm7"], 'FCFADF', ["1-3-5-6", "1-b3-5-b7"]], 
		// Minor 6 or Minor 7b5
		['xx5545', ["Cm6", "Am7b5"], 'xxGCD#A', ["1-b3-5-6", "1-b3-b5-b7"]],
		['8988xx', ["D#m6", "Cm7b5"], 'CF#A#D#xx', ["1-b3-5-6", "1-b3-b5-b7"]]
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