var Styleguide = function() {

  var sg = this 
  var baseUrl = ''

  sg.data = {} 
  sg.data.sections = [] 
  sg.data.info = []

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
    html += '<script type="text/javascript" src="'+baseUrl+'lib/beautify-html.js" />'
    html += '<script type="text/javascript" src="'+baseUrl+'lib/jade.js" />'
    html += '<script type="text/javascript" src="'+baseUrl+'lib/mustache.js" />'
    $('head').append(html)
  }

  // extract styleguide comments from stylesheet
  sg.init = function(s){
    load_assets()
    $.when($.get(s)).done(function(response) {

      var expression = /\/\*\!\!([\s\S]*?)\*\//mg
      while ((match = expression.exec(response)) != null){
        if(match[1].substring(0,1) == '!'){
          match[1] = match[1].substring(1)
        }
        match = jsyaml.load(scrub_comments(match[1]))
        if(match.description) match.description = markdown.toHTML(match.description)
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
      sg.data.info.push({"logo": $('[data-guidedog-path]').attr('data-logo-path')});
      render()
    });
  }

  // pass json data to Mustache template
  var render = function(){
    $.get(baseUrl+'/lib/view.html', function(template) {
      $('body').html('').append(Mustache.render(template, sg.data))
      compileJade();
      $('pre code').each(function(i, e) {hljs.highlightBlock(e)})
      $('.guidedog').each(function(){ $(this).css('background', '#'+Math.floor(Math.random()*16777215).toString(16)); });
      updateNav();     
      scrollTo();
      $(document).on('scroll', function(){updateNav();});
      $(document).trigger('guidedogReady');
    });
  }

  // compile jade examples
  var compileJade = function(){
    $('.sg-jade').each(function(){
      var target = $(this)
      var code = target.find('code')
      var string = code.text();
      string = string.replace(/^\s+|\s+$/g,'')
      string = jade.compile(string)()
      target.before('<div />')
      target.prev().html(string)
      code.text(style_html(string))
    });
  }

  // update active nav item
  var updateNav = function(){
    var found = false;
    var windowScrollTop = $(window).scrollTop();
    var windowScrollBottom = $(window).height() + windowScrollTop;
    $('section.sg').each(function(){
      if(!found){
        var target = $(this).find('.sg-target');
        var targetScrollTop = target.offset().top;
        if(targetScrollTop >= windowScrollTop && targetScrollTop < windowScrollBottom){
          $('nav.sg a.active').removeClass('active');
          $('nav.sg a[href="#'+target.attr('name')+'"]').addClass('active');
          found = true;
        }
      }
    });
  }

  // scrollto nav items
  var scrollTo = function(){
    $('nav.sg').on('click', 'a', function(e){
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top - 30
      }, 1000);
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
$(document).ready(function(){
  var sg = new Styleguide()
  sg.init($('[data-guidedog-path]').attr('data-guidedog-path'));
});
