ChordictionaryJS
======

Web-based dynamic chord recognition and generation for any fretted instrument.
It converts common chord tab notation, such as `x32010`, into its graphical representation, recognizes the chord and returns its real name and composition.

**Please note this is work in progress and it is not 100% reliable yet.**

## How it works

3 main methods :
- Chord recognition
- Graphic representation of a chord
- Chord generation

***

#### Chord Recognition

It will work with any kind of tunning and any number of strings.

```javascript
chordRecognition(tab, tunning);
// tab 		A tab notation
// tunning 	The instrument tunning

// Example
chordRecognition("xx5545", "EADGBE");

// Will return an object
{
	message: "",
	formula: ["1-b3-5-6", "1-b3-b5-b7"],
	name: ["Cm6", "Am7b5"],
	notes: "xxGCD#A",
	tab: "xx5545",
	tunning: "EADGBE"
}
```

##### The logic

In order to guess the name of a chord we need to find its formula. For instance, a Major Seventh chord is always composed of a root, a third, a fifth and a seventh `1-3-5-7` or `04711` in integer notation.
> All the formulas are stored in `model/chordFormulasDictionnary.js` which is our knowledge base.
> Here's the line for a Maj7 chords:
> ```javascript
> {formula:"1-3-5-7", integer:"04711", name:"Major seventh", suffix:"maj7"	}
> ```

The integer notation represent the number of semitones (or half steps) between each notes of a chord. Therefore, if we can calcultate the number of semitones between each notes, we'll be able to identify the nature of the chord.

Problem is we only have a tab notation, we don't know the notes yet, so we'll have to convert this tab into notes first.
To do so we need to know the tunning of the instrument (provided by the user) and a reference scale.
> We'll use an A scale, stored in `model/scale.js`:
> ```javascript
> var aScale = ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];
> ```

Thanks to this scale we now know the position of any note on any string.
For instance, the 3rd fret on the B string is a D.

We still don't know the root not yet, it could be on any string.
We will calculate 1 formula for each played strings of the instrument, always considering the first note as the root.

Finally, for each created formulas, we're trying to find at least one match in our dictionnary.

Note that a chord can have several names. For instance, `x02210` can be called Am (root on the A string) or C6 (root on the B string).

###### Requirements

`chordRecognition.js` can work as a standalone as long as the knowledge based contained in `model/chordFormulasDictionnary.js` and `model/scale.js` is provided.

***

#### Graphic Representation

wip

![alt text](http://git.hubertfauconnier.com/img/chord.png "")

***

#### Chord generation

wip
