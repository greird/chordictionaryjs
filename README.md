ChordictionaryJS
======

Web-based dynamic chord recognition and generation for any fretted instrument.
It converts common chord tab notation, such as `x32010`, into its graphical representation, recognizes the chord and returns its real name and composition.

**Please note this is work in progress and it is not 100% reliable yet.**

***

## Setup

Include `Chordictionary.min.js` to your project.

The first thing you will need to do is to define your instrument.

```javascript 
Chordictionary.Instrument(tuning, fretNumber, fretsToDisplay, maxSpan) 
```

`tuning` The instrument tuning in standard letter notation (e.g.: "EADGBE")

`fretNumber` The instrument's number of frets.

`fretsToDisplay` The number of frets to be displayed on a chord layout. 0 = auto-resize. (Optional, default to 0)

`maxSpan` The maximum number of frets that can be played in one chord. (Optional, default to 5)



For instance, if you're an electric guitar player, you may define you instrument as follow.

`var myInstrument = new Chordictionary.Instrument('EADGBE', 24, 7, 5);`

Here I've define a guitar in standard tuning "EADGBE" (from the lowest to highest string). It has a total of 24 frets.
I want the graphic representation to display 7 frets.
The maximum number of frets I can cover with my hand is 5 (Chordictionary will take this in consideration when generating chords).

## Recognize a chord and get all information about a tab

`myInstrument.getChordInfo(tab);` will return every known information about a tab notation, including: the chord name(s), the notes composition and the chord(s) formula.

`tab` A standard tab notation, as a string with no blank space. Can contains any number or the letter 'x'.

```javascript
// Usage
myInstrument.getChordInfo("xx5545");

// Will return an object
{
	error: "",
	formula: ["1-b3-5-6", "1-b3-b5-b7"],
	name: ["Cm6", "Am7b5"],
	notes: "xxGCD#A",
	tab: "xx5545",
	tuning: "EADGBE"
}
```

## Get tab notation from a chord name

`myInstrument.getChordsList(name, limit, offset);` will return a list of valid tab notation for a chord.

`name` The chord name as a string such as 'C', 'Gmin', 'E#sus4', 'F#7', etc.

`limit` The number of chords to be generated.

`offset` The id of the last chord generated, used for pagination. You will retrieve this value in the return from the previous call.

```javascript
// Usage
myInstrument.getChordsList("G", 5);

// Will return an object
{
	error: "",
	chordList: [[3,2,0,0,0,3],[3,2,0,4,0,3],[3,2,0,0,3,3],[3,2,5,4,3,3],[3,5,5,4,3,3]],
	offset: 29927
}
```

## Get graphical representation of a tab

`myInstrument.getChordLayout(tab);` will return an html layout for the given tab notation.

`tab` A standard tab notation, as a string with no blank space. Can contains any number or the letter 'x'.

```javascript
// Usage
myInstrument.getChordLayout("x32010");

// Will return a string or false if cannot generate layout.
'<table class="chord">...</table>'
```

For the moment, the chord layout is built with table elements ("Tablature" is derived from the word "table" after all. :)).
However, an SVG version of this could be more scalable. I might work on this soon.

![alt text](http://git.hubertfauconnier.com/img/chord.png "")

### Check if tab or tuning is valid

`Chordictionary.isValidTab(tab)` and `Chordictionary.isValidTuning(tuning)` will check the validity of a given tab notation or tuning and return True or False.
Note that these functions are completely unrelated to your instrument instance.

```javascript
// Usage

Chordictionary.isValidTab("x32010");
// Return
True // ['x','3','2','0','1','0']

Chordictionary.isValidTab("911111099");
// Return
True // ['9','11','11','10','9','9']

Chordictionary.isValidTuning("E#A#D#G#B#E#");
// Return
True // ['E#','A#','D#','G#','B#','E#']
```
