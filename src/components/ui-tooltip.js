import {LitElement, css, html} from 'lit';
import '../tokens/ui-tokens.css';
import '../tokens/ui-fonts.css';

export class UITooltip extends LitElement {
    static properties = {
        text: { type: String },
        body: { type: String },
        position: { type: String, reflect: true }, //top/bottom/left/right
        id: { type: String,  reflect: true  },
        visible: { type: Boolean, state: true }, 

    };
    static styles = css `

    :host {
        position: relative; 
        display: inline-block;
    }

    :host([tabindex]:focus) {
        outline: 2px solid var(--border-brand-default); /* Halo de foco para accesibilidad */
        border-radius: 4px;
    }
        
    .tooltip-container {
        display: none; 
        padding: 8px;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        border-radius: 4px;
        border: 1px solid var(--border-default-disabled);
        background: var(--background-background-component);
        max-width: 250px;
        /* Shadow/lg */
        box-shadow: 0 8px 24px 0 rgba(147, 157, 165, 0.20);
        position: absolute; 
        z-index: 10;
    }

    .tooltip-container.is-visible { 
        display: inline-flex; 
    }

    .tooltip-container::before {
        content: "";
        position: absolute;
        border-width: 8px; 
        border-style: solid;
        z-index: 1;
    }

    .tooltip-container::after {
        content: "";
        position: absolute;
        border-width: 6px; 
        border-style: solid;
        z-index: 1; 
    }

    /*POSITION - TOP*/
    .tooltip-container[position="top"] {
        bottom: calc(100% + 12px); 
        left: 50%;
        transform: translateX(-50%); 
    }

    .tooltip-container[position="top"]::before { 
        top: 100%; 
        left: 50%;
        transform: translateX(-50%);
        border-color: var(--border-default-disabled) transparent transparent transparent;
    }
   

    .tooltip-container[position="top"]::after {
        top: 100%; 
        left: 50%;
        transform: translateX(-50%); 
        border-color: var(--background-background-component) transparent transparent transparent; 
    }

    /*POSITION - BUTTOM*/
    .tooltip-container[position="bottom"] {
        /* Mueve la caja a la posición absoluta inferior (si usas absolute en el host) */
        top: calc(100% + 12px); 
        left: 50%;
        transform: translateX(-50%);
    }

    .tooltip-container[position="bottom"]::before {
        bottom: 100%; 
        left: 50%;
        transform: translateX(-50%); 
        border-color: transparent transparent var(--border-default-disabled) transparent;
    }

    .tooltip-container[position="bottom"]::after {
        bottom: calc(100% - 0px); 
        left: 50%;
        transform: translateX(-50%);
        border-color: transparent transparent var(--background-background-component) transparent;
    }

    /*POSITION - RIGHT*/
    .tooltip-container[position="right"] {
        left: calc(100% + 12px); 
        transform: translateY(-30%);
    }

    /* BORDE (::before - 7px) - Apunta hacia la izquierda */
    .tooltip-container[position="right"]::before {
        top: 50%;
        right: 100%; 
        transform: translateY(-50%);
        /* Colorea el borde derecho */
        border-color: transparent var(--border-default-disabled) transparent transparent;
    }

    /* RELLENO (::after - 6px) - Apunta hacia la izquierda, mueve 1px a la derecha */
    .tooltip-container[position="right"]::after {
        top: 50%;
        right: calc(100% - 0px); 
        transform: translateY(-50%);
        /* Colorea el borde derecho */
        border-color: transparent var(--background-background-component) transparent transparent;
    }

    /*TOOLTIP LEFT*/
    .tooltip-container[position="left"] {
        left: auto; 
        right: calc(100% + 12px);  
        top: 50%;
        transform: translateY(-50%);
    }

    .tooltip-container[position="left"]::before {
        top: 50%;
        left: 100%; /* Saca el borde por la derecha */
        transform: translateY(-50%);
        border-color: transparent transparent transparent var(--border-default-disabled);
    }

    .tooltip-container[position="left"]::after {
        top: 50%;
        left: calc(100% - 0px); 
        transform: translateY(-50%);
        border-color: transparent transparent transparent var(--background-background-component);
    }

    .text {
        display: flex;
        justify-content: center;
        font-family: "Open Sans";
        color: var(--text-default-default);
        flex-direction: column;
        gap: 4px;
        position: relative;
    }

    .title {   
        text-align: center;    
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 100%; /* 14px */
        white-space: normal; 
    }

    .body-text {
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 100%; /* 14px */
    }
    
        
    `;

    constructor() {
        super();
        this.text = 'Mensaje de ayuda.'; 
        this.body = '';
        this.position = 'top';
        this.visible = false; 
        if (!this.id) {
        this.id = 'switch-' + Math.random().toString(36).substring(2, 9);
        }

        this.showBound = this.show.bind(this);
        this.hideBound = this.hide.bind(this);
    }


    render() {
        const visibilityClass = this.visible ? 'is-visible' : ''; 
       
        return html `
        
            <slot></slot> <div class="tooltip-container ${visibilityClass}" position="${this.position}">
                <div class="text">
                    <div class="title">${this.text}</div>
                    <div class="body-text">${this.body}</div>
                </div>
            </div>
       
            
        `;
    }


    connectedCallback() {
        super.connectedCallback();
          if (!this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '0'); 
            }
        this.addEventListener('mouseenter', this.showBound);
        this.addEventListener('mouseleave', this.hideBound);
        this.addEventListener('focus', this.showBound);
        this.addEventListener('blur', this.hideBound);
    }

    show(event) { 
        this.visible = true;
    }

    hide(event) {
        this.visible = false;
    }

    disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('mouseenter', this.showBound);
    this.removeEventListener('mouseleave', this.hideBound);
    this.removeEventListener('focus', this.showBound);
    this.removeEventListener('blur', this.hideBound);
    }


}
customElements.define('ui-tooltip', UITooltip);