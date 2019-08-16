import { WORDING } from "./wordings";

/** Return true if tab contains only digits or the letter x
* @param {String} tab | Required | The tab to check for validity
* @return {Boolean}
*/
export function isValid (tab) {
	let pattern = new RegExp("^[x0-9]*$", "i");
	if (pattern.test(tab)) {
		return true;
	} else {
		throw WORDING.invalidTab;
	}
}