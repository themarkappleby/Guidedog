var yaml = require('js-yaml');

// parse a string for styleguide comment blocks
// takes: a string
// returns: an array of strings
function extractComments(data) {

	var matches = [];

	// scan for styleguide comments 
	var regexExpression = /\/\*gd([\s\S]*?)\*\//g;
	while ((match = regexExpression.exec(data)) != null){
		matches.push(match[1]);
	}
	return matches;
}

// strip unnecessary leading and trailing whitespace
// takes: an array of strings
// returns: an array of strings
function cleanComments(data) {
	for(var i=0; i<data.length; i++){

		// remove leading and trailing whitespace
		data[i] = data[i].replace(/^\s+|\s+$/g,'');

		// replace tabs with spaces (YAML does not support tabs)
		data[i] = data[i].replace(/\t\t/g, '  ');

		// parse string as YAML
		data[i] = yaml.safeLoad(data[i]);
	}
	return data;
}


module.exports = function(data){
	data = extractComments(data);
	data = cleanComments(data);
	return data;
}