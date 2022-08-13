const protocol_maker = require('protocol-maker')
const i_button = require('datdot-ui-button')
const i_list = require('datdot-ui-list')

var id = 0
var count = 0
const sheet = new CSSStyleSheet()
const default_opts = {
	name: 'dropdown',
	button: { name: 'button'},
	list: { name: 'list' },
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
		const $from = contacts.by_address[from]
		$parent.notify($parent.make({ to: $parent.address, type, data }))
		if (type == 'click' && $from.name === button_name) return handle_expand_collapse()
		if (type === 'update') handle_update(data)
		if (type === 'help') {
			$from.notify($from.make({ to: $from.address, type: 'help', data: { state: get_current_state() }, refs: { cause: head }}))
		}
	}
	const $parent = contacts.by_name['parent']
// -----------------------------------------
	const {
		name = default_opts.name, 
		button = default_opts.button, 
		list = default_opts.list,
		status: {
			disabled = default_opts.status.disabled,
			expanded = default_opts.status.expanded,
		} = {},
		theme = ``
	} = opts

	button.sheets = [button.theme]
	list.sheets = [list.theme]
	const current_state =  { opts: { name, button, list, status: { disabled, expanded }, sheets: [default_opts.theme, theme] } }

	const list_name = `${name}-list`
	const button_name = `${name}-button`

	const dropdown = document.createElement('i-dropdown')
	const shadow = dropdown.attachShadow({mode: 'closed'})

	dropdown.setAttribute('aria-label', name)
	if (current_state.opts.status.is_disabled) dropdown.setAttribute('disabled', current_state.opts.status.is_disabled)

	const button_el = i_button(button, contacts.add(button_name))
	const list_el = i_list(list, contacts.add(list_name))

	shadow.append(list_el)
	shadow.append(button_el)

	list_el.setAttribute('aria-hidden', !current_state.opts.status.expanded)
	if (!current_state.opts.status.expanded)  list_el.style.visibility = 'hidden'

	const custom_theme = new CSSStyleSheet()
	custom_theme.replaceSync(theme)
	shadow.adoptedStyleSheets = [sheet, custom_theme]

	return dropdown

	// HANDLERS
	async function handle_expand_collapse () {
		current_state.opts.status.expanded = !current_state.opts.status.expanded
		list_el.setAttribute('aria-hidden', !current_state.opts.status.expanded)
		if (current_state.opts.status.expanded) {
			list_el.style.visibility = 'visible'
			document.body.addEventListener('click', onbodyclick)
		} else {
			document.body.removeEventListener('click', onbodyclick)
			await new Promise(ok => setTimeout(ok, 300))
			list_el.style.visibility = 'hidden'
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
			if (current_state.opts.status.expanded) handle_expand_collapse()
	}
	function handle_update (data) {
		const { button, list, sheets } = data
		if (button) {
			const $button = contacts.by_name[button_name]
			const { text, icons, theme } = button
			if (text) current_state.opts.button.text = text
			if (icons) current_state.opts.button.icons = text
			if (theme)  {
				current_state.opts.button.sheets.push(theme)
				button.sheets = current_state.opts.button.sheets
			}
			$button.notify($button.make({ to: $button.address, type: 'update', data: button }))
		}
		if (list) {
			const { body, theme } = list
			if (body)  current_state.opts.list.body = body
			if (theme)  {
				current_state.opts.list.sheets.push(theme)
				list.sheets = current_state.opts.list.sheets
			}
			const $list = contacts.by_name[list_name]
			$list.notify($list.make({ to: $list.address, type: 'update', data: list }))

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
	function get_current_state () {
		return  {
			opts: current_state.opts,
			contacts
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

