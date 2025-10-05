import {LitElement, css, html} from 'lit';
import '../tokens/ui-tokens.css';
import '../tokens/ui-fonts.css';
import '../components/ui-button';
import '../components/ui-icon-button';

export class UICard extends LitElement {
    static properties = {
        imageUrl: { type: String },
        type: {type: String, reflect: true  }, //vertical horizontal
        size: {type: String }, //default, small
        isInteractive: { type: Boolean, reflect: true },
        id: { type: String, reflect: true },
        
    };
    static styles = css `
        
        .card-container{
            border:0px solid black;
            padding: 20px;
            display:flex;
            flex-direction:column;
            gap: 24px;
            border-radius: 16px;
            background: var(--background-background-component);
            /* Shadow/xs */
            box-shadow: 0 2px 8px 0 rgba(99, 99, 99, 0.20);
            user-select: none;
            -webkit-tap-highlight-color: transparent; 
        }


        .card-container[type="horizontal"] {
            border:0px solid black;
            padding: 20px;
            display:flex;
            flex-direction:row;
            gap: 16px;
            border-radius: 16px;
            background: var(--background-background-component);
            /* Shadow/xs */
            box-shadow: 0 2px 8px 0 rgba(99, 99, 99, 0.20);

        }

        .card-container[size="small"] {
            border:0px solid black;
            padding: 14px;
            display:flex;
            flex-direction:column;
            gap: 16px;
            border-radius: 16px;
            background: var(--background-background-component);
            /* Shadow/xs */
            box-shadow: 0 2px 8px 0 rgba(99, 99, 99, 0.20);
        }

        .card-container[size="small"][type="horizontal"] {
            border:0px solid black;
            padding: 14px;
            display:flex;
            flex-direction:row;
            gap: 16px;
            border-radius: 16px;
            background: var(--background-background-component);
            /* Shadow/xs */
            box-shadow: 0 2px 8px 0 rgba(99, 99, 99, 0.20);
        }


        .card-container.is-interactive:hover {
            background: var(--background-brand-tertiary-hover);
            cursor: pointer;
        }

        .image-area {
            height: 155px; 
            width: 100%;
            min-width: 155px; 
            background-image: var(--card-image-url);
            background-size: cover;          
            background-position: center;     
            background-repeat: no-repeat;
            border-radius: 10px;
            overflow: hidden; 
        }

        .image-area[type="horizontal"] {
            height: 155px; 
            width: 100%;
            min-width: 155px; 
            flex-shrink: 0;
            background-image: var(--card-image-url);
            background-size: cover;          
            background-position: center;     
            background-repeat: no-repeat;
            border-radius: 10px;
            overflow: hidden; 
        }

        .image-area[size="small"] {
            height: 145px; 
            width: 100%;
            min-width: 145px; 
            background-image: var(--card-image-url);
            background-size: cover;          
            background-position: center;     
            background-repeat: no-repeat;
            border-radius: 10px;
            overflow: hidden; 
        }


        .position-area {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .position-area[size="small"] {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .position-area[type="horizontal"]  {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border:0px solid red
        }


        .text-area {
            gap:4px;
            font-family: "Open Sans";
            font-style: normal;
        }

        ::slotted([slot="title"]) {
            color: var(--text-default-default);

            /* Heading/H6 - xs */
            font-size: 20px;
            font-weight: 700;
            line-height: 150%; /* 30px */
        }

        ::slotted([slot="description"]) {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            align-self: stretch;
            overflow: hidden;
            color: var(--border-default-secondary);
            text-overflow: ellipsis;

            /* Txt/small/Regular */
            
            font-size: 14px;
            font-weight: 400;
            line-height: 150%; /* 21px */
        }

        ::slotted([slot="footer"]) {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 8px;
            align-self: stretch;
        }

    `;

    constructor() {
        super();
        this.imageUrl = '';
        this.type = 'vertical';
        this.size = 'default';
        this.isInteractive = false;

         if (!this.id) {
            this.id = 'card-' + Math.random().toString(36).substring(2, 9);
        }
    }


    render() {

        const interactiveClass = this.isInteractive ? 'is-interactive' : ''; 
        this.style.setProperty('--card-image-url', `url("${this.imageUrl}")`);

        return html `
            <div class="card-container  ${interactiveClass} " 
                type="${this.type}"    
                size="${this.size}"   
                @click=${this.handleClick}>

                ${this.imageUrl ? html`<div class="image-area" size="${this.size}" ></div>` : ''}
                <div class="position-area" size="${this.size}" type="${this.type}">
                    <div class="text-area">
                        <slot name="title" ></slot>
                        <slot name="description" ></slot>
                    </div>
                        <slot name="footer" ></slot>
                </div>
                
                
            </div>

        `;
    }

    handleClick() {

    if (this.isInteractive) {
        this.dispatchEvent(new CustomEvent('card-click', { //evento
            detail: { id: this.id || this.getAttribute('id') },
            bubbles: true,
            composed: true
        }));
    }
}


}
customElements.define('ui-card', UICard);