import {LitElement, css, html} from 'lit';
import '@tokens/ui-tokens.css';
import '@tokens/ui-fonts.css';

export class UIAlertMSM extends LitElement {
    static properties = {
        type: { type: String },
        message: {type: String, reflect: true}, //main text 
        description: {type: String, reflect: true}, 
    };


    static styles = css `

        .msm-container {
            bottom: auto;
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            gap: 10px;
            padding: 12px;
            box-shadow: 0 7px 29px 0 rgba(100, 100, 111, 0.20);
            border-radius: 12px;
        }

        .icon-section {
            display: flex;
            align-items: center;
            gap: 10px;
            align-self: stretch;
        }

        .text-section {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            flex: 1 0 0;
            color: var(--text-default-default);
            font-family: "Open Sans";
        }

        .main-text {
            font-size: 16px;
            font-style: normal;
            font-weight: 600;
            line-height: 140%;
        }

        .description {
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 140%; 
        }

        .msm-container[type="warning"] {
            border: 2px solid var(--border-warning-secondary);
            background: var(--background-warning-tertiary );
        }
    
        .msm-container[type="negative"] {
            border: 2px solid var(--border-danger-secondary);
            background: var(--background-danger-tertiary);
        }
  
    `;

    constructor() {
        super();
        this.type = 'warning';
        this.message = '---'; 
        this.description = '---'; 
        
    }

    renderIcon() {
        const SVG_WARNING = html`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11.9998 8.99999V13M11.9998 17H12.0098M10.6151 3.89171L2.39019 18.0983C1.93398 18.8863 1.70588 19.2803 1.73959 19.6037C1.769 19.8857 1.91677 20.142 2.14613 20.3088C2.40908 20.5 2.86435 20.5 3.77487 20.5H20.2246C21.1352 20.5 21.5904 20.5 21.8534 20.3088C22.0827 20.142 22.2305 19.8857 22.2599 19.6037C22.2936 19.2803 22.0655 18.8863 21.6093 18.0983L13.3844 3.89171C12.9299 3.10654 12.7026 2.71396 12.4061 2.58211C12.1474 2.4671 11.8521 2.4671 11.5935 2.58211C11.2969 2.71396 11.0696 3.10655 10.6151 3.89171Z" stroke="#B58709" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        const SVG_NEGATIVE = html`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#5B1010" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        switch(this.type) {
            case 'warning': return SVG_WARNING;
            case 'negative': return SVG_NEGATIVE;
                default:
                return SVG_NEGATIVE;
        }
    }

    render() {

        return html`
            <div class="msm-container" type="${this.type}">
                <div class="icon-section">${this.renderIcon()}</div>
                <div class="text-section">
                    <div class="main-text">${this.message}</div>
                    <div class="description">${this.description}</div>
                </div>
            </div>
        `;
    }

}
customElements.define('ui-alert-msm',UIAlertMSM);