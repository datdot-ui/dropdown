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

