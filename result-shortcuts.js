/**
 * Mapping of keycodes to array result indexes. Key 1 is first index, key 2 is second, etc.
 */
const NUMBER_KEYS = Object.freeze({
	code_49: 0,
	code_50: 1,
	code_51: 2,
	code_52: 3,
	code_53: 4,
});

/**
 * Simple composition function. Returns the composition of a and b.
 *
 * @param a Function that takes as parameter the result of b
 * @param b Function that is the composition entry point.
 */
function compose(a, b) {
	return function(x) {
		return a(b(x));
	};
}

/**
 * Gets the individual result boxes from google results. Targets only the actual results, not ads.
 */
function getResultsBoxes() {
	return document.getElementById("res").getElementsByClassName("g");
}

/**
 * Checks if an element has a class. Google search results have classes on all irrelevant links. This
 * provides us a reliable way to only target the result links.
 *
 * @param el Element to be checked for classes.
 */
function hasNoClass(el) {
	return el.getAttribute("class") === "" | el.getAttribute("class") === null;
}

/**
 * Filters only the relevant "a" elements from a collection based on the class existence check.
 *
 * @param aCollection Collection of a elements.
 */
function filterRelevantLinks(aCollection) {
	return Array.from(aCollection).filter(hasNoClass);
}

/**
 * Extracts a href from the individual result component.
 *
 * @param result The result component containing the links and text related to the result.
 */
function getHrefFromResult(result) {
	const aCollection = result.getElementsByTagName("a");
	const filtered = filterRelevantLinks(aCollection);
	return filtered[0].getAttribute("href");
}

/**
 * Extracts only hrefs from all the results, utilizing the functions above.
 *
 * @param results The search results.
 */
function getHrefsFromBoxes(results) {
	return Array.from(results).map(getHrefFromResult);
}

/**
 * Combination of getting the results and extracting the hrefs out of them.
 */
const getHrefs = compose(getHrefsFromBoxes, getResultsBoxes);

/**
 * Navigates to the provided href.
 *
 * @param href The href to navigate to.
 */
function goToHref(href) {
	window.location.href = href;
}

/**
 * Handles a number-key press. Navigates to the nth result of the number pressed.
 * Is used with combination of alt-key press and doesn't trigger without it.
 *
 * @param event The keyboardevent.
 */
function onNumberPressed({ keyCode }) {
	const keyIndex = NUMBER_KEYS[`code_${keyCode}`];
	if (keyIndex !== undefined) {
		const href = getHrefs()[keyIndex];
		goToHref(href);
	}
}

/**
 * Handles the alt-key press. Arms the number-key functionality.
 *
 * @param event The keyboardevent.
 */
function onAltDown({ keyCode }) {
	window.removeEventListener("keydown", onAltDown);
	if (keyCode === 18) {
		window.addEventListener("keydown", onNumberPressed);
	}
}

/**
 * Handles the alt-key release. Disarms the number-key functionality.
 *
 * @param event The keyboardevent.
 */
function onAltUp({ keyCode }) {
	window.addEventListener("keydown", onAltDown);
	if (keyCode === 18) {
		window.removeEventListener("keydown", onNumberPressed);
	}
}

// Attach events.
window.addEventListener("keydown", onAltDown);
window.addEventListener("keyup", onAltUp);
