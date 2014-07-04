Guidedog
==========

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

###Installing Guidedog without Bower

1. Download and move the Guidedog folder to a publicly accessible location.
1. Create a new blank page/view and add `<script data-guidedog-path='assets/application.css' src='your_path_to_guidedog/guidedog.js' type='text/javascript'></script>` replacing `data-guidedog-path` with the path to your concatenated and minified stylesheet.
1. Visit the new page you just created (if you've already added any Guidedog comments to your stylesheets you should see them here).

##Working with Guidedog

Guidedog works by parsing your CSS file for a specific comment structure. Guidedog first looks for comment blocks wrapped with `/*!!!` and `*/` marks. It then parses the text in these comment blocks as YAML[http://www.yaml.org/]. Guidedog even works when CSS is minified because comments wrapped with `/*!` and `*/` are flagged as important and therefore retained.

Guidedog currently features the following comment types:

| Name        | Required | Function                                                                                     |
| ----------- | -------- | -------------------------------------------------------------------------------------------- |
| title       | optional | The name of the specific element (ex. Primary Button)                                        |
| section     | required | The larger section the element belongs to (ex. Buttons)                                      |
| description | optional | A [Markdown](http://daringfireball.net/projects/markdown/) parsed description of the element |
| example     | optional | An HTML example of the element in use                                                        |
| swatches    | optional | An array of colors and their associated variable names                                       |

####Example Guidedog comment block
```
/*!!!
 * title: Primary Button
 * section: Buttons
 * description: Primary basic button element (can be an anchor element, button element, or input element)
 * example: <a href="#" class="primary button">Button</a>
 */
```

####Example Guidedog swatches comment block
```
/*!!!
 * section: Colours
 * swatches: [{name: primary, value: "#fef3ea"}, {name: secondary, value: "#6c6da3"}]
 */
```
