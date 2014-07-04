Guidedog
========

Create platform agnostic living styleguides with ease

##What is this thing?

Front-end frameworks like [Bootstrap](http://getbootstrap.com/) and [Foundation](http://foundation.zurb.com/) are awesome. The most awesome feature of these frameworks is not their plethora of shiny components but instead their thorough documentation. Having extensive front-end documentation helps prevent developers from writing redundant code, makes it easier to on-board new developers to a project, and ensures better communication between front-end and back-end devs.

As awesome as front-end frameworks are, sometimes you just want to roll your own and that's where Guidedog comes in. Guidedog is a back-end agnostic javascript plugin that will parse your stylesheets for comments and automatically create beautiful documentation.

##Getting Started

The recommended way to install Guidedog is via [Bower](http://bower.io/) but Guidedog can also be installed without Bower as well if you prefer (see below). The advantage of installing Guidedog with Bower is the ability to easily be able to pull future Guidedog updates into your project. Plus, Bower is just pretty swell in general.

###Installing Guidedog with Bower

1. Fetch the plugin via bower `bower install guidedog`. Note - by default Bower installs components in a folder named bower_components in your project's root. If you'd like to change the default installation location see the [bowerrc documentation](http://bower.io/docs/config/). Ensure that bower installs Guidedog in a location that is publicly accessible.
1. Create a new blank page/view and add `<script data-guidedog-path='assets/application.css' src='bower_components/guidedog/guidedog.js' type='text/javascript'></script>` replacing `data-guidedog-path` with the path to your concatenated and minified stylesheet.
1. Visit the new page you just created (if you've already added any Guidedog comments to your stylesheets you should see them here).

###Insalling without Bower
1. Download and move the Guidedog folder to a publicly accessible location.
1. Create a new blank page/view and add `<script data-guidedog-path='assets/application.css' src='your_path_to_guidedog/guidedog.js' type='text/javascript'></script>` replacing `data-guidedog-path` with the path to your concatenated and minified stylesheet.
1. Visit the new page you just created (if you've already added any Guidedog comments to your stylesheets you should see them here).

##Working with Guidedog
