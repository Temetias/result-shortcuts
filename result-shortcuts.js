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
 * The key set to arm the functionality.
 */
const COMMAND_KEY = 18;

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
 * Checks if the element has and only has the class "g". Helps us to filter out the google special
 * suggestion boxes, etc.
 *
 * @param el The element to check.
 */
function hasOnlyGClass(el) {
	return el.getAttribute("class") === "g";
}

/**
 * Filters special suggestion boxes and other clutter away from search results.
 *
 * @param elCollection The search results element collection.
 */
function filterSpecialResultBoxes(elCollection) {
	return Array.from(elCollection).filter(hasOnlyGClass)
}

/**
 * Gets the individual result boxes from google results. Targets only the actual results, not ads.
 */
function getResultsBoxes() {
	return document.getElementById("res").getElementsByClassName("g");
}

/**
 * Gets the search results boxes with special boxes filtered out.
 */
const getFilteredResultsBoxes = compose(filterSpecialResultBoxes, getResultsBoxes);

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
 * Extracts an "a" element from a result box.
 *
 * @param result The search result box.
 */
function getAElFromResult(result) {
	const aCollection = result.getElementsByTagName("a");
	return filterRelevantLinks(aCollection)[0];
}

/**
 * Gets the href from an "a" element.
 */
function getHrefFromAEl(a) {
	return a.getAttribute("href");
}

/**
 * Extracts a href from the individual result component.
 *
 * @param result The result component containing the links and text related to the result.
 */
const getHrefFromResult = compose(getHrefFromAEl, getAElFromResult);

/**
 * Extracts only hrefs from all the results, utilizing the functions above.
 *
 * @param results The search results.
 */
function getHrefsFromBoxes(results) {
	return Array.from(results).map(getHrefFromResult);
}

/**
 * Extracts only "a" elements from all the results, utilizing the functions above.
 *
 * @param rsults The search results
 */
function getAElsFromBoxes(results) {
	return Array.from(results).map(getAElFromResult);
}

/**
 * Combination of getting the results and extracting the hrefs out of them.
 */
const getHrefs = compose(getHrefsFromBoxes, getFilteredResultsBoxes);

/**
 * Combination of getting the results and extracting the "a" elements out of them.
 */
const getAEls = compose(getAElsFromBoxes, getFilteredResultsBoxes);

/**
 * Navigates to the provided href.
 *
 * @param href The href to navigate to.
 */
function goToHref(href) {
	window.location.href = href;
}

/**
 * Highlights an element. Used to emphasize the items in the shortcutting
 *
 * @param el The element to highlight.
 */
function highlight(el) {
	el.style.border = "1px dotted tomato";
}

/**
 * Removes the highlight from the element.
 *
 * @param el The element to remove the highlight from.
 */
function removeHighlight(el) {
	el.style.border = "";
}

/**
 * Highlights the "a" elements in the shortcuts.
 */
function highlightAEls() {
	getAEls().map(highlight);
}

/**
 * Removes the highlights.
 */
function removeAElHighlights() {
	getAEls().map(removeHighlight);
}

/**
 * Handles a number-key press. Navigates to the nth result of the number pressed.
 * Is used with combination of command-key press and doesn't trigger without it.
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
 * Handles the command-key press. Arms the number-key functionality.
 *
 * @param event The keyboardevent.
 */
function onCommandKeyDown({ keyCode }) {
	highlightAEls();
	window.removeEventListener("keydown", onCommandKeyDown);
	if (keyCode === COMMAND_KEY) {
		window.addEventListener("keydown", onNumberPressed);
	}
}

/**
 * Handles the command-key release. Disarms the number-key functionality.
 *
 * @param event The keyboardevent.
 */
function onCommandKeyUp({ keyCode }) {
	removeAElHighlights();
	window.addEventListener("keydown", onCommandKeyDown);
	if (keyCode === COMMAND_KEY) {
		window.removeEventListener("keydown", onNumberPressed);
	}
}

// Attach events.
window.addEventListener("keydown", onCommandKeyDown);
window.addEventListener("keyup", onCommandKeyUp);
