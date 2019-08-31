/** Find duplicated list entries in an array based
* @param {Array} haystack | Required | A list of lists
* @return {Array} The indexes of the diplicated entries
*/
export function dedupListOfLists(haystack) {
	let seen = [];
	let duplicates = [];

	for (let i = 0; i < haystack.length; i++) {
		let needle = haystack[i].filter(n => (n != null)).join("");
		if (seen.includes(needle)) {
			duplicates.push(i);
		} else {
			seen.push(needle);
		}
	}
	return duplicates;
}

/** Search for a keyword inside an object
* @param {Object} obj | The object to search in
* @param {String} keyword | The string to search for
* @return {Object} | Complete entry if found (NOT case sensitive)
* @return {Boolean} | false if no result
*/
export function searchInObject(obj, keyword) {
	if(typeof obj === "object") {
		if(typeof keyword === "string") {
			keyword = keyword.toLowerCase();
		}

		for (let i = 0; i < obj.length; i++) {

			for (let key in obj[i]) {

				if (obj[i][key] === keyword) {
					return obj[i];

				} else if(typeof obj[i][key] === "string") {

					if (obj[i][key].toLowerCase() === keyword) {
						return obj[i];
					}
				}
			}
		}
		throw "Couldn't find " + keyword + " in " + obj;
	} else {
		throw obj +" is not an object.";
	}
}

/** Find the minimum/maximum int in an array ignoring any NaN value OR Find an occurrences of a keyword in an array
* @return {Boolean} or {Int}
* @param {Array} arr | Required | An array;
* @param {String} what | Required | "min" or "max" or a keyword to search for
*/
export function arrayFind(arr, what) {
	let result = false;

	if (!Array.isArray(arr)) {
		throw arr + " is not an array.";
	}
	if (typeof what === "undefined") {
		throw "Missing parameter.";
	}

	switch (what) {

		case "min":
			result = Math.min.apply(Math, arr);

			if(!isNaN(result)) {
				return result;
			} else {

				for (let i = 0; i < arr.length; i++) {

					if (isNaN(arr[i])) {
						continue;
					} else if (isNaN(result)) {
						result = arr[i];
						continue;
					} else if (arr[i] < result) {
						result = arr[i];
					} else {
						continue;
					}
				}
			}
			break;

		case "max":
			result = Math.max.apply(Math, arr);

			if(!isNaN(result)) {
				return result;
			} else {

				for (let i = 0; i < arr.length; i++) {

					if (isNaN(arr[i])) {
						continue;
					} else if (isNaN(result)) {
						result = arr[i];
						continue;
					} else if (arr[i] > result) {
						result = arr[i];
					} else {
						continue;
					}
				}
			}
			break;

		default:
			result = occurrences(arr.join(""), what);
			break;
	}
	return result;
}

/** Function count the occurrences of substring in a string;
* @param {String} string   Required. The string;
* @param {String} subString    Required. The string to search for;
* @param {Boolean} allowOverlapping    Optional. Default: false;
* @author Vitim.us http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
*/
export function occurrences(string, subString, allowOverlapping) {
	string += "";
	subString += "";

	if (subString.length <= 0) {
		return (string.length + 1);
	}

	let n = 0,
		pos = 0,
		step = allowOverlapping ? 1 : subString.length;

	while (true) {
		pos = string.indexOf(subString, pos);

		if (pos >= 0) {
			++n;
			pos += step;
		} else {
			break;
		}
	}
	return n;
}

/** Count the number of occurrences of every items in an array
* @param {Array} array | Required
* @return {Object}
*/
export function countOccurences(array) {

	if (Array.isArray(array)) {
		let result = {};

		for(let i = 0; i < array.length; ++i) {

			if(!result[array[i]])
				result[array[i]] = 0;
			++result[array[i]];
		}
		return result;
	} else {
		throw array + " is not an array.";
	}
}