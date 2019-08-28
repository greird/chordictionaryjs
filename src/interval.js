import { NOTES } from "./notes";

/**
* @const {Array} | List of diatonic intervals
* Helps us convert semitones into diatonic intervals
* https://en.wikipedia.org/wiki/Interval_(music)
*/
export const DIATONIC = ["1", "b2", "2", "b3", "3", "4", "b5", "5", "6", "b7", "7"];

/** Get the number of semitones between two notes a and b
* @param {String} a | Required | a note
* @param {String} b | Required | another note
* @return {int}	The number of semi-tones between the two notes
*/
export function get(a, b) {
	let interval = NOTES.indexOf(b) - NOTES.indexOf(a);
	// When an octave is reached (0), the numbers begin again at 12
	if (interval < 0) {
		interval = (NOTES.length) + interval;
	}
	return interval;
}

/** 
* Convert an integer formula into its diatonic equivalent
* @param {Array} intFormula | Required | The list of deduplicated semitones for the chord (e.g. [0, 4, 7])
* @return {Array} e.g. [1, 3, 5]
*/
export function toDiatonic(intFormula) {
	var integers = [...intFormula];
	var diatonics = [...integers].map(x => DIATONIC[x]);
	return [...diatonics].map(x => (x === undefined) ? null : x);
}