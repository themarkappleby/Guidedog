# Guidedog Gameplan

---

parser.js
The main processor. Parses a string for Guidedog comments. Returns a hash.
Uses: yaml, markdown

---

view.js
Generates the Guidedog view code from a Guidedog hash. Requires parser.js. Also uses:
	- template.(html|php|jade|haml) - handlebars template for the user interface
	- guidedog.js - angular script that handles interactions within the user interface
	- guidedog.css - stylesheet to format the Guidedog user interface
Uses: handlebars
Client-side: angular, prism

---

guidedog.js
Small client-side wrapper that sits on top of parser.js and view.js. Fetches a string
via ajax, passes the string to parser.js for processing, passes the result to view.js to
generate the view data, replaces current view with result.

---

gulp-guidedog.js / grunt-guidedog.js
Small build process wrapper that sits on top of parser.js and view.js. Pass the wrapper
the contents of a CSS file(s) and it returns the generated view data.

---

lorem.js
Expand lorem ipsum shortcodes in strings. Used by parser.js.

---

