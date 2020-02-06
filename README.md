Guidedog
==========

Create platform agnostic living styleguides with ease

## What is this thing?

Front-end frameworks like [Bootstrap](http://getbootstrap.com/) and [Foundation](http://foundation.zurb.com/) are awesome. The most awesome feature of these frameworks is not their plethora of shiny components but instead their thorough documentation. Having extensive front-end documentation helps prevent developers from writing redundant code, makes it easier to on-board new developers to a project, and ensures better communication between front-end and back-end devs.

As awesome as front-end frameworks are, sometimes you just want to roll your own and that's where Guidedog comes in. Guidedog is a back-end agnostic javascript plugin that will parse your stylesheets for comments and automatically create beautiful documentation.

## Getting Started

The recommended way to install Guidedog is via [Bower](http://bower.io/) but Guidedog can also be installed without Bower as well if you prefer (see below). The advantage of installing Guidedog with Bower is the ability to easily be able to pull future Guidedog updates into your project. Plus, Bower is just pretty swell in general.

### Installing Guidedog

1. Run `bower install guidedog --save` (recommended) OR clone the Guidedog repo and add it to your project.
1. Add a new page to your project where Guidedog will live. On that page:
1. Load your project's CSS file(s)
1. Load jQuery (Guidedog is a jQuery plugin)
1. Load guidedog.min.js and guidedog.css
1. Initialize Guidedog. Note your project's javascript file(s) needs to be loaded in Guidedog's callback function to avoid timing conflicts (see below)
1. Visit the page you just created (if you've already added any Guidedog comments to your stylesheet you should see them here). 

```
$(document).ready(function(){
  $('body').guidedog({
    cssPaths: ['/css/app.css'],
    logoPath: '/img/logo.png'
  }, function(){
    $('head').append('<script type="text/javascript" src="/js/app.min.js" />')
  });
});
```

| Options  | Required | Description                                                                                                   |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| cssPaths | required | An array of string paths to the files you'd like Guidedog to parse. At least one valid path must be provided. |
| logoPath | optional | A string path to a logo asset. This logo will replace the default Guidedog logo.                              |

## Working with Guidedog

Guidedog works by parsing your CSS file for a specific comment structure. Guidedog first looks for comment blocks wrapped with `/*!!!` and `*/` marks. It then parses the text in these comment blocks as [YAML](http://www.yaml.org/). Guidedog even works when CSS is minified because comments wrapped with `/*!` and `*/` are flagged as important and therefore retained.

Guidedog currently features the following comment types:

| Name        | Required | Function                                                                                     |
| ----------- | -------- | -------------------------------------------------------------------------------------------- |
| section     | required | The larger section the element belongs to (ex. Buttons)                                      |
| title       | optional | The name of the specific element (ex. Primary Button)                                        |
| description | optional | A [Markdown](http://daringfireball.net/projects/markdown/) parsed description of the element |
| html        | optional | An HTML example of the element in use                                                        |
| jade        | optional | A Jade example of the element in use (will render as both Jade and HTML in Guidedog)         |
| swatches    | optional | An array of colors and their associated variable names                                       |

#### Example Guidedog comment block
```
/*!!!
title: Primary Button
section: Buttons
description: Primary basic button element (can be an anchor element, button element, or input element)
html: <a href="#" class="primary button">Button</a>
*/
```

#### Example Guidedog swatches comment block
```
/*!!!
section: Colours
swatches: [{name: primary, value: "#fef3ea"}, {name: secondary, value: "#6c6da3"}]
*/
```

#### Expanding Lorem Ipsum

Guidedog has a handy lorem ipsum expanding feature for quickly including blocks of lorem ipsum text in your examples. To include a sentence of lorem ipsum, simply use the key word format `loremX`. Guidedog will look for all instances of `loremX` and replace each with lorem ipsum text. `X` represents the number of sentences of lorem ipsum you want to insert. For example, for two senteces of lorem ipsum you would type `lorem2`.

## Building Guidedog Yourself

If you should want to tinker with Guidedog itself, you're more than welcome to. Please note, these steps are NOT required if you'd simply like to use Guidedog in your project. These steps are only necessary if you'd like to modify the Guidedog core in some capacity.

1. Pull down the Guidedog repo to your local machine
1. Run `npm install` to install all required Node packages (`sudo` may be required depending on your setup)
1. Run `bower install` to install all required Bower components
1. Run `gulp` to start the local webserver
1. Visit `http://guidedog.dev` in your browser

## Roadmap

- [DONE] ~~swap Mustache for Handlebars~~
- [DONE] ~~precompile Handlebars template~~
- [DONE] ~~rename "example" to "html"~~
- [DONE] ~~turn Guidedog into a jQuery plugin~~
- [DONE] ~~pass an array of stylesheets to the Guidedog initializer~~
- [DONE] ~~hash support and go to hash on load~~ 
- [DONE] ~~expand lorem ipsum~~
- clean-up and compartmentalize js
- add CSS/Stylus code display support
- add Less.js, Sass, Scss, and plain CSS examples
- add support for custom colour schemes (pass primary/secondary colours to initializer)
- re-write Guidedog stylesheet (use .gd- instead of .sg- prefixes)
- implement system to support object modifiers (w/ select dropdown)
- create Guidedog Gulp task for non-client side compilation
