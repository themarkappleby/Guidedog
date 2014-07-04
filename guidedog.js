var Styleguide = function() {

  var sg = this 
  var baseUrl = ''

  sg.data = {} 
  sg.data.sections = [] 

  // load all dependencies
  var load_assets = function(){
    var html = ''
    baseUrl = $('[data-guidedog-path]').attr('src').replace('guidedog.js', '') 
    html += '<link rel="stylesheet" type="text/css" href="'+baseUrl+'lib/default.min.css" />'
    html += '<link rel="stylesheet" type="text/css" href="'+baseUrl+'lib/googlecode.min.css" />'
    html += '<link rel="stylesheet" type="text/css" href="'+baseUrl+'lib/guidedog.css" />'
    html += '<script type="text/javascript" src="'+baseUrl+'lib/highlight.min.js" />'
    html += '<script type="text/javascript" src="'+baseUrl+'lib/js-yaml.js" />'
    html += '<script type="text/javascript" src="'+baseUrl+'lib/markdown.js" />'
    html += '<script type="text/javascript" src="'+baseUrl+'lib/mustache.js" />'
    $('head').append(html)
  }

  // extract styleguide comments from stylesheet
  sg.init = function(s){
    load_assets()
    $.when($.get(s)).done(function(response) {
      var expression = /\/\*\!\!\!([\s\S]*?)\*\//mg
      while ((match = expression.exec(response)) != null){
        match = jsyaml.load(scrub_comments(match[1]))
        if (new_section(match.section)){
          var section = match.section
          if(!match.section) match.section = 'Undefined'
          sg.data.sections.push({
            "section": match.section, 
            "id": match.section.replace(/\s+/g, '').toLowerCase(), 
            "subSections": []
          })
        }
        var index = sectionIndex(match.section)
        sg.data.sections[index].subSections.push(match)
      }
      render()
    });
  }

  // pass json data to Mustache template
  var render = function(){
    $.get(baseUrl+'/lib/view.html', function(template) {
      console.log(sg.data)
      $('body').html('').append(Mustache.render(template, sg.data))
      $('pre code').each(function(i, e) {hljs.highlightBlock(e)})
    });
  }

  // fetch the index of a section
  var sectionIndex = function(match){
    for (var i=0; i<sg.data.sections.length; i++){
      if(sg.data.sections[i].section === match){
        return i
      }
    }
    return 0
  }

  // determine if a section already exists
  var new_section = function(section){
    for (key in sg.data.sections){
      if(section === sg.data.sections[key].section){
        return false
      }
    }
    return true
  }

  // prep string for YAML parser
  var scrub_comments = function(match){
    match = match.replace(/\ *\*\ /g, '')
    return match
  }
}
var sg = new Styleguide()
sg.init($('[data-guidedog-path]').attr('data-guidedog-path'));
