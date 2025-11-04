import {LitElement, css, html} from 'lit';
import '../tokens/ui-tokens.css';
import '../tokens/ui-fonts.css';


export class UIList extends LitElement {
    static properties = {
        text: { type: String },
        description: { type: String },
        id: { type: String, reflect: true },
        disabled: { type: Boolean, reflect: true  },
        
    };
    static styles = css `
        
    .list-container {
        display: flex;
        padding: 10px;
        flex-direction: row;
        align-items: flex-start;
        justify-content:space-between; 
        gap: 10px;
        border-radius: 10px;
        border: 1px solid var(--background-background-component);
        background: var(--background-background-component);
        -webkit-tap-highlight-color: transparent;
    }

    .list-container:not([disabled]):hover {
        border-radius: 10px;
        border: 1px solid var(--border-brand-disabled);
        background: var(--background-brand-secondary-disabled);
        transition: border-color 0.2s ease-in-out; 
        cursor: pointer;
    }

    .text-element {
        display: flex;
        flex-direction: column;
        width: 100%;
        font-family: "Open Sans";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%; /* 24px */
        border: 0px solid black;
        
    }

    .list-item {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        align-self: stretch;
        overflow: hidden;
        color: var(--text-default-default);
        text-overflow: ellipsis;
    }
    
    .description {
        overflow: hidden;
        color: var(--text-default-secondary);
        text-overflow: ellipsis;
    }

    :host([disabled]) .list-item,
    :host([disabled]) .description,
    :host([disabled]) .end-element {
        color: var(--text-default-disabled);
        stroke: var(--text-default-disabled); 
    }
    
    .first-element {
        display: flex;
        justify-content: center;
        align-items: center;
        align-self: stretch;
    }

    .end-element {
        display: flex;
        justify-content: center;
        align-items: center;
        align-self: stretch;
    }

    :host([disabled]) ::slotted(svg[slot="end-element"]),
    :host([disabled]) .end-element ::slotted(svg),
    :host([disabled]) ::slotted(span[slot="end-element"]) {
        color: var(--text-default-disabled) !important; 
        stroke: var(--text-default-disabled) !important; 
    }

    ::slotted([slot="start-element"]) svg {
        color: var(--text-default-default);
    }

    ::slotted([slot="end-element"]) svg {
        color: var(--text-default-default);
    }

    /* Si el usuario inserta el SVG directamente (sin un <div> envolviéndolo) */
    ::slotted(svg[slot="end-element"]) {
        color: var(--text-default-default,);
        width: 24px;
        height: 24px;
    }

    /*texto*/
    ::slotted(span[slot="end-element"]) {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        flex: 1 0 0;
        overflow: hidden;
        color: var(--text-default-default);
        text-overflow: ellipsis;
        
        /* Body/regular/Semi bold */
        font-family: "Open Sans";
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 100%; /* 16px */
    }

    `;

    constructor() {
        super();
        
        this.text= 'List Item';
        this.description= '';
        this.disabled = false;

         if (!this.id) {
            this.id = 'list-' + Math.random().toString(36).substring(2, 9);
        }
    }


    render() {

        return html `
           <div class="list-container" @click=${this.handleItemClick} ?disabled=${this.disabled}>
            <div class="first-element">
                <slot name="start-element"></slot>
            </div>
            <div class="text-element">
                <div class="list-item">${this.text}</div>
                <div class="description">${this.description}</div>
            </div>
            <div class="end-element">
                <slot name="end-element"></slot>
            </div>
           </div>

        `;
    }

    handleItemClick(event) {
        if (event.target !== event.currentTarget) {
            return;
        }
        
       if (this.disabled) {
        return;
        }
    
    this.dispatchEvent(new CustomEvent('list-item-click', {//evento
        detail: { 
            id: this.id || this.getAttribute('id'),
        },
        bubbles: true,
        composed: true
    })); 
    }


}
customElements.define('ui-list', UIList);