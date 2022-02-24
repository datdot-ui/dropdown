(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (__filename){(function (){
const head = require('head')()
const bel = require('bel')
const csjs = require('csjs-inject')
// datdot-ui dependences
const terminal = require('datdot-terminal')
const icon = require('datdot-ui-icon')
const dropdown = require('..')
const message_maker = require('message-maker')
const make_grid = require('../src/node_modules/make-grid')

var id = 0

function demo () {
// ------------------------------
    const myaddress = `${__filename}-${id++}`
    const inbox = {}
    const outbox = {}
    const recipients = {}
    const names = {}
    const message_id = to => (outbox[to] = 1 + (outbox[to]||0))

    function make_protocol (name) {
        return function protocol (address, notify) {
            names[address] = recipients[name] = { name, address, notify, make: message_maker(myaddress) }
            return { notify: listen, address: myaddress }
        }
    }
    function listen (msg) {
        console.log('New message', { msg })
        const { head, refs, type, data, meta } = msg // receive msg
        inbox[head.join('/')] = msg                  // store msg
        const [from] = head
        // send back ack
        const { notify: from_notify, address: from_address, make: from_make } = recipients[from]
        from_notify(from_make({ to: from_address, type: 'ack', refs: { 'cause': head } }))
        // handle
        const { notify: log_notify, address: log_address, make: log_make } = recipients['parent']
        log_notify(log_make({ to: log_address, type, data }))
        if (type === 'click') return handle_dropdown_menu_event(from, data)
    }
// ------------------------------
    const logs = terminal({mode: 'compact', expanded: false}, make_protocol('logs'))
    const single_select_option = 
    {
        page: 'PLAN',
        name: 'terminal',
        mode : 'single-select',
        expanded: false,
        disabled: false,
        options: {
            button: {
                // select: {name: 'star'}
                theme: {
                    props: {
                        listbox_collapsed_bg_color: 'var(--color-greyA2)',
                        listbox_collapsed_bg_color_hover: 'var(--color-white)',
                        listbox_collapsed_listbox_size: 'var(--size30)',
                        listbox_collapsed_listbox_color: 'var(--color-white)',
                        listbox_collapsed_listbox_color_hover: 'var(--color-blue)',
                        listbox_collapsed_listbox_icon_fill: 'var(--color-white)',
                        listbox_collapsed_icon_fill_hover: 'var(--color-green)',
                        listbox_expanded_listbox_color: 'var(--color-orange)',
                        listbox_expanded_listbox_icon_fill: 'var(--color-black)',
                        listbox_expanded_icon_fill: 'var(--color-blue)',
                        listbox_expanded_bg_color: 'var(--color-white)'
                    },
                    grid: {
                        auto: {
                            auto_flow: 'row'
                        }
                    }
                }
            },
            list: {
                array: [
                    {
                        text: 'Compact messages',
                        icon: {name: 'plus'},
                        cover: 'https://cdn.pixabay.com/photo/2021/08/07/08/49/building-6528075_960_720.jpg',
                        // current: true,
                        // selected: false,
                    },
                    {
                        text: 'Comfortable messages',
                        icon: {name: 'edit'},
                        cover: 'https://cdn.pixabay.com/photo/2021/08/23/12/41/foxtail-6567731_960_720.jpg'
                        // current: true,
                        // selected: true
                    }
                ] 
            }
        }
    }

    const multiple_select_option = 
    {
        page: 'STEPS',
        name: 'filter',
        mode : 'multiple-select',
        expanded: false,
        disabled: false,
        options: {
            button: {
                body: 'Filter',
                // mode: 'selector',
                icons: {
                    select: {name: 'filter'},
                    icon: {name: 'edit'}
                },
                cover: 'https://images.unsplash.com/photo-1629122307243-c913571a1df6?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5MXx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            },
            list: {
                array: [
                    {
                        text: 'Option1',
                        cover: 'https://images.unsplash.com/photo-1629122307243-c913571a1df6?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5MXx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                        list: {name: 'star'},
                        // selected: false
                    },
                    {
                        text: 'Option2',
                        list: {name: 'star'},
                        selected: true
                    },
                    {
                        text: 'Option3',
                        list: {name: 'star'},
                        selected: true
                    }
                ],
            }
        },
        theme: {
            props: {
                margin_top: '23px'
            }
        }
    }
    
    const dropdown_up_option = {
        name: 'up-selector',
        expanded: false,
        options: {
            button: {
                name: 'up-selector'
            },
            list: {
                name: 'up-list',
                direction: 'up',
                end: '55px',
                array: [
                    {text: 'datdot.org', role: 'menuitem'},
                    {text: 'playproject.io', role: 'menuitem'}
                ]
            }
        },
    }

    const content = bel`
    <div class="${css.content}">
        <h1>Dropdown</h1>
        <aside class="${css.example}">
            <h2>menu</h2>
            ${dropdown(dropdown_up_option, make_protocol(dropdown_up_option.name))}
        </aside>
        <aside class="${css.example}">
            <h2>Single select</h2>
            ${dropdown(single_select_option, make_protocol(single_select_option.name))}
        </aside>
        <aside class="${css.example}">
            <h2>Mutiple select</h2>
            ${dropdown(multiple_select_option, make_protocol(multiple_select_option.name))}
        </aside>
    </div>`
    const container = bel`<div class="${css.container}">${content}</div>`
    const app = bel`<div class="${css.wrap}">${container}${logs}</div>`

    return app

    function handle_dropdown_menu_event (from, data) {
        const dropdowns = document.querySelectorAll('i-dropdown')
        const state = data.expanded
        const type = state ? 'expanded' : 'collapsed'
        const to = `${from} / listbox / ui-list`
        recipients[from]( make({to, type, data: {from, expanded: state}}) )
        dropdowns.forEach( item => {
            const name = item.getAttribute('aria-label')
            const to = `${name} / listbox / ui-list`
            item.style.zIndex = '99'
            if (name !== from) {
                recipients[name]( make({to, type: 'collapsed', data: {name, expanded: !state}}) )
                item.removeAttribute('style')
            }
        })
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
.wrap {
    display: grid;
    ${make_grid({rows: 'minmax(0, 1fr) 200px', areas: ["container", "terminal"]})}
    height: 100%;
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
.example:last-child {
    margin-top: 100px;
}
`

document.body.append(demo())
}).call(this)}).call(this,"/demo/demo.js")
},{"..":53,"../src/node_modules/make-grid":54,"bel":4,"csjs-inject":7,"datdot-terminal":24,"datdot-ui-icon":42,"head":2,"message-maker":49}],2:[function(require,module,exports){
module.exports = head

function head (lang = 'UTF-8', title = 'Dropdown - DatDot UI') {
    document.documentElement.lang = 'en'
    document.title = title
    const lan = document.createElement('meta')
    const viewport = document.createElement('meta')
    const description = document.createElement('meta')
    lan.setAttribute('charset', lang)
    viewport.setAttribute('name', 'viewport')
    viewport.setAttribute('content', 'width=device-width, initial-scale=1, user-scalable=no')
    description.setAttribute('name', 'description')
    description.setAttribute('content', 'Datdot-UI is a web component and the widgets for datdot.org using.')
    document.head.append(lan, viewport)
}
},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"./appendChild":3,"hyperx":51}],5:[function(require,module,exports){
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
},{"csjs":10,"insert-css":52}],6:[function(require,module,exports){
'use strict';

module.exports = require('csjs/get-css');

},{"csjs/get-css":9}],7:[function(require,module,exports){
'use strict';

var csjs = require('./csjs');

module.exports = csjs;
module.exports.csjs = csjs;
module.exports.getCss = require('./get-css');

},{"./csjs":5,"./get-css":6}],8:[function(require,module,exports){
'use strict';

module.exports = require('./lib/csjs');

},{"./lib/csjs":14}],9:[function(require,module,exports){
'use strict';

module.exports = require('./lib/get-css');

},{"./lib/get-css":18}],10:[function(require,module,exports){
'use strict';

var csjs = require('./csjs');

module.exports = csjs();
module.exports.csjs = csjs;
module.exports.noScope = csjs({ noscope: true });
module.exports.getCss = require('./get-css');

},{"./csjs":8,"./get-css":9}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"./composition":13}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{"./build-exports":12,"./composition":13,"./css-extract-extends":15,"./css-key":16,"./extract-exports":17,"./scopeify":23}],15:[function(require,module,exports){
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

},{"./composition":13}],16:[function(require,module,exports){
'use strict';

/**
 * CSS identifiers with whitespace are invalid
 * Hence this key will not cause a collision
 */

module.exports = ' css ';

},{}],17:[function(require,module,exports){
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

},{"./regex":20}],18:[function(require,module,exports){
'use strict';

var cssKey = require('./css-key');

module.exports = function getCss(csjs) {
  return csjs[cssKey];
};

},{"./css-key":16}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{"./regex":20}],22:[function(require,module,exports){
'use strict';

var encode = require('./base62-encode');
var hash = require('./hash-string');

module.exports = function fileScoper(fileSrc) {
  var suffix = encode(hash(fileSrc));

  return function scopedName(name) {
    return name + '_' + suffix;
  }
};

},{"./base62-encode":11,"./hash-string":19}],23:[function(require,module,exports){
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

},{"./regex":20,"./replace-animations":21,"./scoped-name":22}],24:[function(require,module,exports){
const bel = require('bel')
const style_sheet = require('support-style-sheet')
const message_maker = require('message-maker')
const make_grid = require('make-grid')
const {int2hsla, str2hashint} = require('generator-color')
const i_footer = require('footer')
const {i_button} = require('datdot-ui-button')

var id = 0

module.exports = logs

function logs ({name = 'terminal', mode = 'compact', expanded = false, init = 15, limit = 15}, parent_protocol) {
// ---------------------------------------------------------------
    const myaddress = `terminal-${id++}` // unique
    const inbox = {}
    const outbox = {}
    const recipients = {}
    const message_id = to => ( outbox[to] = 1 + (outbox[to]||0) )

    const {notify, address} = parent_protocol(myaddress, listen)
    recipients['parent'] = { notify, address, make: message_maker(myaddress) }

    let make = message_maker(myaddress) // @TODO: replace flow with myaddress/myaddress
    let message = make({to: address, type: 'ready', data: {}})
    notify(message)

    function listen (msg) {
        const {head, refs, type, data, meta } = msg
        inbox[head.join('/')] = msg                  // store msg
        const [from, to, msg_id] = head
        make_logs(msg)
        if (type === 'click') handle_load_more(store_msg)
        if (type.match(/messages-count/)) return
        if (type === 'layout-mode') return handle_change_layout(data)
        if (type === 'selected') return handle_selected(data.selected)
        if (type === 'search-filter') return handle_search_filter(data.letter)
        if (type === 'cleared-search') return handle_search_filter(data)
    }

    function make_protocol (name) {
        return function protocol (address, notify) {
            recipients[name] = { address, notify, make: message_maker(myaddress) }
            return { notify: listen, address: myaddress }
        }
    }
// ---------------------------------------------------------------
    let is_expanded = expanded
    let types = {}
    let range = init
    let store_msg = []
    let len = store_msg.length
    const el = document.createElement('i-terminal')
    const shadow = el.attachShadow({mode: 'closed'})
    const container = document.createElement('div')
    const i_logs = document.createElement('i-logs')
    const load_more = i_button({
        name: 'load-more', 
        body: 'Load more',
        classlist: 'load-more',
        theme: {
            props: {
                width: '50vw',
            }
        }
    }, make_protocol('load-more'))
    const footer = i_footer({name}, make_protocol(`${name}-footer`))
    container.classList.add('container')
    i_logs.setAttribute('aria-label', mode)
    container.append(i_logs, load_more)
    style_sheet(shadow, style)
    shadow.append(container, footer)

    const intersection_config = {
        root: i_logs,
        rootMargin: '0px',
        threshold: 0
    }
    const intersection_observer = new IntersectionObserver( (entries) => {
        entries.forEach( entry => {
            const {boundingClientRect, intersectionRatio, intersectionRect, isIntersecting, isVisible, rootBounds, target} = entry
            // target.childElementCount
            // console.log(target.scrollHeight);
            // console.log(target.offsetHeight)
        })
    }, intersection_config)

    const mutation_config = {
        attributes: true,
        childList: true,
        characterData: true
    }
    const mutation_observer = new MutationObserver(list_observer)

    mutation_observer.observe(i_logs, mutation_config)
    return el

    function list_observer (entries, observer) {
        entries.forEach( (entry) => {
            const {target, type, attributeName, attributeNamespace, addedNodes, removedNodes, nextSibling, previousSibling, oldValue } = entry
        })
    }
    // handle log list
    function add_log (msg) {
        if (!msg) return
        const {head, refs, type, data, meta} = msg
        try {
            // make an object for type, count, color
            const init = t => ({type: t, count: 0, color: type.match(/ready|click|triggered|opened|closed|checked|unchecked|selected|unselected|expanded|collapsed|error|warning|toggled|changed/) ? null : int2hsla(str2hashint(t)) })
            // to check type is existing then do count++, else return new type
            const add = t => ((types[t] || (types[t] = init(t))).count++, types[t])
            add(type)
            const from = bel`<span aria-label=${head[0]} class="from">${head[0]}</span>`
            const to = bel`<span aria-label="to" class="to">${head[1]}</span>`
            const data_info = bel`<span aira-label="data" class="data">data: ${typeof data === 'object' ? JSON.stringify(data) : data}</span>`
            const type_info = bel`<span aria-type="${type}" aria-label="${type}" class="type">${type}</span>`
            const refs_info = bel`<div class="refs"><span>refs:</span></div>`
            refs.map( (ref, i) => 
                refs_info.append(bel`<span>${ref}${i < refs.length - 1 ? ',  ' : ''}</span>`)
            )
            const info = bel`<div class="info">${data_info}${refs_info}</div>`
            const header = bel`
            <div class="head">
                ${type_info}
                ${from}
                <span class="arrow">=＞</span>
                ${to}
            </div>`
            const log = bel`<div class="logs">${header}${info}</div>`
            const file = bel`
            <div class="file">
                <span>${meta.stack[0]}</span>
                <span>${meta.stack[1]}</span>
            </div>`
            generate_type_color(type, type_info)
            var list = bel`<section class="list" aria-label="${type}" data-id=${i_logs.childElementCount+1} aria-expanded="${is_expanded}" onclick=${() => handle_accordion_event(list)}>${log}${file}</section>`
            if (i_logs.childElementCount < range) i_logs.append(list)
            load_more.style.visibility = i_logs.childElementCount < len ? 'visible' : 'hidden'
            // have an issue with i-footer, it would be return as a msg to make_logs, so make footer_get to saprate make_logs from others
            recipients[`${name}-footer`](make({type: 'messages-count', data: len}))
        } catch (error) {
            document.addEventListener('DOMContentLoaded', () => i_logs.append(list))
            return false
        }
    }
    // check logs and store logs as data
    function make_logs (msg) {
        store_msg.push(msg)
        len = store_msg.length
        add_log(msg)
    }
    function generate_type_color (type, el) {
        for (let t in types) { 
            if (t === type && types[t].color) {
                el.style.color = `hsl(var(--color-dark))`
                el.style.backgroundColor = types[t].color
            }   
        }
    }
    function handle_accordion_event (target) {
        const status = target.ariaExpanded === 'false' ? 'true' : 'false'
        target.ariaExpanded = status
    }
    function handle_change_layout (data) {
        const {mode, expanded} = data
        const { childNodes } = i_logs
        if (mode) i_logs.setAttribute('aria-label', mode)
        if (expanded !== void 0) {
            is_expanded = expanded
            childNodes.forEach( list => {
                list.setAttribute('aria-expanded', expanded)
            })
        }
    }
    function handle_selected (args) {
        const selected = args.filter( obj => obj.selected )
        const result = selected[0].text.split(' ')[0].toLowerCase()
        handle_change_layout({mode: result})
    }
    function handle_search_filter (letter) {
        const {childNodes} = i_logs
        childNodes.forEach( item => {
            const from = item.querySelector('.from')
            const to = item.querySelector('.to')
            const data = item.querySelector('.data')
            const refs = item.querySelector('.refs')
            const file = item.querySelector('.file')
            element_match (from, letter)
            element_match (to, letter)
            element_match (data, letter)
            element_match (refs, letter)
            element_match (file, letter)
        })
        const mark = i_logs.querySelectorAll('mark')[0]
        if (mark) mark.classList.add('current')

        const current = i_logs.querySelector('.current')
        if (current) {
            const scrollHeight = i_logs.scrollHeight
            const height = i_logs.offsetHeight
            const offsetTop = current.offsetTop
            if (scrollHeight < height) return i_logs.scrollTop = offsetTop
            if (scrollHeight > height) return i_logs.scrollTop = offsetTop - height
        }
    }
    function element_match (target, letter) {
        // need to add insenstive for regex
        const regex = new RegExp(`${letter}`, 'gi')
        // check target includes letter, add mark inside
        // !important make sure all texts are lowercase to compare from letter
        if (target.textContent.toLowerCase().includes(`${letter}`)) {
            return target.innerHTML = target.textContent.replace(regex, text => `<mark>${text}</mark>`)
        }
        // if not return normal text
        return target.innerHTML = target.textContent.replace(regex, text => text)
    }

    function handle_load_more (args) {
        const start = range
        range = start + limit
        args.filter( (msg, index) => index >= start && index < (start + limit))
            .forEach( msg => add_log(msg) )
    }
}

const init_grid = {
    rows: '1fr auto',
    areas: ['logs', 'footer']
}
const style = `
:host(i-terminal) {
    --bg-color: var(--color-dark);
    --opacity: 1;
    --size: var(--size12);
    --color: var(--color-white);
    grid-area: terminal;
    display: grid;
    ${make_grid(init_grid)}
    font-size: var(--size);
    color: hsl(var(--color));
    background-color: hsla( var(--bg-color), var(--opacity));
    padding-top: 4px;
    height: 100%;
    max-width: 100%;
    overflow: hidden;
}
h4 {
    --bg-color: var(--color-deep-black);
    --opacity: 1;
    margin: 0;
    padding: 10px 10px;
    color: #fff;
    background-color: hsl( var(--bg-color), var(--opacity) );
}
.container {
    grid-area: logs;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    max-width: 100%;
    overflow: hidden scroll;
}
i-logs {
    
}
.load-more {
    margin: 0 auto;
}
i-footer {
    grid-area: footer;
}
.list {
    --bg-color: 0, 0%, 30%;
    --opacity: 0.25;
    --border-radius: 0;
    padding: 2px 10px 2px 0px;
    margin-bottom: 1px;
    background-color: hsla( var(--bg-color), var(--opacity) );
    border-radius: var(--border-radius);
    transition: background-color 0.6s ease-in-out;
    width: 100%;
    max-width: 100%;
}
.list[aria-expanded="false"] .file {
    height: 0;
    opacity: 0;
    transition: opacity 0.3s, height 0.3s ease-in-out;
}
.list[aria-expanded="true"] .file {
    opacity: 1;
    height: auto;
    padding: 4px 8px;
}
i-logs .list:last-child {
    --bg-color: var(--color-viridian-green);
    --opacity: .3;
}
[aria-label="compact"] .list[aria-expanded="false"] .logs {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
}
[aria-label="compact"] .list[aria-expanded="false"] .head, [aria-label="compact"] .list[aria-expanded="false"] .info {
    display: inline;
}
[aria-label="compact"] .list[aria-expanded="true"] .logs {
    padding-left: 8px;
    oveflow: auto;
}
[aria-label="compact"] .list[aria-expanded="true"] .logs .head {
    margin-left: -8px;
}
[aria-label="compact"] .list[aria-expanded="true"] .data {
    display: inlne-block;
}
[aria-label="compact"] .refs {
    padding-left: 8px;
}
[aria-label="compact"] .info {
    display: inline;
}
.logs {
    line-height: 1.8;
    word-break: break-all;
    white-space: pre-wrap;
}
.head {
    display: inline-block;
}
.type {
    --color: var(--color-greyD9);
    --bg-color: var(--color-greyD9);
    --opacity: .25;
    display: inline-grid;
    color: hsl( var(--color) );
    background-color: hsla( var(--bg-color), var(--opacity) );
    padding: 0 2px;
    justify-self: center;
    align-self: center;
    text-align: center;
    min-width: 92px;
}
.from {
    --color: var(--color-maximum-blue-green);
    display: inline-block;
    color: hsl( var(--color) );
    justify-content: center;
    align-items: center;
    margin: 0 12px;
}
.to {
    --color: var(--color-dodger-blue);
    color: hsl(var(--color));
    display: inline-block;
    margin: 0 12px;
}
.arrow {
    --color: var(--color-grey88);
    color:  hsl(var(--color));
}
.file {
    --color: var(--color-greyA2);
    color: hsl( var(--color) );
    line-height: 1.6;
}
.file > span {
    display: inline-block;
}
.function {
    --color: 0, 0%, 70%;
    color: var(--color);
}
.refs {
    --color: var(--color-white);
    display: inline-block;
    color: var(--color);
}
[aria-type="click"] {
    --color: var(--color-dark);
    --bg-color: var(--color-yellow);
    --opacity: 1;
}
[aria-type="triggered"] {
    --color: var(--color-white);
    --bg-color: var(--color-blue-jeans);
    --opacity: .5;
}
[aria-type="opened"] {
    --bg-color: var(--color-slate-blue);
    --opacity: 1;
}
[aria-type="closed"] {
    --bg-color: var(--color-ultra-red);
    --opacity: 1;
}
[aria-type="error"] {
    --color: var(--color-white);
    --bg-color: var(--color-red);
    --opacity: 1;
}
[aria-type="warning"] {
    --color: var(--color-white);
    --bg-color: var(--color-deep-saffron);
    --opacity: 1;
}
[aria-type="checked"] {
    --color: var(--color-dark);
    --bg-color: var(--color-blue-jeans);
    --opacity: 1;
}
[aria-type="unchecked"] {
    --bg-color: var(--color-blue-jeans);
    --opacity: .3;
}
[aria-type="selected"] {
    --color: var(--color-dark);
    --bg-color: var(--color-lime-green);
    --opacity: 1;
}
[aria-type="unselected"] {
    --bg-color: var(--color-lime-green);
    --opacity: .25;
}
[aria-type="changed"] {
    --color: var(--color-dark);
    --bg-color: var(--color-safety-orange);
    --opacity: 1;
}
[aria-type="expanded"] {
    --bg-color: var(--color-electric-violet);
    --opacity: 1;
}
[aria-type="collapsed"] {
    --bg-color: var(--color-heliotrope);
    --opacity: 1;
}
i-logs .list:last-child .type {}
i-logs .list:last-child .arrow {
    --color: var(--color-white);
}
i-logs .list:last-child .to {
    --color: var(--color-blue-jeans);
}
i-logs .list:last-child .file {
    --color: var(--color-white);
}
i-logs .list:last-child [aria-type="ready"] {
    --bg-color: var(--color-deep-black);
    --opacity: 0.3;
}
i-logs .list:last-child .function {
    --color: var(--color-white);
}
[aria-label="comfortable"] .list[aria-expanded="false"] .logs {
    
}
[aria-label="comfortable"] .data {
    display: block;
    padding: 8px 8px 0px 8px;
}
[aria-label="comfortable"] .list[aria-expanded="false"] .data {
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis; 
}
[aria-label="comfortable"] .list[aria-expanded="false"] .refs {
    display: none;
}
[aria-label="comfortable"] .list[aria-expanded="true"] .refs {
    display: block;
    padding-left: 8px;
}
mark {
    --mark: var(--color-light-green);
    background-color: hsl(var(--mark));
}
mark.current {
    --mark: var(--color-orange);
}
/* for smart device */
@media (max-width: 960px) {
    [aria-label="compact"] .list[aria-expanded="false"] .logs {
        width: 100vw;
    }
    [aria-label="compact"] .list[aria-expanded="false"] .list {
        width: 100vw;
    }
}
`
},{"bel":4,"datdot-ui-button":30,"footer":25,"generator-color":26,"make-grid":27,"message-maker":28,"support-style-sheet":29}],25:[function(require,module,exports){
const bel = require('bel')
const style_sheet = require('support-style-sheet')
const {i_button} = require('datdot-ui-button')
const i_dropdown = require('datdot-ui-dropdown')
const message_maker = require('message-maker')
const make_grid = require('./make-grid')

var id = 0

module.exports = footer

function footer (opts = {}, parent_protocol) {
// ---------------------------------------------------------------
const myaddress = `footer-${id++}` // unique
const inbox = {}
const outbox = {}
const recipients = {}
const message_id = to => ( outbox[to] = 1 + (outbox[to]||0) )

const {notify, address} = parent_protocol(myaddress, listen)
recipients['parent'] = { notify, address, make: message_maker(myaddress) }

let make = message_maker(myaddress) // @TODO: replace flow with myaddress/myaddress
let message = make({to: address, type: 'ready', data: {}})
notify(message)

function listen (msg) {
    const {head, refs, type, data, meta } = msg
    inbox[head.join('/')] = msg                  // store msg
    const [from, to, msg_id] = head
    if (type.match(/ready|click|changed|selected|unselected/)) notify(msg)
    if (type === 'messages-count') return num.textContent = data
    if (type === 'click') return click_event (msg)
}

function make_protocol (name) {
    return function protocol (address, notify) {
        recipients[name] = { address, notify, make: message_maker(myaddress) }
        return { notify: listen, address: myaddress }
    }
}
// ---------------------------------------------------------------
    const {flow = 'i-footer', name, theme = {}} = opts

    function widget () {
        const footer = document.createElement('i-footer')
        const shadow = footer.attachShadow({mode: 'closed'})
        footer.setAttribute('aria-label', `${name}-footer`)
        style_sheet(shadow, style)
        const theme_option = {
            message: {
                size: 'var(--size12)',
            },
            button: {
                padding: '2px 4px',
                border_radius: '0',
            }
        }
        const filter = bel`<input class="filter" type='text' name='filter' placeholder='Filter' aria-label='search filter'>`
        const clear = i_button({
            name: 'clear-filter',
            icons: {
                icon: {name: 'cross'}
            },
            theme: {
                props: {
                    icon_fill: 'var(--color-grey66)',
                    icon_fill_hover: 'var(--color-white)',
                    bg_color: 'var(--color-greyD9)',
                    bg_color_hover: 'var(--primary-bg-color-hover)',
                    border_width: '0',
                    border_radius: '50%',
                    icon_size: '9px',
                    icon_size_hover: '9px',
                    width: '12px',
                    height: '12px',
                    padding: '4px'
                }
            }
        }, make_protocol('clear-filter'))
        const search = bel`<div class="search">${filter}${clear}</div>`
        const expanded = i_button(
        {
            name: 'expanded', 
            body: 'Collapsed', 
            role: 'switch',
            theme: {
                props: {
                    ...theme_option.button
                }
            }
        }, make_protocol('expanded'))

        // option for terminal-selector 
        const terminal_option = 
        {
            name: 'terminal',
            mode : 'single-select',
            expanded: false,
            options: {
                button: {
                    theme: {
                        props: {
                            border_radius: '0',
                            padding: '2px 4px',
                        }
                    }
                },
                list: {
                    direction: 'up',
                    array: [
                        {
                            text: 'Compact messages'
                        },
                        {
                            text: 'Comfortable messages',
                        }
                    ],
                    theme: {
                        grid: {
                            button: {
                                auto: {
                                    auto_flow: 'column'
                                },
                                justify: 'content-left',
                                gap: '5px'
                            }
                        }
                    }
                }
            }
        }

        const terminal_selector = i_dropdown(terminal_option, make_protocol(terminal_option.name))
        const num = bel`<span>0</span>`
        const total = bel`<span class="total">All messages: ${num}</span>`
        const actions = bel`<div class="actions">${search}${terminal_selector}${expanded}</div>`
        shadow.append(total, actions)
        filter.addEventListener('keyup', handle_keyup_event)
        // to prevent fullsrceen event from fullscreen.js
        filter.addEventListener('keydown', (event) => event.stopPropagation())
        return footer

        function handle_keyup_event (e) {
            const key = e.which || e.keyCode || e.keyCodeAt
            // if (key === 8) return
            let letter = e.target.value.toLowerCase()
            return notify(make({ to: address, type: 'search-filter', data: {letter} }))
        }

        // handle events
        function switch_event (from, data) {
            const state = !data
            const text = state ? 'Expanded' : 'Collapsed'
            const to = recipients[from].address
            recipients[from].notify(recipients[from].make({ to, type: 'switched', data: state}))
            recipients[from].notify(recipients[from].make({to, type: 'changed', data: {text}}))
            recipients[from].notify(recipients[from].make({to, type: 'triggered', data: {checked: state}}) )
            recipients[from].notify(recipients[from].make({to, type: 'layout-mode', data: {expanded: state}}))
        }

        function selector_event (from, data) {
            const dropdowns = actions.querySelectorAll('i-dropdown')
            const state = data.expanded
            const type = state ? 'expanded' : 'collapsed'
            const to = recipients[from].address
            recipients[from].notify(recipients[from].make({to, type, data: {from, expanded: state}}) )
            dropdowns.forEach( item => {
                const name = item.getAttribute('aria-label')
                item.style.zIndex = '99'
                if (name !== from) {
                    recipients[name].notify(recipients[name].make({to: recipients[name].address, type: 'collapsed', data: {name, expanded: false}}) )
                    item.removeAttribute('style')
                }
            })
        }
        function clear_input_event () {
            if (filter.value === '') return
            filter.value = ''
            notify(make({to: address, type: 'cleared-search', data: ''}))
        }
        function click_event (msg) {
            const { head, data } = msg
            const [from, to, msg_id] = msg
            if (from === 'switch') return switch_event(from, data)
            if (from === 'listbox') return selector_event(from, data)
            if (from === 'clear-filter') return clear_input_event()
        }   
    }
    
    const style = `
    :host(i-footer) {
        --size: var(--size12);
        --color: var(--color-white);
        --bg-color: var(--color-dark);
        display: grid;
        font-size: var(--size);
        color: hsl(var(--color));
        background-color: hsl(var(--bg-color));
        ${make_grid({
            areas: ['actions total'],
        })}
        max-width: 100%;
    }
    .actions {
        grid-area: actions;
        display: grid;
        ${make_grid({
            rows: 'minmax(0, 30px) auto',
            columns: 'minmax(0, 200px) minmax(0, 175px) minmax(auto, 100px) 1fr',
            gap: '6px'
        })}
        padding: 6px;
    }
    .total {
        grid-area: total;
        ${make_grid({
            justify: 'self-right',
            align: 'self-center'
        })}
        padding: 0 12px;
    }
    .search {
        --bg-color: var(--color-white);
        display: grid;
        ${make_grid({
            columns: 'minmax(0, auto) 24px',
            align: 'items-center'
        })}
        background-color: hsl(var(--bg-color));
    }
    .search i-button {
        opacity: 0;
        transition: opacity .3s linear;
    }
    .search .filter:focus ~ i-button {
        opacity: 1;
    }
    .filter {
        border: none;
    }
    
    .filter:focus {
        outline: none;
    }
    .status {
        grid-area: status;
        padding: 0 8px 8px;
    }
    @media only screen and (max-width: 640px) {
        :host(i-footer) {
            ${make_grid({
                areas: ['total', 'actions'],
            })}
        }
        .total {
            ${make_grid({
                justify: 'self-left'
            })}
        }
    }
    `
    return widget()
}
},{"./make-grid":27,"bel":4,"datdot-ui-button":30,"datdot-ui-dropdown":37,"message-maker":28,"support-style-sheet":29}],26:[function(require,module,exports){
 module.exports = {int2hsla, str2hashint}
 function int2hsla (i) { return `hsla(${i % 360}, 100%, 70%, 1)` }
 function str2hashint (str) {
     let hash = 0
     const arr = str.split('')
     arr.forEach( (v, i) => {
         hash = str.charCodeAt(i) + ((hash << 5) - hash)
     })
     return hash
 }
},{}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
module.exports = function message_maker (from) {
    let msg_id = 0
    return function make ({to, type, data = null, refs = {} }) {
        const stack = (new Error().stack.split('\n').slice(2).filter(x => x.trim()))
        return { head: [from, to, msg_id++], refs, type, data, meta: { stack }}
    }
  }
},{}],29:[function(require,module,exports){
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
},{}],30:[function(require,module,exports){
const style_sheet = require('support-style-sheet')
const message_maker = require('message-maker')
const make_img = require('make-image')
const make_element = require('make-element')
const {main_icon, select_icon, list_icon} = require('make-icon')
const make_grid = require('make-grid')

module.exports = {i_button, i_link}

var link_id = 0

function i_link (opt, parent_protocol) {
// ---------------------------------------------------------------
const myaddress = `button-${link_id++}` // unique
const inbox = {}
const outbox = {}
const recipients = {}
const message_id = to => ( outbox[to] = 1 + (outbox[to]||0) )

const {notify, address} = parent_protocol(myaddress, listen)
recipients['parent'] = { notify, address, make: message_maker(myaddress) }

let make = message_maker(myaddress) // @TODO: replace flow with myaddress/myaddress
let message = make({to: address, type: 'ready', data: {}})
notify(message)

function listen (msg) {
    const {head, refs, type, data, meta } = msg
    inbox[head.join('/')] = msg                  // store msg
    const [from, to, msg_id] = head


}

function make_protocol (name) {
    return function protocol (address, notify) {
        recipients[name] = { address, notify, make: message_maker(myaddress) }
        return { notify: listen, address: myaddress }
    }
}
// ---------------------------------------------------------------
    const {page = '*', flow = 'ui-link', name, role='link', body, link = {}, icons = {}, classlist, cover, disabled = false, theme = {}} = opt
    const { icon } = icons
    const make_icon = 'icon' in icons ? main_icon(icon) : undefined
    let {url = '#', target = '_self'} = link
    let is_disabled = disabled

    function widget () {
        const el = make_element({name: 'i-link', role})
        const shadow = el.attachShadow({mode: 'closed'})
        const text = make_element({name: 'span', classlist: 'text'})
        const avatar = make_element({name: 'span', classlist: 'avatar'})
        text.append(body)
        el.setAttribute('aria-label', body)
        el.setAttribute('href', url)
        if (is_disabled) set_attr ({aria: 'disabled', prop: is_disabled})
        if (!target.match(/self/)) el.setAttribute('target', target)
        if (classlist) el.classList.add(classlist)
        style_sheet(shadow, style)
        // check icon, cover and body if has value
        const add_cover = typeof cover === 'string' ? avatar : undefined
        const add_icon = icon ? make_icon : undefined
        const add_text = body ? typeof body === 'string' && (add_icon || add_cover ) ? text : body : typeof body === 'object' && body.localName === 'div' ? body : undefined
        if (typeof cover === 'string') avatar.append(make_img({src: cover, alt: name}))
        if (typeof cover === 'object') notify(make({ to: address, type: 'error', data: `cover[${typeof cover}] must to be a string`}))
        if (add_icon) shadow.append(make_icon)
        if (add_cover) shadow.append(add_cover)
        if (add_text) shadow.append(add_text)
        if (!is_disabled) el.onclick = handle_open_link
        return el

        function set_attr ({aria, prop}) {
            el.setAttribute(`aria-${aria}`, prop)
        }
    
        function handle_open_link () {
            if (target.match(/_/)) {
                window.open(url, target)
            }
            if (target.match(/#/) && target.length > 1) {
                const el = document.querySelector(target)
                el.src = url
            }
            notify(make({to: address, type: 'go to', data: {url, window: target}}))
        }

        // protocol get msg
        function get (msg) {
            const { head, refs, type, data } = msg
        }

    }

    // insert CSS style
    const custom_style = theme ? theme.style : ''
    // set CSS variables
    const {props = {}, grid = {}} = theme
    const {
        // default        
        padding, margin, width, height, opacity,
        // size
        size, size_hover, disabled_size,
        // weight
        weight, weight_hover, disabled_weight,
        // color
        color, color_hover, color_focus, disabled_color,
        // background-color    
        bg_color, bg_color_hover, disabled_bg_color,
        // deco
        deco, deco_hover, disabled_deco,
        // border
        border_width, border_style, border_opacity, 
        border_color, border_color_hover, border_radius,
        // shadowbox
        shadow_color, shadow_color_hover,
        offset_x, offset_y, offset_x_hover, offset_y_hover, 
        blur, blur_hover, shadow_opacity, shadow_opacity_hover,
        // icon
        icon_size, icon_size_hover, disabled_icon_size,
        icon_fill, icon_fill_hover, disabled_icon_fill,
        // avatar
        avatar_width, avatar_height, avatar_radius, 
        avatar_width_hover, avatar_height_hover,
        scale, scale_hover
    } = props

    const grid_link = grid.link ? grid.link : {auto: {auto_flow: 'column'}, align: 'items-center', gap: '4px'}
    const style = `
    :host(i-link) {
        --size: ${size ? size : 'var(--link-size)'};
        --weight: ${weight ? weight : 'var(--weight300)'};
        --color: ${color ? color : 'var(--link-color)'};
        --color-focus: ${color_focus ? color_focus : 'var(--link-color-focus)'};
        --bg-color: ${bg_color ? bg_color : 'var(--link-bg-color)'};
        --opacity: ${opacity ? opacity : '0'};
        --deco: ${deco ? deco : 'none'};
        --padding: ${padding ? padding : '0'};
        --margin: ${margin ? margin : '0'};
        --icon-size: ${icon_size ? icon_size : 'var(--link-icon-size)'};
        display: inline-grid;
        font-size: var(--size);
        font-weight: var(--weight);
        color: hsl(var(--color));
        background-color: hsla(var(--bg-color), var(--opacity));
        text-decoration: var(--deco);
        padding: var(--padding);
        margin: var(--margin);
        transition: color .5s, background-color .5s, font-size .5s, font-weight .5s, opacity .5s ease-in-out;
        cursor: pointer;
        ${make_grid(grid_link)}
    }
    :host(i-link:hover) {
        --color: ${color_hover ? color_hover : 'var(--link-color-hover)'};
        --size: ${size_hover ? size_hover : 'var(--link-size-hover)'};
        --deco: ${deco_hover ? deco_hover : 'underline'};
        --bg-color: ${bg_color_hover ? bg_color_hover : 'var(--color-white)'};
        --opacity: ${opacity ? opacity : '0'};
        text-decoration: var(--deco);
    }
    :host(i-link:focus) {
        --color: ${color_focus ? color_focus : 'var(--link-color-focus)'};
    }
    :host(i-link) img {
        --scale: ${scale ? scale : '1'};
        width: 100%;
        height: 100%;
        transform: scale(var(--scale));
        transition: transform 0.3s linear;
        object-fit: cover;
        border-radius: var(--avatar-radius);
    }
    :host(i-link:hover) img {
        --scale: ${scale_hover ? scale_hover : '1.2'};
    }
    :host(i-link) svg {
        width: 100%;
        height: auto;
    }
    :host(i-link) g {
        --icon-fill: ${icon_fill ? icon_fill : 'var(--link-icon-fill)'};
        fill: hsl(var(--icon-fill));
        transition: fill 0.05s ease-in-out;
    }
    :host(i-link:hover) g, :host(i-link:hover) path{
        --icon-fill: ${icon_fill_hover ? icon_fill_hover : 'var(--link-icon-fill-hover)'};
    }
    :host(i-link) .text {
        ${make_grid(grid.text)}
    }
    :host(i-link) .icon {
        width: var(--icon-size);
        max-width: 100%;
        ${make_grid(grid.icon)}
    }
    :host(i-link:hover) .icon {
        --icon-size: ${icon_size_hover ? icon_size_hover : 'var(--link-icon-size)'};
    }
    :host(i-link) .avatar {
        --avatar-width: ${avatar_width ? avatar_width : 'var(--link-avatar-width)'};
        --avatar-height: ${avatar_height ? avatar_height : 'var(--link-avatar-height)'};
        --avatar-radius: ${avatar_radius ? avatar_radius : 'var(--link-avatar-radius)'};
        display: block;
        width: var(--avatar-width);
        height: var(--avatar-height);
        border-radius: var(--avatar-radius);
        -webkit-mask-image: -webkit-radial-gradient(center, white, black);
        max-width: 100%;
        max-height: 100%;
        ${make_grid(grid.avatar)}
        transition: width 0.2s, height 0.2s linear;
    }
    :host(i-link:hover) .avatar {
        --avatar-width: ${avatar_width_hover ? avatar_width_hover : 'var(--link-avatar-width-hover)'};
        --avatar-height: ${avatar_height_hover ? avatar_height_hover : 'var(--link-avatar-height-hover)'};
    }
    :host(i-link[role="menuitem"]) {
        --size: ${size ? size : 'var(--menu-size)'};
        --color: ${color ? color : 'var(--menu-color)'};
        --weight: ${weight ? weight : 'var(--menu-weight)'};
        background-color: transparent;
    }
    :host(i-link[role="menuitem"]:hover) {
        --size: ${size ? size : 'var(--menu-size-hover)'};
        --color: ${color_hover ? color_hover : 'var(--menu-color-hover)'};
        --weight: ${weight ? weight : 'var(--menu-weight-hover)'};
        text-decoration: none;
        background-color: transparent;
    }
    :host(i-link[role="menuitem"]:focus) {
        --color: var(--color-focus);
    }
    :host(i-link[role="menuitem"]) .icon {
        --icon-size: ${icon_size ? icon_size : 'var(--menu-icon-size)'};
    }
    :host(i-link[role="menuitem"]) g {
        --icon-fill: ${icon_fill ? icon_fill : 'var(--menu-icon-fill)'};
    }
    :host(i-link[role="menuitem"]:hover) g {
        --icon-fill: ${icon_fill_hover ? icon_fill_hover : 'var(--menu-icon-fill-hover)'};
    }
    :host(i-link[aria-disabled="true"]), :host(i-link[aria-disabled="true"]:hover) {
        --size: ${disabled_size ? disabled_size : 'var(--link-disabled-size)'};
        --color: ${disabled_color ? disabled_color : 'var(--link-disabled-color)'};
        text-decoration: none;
        cursor: not-allowed;
    }
    :host(i-link[disabled]) g,
    :host(i-link[disabled]) path,
    :host(i-link[disabled]:hover) g,
    :host(i-link[disabled]:hover) path,
    :host(i-link[role][disabled]) g,
    :host(i-link[role][disabled]) path,
    :host(i-link[role][disabled]:hover) g,
    :host(i-link[role][disabled]:hover) path
    {
        --icon-fill: ${disabled_icon_fill ? disabled_icon_fill : 'var(--link-disabled-icon-fill)'};
    }
    :host(i-link[disabled]) .avatar {
        opacity: 0.6;
    }
    :host(i-link.right) {
        flex-direction: row-reverse;
    }
    ${custom_style}
    `
    return widget()
}

















var id = 0

function i_button (opt, parent_protocol) {
 // ---------------------------------------------------------------
    const myaddress = `button-${id++}` // unique
    const inbox = {}
    const outbox = {}
    const recipients = {}
    const message_id = to => ( outbox[to] = 1 + (outbox[to]||0) )

    const {notify, address} = parent_protocol(myaddress, listen)
    recipients['parent'] = { notify, address, make: message_maker(myaddress) }

    let make = message_maker(myaddress) // @TODO: replace flow with myaddress/myaddress
    let message = make({to: address, type: 'ready', data: {}})
    notify(message)

    function listen (msg) {
        const {head, refs, type, data, meta } = msg
        inbox[head.join('/')] = msg                  // store msg
        const [from, to, msg_id] = head
        make_logs(msg)

        // toggle
        if (type.match(/switched/)) return switched_event(data)
        // dropdown
        if (type.match(/expanded/)) return expanded_event(data)
        if (type.match(/collapsed/)) return collapsed_event(data)
        // tab, checkbox
        if (type.match(/tab-selected/)) return tab_selected_event(data)
        // option
        if (type.match(/selected|unselected/)) return list_selected_event(data)
        if (type.match(/changed/)) return changed_event(data)
        if (type.match(/current/)) {
            is_current = data
            return set_attr({aria: 'current', prop: is_current})
        }

    }

    function make_protocol (name) {
        return function protocol (address, notify) {
            recipients[name] = { address, notify, make: message_maker(myaddress) }
            return { notify: listen, address: myaddress }
        }
    }
// ---------------------------------------------------------------

    const {page = "*", flow = 'ui-button', name, role = 'button', controls, body = '', icons = {}, cover, classlist = null, mode = '', state, expanded = undefined, current = undefined, selected = false, checked = false, disabled = false, theme = {}} = opt
    const {icon, select = {}, list = {}} = icons
    const make_icon = icon ? main_icon(icon) : undefined
    if (role === 'listbox') var make_select_icon = select_icon(select)
    if (role === 'option') var make_list_icon = list_icon(list)
    let is_current = current
    let is_checked = checked
    let is_disabled = disabled
    let is_selected = selected
    let is_expanded = 'expanded' in opt ? expanded : void 0

    function widget () {
        const el = make_element({name: 'i-button', classlist, role })
        const shadow = el.attachShadow({mode: 'closed'})
        const text = make_element({name: 'span', classlist: 'text'})
        const avatar = make_element({name: 'span', classlist: 'avatar'})
        const listbox = make_element({name: 'span', classlist: 'listbox'})
        const option = make_element({name: 'span', classlist: 'option'})
        // check icon, img and body if has value
        const add_cover = typeof cover === 'string' ? avatar : undefined
        const add_text = body ? typeof body === 'object' ? 'undefined' : text : undefined
        if (typeof cover === 'string') avatar.append(make_img({src: cover, alt: name}))
        if (typeof cover === 'object') notify(make({to: address, type: 'error', data: `cover[${typeof cover}] must to be a string`}))
        if (typeof body === 'object') notify(make({to: address, type: 'error', data: {body: `content is an ${typeof body}`, content: body }}))
        if (!is_disabled) el.onclick = handle_click
        el.setAttribute('aria-label', name)
        text.append(body)
        style_sheet(shadow, style)
        append_items()
        init_attr()
        return el

        function init_attr () {
            // define conditions
            if (state) set_attr({aria: 'aria-live', prop: 'assertive'})
            if (role === 'tab') {
                set_attr({aria: 'selected', prop: is_selected})
                set_attr({aria: 'controls', prop: controls})
                el.setAttribute('tabindex', is_current ? 0 : -1)
            }
            if (role === 'switch') {
                set_attr({aria: 'checked', prop: is_checked})
            }
            if (role === 'listbox') set_attr({aria: 'haspopup', prop: role})
            if (disabled) {
                set_attr({aria: 'disabled', prop: is_disabled})
                el.setAttribute('disabled', is_disabled)
            } 
            if (is_checked) set_attr({aria: 'checked', prop: is_checked})
            if (role.match(/option/)) {
                is_selected = is_current ? is_current : is_selected
                set_attr({aria: 'selected', prop: is_selected})
            }
            if (expanded !== undefined) {
                set_attr({aria: 'expanded', prop: is_expanded})
            }
            // make current status
            if (current !== undefined) set_attr({aria: 'current', prop: is_current})
        }

        function set_attr ({aria, prop}) {
            el.setAttribute(`aria-${aria}`, prop)
        }

        // make element to append into shadowDOM
        function append_items() {           
            const items = [make_icon, add_cover, add_text]
            const target = role === 'listbox' ? listbox : role === 'option' ?  option : shadow
            // list of listbox or dropdown menu
            if (role.match(/option/)) shadow.append(make_list_icon, option)
            // listbox or dropdown button
            if (role.match(/listbox/)) shadow.append(make_select_icon, listbox)
            items.forEach( item => {
                if (item === undefined) return
                target.append(item)
            })
        }

        // toggle
        function switched_event (data) {
            const {checked} = data
            is_checked = checked
            if (is_checked) return set_attr({aria: 'checked', prop: is_checked})
            else el.removeAttribute('aria-checked')
        }
        function expanded_event (data) {
            is_expanded = data
            set_attr({aria: 'expanded', prop: is_expanded})
        }
        function collapsed_event (data) {
            is_expanded = data
            set_attr({aria: 'expanded', prop: is_expanded})
        }
        // tab selected
        function tab_selected_event ({selected}) {
            is_selected = selected
            set_attr({aria: 'selected', prop: is_selected})
            el.setAttribute('tabindex', is_current ? 0 : -1)
        }
        function list_selected_event (state) {
            is_selected = state
            set_attr({aria: 'selected', prop: is_selected})
            if (mode === 'single-select') {
                is_current = is_selected
                set_attr({aria: 'current', prop: is_current})
            }
            // option is selected then send selected items to listbox button
            if (is_selected) notify(make({to: address, type: 'changed', data: {text: body, cover, icon} }))
        }
        function changed_event (data) {
            const {text, cover, icon, title} = data
            // new element
            const new_text = make_element({name: 'span', classlist: 'text'})
            const new_avatar = make_element({name: 'span', classlist: 'avatar'})
            // old element
            const old_icon = shadow.querySelector('.icon')
            const old_avatar = shadow.querySelector('.avatar')
            const old_text = shadow.querySelector('.text')
            // change content for button or switch or tab
            if (role.match(/button|switch|tab/)) {
                el.setAttribute('aria-label', text || title)
                if (text) {
                    if (old_text) old_text.textContent = text
                } else {
                    if (old_text) old_text.remove()
                }
                if (cover) {
                    if (old_avatar) {
                        const img = old_avatar.querySelector('img')
                        img.alt = text || title
                        img.src = cover
                    } else {
                        new_avatar.append(make_img({src: cover, alt: text || title}))
                        shadow.insertBefore(new_avatar, shadow.firstChild)
                    }
                } else {
                    if (old_avatar) old_avatar.remove()
                }
                if (icon) {
                    const new_icon = main_icon(icon)
                    if (old_icon) old_icon.parentNode.replaceChild(new_icon, old_icon)
                    else shadow.insertBefore(new_icon, shadow.firstChild)
                } else {
                    if (old_icon) old_icon.remove()
                }
            }
            // change content for listbox
            if (role.match(/listbox/)) {
                listbox.innerHTML = ''
                if (icon) {
                    const new_icon = main_icon(icon)
                    if (role.match(/listbox/)) listbox.append(new_icon)
                }
                if (cover) {
                    new_avatar.append(make_img({src: cover, alt: text}))
                    if (role.match(/listbox/)) listbox.append(new_avatar)
                }
                if (text) {
                    new_text.append(text)
                    if (role.match(/listbox/)) listbox.append(new_text)
                }
            } 
        }
        // button click
        function handle_click () {
            const type = 'click'
            if ('current' in opt) {
                notify(make({to: address, type: 'current', data: {name, current: is_current}}) )
            }
            if (expanded !== undefined) {
                const type = !is_expanded ? 'expanded' : 'collapsed'
                notify(make({to: address, type, data: {name, expanded: is_expanded}}))
            }
            if (role === 'button') {
                return notify(make({to: address, type, to: controls} ))
            }
            if (role === 'tab') {
                if (is_current) return
                is_selected = !is_selected
                return notify(make({to: address, type, data: {name, selected: is_selected}}) )
            }
            if (role === 'switch') {
                return notify(make({to: address, type, data: {name, checked: is_checked}}) )
            }
            if (role === 'listbox') {
                is_expanded = !is_expanded
                return notify(make({to: address, type, data: {name, expanded: is_expanded}}))
            }
            if (role === 'option') {
                is_selected = !is_selected
                return notify( make({to: address, type, data: {name, selected: is_selected, content: is_selected ? {text: body, cover, icon} : '' }}) )
            }
        }
    }
   
    // insert CSS style
    const custom_style = theme ? theme.style : ''
    // set CSS variables
    const {props = {}, grid = {}} = theme
    const {
        // default -----------------------------------------//
        padding, margin, width, height, opacity, 
        // size
        size, size_hover, 
        // weight
        weight, weight_hover, 
        // color
        color, color_hover, color_focus,
        // background-color
        bg_color, bg_color_hover, bg_color_focus,
        // border
        border_color, border_color_hover,
        border_width, border_style, border_opacity, border_radius, 
        // icon
        icon_fill, icon_fill_hover, icon_size, icon_size_hover,
        // avatar
        avatar_width, avatar_height, avatar_radius,
        avatar_width_hover, avatar_height_hover,
        // shadow
        shadow_color, shadow_color_hover, 
        offset_x, offset_x_hover,
        offset_y, offset_y_hover, 
        blur, blur_hover,
        shadow_opacity, shadow_opacity_hover,
        // scale
        scale, scale_hover,
        // current -----------------------------------------//
        current_size, 
        current_weight, 
        current_color, 
        current_bg_color,
        current_icon_size,
        current_icon_fill,
        current_list_selected_icon_size,
        current_list_selected_icon_fill,
        current_avatar_width, 
        current_avatar_height,
        // disabled -----------------------------------------//
        disabled_size, disabled_weight, disabled_color,
        disabled_bg_color, disabled_icon_fill, disabled_icon_size,
        // role === option ----------------------------------//
        list_selected_icon_size, list_selected_icon_size_hover,
        list_selected_icon_fill, list_selected_icon_fill_hover,
        // role === listbox ----------------------------------//
        // collapsed settings
        listbox_collapsed_bg_color, listbox_collapsed_bg_color_hover,
        listbox_collapsed_icon_size, listbox_collapsed_icon_size_hover,
        listbox_collapsed_icon_fill, listbox_collapsed_icon_fill_hover, 
        listbox_collapsed_listbox_color, listbox_collapsed_listbox_color_hover,
        listbox_collapsed_listbox_size, listbox_collapsed_listbox_size_hover,
        listbox_collapsed_listbox_weight, listbox_collapsed_listbox_weight_hover,
        listbox_collapsed_listbox_icon_size, listbox_collapsed_listbox_icon_size_hover,
        listbox_collapsed_listbox_icon_fill, listbox_collapsed_listbox_icon_fill_hover,
        listbox_collapsed_listbox_avatar_width, listbox_collapsed_listbox_avatar_height,
        // expanded settings
        listbox_expanded_bg_color,
        listbox_expanded_icon_size, 
        listbox_expanded_icon_fill,
        listbox_expanded_listbox_color,
        listbox_expanded_listbox_size, 
        listbox_expanded_listbox_weight,
        listbox_expanded_listbox_avatar_width, 
        listbox_expanded_listbox_avatar_height,
        listbox_expanded_listbox_icon_size, 
        listbox_expanded_listbox_icon_fill, 
    } = props

    const grid_init = {auto: {auto_flow: 'column'}, align: 'items-center', gap: '5px', justify: 'items-center'}
    const grid_option = grid.option ? grid.option : grid_init
    const grid_listbox = grid.listbox ? grid.listbox : grid_init
    const style = `
    :host(i-button) {
        --size: ${size ? size : 'var(--primary-size)'};
        --weight: ${weight ? weight : 'var(--weight300)'};
        --color: ${color ? color : 'var(--primary-color)'};
        --color-focus: ${color_focus ? color_focus : 'var(--primary-color-focus)'};
        --bg-color: ${bg_color ? bg_color : 'var(--primary-bg-color)'};
        --bg-color-focus: ${bg_color_focus ? bg_color_focus : 'var(--primary-bg-color-focus)'};
        ${width && `--width: ${width}`};
        ${height && `--height: ${height}`};
        --opacity: ${opacity ? opacity : '1'};
        --padding: ${padding ? padding : '12px'};
        --margin: ${margin ? margin : '0'};
        --border-width: ${border_width ? border_width : '0px'};
        --border-style: ${border_style ? border_style : 'solid'};
        --border-color: ${border_color ? border_color : 'var(--primary-color)'};
        --border-opacity: ${border_opacity ? border_opacity : '1'};
        --border: var(--border-width) var(--border-style) hsla( var(--border-color), var(--border-opacity) );
        --border-radius: ${border_radius ? border_radius : 'var(--primary-radius)'};
        --offset_x: ${offset_x ? offset_x : '0px'};
        --offset-y: ${offset_y ? offset_y : '6px'};
        --blur: ${blur ? blur : '30px'};
        --shadow-color: ${shadow_color ? shadow_color : 'var(--primary-color)'};
        --shadow-opacity: ${shadow_opacity ? shadow_opacity : '0'};
        --box-shadow: var(--offset_x) var(--offset-y) var(--blur) hsla( var(--shadow-color), var(--shadow-opacity) );
        --avatar-width: ${avatar_width ? avatar_width : 'var(--primary-avatar-width)'};
        --avatar-height: ${avatar_height ? avatar_height : 'var(--primary-avatar-height)'};
        --avatar-radius: ${avatar_radius ? avatar_radius : 'var(--primary-avatar-radius)'};
        display: inline-grid;
        ${grid.button ? make_grid(grid.button) : make_grid({auto: {auto_flow: 'column'}, gap: '5px', justify: 'content-center', align: 'items-center'})}
        ${width && 'width: var(--width);'};
        ${height && 'height: var(--height);'};
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
        --size: ${size_hover ? size_hover : 'var(--primary-size-hover)'};
        --weight: ${weight_hover ? weight_hover : 'var(--primary-weight-hover)'};
        --color: ${color_hover ? color_hover : 'var(--primary-color-hover)'};
        --bg-color: ${bg_color_hover ? bg_color_hover : 'var(--primary-bg-color-hover)'};
        --border-color: ${border_color_hover ? border_color_hover : 'var(--primary-color-hover)'};
        --offset-x: ${offset_x_hover ? offset_x_hover : '0'};
        --offset-y: ${offset_y_hover ? offset_y_hover : '0'};
        --blur: ${blur_hover ? blur_hover : '50px'};
        --shadow-color: ${shadow_color_hover ? shadow_color_hover : 'var(--primary-color-hover)'};
        --shadow-opacity: ${shadow_opacity_hover ? shadow_opacity_hover : '0'};
    }
    :host(i-button:hover:foucs:active) {
        --bg-color: ${bg_color ? bg_color : 'var(--primary-bg-color)'};
    }
    :host(i-button:focus) {
        --color: var(--color-focus);
        --bg-color: var(--bg-color-focus);
        background-color: hsla(var(--bg-color));
    }  
    :host(i-button) g {
        --icon-fill: ${icon_fill ? icon_fill : 'var(--primary-icon-fill)'};
        fill: hsl(var(--icon-fill));
        transition: fill 0.05s ease-in-out;
    }
    :host(i-button:hover) g {
        --icon-fill: ${icon_fill_hover ? icon_fill_hover : 'var(--primary-icon-fill-hover)'};
    }
    :host(i-button) .avatar {
        display: block;
        width: var(--avatar-width);
        height: var(--avatar-height);
        max-width: 100%;
        border-radius: var(--avatar-radius);
        -webkit-mask-image: -webkit-radial-gradient(white, black);
        overflow: hidden;
        transition: width .3s, height .3s ease-in-out;
        ${make_grid(grid.avatar)}
    }
    :host(i-button) img {
        --scale: ${scale ? scale : '1'};
        width: 100%;
        height: 100%;
        transform: scale(var(--scale));
        transition: transform 0.3s, scale 0.3s linear;
        object-fit: cover;
        border-radius: var(--avatar-radius);
    }
    :host(i-button:hover) img {
        --scale: ${scale_hover ? scale_hover : '1.2'};
        transform: scale(var(--scale));
    }
    :host(i-button) svg {
        width: 100%;
        height: auto;
    }
    :host(i-button[aria-expanded="true"]:focus) {
        --color: var(--color-focus);
        --bg-color: var(--bg-color-focus);
    } 
    :host(i-button[role="tab"]) {
        --width: ${width ? width : '100%'};
        --border-radius: ${border_radius ? border_radius : '0'};
    }
    :host(i-button[role="switch"]) {
        --size: ${size ? size : 'var(--primary-size)'};
    }
    :host(i-button[role="switch"]:hover) {
        --size: ${size_hover ? size_hover : 'var(--primary-size-hover)'};
    }
    :host(i-button[role="switch"]:focus) {
        --color: var(--color-focus);
        --bg-color: var(--bg-color-focus);
    }
    :host(i-button[role="listbox"]) {
        --color: ${listbox_collapsed_listbox_color ? listbox_collapsed_listbox_color : 'var(--listbox-collapsed-listbox-color)'};
        --size: ${listbox_collapsed_listbox_size ? listbox_collapsed_listbox_size : 'var(--listbox-collapsed-listbox-size)'};
        --weight: ${listbox_collapsed_listbox_weight ? listbox_collapsed_listbox_weight : 'var(--listbox-collapsed-listbox-weight)'};
        --bg-color: ${listbox_collapsed_bg_color ? listbox_collapsed_bg_color : 'var(--listbox-collapsed-bg-color)'};
    }
    :host(i-button[role="listbox"]:hover) {
        --color: ${listbox_collapsed_listbox_color_hover ? listbox_collapsed_listbox_color_hover : 'var(--listbox-collapsed-listbox-color-hover)'};
        --size: ${listbox_collapsed_listbox_size_hover ? listbox_collapsed_listbox_size_hover : 'var(--listbox-collapsed-listbox-size-hover)'};
        --weight: ${listbox_collapsed_listbox_weight_hover ? listbox_collapsed_listbox_weight_hover : 'var(--listbox-collapsed-listbox-weight-hover)'};
        --bg-color: ${listbox_collapsed_bg_color_hover ? listbox_collapsed_bg_color_hover : 'var(--listbox-collapsed-bg-color-hover)'};
    }
    :host(i-button[role="listbox"]:focus), :host(i-button[role="listbox"][aria-expanded="true"]:focus) {
        --color: var(--color-focus);
        --bg-color: var(--bg-color-focus);
    }
    :host(i-button[role="listbox"]) > .icon {
        ${grid.icon ? make_grid(grid.icon) : make_grid({column: '2'})}
    }
    :host(i-button[role="listbox"]) .text {}
    :host(i-button[role="listbox"]) .avatar {
        --avatar-width: ${listbox_collapsed_listbox_avatar_width ? listbox_collapsed_listbox_avatar_width : 'var(--listbox-collapsed-listbox-avatar-width)'};
        --avatar-height: ${listbox_collapsed_listbox_avatar_height ? listbox_collapsed_listbox_avatar_height : 'var(--listbox-collapsed-listbox-avatar-height)'}
    }
    :host(i-button[role="listbox"][aria-expanded="true"]),
    :host(i-button[role="listbox"][aria-expanded="true"]:hover) {
        --size: ${listbox_expanded_listbox_size ? listbox_expanded_listbox_size : 'var(--listbox-expanded-listbox-size)'};
        --color: ${listbox_expanded_listbox_color ? listbox_expanded_listbox_color : 'var(--listbox-expanded-listbox-color)'};
        --weight: ${listbox_expanded_listbox_weight ? listbox_expanded_listbox_weight : 'var(--listbox-expanded-listbox-weight)'};
        --bg-color: ${listbox_expanded_bg_color ? listbox_expanded_bg_color : 'var(--listbox-expanded-bg-color)'}
    }
    :host(i-button[role="listbox"][aria-expanded="true"]) .avatar {
        --avatar-width: ${listbox_expanded_listbox_avatar_width ? listbox_expanded_listbox_avatar_width : 'var(--listbox-expanded-listbox-avatar-width)'};
        --avatar-height: ${listbox_expanded_listbox_avatar_height ? listbox_expanded_listbox_avatar_height : 'var(--listbox-expanded-listbox-avatar-height)'};
    }
    :host(i-button[role="option"]) {
        --border-radius: ${border_radius ? border_radius : '0'};
        --opacity: ${opacity ? opacity : '0'};
    }
    :host(i-button[role="option"][aria-current="true"]), :host(i-button[role="option"][aria-current="true"]:hover) {
        --size: ${current_size ? current_size : 'var(--current-list-size)'};
        --color: ${current_color ? current_color : 'var(--current-list-color)'};
        --bg-color: ${current_bg_color ? current_bg_color : 'var(--current-list-bg-color)'};
        --opacity: ${opacity ? opacity : '0'}
    }
    :host(i-button[role="option"][aria-current="true"]:focus) {
        --color: var(--color-focus);
        --bg-color: var(--bg-color-focus);
    }
    :host(i-button[role="option"][disabled]), :host(i-button[role="option"][disabled]:hover) {
        --size: ${disabled_size ? disabled_size : 'var(--primary-disabled-size)'};
        --color: ${disabled_color ? disabled_color : 'var(--primary-disabled-color)'};
        --bg-color: ${disabled_bg_color ? disabled_bg_color : 'var(--primary-disabled-bg-color)'};
        --opacity: ${opacity ? opacity : '0'}
    }
    :host(i-button[aria-disabled="true"]) .icon, 
    :host(i-button[aria-disabled="true"]:hover) .icon,
    :host(i-button[role="option"][aria-disabled="true"]) .icon, 
    :host(i-button[role="option"][aria-disabled="true"]:hover) .icon,
    :host(i-button[role="listbox"][aria-disabled="true"]) .icon, 
    :host(i-button[role="listbox"][aria-disabled="true"]:hover) .icon {
        --icon-size: ${disabled_icon_size ? disabled_icon_size : 'var(--primary-disabled-icon-size)'};
    }
    :host(i-button[disabled]:hover) img {
        transform: scale(1);
    }
    :host(i-button[aria-current="true"]), :host(i-button[aria-current="true"]:hover) {
        --size: ${current_size ? current_size : 'var(--current-size)'};
        --weight: ${current_weight ? current_weight : 'var(--current-weight)'};
        --color: ${current_color ? current_color : 'var(--current-color)'};
        --bg-color: ${current_bg_color ? current_bg_color : 'var(--current-bg-color)'};
    }
    :host(i-button[aria-current="true"]) .icon,  :host(i-button[aria-current="true"]:hover) .icon {
        --icon-size: ${current_icon_size ? current_icon_size : 'var(--current-icon-size)'};
    }
    :host(i-button[aria-current="true"]) g {
        --icon-fill: ${current_icon_fill ? current_icon_fill : 'var(--current-icon-fill)'};
    }
    :host(i-button[aria-current="true"]:focus) {
        --color: var(--color-focus);
        --bg-color: var(--bg-color-focus);
    }
    :host(i-button[role="option"][aria-current="true"][aria-selected="true"]) .option > .icon, 
    :host(i-button[role="option"][aria-current="true"][aria-selected="true"]:hover) .option > .icon {
        --icon-size: ${current_icon_size ? current_icon_size : 'var(--current-icon-size)'};
    }
    :host(i-button[aria-checked="true"]), :host(i-button[aria-expanded="true"]),
    :host(i-button[aria-checked="true"]:hover), :host(i-button[aria-expanded="true"]:hover) {
        --size: ${current_size ? current_size : 'var(--current-size)'};
        --weight: ${current_weight ? current_weight : 'var(--current-weight)'};
        --color: ${current_color ? current_color : 'var(--current-color)'};
        --bg-color: ${current_bg_color ? current_bg_color : 'var(--current-bg-color)'};
    }
    /*
    :host(i-button[role="switch"][aria-expanded="true"]) g {
        --icon-fill: var(--current-icon-fill);
    }*/
    /* listbox collapsed */
    :host(i-button[role="listbox"]) > .icon {
        --icon-size: ${listbox_collapsed_icon_size ? listbox_collapsed_icon_size : 'var(--listbox-collapsed-icon-size)'};
    }
    :host(i-button[role="listbox"]:hover) > .icon {
        --icon-size: ${listbox_collapsed_icon_size_hover ? listbox_collapsed_icon_size_hover : 'var(--listbox-collapsed-icon-size-hover)'};
    }
    :host(i-button[role="listbox"]) .listbox > .icon {
        --icon-size: ${listbox_collapsed_listbox_icon_size ? listbox_collapsed_listbox_icon_size : 'var(--listbox-collapsed-listbox-icon-size)'};
    }
    :host(i-button[role="listbox"]:hover) .listbox > .icon {
        --icon-size: ${listbox_collapsed_listbox_icon_size_hover ? listbox_collapsed_listbox_icon_size_hover : 'var(--listbox-collapsed-listbox-icon-size-hover)'};
    }
    :host(i-button[role="listbox"]) > .icon g {
        --icon-fill: ${listbox_collapsed_icon_fill ? listbox_collapsed_icon_fill : 'var(--listbox-collapsed-icon-fill)'};
    }
    :host(i-button[role="listbox"]:hover) > .icon g {
        --icon-fill: ${listbox_collapsed_icon_fill_hover ? listbox_collapsed_icon_fill_hover : 'var(--listbox-collapsed-icon-fill-hover)'};
    }
    :host(i-button[role="listbox"]) .listbox > .icon g {
        --icon-fill: ${listbox_collapsed_listbox_icon_fill ? listbox_collapsed_listbox_icon_fill : 'var(--listbox-collaps-listbox-icon-fill)'};
    }
    :host(i-button[role="listbox"]:hover) .listbox > .icon g {
        --icon-fill: ${listbox_collapsed_listbox_icon_fill_hover ? listbox_collapsed_listbox_icon_fill_hover : 'var(--listbox-collapsed-listbox-icon-fill-hover)'};
    }
    /* listbox expanded */
    :host(i-button[role="listbox"][aria-expanded="true"]) > .icon,
    :host(i-button[role="listbox"][aria-expanded="true"]:hover) > .icon {
        --icon-size: ${listbox_expanded_icon_size ? listbox_expanded_icon_size : 'var(--listbox-expanded-icon-size)'};
    }
    :host(i-button[role="listbox"][aria-expanded="true"]) > .icon g, 
    :host(i-button[role="listbox"][aria-expanded="true"]:hover) > .icon g {
        --icon-fill: ${listbox_expanded_icon_fill ? listbox_expanded_icon_fill : 'var(--listbox-expanded-icon-fill)'}
    }
    :host(i-button[role="listbox"][aria-expanded="true"]) .listbox > .icon, 
    :host(i-button[role="listbox"][aria-expanded="true"]:hover) .listbox > .icon {
        --icon-fill: ${listbox_expanded_listbox_icon_size ? listbox_expanded_listbox_icon_size : 'var(--listbox-expanded-listbox-icon-size)'};
    }
    :host(i-button[role="listbox"][aria-expanded="true"]) .listbox > .icon g,
    :host(i-button[role="listbox"][aria-expanded="true"]:hover) .listbox > .icon g {
        --icon-fill: ${listbox_expanded_listbox_icon_fill ? listbox_expanded_listbox_icon_fill : 'var(--listbox-expanded-listbox-icon-fill)'};
    }
    :host(i-button[aria-checked="true"]) > .icon g {
        --icon-fill: ${current_icon_fill ? current_icon_fill : 'var(--color-white)' };
    }
    :host(i-button[disabled]), :host(i-button[disabled]:hover) {
        --size: ${disabled_size ? disabled_size : 'var(--primary-disabled-size)'};
        --color: ${disabled_color ? disabled_color : 'var(--primary-disabled-color)'};
        --bg-color: ${disabled_bg_color ? disabled_bg_color : 'var(--primary-disabled-bg-color)'};
        cursor: not-allowed;
    }
    :host(i-button[disabled]) g, 
    :host(i-button[disabled]:hover) g, 
    :host(i-button[role="option"][disabled]) > .icon g, 
    :host(i-button[role="option"][disabled]) .option > .icon g,
    :host(i-button[role="listbox"][disabled]) .option > .icon g, 
    :host(i-button[role="option"][disabled]:hover) > .icon g,
    :host(i-button[role="listbox"][disabled]:hover) .option > .icon g, 
    :host(i-button[role="option"][disabled]:hover) .option > .icon g {
        --icon-fill: ${disabled_color ? disabled_color : 'var(--primary-disabled-icon-fill)'};
    }
    :host(i-button[role="menuitem"]) {
        --size: ${size ? size : 'var(--menu-size)'};
        --weight: ${weight ? weight : 'var(--menu-weight)'};
        --color: ${color ? color : 'var(--menu-color)'};
        --border-radius: 0;
        background-color: transparent;
    }
    :host(i-button[role="menuitem"]:hover) {
        --size: ${size_hover ? size_hover : 'var(--menu-size-hover)'};
        --weight: ${weight_hover ? weight_hover : 'var(--menu-weight-hover)'};
        --color: ${color_hover ? color_hover : 'var(--menu-color-hover)'};
    }
    :host(i-button[role="menuitem"]:focus) {
        --color: var(--color-focus);
        --bg-color: var(--bg-color-focus);
    }
    :host(i-button[role="menuitem"]) .avatar {
        --avatar-width: ${avatar_width ? avatar_width : 'var(--menu-avatar-width)'};
        --avatar-height: ${avatar_height ? avatar_height : 'var(--menu-avatar-height)'};
        --avatar-radius: ${avatar_radius ? avatar_radius : 'var(--menu-avatar-radius)'};
    }
    :host(i-button[role="menuitem"]:hover) .avatar {
        --avatar-width: ${avatar_width_hover ? avatar_width_hover : 'var(--menu-avatar-width-hover)'};
        --avatar-height: ${avatar_height_hover ? avatar_height_hover : 'var(--menu-avatar-height-hover)'};
    }
    :host(i-button[role="menuitem"][disabled]), :host(i-button[role="menuitem"][disabled]):hover {
        --size: ${disabled_size ? disabled_size : 'var(--menu-disabled-size)'};
        --color: ${disabled_color ? disabled_color : 'var(--menu-disabled-color)'};
        --weight: ${disabled_weight ? disabled_weight : 'var(--menu-disabled-weight)'};
    }
    :host(i-button[role="menuitem"][disabled]) g ,
    :host(i-button[role="menuitem"][disabled]:hover) g {
        --icon-fill: ${disabled_icon_fill ? disabled_icon_fill : 'var(--primary-disabled-icon-fill)'};
    }
    :host(i-button[role="option"]) > .icon {
        --icon-size: ${list_selected_icon_size ? list_selected_icon_size : 'var(--list-selected-icon-size)'};
    }
    :host(i-button[role="option"]:hover) > .icon {
        --icon-size: ${list_selected_icon_size_hover ? list_selected_icon_size_hover : 'var(--list-selected-icon-size-hover)'};
    }
    :host(i-button[role="option"]) > .icon g {
        --icon-fill: ${list_selected_icon_fill ? list_selected_icon_fill : 'var(--list-selected-icon-fill)'};
    }
    :host(i-button[role="option"]:hover) > .icon g {
        --icon-fill: ${list_selected_icon_fill_hover ? list_selected_icon_fill_hover : 'var(--list-selected-icon-fill-hover)'};
    }
    :host(i-button[role="option"][aria-current="true"]) > .icon, 
    :host(i-button[role="option"][aria-current="true"]:hover) > .icon {
        --icon-size: ${current_list_selected_icon_size ? current_list_selected_icon_size : 'var(--current-list-selected-icon-size)'};
    }
    :host(i-button[role="option"][aria-current="true"]) > .icon g, 
    :host(i-button[role="option"][aria-current="true"]:hover) > .icon g { 
        --icon-fill: ${current_list_selected_icon_fill ? current_list_selected_icon_fill : 'var(--current-list-selected-icon-fill)'};
    }
    :host(i-button[role="option"][aria-selected="false"]) > .icon {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }
    :host(i-button[role="option"][aria-selected="true"]) > .icon {
        opacity: 1;
    }
    /* define grid */
    :host(i-button) .text {
        ${make_grid(grid.text)}
    }
    :host(i-button) .icon {
        --icon-size: ${icon_size ? icon_size : 'var(--primary-icon-size)'};
        display: block;
        width: var(--icon-size);
        transition: width 0.25s ease-in-out;
        ${make_grid(grid.icon)}
    }
    :host(i-button:hover) .icon {
        --icon-size: ${icon_size_hover ? icon_size_hover : 'var(--primary-icon-size-hover)'};
    }
    :host(i-button) .listbox {
        display: grid;
        max-width: 100%;
        ${make_grid(grid_listbox)}
    }
    :host(i-button) .option {
        display: grid;
        max-width: 100%;
        ${make_grid(grid_option)}
    }
    :host(i-button) .option > .icon {
        ${make_grid(grid.option_icon)}
    }
    :host(i-button) .option > .avatar {
        ${make_grid(grid.option_avatar)}
    }
    :host(i-button) .option > .text {
        ${make_grid(grid.option_text)}
    }
    ${custom_style}
    `

    return widget()
}
},{"make-element":31,"make-grid":32,"make-icon":33,"make-image":34,"message-maker":35,"support-style-sheet":36}],31:[function(require,module,exports){
module.exports = make_element

function make_element({name = '', classlist = null, role }) {
    const el = document.createElement(name)
    if (classlist) ste_class()
    if (role) set_role()
    return el

    function ste_class () {
        el.className = classlist
    }
    
    function set_role () {
        const tabindex = role.match(/button|switch/) ? 0 : -1
        el.setAttribute('role', role)
        el.setAttribute('tabindex',  tabindex)
    }
}


},{}],32:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],33:[function(require,module,exports){
const i_icon = require('datdot-ui-icon')
const message_maker = require('message-maker')

var id = 0

module.exports = {main_icon, select_icon, list_icon}

// ---------------------------------------------------------------
const myaddress = `icon-${id++}`
const inbox = {}
const outbox = {}
let recipients = {}
const message_id = to => ( outbox[to] = 1 + (outbox[to]||0) )
// ---------------------------------------------------------------
function make_protocol (name) {
    return function protocol (address, notify) {
        recipients[name] = { address, notify, make: message_maker(myaddress) }
        return { notify: listen, address: myaddress }
    }
}
function listen (msg) {
    const { head, refs, type, data, meta } = msg // receive msg
    const [from, to, msg_id] = head
    inbox[head.join('/')] = msg                  // store msg
}
// ---------------------------------------------------------------

var main_count = 0
var select_count = 0
var list_count = 0

function main_icon ({name, path}) {
    const el = i_icon({name, path}, make_protocol(`${name}-${main_count++}`))
    return el
}

function select_icon ({name = 'arrow-down', path}) {
    const el =  i_icon({name, path}, make_protocol(`${name}-${select_count++}`))
    return el
}

function list_icon ({name = 'check', path} ) {
    const el =  i_icon({name, path}, make_protocol(`${name}-${list_count++}`))
    return el
}


},{"datdot-ui-icon":42,"message-maker":35}],34:[function(require,module,exports){
module.exports = img

function img ({src, alt}) {
    const img = document.createElement('img')
    img.setAttribute('src', src)
    img.setAttribute('alt', alt)
    return img
}
},{}],35:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28}],36:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],37:[function(require,module,exports){
const style_sheet = require('support-style-sheet')
const message_maker = require('message-maker')
const make_button = require('make-button')
const make_list = require('make-list')

module.exports = i_dropdown

function i_dropdown ({page = '*', flow = 'ui-dropdown', name, options = {}, expanded = false, disabled = false, mode = 'single-select', theme}, protocol) {
    const {button = {}, list = {}} = options
    const recipients = []
    const make = message_maker(`${name} / ${flow} / ${page}`)
    const message = make({type: 'ready'})
    const list_name = `${name}-list`

    let is_expanded = expanded
    let is_disabled = disabled
    let store_data = []
    if (mode === 'single-select') {
        var init_selected = {...button}
        list.array.map( item => {
            const obj = item.current || item.selected ?  item : list.array[0]
            init_selected = {
                name,
                body: obj.text,
                icons: {
                    select: button.select ? button.select : undefined,
                    icon: obj.icon,
                },
                cover: obj.cover,
            }
        })
        store_data.push(init_selected)
    }
    if (mode === 'multiple-select') {
        list.array.map( item => {
            if (item.selected) store_data.push(item)
        })
    }
    function widget () {
        const send = protocol(get)
        const dropdown = document.createElement('i-dropdown')
        const shadow = dropdown.attachShadow({mode: 'closed'})
        const i_button = make_button({page, name, option: mode === 'single-select' ? init_selected : button, mode, expanded: is_expanded, theme: button.theme}, dropdown_protocol)
        const i_list = make_list({page, name: list_name, option: list, mode, hidden: is_expanded}, dropdown_protocol)
        send(message)
        dropdown.setAttribute('aria-label', name)
        if (is_disabled) dropdown.setAttribute('disabled', is_disabled)
        style_sheet(shadow, style)
        handle_collapsed()
        shadow.append(i_button)
        // need to add this to avoid document.body.addEventListener('click)
        dropdown.onclick = event => event.stopPropagation()
        return dropdown

        function handle_collapsed () {
            // trigger expanded event via document.body
            document.body.addEventListener('click', (e)=> {
                const make = message_maker(`All`)
                const to = `${name} / ${flow} / ${page}`
                const type = 'collapsed'
                if (is_expanded) {
                    is_expanded = false
                    recipients[name]( make({type, data: is_expanded}) )
                    recipients[list_name]( make({type, data: !is_expanded}) )
                    send( make({to, type, data: {selected: store_data}}) )
                }
            })
        }
        function handle_change_event (content) {
            const msg = make({type: 'changed', data: content})
            recipients[name](msg)
            send(msg)
        }
        function handle_select_event (data) {
            const {mode, selected} = data
            let new_data = []
            if (mode === 'dropdown') return
            if (mode === 'single-select') {
                selected.map( obj => {
                    if (obj.selected) {
                        const content = {text: obj.text, cover: obj.cover, icon: obj.icon}
                        new_data.push(obj)
                        return handle_change_event (content)
                    }
                })
            }
            if (mode === 'multiple-select') {
                new_data = selected.filter( obj => obj.selected )
            }
            store_data = new_data
        }
        function handle_expanded_event (data) {
            const {from, expanded} = data
            is_expanded = expanded
            const type = is_expanded ? 'expanded' : 'collapsed'
            // check which one dropdown is not using then do collapsed
            if (from !== name) {
                recipients[name](make({type: 'collapsed', data: is_expanded}))
                recipients[list_name](make({type, data: !is_expanded}))
            }
            // check which dropdown is currently using then do expanded
            recipients[name](make({type, data: is_expanded}))
            recipients[list_name](make({type, data: !is_expanded}))
            if (is_expanded && from == name) shadow.append(i_list)
        }
        function dropdown_protocol (name) {
            return send => {
                recipients[name] = send
                return get
            }
        }
        function get (msg) {
            const {head, refs, type, data} = msg 
            send(msg)
            if (type.match(/expanded|collapsed/)) return handle_expanded_event( data)
            if (type.match(/selected/)) return handle_select_event(data)
        }
    }

    
    // insert CSS style
    const custom_style = theme ? theme.style : ''
    // set CSS variables
    if (theme && theme.props) {
        var {size, size_hover, current_size, disabled_size,
            weight, weight_hover, current_weight, current_hover_weight,
            color, color_hover, current_color, current_bg_color, disabled_color, disabled_bg_color,
            current_hover_color, current_hover_bg_color,
            bg_color, bg_color_hover, border_color_hover,
            border_width, border_style, border_opacity, border_color, border_radius, 
            padding, margin, width, height, opacity,
            shadow_color, offset_x, offset_y, blur, shadow_opacity,
            shadow_color_hover, offset_x_hover, offset_y_hover, blur_hover, shadow_opacity_hover,
            margin_top = '5px'
        } = theme.props
    }

    const {direction = 'down', start = '0', end = '40px'} = list

    const style = `
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
        margin-top: ${margin_top};
        z-index: 1;
        width: 100%;
        ${direction === 'down' ? `top: ${end}` : `bottom: ${end};`}
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
            ${direction === 'down' ? `top: ${start};` : `bottom: ${start};`}
        }
        50% {
            opacity: 0.5;
            ${direction === 'down' ? `top: 20px;` : `bottom: 20px;`}
        }
        100%: {
            opacity: 1;
            ${direction === 'down' ? `top: ${end}` : `bottom: ${end};`}
        }
    }
    
    @keyframes up {
        0% {
            opacity: 1;
            ${direction === 'down' ? `top: ${end}` : `bottom: ${end};`}
        }
        50% {
            ${direction === 'down' ? `top: 20px;` : `bottom: 20px;`}
        }
        75% {
            opacity: 0.5;
        }
        100%: {
            opacity: 0;
            ${direction === 'down' ? `top: ${start};` : `bottom: ${start};`}
        }
    } 
    ${custom_style}
    `

    return widget()
}


},{"make-button":38,"make-list":39,"message-maker":40,"support-style-sheet":41}],38:[function(require,module,exports){
const {i_button} = require('datdot-ui-button')
module.exports = make_button
function make_button ({page, name, option = {}, mode, expanded, theme = {}}, protocol) {
    const {flow = 'ui-dropdown', role = 'listbox', body, icons, cover, disabled = false} = option
    const match = mode.match(/single|multiple/)
    const button_mode = match ? 'selector' : 'menu'
    const {style = ``, props = {}, grid = {}} = theme
    return i_button({
        page,
        flow, 
        name, 
        role,
        body,
        icons,
        cover, 
        mode: button_mode, 
        expanded, disabled, 
        theme: {
            style: `
                :host(i-button) > .icon {
                    transform: rotate(0deg);
                    transition: transform 0.4s ease-in-out;
                }
                :host(i-button[aria-expanded="true"]) > .icon {
                    transform: rotate(${mode === 'single-select' ? '-180' : '0' }deg);
                }
                ${style}
            `,
            props,
            grid
        }
    }, protocol(name))
}

},{"datdot-ui-button":30}],39:[function(require,module,exports){
const i_list = require('datdot-ui-list')
module.exports = make_list
function make_list ({page, name, option = {}, mode, hidden}, protocol) {
    const {flow = 'ui-dropdown-list', role = 'option', array, theme} = option
    let store_selected = []
    let render_list = []
    const check_current_undefined = (args) => args.current === undefined 
    const check_selected_undefined = (args) => args.selected === undefined 
    if (mode === 'single-select') render_list = make_single_select(array) 
    if (mode === 'multiple-select') render_list = make_multiple_select(array) 
    render_list.filter( item => {
        if (item.selected) return store_selected.push(item.text)
    })
    return i_list({page, flow, name, role, body: render_list, mode, hidden, expanded: !hidden, theme}, protocol(name))

    function make_single_select (args) {
        return args.map((opt, index) => {
            const check_options_current = args.every(check_current_undefined)
            const check_options_selected = args.every(check_selected_undefined)
            const obj = {...opt}
            // console.log('current undefined:', check_options_current);
            // console.log('selected undefined:', check_options_selected);
            // if current and selected are undefined, then find first element to be current and selected, others would be false
            if (check_options_current && check_options_selected && index === 0) {
                obj.current = check_options_current
                obj.selected = check_options_current
            } 
            // if current is true and selected is undefined, then make selected is true, others would be false
            if (opt.current && check_options_selected) {
                obj.current = opt.current
                obj.selected = opt.current
            }
            // if selected is true and current is undefined, then make current is true, others would be false
            if (check_options_current && opt.selected) {
                obj.current = opt.selected
                obj.selected = opt.selected
            }
            // if find current, then content would be shown text in current
            if (obj.current) content = obj.text
            /* 
            if selected is undefined but current is false, 
            or current is undefined but selected is false, 
            content would be replaced 'Select' into as selector tip on button by default
            */
            if (check_options_selected && opt.current === false || check_options_current && opt.selected === false ) content = 'Select'
            return obj
        })
    }

    function make_multiple_select (args) {
        const check_options_selected = args.every(check_selected_undefined)
        return args.map((opt, index) => {
            const obj = {...opt}
            // console.log('selected undefined:', check_options_selected);
            if (check_options_selected) obj.selected = check_options_selected
            obj.selected = opt.selected === undefined ? true : opt.selected 
            return obj
        })
    }
}
},{"datdot-ui-list":45}],40:[function(require,module,exports){
module.exports = function message_maker (from) {
    let msg_id = 0
    return function make ({to, type, data = null, refs = []}) {
        const stack = (new Error().stack.split('\n').slice(2).filter(x => x.trim()))
        const message = { head: [from, to, ++msg_id], refs, type, data, meta: { stack }}
        return message
    }
}
},{}],41:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],42:[function(require,module,exports){
const style_sheet = require('support-style-sheet')
const svg = require('svg')
const message_maker = require('message-maker')

var id = 0

module.exports = ({name, path, is_shadow = false, theme}, parent_protocol) => {
// ---------------------------------------------------------------
    const myaddress = `icon-${id++}`
    const inbox = {}
    const outbox = {}
    const recipients = {}
    const message_id = to => ( outbox[to] = 1 + (outbox[to]||0) )

    const {notify, address} = parent_protocol(myaddress, listen)
    const make = message_maker(myaddress)
    let message = make({ to: address, type: 'ready', refs: ['old_logs', 'new_logs'] })
    notify(message)

    function listen (msg) {
        const {head, refs, type, data, meta } = msg
        inbox[head.join('/')] = msg                  // store msg
        const [from, to, msg_id] = head       
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
            return icon
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

},{"message-maker":49,"support-style-sheet":43,"svg":44}],43:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],44:[function(require,module,exports){
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
},{}],45:[function(require,module,exports){
const style_sheet = require('support-style-sheet')
const {i_button, i_link} = require('datdot-ui-button')
const button = i_button
const message_maker = require('message-maker')
const make_grid = require('make-grid')
module.exports = i_list

function i_list (opts = {}, protocol) {
    const {page = '*', flow = 'ui-list', name, body = [], mode = 'multiple-select', expanded = false, hidden = true, theme = {} } = opts
    const recipients = []
    const make = message_maker(`${name} / ${flow} / i_list`)
    const message = make({type: 'ready'})
    let is_hidden = hidden
    let is_expanded = !is_hidden ? !is_hidden : expanded
    const store_selected = []
    const {grid} = theme

    function widget () {
        const send = protocol( get )
        send(message)
        const list = document.createElement('i-list')
        const shadow = list.attachShadow({mode: 'closed'})
        list.ariaHidden = is_hidden
        list.ariaLabel = name
        list.tabIndex = -1
        list.ariaExpanded = is_expanded
        list.dataset.mode = mode
        style_sheet(shadow, style)
        try {
            if (mode.match(/single|multiple/)) {
                list.setAttribute('role', 'listbox')
                make_selector(body)
            }   
            if (mode.match(/dropdown/)) {
                list.setAttribute('role', 'menubar')
                make_list()
            }
            if (body.length === 0) send(make({type: 'error', data: 'body no items'}))
        } catch(e) {
            send(make({type: 'error', data: {message: 'something went wrong', opts }}))
        }
        
        return list

        function make_selector (args) {
            args.forEach( (list, i) => {
                const {list_name, address = undefined, text = undefined, role = 'option', icons = {}, cover, current = undefined, selected = false, disabled = false, theme = {}} = list
                const {style = ``, props = {}} = theme
                const {
                    size = 'var(--primary-size)', 
                    size_hover = 'var(--primary-size)',
                    weight = '300', 
                    color = 'var(--primary-color)', 
                    color_hover = 'var(--primary-color-hover)', 
                    color_focus = 'var(--color-white)',
                    bg_color = 'var(--primary-bg-color)', 
                    bg_color_hover = 'var(--primary-bg-color-hover)', 
                    bg_color_focus = 'var(--primary-bg-color-focus)',
                    icon_size = 'var(--primary-icon-size)',
                    icon_size_hover = 'var(--primary-icon-size_hover)',
                    icon_fill = 'var(--primary-icon-fill)',
                    icon_fill_hover = 'var(--primary-icon-fill-hover)',
                    avatar_width = 'var(--primary-avatar-width)', 
                    avatar_height = 'var(--primary-avatar-height)', 
                    avatar_radius = 'var(--primary-avatar-radius)',
                    current_size = 'var(--current-list-size)',
                    current_color = 'var(--current-list-color)',
                    current_weight = 'var(--current-list-weight)',
                    current_icon_size = 'var(--current-icon-size)',
                    current_icon_fill = 'var(--current-icon-fill)',
                    current_list_selected_icon_size = 'var(--current-list-selected-icon-size)',
                    current_list_selected_icon_fill = 'var(--current-list-selected-icon-fill)',
                    list_selected_icon_size = 'var(--list-selected-icon-size)',
                    list_selected_icon_fill = 'var(--list-selected-icon-fill)',
                    list_selected_icon_fill_hover = 'var(--list-selected-icon-fill-hover)',
                    disabled_color = 'var(--primary-disabled-color)',
                    disabled_bg_color = 'var(--primary-disabled-bg-color)',
                    disabled_icon_fill = 'var(--primary-disabled-fill)',
                    padding = '',
                    opacity = '0'
                } = props

                const is_current = mode === 'single-select' ? current : false
                const make_button = button({
                    page,
                    name: list_name, 
                    body: text, 
                    role, icons, cover, 
                    current: is_current, 
                    selected, 
                    disabled,
                    theme: {
                        style,
                        props: {
                        size, size_hover, weight, 
                        color, color_hover, color_focus,
                        bg_color, bg_color_hover, bg_color_focus,
                        icon_size, icon_size_hover, icon_fill, icon_fill_hover,
                        avatar_width, avatar_height, avatar_radius,
                        current_size, current_color, current_weight,
                        current_icon_size, current_icon_fill,
                        current_list_selected_icon_size, current_list_selected_icon_fill,
                        list_selected_icon_size, list_selected_icon_fill, list_selected_icon_fill_hover,
                        disabled_color, disabled_bg_color, disabled_icon_fill,
                        padding,
                        opacity
                    }, 
                    grid
                }}, button_protocol(list_name))

                const li = document.createElement('li')
                if (address) li.dataset.address = address
                li.dataset.option = text || list_name
                li.setAttribute('aria-selected', is_current || selected)
                if (is_current) li.setAttribute('aria-current', is_current)
                if (disabled) li.setAttribute('disabled', disabled)
                const make = message_maker(`${list_name} / option / ${flow} / widget`)
                li.append(make_button)
                shadow.append(li)
                send( make({type: 'ready'}) )
            })
        }

        function make_list () {
            body.map( (list, i) => {
                const {list_name, text = undefined, role = 'option', url = '#', target, icons, cover, disabled = false, theme = {}} = list
                const {style = ``, props = {}} = theme
                const {
                    size = `var(--primary-size)`, 
                    size_hover = `var(--primary-size)`, 
                    color = `var(--primary-color)`, 
                    color_hover = `var(--primary-color-hover)`,     
                    bg_color = 'var(--primary-bg-color)', 
                    bg_color_hover = 'var(--primary-bg-color-hover)', 
                    icon_fill = 'var(--primary-color)', 
                    icon_fill_hover = 'var(--primary-color-hover)', 
                    icon_size = 'var(--primary-icon-size)',
                    icon_size_hover = 'var(--primary-icon-size-hover)',
                    current_icon_size = 'var(--current-icon-size)',
                    avatar_width = 'var(--primary-avatar-width)', 
                    avatar_height = 'var(--primary-avatar-height)', 
                    avatar_radius = 'var(--primary-avatar-radius)',
                    disabled_color = 'var(--primary-disabled-color)',
                    disabled_bg_color = 'var(--primary-disabled-bg-color)',
                    disabled_icon_fill = 'var(--primary-disabled-icon-fill)',
                    padding = null
                } = props
                if (role === 'link' ) {
                    var item = i_link({
                        page,
                        name: list_name,
                        body: text,
                        role: 'menuitem',
                        link: {
                            url,
                            target
                        },
                        icons,
                        cover,
                        disabled,
                        theme: {
                            style,
                            props,
                            grid
                        }
                    }, button_protocol(list_name))
                }

                if (role === 'menuitem') {
                    var item = i_button({
                        name: list_name,
                        body: text,
                        role,
                        icons,
                        cover,
                        disabled,
                        theme: {
                            style,
                            props: {
                                size, size_hover,
                                color, color_hover,
                                bg_color, bg_color_hover,
                                icon_fill, icon_fill_hover,
                                icon_size, icon_size_hover,
                                current_icon_size,
                                avatar_width, avatar_height, avatar_radius,
                                disabled_color, disabled_bg_color, disabled_icon_fill,
                                padding
                            },
                            grid
                        }
                    }, button_protocol(list_name))
                }
                const li = document.createElement('li')
                li.setAttribute('role', 'none')
                if (disabled) li.setAttribute('disabled', disabled)
                li.append(item)
                shadow.append(li)
            })
            
        }
        function handle_expanded_event (data) {
            list.setAttribute('aria-hidden', data)
            list.setAttribute('aria-expanded', !data)
        }
        function handle_mutiple_selected ({make, from, lists, selected}) {
            const type = selected ? 'selected' : 'unselected'
            const message = make({type: 'selected', data: {selected: from}})
            recipients[from](make({type, data: selected}))
            lists.forEach( list => {
                const label = list.firstChild.getAttribute('aria-label') 
                if (label === from) list.setAttribute('aria-selected', selected)
            })
            send( message )
        }

        function handle_single_selected ({make, from, lists, selected}) {
            lists.forEach( list => {
                const label = list.firstChild.getAttribute('aria-label') 
                const state = label === from
                const type = state ? 'selected' : 'unselected'
                const name = state ? from : label
                recipients[name](make({type, data: state}))
                recipients[name](make({type: 'current', data: state}))
                list.setAttribute('aria-current', state)
                list.setAttribute('aria-selected', state)
            })
            const message = make({type: 'selected', data: {selected: from}})
            send( message )
        }
        function handle_select_event ({from, to, data}) {
            const {selected} = data
            // !important  <style> as a child into inject shadowDOM, only Safari and Firefox did, Chrome, Brave, Opera and Edge are not count <style> as a childElemenet
            const lists = shadow.firstChild.tagName !== 'STYLE' ? shadow.childNodes : [...shadow.childNodes].filter( (child, index) => index !== 0)
            const make = message_maker(`${from} / option / ${flow}`)
            if (mode === 'single-select')  handle_single_selected({make, from, lists, selected})
            if (mode === 'multiple-select') handle_mutiple_selected({make, from, lists, selected})
            
        }
        function button_protocol (name) {
            return (send) => {
                recipients[name] = send
                return get
            }
        }
        function handle_click_event(msg) {
            const {head, type, data} = msg
            const role = head[0].split(' / ')[1]
            const from = head[0].split(' / ')[0]
            const make = message_maker(`${from} / ${role} / ${flow}`)
            const message = make({to: '*', type, data})
            send(message)
        }
        function get (msg) {
            const {head, refs, type, data} = msg
            const to = head[1]
            const id = head[2]
            const role = head[0].split(' / ')[1]
            const from = head[0].split(' / ')[0]
            if (role === 'menuitem') return handle_click_event(msg)
            if (type === 'click' && role === 'option') return handle_select_event({from, to, data})
            if (type.match(/expanded|collapsed/)) return handle_expanded_event(data)
        }
    }

    // insert CSS style
    const custom_style = theme ? theme.style : ''
    // set CSS variables
    if (theme && theme.props) {
        var {
            bg_color, bg_color_hover,
            current_bg_color, current_bg_color_hover, disabled_bg_color,
            width, height, border_width, border_style, border_opacity, border_color,
            border_color_hover, border_radius, padding,  opacity,
            shadow_color, offset_x, offset_y, blur, shadow_opacity,
            shadow_color_hover, offset_x_hover, offset_y_hover, blur_hover, shadow_opacity_hover
        } = theme.props
    }

    const style = `
    :host(i-list) {
        ${width && 'width: var(--width);'};
        ${height && 'height: var(--height);'};
        display: grid;
        ${make_grid(grid)}
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
        --bg-color: ${bg_color ? bg_color : 'var(--primary-bg-color)'};
        --border-radius: ${border_radius ? border_radius : 'var(--primary-radius)'};
        --border-width: ${border_width ? border_width : 'var(--primary-border-width)'};
        --border-style: ${border_style ? border_style : 'var(--primary-border-style)'};
        --border-color: ${border_color ? border_color : 'var(--primary-border-color)'};
        --border-opacity: ${border_opacity ? border_opacity : 'var(--primary-border-opacity)'};
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
        --bg-color: ${bg_color_hover ? bg_color_hover : 'var(--primary-bg-color-hover)'};
    }
    :host(i-list) li:nth-of-type(1) {
        border-top-left-radius: var(--border-radius);
        border-top-right-radius: var(--border-radius);
    }
    li:last-child {
        border-bottom-left-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
    }
    [role="listitem"] {
        display: grid;
        grid-template-rows: 24px;
        padding: 11px;
        align-items: center;
    }
    [role="listitem"]:hover {
        cursor: default;
    }
    li[disabled="true"], li[disabled="true"]:hover {
        background-color: ${disabled_bg_color ? disabled_bg_color : 'var(--primary-disabled-bg-color)'};
        cursor: not-allowed;
    }
    [role="none"] {
        --bg-color: var(--list-bg-color);
        --opacity: 1;
        background-color: hsla(var(--bg-color), var(--opacity));
    }
    [role="none"]:hover {
        --bg-color: var(--list-bg-color-hover);
        --opacity: 1;
        background-color: hsla(var(--bg-color), var(--opacity));
    }
    [role="none"] i-link {
        padding: 12px;
    }
    [role="option"] i-button.icon-right, [role="option"] i-button.text-left {
        grid-template-columns: auto 1fr auto;
    }
    [aria-current="true"] {
        --bg-color: ${current_bg_color ? current_bg_color : 'var(--current-bg-color)'};
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
    ${custom_style}
    `

    return widget()
}
},{"datdot-ui-button":30,"make-grid":46,"message-maker":47,"support-style-sheet":48}],46:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],47:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"dup":40}],48:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],49:[function(require,module,exports){
module.exports = function message_maker (from) {
  let msg_id = 0
  return function make ({to, type, data = null, refs = {} }) {
      const stack = (new Error().stack.split('\n').slice(2).filter(x => x.trim()))
      return { head: [from, to, msg_id++], refs, type, data, meta: { stack }}
  }
}
},{}],50:[function(require,module,exports){
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

},{}],51:[function(require,module,exports){
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

},{"hyperscript-attribute-to-property":50}],52:[function(require,module,exports){
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

},{}],53:[function(require,module,exports){
(function (__filename){(function (){
const style_sheet = require('support-style-sheet')
const message_maker = require('message-maker')
const i_button = require('datdot-ui-button')
const make_list = require('make-list')

var id = 0

module.exports = i_dropdown

function i_dropdown (opts, parent_protocol) {
// -----------------------------------------
    const myaddress = `${__filename}-${id++}`
    const inbox = {}
    const outbox = {}
    const recipients = {}
    const names = {}
    const message_id = to => (outbox[to] = 1 + (outbox[to]||0))

    const {notify, address} = parent_protocol(myaddress, listen)
    names[address] = recipients['parent'] = { name: 'parent', notify, address, make: message_maker(myaddress) }
    notify(recipients['parent'].make({ to: address, type: 'ready', refs: {} }))

    function make_protocol (name) {
        return function protocol (address, notify) {
            names[address] = recipients[name] = { name, address, notify, make: message_maker(myaddress) }
            return { notify: listen, address: myaddress }
        }
    }
    
    function listen (msg) {
        const { head, refs, type, data, meta } = msg // receive msg
        inbox[head.join('/')] = msg                  // store msg
        const [from, to, msg_id] = head
        console.log('New message', { from, msg })
        // handle
        const { notify, address, make } = recipients['parent']
        notify(make({ to: address, type, data }))
        if (type.match(/expanded|collapsed/)) return handle_expanded_event( data)
        if (type.match(/selected/)) return handle_select_event(data)
    }
// -----------------------------------------
    const {page = '*', flow = 'ui-dropdown', name, options: {button = {}, list = {}}, expanded = false, disabled = false, mode = 'single-select', theme} = opts
    const list_name = `${name}-list`
    let is_expanded = expanded
    let is_disabled = disabled
    let store_data = []
    if (mode === 'single-select') {
        var init_selected = {...button}
        list.array.map( item => {
            const obj = item.current || item.selected ?  item : list.array[0]
            init_selected = {
                name,
                body: obj.text,
                icons: {
                    select: button.select ? button.select : undefined,
                    icon: obj.icon,
                },
                cover: obj.cover,
            }
        })
        store_data.push(init_selected)
    }
    if (mode === 'multiple-select') {
        list.array.map( item => {
            if (item.selected) store_data.push(item)
        })
    }
    function widget () {
        const dropdown = document.createElement('i-dropdown')
        const shadow = dropdown.attachShadow({mode: 'closed'})
        i_button({ 
            name, 
            role: 'listbox', 
            mode: mode.match(/single|multiple/) ? 'selector' : 'menu', 
            expanded: is_expanded, 
            disabled: is_disabled, 
            theme: {
                style: `
                    :host(i-button) > .icon {
                        transform: rotate(0deg);
                        transition: transform 0.4s ease-in-out;
                    }
                    :host(i-button[aria-expanded="true"]) > .icon {
                        transform: rotate(${mode === 'single-select' ? '-180' : '0' }deg);
                    }
                    ${style}
                `,
                props: {},
                grid: {}
            }
        }, make_protocol(name))
        const i_list = make_list({page, name: list_name, option: list, mode, hidden: is_expanded}, make_protocol('list'))
        // notify(message)
        dropdown.setAttribute('aria-label', name)
        if (is_disabled) dropdown.setAttribute('disabled', is_disabled)
        style_sheet(shadow, style)
        handle_collapsed()
        shadow.append(i_button)
        // need to add this to avoid document.body.addEventListener('click)
        dropdown.onclick = event => event.stopPropagation()
        return dropdown

        function handle_collapsed () {
            // trigger expanded event via document.body
            document.body.addEventListener('click', (e)=> {
                const type = 'collapsed'
                if (is_expanded) {
                    is_expanded = false
                    const { name: name_notify, make: name_make, address: name_address } = recipients[name]
                    name_notify(name_make({ to: name_address, type, data: is_expanded }))
                    const { notify: list_notify, make: list_make, address: list_address } = recipients[list_name]
                    list_notify(list_make({ to: list_address, type, data: !is_expanded }))
                    const { notify, make, address } = recipients['parent']
                    notify(make({to: address, type, data: { selected: store_data }}) )
                }
            })
        }
        function handle_change_event (content) {
            const { notify: name_notify, make: name_make, address: name_address } = recipients[name]
            name_notify(name_make({ to: name_address, type: 'changed', data: content }))
            
            const { notify, make, address } = recipients['parent']
            notify(make({ to: address, type: 'changed', data: content }))
        }
        function handle_select_event (data) {
            const {mode, selected} = data
            let new_data = []
            if (mode === 'dropdown') return
            if (mode === 'single-select') {
                selected.map( obj => {
                    if (obj.selected) {
                        const content = {text: obj.text, cover: obj.cover, icon: obj.icon}
                        new_data.push(obj)
                        return handle_change_event (content)
                    }
                })
            }
            if (mode === 'multiple-select') {
                new_data = selected.filter( obj => obj.selected )
            }
            store_data = new_data
        }
        function handle_expanded_event (data) {
            const {from, expanded} = data
            is_expanded = expanded
            const type = is_expanded ? 'expanded' : 'collapsed'
            // check which one dropdown is not using then do collapsed
            const { notify: name_notify, make: name_make, address: name_address } = recipients[name]
            const { notify: list_notify, make: list_make, address: list_address } = recipients[list_name]
            if (from !== name) {
                name_notify(name_make({ to: name_address,type: 'collapsed', data: is_expanded }))
                list_notify(list_make({ to: list_address, type, data: !is_expanded }))
            }
            // check which dropdown is currently using then do expanded
            name_notify(name_make({ to: name_address, type, data: is_expanded }))
            list_notify(list_make({ to: list_address, type, data: !is_expanded }))
            if (is_expanded && from == name) shadow.append(i_list)
        }
    }

    
    // insert CSS style
    const custom_style = theme ? theme.style : ''
    // set CSS variables
    if (theme && theme.props) {
        var {size, size_hover, current_size, disabled_size,
            weight, weight_hover, current_weight, current_hover_weight,
            color, color_hover, current_color, current_bg_color, disabled_color, disabled_bg_color,
            current_hover_color, current_hover_bg_color,
            bg_color, bg_color_hover, border_color_hover,
            border_width, border_style, border_opacity, border_color, border_radius, 
            padding, margin, width, height, opacity,
            shadow_color, offset_x, offset_y, blur, shadow_opacity,
            shadow_color_hover, offset_x_hover, offset_y_hover, blur_hover, shadow_opacity_hover,
            margin_top = '5px'
        } = theme.props
    }

    const {direction = 'down', start = '0', end = '40px'} = list

    const style = `
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
        margin-top: ${margin_top};
        z-index: 1;
        width: 100%;
        ${direction === 'down' ? `top: ${end}` : `bottom: ${end};`}
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
            ${direction === 'down' ? `top: ${start};` : `bottom: ${start};`}
        }
        50% {
            opacity: 0.5;
            ${direction === 'down' ? `top: 20px;` : `bottom: 20px;`}
        }
        100%: {
            opacity: 1;
            ${direction === 'down' ? `top: ${end}` : `bottom: ${end};`}
        }
    }
    
    @keyframes up {
        0% {
            opacity: 1;
            ${direction === 'down' ? `top: ${end}` : `bottom: ${end};`}
        }
        50% {
            ${direction === 'down' ? `top: 20px;` : `bottom: 20px;`}
        }
        75% {
            opacity: 0.5;
        }
        100%: {
            opacity: 0;
            ${direction === 'down' ? `top: ${start};` : `bottom: ${start};`}
        }
    } 
    ${custom_style}
    `

    return widget()
}


}).call(this)}).call(this,"/src/index.js")
},{"datdot-ui-button":30,"make-list":55,"message-maker":49,"support-style-sheet":56}],54:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],55:[function(require,module,exports){
(function (__filename){(function (){
const i_list = require('datdot-ui-list')
const message_maker = require('message-maker')

var id = 0

module.exports = make_list

function make_list ({page, name, option = {}, mode, hidden}, parent_protocol) {
// ----------------------------------------
    const myaddress = `${__filename}-${id++}`
    const inbox = {}
    const outbox = {}
    const recipients = {}
    const names = {}
    const message_id = to => (outbox[to] = 1 + (outbox[to]||0))

    const {notify, address} = parent_protocol(myaddress, listen)
    names[address] = recipients['parent'] = { name: 'parent', notify, address, make: message_maker(myaddress) }
    notify(recipients['parent'].make({ to: address, type: 'ready', refs: {} }))

    function make_protocol (name) {
        return function protocol (address, notify) {
            names[address] = recipients[name] = { name, address, notify, make: message_maker(myaddress) }
            return { notify: listen, address: myaddress }
        }
    }
    
    function listen (msg) {
        console.log('New message', { msg })
    }
// ----------------------------------------
    const {flow = 'ui-dropdown-list', role = 'option', array, theme} = option
    let store_selected = []
    let render_list = []
    const check_current_undefined = (args) => args.current === undefined 
    const check_selected_undefined = (args) => args.selected === undefined 
    if (mode === 'single-select') render_list = make_single_select(array) 
    if (mode === 'multiple-select') render_list = make_multiple_select(array) 
    render_list.filter( item => {
        if (item.selected) return store_selected.push(item.text)
    })
    return i_list({page, flow, name, role, body: render_list, mode, hidden, expanded: !hidden, theme}, make_protocol(name))

    function make_single_select (args) {
        return args.map((opt, index) => {
            const check_options_current = args.every(check_current_undefined)
            const check_options_selected = args.every(check_selected_undefined)
            const obj = {...opt}
            // console.log('current undefined:', check_options_current);
            // console.log('selected undefined:', check_options_selected);
            // if current and selected are undefined, then find first element to be current and selected, others would be false
            if (check_options_current && check_options_selected && index === 0) {
                obj.current = check_options_current
                obj.selected = check_options_current
            } 
            // if current is true and selected is undefined, then make selected is true, others would be false
            if (opt.current && check_options_selected) {
                obj.current = opt.current
                obj.selected = opt.current
            }
            // if selected is true and current is undefined, then make current is true, others would be false
            if (check_options_current && opt.selected) {
                obj.current = opt.selected
                obj.selected = opt.selected
            }
            // if find current, then content would be shown text in current
            if (obj.current) content = obj.text
            /* 
            if selected is undefined but current is false, 
            or current is undefined but selected is false, 
            content would be replaced 'Select' into as selector tip on button by default
            */
            if (check_options_selected && opt.current === false || check_options_current && opt.selected === false ) content = 'Select'
            return obj
        })
    }

    function make_multiple_select (args) {
        const check_options_selected = args.every(check_selected_undefined)
        return args.map((opt, index) => {
            const obj = {...opt}
            // console.log('selected undefined:', check_options_selected);
            if (check_options_selected) obj.selected = check_options_selected
            obj.selected = opt.selected === undefined ? true : opt.selected 
            return obj
        })
    }
}
}).call(this)}).call(this,"/src/node_modules/make-list.js")
},{"datdot-ui-list":45,"message-maker":49}],56:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}]},{},[1]);
