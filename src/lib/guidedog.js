var fs = require('fs');
var parser = require('./parser');
var generator = require('./ui/generator');

function parse(){
	if(process.argv.length > 2){
		var file = process.argv[2];

		if(fs.existsSync(file)){
			var content = fs.readFileSync(file, 'utf8');
			content = parser(content);
			content = generator(content);
			console.log(content);
			fs.writeFile('./styleguide.html', content, function(err){
				if(err) throw err;
				console.log('file saved!');
			})
		}
		else{
			console.log("Error: '" + file + "' not found");
		}
	}
	else{
		console.log('Error: No file specified');
	}
}

exports.parse = parse;