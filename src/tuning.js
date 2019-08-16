import { WORDING } from "./wordings";

/** Return true if tuning contains only letters from A to G
* @param {String} tuning | Required | The instrument tuning
* @return {Boolean}
*/
export function isValid (tuning) {
	let pattern = new RegExp("^[#a-g]+$", "i");
	if (pattern.test(tuning)) {
		return true;
	} else {
		throw WORDING.invalidTuning;
	}
}