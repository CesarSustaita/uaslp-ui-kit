import {LitElement, css, html} from 'lit';
import '../tokens/ui-tokens.css';
import '../tokens/ui-fonts.css';

export class UIconButton extends LitElement {
  static properties = {
    size: { type: String, reflect: true },      // 'medium' | 'small'
    type: { type: String, reflect: true },      // 'primary' | 'secondary' | 'tertiary'
    disabled: { type: Boolean, reflect: true },
    id: { type: String, reflect: true },
  };
  
  static styles = css`

    /* estilos para medium (por defecto) */
    button{
      display: inline-flex;
      padding: 8px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      border-radius: 1000px;
      width: 40px;
      height: 40px;
      border: none;
      cursor: pointer;
      white-space: nowrap;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
  }

    /* estilos para small */
    button.sm{
      display: inline-flex;
      padding: 8px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      border-radius: 1000px;
      width: 36px;
      height: 36px;
      border: none;
      cursor: pointer;
  }

    button:disabled {
      cursor: default;
    }

    ::slotted(svg) {
      width: 24px; 
      height: 24px;
      stroke-width: 2; 
      aspect-ratio: 1/1;
    }

    :host(.sm) ::slotted(svg) {
      width: 20px; 
      height: 20px;
      stroke-width: 2; 
      aspect-ratio: 1/1;
    }

    button.primary{
        border: 1px solid var(--background-brand-default);
        background: var(--background-brand-default);
        color: var(--text-default-on-element-primary);
    }

    button.primary:hover{
        border: 1px solid var(--background-brand-default-hover);
        background: var(--background-brand-default-hover);
    }

    button.primary:disabled{
        border: 1px solid var(--background-brand-default-disabled);
        background: var(--background-brand-default-disabled);
    }

    button.secondary{
        border: 1px solid var(--background-brand-secondary);
        background: var(--background-brand-secondary);
        color: var(--border-brand-default);
    }

    button.secondary:hover{
        border: 1px solid var(--background-brand-secondary-hover);
        background: var(--background-brand-secondary-hover);
    }

    button.secondary:disabled{
        border: 1px solid var(--background-brand-secondary-disabled);
        background: var(--background-brand-secondary-disabled,);
        color: var(--border-brand-disabled);
    }

    button.tertiary{
        border: 1px solid var(--background-brand-tertiary);
        background: var(--background-brand-tertiary);
        color: var(--border-default-default);
    }

    button.tertiary:hover{
        border: 1px solid var(--border-default-secondary);
        background: var(--background-brand-tertiary);
        
    }

    button.tertiary:disabled{
        border: 1px solid var(--border-default-disabled);
        background: var(--background-brand-tertiary);
        color: var(--border-brand-disabled);
    }
    
  `;

  constructor() {
    super();
    this.disabled = false;

    if (!this.id) {
            this.id = 'icon-btn-' + Math.random().toString(36).substring(2, 9);
    };
  }

  // Render the UI as a function of component state
  render() {
    const sizeClass = this.size === 'small' ? 'sm' : '';
    const typeClass = ['primary', 'secondary', 'tertiary'].includes(this.type) ? this.type : 'primary';
    return html`
    <button 
    class="${typeClass} ${sizeClass}" @click=${this.handleClick}  ?disabled=${this.disabled}>

    <slot name="icon"></slot>
    
    </button>`;
  }

  handleClick(event){
    if(this.disabled){
      event.stopPropagation();
      return;
    }

    this.dispatchEvent(new CustomEvent('click',{ //event 
      detail: { id: this.id },
      bubbles: true,
      composed: true
    }));
  }
}
customElements.define('ui-icon-button', UIconButton);