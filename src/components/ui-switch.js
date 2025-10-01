import {LitElement, css, html} from 'lit';
import '../tokens/ui-tokens.css';
import '../tokens/ui-fonts.css';

export class UISwitch extends LitElement {
    static properties = {
        checked: { type: Boolean, reflect: true },
        disabled: { type: Boolean, reflect: true },
        id: { type: String,  reflect: true  } 

    };
    static styles = css `
        .switch-input {
            display: none;
        }

        .switch-label {
            display: flex;
            width: 48px;
            height: 24px;
            padding: 2px;
            align-items: center;
            border-radius: 40px;
            position: relative;
            cursor: pointer;
            border: 1px solid var(--border-default-tertiary);
            background: var(--background-neutro-tertiary);
            transition: background 0.2s ease-in-out;
            white-space: nowrap;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
        }

        .switch-label::after {
            content: '';
            display: block;
            width: 26px;
            height: 26px;
            background-color: var(--background-neutro-secondary); 
            border-radius: 50%;
            position: absolute;
            left: 1px;
            transition: transform 0.4s ease-in-out;
        }

        /* Estado Encendido */
        .switch-input:checked + .switch-label {
            background-color: var(--background-brand-default);
            border-color: var(--background-brand-default);
        }

        .switch-input:checked + .switch-label::after {
            transform: translateX(24px);
            background-color: var(--background-brand-tertiary); 
        }

        .switch-input:checked + .switch-label:hover {
            background-color: var(--background-brand-default-hover); 
            border-color: var(--background-brand-default-hover);
        }

        .switch-label:hover {
            border: 1px solid var(--border-default-tertiary);
            background: var(--background-neutro-tertiary-hover);
        }
        
        
        /* Estado Deshabilitado */
        .switch-input:disabled + .switch-label {
            cursor: default;
            border: 1px solid var(--border-default-disabled);
            background: var(--background-background-component);
            
        }

        .switch-input:disabled + .switch-label::after {
            background-color: var(--background-neutro-default-disabled);
        }

        .switch-input:checked:disabled + .switch-label{
            cursor: default;
            border: 1px solid var(--border-default-disabled);
            background: var(--background-background-component);
        }

        .switch-input:checked:disabled + .switch-label::after {
            background-color: var(--background-neutro-default-disabled);
        }

        
    `;

    constructor() {
        super();
        this.checked = false;
        this.disabled = false;

        if (!this.id) {
        this.id = 'switch-' + Math.random().toString(36).substring(2, 9);
        }
    }


    render() {
        return html `
            <input 
                type="checkbox" 
                id=${this.id}
                class="switch-input" 
                .checked=${this.checked}
                ?disabled=${this.disabled}
                @change=${this.handleChange}
            />
            <label for=${this.id} class="switch-label"></label>
        `;
    }

    handleChange(event) {
    if (this.disabled) {
        return;
    }
    
    this.checked = event.target.checked;

    this.dispatchEvent(new CustomEvent('change', { //event name
        detail: {
            checked: this.checked,
            id: this.id,
        },
        bubbles: true,
        composed: true
    }));
}
}
customElements.define('ui-switch', UISwitch);