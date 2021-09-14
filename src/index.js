const style_sheet = require('support-style-sheet')
const message_maker = require('message-maker')
const make_button = require('make-button')
const make_list = require('make-list')

module.exports = i_dropdown

function i_dropdown ({page = 'Demo', flow = 'ui-dropdown', name, options = {}, expanded = false, disabled = false, mode = 'single-select', theme}, protocol) {
    const {button = {}, list = {}} = options
    const recipients = []
    const make = message_maker(`${name} / ${flow} / ${page}`)
    const message = make({type: 'ready'})
    let is_expanded = expanded
    let is_disabled = disabled
    let store_selected = []
    if (mode === 'single-select') {
        var selected = {...button}
        list.array.map( item => {
            const obj = item.current || item.selected ?  item : list.array[0]
            selected = {
                name: button.name,
                body: obj.text,
                icons: {
                    select: button.select ? button.select : undefined,
                    icon: obj.icon,
                },
                cover: obj.cover
            }
        })


    }

    function widget () {
        const send = protocol(get)
        const dropdown = document.createElement('i-dropdown')
        const shadow = dropdown.attachShadow({mode: 'closed'})
        const i_button = make_button({page, option: mode === 'single-select' ? selected : options.button, mode, expanded: is_expanded}, dropdown_protocol)
        const i_list = make_list({page, option: options.list, mode, hidden: is_expanded}, dropdown_protocol)
        send(message)
        dropdown.setAttribute('aria-label', name)
        if (is_disabled) dropdown.setAttribute('disabled', is_disabled)
        shadow.append(i_button)
        if (is_expanded) {
            shadow.append(i_list)
            send(make({type: 'expanded', data: {selected: store_selected}}))
        }
        style_sheet(shadow, style)
        handle_expanded()
        
        return dropdown

        function handle_expanded () {
            // trigger expanded event via document.body
            document.body.addEventListener('click', (e)=> {
                const type = 'collapse'
                const to = `${options.button ? options.button.name : name} / listbox / ui-list`
                if (e.target !== dropdown) {
                    if (is_expanded) {
                        is_expanded = !is_expanded
                        recipients[options.button.name]( make({to, type, data: is_expanded}) )
                        recipients[options.list.name]( make({type, data: !is_expanded}) )
                        send( make({to, type, data: {selected: store_selected}}) )
                    }
                }
            })
        }

        function handle_change_selector (data) {
            const {mode, selected} = data
            if (mode == 'dropdown') return
            if (mode === 'single-select') {
                const message = make({to: `${options.button.name} / listbox / ui-button`, type: 'changed', data: {body: selected}, refs: [data]})
                recipients[name](message)
                send(message)
                store_selected = selected
            }
            if (mode === 'multiple-select') {
                store_selected = selected
            }
        }

        function handle_dropdown_menu_event (from, data) {
            const state = data.expanded
            const type = state ? 'expanded' : 'collapse'
            const to = `${from} / listbox / ui-list`
            is_expanded = state
            shadow.append(i_list)
            recipients[options.list.name]( make({type, data: !state}) )
            recipients[from]( make({to, type, data: state}) )
            send( make({to, type, data: {selected: store_selected}}) )
        }

        function dropdown_protocol (name) {
            return send => {
                recipients[name] = send
                return get
            }
        }
    
        function handle_select_event (data) {
            
        }

        function get (msg) {
            const {head, refs, type, data} = msg 
            const from = head[0].split('/')[0].trim()
            send(msg)
            if (type === 'click') return handle_dropdown_menu_event(from, data)
            if (type.match(/selected|unselected/)) return handle_select_event(data)
            if (type === 'changed') return console.log(data);
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
            margin_top
        } = theme.props
    }

    const style = `
    :host(i-dropdown) {
        position: relative;
        display: grid;
        width: 100%;
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
        top: 40px;
        margin-top: ${margin_top ? margin_top : '5px'};
        z-index: 1;
        width: 100%;
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
            top: 0px;
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
            top: 0px;
        }
    } 
    ${custom_style}
    `

    return widget()
}

