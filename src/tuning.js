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

export const GET = {
	guitar: {
		standard: ["E", "A", "D", "G", "B", "E"],
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