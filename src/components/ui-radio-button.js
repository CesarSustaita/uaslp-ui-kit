import {LitElement, css, html} from 'lit';
import '../tokens/ui-tokens.css';
import '../tokens/ui-fonts.css';

export class UIRadioButton extends LitElement {
    static properties = {
        checked: { type: Boolean, reflect: true },
        disabled: { type: Boolean, reflect: true },
        name: { type: String,  reflect: true  },
        id: { type: String,  reflect: true  } 
    };
    static styles = css `
        
    .hidden-input {
        position: absolute;
        opacity: 0;
        cursor: default;
        height: 0;
        width: 0;
    }

    .container {
        display: flex;
        width: 32px;
        height: 32px;
        padding: 10px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        aspect-ratio: 1/1;
        border-radius: 1000px;
        white-space: nowrap;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
    }

    .radio-label {
        display: flex;
        width: 20px;
        height: 20px;
        border-radius: 100px;
        padding: 4px; 
        border: 1.6px solid var(--border-default-secondary);
        transition: all 0.1s ease-in-out;
        align-items: center;
        justify-content: center;
        cursor: pointer; 
    }

    .container:hover {
        background: var(--background-brand-secondary);
        transition: all 0.2s ease-in-out;
    }

    /* Ocultar el icono por defecto */
    .icon-check {
        display: none;
        width: 20px;
        height: 20px;
        border-radius: 100px;
    }

    /* Estilo para el estado 'checked' */
    .hidden-input:checked + .radio-label .icon-check {
        display: block;
        background: var(--background-brand-default);
    }

    /* Se muestra el icono solo cuando el checkbox está 'checked' */
    .hidden-input:checked + .radio-label .icon-check {
        display: block;
    }

    /* Estilos para el estado deshabilitado */
    .hidden-input:disabled + .radio-label  {
        cursor: default;
        background: var(--background-background-component);
        border: 1.6px solid var(--border-default-disabled);
    }

    :host([disabled]) .container:hover {
        background: var(--background-background-component);
        cursor: default;
    }

    .hidden-input:checked:disabled + .radio-label .icon-check {
        background: var(--background-brand-default-disabled); 
    }

    `;

    constructor() {
        super();
        this.checked = false;
        this.disabled = false;

        if (!this.id) {
        this.id = 'radio-' + Math.random().toString(36).substring(2, 9);
        }
    }


    render() {
        return html `
            <div class="container" >
            <input
                type="radio"
                id=${this.id}
                class="hidden-input"
                name=${this.name || 'default-radio'} .checked=${this.checked}
                ?disabled=${this.disabled}
                @change=${this.handleChange}
            />
            <label for=${this.id} class="radio-label">
                <div class="icon-check"> </div>
            </label>
        </div>

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
            name: this.name,
            id: this.id,
        },
        bubbles: true,
        composed: true
    }));
}
}
customElements.define('ui-radio-button', UIRadioButton);