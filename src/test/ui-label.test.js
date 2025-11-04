import { describe, expect, it, vi } from 'vitest';


describe('UILabel - 1. Renderizado y Traducción de Propiedades', () => {

  let element; // Variable para mantener nuestro componente UILabel

  beforeEach(async () => {
    element = document.createElement('ui-label');
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

 // -----------------------TEST - SECTION ---------------------------

  it('1.1. Estado por Defecto: Debe ser no checked y no deshabilitado', () => {
    expect(element.checked).toBe(false);
    expect(element.disabled).toBe(false);
  });

  it('1.2. Renderizado de "type": Debe renderizar <ui-checkbox> si type="checkbox"', async () => {
    element.type = 'checkbox';
    await element.updateComplete;

    const child = element.shadowRoot.querySelector('ui-checkbox');
    const other = element.shadowRoot.querySelector('ui-switch');

    expect(child).not.toBe(null); 
    expect(other).toBe(null);     
  });

  it('1.3. Renderizado de "type": Debe renderizar <ui-switch> si type="switch"', async () => {
    element.type = 'switch';
    await element.updateComplete;

    const child = element.shadowRoot.querySelector('ui-switch');
    const other = element.shadowRoot.querySelector('ui-checkbox');

    expect(child).not.toBe(null);
    expect(other).toBe(null);    
  });

  it('1.4. Propiedad= (Checkbox): "checked" (padre) debe ser "active" (hijo)', async () => {
    element.type = 'checkbox';
    element.checked = true; // "checked" en el padre
    await element.updateComplete;

    const child = element.shadowRoot.querySelector('ui-checkbox');
    
    expect(child.active).toBe(true); // "active" en el hijo
  });

  it('1.5. Propiedad= (Switch): "checked" (padre) debe ser "checked" (hijo)', async () => {
    element.type = 'switch';
    element.checked = true; // "checked" en el padre
    await element.updateComplete;

    const child = element.shadowRoot.querySelector('ui-switch');

    expect(child.checked).toBe(true); // "checked" en el hijo
  });

  it('1.6. Propiedad= (Disabled): "disabled" debe propagarse al hijo', async () => {
    element.type = 'radio'; // Funciona con cualquier tipo
    element.disabled = true;
    await element.updateComplete;

    const child = element.shadowRoot.querySelector('ui-radio-button');
    
    expect(child.disabled).toBe(true);
  });
});

describe('UILabel - 2. Lógica de Layout', () => {

  let element; 

  beforeEach(async () => {
    element = document.createElement('ui-label');
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('2.1. Debe añadir "is-switch" SOLO si type="switch"', async () => {
    element.type = 'checkbox';
    await element.updateComplete;
    const container = element.shadowRoot.querySelector('.label-container');
    
    expect(container.classList.contains('is-switch')).toBe(false);

    element.type = 'switch';

    await element.updateComplete;

    expect(container.classList.contains('is-switch')).toBe(true);
  });

});

describe('UILabel - 3. Interacción y Traducción de Eventos', () => {

  let element;
  let textArea;

  beforeEach(async () => {
    element = document.createElement('ui-label');
    element.id = 'label-test';
    element.name = 'grupo-test';
    document.body.appendChild(element);
    await element.updateComplete;
 
    textArea = element.shadowRoot.querySelector('.text-area');
    expect(textArea).not.toBe(null); 
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('3.1. Debe cambiar "checked" a true al hacer clic en el texto', async () => {
    element.type = 'checkbox';
    await element.updateComplete;
    expect(element.checked).toBe(false); 

    //Simulacion de click
    textArea.click();
    await element.updateComplete;

    // se comprueba el nuevo estado
    expect(element.checked).toBe(true);
  });

  it('3.2. NO debe cambiar el estado si "disabled" es true', async () => {
    
    element.type = 'checkbox';
    element.disabled = true; // Deshabilita el componente
    await element.updateComplete;
    expect(element.checked).toBe(false);

    textArea.click();
    await element.updateComplete;

    expect(element.checked).toBe(false);
  });

  it('3.3. Debe disparar "change" con el detail de "active"', async () => {
    
    element.type = 'checkbox';
    await element.updateComplete;
    const changeSpy = vi.fn();
    element.addEventListener('change', changeSpy);

    textArea.click();
    await element.updateComplete;
    expect(changeSpy).toHaveBeenCalledTimes(1);
    const emittedEvent = changeSpy.mock.calls[0][0];
    
    // valida y obtiene los valores del evento
    expect(emittedEvent.detail).toEqual({
      checked: true, // El estado traducido por el padre
      name: 'grupo-test',
      id: 'label-test'
    });
  });

  it('3.4. Debe disparar "change" con el detail de "checked"', async () => {
    element.type = 'switch';
    await element.updateComplete;
    const changeSpy = vi.fn();
    element.addEventListener('change', changeSpy);

    textArea.click();
    await element.updateComplete;

    expect(changeSpy).toHaveBeenCalledTimes(1);
    const emittedEvent = changeSpy.mock.calls[0][0];

    expect(emittedEvent.detail).toEqual({
      checked: true, 
      name: 'grupo-test',
      id: 'label-test'
    });
  });

  it('3.5. Debe disparar "change" con el detail de "checked" en Radio', async () => {
    element.type = 'radio'; 
    await element.updateComplete;
    const changeSpy = vi.fn();
    element.addEventListener('change', changeSpy);

    textArea.click();
    await element.updateComplete;
    expect(changeSpy).toHaveBeenCalledTimes(1);
    const emittedEvent = changeSpy.mock.calls[0][0];
    
    // Obtiene los datos para radio con el evento
    expect(emittedEvent.detail).toEqual({
      checked: true, 
      name: 'grupo-test',
      id: 'label-test'
    });
  });

});