const bel = require('bel')
const style_sheet = require('support-style-sheet')
const message_maker = require('message-maker')
// datdot-ui dependencies
const button = require('datdot-ui-button')
const list = require('datdot-ui-list')
const i_icon = require('datdot-ui-icon')

module.exports = i_dropdown

function i_dropdown ({page = 'Demo', flow = 'ui-dropdown', name, body = {}, mode = 'single-select', theme}, protocol) {
    let {content = "Select", button_mode = '', button_icon = 'arrow-down', list_icon = 'check', path = 'assets', options } = body
    const recipients = []
    const make = message_maker(`${name} / ${flow} / ${page}`)
    const message = make({type: 'ready'})
    
    if (mode === 'single-select') {
        var arr = options ? options.map((opt, index) => {
            if (opt.current) content = opt.text
            return {
                ...opt, 
                current: opt.current || index === 0 ? true : false  , 
                selected: opt.current || opt.selected || index === 0 ? true : false, 
                icon: i_icon({name: list_icon, path})}
            }) : void 0
    } 
    else if (mode === 'multiple-select') {
        var arr = options ? options.map((opt) => {
            return {
                ...opt, 
                selected: !opt.selected ? true : opt.selected, 
                icon: i_icon({name: list_icon, path})}
            }) : void 0
    } else {
        var arr = options
    }
    
    function widget () {
        const send = protocol(get)
        send(message)
        const dropdown = document.createElement('i-dropdown')
        const shadow = dropdown.attachShadow({mode: 'closed'})
        const btn = button(
        {
            name: 'selector',
            role: 'listbox', 
            icon: i_icon({name: button_icon, path}),
            body: button_mode ? content : undefined,
            mode: button_mode,
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
                    width: '200px',
                    border_width: '1px',
                    border_color: 'var(--color-black)',
                    border_style: 'solid'
                }
            }
        }, 
        dropdown_protocol('selector'))
        const dropdown_list = list(
        {
            name: 'dropdown-list', 
            body: arr, 
            mode,
            hidden: true
        },
        dropdown_protocol('dropdown-list'))
        style_sheet(shadow, style)
        try {
            shadow.append(btn)
        } catch(e) {
            send({type: 'error', data: 'something went wrong'})
        }

        return dropdown

        function handle_change_selector (from, data) {
            if (mode !== 'single-select' || button_mode == '') return
            const message = make({to: 'selector / listbox / ui-button', type: 'changed', data: data.option, refs: [data]})
            recipients['selector'](message)
            send(message)
        }

        function handle_dropdown_menu_event (from, data) {
            const state = !data
            const type = 'expanded'
            shadow.append(dropdown_list)
            recipients['dropdown-list']( make({type, data}) )
            recipients[from]( make({to: 'dropdown-list / listbox / ui-list', type, data: state}) )
            send( make({to: 'dropdown-list / listbox / ui-list', type, data: {expanded: state }}) )
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
            if (type === 'selected') return handle_change_selector(from, data)
        }
    }

    const style = `
    :host(i-dropdown) {
        display: grid;
    }
    `

    return widget()
}

