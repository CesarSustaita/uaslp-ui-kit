import {LitElement, css, html} from 'lit';
import '@tokens/ui-tokens.css';
import '@tokens/ui-fonts.css';


export class UIMenuTitle extends LitElement {
    static properties = {
        label: { type: String }
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
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: 150%; /* 27px */
    }
  
    `;

    constructor() {
        super();
        this.label = 'Title section';      
    }

    render() {

        return html`<slot>${this.label}</slot>`;
    }

}
customElements.define('ui-menu-title',UIMenuTitle);