import {LitElement, css, html} from 'lit';
import '../tokens/ui-tokens.css';
import '../tokens/ui-fonts.css';
import './ui-button.js';
import './subcomponents/ui-file-list.js';
import './subcomponents/ui-alert-msm.js';

export class UIFileUploader extends LitElement {
    static properties = {
        accept: {type: String, reflect: true},//Tipo de archivo que se puede subir
        maxSize: {type: Number, reflect: true},//Tamaño maximo de archivo
        multiple: {type: Boolean, reflect: true},//Permite subir multiples archivos
        showBrowseButton: {type: Boolean, reflect: true},//Muestra el boton de examinar archivos
        sizeBrowseButton: {type: String, reflect: true},//Tamaño del boton de examinar archivos
        disabled: {type: Boolean, reflect: true},//Deshabilita el uploader
        width: {type: String, reflect: true},//Ancho del uploader
        label: {type: String, reflect: true},//Label del uploader
        helperText: {type: String, reflect: true},//Texto de ayuda del uploader
        requiredErrorText: {type: String, reflect: true},//Texto de error del uploader
        warningMessage: {type: String, reflect: true},
        warningDescription: {type: String, reflect: true},
        negativeMessage: {type: String, reflect: true},
        negativeDescription: {type: String, reflect: true},
        required: {type: Boolean, reflect: true},

        _listFiles: {state: true},//Lista de archivos subidos
        _alertNotification: {state: true} //Alerta de notificacion
        
    };

    static styles = css`

    .uploader-container{
        min-width: 200px;
        max-width: 1000px;
        display:flex;
        flex-direction: column;
        gap: 20px;
    }

    .drag-drop-container{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 24px;
        gap: 20px;
        background: var(--background-background-component);
        border: 2px dashed var(--border-brand-tertiary);
        border-radius: 10px;
        max-height: 400px;
    }

    .drag-drop-container:hover{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 24px;
        gap: 20px;
        background: var(--background-brand-secondary);
        border: 2px dashed var(--border-brand-tertiary);
        border-radius: 10px;
        max-height: 400px;
    }

    .drag-drop-container--dragover{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 24px;
        gap: 20px;
        background: var(--background-brand-secondary-hover);
        border: 2px dashed var(--border-brand-tertiary);
        border-radius: 10px;
        max-height: 400px;
    }

    :host([disabled]) .drag-drop-container{
        border: 2px dashed var(--border-brand-disabled);
        background: var(--background-background-component);
        color: var(--text-default-disabled);
    }

    :host([disabled]) .main-text,
    :host([disabled]) .description-text,
    :host([disabled]) .icon-section{
        color: var(--text-default-disabled);
    }

    .txt-section{
        gap:6px;
    }

    .main-text{
        font-family: var(--font-open-sans);
        font-style: normal;
        font-weight: var(--font-weight-semibold);
        font-size: var(--font-size-body-base);
        line-height: var(--line-height-text);
        text-align: center;
        color: var(--text-default-default);
        flex: none;
        order: 0;
        align-self: stretch;
        flex-grow: 0;
    }

    .description-text{
        font-family: var(--font-open-sans);
        font-style: normal;
        font-weight: var(--font-weight-regular);
        font-size: var(--font-size-body-base);
        line-height: var(--line-height-text);
        text-align: center;
        color: var(--text-default-tertiary);
        flex: none;
        order: 1;
        align-self: stretch;
        flex-grow: 0;
    }

    .error-text{
        font-family: var(--font-open-sans);
        font-style: normal;
        font-weight: var(--font-weight-semibold);
        font-size: var(--font-size-body-base);
        line-height: var(--line-height-text);
        text-align: center;
        color: var(--text-danger-secondary);
        flex: none;
        order: 1;
        align-self: stretch;
        flex-grow: 0;
    }

    .files-list-container{
        display:flex;
        flex-direction: column;
        gap:12px;
    }


    `;

    constructor(){
        super();
        this.accept = '*';
        this.maxSize = 5;
        this.multiple = false;
        this.showBrowseButton = false;
        this.sizeBrowseButton = '';
        this.disabled = false;
        this.width = '100%';
        this.label = 'Arrastra y suelta tus archivos aquí o busca en tu equipo';
        this.helperText = '';
        this.requiredErrorText = 'Este campo es obligatorio. Por favor, sube un archivo.';
        this.warningMessage = "Algunos archivos omitidos";
        this.warningDescription = "No cumplen con el tamaño o formato requerido.";
        this.negativeMessage = "Archivo(s) no admitido(s)";
        this.negativeDescription = "Los archivo(s) no cumple con los requisitos de formato o tamaño.";
        this._listFiles = []; 
        this._alertNotification = 'none';
        this.required = false;
    }


    //Funcionalidades de file uploader

    _openFileExplorer(){
        const inputNative = this.shadowRoot.getElementById('file-input');
        if (inputNative) {
            inputNative.click();
        }
    }

    _handleFileSelection(event){
        if(event.target.files && event.target.files.length > 0){
            this.processFiles(event.target.files);
        }

    }

    handleDragOver(event){
        event.preventDefault();
        const dropZone = this.shadowRoot.querySelector('.drag-drop-container');
        if(dropZone) dropZone.classList.add('drag-drop-container--dragover');
    }

    handleDragLeave(event){
        event.preventDefault();
        const dropZone = this.shadowRoot.querySelector('.drag-drop-container');
        if(dropZone) dropZone.classList.remove('drag-drop-container--dragover');
    }

    handleDrop(event){
        event.preventDefault();
        event.stopPropagation();

        if (this.disabled) return;

        const dropZone = this.shadowRoot.querySelector('.drag-drop-container');
        if(dropZone) dropZone.classList.remove('drag-drop-container--dragover')

        if(event.dataTransfer.files && event.dataTransfer.files.length > 0){
            this.processFiles(event.dataTransfer.files);
        }
    }

    processFiles(enterFiles){
        const files = Array.from(enterFiles);

        if (!this.multiple && (this._listFiles.length > 0 || files.length > 1)) {
            this._alertNotification = 'negative';
            return;
        }

        let skipedFiles = false;
        const validFiles = [];

        files.forEach(file => {
            const sizeMB = file.size / (1024*1024);
            const extension = '.' + file.name.split('.').pop().toLowerCase();
            const isFormatValid = this.accept === '*' ? true : this.accept.toLowerCase().includes(extension);

            if(sizeMB <= this.maxSize && isFormatValid){
                validFiles.push(file);
            }else{
                skipedFiles = true; 
            }  
        });

        if (validFiles.length > 0 ){
            this._listFiles = [...this._listFiles, ...validFiles];
            this._alertNotification = skipedFiles ? 'warning' : 'none';
            this.errorText = '';
        }else if(skipedFiles){
            this._alertNotification = 'negative';
        }

        const input = this.shadowRoot.getElementById("file-input");
        if(input) input.value = '';

        //console.log('Archivos en la RAM actualmente:', this._listFiles);
        //console.log('Estado de la alerta:', this._alertNotification);

        this.dispatchEvent(new CustomEvent('ui-files-changed', { //disparador de evento.
            detail: { files: this._listFiles },
            bubbles: true,
            composed: true
        }));

    }

    handleRemoveFiles(event){
        const indexRemove = parseInt(event.currentTarget.dataset.index, 10);

        this._listFiles = this._listFiles.filter((_, index) => index !== indexRemove);

        if (this._listFiles.length === 0) {
            this._alertNotification = 'none';

            if (this.required) {
            this.errorText = this.requiredErrorText;
        }
        }

        const input = this.shadowRoot.getElementById("file-input");
        if (input) input.value = '';

        this.dispatchEvent(new CustomEvent('ui-files-changed', {
            detail: { files: this._listFiles },
            bubbles: true,
            composed: true
        }));
    }

    get files() {
        return this._listFiles;
    }

    validate() {
        if (!this.required) {
            this.errorText = '';
            return true; 
        }

        if (this._listFiles.length === 0) {
            this.errorText = this.requiredErrorText;
            return false; 
        }

        this.errorText = '';
        return true; 
    }

    render() {

        return html`
        
        <section class="uploader-container" style="width: ${this.width}" ?disabled=${this.disabled}>
            <section class="drag-drop-container"  @dragover="${this.handleDragOver}" @dragleave="${this.handleDragLeave}" @drop="${this.handleDrop}">
                <div class="icon-section">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28 16V21.6C28 23.8403 28 24.9603 27.564 25.816C27.1805 26.5687 26.5687 27.1805 25.816 27.564C24.9603 28 23.8403 28 21.6 28H10.4C8.15979 28 7.03968 28 6.18404 27.564C5.43139 27.1805 4.81947 26.5687 4.43597 25.816C4 24.9603 4 23.8403 4 21.6V16M10.6667 9.33333L16 4L21.3333 9.33333M16 4V20" stroke="#222222" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="txt-section">
                    <div class="main-text">${this.label}</div>
                    <div class="description-text">${this.helperText}</div>
                    ${this.errorText ? html`<div class="error-text">${this.errorText}</div>` : ''}
                </div>
                <div class="btn-section">
                    <input 
                    type="file"
                    id="file-input"
                    style="display: none;"
                    ?multiple="${this.multiple}"
                    accept="${this.accept}"
                    @change="${this._handleFileSelection}"
                />

                ${this.showBrowseButton ? html`
                    <ui-button type="secondary" size="${this.sizeBrowseButton}" ?disabled=${this.disabled} @click="${this._openFileExplorer}" >Examinar archivos
                        <svg slot="icon-start"  width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 10V10.8C14 11.9201 14 12.4801 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.4801 14 11.9201 14 10.8 14H5.2C4.07989 14 3.51984 14 3.09202 13.782C2.71569 13.5903 2.40973 13.2843 2.21799 12.908C2 12.4801 2 11.9201 2 10.8V10M4.66667 5.33333L8 2L11.3333 5.33333M8 2V10" stroke="#004A98" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </ui-button>
                `:''}
                    
                </div>
            </section>
            <!-- seccion de alertas -->
            <section class="files-list-container">

                ${this._alertNotification === 'warning' ? html`
                    <ui-alert-msm
                        message="${this.warningMessage}"
                        description="${this.warningDescription}"
                        type="warning"
                    ></ui-alert-msm>
                ` : ''}

                ${this._alertNotification === 'negative' ? html`
                    <ui-alert-msm
                        message="${this.negativeMessage}"
                        description="${this.negativeDescription}"
                        type="negative"
                    ></ui-alert-msm>
                ` : ''}  

            </section>

            <!-- Lista de Archivos Subidos -->
            ${this._listFiles.length > 0 ? html`
            <section class="files-list-container">
                ${this._listFiles.map((file, index) => {
                    const sizeInMB = file.size / (1024 * 1024);
                    const sizeInKB = file.size / 1024;
                    let displaySize = '';
                
                    if (sizeInMB < 0.1) {
                        displaySize = `${Math.round(sizeInKB)} KB`;
                    } else {
                        displaySize = `${sizeInMB.toFixed(2)} MB`;
                    }
                
                    return html`
                        <ui-file-list>
                            <span slot="file-name">${file.name}</span>
                            <span slot="file-size">${displaySize}</span>

                            <span slot="btn-remove" data-index="${index}" @click="${this.handleRemoveFiles}">
                                <ui-icon-button  type="tertiary" > 
                                    <svg  slot="icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </ui-icon-button>
                            </span>
                        </ui-file-list>
                    `;
                })}
            </section>
            ` : ''}
        `;
    }
}
customElements.define('ui-file-uploader', UIFileUploader);