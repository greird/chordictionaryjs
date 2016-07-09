var guitar = new Chordictionary.Instrument('EADGBE', 24, 5, 4);

QUnit.test("Chordictionary.isValidTab()", function(assert) {
	assert.ok(Chordictionary.isValidTab("x32010") === true, "x32010 is a valid tab.");
});

QUnit.test("guitar.getChordInfo()", function(assert) {
	// C Maj
	assert.ok(guitar.getChordInfo('x32010').name == "C", "x32010 is a C chord");
	assert.ok(guitar.getChordInfo('x32010').notes == "xCEGCE", "x32010 contains the following notes xCEGCE");
	assert.ok(guitar.getChordInfo('x32010').formula == "1-3-5", "x32010 formula is 1-3-5");
	assert.ok(guitar.getChordInfo('x32010').tab == "x32010", "x32010 tab is x32010");
	// A Min
	assert.deepEqual(guitar.getChordInfo('x02210').name, ["Amin", "C6"], "x02210 is an Amin/C6 chord");
	assert.ok(guitar.getChordInfo('x02210').notes == "xAEACE", "x02210 contains the following notes xAEACE");
	assert.deepEqual(guitar.getChordInfo('x02210').formula, ['1-b3-5', '1-3-6'], "x02210 formula is 1-b3-5");
	assert.ok(guitar.getChordInfo('x02210').tab == "x02210", "x02210 tab is x02210");
	// F7
	assert.ok(guitar.getChordInfo('131211').name == "F7", "131211 is an F7 chord");
	assert.ok(guitar.getChordInfo('131211').notes == "FCD#ACF", "131211 contains the following notes FCD#ACF");
	assert.ok(guitar.getChordInfo('131211').formula == "1-3-5-b7", "131211 formula is 1-3-5-b7");
	assert.ok(guitar.getChordInfo('131211').tab == "131211", "131211 tab is 131211");
});