import {LitElement, css, html} from 'lit';
import '../tokens/ui-tokens.css';
import '../tokens/ui-fonts.css';

export class UITab extends LitElement {
    static properties = {
        // Estado visual: controlado por el componente padre (UITabList)
        active: { type: Boolean, reflect: true }, 
        // Identificador único para enlazar con el contenido (Panel)
        name: { type: String, reflect: true }, 
        // Texto/Título de la pestaña
        label: { type: String },
        // Variante: 'default' | 'icon-only' | 'text-only'
        variant: { type: String, reflect: true }

    };
    static styles = css `
        
        .tab-container {
            white-space: nowrap; 
            cursor: pointer;
            background: none;
            border: none;
            display: flex;
            padding: 8px 24px;
            justify-content: center;
            align-items: center;
            gap: 10px;
            border-bottom: 1px solid var(--border-brand-disabled);
            background: var(--background-background-component);
            color: var(--text-default-default);
            font-family: "Open Sans";
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 100%; /* 16px */
            user-select: none; 
            -webkit-user-select: none; 
            -webkit-tap-highlight-color: transparent;
        }

        :host([active]) .tab-container {
            color: var(--text-brand-default);
            border-bottom: 1px solid var(--Border-Brand-Default, #004A98);
            background: var(--Background-Background-Component, #FDFDFE);
        }

        .data {
            display: flex;
            gap: 8px;
        }


        .tab-container:hover:not(:host([active]) .tab-container) {
            cursor: pointer;
            border-bottom: 1px solid var(--border-brand-default);
            background: var(--background-brand-secondary);
            color: var(--text-brand-default);
        }

    

        
    `;

    constructor() {
        super();
        this.active = false;
        this.name = '';
        this.label = 'Tab';
        this.variant = 'default';

        if (!this.id) {
        this.id = 'switch-' + Math.random().toString(36).substring(2, 9);
        }
    }


    render() {

        const labelText = (this.variant !== 'icon-only') ? this.label : null;
        const iconSlot = (this.variant !== 'text-only') ? html`<slot name="icon"></slot>`: null;

        return html `
            <button class="tab-container" 
            @click="${this.handleClick}"
            role="tab"  
            aria-selected="${this.active ? 'true' : 'false'}" 
            tabindex="${this.active ? '0' : '-1'}" 
            >
                <div class="data">
                    ${iconSlot}
                    ${labelText}
                </div>
            </button>
        `;
    }

    handleClick() {
        this.dispatchEvent(new CustomEvent('tab-select', {
            detail: { tabName: this.name }, 
            bubbles: true,
            composed: true 
        }));
    }

    
}
customElements.define('ui-tab', UITab);