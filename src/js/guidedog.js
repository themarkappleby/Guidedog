var Styleguide = function() {

  var sg = this 
  var baseUrl = $('[data-guidedog-path]').attr('src').replace('guidedog.min.js', '')

  sg.data = {} 
  sg.data.sections = [] 
  sg.data.info = []

  // extract styleguide comments from stylesheet
  sg.init = function(s){
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
    $.get(baseUrl+'template.html', function(template) {
      $('body').html('').prepend(Mustache.render(template, sg.data))
      compileJade();
      $('.guidedog').each(function(){ $(this).css('background', '#'+Math.floor(Math.random()*16777215).toString(16)); });
      syntaxHighlight();
      updateNav();     
      scrollTo();
      initTabs();
      $(document).on('scroll', function(){updateNav();});
      $(document).trigger('guidedogReady');
    });
  }

  var syntaxHighlight = function(){
    Prism.highlightAll();
  }

  // compile jade examples
  var compileJade = function(){
    $('.sg-jade').each(function(){
      // define targets
      var target = $(this)
      var targetJade = target.find('.language-haskell')
      var targetHTML = target.find('.language-markup')
      var targetExample = target.find('.sg-example')

      // capture jade
      var stringJade = targetJade.text();
      stringJade = stringJade.replace(/^\s+|\s+$/g,'')

      // convert to html
      var stringHTML = jade.compile(stringJade)()

      // render html example
      targetExample.html(stringHTML)

      // render html code sample
      targetHTML.text(style_html(stringHTML))
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

  // init sg-tabs
  var initTabs = function(){
    $('body').on('click', '.sg-tabs-trigger li', function(){
      var target = $(this)
      var root = target.closest('.sg-tabs')
      var index = target.index();
      root.find('.sg-tabs-active').removeClass('sg-tabs-active')
      target.addClass('sg-tabs-active')
      root.find('.sg-tabs-content li:nth-child('+(index+1)+')').addClass('sg-tabs-active')
    });
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
