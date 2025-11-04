import {LitElement, css, html} from 'lit';
import '../tokens/ui-tokens.css';
import '../tokens/ui-fonts.css';

export class UInput extends LitElement {
    static properties = {
        label: { type: String },  
        description: { type: String }, 
        placeholder: { type: String },         
        disabled: { type: Boolean, reflect: true },
        error: { type: String, reflect: true },   
        value: { type: String, reflect: true },
        inputmode: { type: String } 

    };
    static styles = css `

        .input-container {
            border: 0px solid red;
            display: flex;
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
            box-sizing: border-box;
            /* Body/regular/Regular */
            font-family: "Open Sans";
            font-size: 16px;
            font-style: normal;
            font-weight: 400;

        }

        .text-area {
            border:0px solid blue;
        }

        .label-text {
            color: var(--border-default-default);
            line-height: 100%; 
        }

        .description-text {
            color: var(--border-default-secondary);
            line-height: 150%; 
        }

        .input-area {
            border:1px solid black;
            width:100%;
            display:flex;
            flex-direction: row;
            height: 44px;
            align-items: center;
            gap: 10px;
            box-sizing: border-box; 
            border-radius: 10px;
            border: 1px solid var(--border-default-tertiary);
            background: var(--background-background-component);
            padding-left: 12px;
            padding-right: 12px;
        }

        .input-field {
            border: none;
            outline: none;
            background: transparent;
            margin: 0;
            display: flex;
            height: 100%;
            align-self: stretch;
            width:100%;
            font-family: var(--font-open-sans);
            caret-color: var(--text-default-on-element-secondary);
        }

        /* 1. ESTADO DISABLED: El input */
   
        .input-field:disabled {
            border: 1px solid var(--border-default-disabled);
            background: var(--background-brand-disabled);
            border: none;
            outline: none;
            background: transparent;
        }

        /* 2. ESTADO DISABLED: El Contenedor Visual (Borde y Fondo) */
       
        /* Aplicamos los estilos al input-area cuando el input interno está deshabilitado */
        .input-area:has(.input-field:disabled) {
            border: 1px solid var(--border-default-disabled);
            background: var(--background-brand-disabled);
            
        }

        /* 3. Anulación de Hover/Focus en estado Disabled */

        /* Evita que el hover normal cambie el borde */
        .input-area:has(.input-field:disabled):hover {
            border: 1px solid var(--border-default-disabled);
            background: var(--background-brand-disabled);
            box-shadow: none;
        }

        

        /* 1. WebKit (Chrome, Safari, la mayoría de los navegadores móviles) */
        .input-field::-webkit-input-placeholder {
        border: none;
            outline: none;
            color: var(--text-default-on-element-secondary);
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 100%; /* 16px */
        }

        .input-field:disabled::-webkit-input-placeholder {
        border: none;
            outline: none;
            color: var(--border-default-disabled);
        }

        /* 2. Mozilla Firefox */
        .input-field::-moz-placeholder {
            color: var(--text-default-on-element-secondary);
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 100%; /* 16px */
        }

        /* 3. Microsoft Edge/IE */
        .input-field:-ms-input-placeholder {
            color: var(--text-default-on-element-secondary);
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 100%; /* 16px */
        }


        .input-area:hover {
            border: 1px solid var(--border-brand-default);
            background: var(--background-background-component);
            transition: border-color 0.3s ease-in-out; 
        }

        .input-area:focus-within  {
            border: 1.6px solid var(--border-brand-default);
            background: var(--background-background-component);
        }

        /* Estilo del borde y texto de error */
        
        .input-container.has-error .input-area {
            border-color: var(--border-danger-primary); /* Borde Rojo Base */
        }

        .input-container.has-error .input-area:hover {
            border-color: var(--border-danger-primary); 
            /* Si tienes un token más oscuro para el hover de error (Ej: danger-hover), úsalo */
        }

        .input-container.has-error .input-area:focus {
            border-color: var(--border-danger-primary); 
            box-shadow: 0 0 0 2px var(--border-danger-primary); /* Haz que el halo de focus sea rojo */
        }

        .error-message {
            color: var(--text-danger-default);
        }

        ::slotted([slot="icon-start"]),
        ::slotted([slot="icon-end"]) {
            color: var(--border-default-default); 

        }

        .input-area:has(.input-field:disabled) ::slotted([slot="icon-start"]),
        .input-area:has(.input-field:disabled) ::slotted([slot="icon-end"]) {
            color: var(--text-default-disabled); 
        }
        
    `;

    constructor() {
        super();
        this.label = 'Label';
        this.description = '';
        this.placeholder = 'Placeholder';
        this.error = ''; 
        this.disabled = false;
        this.value = '';
        
    }


    render() {
        
        const errorClass = this.error ? 'has-error' : ''; 

        return html `
        

            <div class="input-container ${errorClass}">
               <div class="text-area">
                    <div class="label-text">${this.label}</div>
                    ${this.description 
                    ? html`<div class="description-text">${this.description}</div>` 
                    : ''}
               </div>
               <div class="input-area" ?disabled="${this.disabled}">
                    <slot name="icon-start"></slot> 
                    <input 
                        type="text"
                        class="input-field"
                        placeholder="${this.placeholder}"
                        ?disabled="${this.disabled}"
                        inputmode="${this.inputmode}" 
                        value=${this.value}
                        @input=${this.handleInput}  @change=${this.handleInput}
                    >
                    </input>
                    <slot name="icon-end"></slot> 
               </div>

                ${this.error 
                    ? html`<span class="error-message">${this.error}</span>` 
                    : ''}
                
            </div>  
        `;        
    }

    handleInput(event) {
            event.stopPropagation();
            if (this.disabled) {
                return;
            }
            
            // 2. Obtiene el valor actual del input interno
            const value = event.target.value;
            
            // 3. Re-emite el evento con el valor actual.
            // event.type será 'input' o 'change', dependiendo de dónde vino el evento nativo
            this.dispatchEvent(new CustomEvent(event.type, {
                detail: {
                    value: value,
                },
                bubbles: true,
                composed: true
            }));
        }

   
    
}

customElements.define('ui-input', UInput);