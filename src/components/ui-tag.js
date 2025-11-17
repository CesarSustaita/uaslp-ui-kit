import {LitElement, css, html} from 'lit';
import '../tokens/ui-tokens.css';
import '../tokens/ui-fonts.css';

export class UITag extends LitElement {
    static properties = {
        type: { type: String, reflect: true },  
        tag: { type: String, reflect: true }, 
        hasBorder: { type: Boolean},
        removable: { type: Boolean, reflect: true },
        id: { type: String, reflect: true }

    };
    static styles = css `
        .tag-container {
            display: inline-flex;
            padding: 8px;
            flex-direction: row;
            align-items: center;
            gap: 10px;
            border-radius: 8px;
            flex-wrap: nowrap;
            font: var(--body-base);
            font-weight: var(--font-weight-regular);
        }

        slot {
            white-space: nowrap; 
        }

        /*PRIMARY STYLES*/
        .tag-container.base.primary {
            color: var(--text-default-on-element-primary);
            background: var(--background-brand-default);
        }

        .tag-container.neutral.primary  {
            color: var(--text-default-on-element-primary);
            background: var(--background-neutro-default);
        }

        .tag-container.positive.primary  {
            color: var(--text-default-on-element-primary);
            background: var(--background-positive-default);
        }

        .tag-container.negative.primary  {
            color: var(--text-default-on-element-primary);
            background: var(--background-danger-default);
        }

        .tag-container.warning.primary  {
            color: var(--text-default-default);
            background: var(--background-warning-default);
        }

        /*PRIMARY STYLES - HOVER*/
        :host([removable]) .tag-container.base.primary:hover {
            color: var(--text-default-on-element-primary);
            background: var(--background-brand-default-hover);
            cursor: pointer;
        }

        :host([removable]) .tag-container.neutral.primary:hover  {
            color: var(--text-default-on-element-primary);
            background: var(--background-neutro-default-hover);
            cursor: pointer;
        }

        :host([removable]) .tag-container.positive.primary:hover  {
            color: var(--text-default-on-element-primary);
            background: var(--background-positive-default-hover);
            cursor: pointer;
        }

        :host([removable]) .tag-container.negative.primary:hover  {
            color: var(--text-default-on-element-primary);
            background: var(--background-danger-default-hover);
            cursor: pointer;
        }

        :host([removable]) .tag-container.warning.primary:hover  {
            color: var(--text-default-default);
            background: var(--background-warning-default-hover);
            cursor: pointer;
        }


        /*SECONDARY STYLES*/
        .tag-container.base.secondary {
            color: var(--text-brand-default);
            background: var(--background-brand-secondary);
        }

        .tag-container.neutral.secondary  {
            color: var(--text-default-default);
            background: var(--background-brand-tertiary);
        }

        .tag-container.positive.secondary  {
            color: var(--text-positive-default);
            background: var(--background-positive-tertiary);
        }

        .tag-container.negative.secondary   {
            color: var(--text-danger-default);
            background: var(--background-danger-tertiary);
        }

        .tag-container.warning.secondary  {
            color: var(--border-warning-tertiary);
            background: var(--background-warning-tertiary);
        }


        
        /*SECONDARY STYLES - HOVER*/
        :host([removable]) .tag-container.base.secondary:hover {
            color: var(--text-brand-default);
            background: var(--background-brand-secondary-hover);
            cursor: pointer;
        }

        :host([removable]) .tag-container.neutral.secondary:hover  {
            color: var(--text-default-default);
            background: var(--background-brand-tertiary-hover);
            cursor: pointer;
        }

        :host([removable]) .tag-container.positive.secondary:hover  {
            color: var(--text-positive-default);
            background: var(--background-positive-tertiary-hover);
            cursor: pointer;
        }

        :host([removable]) .tag-container.negative.secondary:hover   {
            color: var(--text-danger-default);
            background: var(--background-danger-tertiary-hover);
            cursor: pointer;
        }

        :host([removable]) .tag-container.warning.secondary:hover  {
            color: var(--border-warning-tertiary);
            background: var(--background-warning-tertiary-hover);
            cursor: pointer;
        }



        /*SECONDARY STYLES WITH BORDER*/
        .tag-container.base.secondary.hasBorder {
            color: var(--text-brand-default);
            border: 1px solid var(--border-brand-default);
            background: var(--background-brand-secondary);
        }

        .tag-container.neutral.secondary.hasBorder  {
            color: var(--text-default-default);
            border: 1px solid var(--border-default-secondary);
            background: var(--background-brand-tertiary);
        }

        .tag-container.positive.secondary.hasBorder  {
            color: var(--text-positive-default);
            border: 1px solid var(--border-positive-secondary);
            background: var(--background-positive-tertiary);
        }

        .tag-container.negative.secondary.hasBorder   {
            color: var(--text-danger-default);
            border: 1px solid var(--border-danger-secondary);
            background: var(--background-danger-tertiary);
        }

        .tag-container.warning.secondary.hasBorder  {
            color: var(--border-warning-tertiary);
            border: 1px solid var(--border-warning-tertiary);
            background: var(--background-warning-tertiary);
        }



        .remove-icon {
            background: none;    
            border: none;    
            padding: 0;         
            margin: 0;
            cursor: pointer;
            color: currentColor; 
            display: inline-flex; 
            align-items: center;
            line-height: 1;
        }
    `;

    constructor() {
        super();
        this.type = 'primary'; 
        this.tag = 'neutral';  
        this.hasBorder = false; 
        this.removable = false;
        
    }


    render() {
        const typeClass = this.type; // 'primary' o 'secondary'
        const tagClass = this.tag;   // 'neutral', 'positive', etc.

        const borderClass = this.hasBorder ? 'hasBorder' : '';
        
        const combinedClasses = `${tagClass} ${typeClass} ${borderClass}`;

        const closeButtonTemplate = html`
        <button class="remove-icon" @click=${this.handleRemove}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        `   ;
        
        return html `

            <div class="tag-container ${combinedClasses}">
                <slot></slot> 
                 ${this.removable ? closeButtonTemplate : ''}
            </div>
        `;
    }

    handleRemove(event) {
    event.stopPropagation(); 

    this.dispatchEvent(new CustomEvent('tag-remove', {
        detail: {
            id: this.id || this.getAttribute('id'), 
        },
        bubbles: true,
        composed: true
    }));
}

    
}
customElements.define('ui-tag', UITag);