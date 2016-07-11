ChordictionaryJS
======

![status](https://img.shields.io/badge/version-alpha-blue.svg)
[![David](https://img.shields.io/david/greird/chordictionaryjs.svg?maxAge=2592000)](https://github.com/greird/chordictionaryjs/blob/master/package.json)
[![David](https://img.shields.io/david/dev/greird/chordictionaryjs.svg?maxAge=2592000)](https://github.com/greird/chordictionaryjs/blob/master/package.json)
[![GitHub issues](https://img.shields.io/github/issues/greird/chordictionaryjs.svg?maxAge=2592000)](https://github.com/greird/chordictionaryjs/issues)

Web-based dynamic chord recognition and generation for any fretted instrument.
It converts common chord tab notation, such as `x32010`, into its graphical representation, recognizes the chord and returns its real name and composition.

**Please note this is work in progress and it is not 100% reliable yet.**

***

## Setup

Include [`chordictionary.min.js`](https://raw.githubusercontent.com/greird/chordictionaryjs/master/build/chordictionary.min.js) and [`chordictionary.min.css`](https://raw.githubusercontent.com/greird/chordictionaryjs/master/build/chordictionary.min.css) to your project.

## How To

### Define your instrument

The first thing you will need to do is to define your instrument.

```javascript
Chordictionary.Instrument(tuning, fretNumber, fretsToDisplay, maxSpan)
/**
* @param {String} tuning | Required | The instrument tuning in standard letter notation (e.g.: "EADGBE")
* @param {Int} fretNumber | Required | The instrument's number of frets.
* @param {Int} fretsToDisplay | Optional | The number of frets to be displayed on a chord layout. (0 = auto-resize, default 0)
* @param {Int} maxSpan | Optional | The maximum number of frets that can be played in one chord. (Default 4)
*/
```

For instance, if you're an electric guitar player, you may define your instrument as follow.

`var myInstrument = new Chordictionary.Instrument('EADGBE', 24, 7, 4);`

Here I've define a guitar in standard tuning "EADGBE" (from the lowest to highest string). It has a total of 24 frets.
I want the graphic representation to display 7 frets.
The maximum number of frets I can cover with my hand is 4 (Chordictionary will take this in consideration when generating chords).

### Recognize a chord and get all information about a tab

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

### Get graphical representation of a tab

`myInstrument.getChordLayout(name, tab);` will return an html layout for the given tab notation.

`name` The name of the chord. It will be displayed in a caption below the tab graphical representation.

`tab` A standard tab notation, as a string with no blank space. Can contains any number or the letter 'x'.

```javascript
// Usage
myInstrument.getChordLayout("C", "x32010");

// Will return a string or false if cannot generate layout.
'<table class="chord">...</table>'
```

For the moment, the chord layout is built with table elements ("Tablature" is derived from the word "table" after all. :)).
However, an SVG version of this could be more scalable.

![alt text](http://git.hubertfauconnier.com/img/chord.png "")

### Check if tab or tuning is valid

`Chordictionary.isValidTab(tab)` and `Chordictionary.isValidTuning(tuning)` will check the validity of a given tab notation or tuning and return True or False.
Note that these functions are completely unrelated to your instrument instance.

```javascript
// Usage

Chordictionary.isValidTab("x32010");
// Return
True // Will be interpreted as ['x','3','2','0','1','0']

Chordictionary.isValidTab("911111099");
// Return
True // Will be interpreted as ['9','11','11','10','9','9']

Chordictionary.isValidTuning("E#A#D#G#B#E#");
// Return
True // Will be interpreted as ['E#','A#','D#','G#','B#','E#']
```

***

## For dev purpose

```
git clone https://github.com/greird/chordictionaryjs.git
npm install
```

The only file to edit is `/src/chordictionary.js`.

To test the `/src/chordictionary.js` file, type `Gulp test` or go to `/_testfiles/test_dev.html`.

Type `Gulp build` to compile the content of `/src` into `/build`. Tests will be run on the compiled file.

***

## What's next ?

**Beware, the following feature is still under development !**

### Generating an exhaustive tabs list from a given chord name

`myInstrument.getChordsList(name, limit, offset);` will return a list of valid tab notation for a chord.

`name` The chord name as a string such as 'C', 'Gmin', 'E#sus4', 'F#7', etc.

`limit` The number of chords to be generated.

`offset` The id of the last chord generated, used for pagination. You will retrieve this value in the return from the previous call.

```javascript
// Usage
myInstrument.getChordsList("G", 4);

// Will return an object
{
	error: "",
	chordList: [
		{ tab: [3,2,0,0,0,3], tag: ['basic'] },
		{ tab: [3,2,0,4,0,3], tag: ['basic'] },
		{ tab: [3,2,0,0,3,3], tag: ['basic'] },
		{ tab: [3,5,5,4,3,3], tag: ['basic', 'bar'] },
		],
	offset: 29927
}
```