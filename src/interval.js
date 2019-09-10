import { NOTES } from "./notes";

/**
* @const {Array} | List of diatonic intervals
* Helps us convert semitones into diatonic intervals
* https://en.wikipedia.org/wiki/Interval_(music)
*/
export const DIATONIC = ["1", "b2", "2", "b3", "3", "4", "b5", "5", "#5", "6", "b7", "7"];

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