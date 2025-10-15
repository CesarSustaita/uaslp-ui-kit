import {LitElement, css, html} from 'lit';
import '../tokens/ui-tokens.css';
import '../tokens/ui-fonts.css';
import '../components/ui-tab';

export class UITabList extends LitElement {
    static properties = {
        activeTabName: { type: String, state: true }, //Obtener la propiedad name de UITab

    };
    static styles = css `

    :host {
            display: block;
            overflow-x: auto; 
            scrollbar-width: none;
        }
        
        .tab-container {
            display: flex;
            flex-direction: row;
            border:0px solid black;
            align-items: center;
            white-space: nowrap; 
        }
        
    `;

    constructor() {
        super();
        this.activeTabName = '';

        this.handleTabSelectBound = this.handleTabSelect.bind(this);
    }

    //Se activa y desactiva los listeners del componente
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('tab-select', this.handleTabSelectBound);
        this.updateTabState();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('tab-select', this.handleTabSelectBound);
    }

    //Obtener y manejar el evento de los hijos de ui-tab "tab-select" 
    //Conocer que elemento debe de estar activado y cuales no.
    handleTabSelect(event) {
        //se obtine la propiedad name del hijo
        const tabName = event.detail.tabName;

        if(tabName && tabName !== this.activeTabName) {
            this.activeTabName = tabName;
            this.updateTabState();
        }

    }

    updateTabState() {
        const slot = this.shadowRoot.querySelector('slot'); 
        if (!slot) return;
    
        const tabs = slot.assignedElements({ flatten: true }).filter(el => el.tagName === 'UI-TAB');

        if (!this.activeTabName && tabs.length > 0) {
            this.activeTabName = tabs[0].name;

        }

        tabs.forEach(tab => {
            const isActive = tab.name === this.activeTabName;
            tab.active = isActive; 
        });
    }

    handleSlotChange() {
        this.updateTabState();
    }
    

    /*firstRender(changedPropertie){
        super.firstRender(changedPropertie);

        //El primer renderizado para que se tenga la primera pestaña siempre activa por defecto.
        if(!this.activeTabName){
            const firstTab = this.querySelector('ui-tab');
            if(firstTab && firstTab.name) {
                this.activeTabName = firstTab.name;
            }
        }

        this.updateTabState();
    }*/


    render() {

        return html `
            <div class="tab-container" role="tablist">
                <slot @slotchange="${this.handleSlotChange}"></slot>
            </div>
        `;
    }

   

    
}
customElements.define('ui-tab-list', UITabList);