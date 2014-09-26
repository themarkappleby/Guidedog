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
        // work with !!! or !! (Less.js support)
        if(match[1].substring(0,1) == '!'){
          match[1] = match[1].substring(1)
        }
        match[1] = lorem(match[1]);

        console.log(match[1]);
        match = jsyaml.load(match[1])
        console.log(match);

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

    // expand lorem ipsum
    var lorem = function(str){
      var words = ['lorem','ipsum','dolor','sit','amet','consectetuer','adipiscing','elit','sed','diam','nonummy','nibh','euismod', 'tincidunt','ut','laoreet']
      var wordsCnt = words.length-1;
      var expression = /lorem[^\s]+/g
      return str.replace(expression, function(cnt, index){
        cnt = parseInt(cnt.replace('lorem', ''))
        var paragraph = ''
        for(var b=1; b<=cnt; b++){
          var sentence = ''
          var sentenceLength = rand(12,16);
          for(var i=0; i<=sentenceLength; i++){
            sentence += ' ' + words[rand(0, wordsCnt)]  
            if(i==0){
              sentence = sentence.substr(1)
              sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1)
            }
            else if(i==sentenceLength){
              sentence += '. '
              paragraph += sentence
            }
          }
        }
        return paragraph;
      });
    }

    // return a random int within a range
    var rand = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // pass json data to Mustache template
    var render = function(){
      gdDOM.html('').prepend(Guidedog.templates.guidedog(gd.data, {}));
      compileJade();
      $('.guidedog').each(function(){ $(this).css('background', '#'+Math.floor(Math.random()*16777215).toString(16)); });
      syntaxHighlight();
      updateNav();     
      scrollToClick();
      initTabs();
      $(document).on('scroll', function(){updateNav();});
      if (typeof callback == 'function') {
        callback.call(gdDOM);
      }
      if(window.location.hash){
        // bug causing this not to work properly in Chrome
        scrollTo(window.location.hash, 0);
      }
    }

    // syntax highlight markup
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
        if($(target)[0]){
          $('html,body').animate({
            scrollTop: $(target).offset().top - 30
          }, speed);
        }
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
  }
}(jQuery));
