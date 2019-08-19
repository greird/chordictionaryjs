/**
* @const {Array} | Notes in a major scale in "A".
* Helps us identify the interval between each notes.
* e.g: if A is the Root (1), then B is the third (3) and bD the fifth (5).
*/
export const A = ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];

export function getInterval(a, b) {
	let interval = A.indexOf(b) - A.indexOf(a);
	// When an octave is reached (0), the numbers begin again at 12
	if (interval < 0) {
		interval = (A.length) + interval;
	}
	return interval;
}