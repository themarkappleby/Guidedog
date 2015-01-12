var fs = require('fs');
var markdown = require('micromarkdown');
var handlebars = require('handlebars');
var html2jade = require('html2jade');

// loop through data and expand all markdown
// takes: the data hash
// returns: the data hash
function expandMarkdown(data){

	// loop through each item in the data array
	for(var index=0; index < data.length; index++){
		var dataItem = data[index];

		// loop through each key/value pair
		for(var key in dataItem){
			if(dataItem.hasOwnProperty(key)){

				// expand any markdown held in the value
				dataItem[key] = markdown.parse(dataItem[key]);
			}
		}
	}
	return data;
}

// fetch the required interface files and populate
// the template with the data, returns the HTML as
// a string.
function generateHtml(data){

	// house data under a key
	data = { items: data };

	// fetch the template file
	var file = fs.readFileSync('src/lib/ui/template.html', 'utf8');

	// add css into the head of the template
	var css = fs.readFileSync('src/lib/ui/guidedog.css', 'utf8');
	file = file.replace('{{css}}', css);

	// add javascript into the head of the template
	var js = fs.readFileSync('src/lib/ui/guidedog.js', 'utf8');
	file = file.replace('{{js}}', js);

	// compile the template into a Handlebars object
	var template = handlebars.compile(file);

	// populate the template with data
	return template(data);
}

module.exports = function(data){

	// expand markdown text
	data = expandMarkdown(data);

	// generate the HTML
	data = generateHtml(data);
	return data;

	// convert the template to jade
	/*
	html2jade.convertHtml(data, {}, function (err, jade) {
		console.log(jade);
	});
	*/
}