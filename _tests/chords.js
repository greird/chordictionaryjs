// Add chords to be tested below. [tab, name, notes, formula]


exports.chords = [
	// Powerchord
	["35xxxx", ["G5", "Dsus4"], "GDxxxx"],
	["x355xx", ["C5", "Gsus4"], "xCGCxx"],
	// Major
	["x02220", ["AMaj", "E6sus4", "C#min#5"], "xAEAC#E"], 
	["x24442", ["BMaj", "F#6sus4", "D#min#5"], "xBF#BD#F#"], 
	["x32010", ["CMaj", "Emin#5", "G6sus4"], "xCEGCE"], 
	["xx0232", ["DMaj", "A6sus4", "F#min#5"], "xxDADF#"], 
	["022100", ["EMaj", "B6sus4", "G#min#5"], "EBEG#BE"], 
	["133211", ["FMaj", "C6sus4", "Amin#5"], "FCFACF"], 
	["320033", ["GMaj", "Bmin#5", "D6sus4"], "GBDGDG"], 
	// Minor
	["x02210", ["Amin", "Esus4#5", "C6"], "xAEACE"], 
	["x24432", ["Bmin", "F#sus4#5", "D6"], "xBF#BDF#"], 
	["x35543", ["Cmin", "Gsus4#5", "D#6"], "xCGCD#G"], 
	["xx0231", ["Dmin", "Asus4#5", "F6"], "xxDADF"], 
	["022000", ["Emin", "Bsus4#5", "G6"], "EBEGBE"], 
	["133111", ["Fmin", "Csus4#5", "G#6"], "FCFG#CF"], 
	["355333", ["Gmin", "Dsus4#5", "A#6"], "GDGA#DG"],
	// 7
	["131211", ["F7", "Cmin6add4bb5", "D#6sus2b5"], "FCD#ACF"],
	["x35353", ["C7", "Gmin6add4bb5", "A#6sus2b5"], "xCGA#EG"],
	// Major 7
	["x32000", ["CMaj7", "Eminb6"], "xCEGBE"], 
	["xx10987", ["CMaj7", "Eminb6"], "xxCEGB"], 
	// Minor 7 or Major 6
	["8x798x", ["C6", "Amin7", "G6sus2sus4"], "CxAEGx"],
	["x35555", ["C6", "G6sus2sus4", "Amin7"], "xCGCEA"],
	["133231", ["F6", "C6sus2sus4", "Dmin7"], "FCFADF"],
	// Minor major seventh (min(Maj7)) and Aug6
	["x31003", ["CminMaj7"], "xCD#GBG"], // D#+6
	["8109888", ["CminMaj7"], "CGBD#GC"], // D#+6
	["x35443", ["CminMaj7"], "xCGBD#G"], // D#+6
	// Minor 6 or Minor 7b5
	["xx5545", ["Cmin6", "Adim7", "Gsus2sus4#5", "D#6b5"], "xxGCD#A"], // Amin7b5 == Amin7#11
	["8988xx", ["Cdim7", "D#min6", "F#6b5", "A#sus2sus4#5"], "CF#A#D#xx"],
	// 6/9 (6 added 9)
	["x1212121312", ["C6/9"], "xADGCE"],
	["x32233", ["C6/9"], "xCEADG"],
	["8x5755", ["C6/9"], "CxGDEA"],
	["xx1091010", ["C6/9"], "xxCEAD"],
	// Add9
	["xx109810", ["Cadd9", "Emin7#5", "G6sus4", "D11sus2"], "xxCEGD"], // D7sus2sus4 == D11sus2
	["x32030", ["Cadd9", "Emin7#5", "G6sus4", "D11sus2"], "xCEGDE"], // also D9sus2sus4 (with 3rd and 5th skipped) or D7sus2sus4
	// Minor Add9
	["x31033", ["Cminadd9"], "xCD#GDG"],
	["x6x788", ["Cminadd9"], "xD#xDGC"],
	// Dominant 9
	["x54555", ["D9"], "xDF#CEA"],
	["101210111012", ["D9"], "DACF#AE"],
	// Major 9
	["102011", ["FMaj9"], "FAEGCF"],
	["x3243x", ["CMaj9"], "xCEBDx"],
	// CMaj7sus2 (Same as Maj9 but without 3rd and only one 2/9 so can't be Maj9 nor Maj9sus2)
	["x35433", ["CMaj7sus2"], "xCGBDG"],
	["xx10121210", ["CMaj7sus2"], "xxCGBD"],
	["x02100", ["AMaj7sus2"], "xAEG#BE"],
	// Sus4 / Sus2
	["x33563", ["Csus4", "Fsus2"], "xCFCFG"], // are GMaj7sus4, Gm7Maj11 valid ?
	["x8101088", ["Fsus2", "Csus4"], "xFCFGC"], // are GMaj7sus4, Gm7Maj11 valid ?
	// Minor ninth (min9)
	["131113", ["Fmin9"], "FCD#G#CG"], // G7b13b9sus4, G7b9sus4, F7#9sus2
	["81088810", ["Cmin9"], "CGA#D#GD"], // C7#9sus2, D7b13b9sus4, D7b9sus4#5
	["x3133x", ["Cmin9"], "xCD#A#Dx"], // no 5th
	["8687xx", ["Cmin9"], "CD#A#Dxx"], // no 5th
	// Minor ninth flat 5th (m9b5)
	["89881110", ["Cmin9b5", "Daug7b9"], "CF#A#D#A#D"],
	// add4
	["x55775", ["Dadd4", "GMaj7sus2"], "xDGDF#A"], // A11sus4 should be A13sus4 // is F#min#5 valid ?
	["101012111010", ["Dadd4", "GMaj7sus2"], "DGDF#AD"],
	// Augmented (aug)
	["x32110", ["Caug", "Eaug", "G#aug"], "xCEG#CE"],
	["032110", ["Eaug", "Caug", "G#aug"], "ECEG#CE"],
	// Diminished 5th (dim5)
	["x3454x", ["Cdim"], "xCF#CD#x"],
	["89108xx", ["Cdim"], "CF#CD#xx"],
	// Dadd4add9
	["x54030", ["Dadd4add9bb5"], "xDF#GDE"], // or Dadd4add9 ??
	// 11
	["x1211131010", ["A11"], "xAC#G#AD"],
	["x32001", ["C11"], "xCEGBF"],
	// Minor 7 Major 9
	["81098810", ["CminMaj9"], "CGBD#GD"], // or Cmin7Maj9
	["x3143x", ["CminMaj9"], "xCD#BDx"], // no fifth
	// Augmented Major 7
	["x65433", ["D#augMaj7"], "xD#GBDG"],
	// Minor sixth, added ninth (m6/9)
	["867788", ["Cmin6/9"], "CD#ADGC"],
	// Seven flat 5th
	["xx1233", ["D#Maj7b5"], "xxD#ADG"], // also a m6/9  with no root
	["xx7889", ["A7b5", "D#7b5"], "xxAD#GC#"], // also a m6/9  with no root
	// Major 13
	["330200", ["C13"], "GCDABE"],
	["x3x455", ["C13"], "xCxBEA"],
	["x32203", ["C13"], "xCEABG"],
	// complex chords
	["x11233", ["A#13"], "xA#D#ADG"], 
	["81088108", ["Cmin13"], "CGA#D#AC"], // A#13sus2sus4 (sus2 and sus4 are optional as they can counted as 9th and 11th instead)
	// maj7#11
	["x32002", ["CMaj7#11"], "xCEGBF#"],
	// 7#11
	["898988", ["C7#11"], "CF#A#EGC"],	// Gmin13 is wrong because b3 but maj 7th.
	];