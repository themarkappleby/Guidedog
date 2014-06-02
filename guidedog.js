var Styleguide = function() {

  var sg = this 
  var baseUrl = ''

  sg.data = {} 
  sg.data.sections = [] 
  sg.painters = []

  // load all dependencies
  var load_assets = function(){
    var target = $('[data-guidedog-path]')
    var url = target.attr('src')
    baseUrl = url.replace('guidedog.js', '') 
    var html = ''
    html += '<link rel="stylesheet" type="text/css" href="'+baseUrl+'/lib/default.min.css" />'
    html += '<link rel="stylesheet" type="text/css" href="'+baseUrl+'/lib/googlecode.min.css" />'
    html += '<link rel="stylesheet" type="text/css" href="'+baseUrl+'/lib/guidedog.css" />'
    html += '<script type="text/javascript" src="'+baseUrl+'/lib/highlight.min.js" />'
    html += '<script type="text/javascript" src="'+baseUrl+'/lib/js-yaml.js" />'
    html += '<script type="text/javascript" src="'+baseUrl+'/lib/markdown.js" />'
    html += '<script type="text/javascript" src="'+baseUrl+'/lib/mustache.js" />'
    $('head').append(html)
  }

  // extract styleguide comments from stylesheet
  sg.init = function(s){
    load_assets()
    $.when($.get(s)).done(function(response) {
      var expression = /\/\*\!\!\!([\s\S]*?)\*\//mg
      var match
      while ((match = expression.exec(response)) != null){
        match = parse_yaml(scrub_comments(match[1]))
        if (new_section(match.section)){
          var section = match.section
          if(!match.section) match.section = 'Undefined'
          sg.data.sections.push({"section": match.section, "subSections": []})
        }
        var index = sectionIndex(match.section)
        sg.data.sections[index].subSections.push(match)
      }
      render()
    });
  }

  // loop through and output data as html
  var render = function(){
    $('body').trigger('preRender')
    var html = ''
    $.get(baseUrl+'/lib/view.html', function(template) {

      var test = {"sections" : [
        {
          "section": "Avatars",
          "subSections": [
            {"title": "Your Avatar", "description": "Foo bar blah", "section": "Avatars" },
            {"title": "Large Avatar", "description": "Foo bar blah", "section": "Avatars" }
          ]
        },
        {
          "section": "Buttons",
          "subSections": [
            {"title": "Primary Button", "description": "Foo bar blah", "section": "Avatars" },
            {"title": "Secondary Button", "description": "Foo bar blah", "section": "Avatars" }
          ]
        }
      ]}

      $('body')
      .append(Mustache.render(template, sg.data))
      .append(nav())
      $('pre code').each(function(i, e) {hljs.highlightBlock(e)})
    });
  }

  // generate navigation
  var nav = function(){
    var html = '<nav class="sg">'
    for(section in sg.data.sections){
      html += '<a href="#'+ section +'">' + section + '</a>'
    }
    html += '</nav>'
    return html 
  }

  // render titles
  sg.painters.title = function(s){
    return '<h3 class="sg">'+s+'</h3>'
  }

  // render sections
  sg.painters.section = function(s){
    return ''
  }

  // render descriptions
  sg.painters.description = function(s){
    return markdown.toHTML(s)
  }

  // render swatches
  sg.painters.swatches = function(s){
    var output = '<div class="sg-swatches">'
    for (key in s){
      value = s[key]
      output += '<div class="sg-swatch">'
      output += '<div class="sg-swatch-sample" style="background-color:#'+value+'">'
      output += '</div>'
      output += '<div class="sg-swatch-info">'
      output += '<span class="sg-swatch-key">' + key + '</span> <span class="sg-swatch-value">#' + value + '</span>'
      output += '</div>'
      output += '</div>'
    }
    output += '</div>'
    return output 
  }

  // fetch the index of sections
  var sectionIndex = function(match){
    for (var i=0; i<sg.data.sections.length; i++){
      if(sg.data.sections[i].section === match){
        return i
      }
    }
    return 0
  }

  // render code samples
  sg.painters.example = function(s){
    var code = $('<span/>').text(s).html()
    code = '<pre><code>'+code+'</code></pre>'
    s = '<div class="sg-code-output">' + s + '</div>'
    return '<div class="sg-code">' + s + code + '</div>'
  }
  $(document).ready(function(){
    $('body').on('postRender', function(){
      $('pre code').each(function(i, e) {hljs.highlightBlock(e)})
    })
  });

  // determine if the section in question already exists
  var new_section = function(section){
    for (key in sg.data.sections){
      if(section === sg.data.sections[key].section){
        return false
      }
    }
    return true
  }

  // prep string for YAML parser but cleaning up white-space and comment marks
  var scrub_comments = function(match){
    match = match.replace(/\ *\*\ /g, '')
    match = match.replace(/\#/g, '')
    return match
  }

  // parse string as YAML
  var parse_yaml = function(match){
    return jsyaml.load(match)
  }
}
var sg = new Styleguide()
sg.init($('[data-guidedog-path]').attr('data-guidedog-path'));
