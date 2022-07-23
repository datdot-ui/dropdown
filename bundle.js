(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const bel = require('bel')
const csjs = require('csjs-inject')
const dropdown = require('..')
const protocol_maker = require('protocol-maker')
const make_grid = require('../src/node_modules/make-grid')

var id = 0

function demo () {
// ------------------------------
	const contacts = protocol_maker('demo', listen) 
	function listen (msg) {
		// console.log('New message', { msg })
		const { head, refs, type, data, meta } = msg // receive msg
		const [from] = head
		// send back ack
		// const { notify: from_notify, address: from_address, make: from_make } = contacts.by_address[from]
		// from_notify(from_make({ to: from_address, type: 'ack', refs: { 'cause': head } }))
		// handle
		if (type === 'click') handle_selected(from, data)
	}
	// ------------------------------

	const opts_1 = {
		name: 'dropdown1',
		button_opts: {
			text: 'Filter',
			// mode: 'selector',
			icons: [
				{name: 'filter'},
			],
		},
		list_opts: {
			body: [
				{
					text: 'Option1',
					icons: [{ name: 'star' }],
					status: { selected: true }
				},
				{
					text: 'Option2',
					icons: [{ name: 'star' }],
				},
				{
					text: 'Option3',
					icons: [{ name: 'star'}],
					status: { selected: true }
				}
			],
		},
		theme: `
			i-list {
				bottom: 55px;
				top: unset;
			}
			@keyframes down {
				0% {
					opacity: 0;
					bottom: 0;
				}
				50% {
					opacity: 0.5;
					bottom: 20px;
				}
				100%: {
					opacity: 1;
					bottom: 40px;
				}
			}
			@keyframes up {
					0% {
						opacity: 1;
						bottom: 40px;
					}
					50% {
						bottom: 20px;
					}
					75% {
						opacity: 0.5;
					}
					100%: {
						opacity: 0;
						bottom: 0;
					}
			} 
		`
	}

	const opts_2 = {
		name: 'dropdown2',
		// status: { expanded: true },
		button_opts: {
			text: 'Filter',
			// mode: 'selector',
			icons: [
				{name: 'filter'},
			],
		},
		list_opts: {
			body: [
				{
					text: 'Option1',
					icons: [{ name: 'star' }],
					status: { selected: true }
				},
				{
					text: 'Option2',
					icons: [{ name: 'star' }],
				},
				{
					text: 'Option3',
					icons: [{ name: 'star'}],
					status: { selected: true }
				}
			],
		}
	}
	
	const dropdown_1 = dropdown(opts_1, contacts.add(opts_1.name))
	const dropdown_2 = dropdown(opts_2, contacts.add(opts_2.name))
	
	const container = bel` 
	<div class="${css.content}">
		<h1>Dropdown</h1>
		<aside class="${css.example}"><h2>Example Up</h2>${dropdown_1}</aside>
		<aside class="${css.example}"><h2>Example Down</h2>${dropdown_2}</aside>
	</div>`

	return container

    // handlers

    function handle_selected (from, data) {
        const $from = contacts.by_address[from]
        if ($from.name === 'dropdown1') {
            if (data === 'button-0') console.log(' Dropdown 1, Option 1 selected')
            else if (data === 'button-1') console.log(' Dropdown 1, Option 2 selected')
            else if (data === 'button-2') console.log(' Dropdown 1, Option 3 selected')
        }
        if ($from.name === 'dropdown2') {
            if (data === 'button-3') console.log(' Dropdown 2, Option 1 selected')
            else if (data === 'button-4') console.log(' Dropdown 2, Option 2 selected')
            else if (data === 'button-5') console.log(' Dropdown 2, Option 3 selected')
        }
    }
}

const css = csjs`
:root {
    /* define colors ---------------------------------------------*/
    --b: 0, 0%;
    --r: 100%, 50%;
    --color-white: var(--b), 100%;
    --color-black: var(--b), 0%;
    --color-dark: 223, 13%, 20%;
    --color-deep-black: 222, 18%, 11%;
    --color-red: 358, 99%, 53%;
    --color-amaranth-pink: 329, 100%, 65%;
    --color-persian-rose: 323, 100%, 50%;
    --color-orange: 32, var(--r);
    --color-light-orange: 36, 100%, 55%;
    --color-safety-orange: 27, 100%, 50%;
    --color-deep-saffron: 31, 100%, 56%;
    --color-ultra-red: 348, 96%, 71%;
    --color-flame: 15, 80%, 50%;
    --color-verdigris: 180, 54%, 43%;
    --color-viridian-green: 180, 100%, 63%;
    --color-blue: 214, 100%, 49%;
    --color-heavy-blue: 233, var(--r);
    --color-maya-blue: 205, 96%, 72%;
    --color-slate-blue: 248, 56%, 59%;
    --color-blue-jeans: 204, 96%, 61%;
    --color-dodger-blue: 213, 90%, 59%;
    --color-light-green: 97, 86%, 77%;
    --color-lime-green: 127, 100%, 40%;
    --color-slimy-green: 108, 100%, 28%;
    --color-maximum-blue-green: 180, 54%, 51%;
    --color-deep-green: 136, 79%, 22%;
    --color-green: 136, 82%, 38%;
    --color-lincoln-green: 97, 100%, 18%;
    --color-yellow: 44, 100%, 55%;
    --color-chrome-yellow: 39, var(--r);
    --color-bright-yellow-crayola: 35, 100%, 58%;
    --color-green-yellow-crayola: 51, 100%, 83%;
    --color-purple: 283, var(--r);
    --color-heliotrope: 288, 100%, 73%;
    --color-medium-purple: 269, 100%, 70%;
    --color-electric-violet: 276, 98%, 48%;
    --color-grey33: var(--b), 20%;
    --color-grey66: var(--b), 40%;
    --color-grey70: var(--b), 44%;
    --color-grey88: var(--b), 53%;
    --color-greyA2: var(--b), 64%;
    --color-greyC3: var(--b), 76%;
    --color-greyCB: var(--b), 80%;
    --color-greyD8: var(--b), 85%;
    --color-greyD9: var(--b), 85%;
    --color-greyE2: var(--b), 89%;
    --color-greyEB: var(--b), 92%;
    --color-greyED: var(--b), 93%;
    --color-greyEF: var(--b), 94%;
    --color-greyF2: var(--b), 95%;
    --transparent: transparent;
    /* define font ---------------------------------------------*/
    --snippet-font: Segoe UI Mono, Monospace, Cascadia Mono, Courier New, ui-monospace, Liberation Mono, Menlo, Monaco, Consolas;
    --size12: 1.2rem;
    --size13: 1.3rem;
    --size14: 1.4rem;
    --size15: 1.5rem;
    --size16: 1.6rem;
    --size18: 1.8rem;
    --size20: 2rem;
    --size22: 2.2rem;
    --size24: 2.4rem;
    --size26: 2.6rem;
    --size28: 2.8rem;
    --size30: 3rem;
    --size32: 3.2rem;
    --size34: 3.4rem;
    --size36: 3.6rem;
    --size38: 3.8rem;
    --size40: 4rem;
    --size42: 4.2rem;
    --size44: 4.4rem;
    --size46: 4.6rem;
    --size48: 4.8rem;
    --size50: 5rem;
    --size52: 5.2rem;
    --size54: 5.4rem;
    --size56: 5.6rem;
    --size58: 5.8rem;
    --size60: 6rem;
    --weight100: 100;
    --weight300: 300;
    --weight400: 400;
    --weight600: 600;
    --weight800: 800;
    /* define primary ---------------------------------------------*/
    --primary-body-bg-color: var(--color-greyF2);
    --primary-font: Arial, sens-serif;
    --primary-size: var(--size14);
    --primary-size-hover: var(--primary-size);
    --primary-weight: 300;
    --primary-weight-hover: 300;
    --primary-color: var(--color-black);
    --primary-color-hover: var(--color-white);
    --primary-color-focus: var(--color-orange);
    --primary-bg-color: var(--color-white);
    --primary-bg-color-hover: var(--color-black);
    --primary-bg-color-focus: var(--color-greyA2), 1;
    --primary-border-width: 1px;
    --primary-border-style: solid;
    --primary-border-color: var(--color-black);
    --primary-border-opacity: 1;
    --primary-radius: 8px;
    --primary-avatar-width: 100%;
    --primary-avatar-height: auto;
    --primary-avatar-radius: 0;
    --primary-disabled-size: var(--primary-size);
    --primary-disabled-color: var(--color-greyA2);
    --primary-disabled-bg-color: var(--color-greyEB);
    --primary-disabled-icon-size: var(--primary-icon-size);
    --primary-disabled-icon-fill: var(--color-greyA2);
    --primary-listbox-option-icon-size: 20px;
    --primary-listbox-option-avatar-width: 40px;
    --primary-listbox-option-avatar-height: auto;
    --primary-listbox-option-avatar-radius: var(--primary-avatar-radius);
    --primary-option-avatar-width: 30px;
    --primary-option-avatar-height: auto;
    --primary-list-avatar-width: 30px;
    --primary-list-avatar-height: auto;
    --primary-list-avatar-radius: var(--primary-avatar-radius);
    /* define icon settings ---------------------------------------------*/
    --primary-icon-size: var(--size16);
    --primary-icon-size-hover: var(--size16);
    --primary-icon-fill: var(--primary-color);
    --primary-icon-fill-hover: var(--primary-color-hover);
    /* define current ---------------------------------------------*/
    --current-size: var(--primary-size);
    --current-weight: var(--primary-weight);
    --current-color: var(--color-white);
    --current-bg-color: var(--color-black);
    --current-icon-size: var(--primary-icon-size);
    --current-icon-fill: var(--color-white);
    --current-list-selected-icon-size: var(--list-selected-icon-size);
    --current-list-selected-icon-fill: var(--color-white);
    --current-list-selected-icon-fill-hover: var(--color-white);
    --current-list-size: var(--current-size);
    --current-list-color: var(--current-color);
    --current-list-bg-color: var(--current-bg-color);
    --current-list-avatar-width: var(--primary-list-avatar-width);
    --current-list-avatar-height: var(--primary-list-avatar-height);
    /* role listbox settings ---------------------------------------------*/
    /*-- collapsed --*/
    --listbox-collapsed-bg-color: var(--primary-bg-color);
    --listbox-collapsed-bg-color-hover: var(--primary-bg-color-hover);
    --listbox-collapsed-icon-size: var(--size14);
    --listbox-collapsed-icon-size-hover: var(--size14);
    --listbox-collapsed-icon-fill: var(--primary-icon-fill);
    --listbox-collapsed-icon-fill-hover: var(--primary-icon-fill-hover);
    --listbox-collapsed-listbox-size: 12px;
    --listbox-collapsed-listbox-size-hover: 12px;
    --listbox-collapsed-listbox-weight: var(--primary-weight);
    --listbox-collapsed-listbox-weight-hover: var(--primary-weight);
    --listbox-collapsed-listbox-color: var(--primary-color);
    --listbox-collapsed-listbox-color-hover: var(--primary-color-hover);
    --listbox-collapsed-listbox-avatar-width: var(--primary-listbox-option-avatar-width);
    --listbox-collapsed-listbox-avatar-height: var(--primary-listbox-option-avatar-height);
    --listbox-collapsed-listbox-icon-size: var(--primary-listbox-option-icon-size);
    --listbox-collapsed-listbox-icon-size-hover: var(--primary-listbox-option-icon-size);
    --listbox-collapsed-listbox-icon-fill: var(--color-blue);
    --listbox-collapsed-listbox-icon-fill-hover: var(--color-yellow);
    /*-- expanded ---*/
    --listbox-expanded-bg-color: var(--current-bg-color);
    --listbox-expanded-icon-size: var(--size20);
    --listbox-expanded-icon-fill: var(--color-light-green);
    --listbox-expanded-listbox-size: var(--size20);
    --listbox-expanded-listbox-weight: var(--primary-weight);
    --listbox-expanded-listbox-color: var(--current-color);
    --listbox-expanded-listbox-avatar-width: var(--primary-listbox-option-avatar-width);
    --listbox-expanded-listbox-avatar-height: var(--primary-listbox-option-avatar-height);
    --listbox-expanded-listbox-icon-size: var(--primary-listbox-option-icon-size);
    --listbox-expanded-listbox-icon-fill: var(--color-light-green);
    /* role option settings ---------------------------------------------*/
    --list-bg-color: var(--primary-bg-color);
    --list-bg-color-hover: var(--primary-bg-color-hover);
    --list-selected-icon-size: var(--size16);
    --list-selected-icon-size-hover: var(--list-selected-icon-size);
    --list-selected-icon-fill: var(--primary-icon-fill);
    --list-selected-icon-fill-hover: var(--primary-icon-fill-hover);
    /* role link settings ---------------------------------------------*/
    --link-size: var(--size14);
    --link-size-hover: var(--primary-link-size);
    --link-color: var(--color-heavy-blue);
    --link-color-hover: var(--color-dodger-blue);
    --link-bg-color: transparent;
    --link-icon-size: var(--size30);
    --link-icon-fill: var(--primary-link-color);
    --link-icon-fill-hover: var(--primary-link-color-hover);
    --link-avatar-width: 24px;
    --link-avatar-width-hover: var(--link-avatar-width);
    --link-avatar-height: auto;
    --link-avatar-height-hover: var(--link-avatar-height);
    --link-avatar-radius: 0;
    --link-disabled-size: var(--primary-link-size);
    --link-disabled-color: var(--color-greyA2);
    --link-disabled-bg-color: transparent;
    --link-disabled-icon-fill: var(--color-greyA2);
    /* role menuitem settings ---------------------------------------------*/
    --menu-size: var(--size15);
    --menu-size-hover: var(--menu-size);
    --menu-weight: var(--primary-weight);
    --menu-weigh-hover: var(--primary-weight);
    --menu-color: var(--primary-color);
    --menu-color-hover: var(--color-grey88);
    --menu-icon-size: 20px;
    --menu-icon-size-hover: var(--menu-icon-size);
    --menu-icon-fill: var(--primary-color);
    --menu-icon-fill-hover: var(--color-grey88);
    --menu-avatar-width: 50px;
    --menu-avatar-width-hover: var(--menu-avatar-width);
    --menu-avatar-height: auto;
    --menu-avatar-height-hover: var(--menu-avatar-height);
    --menu-avatar-radius: 0;
    --menu-disabled-color: var(--primary-disabled-color);
    --menu-disabled-size: var(--menu-size);
    --menu-disabled-weight: var(--primary-weight);
}
html {
    font-size: 62.5%;
    height: 100%;
}
*, *:before, *:after {
    box-sizing: border-box;
}
body {
    margin: 0;
    padding: 0;
    font-size: calc(var(--primary-size) + 2px);
    -webkit-text-size-adjust:100%;
    font-family: var(--primary-font);
    background-color: hsl( var(--primary-body-bg-color) );
    height: 100%;
    overflow: hidden;
}
.container {
    grid-area: container;
    overflow: hidden scroll;
    height: 100%;
}
.content {
    padding: 2% 5%;
}
.text, .icon {
    display: flex;
}
.text i-button {
    margin-right: 10px;
}
.icon i-button {
    margin-right: 10px;
}
.container {
    grid-area: container;
    background-color: var(--color-white);
    height: 100%;
    overflow: hidden scroll;
}
`

document.body.append(demo())
},{"..":33,"../src/node_modules/make-grid":34,"bel":3,"csjs-inject":6,"protocol-maker":29}],2:[function(require,module,exports){
var trailingNewlineRegex = /\n[\s]+$/
var leadingNewlineRegex = /^\n[\s]+/
var trailingSpaceRegex = /[\s]+$/
var leadingSpaceRegex = /^[\s]+/
var multiSpaceRegex = /[\n\s]+/g

var TEXT_TAGS = [
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'data', 'dfn', 'em', 'i',
  'kbd', 'mark', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'amp', 'small', 'span',
  'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr'
]

var VERBATIM_TAGS = [
  'code', 'pre', 'textarea'
]

module.exports = function appendChild (el, childs) {
  if (!Array.isArray(childs)) return

  var nodeName = el.nodeName.toLowerCase()

  var hadText = false
  var value, leader

  for (var i = 0, len = childs.length; i < len; i++) {
    var node = childs[i]
    if (Array.isArray(node)) {
      appendChild(el, node)
      continue
    }

    if (typeof node === 'number' ||
      typeof node === 'boolean' ||
      typeof node === 'function' ||
      node instanceof Date ||
      node instanceof RegExp) {
      node = node.toString()
    }

    var lastChild = el.childNodes[el.childNodes.length - 1]

    // Iterate over text nodes
    if (typeof node === 'string') {
      hadText = true

      // If we already had text, append to the existing text
      if (lastChild && lastChild.nodeName === '#text') {
        lastChild.nodeValue += node

      // We didn't have a text node yet, create one
      } else {
        node = document.createTextNode(node)
        el.appendChild(node)
        lastChild = node
      }

      // If this is the last of the child nodes, make sure we close it out
      // right
      if (i === len - 1) {
        hadText = false
        // Trim the child text nodes if the current node isn't a
        // node where whitespace matters.
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          // The very first node in the list should not have leading
          // whitespace. Sibling text nodes should have whitespace if there
          // was any.
          leader = i === 0 ? '' : ' '
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, leader)
            .replace(leadingSpaceRegex, ' ')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

    // Iterate over DOM nodes
    } else if (node && node.nodeType) {
      // If the last node was a text node, make sure it is properly closed out
      if (hadText) {
        hadText = false

        // Trim the child text nodes if the current node isn't a
        // text node or a code node
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')

          // Remove empty text nodes, append otherwise
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        // Trim the child nodes if the current node is not a node
        // where all whitespace must be preserved
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingSpaceRegex, ' ')
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

      // Store the last nodename
      var _nodeName = node.nodeName
      if (_nodeName) nodeName = _nodeName.toLowerCase()

      // Append the node to the DOM
      el.appendChild(node)
    }
  }
}

},{}],3:[function(require,module,exports){
var hyperx = require('hyperx')
var appendChild = require('./appendChild')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var BOOL_PROPS = [
  'autofocus', 'checked', 'defaultchecked', 'disabled', 'formnovalidate',
  'indeterminate', 'readonly', 'required', 'selected', 'willvalidate'
]

var COMMENT_TAG = '!--'

var SVG_TAGS = [
  'svg', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
  'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood',
  'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage',
  'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
  'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter',
  'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src',
  'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image',
  'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph',
  'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

function belCreateElement (tag, props, children) {
  var el

  // If an svg tag, it needs a namespace
  if (SVG_TAGS.indexOf(tag) !== -1) {
    props.namespace = SVGNS
  }

  // If we are using a namespace
  var ns = false
  if (props.namespace) {
    ns = props.namespace
    delete props.namespace
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  } else {
    el = document.createElement(tag)
  }

  // Create the properties
  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      var key = p.toLowerCase()
      var val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // The for attribute gets transformed to htmlFor, but we just set as for
      if (p === 'htmlFor') {
        p = 'for'
      }
      // If a property is boolean, set itself to the key
      if (BOOL_PROPS.indexOf(key) !== -1) {
        if (val === 'true') val = key
        else if (val === 'false') continue
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on') {
        el[p] = val
      } else {
        if (ns) {
          if (p === 'xlink:href') {
            el.setAttributeNS(XLINKNS, p, val)
          } else if (/^xmlns($|:)/i.test(p)) {
            // skip xmlns definitions
          } else {
            el.setAttributeNS(null, p, val)
          }
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  appendChild(el, children)
  return el
}

module.exports = hyperx(belCreateElement, {comments: true})
module.exports.default = module.exports
module.exports.createElement = belCreateElement

},{"./appendChild":2,"hyperx":31}],4:[function(require,module,exports){
(function (global){(function (){
'use strict';

var csjs = require('csjs');
var insertCss = require('insert-css');

function csjsInserter() {
  var args = Array.prototype.slice.call(arguments);
  var result = csjs.apply(null, args);
  if (global.document) {
    insertCss(csjs.getCss(result));
  }
  return result;
}

module.exports = csjsInserter;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"csjs":9,"insert-css":32}],5:[function(require,module,exports){
'use strict';

module.exports = require('csjs/get-css');

},{"csjs/get-css":8}],6:[function(require,module,exports){
'use strict';

var csjs = require('./csjs');

module.exports = csjs;
module.exports.csjs = csjs;
module.exports.getCss = require('./get-css');

},{"./csjs":4,"./get-css":5}],7:[function(require,module,exports){
'use strict';

module.exports = require('./lib/csjs');

},{"./lib/csjs":13}],8:[function(require,module,exports){
'use strict';

module.exports = require('./lib/get-css');

},{"./lib/get-css":17}],9:[function(require,module,exports){
'use strict';

var csjs = require('./csjs');

module.exports = csjs();
module.exports.csjs = csjs;
module.exports.noScope = csjs({ noscope: true });
module.exports.getCss = require('./get-css');

},{"./csjs":7,"./get-css":8}],10:[function(require,module,exports){
'use strict';

/**
 * base62 encode implementation based on base62 module:
 * https://github.com/andrew/base62.js
 */

var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

module.exports = function encode(integer) {
  if (integer === 0) {
    return '0';
  }
  var str = '';
  while (integer > 0) {
    str = CHARS[integer % 62] + str;
    integer = Math.floor(integer / 62);
  }
  return str;
};

},{}],11:[function(require,module,exports){
'use strict';

var makeComposition = require('./composition').makeComposition;

module.exports = function createExports(classes, keyframes, compositions) {
  var keyframesObj = Object.keys(keyframes).reduce(function(acc, key) {
    var val = keyframes[key];
    acc[val] = makeComposition([key], [val], true);
    return acc;
  }, {});

  var exports = Object.keys(classes).reduce(function(acc, key) {
    var val = classes[key];
    var composition = compositions[key];
    var extended = composition ? getClassChain(composition) : [];
    var allClasses = [key].concat(extended);
    var unscoped = allClasses.map(function(name) {
      return classes[name] ? classes[name] : name;
    });
    acc[val] = makeComposition(allClasses, unscoped);
    return acc;
  }, keyframesObj);

  return exports;
}

function getClassChain(obj) {
  var visited = {}, acc = [];

  function traverse(obj) {
    return Object.keys(obj).forEach(function(key) {
      if (!visited[key]) {
        visited[key] = true;
        acc.push(key);
        traverse(obj[key]);
      }
    });
  }

  traverse(obj);
  return acc;
}

},{"./composition":12}],12:[function(require,module,exports){
'use strict';

module.exports = {
  makeComposition: makeComposition,
  isComposition: isComposition,
  ignoreComposition: ignoreComposition
};

/**
 * Returns an immutable composition object containing the given class names
 * @param  {array} classNames - The input array of class names
 * @return {Composition}      - An immutable object that holds multiple
 *                              representations of the class composition
 */
function makeComposition(classNames, unscoped, isAnimation) {
  var classString = classNames.join(' ');
  return Object.create(Composition.prototype, {
    classNames: { // the original array of class names
      value: Object.freeze(classNames),
      configurable: false,
      writable: false,
      enumerable: true
    },
    unscoped: { // the original array of class names
      value: Object.freeze(unscoped),
      configurable: false,
      writable: false,
      enumerable: true
    },
    className: { // space-separated class string for use in HTML
      value: classString,
      configurable: false,
      writable: false,
      enumerable: true
    },
    selector: { // comma-separated, period-prefixed string for use in CSS
      value: classNames.map(function(name) {
        return isAnimation ? name : '.' + name;
      }).join(', '),
      configurable: false,
      writable: false,
      enumerable: true
    },
    toString: { // toString() method, returns class string for use in HTML
      value: function() {
        return classString;
      },
      configurable: false,
      writeable: false,
      enumerable: false
    }
  });
}

/**
 * Returns whether the input value is a Composition
 * @param value      - value to check
 * @return {boolean} - whether value is a Composition or not
 */
function isComposition(value) {
  return value instanceof Composition;
}

function ignoreComposition(values) {
  return values.reduce(function(acc, val) {
    if (isComposition(val)) {
      val.classNames.forEach(function(name, i) {
        acc[name] = val.unscoped[i];
      });
    }
    return acc;
  }, {});
}

/**
 * Private constructor for use in `instanceof` checks
 */
function Composition() {}

},{}],13:[function(require,module,exports){
'use strict';

var extractExtends = require('./css-extract-extends');
var composition = require('./composition');
var isComposition = composition.isComposition;
var ignoreComposition = composition.ignoreComposition;
var buildExports = require('./build-exports');
var scopify = require('./scopeify');
var cssKey = require('./css-key');
var extractExports = require('./extract-exports');

module.exports = function csjsTemplate(opts) {
  opts = (typeof opts === 'undefined') ? {} : opts;
  var noscope = (typeof opts.noscope === 'undefined') ? false : opts.noscope;

  return function csjsHandler(strings, values) {
    // Fast path to prevent arguments deopt
    var values = Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; i++) {
      values[i - 1] = arguments[i];
    }
    var css = joiner(strings, values.map(selectorize));
    var ignores = ignoreComposition(values);

    var scope = noscope ? extractExports(css) : scopify(css, ignores);
    var extracted = extractExtends(scope.css);
    var localClasses = without(scope.classes, ignores);
    var localKeyframes = without(scope.keyframes, ignores);
    var compositions = extracted.compositions;

    var exports = buildExports(localClasses, localKeyframes, compositions);

    return Object.defineProperty(exports, cssKey, {
      enumerable: false,
      configurable: false,
      writeable: false,
      value: extracted.css
    });
  }
}

/**
 * Replaces class compositions with comma seperated class selectors
 * @param  value - the potential class composition
 * @return       - the original value or the selectorized class composition
 */
function selectorize(value) {
  return isComposition(value) ? value.selector : value;
}

/**
 * Joins template string literals and values
 * @param  {array} strings - array of strings
 * @param  {array} values  - array of values
 * @return {string}        - strings and values joined
 */
function joiner(strings, values) {
  return strings.map(function(str, i) {
    return (i !== values.length) ? str + values[i] : str;
  }).join('');
}

/**
 * Returns first object without keys of second
 * @param  {object} obj      - source object
 * @param  {object} unwanted - object with unwanted keys
 * @return {object}          - first object without unwanted keys
 */
function without(obj, unwanted) {
  return Object.keys(obj).reduce(function(acc, key) {
    if (!unwanted[key]) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

},{"./build-exports":11,"./composition":12,"./css-extract-extends":14,"./css-key":15,"./extract-exports":16,"./scopeify":22}],14:[function(require,module,exports){
'use strict';

var makeComposition = require('./composition').makeComposition;

var regex = /\.([^\s]+)(\s+)(extends\s+)(\.[^{]+)/g;

module.exports = function extractExtends(css) {
  var found, matches = [];
  while (found = regex.exec(css)) {
    matches.unshift(found);
  }

  function extractCompositions(acc, match) {
    var extendee = getClassName(match[1]);
    var keyword = match[3];
    var extended = match[4];

    // remove from output css
    var index = match.index + match[1].length + match[2].length;
    var len = keyword.length + extended.length;
    acc.css = acc.css.slice(0, index) + " " + acc.css.slice(index + len + 1);

    var extendedClasses = splitter(extended);

    extendedClasses.forEach(function(className) {
      if (!acc.compositions[extendee]) {
        acc.compositions[extendee] = {};
      }
      if (!acc.compositions[className]) {
        acc.compositions[className] = {};
      }
      acc.compositions[extendee][className] = acc.compositions[className];
    });
    return acc;
  }

  return matches.reduce(extractCompositions, {
    css: css,
    compositions: {}
  });

};

function splitter(match) {
  return match.split(',').map(getClassName);
}

function getClassName(str) {
  var trimmed = str.trim();
  return trimmed[0] === '.' ? trimmed.substr(1) : trimmed;
}

},{"./composition":12}],15:[function(require,module,exports){
'use strict';

/**
 * CSS identifiers with whitespace are invalid
 * Hence this key will not cause a collision
 */

module.exports = ' css ';

},{}],16:[function(require,module,exports){
'use strict';

var regex = require('./regex');
var classRegex = regex.classRegex;
var keyframesRegex = regex.keyframesRegex;

module.exports = extractExports;

function extractExports(css) {
  return {
    css: css,
    keyframes: getExport(css, keyframesRegex),
    classes: getExport(css, classRegex)
  };
}

function getExport(css, regex) {
  var prop = {};
  var match;
  while((match = regex.exec(css)) !== null) {
    var name = match[2];
    prop[name] = name;
  }
  return prop;
}

},{"./regex":19}],17:[function(require,module,exports){
'use strict';

var cssKey = require('./css-key');

module.exports = function getCss(csjs) {
  return csjs[cssKey];
};

},{"./css-key":15}],18:[function(require,module,exports){
'use strict';

/**
 * djb2 string hash implementation based on string-hash module:
 * https://github.com/darkskyapp/string-hash
 */

module.exports = function hashStr(str) {
  var hash = 5381;
  var i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return hash >>> 0;
};

},{}],19:[function(require,module,exports){
'use strict';

var findClasses = /(\.)(?!\d)([^\s\.,{\[>+~#:)]*)(?![^{]*})/.source;
var findKeyframes = /(@\S*keyframes\s*)([^{\s]*)/.source;
var ignoreComments = /(?!(?:[^*/]|\*[^/]|\/[^*])*\*+\/)/.source;

var classRegex = new RegExp(findClasses + ignoreComments, 'g');
var keyframesRegex = new RegExp(findKeyframes + ignoreComments, 'g');

module.exports = {
  classRegex: classRegex,
  keyframesRegex: keyframesRegex,
  ignoreComments: ignoreComments,
};

},{}],20:[function(require,module,exports){
var ignoreComments = require('./regex').ignoreComments;

module.exports = replaceAnimations;

function replaceAnimations(result) {
  var animations = Object.keys(result.keyframes).reduce(function(acc, key) {
    acc[result.keyframes[key]] = key;
    return acc;
  }, {});
  var unscoped = Object.keys(animations);

  if (unscoped.length) {
    var regexStr = '((?:animation|animation-name)\\s*:[^};]*)('
      + unscoped.join('|') + ')([;\\s])' + ignoreComments;
    var regex = new RegExp(regexStr, 'g');

    var replaced = result.css.replace(regex, function(match, preamble, name, ending) {
      return preamble + animations[name] + ending;
    });

    return {
      css: replaced,
      keyframes: result.keyframes,
      classes: result.classes
    }
  }

  return result;
}

},{"./regex":19}],21:[function(require,module,exports){
'use strict';

var encode = require('./base62-encode');
var hash = require('./hash-string');

module.exports = function fileScoper(fileSrc) {
  var suffix = encode(hash(fileSrc));

  return function scopedName(name) {
    return name + '_' + suffix;
  }
};

},{"./base62-encode":10,"./hash-string":18}],22:[function(require,module,exports){
'use strict';

var fileScoper = require('./scoped-name');
var replaceAnimations = require('./replace-animations');
var regex = require('./regex');
var classRegex = regex.classRegex;
var keyframesRegex = regex.keyframesRegex;

module.exports = scopify;

function scopify(css, ignores) {
  var makeScopedName = fileScoper(css);
  var replacers = {
    classes: classRegex,
    keyframes: keyframesRegex
  };

  function scopeCss(result, key) {
    var replacer = replacers[key];
    function replaceFn(fullMatch, prefix, name) {
      var scopedName = ignores[name] ? name : makeScopedName(name);
      result[key][scopedName] = name;
      return prefix + scopedName;
    }
    return {
      css: result.css.replace(replacer, replaceFn),
      keyframes: result.keyframes,
      classes: result.classes
    };
  }

  var result = Object.keys(replacers).reduce(scopeCss, {
    css: css,
    keyframes: {},
    classes: {}
  });

  return replaceAnimations(result);
}

},{"./regex":19,"./replace-animations":20,"./scoped-name":21}],23:[function(require,module,exports){
const protocol_maker = require('protocol-maker')
const i_icon = require('datdot-ui-icon')

var id = 0
var icon_count = 0
const sheet = new CSSStyleSheet()
const default_opts = { 
	name: 'i-button',
	text: '',
	icons: [],
	status: {
		current: false, 
		disabled: false,
	},
	theme: get_theme()
}
sheet.replaceSync(default_opts.theme)

module.exports = button

button.help = () => { return { opts: default_opts } }

function button (opts, parent_wire) {
	const {
		name = default_opts.name, 
		text = default_opts.text, 
		icons = default_opts.icons, 
		status = default_opts.status, 
		theme = `` } = opts		
	
	const current_state =  { opts: { name, text,	icons, status, sheets: [default_opts.theme, theme] } }

	// protocol
	const initial_contacts = { 'parent': parent_wire }
	const contacts = protocol_maker('button', listen, initial_contacts)

	function listen (msg) {
			const { head, refs, type, data, meta } = msg // receive msg
			const [from, to, msg_id] = head
			if (type === 'help') {
				const $from = contacts.by_address[from]
				$from.notify($from.make({ to: $from.address, type: 'help', data: { state: get_current_state() }, refs: { cause: head }}))                         
			}
			if (type === 'update') handle_update(data)
	}

	// make button
	const el = document.createElement('i-button')
	const shadow = el.attachShadow({mode: 'closed'})

	let text_field = document.createElement('span')
	text_field.className = 'text'

	let i_icons = icons.map(icon => i_icon({ name: icon.name, path: icon.path}, contacts.add(`${icon.name}-${icon_count++}`)) )
	i_icons.forEach(i_icon => { shadow.append(i_icon) })
	
	if (text) {
			text_field.innerText = text
			shadow.append(text_field)
	}

	if (status.disabled) el.setAttribute(`aria-disabled`, true)
	if (status.current) el.setAttribute(`aria-current`, true)

	if (!status.disabled) el.onclick = handle_click
	el.setAttribute('aria-label', name)
	el.setAttribute('tabindex', 0) // indicates that its element can be focused, and where it participates in sequential keyboard navigation 

	const custom_theme = new CSSStyleSheet()
	custom_theme.replaceSync(theme)
	shadow.adoptedStyleSheets = [sheet, custom_theme]

	return el

	// helpers
	function handle_update (data) {
		const { text, icons = [], sheets } = data
		if (icons.length) {
			current_state.opts.icons = icons
			i_icons.forEach(icon => { shadow.removeChild(icon) })
			i_icons = icons.map(icon => i_icon({ name: icon.name, path: icon.path}, contacts.add(`${icon.name}-${icon_count++}`)) )
			i_icons.forEach(i_icon => { shadow.append(i_icon) })
		}
		if (text && typeof text !== 'string') {
			current_state.opts.text = text
			text_field.innerText = text
			if (shadow.contains(text_field)) shadow.removeChild(text_field)
			shadow.append(text_field)
		}
		if (sheets) {
			const new_sheets = sheets.map(sheet => {
				if (typeof sheet === 'string') {
					current_state.opts.sheets.push(sheet)
					const new_sheet = new CSSStyleSheet()
					new_sheet.replaceSync(sheet)
					return new_sheet
					} 
					if (typeof sheet === 'number') return shadow.adoptedStyleSheets[sheet]
			})
			shadow.adoptedStyleSheets = new_sheets
		}
	}
	// button click
	function handle_click () {
			const $parent = contacts.by_name['parent'] // { notify, make, address }
			$parent.notify($parent.make({ to: $parent.address, type: 'click' }))
	}
	// get current state
	function get_current_state () {
		return  {
			opts: current_state.opts,
			contacts
		}
	}

}

function get_theme () {
	return `
	:root {
			--b: 0, 0%;
			--r: 100%, 50%;
			--color-black: var(--b), 0%;
			--color-greyF2: var(--b), 95%;
			--size16: 1.6rem;
			--weight300: 300;
			--primary-color: var(--color-black);
			--primary-bg-color: var(--color-greyF2);
			--primary-size: var(--size16);
	}
	:host(i-button) {
			--size: var(--primary-size);
			--weight: var(--weight300);
			--color: var(--primary-color);
			--color-focus: var(--primary-color-focus);
			--bg-color: var(--primary-bg-color);
			--bg-color-focus: var(--primary-bg-color-focus);
			--opacity: 1;
			--padding: 12px;
			--margin: 0;
			--border-width: 0px;
			--border-style: solid;
			--border-color: var(--primary-color);
			--border-opacity: 1;
			--border: var(--border-width) var(--border-style) hsla(var(--border-color), var(--border-opacity));
			--border-radius: var(--primary-radius);
			--offset_x: 0px;
			--offset-y: 6px;
			--blur: 30px;
			--shadow-color: var(--primary-color);
			--shadow-opacity: 0;
			--box-shadow: var(--offset_x) var(--offset-y) var(--blur) hsla( var(--shadow-color), var(--shadow-opacity) );
			display: inline-grid;
			grid-auto-flow: column;
			gap: 5px;
			justify: content-center;
			align: items-center;
			width: var(--width);
			height: var(--height);
			max-width: 100%;
			font-size: var(--size);
			font-weight: var(--weight);
			color: hsl( var(--color) );
			background-color: hsla( var(--bg-color), var(--opacity) );
			border: var(--border);
			border-radius: var(--border-radius);
			box-shadow: var(--box-shadow);
			padding: var(--padding);
			transition: font-size .3s, font-weight .15s, color .3s, background-color .3s, opacity .3s, border .3s, box-shadow .3s ease-in-out;
			cursor: pointer;
			-webkit-mask-image: -webkit-radial-gradient(white, black);
	}
	:host(i-button:hover) {
			--size: var(--primary-size-hover);
			--weight: var(--primary-weight-hover);
			--color: var(--primary-color-hover);
			--bg-color: var(--primary-bg-color-hover);
			--border-color: var(--primary-color-hover);
			--offset-x: 0;
			--offset-y: 0;
			--blur: 50px;
			--shadow-color: var(--primary-color-hover);
			--shadow-opacity: 0;
	}
	:host(i-button:hover:focus:active) {
			--bg-color: var(--primary-bg-color);
	}
	:host(i-button:focus) {
			--color: var(--color-focus);
			--bg-color: var(--bg-color-focus);
			background-color: hsla(var(--bg-color));
	}
	:host(i-button) g {
			--icon-fill: var(--primary-icon-fill);
			fill: hsl(var(--icon-fill));
			transition: fill 0.05s ease-in-out;
	}
	:host(i-button:hover) g {
		--icon-fill: var(--primary-icon-fill-hover);
	}
	:host(i-button[aria-disabled="true"]) .icon, 
	:host(i-button[aria-disabled="true"]:hover) .icon,
	:host(i-button[aria-current="true"]), :host(i-button[aria-current="true"]:hover) {
			--size: var(--current-size);
			--weight: var(--current-weight);
			--color: var(--current-color);
			--bg-color: var(--current-bg-color);
	}
	:host(i-button[aria-current="true"]) .icon,  
	:host(i-button[aria-current="true"]:hover) .icon {
			--icon-size: var(--current-icon-size);
	}
	:host(i-button[aria-current="true"]) g {
			--icon-fill: var(--current-icon-fill);
	}
	:host(i-button[aria-current="true"]:focus) {
			--color: var(--color-focus);
			--bg-color: var(--bg-color-focus);
	}
	:host(i-button[aria-disabled="true"]), :host(i-button[aria-disabled="true"]:hover) {
			--size: var(--primary-disabled-size);
			--color: var(--primary-disabled-color);
			--bg-color: var(--primary-disabled-bg-color);
			cursor: not-allowed;
	}
	:host(i-button[disabled]) g, 
	:host(i-button[disabled]:hover) g, 
	:host(i-button) .text {
			
	}
	:host(i-button) .icon {
			--icon-size: var(--primary-icon-size);
			display: block;
			width: var(--icon-size);
			transition: width 0.25s ease-in-out;
	}
	:host(i-button:hover) .icon {
			--icon-size: var(--primary-icon-size-hover);
	}
	`
}
},{"datdot-ui-icon":24,"protocol-maker":29}],24:[function(require,module,exports){
(function (__filename){(function (){
const style_sheet = require('support-style-sheet')
const svg = require('svg')
const message_maker = require('message-maker')

var id = 0

module.exports = ({name, path, is_shadow = false, theme}, parent_protocol) => {
// ---------------------------------------------------------------
    const myaddress = `${__filename}-${id++}`
    const inbox = {}
    const outbox = {}
    const recipients = {}
    const names = {}
    const message_id = to => (outbox[to] = 1 + (outbox[to]||0))

    const {notify, address} = parent_protocol(myaddress, listen)
    names[address] = recipients['parent'] = { name: 'parent', notify, address, make: message_maker(myaddress) }
    notify(recipients['parent'].make({ to: address, type: 'ready', refs: ['old_logs', 'new_logs'] }))

    function listen (msg) {
        const {head, refs, type, data, meta } = msg
        inbox[head.join('/')] = msg                  // store msg
        const [from, to, msg_id] = head    
        console.log('New message', { msg })
    }
 // ---------------------------------------------------------------   
    const url = path ? path : './src/svg'
    const symbol = svg(`${url}/${name}.svg`)
    if (is_shadow) {
        function layout (style) {
            const icon = document.createElement('i-icon')
            const shadow = icon.attachShadow({mode: 'closed'})
            const slot = document.createElement('slot')
            slot.name = 'icon'
            style_sheet(shadow, style)
            slot.append(symbol)
            shadow.append(slot)
            shadow.addEventListener('click', handleOnClick)
            return icon
        }

        function handleOnClick (e) {
            console.log('Click', e)
            const { notify, address, make } = recipients['parent']
            notify(make({ to: address, type: 'click', data: { event: e }, refs: {} }))
        }

        // insert CSS style
        const custom_style = theme ? theme.style : ''
        // set CSS variables
        if (theme && theme.props) {
            var { fill, size } = theme.props
        }
        const style = `
        :host(i-icon) {
            --size: ${size ? size : '24px'};
            --fill: ${fill ? fill : 'var(--primary-color)'};
            display: block;
        }
        slot[name='icon'] {
            display: grid;
            justify-content: center;
            align-items: center;
        }
        slot[name='icon'] span {
            display: block;
            width: var(--size);
            height: var(--size);
        }
        slot[name='icon'] svg {
            width: 100%;
            height: auto;
        }
        slot[name='icon'] g {
            fill: hsl(var(--fill));
            transition: fill .3s ease-in-out;
        }
        ${custom_style}
        `
        return layout(style)
    }

    return symbol
}

}).call(this)}).call(this,"/node_modules/.pnpm/github.com+datdot-ui+button@62154fea7833f71621163a766a63063bf64dd6ee/node_modules/datdot-ui-icon/src/index.js")
},{"message-maker":28,"support-style-sheet":25,"svg":26}],25:[function(require,module,exports){
module.exports = support_style_sheet
function support_style_sheet (root, style) {
    return (() => {
        try {
            const sheet = new CSSStyleSheet()
            sheet.replaceSync(style)
            root.adoptedStyleSheets = [sheet]
            return true 
        } catch (error) { 
            const inject_style = `<style>${style}</style>`
            root.innerHTML = `${inject_style}`
            return false
        }
    })()
}
},{}],26:[function(require,module,exports){
module.exports = svg
function svg (path) {
    const span = document.createElement('span')
    span.classList.add('icon')
    get_svg()
    async function get_svg () {
        const res = await fetch(path)
        if (res.status !== 200) throw new Error(res.status)
        let data = await res.text()
        span.innerHTML = data
    }
    return span
}   
},{}],27:[function(require,module,exports){
const button = require('datdot-ui-button')
const protocol_maker = require('protocol-maker')

var id = 0
var count = 0
const sheet = new CSSStyleSheet()
const default_opts = { 
	name: 'list',
	body: [],
	theme: get_theme()
}
sheet.replaceSync(default_opts.theme)

module.exports = list

list.help = () => { return { opts: default_opts } }

function list (opts, parent_wire) {
// -----------------------------------
	const initial_contacts = { 'parent': parent_wire }
	const contacts = protocol_maker('input-number', listen, initial_contacts)
	function listen (msg) {
		const { head, refs, type, data, meta } = msg // receive msg
		const [from] = head
		console.log('LIST LISTENING', { type, from, name: contacts.by_address[from].name, msg, data })
		// handle
		if (type === 'click') return handle_click_event(msg)
		if (type === 'help') {
			const $from = contacts.by_address[from]
			$from.notify($from.make({ to: $from.address, type: 'help', data: { state: get_current_state() }, refs: { cause: head }}))                         
		}
	}
// -----------------------------------
	const {
		name = default_opts.name, 
		body = default_opts.body, 
		theme = `` } = opts
		
	const current_state =  { opts: { name, body, sheets: [default_opts.theme, theme] } }
	const list = document.createElement('i-list')
	const shadow = list.attachShadow({mode: 'closed'})
	
	list.ariaLabel = name
	list.tabIndex = -1
	
	body.forEach( (item, i) => {
		const { text = undefined, icons = [], status = {}, theme = {}} = item
		status.selected = status.selected || false
		status.disabled = status.disabled || false
		const { style = ``, props = {} } = theme
		const li = document.createElement('li')
		li.setAttribute('aria-selected', status.selected)
		if (status.disabled) li.setAttribute('disabled', status.disabled)
		let el 
		const button_name = `button-${count++}`
		el = button({ name: button_name, text, icons, status, theme }, contacts.add(button_name))
		shadow.append(li)
		li.append(el)
	})

	const custom_theme = new CSSStyleSheet()
	custom_theme.replaceSync(theme)
	shadow.adoptedStyleSheets = [sheet, custom_theme]

	return list

	// event handlers
	function handle_click_event (msg) {
			const {head, type, data} = msg
			const [from] = head
			const $parent = contacts.by_name['parent']
			$parent.notify($parent.make({ to: $parent.address, type: 'click', data: contacts.by_address[from].name }))        
	}
}

// helpers
function get_current_state () {
	return  {
		opts: current_state.opts,
		contacts
	}
}

function get_theme () {
	return `
	:root {
		--b: 0, 0%;
    --r: 100%, 50%;
    --color-white: var(--b), 100%;
    --color-black: var(--b), 0%;
		--width: 100%;
		--height: 100%;
		--primary-bg-color: var(--color-white);
		--primary-bg-color-hover: var(--color-black);
		--primary-radius: 8px;
		--primary-border-width: 1px;
		--primary-border-style: solid;
		--primary-border-color: var(--color-black);
		--primary-border-opacity: 1;
	}
	:host(i-list) {
		width: var(--width);
		height: var(--height);
		display: grid;
		max-width: 100%;
	}
	:host(i-list[aria-hidden="true"]) {
		opacity: 0;
		animation: close 0.3s;
		pointer-events: none;
	}
	:host([aria-hidden="false"]) {
		animation: open 0.3s;
	}
	li {
		--bg-color: var(--primary-bg-color);
		--border-radius: var(--primary-radius);
		--border-width: var(--primary-border-width);
		--border-style: var(--primary-border-style);
		--border-color: var(--primary-border-color);
		--border-opacity: var(--primary-border-opacity);
		--border: var(--border-width) var(--border-style) hsla(var(--border-color), var(--border-opacity));
		display: grid;
		grid-template-columns: 1fr;
		background-color: hsl(var(--bg-color));
		border: var(--border);
		margin-top: -1px;
		cursor: pointer;
		transition: background-color 0.3s ease-in-out;
	}
	li:hover {
		--bg-color: var(--primary-bg-color-hover)

	}
	:host(i-list) li:nth-of-type(1) {
		border-top-left-radius: var(--border-radius);
		border-top-right-radius: var(--border-radius);
	}
	li:last-child {
		border-bottom-left-radius: var(--border-radius);
		border-bottom-right-radius: var(--border-radius);
	}
	@keyframes close {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes open {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	`
}
},{"datdot-ui-button":23,"protocol-maker":29}],28:[function(require,module,exports){
module.exports = function message_maker (from) {
  let msg_id = 0
  return function make ({to, type, data = null, refs = {} }) {
      const stack = (new Error().stack.split('\n').slice(2).filter(x => x.trim()))
      return { head: [from, to, msg_id++], refs, type, data, meta: { stack }}
  }
}
},{}],29:[function(require,module,exports){
// const path = require('path')
// const filename = path.basename(__filename)
const message_maker = require('message-maker')
// const message_id = to => (outbox[to] = 1 + (outbox[to]||0))

module.exports = protocol_maker

const routes = {}
var id = 0

function protocol_maker (type, listen, initial_contacts = {}) {
  if (!type || typeof type !== 'string') throw new Error('invalid type')
  const myaddress = id++

  const inbox = {}
  const outbox = {}

  const by_name = {}
  const by_address = {}
  const contacts = { add, by_name, by_address, cut, on }
  
  const keys = Object.keys(initial_contacts)
  for (var i = 0, len = keys.length; i < len; i++) {
    const name = keys[i]
    const wire = initial_contacts[name]
    // @INFO: perspective of sub instance:
    const { notify, address } = wire(myaddress, wrap_listen(listen))    
    const contact = {
      name,
      address,
      // path: `${myaddress}/${name}`,
      notify: wrap_notify(notify),
      make: message_maker(myaddress)
    }
    by_name[name] = by_address[address] = contact // new Promise(resolve => resolve(contact))
  }
  return contacts
  function on (listener) {
    // @NOTE: to listen to any "default protocol events" supported by any protocol, e.g. help
    // maybe also: 'connect', or 'disconnect'
    throw new Error ('`on` is not yet implemented')
    return function off () {}
  }
  function cut (wire) { throw new Error ('`cut` is not yet implemented')}
  function add (name) {
    // @INFO: perspective of instance:
    if (!name || typeof name !== 'string') throw new Error('invalid name')
    if (by_name[name]) throw new Error('name already exists')
    const wait = {}
    by_name[name] = { name, make: message_maker(myaddress) } // new Promise((resolve, reject) => { wait.resolve = resolve; wait.reject = reject })
    return function wire (address, notify) {
      const contact = {
        // @TODO: add queryable "routes" and allow lookup `by_route[route]`       
        name, // a nickname dev gives to a component
        address, // an address app makes for each component
        // TODO: address will become "name" (like type) compared to nickname
        // address: something new, based on e.g. filepath or browserified bundle.js:22:42 etc.. to give actual globally unique identifier
        notify: wrap_notify(notify),
        make: message_maker(myaddress)
      }
      // wait.resolve(contact)
      by_name[name].address = address
      by_name[name].notify = wrap_notify(notify)
      by_address[address] = contact // new Promise(resolve => resolve(contact))
      return { notify: wrap_listen(listen), address: myaddress }
    }
  }
  function wrap_notify (notify) {
    return message => {
      outbox[message.head.join('/')] = message  // store message
      return notify(message)
    }
  }
  function wrap_listen (listen) {
    return message => {
      inbox[message.head.join('/')] = message  // store message
      return listen(message)
    }
  }
}
/*
const name_routes = [
  "root/",
  "root/el:demo/",
  "root/el:demo/cpu:range-slider/",
  "root/el:demo/cpu:range-slider/%:input-number/",
  "root/el:demo/ram:range-slider/",
  "root/el:demo/ram:range-slider/GB:input-number/",
  "root/el:demo/upload:range-slider/",
  "root/el:demo/upload:range-slider/MB:input-number/",
  "root/el:demo/download:range-slider/",
  "root/el:demo/download:range-slider/MB:input-number/",  
]
// --------------------------------------------------
const name_routes = {
    root: {
        "el:demo": {
            "cpu:range-slider": {
                "%:input-number": {}
            },
            "ram:range-slider": {
                "GB:input-number": {}
            },
            "download:range-slider": {
                "MB:input-number": {}
            },
            "upload:range-slider": {
                "MB:input-number": {}
            },
        },
    },
}
// --------------------------------------------------
const name_routes = {
    root: {
        "el": {
            "cpu": {
                "%": {}
            },
            "ram": {
                "GB": {}
            },
            "download": {
                "MB": {}
            },
            "upload": {
                "MB": {}
            },
        },
    },
}
*/
},{"message-maker":28}],30:[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],31:[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        if (xstate === OPEN) {
          if (reg === '/') {
            p.push([ OPEN, '/', arg ])
            reg = ''
          } else {
            p.push([ OPEN, arg ])
          }
        } else if (xstate === COMMENT && opts.comments) {
          reg += String(arg)
        } else if (xstate !== COMMENT) {
          p.push([ VAR, xstate, arg ])
        }
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            if (parts[i][0] === CLOSE) {
              i--
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      if (opts.createFragment) return opts.createFragment(tree[2])
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && c === '/' && reg.length) {
          // no-op, self closing tag without a space <br/>
        } else if (state === OPEN && /\s/.test(c)) {
          if (reg.length) {
            res.push([OPEN, reg])
          }
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else if (x === null || x === undefined) return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":30}],32:[function(require,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}],33:[function(require,module,exports){
const style_sheet = require('support-style-sheet')
const protocol_maker = require('protocol-maker')
const i_button = require('datdot-ui-button')
const i_list = require('datdot-ui-list')

var id = 0
var count = 0
const sheet = new CSSStyleSheet()
const default_opts = {
	name: 'dropdown',
	button_opts: { name: 'button'},
	list_opts: { name: 'list' },
	status: { disabled: false, expanded: false },
	theme: get_theme()
}
sheet.replaceSync(default_opts.theme)

module.exports = dropdown

dropdown.help = () => { return { opts: default_opts } }

function dropdown (opts, parent_wire) {    
// -----------------------------------------
	const initial_contacts = { 'parent': parent_wire }
	const contacts = protocol_maker('input-number', listen, initial_contacts)
	
	function listen (msg) {
		const { head, refs, type, data, meta } = msg // receive msg
		const [from, to, msg_id] = head
		console.log('DROPDOWN', { from, type, name: contacts.by_address[from].name, data })
		// handle
		const $from = contacts.by_address[from]
		$parent.notify($parent.make({ to: $parent.address, type, data }))
		if (type == 'click' && $from.name === button_name) return handle_expand_collapse()
	}
	const $parent = contacts.by_name['parent']
// -----------------------------------------
	const {
		name = default_opts.name, 
		button_opts = default_opts.button_opts, 
		list_opts = default_opts.list_opts,
		status: {
			disabled = default_opts.status.disabled,
			expanded = default_opts.status.expanded,
		} = {},
		theme = ``
	} = opts

	const current_state =  { opts: { name, button_opts, list_opts, status: { disabled, expanded }, sheets: [default_opts.theme, theme] } }

	const list_name = `${name}-list`
	const button_name = `${name}-button`

	const dropdown = document.createElement('i-dropdown')
	const shadow = dropdown.attachShadow({mode: 'closed'})

	dropdown.setAttribute('aria-label', name)
	if (current_state.opts.status.is_disabled) dropdown.setAttribute('disabled', current_state.opts.status.is_disabled)

	const button = i_button(button_opts, contacts.add(button_name))
	const list = i_list(list_opts, contacts.add(list_name))

	shadow.append(list)
	shadow.append(button)

	list.setAttribute('aria-hidden', !current_state.opts.status.expanded)
	if (!current_state.opts.status.expanded)  list.style.visibility = 'hidden'

	const custom_theme = new CSSStyleSheet()
	custom_theme.replaceSync(theme)
	shadow.adoptedStyleSheets = [sheet, custom_theme]

	return dropdown

	// HANDLERS
	async function handle_expand_collapse () {
		current_state.opts.status.expanded = !current_state.opts.status.expanded
		list.setAttribute('aria-hidden', !current_state.opts.status.expanded)
		if (current_state.opts.status.expanded) {
			list.style.visibility = 'visible'
			document.body.addEventListener('click', onbodyclick)
		} else {
			document.body.removeEventListener('click', onbodyclick)
			await new Promise(ok => setTimeout(ok, 300))
			list.style.visibility = 'hidden'
		}
		$parent.notify($parent.make({ to: $parent.address, type: 'click', data: current_state.opts.status.expanded }))
	}

	function onbodyclick (e) {
			const outside = typeof e.composedPath === 'function' ?
				!e.composedPath().includes(dropdown)
				: !dropdown.contains(e.target)

			if (!outside) return
			document.body.removeEventListener('click', onbodyclick)
			const type = 'collapsed'
			if (current_state.opts.status.expanded) {
				handle_expand_collapse()
				// notify button
				const $button = contacts.by_name[button_name]
				$button.notify($button.make({ to: $button.address, type, data: current_state.opts.status.expanded }))
				// notify list
				const $list = contacts.by_name[list_name]
				$list.notify($list.make({ to: $list.address, type, data: current_state.opts.status.expanded }))
				// notify parent
				const $parent = contacts.by_name['parent']
				$parent.notify($parent.make({to: $parent.address, type }) )
			}
	}
}

function get_theme () {
    return `
    :host(i-dropdown) {
        position: relative;
        display: grid;
        max-width: 100%;
    }
    :host(i-dropdown[disabled]) {
        cursor: not-allowed;
    }
    i-button {
        position: relative;
        z-index: 2;
    }
    i-list {
        position: absolute;
        left: 0;
        margin-top: 20px;
        z-index: 1;
        width: 100%;
				top: 23px;
    }
    i-list[aria-hidden="false"] {
        animation: down 0.3s ease-in;
    }
    i-list[aria-hidden="true"] {
        animation: up 0.3s ease-out;
    } 
    @keyframes down {
        0% {
					opacity: 0;
					top: 0;
        }
        50% {
					opacity: 0.5;
					top: 20px;
        }
        100%: {
					opacity: 1;
					top: 40px;
        }
    }
    
    @keyframes up {
        0% {
					opacity: 1;
					top: 40px;
        }
        50% {
					top: 20px;
        }
        75% {
					opacity: 0.5;
        }
        100%: {
					opacity: 0;
					top: 0;
        }
    } 
`
}


},{"datdot-ui-button":23,"datdot-ui-list":27,"protocol-maker":29,"support-style-sheet":35}],34:[function(require,module,exports){
module.exports = make_grid

function make_grid (opts = {}) {
    const {areas, area, rows, columns, row, auto = {}, column, gap, justify, align} = opts
    let style = ''
    grid_init ()
    return style

    function grid_init () {
        make_rows()
        make_columns()
        make_auto()
        make_row()
        make_column()
        make_justify()
        make_align()
        make_gap()
        make_area()
        make_areas()
    }
     
    function make_areas () {
        if (typeof areas === 'object') {
            let template = `grid-template-areas:`
            areas.map( a => template += `"${a}"`)
            return style += template + ';'
        }
        if (typeof areas === 'string') return areas ? style +=`grid-template-areas: "${areas}";` : ''
    }
    function make_area () {
        return area ? style += `grid-area: ${area};` : ''
    }

    function make_rows () { 
        return rows ? style +=  `grid-template-rows: ${rows};` : ''
    }

    function make_columns () {
        return columns ? style += `grid-template-columns: ${columns};` : ''
    }

    function make_row () {
        return row ? style += `grid-row: ${row};` : ''
    }

    function make_column () {
        return column ? style += `grid-column: ${column};` : ''
    }

    function make_justify () {
        if (justify === void 0) return
        const result = justify.split('-')
        const [type, method] = result
        return style += `justify-${type}: ${method};`
    }

    function make_align () {
        if (align === void 0) return
        const result = align.split('-')
        const [type, method] = result
        return style += `align-${type}: ${method};`
    }

    function make_gap () {
        if (gap === void 0) return ''
        return style += `gap: ${gap};`
    }

    function make_auto () {
        const {auto_flow = null, auto_rows = null, auto_columns = null} = auto
        const grid_auto_flow = auto_flow ? `grid-auto-flow: ${auto_flow};` : ''
        const grid_auto_rows = auto_rows ? `grid-auto-rows: ${auto_rows};` : ''
        const grid_auto_columns = auto_columns ? `grid-auto-columns: ${auto_columns};` : ''
        return style += `${grid_auto_flow}${grid_auto_rows}${grid_auto_columns}`
    }
}
},{}],35:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}]},{},[1]);
