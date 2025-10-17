import {LitElement, css, html} from 'lit';
import '../tokens/ui-tokens.css';
import '../tokens/ui-fonts.css';

export class UIPagination extends LitElement {
    static properties = {
        currentPage: { type: Number, reflect: true },
        totalPages: { type: Number }
    };

    static NUM_MAX_VISIBLE = 3;

    static styles = css `

    :host {
        display: flex;
        flex-direction: row;
        -webkit-tap-highlight-color: transparent;
        white-space: nowrap; 
    }

    .pagination-container {
        display: flex;
        flex-direction: row;
        gap:10px;
    }

    .page-numbers {
        display: flex;
        flex-direction: row;
        gap:10px;
    }
        
    .pagination-button {
        display: flex;
        outline: none;
        border: none;
        cursor: pointer;
        width: 32px;
        height: 32px;
        padding: 10px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        aspect-ratio: 1/1;
        border-radius: 10px;
        background: var(--background-background-component);

        color: var(--text-default-default);
        text-align: center;
        /* Body/regular/Regular */
        font-family: "Open Sans";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 100%; /* 16px */
    }

    .arrow-btn{
        padding: 5px;
    }

    .pagination-button:hover {
        background: var(--background-brand-secondary-hover);
        outline: none;
    }

    .pagination-button.active {
        background: var(--background-brand-default);
        color: var(--text-default-on-element-primary);
        text-align: center;
    }

    .pagination-button.active:hover {
        background: var(--background-brand-default-hover);
    }

    .ellipsis {
        border: none !important;
        cursor: default !important;
        background: none !important;
        color: var(--text-default-tertiary);
    }
  
    `;

    constructor() {
        super();
        this.currentPage = 1;
        this.totalPages = 13; //valores por defecto para que se muestren
        this.changePageBound = this.changePage.bind(this);
    }

    changePage(newPage){
        if(newPage >= 1 && newPage <= this.totalPages && newPage !== this.currentPage) {
            this.currentPage = newPage;
            this.dispatchEvent(new CustomEvent('page-change', { //se dispara evento
                detail: { page: newPage},
                bubbles: true,
                composed: true
            }))
        }
    }

    ButtonRender(pageNumber, isActive){
        return html `
            <button
            class="pagination-button ${isActive ? 'active' : ''}"
            @click="${() => this.changePage(pageNumber)}"
            >
           ${pageNumber}
            </button>
        `;
    }

    renderPageBtn() {
        const pages = [];
        const {currentPage, totalPages} = this;
        const maxVisible = UIPagination.NUM_MAX_VISIBLE;
        const createButton = this.ButtonRender.bind(this); 

        if (totalPages <= maxVisible + 2) { 
            for (let i = 1; i <= totalPages; i++) {
                pages.push(createButton(i, i === currentPage));
            }
            return pages;
        }

        const lastPage = totalPages;
        let startPage = 0;
        let endPage = 0;
        // Si la pagina actual está en las 3 primeras (1, 2, 3)
        if (currentPage <= maxVisible) { 
            startPage = 2; 
            endPage = maxVisible; 
        } 
        // Si la pagina esta al final (Ej: página 10, 11, 12, 13 de 13)
        else if (currentPage > totalPages - maxVisible) { 
            startPage = totalPages - maxVisible; 
            endPage = totalPages - 1; 
        } 
        // la pagina esta en el centro
        else {
            startPage = currentPage - 1; 
            endPage = currentPage + 1; 
        }

        // Se pone el primer numero por defecto
        pages.push(createButton(1, 1 === currentPage));

        // Se renderizan los puntos suspencivos 
        if (startPage > 2) {
            pages.push(html`<button class="pagination-button ellipsis" disabled>...</button>`);
        }

        // 3. Páginas centrales
        for (let i = startPage; i <= endPage; i++) {
            pages.push(createButton(i, i === currentPage));
        }

        // puntos suspensivos
        if (endPage < totalPages - 1) {
            pages.push(html`<button class="pagination-button ellipsis" disabled>...</button>`);
        }

        // Se muestra la ultima pagina 
        if (totalPages > 1) {
            pages.push(createButton(lastPage, lastPage === currentPage));
        }

        return pages;

    }


    render() {

        return html `
            <div class="pagination-container">
                <button 
                    class="pagination-button arrow-btn" 
                    @click="${() => this.changePage(this.currentPage - 1)}"
                    ?disabled="${this.currentPage === 1}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>

                <div class="page-numbers">
                    ${this.renderPageBtn()}
                </div>

                <button 
                    class="pagination-button arrow-btn"
                    @click="${() => this.changePage(this.currentPage + 1)}"
                    ?disabled="${this.currentPage === this.totalPages}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `;
    }

   

    
}
customElements.define('ui-pagination', UIPagination);