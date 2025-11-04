import { describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom';

describe('UIList - 1. Propiedades y Renderizado', () => {

  let element;

  beforeEach(async () => {
    element = document.createElement('ui-list');
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

    // -----------------------TEST - SECTION ---------------------------

  it('1.1. Estado por Defecto: Se muestra el contenido por defecto', () => {
    expect(element.text).toBe('List Item');
    expect(element.description).toBe('');
    expect(element.disabled).toBe(false);
  });

  it('1.2. Renderizado de Textos: "text" y "description" se renderizan', async () => {
    // se pasa un texto de prueba
    element.text = 'Texto Principal';
    element.description = 'Descripción de Ayuda';
    await element.updateComplete;

    //se obtiene los contenedores del componente
    const textDiv = element.shadowRoot.querySelector('.list-item');
    const descDiv = element.shadowRoot.querySelector('.description');
    //se espera que se reciba el texto escrito
    expect(textDiv.textContent).toBe('Texto Principal');
    expect(descDiv.textContent).toBe('Descripción de Ayuda');
  });

  it('1.3. Estado Deshabilitado: disabled se aplica', async () => {
    element.disabled = true;
    await element.updateComplete;
    const container = element.shadowRoot.querySelector('.list-container');
    
    // se aplican los css del disabled
    expect(container.hasAttribute('disabled')).toBe(true);
  });

  it('1.4. Renderizado de Textos sin texto: description debe estar vacío si no se escribe', () => {
    // description ya es vacio '' por defecto
    
    const descDiv = element.shadowRoot.querySelector('.description');
    
    //debe ser vacio ''
    expect(descDiv.textContent).toBe('');
  });

  it('2.1. Renderizado de Slots: Se renderizan los start-element y end-element', async () => {

    // Simula: <span slot="start-element"></span>
    const startSlot = document.createElement('span');
    startSlot.slot = 'start-element'; 
    startSlot.textContent = 'INICIO'; // se simula con un texto pero debe ser otro tipo de dato
    element.appendChild(startSlot);

    // Simula: <ui-icon-button slot="end-element"></ui-icon-button>
    // aqui se simula un componente externo.
    const endSlot = document.createElement('ui-icon-button');
    endSlot.slot = 'end-element';
    element.appendChild(endSlot);
    await element.updateComplete;

    // se obtienen los contenedores de los slots
    const startNode = element.shadowRoot.querySelector('slot[name="start-element"]').assignedNodes()[0];
    const endNode = element.shadowRoot.querySelector('slot[name="end-element"]').assignedNodes()[0];

    // se verifica el texto puesto
    expect(startNode.textContent).toBe('INICIO');
    
    // se verifica el componente externo.  
    expect(endNode.tagName).toBe('UI-ICON-BUTTON');
  });

});

describe('UIList - 3. Emisión de Eventos', () => {
  let element;
  let container;

  beforeEach(async () => {
    element = document.createElement('ui-list');
    element.id = 'list-test';
    document.body.appendChild(element);
    await element.updateComplete;
    container = element.shadowRoot.querySelector('.list-container');
    expect(container).not.toBe(null);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('3.1. Disparo de Evento: Debe disparar "list-item-click" al hacer clic en el contenedor', async () => {
    const listSpy = vi.fn();
    element.addEventListener('list-item-click', listSpy);

    // simulador de click
    container.click();
    await element.updateComplete;
    //llamado de click times
    expect(listSpy).toHaveBeenCalledTimes(1);
    
    // se pasa el id en el evento.
    const emittedEvent = listSpy.mock.calls[0][0];
    expect(emittedEvent.detail).toEqual({ id: 'list-test' });
  });

  it('3.2. Evento en disabled: No debe disparar "list-item-click"', async () => {
    
    element.disabled = true;
    await element.updateComplete;    
    const listSpy = vi.fn();
    element.addEventListener('list-item-click', listSpy);

    container.click();
    await element.updateComplete;

    //no debe de haber ningun llamado 
    expect(listSpy).not.toHaveBeenCalled();
  });

  it('3.3. No debe disparar "list-item-click" si el clic se origina en un hijo (botón)', async () => {
    //se crea un componente dentro de list
    const button = document.createElement('ui-icon-button');
    button.slot = 'end-element';
    element.appendChild(button);
    await element.updateComplete;

    // busca el btn para poder darle click
    const internalButton = button.shadowRoot.querySelector('button');
    expect(internalButton).not.toBe(null);

    const listSpy = vi.fn();
    element.addEventListener('list-item-click', listSpy);

    // simula el click en el btn
    fireEvent.click(internalButton);
    await element.updateComplete;

    // no debe de recibir ningun llamado el list. 
    expect(listSpy).not.toHaveBeenCalled();
  });

});
