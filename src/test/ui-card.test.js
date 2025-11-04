import { describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom';

describe('UICard - 1. Propiedades y Renderizado', () => {

  let element; 

  beforeEach(async () => {
    element = document.createElement('ui-card');
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

 // -----------------------TEST - SECTION ---------------------------

  it('1.1. Estado por Defecto: se muestran los valores por defecto de la card', () => {
    expect(element.type).toBe('vertical');
    expect(element.size).toBe('default');
    expect(element.isInteractive).toBe(false);
    expect(element.imageUrl).toBe('');
  });

  it('1.2. Atributos de Layout "type" y "size" deben aplicarse al contenedor', async () => {
    element.type = 'horizontal';
    element.size = 'small';
    await element.updateComplete;

    // se obtiene el contenedor principal
    const container = element.shadowRoot.querySelector('.card-container');
    
    // se asesora que todo salga bien en type y size.
    expect(container.getAttribute('type')).toBe('horizontal');
    expect(container.getAttribute('size')).toBe('small');
  });

  it('1.3. Renderizado Condicional imagen - El área de imagen debe existir si "imageUrl" está presente', async () => {
    element.imageUrl = 'test/image.jpg'; //ejemplo de img
    await element.updateComplete;
    
    // se obtiene la area de imagen
    const imageArea = element.shadowRoot.querySelector('.image-area');
    
    // si existe no debe ser nula
    expect(imageArea).not.toBe(null);
  });

  it('1.4. Renderizado Condicional: El área de imagen No debe existir si "imageUrl" está vacía', () => {
    // por defecto imageUrl ya es '' por el constructor)
    const imageArea = element.shadowRoot.querySelector('.image-area');
    
    expect(imageArea).toBe(null); // Valida que no exista la area de imagen.
  });

  it('1.5. Se añade la clase "is-interactive" si "isInteractive" es true', async () => {
    
    const container = element.shadowRoot.querySelector('.card-container');
    expect(container.classList.contains('is-interactive')).toBe(false);

    element.isInteractive = true;
    await element.updateComplete;

    // se asesora que sea corracta la interaccion.
    expect(container.classList.contains('is-interactive')).toBe(true);
  });

  it('2.1. Renderizado de Slots: Debe renderizar contenido en "title", "description" y "footer"', async () => {
    
    // Se preparan los slots
    // Simula: <span slot="title">Título de Prueba</span>
    const titleSlot = document.createElement('span');
    titleSlot.slot = 'title'; 
    titleSlot.textContent = 'Título de Prueba';
    element.appendChild(titleSlot);

    // Simula: <span slot="description">Descripción...</span>
    const descSlot = document.createElement('span');
    descSlot.slot = 'description';
    descSlot.textContent = 'Descripción de prueba';
    element.appendChild(descSlot);

    // Simula:  slot="footer" dentro de el hay buttons
    const footerSlot = document.createElement('ui-button');
    footerSlot.slot = 'footer';
    footerSlot.textContent = 'Botón de prueba';
    element.appendChild(footerSlot);

    await element.updateComplete;

    // se asigna el espacio de cada slot
    const titleNode = element.shadowRoot.querySelector('slot[name="title"]').assignedNodes()[0];
    const descNode = element.shadowRoot.querySelector('slot[name="description"]').assignedNodes()[0];
    const footerNode = element.shadowRoot.querySelector('slot[name="footer"]').assignedNodes()[0];

    // Verifica que el contenido correcto esté en el slot correcto
    expect(titleNode.textContent).toBe('Título de Prueba');
    expect(descNode.textContent).toBe('Descripción de prueba');
    expect(footerNode.tagName).toBe('UI-BUTTON');
    expect(footerNode.textContent).toBe('Botón de prueba');
  });

});

describe('UICard - 3. Emisión de Eventos', () => {

  let element;
  let container;

  beforeEach(async () => {
    element = document.createElement('ui-card');
    element.id = 'card-test';
    document.body.appendChild(element);
    await element.updateComplete;
    // se obtiene el contendor general
    container = element.shadowRoot.querySelector('.card-container');
    expect(container).not.toBe(null);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('3.1. Disparo de Evento: Debe disparar "card-click" si "isInteractive" es true', async () => {
    element.isInteractive = true;
    await element.updateComplete;

    const cardSpy = vi.fn();
    element.addEventListener('card-click', cardSpy);
    //simulacion de click
    container.click();
    await element.updateComplete;
    //llamada en el click
    expect(cardSpy).toHaveBeenCalledTimes(1);
    
    // se obtiene el evento id 
    const emittedEvent = cardSpy.mock.calls[0][0];
    expect(emittedEvent.detail).toEqual({ id: 'card-test' });
  });

  it('3.2. No debe disparar "card-click" si "isInteractive" es false', async () => {

    const cardSpy = vi.fn();
    element.addEventListener('card-click', cardSpy);

    container.click();
    await element.updateComplete;

    // no recibe ninguna llamada ya que no hay click
    expect(cardSpy).not.toHaveBeenCalled();
  });

  it('3.3. Prueba de Burbujeo - no debe disparar "card-click" si el clic se origina en un hijo (botón)', async () => {
    element.isInteractive = true; // La card es clickeable

    // Crea el botón hijo y añádelo al slot
    const button = document.createElement('ui-button');
    button.slot = 'footer';
    element.appendChild(button);
    await element.updateComplete;

    // Busca el botón INTERNO del ui-button
    const internalButton = button.shadowRoot.querySelector('button');
    expect(internalButton).not.toBe(null);

    // Prepara el espía para la card
    const cardSpy = vi.fn();
    element.addEventListener('card-click', cardSpy);

    //  Simula un clic en el BOTÓN HIJO
    fireEvent.click(internalButton);
    await element.updateComplete;

    // 3. la CARD no debe ser llamada
    expect(cardSpy).not.toHaveBeenCalled();
  });

});