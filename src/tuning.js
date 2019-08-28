/** Return true if tuning contains only letters from A to G
* @param {String} tuning | Required | The instrument tuning
* @return {Boolean}
*/
export function isValid (tuning) {
	let pattern = new RegExp("^[#a-g]+$", "i");
	if (pattern.test(tuning)) {
		return true;
	} else {
		return false;
	}
}

/** Split tuning into notes
* @param {String} tuning | Required | The tuning of the instrument (e.g: "EADGBE" or "E#A#D#G#B#E#")
* @return {Array} | Containing each note
*/
export function parse(tuning) {
	let tuningArray = [],
		noSharps = new RegExp("^[a-g]+$", "i"),
		containSharps = new RegExp("^[#a-g]+$", "i");

	if (noSharps.test(tuning)) {
		return tuning.toUpperCase().split("");

	} else if (containSharps.test(tuning)) {
		tuning = tuning.toUpperCase();

		for (let i = 0; i < tuning.length; i++) {

			if (tuning.charAt(i) !== "#") {

				if (tuning.charAt(i+1) !== "#") {
					tuningArray.push(tuning.slice(i, i+1));
				} else {
					tuningArray.push(tuning.slice(i, i+2));
					i++;
				}
			}
		}
		return tuningArray;
	} else {
		return false;
	}
}

export const GET = {
	guitar: {
		standard: ["E", "A", "D", "G", "B", "E"],
		halfstepdown: ["D#", "G#", "C#", "F#", "A#", "D#"],
		drop_d: ["D", "A", "D", "G", "B", "E"],
		d_modal: ["D", "A", "D", "G", "A", "D"],
		open_g: ["G", "G", "D", "G", "B", "D"]
	},
	bass: {
		standard: ["E", "A", "D", "G"],
		drop_d: ["C", "A", "D", "G"]
	},
	ukulele: {
		standard: ["G", "C", "E", "A"]
	},
	violin: {
		standard: ["G", "D", "A", "E"]
	}
};