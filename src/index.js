const style_sheet = require('support-style-sheet')
const message_maker = require('message-maker')
const i_button = require('datdot-ui-button')
const i_list = require('datdot-ui-list')

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
        console.log('DROPDOWN', { from, name: names[from].name, data })
        // handle
        const { notify, address, make } = recipients['parent']
        notify(make({ to: address, type, data }))
        if (type.match(/expanded|collapsed/)) return handle_expand_collapse(from, data)
        if (type.match(/selected/)) return handle_select_event(data)
    }
// -----------------------------------------
    const {name, button = {}, list = {}, expanded = true, disabled = false, mode = 'listbox-single', theme} = opts
    var list_el
    const list_name = `${name}-list`
    const button_name = `${name}-button`
    const state = {
        is_expanded: expanded,
        is_disabled: disabled
    }
    const { icons = {} } = button
    var shadow

    let selected_items = list.array.filter(item => item.current || item.selected)
    if (!selected_items.length) selected_items.push(list.array[0])

    if (mode === 'listbox-single') {
        var init_selected = {...button}
        const [selected_item] = selected_items
        init_selected = {
            name,
            body: selected_item.text,
            icons,
            cover: selected_item.cover,
        }
        
        selected_items.push(init_selected)
    }
    
    function widget () {
        const dropdown = document.createElement('i-dropdown')
        shadow = dropdown.attachShadow({mode: 'closed'})
        const button = i_button({ 
            name: button_name,
            role: 'listbox', 
            mode: mode.match(/listbox/) ? 'selector' : 'menu', 
            expanded: state.is_expanded, 
            disabled: state.is_disabled, 
            theme: {
                style: `
                    :host(i-button) > .icon {
                        transform: rotate(0deg);
                        transition: transform 0.4s ease-in-out;
                    }
                    :host(i-button[aria-expanded="true"]) > .icon {
                        transform: rotate(${mode === 'listbox-single' ? '-180' : '0' }deg);
                    }
                    ${style}
                `,
                props: {},
                grid: {}
            }
        }, make_protocol(button_name))
        
        list_el = i_list({
            list_name, 
            body: list.array.map(option => {
                if (option.current || option.selected) {
                    // if only current or selected set to true, update the other one to true too
                    if (mode === 'listbox-multi') option.current = option.selected = true
                    else if (mode === 'listbox-single') {
                        // if many set as selected or true, take first only for single select
                        if (!first) option.current = option.selected = true
                        first = true
                    } 
                }
                return option
            }),
            mode, 
            hidden: state.is_expanded, 
            expanded: !state.is_expanded, 
            theme
        }, make_protocol(list_name))
        
        // notify(message)
        dropdown.setAttribute('aria-label', name)
        if (state.is_disabled) dropdown.setAttribute('disabled', state.is_disabled)
        style_sheet(shadow, style)
        add_collapse_all()
        shadow.append(button)
        // need to add this to avoid document.body.addEventListener('click)
        dropdown.onclick = event => event.stopPropagation()

        return dropdown
    }

    // HANDLERS
    function handle_change_event (content) {
        const { notify: name_notify, make: name_make, address: name_address } = recipients[button_name]
        name_notify(name_make({ to: name_address, type: 'changed', data: content }))
        
        const { notify, make, address } = recipients['parent']
        notify(make({ to: address, type: 'changed', data: content }))
    }

    function handle_select_event (data) {
        const {mode, selected} = data
        let new_data = []
        if (mode === 'dropdown') return
        if (mode === 'listbox-single') {
            selected.map( obj => {
                if (obj.selected) {
                    const content = {text: obj.text, cover: obj.cover, icon: obj.icon}
                    new_data.push(obj)
                    return handle_change_event (content)
                }
            })
        }
        if (mode === 'listbox-multi') {
            new_data = selected.filter( obj => obj.selected )
        }
        selected_items = new_data
    }

    function handle_expand_collapse (from, data) {
        state.is_expanded = data.expanded
        const type = state.is_expanded ? 'expanded' : 'collapsed'
        // check which one dropdown is not using then do collapsed
        const { notify: button_notify, make: button_make, address: button_address } = recipients[button_name]
        const { notify: list_notify, make: list_make, address: list_address } = recipients[list_name]
        if (names[from].name !== button_name) {
            button_notify(button_make({ to: button_address,type: 'collapsed', data: state.is_expanded }))
            list_notify(list_make({ to: list_address, type, data: !state.is_expanded }))
        }
        // check which dropdown is currently using then do expanded
        button_notify(button_make({ to: button_address, type, data: state.is_expanded }))
        list_notify(list_make({ to: list_address, type, data: state.is_expanded }))
        if (state.is_expanded && names[from].name === button_name) shadow.append(list_el)
    }

    function add_collapse_all () {
        // trigger expanded event via document.body
        document.body.addEventListener('click', (e) => {
            const type = 'collapsed'
            if (state.is_expanded) {
                state.is_expanded = false

                // notify button
                const { notify: name_notify, make: name_make, address: name_address } = recipients[button_name]
                name_notify(name_make({ to: name_address, type, data: state.is_expanded }))
                // notify list
                const { notify: list_notify, make: list_make, address: list_address } = recipients[list_name]
                list_notify(list_make({ to: list_address, type, data: state.is_expanded }))
                // notify parent
                const { notify, make, address } = recipients['parent']
                notify(make({to: address, type, data: { selected: selected_items }}) )
            }
        })
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

