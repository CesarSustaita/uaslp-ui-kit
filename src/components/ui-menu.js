import {LitElement, css, html} from 'lit';
import '@tokens/ui-tokens.css';
import '@tokens/ui-fonts.css';
import '../components/ui-list.js';
import './subcomponents/ui-menu-title.js';
import './subcomponents/ui-menu-subtitle.js';

export class UIMenu extends LitElement {
    static properties = {
        type: {type: String, reflect: true}, //de tipo List y Navegation
    };


    static styles = css `
    
    .menu-container[type="list"] {
        display: flex;
        flex-direction: column;
        border-radius: 12px;
        background: var(--background-background-component);
        gap: 2px;
        padding: 4px;
    }

    .menu-container[type="navegation"] {
        display: flex;
        flex-direction: column;
        border-radius: 12px;
        background: var(--background-background-component);
        gap: 0px;
        padding: 12px;
    }
    
  
    `;

    constructor() {
        super();
        this.type = '';
        
    }



    render() {

        return html `
            <div class="menu-container" type="${this.type}">
                <slot name="title"></slot>
                <slot></slot>
            </div>
           
        `;
    }

   

    
}
customElements.define('ui-menu', UIMenu);