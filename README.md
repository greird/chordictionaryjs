ChordictionaryJS
======

Web-based dynamic chord recognition and generation for any fretted instrument.
It converts common chord tab notation, such as `x32010`, into its graphical representation, recognizes the chord and returns its real name and composition.

**Please note this is work in progress and it is not 100% reliable yet.**

***

## How to

### Recognize a chord and get all information about a tab

`Chordictionary.getChordInfo()` will return every known information about a tab notation, including: the chord name(s), the notes composition and the chord(s) formula. Also return a friendly "message" in case of failure.

```javascript
Chordictionary.getChordInfo(tab, tuning);
// tab 			A tab notation {String}
// tuning 	The instrument tuning {String}

// Example
Chordictionary.getChordInfo("xx5545", "EADGBE");

// Will return an object
{
	message: "",
	formula: ["1-b3-5-6", "1-b3-b5-b7"],
	name: ["Cm6", "Am7b5"],
	notes: "xxGCD#A",
	tab: "xx5545",
	tuning: "EADGBE"
}
```

### Get tab notation from a chord name

`Chordictionary.getChordsList()` will return a list of valid tab notation for a chord.

```javascript
Chordictionary.getChordsList(name, tuning, limit, offset);
// name 			A tab notation {String}
// tuning 		The instrument tuning {String}
// limit 			The number of items to return {Int} || Default : all results
// offset 		Offset to allow pagination {Int} || Default : 0

// Example
Chordictionary.getChordsList("G", "EADGBE", 2);

// Will return an object
{
	tab: ["320033", "355433"],
	offset: 2
}
```

### Get graphical representation of a tab

`Chordictionary.getChordLayout` will return an html layout for the given tab notation.

```javascript
Chordictionary.getChordLayout(tab, tuning, size);
// name 			A tab notation {String}
// tuning 		The instrument tuning {String}
// size 			The number of frets to display {Int} || Default : auto-resize

// Example
Chordictionary.getChordLayout("x32010", "EADGBE");

// Will return an object
'<table class="chord">...</table>'
```

### Check if tab or tuning is valid

`Chordictionary.isValidTab()` and `Chordictionary.isValidTuning()` will check the validity of a given tab notation or tuning.
They will either return an array containing each individual notes or false if invalid.

```javascript
// Examples

Chordictionary.isValidTab("x32010");
// Return
['x','3','2','0','1','0']

Chordictionary.isValidTab("911111099");
// Return
['9','11','11','10','9','9']

Chordictionary.isValidTab("E#A#D#G#B#E#");
// Return
['E#','A#','D#','G#','B#','E#']
```

***

## How it works

#### Chord Recognition

*It will work with any kind of tuning and any number of strings !*

In order to guess the name of a chord we need to find its formula. For instance, a Major Seventh chord is always composed of a root, a third, a fifth and a seventh `1-3-5-7` or `04711` in integer notation.
> All the formulas are stored in the `MDL_CHORD_FORMULAS` constant.
> Here's the line for a Maj7 chords:
> ```javascript
> {formula:"1-3-5-7", integer:"04711", name:"Major seventh", suffix:"maj7"	}
> ```

The integer notation represent the number of semitones (or half steps) between each notes of a chord. Therefore, if we can calcultate the number of semitones between each notes, we'll be able to identify the nature of the chord.

Problem is we only have a tab notation, we don't know the notes yet, so we'll have to convert this tab into notes first.
To do so we need to know the tunning of the instrument (provided by the user) and a reference scale.
> We'll use an A scale, stored in the `MDL_A_SCALE` constant:
> ```javascript
> MDL_A_SCALE = ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];
> ```

Thanks to this scale we now know the position of any note on any string.
For instance, the 3rd fret on the B string is a D.

We still don't know the root not yet, it could be on any string.
We will calculate 1 formula for each played strings of the instrument, always considering the first note as the root.

Finally, for each created formulas, we're trying to find at least one match in our dictionary.

Note that a chord can have several names. For instance, `x02210` can be called Am (root on the A string) or C6 (root on the B string).

***

#### Graphic Representation

For the moment, the chord layout is built with <table> elements ("Tablature" is derived from the word "table" after all. :)).
However, an SVG version of this could be more scalable. I might work on this soon.

![alt text](http://git.hubertfauconnier.com/img/chord.png "")

***

#### Chord Generation

Work in progress...
