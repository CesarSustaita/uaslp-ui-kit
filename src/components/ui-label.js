import {LitElement, css, html} from 'lit';
import '../tokens/ui-tokens.css';
import '../tokens/ui-fonts.css';

//Import components Checkbox, Radio and switch
import { UICheckbox } from './ui-checkbox.js';
import { UISwitch } from './ui-switch.js';
import { UIRadioButton } from './ui-radio-button.js';

export class UILabel extends LitElement {
    static properties = {
        type: { type: String }, //checkbox, switch, radio
        label: { type: String },
        checked: { type: Boolean, reflect: true  },
        id: { type: String,  reflect: true  }, //for radio button
        disabled: { type: Boolean, reflect: true  },
        name: { type: String, reflect: true  }, // para agrupar Radio Buttons


    };
    static styles = css `

    .label-container {
        display: flex;
        flex-direction: row; 
        gap: 10px;
        width: 100%;
    }

    .label-container.is-switch {
        display: flex;
        order: 2;
        gap: 16px;
        justify-content: space-between;
    }
    
    .text-area {
        display: flex;
        flex-direction: column;
        margin-top:4px;
        cursor: pointer; 
        -webkit-user-select: none; 
        -moz-user-select: none;    
        -ms-user-select: none;  
        user-select: none; 
        -webkit-tap-highlight-color: transparent;
    }

    :host([disabled]) .text-area {
            cursor: default;
    }

    .label-container.is-switch .component {
        order: 2;
    }

    .label-container.is-switch .text-area {
        order: 1;
        margin-top:0px;
    }

    .main-text {
        align-self: stretch;
        color: var(--text-default-default);
        font: var(--txt-base);
        font-weight: var(--font-weight-regular);
    }

    .description {
        align-self: stretch;
        color: var(--text-default-tertiary);
        /* Txt/regular/Regular */
        font: var(--txt-base);
        font-weight: var(--font-weight-regular);
    }

 
    `;

    constructor() {
        super();
        this.checked = false;
         this.disabled = false;

        if (!this.id) {
             this.id = 'label-control-' + Math.random().toString(36).substring(2, 9);
        }
         
    }

    renderType() {

        const controlId = this.id;

        if(this.type === 'checkbox') {
            return html`<ui-checkbox 
                .active=${this.checked} 
                ?disabled=${this.disabled}
                id=${controlId}
                @change=${this.handleControlChange}
            ></ui-checkbox>`;
        }
        if(this.type === 'radio') {
            return html`<ui-radio-button 
                .checked=${this.checked}
                name=${this.name} 
                id=${controlId}
                ?disabled=${this.disabled}
                @change=${this.handleControlChange}
            ></ui-radio-button>`;
        }
        if(this.type === 'switch') {
            return html`<ui-switch 
                .checked=${this.checked} 
                ?disabled=${this.disabled}
                id=${controlId}
                @change=${this.handleControlChange}
            ></ui-switch>`;
        }
    };


    render() {
        const switchClass = this.type === 'switch' ? 'is-switch' : ''; 

        return html `
            <div class="label-container ${switchClass}" >
                <div class="component">${this.renderType()}</div>
                <div class="text-area" @click=${this.handleLabelClick}>
                    <span class="main-text">${this.label}</span>
                    <slot name="description" class="description"></slot> 
                </div>
            </div>
        `;

        
    }

    handleLabelClick() {
        if (this.disabled) {
            return;
        }

        const control = this.shadowRoot.querySelector('ui-checkbox, ui-switch, ui-radio-button');
        
        if (!control) {
             return; 
        }

        let internalLabel;
        if (this.type === 'checkbox') {
            internalLabel = control.shadowRoot.querySelector('label.checkbox-label');
        } else if (this.type === 'radio') {
            internalLabel = control.shadowRoot.querySelector('label.radio-label');
        } else if (this.type === 'switch') {
            internalLabel = control.shadowRoot.querySelector('label.switch-label');
        }

        if (internalLabel) {
            internalLabel.click();
        }
    }
   
    handleControlChange(event) {
    event.stopPropagation();

    if (this.disabled) {
      return;
    }
    
    let newCheckedState = false;
    
    if (this.type === 'checkbox') {
      newCheckedState = event.detail.active; 
    } else if (this.type === 'switch' || this.type === 'radio') {
      newCheckedState = event.detail.checked;
    }

    this.checked = newCheckedState;

    const detailData = {
        checked: this.checked, // Estado de activación
        name: this.name || this.getAttribute('name'), 
        id: this.id || this.getAttribute('id')
    };

    this.dispatchEvent(new CustomEvent('change', {
        detail: detailData,
        bubbles: true,
        composed: true
    }));
  }

    
}
customElements.define('ui-label', UILabel);