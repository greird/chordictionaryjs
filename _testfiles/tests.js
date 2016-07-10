var guitar = new Chordictionary.Instrument('EADGBE', 24, 5, 4);

QUnit.test("Chordictionary.isValidTab()", function(assert) {
	assert.ok(Chordictionary.isValidTab("x32010") === true, "x32010 is a valid tab.");
});

QUnit.test("guitar.getChordInfo()", function(assert) {
	
// Major chords
	// A
	assert.ok(guitar.getChordInfo('x02220').name == "A", "x02220 is an A chord");
	assert.ok(guitar.getChordInfo('x02220').notes == "xAEAC#E", "x02220 contains the following notes xAEAC#E");
	assert.ok(guitar.getChordInfo('x02220').formula == "1-3-5", "x02220 formula is 1-3-5");
	assert.ok(guitar.getChordInfo('x02220').tab == "x02220", "x02220 tab is x02220");
	// B
	assert.ok(guitar.getChordInfo('x24442').name == "B", "x24442 is an B chord");
	assert.ok(guitar.getChordInfo('x24442').notes == "xBF#BD#F#", "x24442 contains the following notes xBF#BD#F#");
	assert.ok(guitar.getChordInfo('x24442').formula == "1-3-5", "x24442 formula is 1-3-5");
	assert.ok(guitar.getChordInfo('x24442').tab == "x24442", "x24442 tab is x24442");
	// C
	assert.ok(guitar.getChordInfo('x32010').name == "C", "x32010 is a C chord");
	assert.ok(guitar.getChordInfo('x32010').notes == "xCEGCE", "x32010 contains the following notes xCEGCE");
	assert.ok(guitar.getChordInfo('x32010').formula == "1-3-5", "x32010 formula is 1-3-5");
	assert.ok(guitar.getChordInfo('x32010').tab == "x32010", "x32010 tab is x32010");
	// D
	assert.ok(guitar.getChordInfo('xx0232').name == "D", "xx0232 is a D chord");
	assert.ok(guitar.getChordInfo('xx0232').notes == "xxDADF#", "xx0232 contains the following notes xxDADF#");
	assert.ok(guitar.getChordInfo('xx0232').formula == "1-3-5", "xx0232 formula is 1-3-5");
	assert.ok(guitar.getChordInfo('xx0232').tab == "xx0232", "xx0232 tab is xx0232");
	// E
	assert.ok(guitar.getChordInfo('022100').name == "E", "022100 is a E chord");
	assert.ok(guitar.getChordInfo('022100').notes == "EBEG#BE", "022100 contains the following notes EBEG#BE");
	assert.ok(guitar.getChordInfo('022100').formula == "1-3-5", "022100 formula is 1-3-5");
	assert.ok(guitar.getChordInfo('022100').tab == "022100", "022100 tab is 022100");
	// F
	assert.ok(guitar.getChordInfo('133211').name == "F", "133211 is a F chord");
	assert.ok(guitar.getChordInfo('133211').notes == "FCFACF", "133211 contains the following notes FCFACF");
	assert.ok(guitar.getChordInfo('133211').formula == "1-3-5", "133211 formula is 1-3-5");
	assert.ok(guitar.getChordInfo('133211').tab == "133211", "133211 tab is 133211");
	// G
	assert.ok(guitar.getChordInfo('320033').name == "G", "320033 is a G chord");
	assert.ok(guitar.getChordInfo('320033').notes == "GBDGDG", "320033 contains the following notes GBDGDG");
	assert.ok(guitar.getChordInfo('320033').formula == "1-3-5", "320033 formula is 1-3-5");
	assert.ok(guitar.getChordInfo('320033').tab == "320033", "320033 tab is 320033");

// Minor chords
	// A Min
	assert.deepEqual(guitar.getChordInfo('x02210').name, ["Amin", "C6"], "x02210 is an Amin/C6 chord");
	assert.ok(guitar.getChordInfo('x02210').notes == "xAEACE", "x02210 contains the following notes xAEACE");
	assert.deepEqual(guitar.getChordInfo('x02210').formula, ['1-b3-5', '1-3-6'], "x02210 formula is 1-b3-5 or 1-3-6");
	assert.ok(guitar.getChordInfo('x02210').tab == "x02210", "x02210 tab is x02210");

// Others
	// Dm7 (F6)
	assert.deepEqual(guitar.getChordInfo('133231').name, ["F6", "Dm7"], "133231 is a F6/Dm7 chord");
	assert.ok(guitar.getChordInfo('133231').notes == "FCFADF", "133231 contains the following notes FCFADF");
	assert.deepEqual(guitar.getChordInfo('133231').formula, ["1-3-5-6", "1-b3-5-b7"], "133231 formula is 1-3-5-6 or 1-b3-5-b7");
	assert.ok(guitar.getChordInfo('133231').tab == "133231", "133231 tab is 133231");
	// F7
	assert.ok(guitar.getChordInfo('131211').name == "F7", "131211 is an F7 chord");
	assert.ok(guitar.getChordInfo('131211').notes == "FCD#ACF", "131211 contains the following notes FCD#ACF");
	assert.ok(guitar.getChordInfo('131211').formula == "1-3-5-b7", "131211 formula is 1-3-5-b7");
	assert.ok(guitar.getChordInfo('131211').tab == "131211", "131211 tab is 131211");
});