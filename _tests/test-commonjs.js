const chords = require("./chords.js").chords;
const chordictionary = require('../build/commonjs/chordictionary.min.js');

var guitar = new chordictionary.Instrument(chordictionary.tuning.guitar.standard.join(""), 24, 5, 4);

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

QUnit.test("chordictionary.tuning", function(assert) {
	assert.deepEqual(chordictionary.tuning.guitar.standard, ["E", "A", "D", "G", "B", "E"], 'Guitar standard tuning is EADGBE.');
	assert.deepEqual(chordictionary.tuning.guitar.open_g, ["G", "G", "D", "G", "B", "D"], 'Guitar Open G tuning is GGDGBD.');
	assert.deepEqual(chordictionary.tuning.bass.standard, ["E", "A", "D", "G"], 'Bass standard tuning is EADG.');
});

QUnit.test("guitar.getChordInfo() with " + chords.length + " chords", function(assert) {
	for (let i = 0; i < chords.length; i++) {
		let raw_results = guitar.getChordInfo(chords[i][0]);
		let results = transform(raw_results);
		assert.deepEqual(results, chords[i], "getChordInfo(\"" + chords[i][0] + "\")");
	}
});

// transform the result obj into a proper array for testing
function transform(results) {
	try {
		let name = [];
		let formula = [];
		let tab = results.tab.join("");
		let notes = results.notes.join("");
		
		for (let i = 0; i < results.chords.length; i++) {
			name.push(results.chords[i].name);
			formula.push(results.chords[i].formula);		
		}
		return [tab, name, notes, formula];
	} 
	catch (e) {
		console.log(e);
	}
}