import {LitElement, css, html} from 'lit';
import '@tokens/ui-tokens.css';
import '@tokens/ui-fonts.css';


export class UINotification extends LitElement {
    static properties = {
        type: {type: String, reflect: true}, //info, success, warning, error
        message: {type: String, reflect: true}, //main text 
        description: {type: String, reflect: true}, 
        duration: {type: Number, reflect: true}, 
        open: {type: Boolean, reflect:true},
        removable: {type: Boolean, reflect:true},
        position: {type: String, reflect: true} //TR - Top-Right, TL- Top-Left, BR- Bottom-Right, BL- Bottom-Left, TC- Top-Center, BC- Bottom-Center
    };


    static styles = css `
   
  
        .notification-container {
            display: block;
            position: fixed;
            z-index: 1000;
            opacity: 0; 
            top: auto;
            left: auto;
            right: auto;
            bottom: auto;
            display: flex;
            flex-direction: row;
            max-width: 650px;
           
            align-items: flex-start;
            gap: 10px;
            padding: 12px;
            box-shadow: 0 7px 29px 0 rgba(100, 100, 111, 0.20);
            border-radius: 12px;
            -webkit-tap-highlight-color: transparent;
            
        }

        .notification-container[open] {
            opacity: 1;
        }


        .notification-container[position="TR"] {
            top: 50px; 
            right: 30px; 
            left: auto;
            transform: none;
            
        }

        .notification-container[position="TC"] {
            top: 50px; 
            bottom: auto;
            left: 50%; 
            right: auto;
            transform: translateX(-50%);
        }

        .notification-container[position="TL"] {
            top: 50px; 
            right: auto; 
            left: 30px;
            transform: none;
        }

        .notification-container[position="BR"] {
            bottom: 50px; 
            right: 30px; 
            left: auto;
            transform: none;
        }

        .notification-container[position="BC"] {
            bottom: 50px; 
            top: auto; 
            left: 50%; 
            right: auto;
            transform: translateX(-50%);
        }

        .notification-container[position="BL"] {
            bottom: 50px; 
            right: auto; 
            left: 30px;
            transform: none;
        }

        @media (max-width: 700px) {
            .notification-container {
                max-width: 90%;   
            }

            .notification-container[position="TR"] {
                top: 20px; 
                right: auto; 
                left: 15px;
                transform: none;
            
            }
    
            .notification-container[position="TC"] {
                top: 50px; 
                bottom: auto;
                left: 50%; 
                right: auto;
                width: 90%;
                transform: translateX(-50%);
            }
    
            .notification-container[position="TL"] {
                top: 20px; 
                right: auto; 
                left: 15px;
                transform: none;
            }
    
            .notification-container[position="BR"] {
                bottom: 50px; 
                right: 15px; 
                left: auto;
                transform: none;
            }
    
            .notification-container[position="BC"] {
                bottom: 50px; 
                top: auto; 
                left: 50%; 
                right: auto;
                width: 90%;
                transform: translateX(-50%);
            }
    
            .notification-container[position="BL"] {
                bottom: 50px; 
                right: auto; 
                left: 15px;
                max-width: 90%;
                transform: none;
            }
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

        .icon-removable {
            display: flex;
            align-items: center;
            gap: 10px;
            align-self: stretch;
        }

        .notification-container[type="info"] {
            border: 2px solid var(--text-brand-default);
            background: var(--background-brand-secondary);
        }

        .notification-container[type="warning"] {
            border: 2px solid var(--border-warning-secondary);
            background: var(--background-warning-tertiary );
        }

        .notification-container[type="positive"] {
            border: 2px solid var(--border-positive-secondary);
            background: var(--background-positive-tertiary);
        }

        .notification-container[type="negative"] {
            border: 2px solid var(--border-danger-secondary);
            background: var(--background-danger-tertiary);
        }

        :host([removable]) .notification-container:hover[type="info"] {
            border: 2px solid var(--text-brand-default);
            background: var(--background-brand-secondary-hover);
            cursor:pointer;
        }

        :host([removable]) .notification-container:hover[type="warning"] {
            border: 2px solid var(--border-warning-secondary);
            background: var(--background-warning-tertiary-hover);
            cursor:pointer;
        }

        :host([removable]) .notification-container:hover[type="positive"] {
            border: 2px solid var(--border-positive-secondary);
            background: var(--background-positive-tertiary-hover);
            cursor:pointer;
        }

        :host([removable]) .notification-container:hover[type="negative"] {
            border: 2px solid var(--border-danger-secondary);
            background: var(--background-danger-tertiary-hover);
            cursor:pointer;
        }

        button {
           all: unset; 
            appearance: none;
            -webkit-appearance: none;
            border: none;
            background: none;
            padding: 0;
            margin: 0;
            cursor: pointer;
            display: inline-flex; 
            -webkit-tap-highlight-color: transparent;
            white-space: nowrap; 
        }

  
    `;

    constructor() {
        super();
        this.type = 'info'; //default
        this.message = 'Text'; //Indica que es necesario un primer txt
        this.description = ''; //no es obligatorio
        this.duration = 4000; //Segundos Por defecto
        this.timer = null; //solo para guardar el temporizador
        this.open = undefined;
        this.removable = false; //para activar el cancel btn
        this.position = 'TR' //TR - Top-Right (DEFAULT), TL- Top-Left, BR- Bottom-Right, BL- Bottom-Left, TC- Top-Center, BC- Bottom-Center
        
    }

    renderIcon() {
        const SVG_INFO = html`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#004A98" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        const SVG_WARNING = html`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11.9998 8.99999V13M11.9998 17H12.0098M10.6151 3.89171L2.39019 18.0983C1.93398 18.8863 1.70588 19.2803 1.73959 19.6037C1.769 19.8857 1.91677 20.142 2.14613 20.3088C2.40908 20.5 2.86435 20.5 3.77487 20.5H20.2246C21.1352 20.5 21.5904 20.5 21.8534 20.3088C22.0827 20.142 22.2305 19.8857 22.2599 19.6037C22.2936 19.2803 22.0655 18.8863 21.6093 18.0983L13.3844 3.89171C12.9299 3.10654 12.7026 2.71396 12.4061 2.58211C12.1474 2.4671 11.8521 2.4671 11.5935 2.58211C11.2969 2.71396 11.0696 3.10655 10.6151 3.89171Z" stroke="#B58709" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        const SVG_POSITIVE = html`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#15833C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        const SVG_NEGATIVE = html`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#5B1010" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        switch(this.type) {
            case 'positive': return SVG_POSITIVE;
            case 'warning': return SVG_WARNING;
            case 'negative': return SVG_NEGATIVE;
            case 'info':
                default:
                return SVG_INFO;
        }
    }

    renderCancelBtn() {

        const SVG_CANCELBTN = html`
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="#222222" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        if (!this.removable) {
            return html``;
        }

        return html`
            <button class="close-btn" @click="${this.close.bind(this)}">
                ${SVG_CANCELBTN}
            </button>
        `;

    }

    close() {
        this.open = false;
        clearTimeout(this.timer);

        const animationDuration = 500;
    
        setTimeout(() => {
            if (this.parentNode) {
                this.remove(); 
            }
        }, animationDuration);
    }

    update(changedProperties) {
        super.update(changedProperties);

        if(changedProperties.has('open') && this.open === true) {
            clearTimeout(this.timer);

            this.timer = setTimeout(() => {    
              
                this.close();
                
            }, this.duration);
        }
        if(changedProperties.has('open') && this.open === false) {
            clearTimeout(this.timer);
        }
    }


    render() {

        return html `
            <div class="notification-container" type="${this.type}" position="${this.position}" ?open="${this.open}">
                <div class="icon-section">${this.renderIcon()}</div>
                <div class="text-section">
                    <div class="main-text">${this.message}</div>
                    <div class="description">${this.description}</div>
                </div>
                <div class="icon-removable">${this.renderCancelBtn()}</div>
            </div>
           
        `;
    }

   

    
}
customElements.define('ui-notification', UINotification);