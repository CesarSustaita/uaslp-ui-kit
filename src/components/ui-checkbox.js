import {LitElement, css, html} from 'lit';
import '../tokens/ui-tokens.css';
import '../tokens/ui-fonts.css';

export class UICheckbox extends LitElement {
    static properties = {
        active: { type: Boolean, reflect: true },
        disabled: { type: Boolean, reflect: true },
        id: { type: String, reflect: true } 
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
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        width: 32px;
        height: 32px;
        cursor: pointer;
        transition: background 0.1s ease-in-out;
        white-space: nowrap;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
    }

    .checkbox-label {
        display: flex;
        width: 20px;
        height: 20px;
        border-radius: 6px;
        border: 1.6px solid var(--border-default-secondary);
        transition: all 0.1s ease-in-out;
        align-items: center;
        justify-content: center;
        cursor: pointer; 
    }

    .container:hover {
        background: var(--background-brand-secondary);
        transition: all 0.s ease-in-out;
    }

    /* Ocultar el icono por defecto */
    .icon-check {
        display: none;
    }

    /* Estilo para el estado 'checked' */
    .hidden-input:checked + .checkbox-label {
        border-color: var(--background-brand-default);
        background-color: var(--background-brand-default);
    }

    /* Se muestra el icono solo cuando el checkbox está 'checked' */
    .hidden-input:checked + .checkbox-label .icon-check {
        display: block;
    }

    /* Estilos para el estado deshabilitado */
    .hidden-input:disabled + .checkbox-label  {
        cursor: default;
        background: var(--background-background-component);
        border: 1.6px solid var(--border-default-disabled);
    }

    :host([disabled]) .container:hover {
        background: var(--background-background-component);
        cursor: default;
    }

    /* Estilos para el estado deshabilitado y activado */
    .hidden-input:checked:disabled + .checkbox-label {
        background: var(--background-brand-default-disabled);
        border-color: var(--background-brand-default-disabled);
    }
  
    `;

    constructor() {
        super();
        this.active = false;
        this.disabled = false;

        if (!this.id) {
            this.id = 'checkbox-' + Math.random().toString(36).substring(2, 9);
        }
    }


    render() {
        return html `
            <div class="container">
                <input
                    type="checkbox"
                    id=${this.id} 
                    class="hidden-input"
                    .checked=${this.active}
                    ?disabled=${this.disabled}
                    @change=${this.handleChange}
                />
                <label for=${this.id}  class="checkbox-label">
                    <span class="icon-check">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
                            <path d="M12.3334 1L5.00008 8.33333L1.66675 5" stroke="var(--border-default-on-element-primary)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                </label>
            </div>
        `;
    }

    handleChange(event) {
    if (this.disabled) {
        return;
    }
    
    this.active = event.target.checked;

    this.dispatchEvent(new CustomEvent('change', { //event name
        detail: {
            active: this.active
        },
        bubbles: true,
        composed: true
    }));
}
}
customElements.define('ui-checkbox', UICheckbox);