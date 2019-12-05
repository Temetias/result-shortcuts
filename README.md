# RESULT-SHORTCUTS
A simple browser extension providing keyboard shortcuts for google search results.

## How do you use it?
When viewing search results from google, hit `alt` + `1` to navigate to the first search result. `alt` + `2` for the second and so on.

## How it works?
The file only gets loaded when the url matches `*://*.google.com/search?*`. On `alt` + `[n]` press it reads the DOM, extracts the main navigation links to an array and navigates to the `[n]`th result.

## Future plans
1. Thorough testing
2. Ship to extension stores
3. Chrome and Brave support
4. DuckDuckGo support
