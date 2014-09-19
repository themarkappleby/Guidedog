(function($){
  $.fn.guidedog = function(options, callback){
    // default options
    var settings = $.extend({
      cssPaths: ['/css/app.css'],
      logoPath: 'http://placehold.it/250x100'
    }, options);

    var gdDOM = this          // retains reference to 'this'
    var gd = {}               // stores info to be passed to handlebars template
    var combinedResponse = '' // store all of the raw content to be parsed
    var crawlTotal = settings.cssPaths.length - 1
    gd.data = {}
    gd.data.info = {} 
    gd.data.sections = []

    // root initializer
    var init = function(){
      fetch(0)
    }()

    // crawl through and combine all cssPaths' contents
    function fetch(crawlCnt){
      $.when($.get(settings.cssPaths[crawlCnt])).done(function(response) {
        combinedResponse += response
        if (crawlCnt === crawlTotal){
          parse()
        }
        else{
          fetch(crawlCnt + 1)
        }
      })
    }

    // parse all of the raw content
    var parse = function(){
      var expression = /\/\*\!\!([\s\S]*?)\*\//mg
      while ((match = expression.exec(combinedResponse)) != null){
        if(match[1].substring(0,1) == '!'){
          match[1] = match[1].substring(1)
        }
        match = jsyaml.load(scrub_comments(match[1]))
        if(match.description) match.description = markdown.toHTML(match.description)
        if (new_section(match.section)){
          var section = match.section
          if(!match.section) match.section = 'Undefined'
          gd.data.sections.push({
            "section": match.section, 
            "id": match.section.replace(/\s+/g, '').toLowerCase(), 
            "subSections": []
          })
        }
        var index = sectionIndex(match.section)
        gd.data.sections[index].subSections.push(match)
      }
      gd.data.info.logo = settings.logoPath;
      render()
    }

    // pass json data to Mustache template
    var render = function(){
      gdDOM.html('').prepend(Guidedog.templates.guidedog(gd.data, {}));
      compileJade();
      $('.guidedog').each(function(){ $(this).css('background', '#'+Math.floor(Math.random()*16777215).toString(16)); });
      syntaxHighlight();
      updateNav();     
      scrollToClick();
      scrollTo(window.location.hash, 0);
      initTabs();
      $(document).on('scroll', function(){updateNav();});
      if (typeof callback == 'function') {
        callback.call(gdDOM);
      }
    }

    // syntax highlight markup
    var syntaxHighlight = function(){
      Prism.highlightAll();
      var client = new ZeroClipboard( document.getElementById("copy-button") );
      client.on( "ready", function( readyEvent ) {
        client.on( "aftercopy", function( event ) {
          event.target.style.display = "none";
          alert("Copied text to clipboard: " + event.data["text/plain"] );
        });
      });
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
        var stringHTML = jade.compile(stringJade, {
          pretty: true
        })()

        // render html example
        targetExample.html(stringHTML)

        // render html code sample
        targetHTML.text(stringHTML)
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

    // scrollToClick nav items
    var scrollToClick = function(){
      $('nav.sg').on('click', 'a', function(e){
        e.preventDefault();
        window.history.pushState('', '', $(this).attr('href'));
        scrollTo($(this).attr('href'), 1000);
      });
    }

    // scrollTo nav items
    var scrollTo = function(target, speed){
        $('html, body').animate({
          scrollTop: $(target).offset().top - 30
        }, speed);
    }

    // fetch the index of a section
    var sectionIndex = function(match){
      for (var i=0; i<gd.data.sections.length; i++){
        if(gd.data.sections[i].section === match){
          return i
        }
      }
      return 0
    }

    // determine if a section already exists
    var new_section = function(section){
      for (key in gd.data.sections){
        if(section === gd.data.sections[key].section){
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
}(jQuery));
