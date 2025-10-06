import {LitElement, css, html} from 'lit';
import '../tokens/ui-tokens.css';
import '../tokens/ui-fonts.css';


export class UIDialog extends LitElement {
    static properties = {
        type: { type:String, reflect: true }, //Web o Mobile
        open: {type:Boolean, reflect: true }, //is Open?
        disableClose: {type:Boolean }, //Impide que el usuario cierre el modal haciendo clic fuera.
        id: { type: String, reflect: true },
      
        
    };
    static styles = css `

    :host {
        /* Estado inicial: El modal debe estar oculto */
        display: none;
        /* El modal debe cubrir toda la ventana, sin ser afectado por el scroll */
        position: fixed; 
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000; /* Asegura que esté por encima de casi todo */
    }

    :host([open]) { 
        display: block; 
    }

    .overlay {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2); 
        
    }
        
    .dialog-container {
        display: flex;
        width: 600px;
        max-width: 600px;
        padding: 32px;
        flex-direction: column;
        gap: 24px;
        border-radius: 10px;
        border: 1px solid var(--border-default-disabled);
        background: var(--background-background-component);
        /* Shadow/xl */
        box-shadow: 0 7px 29px 0 rgba(100, 100, 111, 0.20);
        position: relative; 
        overflow-y: auto;
    }

    .dialog-container[type="mobile"] {
        display: flex;
        width: 300px;
        max-width: 300px;
        padding: 32px;
        flex-direction: column;
        gap: 24px;
        border-radius: 10px;
        border: 1px solid var(--border-default-disabled);
        background: var(--background-background-component);
        /* Shadow/xl */
        box-shadow: 0 7px 29px 0 rgba(100, 100, 111, 0.20);
        position: relative; 
        overflow-y: auto;
    }

    .close-btn {
        position: absolute; 
        top: 8px;
        right: 8px; 
        z-index: 10; 
    }

    .text-area {
        display: flex;
        flex-direction: column;
        gap: 12px;
        font-family: "Open Sans";
        color: var(--text-default-default);
    }

    .header {
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: 150%; /* 30px */
    }

    .body-text {
        display: flex;
        flex-direction: column;
        text-align: left;
    }

    ::slotted([slot="body"]) {
        display: flex;
        flex-direction: column;
        text-align: left;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%; /* 24px */
        align-self: stretch;
    }

    .btn-area {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-self: stretch;
        flex-wrap: wrap;
    }

    .btn-area[type="mobile"] {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-self: stretch;
        flex-wrap: wrap;
        
    }

    .btn-area[type="mobile"] ::slotted([slot="footer"]) {
        display: flex;
        gap: 16px;
        flex-direction: column;
    }

    ::slotted([slot="footer"]) {
        display: flex;
        gap: 16px;
        flex-direction: row;
    }

    `;

    constructor() {
        super();
        
        this.open = false;
        this.type = 'web'; // Valor por defecto
        this.title = 'Título del Diálogo';
        this.disableClose = false;
        this.handleKeyupBound = this.handleKeyup.bind(this);
        // Genera un ID único si el usuario no lo proporciona
        if (!this.id) {
            this.id = 'dialog-' + Math.random().toString(36).substring(2, 9);
        };


    }

    close() {
        this.open = false; 
        this.dispatchCloseEvent();
    }


    render() {

        return html `
            <div class="overlay" @click="${this.handleOverlayClick}">
                <div class="dialog-container" type="${this.type}" @click="${this.handleDialogClick}">
                    <div class="close-btn">
                        <ui-icon-button  type="tertiary" @click="${this.close}"> 
                            <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </ui-icon-button>
                    </div>
                    
                    <div class="text-area">
                        <div class="header"><slot name="header"></slot></div>
                        <div class="body-text"><slot name="body"></slot></div>
                    </div>
                    <div class="btn-area" type="${this.type}">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>

        `;
    }

    handleOverlayClick() { 
        if (!this.disableClose) {
             this.open = false; // Cierra el modal
        }
    }

handleDialogClick(e) { 
    e.stopPropagation(); 
}


handleKeyup(e) {
    // se puede cerrar con la tecla escape
    if (e.key === 'Escape' && this.open && !this.disableClose) {
        this.close();
    }
}

// Método del ciclo de vida para añadir/quitar el listener
updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('open')) {
        if (this.open) {
            // Agrega el listener cuando se abre el dialog
            document.addEventListener('keyup', this.handleKeyupBound);
            this.focus(); 
        } else {
            // Quita el listener cuando se cierra el dialog
            document.removeEventListener('keyup', this.handleKeyupBound);
        }
    }
} 

dispatchCloseEvent() {
    this.dispatchEvent(new CustomEvent('modal-close', {//evento que sale
        detail: { id: this.id || this.getAttribute('id') }, // Envía el ID
        bubbles: true,
        composed: true
    }));
}



}
customElements.define('ui-dialog', UIDialog);