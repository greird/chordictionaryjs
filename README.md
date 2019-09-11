ChordictionaryJS
======

![status](https://img.shields.io/badge/version-beta-blue.svg)
[![David](https://david-dm.org/greird/chordictionaryjs/status.svg)](https://david-dm.org/greird/chordictionaryjs)
[![David](https://david-dm.org/greird/chordictionaryjs/dev-status.svg)](https://david-dm.org/greird/chordictionaryjs?type=dev)
[![GitHub issues](https://img.shields.io/github/issues/greird/chordictionaryjs.svg?maxAge=86400)](https://github.com/greird/chordictionaryjs/issues)
[![Build Status](https://travis-ci.org/greird/chordictionaryjs.svg?branch=master)](https://travis-ci.org/greird/chordictionaryjs)

A dependency-free javascript library for dynamic chord recognition/generation for any fretted instrument.
It converts common chord tab notation, such as `x32010`, into its graphical representation, recognizes the chord and returns its real name and composition.

For a demonstration of what can be done with this library, check out [chordictionary.com](http://www.chordictionary.com).


***



## Setup

`npm install chordictionary`

```JavaScript
const chordictionary = require('chordictionary');
```

For proper styling of the chords layout, you can use the css from the package and copy it to your project.
```shell
cp node_modules/chordictionary/build/chordictionary.min.css ./css/
```

For more installation options check out the [documentation](./docs/DOCUMENTATION.md).



## Documentation

Read the [documentation](./docs/DOCUMENTATION.md) to know how to install and use Chordictionary in your own project.  



## Contributing

Want to help me build this project ? Feel free to report any issue you may have or check out the [contributing guidelines](./docs/CONTRIBUTING.md) to give me a hand.
