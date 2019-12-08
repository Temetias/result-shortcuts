# RESULT-SHORTCUTS
A simple browser extension providing keyboard shortcuts for google search results.

## How can I get it?
The easiest way is to download it from an add-on store. Currently only available on [Firefox browser add-ons](https://addons.mozilla.org/fi/firefox/addon/result-shortcuts/). Coming to Chrome web store soon.
Alternatively, you can clone this repository and add it to your browser yourself. Support for directly installing add-ons may vary from browser to browser.

## How do you use it?
When viewing search results from google, hit `alt` + `1` to navigate to the first search result, `alt` + `2` for the second and so on.

## How it works?
The file only gets loaded when the url matches `*://*.google.com/search?*`. On `alt` press it reads the DOM, extracts the main result links and highlights them. An `[n]` press while holding `alt` navigates to the `[n]`th result.

## Future plans
1. Thorough testing
2. Customization options
3. DuckDuckGo support
