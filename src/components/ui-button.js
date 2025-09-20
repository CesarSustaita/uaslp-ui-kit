import {LitElement, css, html} from 'lit';
import '../tokens/ui-tokens.css';
import '../tokens/ui-fonts.css';

export class UIButton extends LitElement {
  static properties = {
    size: { type: String, reflect: true },      // 'medium' | 'small'
    type: { type: String, reflect: true },      // 'primary' | 'secondary' | 'tertiary'
    disabled: { type: Boolean, reflect: true },
    state: { type: String, reflect: true }, // 'Danger' | 'Positive'
  };
  static styles = css`

    /* estilos para medium (por defecto) */
    button{
      display: flex;
      padding: 12px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      /* Body/regular/Regular */
      font-family: var(--font-open-sans);
      font-size: 1rem;
      font-style: normal;
      font-weight: 400;
      line-height: 100%; /* 16px */
      white-space: nowrap;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
  }

    /* estilos para small */
    button.sm{
      display: flex;
      padding: 8px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
  }

    ::slotted(svg) {
            width: 1em; 
            height: 1em;
            stroke-width: 2; 
        }

    button.primary {
      border: 1px solid var(--background-brand-default);
      background: var(--background-brand-default);
      color: var(--text-default-on-element-primary);
    }

    button.primary:hover {
      background: var(--background-brand-default-hover);
    }

    button.primary:disabled {
      cursor: default;
      border: 1px solid var(--background-brand-default-disabled);
      background: var(--background-brand-default-disabled);
    }

    button.secondary {
      border: 1px solid var(--border-brand-default);
      background: var(--background-brand-secondary); 
      color: var(--border-brand-default);
    }

    button.secondary:hover {
      border: 1px solid var(--border-brand-default);
      background: var(--background-brand-secondary-hover);
    }

    button.secondary:disabled {
      cursor: default;
      border: 1px solid var(--text-brand-disabled);
      background: var(--background-brand-secondary-disabled);
      color: var(--text-brand-disabled);
    }


    button.tertiary {
      background: var(--background-brand-tertiary);
      border: 1px solid var(--background-brand-tertiary);
      color: var(--text-default-default);
    }

    button.tertiary:hover {
      border: 1px solid var(--border-default-secondary);
      background: var(--background-brand-tertiary-hover);
    }

    button.tertiary:disabled {
      cursor: default;
      border: 1px solid var(--Border-Default-Disabled);
      background: var(--Background-Brand-Disabled);
      color: var(--text-default-disabled);
    }

    button.danger{
      background: var(--background-danger-default);
      border: 1px solid var(--background-danger-default);
    }

    button.danger:hover{
      border: 1px solid var(--background-danger-default-hover);
      background: var(--background-danger-default-hover);
    }

    button.danger:disabled {
      border: 1px solid var(--background-danger-disabled);
      background: var(--background-danger-disabled);
    }

    button.positive{
      border: 1px solid var(--background-positive-default);
      background: var(--background-positive-default);
    }

    button.positive:hover{
      border: 1px solid var(--background-positive-default-hover);
      background: var(--background-positive-default-hover);
    }

    button.positive:disabled {
      border: 1px solid var(--background-positive-disabled);
      background: var(--background-positive-disabled);
    }

  `;

  constructor() {
    super();
    this.disabled = false;
  }

  render() {
    const sizeClass = this.size === 'small' ? 'sm' : '';
    const typeClass = ['primary', 'secondary', 'tertiary'].includes(this.type) ? this.type : 'primary';
    const stateClass = ['danger', 'positive',].includes(this.state) ? this.state : 'primary';
    return html`
    <button 
    class="${stateClass} ${typeClass} ${sizeClass}" ?disabled=${this.disabled}>

    <slot name="icon-start"></slot>
    <slot></slot> 
    <slot name="icon-end"></slot>
    
    </button>`;
  }
}
customElements.define('ui-button', UIButton);