/**
 * Mapping of keycodes to array result indexes. Numkey 1 is first index, numkey 2 is second, etc.
 * There's usually only 7-ish results and using numkeys 8-9-0 don't seem reasonable as a keyboard
 * shortcut.
 */
const NUMBER_KEYS = Object.freeze({
	49: 0,
	50: 1,
	51: 2,
	52: 3,
	53: 4,
	54: 5,
	55: 6,
	56: 7,
});

/**
 * The key set to arm the functionality. Default to "alt".
 */
const COMMAND_KEY = 18;

/**
 * The CSS class providing the highlight efects.
 */
const HIGHLIGHT_CLASS = "result-shortcut-highlight";

/**
 * Simple composition function. Returns the composition of a and b.
 *
 * @param a Function that takes as parameter the result of b
 * @param b Function that is the composition entry point.
 */
function compose(a, b) {
	return function(...args) {
		return a(b(...args));
	};
}

/**
 * Filters special suggestion boxes and other clutter away from search results.
 * Checks if the element has and only has the class "g". Helps us to filter out the google special
 * suggestion boxes, etc.
 *
 * @param elCollection The search results element collection.
 */
function filterSpecialResultBoxes(elCollection) {
	return Array.from(elCollection).filter(el => el.getAttribute("class") === "g");
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
 * Checks if an element has a class (other than something inserted by this script).
 * Google search results have classes on all irrelevant links. This provides us a reliable way
 * to only target the result links.
 *
 * @param el Element to be checked for classes.
 */
function hasNoClass(el) {
	return el.getAttribute("class") === ""
		|| el.getAttribute("class") === null
		|| el.getAttribute("class").includes(HIGHLIGHT_CLASS);
}

/**
 * Extracts an "a" element from a result box.
 *
 * @param result The search result box.
 */
function getAElFromResult(result) {
	return Array.from(result.getElementsByTagName("a"))
		.filter(hasNoClass)[0]
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
 * Provides an index modified class to the element for adding the index after element.
 * 
 * @param index The index modifier of the class.
 */
function highlightIndexClass(index) {
	return `${HIGHLIGHT_CLASS}--${index + 1}`;
}

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
function highlight(el, index) {
	el.classList.add(HIGHLIGHT_CLASS);
	el.classList.add(highlightIndexClass(index));
}

/**
 * Removes the highlight from the element.
 *
 * @param el The element to remove the highlight from.
 */
function removeHighlight(el, index) {
	el.classList.remove(HIGHLIGHT_CLASS);
	el.classList.remove(highlightIndexClass(index));
}

/**
 * Handles a number-key press. Navigates to the nth result of the number pressed.
 * Is used with combination of command-key press and doesn't trigger without it.
 *
 * @param event The keyboardevent.
 */
function onNumberPressed({ keyCode }) {
	const keyIndex = NUMBER_KEYS[keyCode];
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
	if (keyCode === COMMAND_KEY) {
		getAEls().map(highlight);
		window.removeEventListener("keydown", onCommandKeyDown);
		window.addEventListener("keydown", onNumberPressed);
	}
}

/**
 * Handles the command-key release. Disarms the number-key functionality.
 *
 * @param event The keyboardevent.
 */
function onCommandKeyUp({ keyCode }) {
	if (keyCode === COMMAND_KEY) {
		getAEls().map(removeHighlight);
		window.addEventListener("keydown", onCommandKeyDown);
		window.removeEventListener("keydown", onNumberPressed);
	}
}

// Attach events.
window.addEventListener("keydown", onCommandKeyDown);
window.addEventListener("keyup", onCommandKeyUp);
