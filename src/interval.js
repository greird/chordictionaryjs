import { NOTES } from "./notes";

/**
* @const {Array} | List of diatonic intervals
* Helps us convert semitones into diatonic intervals
* https://en.wikipedia.org/wiki/Interval_(music)
*/
export const INTERVALS = ["P1", "m2", "M2", "m3", "M3", "P4", "A4/d5", "P5", "m6", "M6", "m7", "M7", "P8/d9", "m9/A8", "M9/d10", "m10/A9", "M10/d11", "P11/A10", "d12/A11", "P12/d13", "m13/A12", "M13/d14", "m14/A13", "M14/d15", "P15/A14", "A15"];

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

/** Convert an integer formula into its diatonic equivalent
* @param {Array} intervals | Required | The integer intervals as an array e.g. [0, 4, 7]
* @return {Array} e.g. [1, 3, 5]
*/
export function convertToDiatonic(intervals) {
	return intervals.map(x => (isNaN(x) || x === null) ? null : INTERVALS[x]);
}