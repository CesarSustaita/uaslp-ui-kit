import {LitElement, css, html} from 'lit';
import '../tokens/ui-tokens.css';
import '../tokens/ui-fonts.css';

export class UINavigationBtn extends LitElement {
    static properties = {
       type: {type: String, reflect: true}, //previous, next
       disabled: { type: Boolean, reflect: true },
       label: { type: String }, 
       id: { type: String, reflect: true },

    };
    static styles = css `

    button {
        white-space: nowrap;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        background: none; 
        border: none; 
        padding: 0; 
        margin: 0;
    }

    button {
        display: inline-flex;
        padding: 4px 8px;
        justify-content: center;
        align-items: center;
        gap: 8px;
        border-radius: 10px;
        cursor: pointer;
        background: var(--background-background-component); 
        color: var(--text-default-default);
        text-align: center;
        /* Body/regular/Regular */
        font-family: "Open Sans";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 100%; /* 16px */   
    }

    button:hover {
        color: var(--text-default-on-element-primary);
        background: var(--background-brand-default-hover);
    }

    button:disabled {
        color: var(--Text-Default-Disabled, #BFBFBF);
    }

    button:disabled:hover {
        color: var(--text-default-disabled); 
        background: var(--background-background-component); 
        cursor: default;
    }
    
        
    `;

    constructor() {
        super();
        this.disabled = false;
        this.type = 'previous';
        this.label = '';
        if (!this.id) {
            this.id = 'navBtn-' + Math.random().toString(36).substring(2, 9);
        };
    }

    

    renderArrow() {
        const SVG_PREVIOUS = html`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        const SVG_NEXT = html`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        if(this.type === 'previous') {
            return html`${SVG_PREVIOUS}`;
        }
        return html`${SVG_NEXT}`

    }
   
    getText() {
        if (this.label) {
            return this.label;
        }
        return this.type === 'previous' ? 'Previous' : 'Next';
    }


    render() {
        const typeClass = this.type;
        const buttonText = html`<slot>${this.getText()}</slot>`;
        const content = this.type === 'previous' 
        ? html`${this.renderArrow()} ${buttonText}`
        : html`${buttonText} ${this.renderArrow()}`;

        return html `
           <button class="${typeClass}" ?disabled=${this.disabled}  @click=${this.handleClick}> ${content} </button>
        `;
    }

    handleClick(event){
    if(this.disabled){
      event.stopPropagation();
      return;
    }

    this.dispatchEvent(new CustomEvent('click-navigation',{ //event name
      detail: { 
        id: this.id || this.getAttribute('id'),
        action: this.type
        },
      bubbles: true,
      composed: true
    }));
  }
 
}
customElements.define('ui-navigation-btn', UINavigationBtn);