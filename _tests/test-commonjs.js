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
	assert.ok(chordictionary.isValidTuning("D#G#C#F#A#D#") === true, "D# G# C# F# A# D# is a valid tuning.");
	assert.ok(chordictionary.isValidTuning("EbAbDbGbBbEb") === true, "Eb Ab Db Gb Bb Eb is a valid tuning.");
	assert.ok(chordictionary.isValidTuning("DA#DGA#D") === true, "DADGA#D is a valid tuning.");
	assert.ok(chordictionary.isValidTuning("EADGB2") === false, "EADGB2 is not a valid tuning.");
});

QUnit.test("chordictionary.tuning", function(assert) {
	assert.deepEqual(chordictionary.tuning.guitar.standard, ["E", "A", "D", "G", "B", "E"], 'Guitar standard tuning is EADGBE.');
	assert.deepEqual(chordictionary.tuning.guitar.halfstepdown, ["D#", "G#", "C#", "F#", "A#", "D#"], 'Guitar half-step down tuning is D#G#C#F#A#D#.');
	assert.deepEqual(chordictionary.tuning.guitar.open_g, ["G", "G", "D", "G", "B", "D"], 'Guitar Open G tuning is GGDGBD.');
	assert.deepEqual(chordictionary.tuning.bass.standard, ["E", "A", "D", "G"], 'Bass standard tuning is EADG.');
});

QUnit.test("chordictionary.notes", function(assert) {
	assert.deepEqual(chordictionary.notes, ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"], 'Found all 12 notes.');
});

QUnit.test("chordictionary.parseTuning", function(assert) {
	assert.deepEqual(chordictionary.parseTuning("EADGBE"), ["E", "A", "D", "G", "B", "E"], 'Parsing standard tuning.');
	assert.deepEqual(chordictionary.parseTuning("D#G#C#F#A#D#"), ["D#", "G#", "C#", "F#", "A#", "D#"], 'Parsing tuning with sharps.');
	assert.deepEqual(chordictionary.parseTuning("eadgbe"), ["E", "A", "D", "G", "B", "E"], 'Parsing standard tuning lowercase.');
	//assert.deepEqual(chordictionary.parseTuning("EbAbDbGbBbEb"), ["D#", "G#", "C#", "F#", "A#", "D#"], 'Parsing half-step down tuning with flats.');
	assert.ok(chordictionary.parseTuning("EADGBE2") === false, "EADGBE2 returns false as it cannot contains numbers.");
});

QUnit.test("chordictionary.parseTab", function(assert) {
	assert.deepEqual(chordictionary.parseTab("X32010"), ["x", "3", "2", "0", "1", "0"], "Parsing X32010.");
	assert.deepEqual(chordictionary.parseTab("x32010"), ["x", "3", "2", "0", "1", "0"], "Parsing x32010 (lowercase.");
	assert.deepEqual(chordictionary.parseTab("81010988"), ["8", "10", "10", "9", "8", "8"], "Parsing 81010988.");
	assert.deepEqual(chordictionary.parseTab("101212111010"), ["10", "12", "12", "11", "10", "10"], "Parsing 81010988.");
	assert.throws(chordictionary.parseTab("ABC123"), "ABC123 throws an error as tab can only contains numbers or X.");
});

QUnit.test("chordictionary.parseChord", function(assert) {
	assert.deepEqual(chordictionary.parseChord("C"), ["C", ""], "Parsing C.");
	assert.deepEqual(chordictionary.parseChord("Cmin"), ["C", "min"], "Parsing Cmin.");
	assert.deepEqual(chordictionary.parseChord("C#min7"), ["C#", "min7"], "Parsing C#min7.");
	assert.deepEqual(chordictionary.parseChord("Cm9(Maj7)"), ["C", "m9(Maj7)"], "Parsing Cm9(Maj7).");
});

QUnit.test("guitar.getChordInfo() with " + chords.length + " chords", function(assert) {
	for (let i = 0; i < chords.length; i++) {
		let raw_results = guitar.getChordInfo(chords[i][0]);
		let results = transform(raw_results);
		assert.ok(results[0] === chords[i][0], "Testing tab " + chords[i][0]);
		assert.ok(results[2] === chords[i][2], "Testing notes " + chords[i][2]);
		//console.log(chords[i][1].map(x => results[1].includes(x)));
		assert.ok(chords[i][1].map(x => results[1].includes(x)).every(x => x === true), "Testing chord name(s) " + chords[i][1].join());
		//assert.deepEqual(results, chords[i], "getChordInfo(\"" + chords[i][0] + "\")");
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
		return [tab, name, notes];
	} 
	catch (e) {
		console.log(e);
	}
}