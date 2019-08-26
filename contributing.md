## Contributing

```
git clone https://github.com/greird/chordictionaryjs.git
npm install
```

If it has been installed correctly you should be able to launch ```npm test``` and see that every tests passed. 

The files to edit are in `src/`.

### Building and testing

Type `npm test` to compile the content of `/src` into `/build`.  
It will lint, minify and build 3 versions of the lib (ES6, CommonJS and IIFE) before runing the test again on the build.

If you'd like to run the test without building again, type `npm run qunit`. 

You can add new chords to be tested in `/_tests/chords.js` or edit the tests in `/_tests/test-commonjs.js`.
Chordictionary is using the unit testing framework [QUnit](https://qunitjs.com/).

Note that tests are run only on the transpiled CommonJS build `/build/commonjs/chordictionary.min.js`.

To check the chord layout rendering you can open `/_tests/test-getchordlayout.html` and add new chords in `/_tests/test-getchordlayout.js`.