import {LitElement, css, html} from 'lit';
import '../tokens/ui-tokens.css';
import '../tokens/ui-fonts.css';

export class UIAccordion extends LitElement {
    static properties = {
        title: {type: String, reflect: true},
        label: {type: String, reflect: true}, 
        open: { type: Boolean, reflect: true},
        name: { type: String, reflect: true}, 

    };
    static styles = css `
        details {
            display: block;
            padding: 0px;
            margin: 0; 
            width:100%;
            flex-direction: column;
            align-items: flex-start;
            border-radius: 12px;
            border: 1px solid var(--border-default-disabled);
            background: var(--background-background-component);
            cursor: pointer;
            caret-color: transparent;
            font-family: "Open Sans";
            color: var(--text-default-default);
            -webkit-tap-highlight-color: transparent; 
        }

        summary {
            list-style: none;
            list-style-type: none;
            margin: 0; 
            padding: 14px;
            display: flex;
            flex-direction: row;
            width:100%;
            box-sizing: border-box;
            border: 0px solid black;
            display: flex;
            justify-content: space-between; 
            text-align:center;
            align-items: center;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            -webkit-tap-highlight-color: transparent;
            outline: none;
            overflow: hidden;
            font: var(--body-base);
            font-weight: var(--font-weight-bold);
        }
        
        summary::marker { //compatibilidad con firefox
            display: none;
            content: ""; 
        }

        .label-text {
            padding: 0 14px 14px 14px;
            font: var(--body-base);
            font-weight: var(--font-weight-regular);
            max-height: 0; 
            overflow: hidden;
            transition: max-height 0.4s ease-in-out, padding-top 0.4s ease-in-out, padding-bottom 0.4s ease-in-out;
        }

        .toggle-icon {
            transition: transform 0.3s ease; 
            transform: rotate(0deg); 
        }

        details[open] .toggle-icon {
            transform: rotate(180deg); 
        }
        
        details[open] .label-text {
            max-height: 500px; 
        }

        
    `;

    constructor() {
        super();
        this.title = 'Title',
        this.label = 'Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes.',
        this.open = false,
        this.name = 'accordion'
        
    }

    render() {
        
        return html `
        
        <details ?open="${this.open}" name="${this.name}">
          <summary>
          ${this.title}
          <span class="toggle-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 9L12 15L18 9" stroke="CurrentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          </summary>
          <div class="label-text">${this.label}</div>
        </details>
           
        `;
    }

 
 
}
customElements.define('ui-accordion', UIAccordion);