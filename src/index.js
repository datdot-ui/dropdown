const bel = require('bel')
const style_sheet = require('support-style-sheet')
const message_maker = require('message-maker')
// datdot-ui dependencies
const button = require('datdot-ui-button')
const list = require('datdot-ui-list')
const i_icon = require('datdot-ui-icon')

module.exports = i_dropdown

function i_dropdown ({page = 'Demo', flow = 'ui-dropdown', name, body = {}, expanded = false, disabled = false, mode = 'single-select', theme}, protocol) {
    let {content, button_mode = 'dropdown', button_icon = 'arrow-down', list_name = 'dropdown-list', list_icon = 'check', path = 'assets', options } = body
    const recipients = []
    const make = message_maker(`${name} / ${flow} / ${page}`)
    const message = make({type: 'ready'})
    const check_current_undefined = (args) => args.current === undefined 
    const check_selected_undefined = (args) => args.selected === undefined 
    let is_expanded = expanded
    let is_disabled = disabled
    let store_selected = []

    const arr = (mode === 'single-select') ? make_single_select() : (mode === 'multiple-select') ? make_multiple_select() : options

    arr.filter( item => {
        if (item.selected) return store_selected.push(item.text)
    })

    function widget () {
        const send = protocol(get)
        const dropdown = document.createElement('i-dropdown')
        const shadow = dropdown.attachShadow({mode: 'closed'})
        const btn = button(
        {
            name: `${name}-dropdown`,
            role: 'listbox', 
            icon: i_icon({name: button_icon, path}),
            body: button_mode === 'selector' || content !== void 0 ? content : void 0,
            mode,
            expanded: is_expanded,
            disabled: is_disabled,
            theme: {
                style: `
                :host(i-button) .icon {
                    transform: rotate(0deg);
                    transition: transform 0.4s ease-in-out;
                }
                :host(i-button[aria-expanded="true"]) .icon {
                    transform: rotate(${mode === 'single-select' ? '-180' : '0' }deg);
                }
                `,
                props: {
                    border_width: '1px',
                    border_color: 'var(--color-black)',
                    border_style: 'solid'
                }
            }
        }, dropdown_protocol(`${name}-dropdown`))

        const dropdown_list = list(
        {
            name: list_name, 
            body: arr, 
            mode,
            expanded: is_expanded,
            hidden: !is_expanded
        }, dropdown_protocol(list_name))
        send(message)
        dropdown.setAttribute('aria-label', name)
        dropdown.setAttribute('disabled', is_disabled)
        style_sheet(shadow, style)
        shadow.append(btn)
        if (is_expanded) {
            shadow.append(dropdown_list)
            send(make({type: 'expanded', data: {selected: store_selected}}))
        }
        handle_expanded()
        
        return dropdown

        function handle_expanded () {
            // trigger expanded event via document.body
            document.body.addEventListener('click', (e)=> {
                const type = 'unexpanded'
                const to = `${list_name} / listbox / ui-list`
                if (e.target !== dropdown) {
                    dropdown_list.remove()
                    if (is_expanded) {
                        is_expanded = !is_expanded
                        recipients[`${name}-dropdown`]( make({to, type, data: is_expanded}) )
                        send( make({to, type, data: {selected: store_selected}}) )
                    }
                }
            })
        }

        function handle_change_selector (data) {
            const {mode, selected} = data
            if (button_mode == 'dropdown') return
            if (mode === 'single-select') {
                const message = make({to: `${name}-dropdown / listbox / ui-button`, type: 'changed', data: selected, refs: [data]})
                recipients[`${name}-dropdown`](message)
                send(message)
                store_selected = selected
            }
            if (mode === 'multiple-select') {
                store_selected = selected
            }
        }

        function handle_dropdown_menu_event (from, data) {
            const state = data.expanded
            const type = state ? 'expanded' : 'unexpanded'
            const to = `${list_name} / listbox / ui-list`
            is_expanded = state
            shadow.append(dropdown_list)
            recipients[list_name]( make({type, data: !state}) )
            recipients[from]( make({to, type, data: state}) )
            send( make({to, type, data: {selected: store_selected}}) )
        }

        function dropdown_protocol (name) {
            return send => {
                recipients[name] = send
                return get
            }
        }
    
        function get (msg) {
            const {head, refs, type, data} = msg 
            const from = head[0].split('/')[0].trim()
            send(msg)
            if (type === 'click') return handle_dropdown_menu_event(from, data)
            if (type.match(/selected|unselected/)) return handle_change_selector(data)
        }
    }

    function make_single_select () {
        return options.map((opt, index) => {
            const check_options_current = options.every(check_current_undefined)
            const check_options_selected = options.every(check_selected_undefined)
            const obj = {...opt, icon: i_icon({name: list_icon, path})}
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

    function make_multiple_select () {
        const check_options_selected = options.every(check_selected_undefined)
        return options.map((opt, index) => {
            const obj = {...opt, icon: i_icon({name: list_icon, path})}
            // console.log('selected undefined:', check_options_selected);
            if (check_options_selected) obj.selected = check_options_selected
            obj.selected = opt.selected === undefined ? true : opt.selected 
            return obj
        })
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
    i-list {
        position: absolute;
        left: 0;
        top: 40px;
        z-index: 99;
        width: 100%;
    }
    `

    return widget()
}

