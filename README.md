ChordictionaryJS
======

![status](https://img.shields.io/badge/version-alpha-blue.svg)
[![David](https://img.shields.io/david/greird/chordictionaryjs.svg?maxAge=86400)](https://github.com/greird/chordictionaryjs/blob/master/package.json)
[![David](https://img.shields.io/david/dev/greird/chordictionaryjs.svg?maxAge=86400)](https://github.com/greird/chordictionaryjs/blob/master/package.json)
[![GitHub issues](https://img.shields.io/github/issues/greird/chordictionaryjs.svg?maxAge=86400)](https://github.com/greird/chordictionaryjs/issues)
[![Build Status](https://travis-ci.org/greird/chordictionaryjs.svg?branch=master)](https://travis-ci.org/greird/chordictionaryjs)
[![Gitter](https://badges.gitter.im/chordictionaryjs/Lobby.svg)](https://gitter.im/chordictionaryjs/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

A dependency-free javascript library for dynamic chord recognition/generation for any fretted instrument.
It converts common chord tab notation, such as `x32010`, into its graphical representation, recognizes the chord and returns its real name and composition.

**Please note this is work in progress and it is not 100% reliable yet.**

## Table of Contents
- [List of supported chords](#list-of-supported-chords)
- [Setup](#setup)
- [How To](#how-to)
- [Contribute](#contribute)
- [What's next ?](#whats-next-)

***


## List of supported chords

Note that tests have been run through guitar standard tuning only (EADGBE). 
Results may vary depending on your instrument's tuning and number of strings. 

The current matching system is very strict. Your tab won't match any chord unless it has all the requested notes. For instance, an m9(maj7) chord without a fifth won't be recognized.

##### Supported
- Minor (min)
- Major (maj)
- Powerchord (5)
- Suspended fourth (sus4)
- Suspended second (sus2)
- Augmented (aug)
- Diminished (dim)
- Sixth (6)
- Minor sixth (m6)
- Minor, flat sixth (mb6)
- Major sixth (maj6)
- Seventh & Dominant seventh (7)
- Minor seventh (m7)
- Minor seventh, flat fifth (m7b5)
- Major seventh (maj7)
- Minor, major seventh (m(maj7))
- Minor, added ninth (m(add9))
- Added ninth(add9)
- Sixth, added ninth (6/9)
- Minor sixth, added ninth (m6/9)
- Minor ninth, major seventh (m9(maj7))
- Minor eleventh (m9b5)
- Major thirteen (maj13)

##### Not supported yet
- Major ninth (maj9)
- Minor ninth (m9)
- Major seventh, sharp eleventh (maj7#11)
- Minor thirteen (m13)

***


## Setup

Include [`chordictionary.min.js`](https://raw.githubusercontent.com/greird/chordictionaryjs/master/build/chordictionary.min.js) and [`chordictionary.min.css`](https://raw.githubusercontent.com/greird/chordictionaryjs/master/build/chordictionary.min.css) to your project.

## How To

### Define your instrument

The first thing you will need to do is to define your instrument. You do this by creating a new instance of Chordictionary.

```javascript
Chordictionary (tuning, fretNumber, fretsToDisplay, maxSpan)
/**
* @param {String} tuning | Required | The instrument tuning in standard letter notation (e.g.: "EADGBE")
* @param {Int} fretNumber | Required | The instrument's number of frets.
* @param {Int} fretsToDisplay | Optional | The number of frets to be displayed on a chord layout. (0 = auto-resize, default 0)
* @param {Int} maxSpan | Optional | The maximum number of frets that can be played in one chord. (Default 4)
*/
```

For instance, if you're an electric guitar player, you may define your instrument as follow.

`var myInstrument = new Chordictionary('EADGBE', 24, 7, 4);`

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

`myInstrument.isValidTab(tab)` and `myInstrument.isValidTuning(tuning)` will check the validity of a given tab notation or tuning and return True or False.
Note that these functions are completely unrelated to your instrument instance.

```javascript
// Usage

myInstrument.isValidTab("x32010");
// Return
True // Will be interpreted as ['x','3','2','0','1','0']

myInstrument.isValidTab("911111099");
// Return
True // Will be interpreted as ['9','11','11','10','9','9']

myInstrument.isValidTuning("E#A#D#G#B#E#");
// Return
True // Will be interpreted as ['E#','A#','D#','G#','B#','E#']
```

***


## Contribute

Come on guys, I can't do this alone ! :)

```
git clone https://github.com/greird/chordictionaryjs.git
npm install
```

If it has been installed correctly you should be able to launch ```npm test``` and see that every tests passed. 

The only file to edit is `/src/chordictionary.js`.

To run some unit tests, type `gulp test` or go to `/_tests`. (Note that this will only test compiled code from the /build directory.)
You may need to edit or add new tests in `/_tests/test.js`.  
I'm using the unit testing framework [QUnit](https://qunitjs.com/).

Finally, type `gulp build` to compile the content of `/src` into `/build`.  
It will lint, minify, build 3 versions of the lib (ES6, CommonJS and IIFE) before running the tests again on the the IIFE version of the lib.

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
		{ tab: [3,2,0,0,3,3], tag: ['basic'] },
		{ tab: [3,5,5,4,3,3], tag: ['bar'] },
		{ tab: [x, 10, 12, 12, 12, 10], tag: ['bar'] },
		],
	offset: 29927
}
```