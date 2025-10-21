import {LitElement, css, html} from 'lit';
import '@tokens/ui-tokens.css';
import '@tokens/ui-fonts.css';


export class UIMenuSubtitle extends LitElement {
    static properties = {
        label: { type: String },
        divisor: { type: Boolean }

    };


    static styles = css `
     
    :host {
        display: flex;
        height: 44px;
        justify-content: left;
        align-items: center;
        gap: 10px;
        color: var(--border-default-default);
        /* Txt/medium/Semi bold */
        font-family: "Open Sans";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%; /* 27px */
    }

    :host([divisor]) { 
        border-top: 1px solid var(--border-default-disabled); 
        margin-top: 2px;
    }
  
    `;

    constructor() {
        super();
        this.label = 'Subtitle section';   
        this.Boolean = false;   
    }

    render() {

        return html`<slot>${this.label}</slot>`;
    }

}
customElements.define('ui-menu-subtitle',UIMenuSubtitle);