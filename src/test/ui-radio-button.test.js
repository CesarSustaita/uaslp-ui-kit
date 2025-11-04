import { describe, expect, it, vi } from 'vitest';

describe('UIRadioButton - Estado y Propiedades', () => {

    let element;

    beforeEach(async () => {
      element = document.createElement('ui-radio-button');
      document.body.appendChild(element);
      await element.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(element);
    })

    // -----------------------TEST - SECTION ---------------------------

    it('1.1. Estado por Defecto: Checked = false, disabled= false', () => {
      expect(element.checked).toBe(false);
      expect(element.disabled).toBe(false);
    });

    it('1.2. ID: El ID debe coincidir con el <input> y  <label>', () => {
      // clases internas del input y label
      const input = element.shadowRoot.querySelector('input.hidden-input');
      const label = element.shadowRoot.querySelector('label.radio-label');

      // se obtiene el ID que existe en el componente
      expect(input.id).toBeTruthy(); 
      // compara que sea el mismo input
      expect(label.getAttribute('for')).toBe(input.id);
    });

    it('1.3. Propiedades: "active" y "disabled" deben de pasar los cambios al componente', async () => {
      //se implementan los valores
      element.checked = true;
      element.disabled = true;
      await element.updateComplete;

      // obtiene la clase del input
      const input = element.shadowRoot.querySelector('input.hidden-input');

      // Verifica que la propiedad "active" controla la propiedad "checked" del input
      expect(input.checked).toBe(true); 
      // Verifica que la propiedad "disabled" se aplique correctamente
      expect(input.disabled).toBe(true);
    });

    it('1.4. Propiedad "name": Se debe de mostrar dentro del componente', async () => {
      const input = element.shadowRoot.querySelector('input.hidden-input');
      expect(input.name).toBe('default-radio');

      // se le asigna un name ya que es una propiedad por el usuario darla (o se da de manera auto)
      element.name = 'name-prueba';
      await element.updateComplete;

      // se verifica el valor pasado correctamente
      expect(input.name).toBe('name-prueba');
    });
});

describe('UIRadioButton - Interacción del Usuario (Clicks)', () => {

    let element;
    let label; 

    beforeEach(async () => {
      element = document.createElement('ui-radio-button');
      document.body.appendChild(element);
      await element.updateComplete;
      label = element.shadowRoot.querySelector('label.radio-label');
    });

    afterEach(() => {
      document.body.removeChild(element);
    });


    it('2.1. Click checked: el "checked" de false a true al hacer clic', async () => {
      expect(element.checked).toBe(false);
      //se simula el click del usuario
      label.click();
      await element.updateComplete; 

      // detecta el cambio 
      expect(element.checked).toBe(true);
    });

    it('2.2. Clic en disabled: NO debe cambiar el estado si disabled es true', async () => {
      element.disabled = true;
      await element.updateComplete;
      expect(element.checked).toBe(false);

      // se simula el click al estar en false
      label.click();
      await element.updateComplete;
      // no debe de hacer ningun cambio se debe de mantener en false
      expect(element.checked).toBe(false);
    });

});

describe('UIRadioButton - Lanzamiento del Evento', () => {

  let element;
  let label;

  beforeEach(async () => {
    element = document.createElement('ui-radio-button');
    element.name = 'radio-name';
    document.body.appendChild(element);
    await element.updateComplete;
    label = element.shadowRoot.querySelector('label.radio-label');
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('3.1. Event: Se dispara el evento "change" al hacer click', async () => {
    const changeSpy = vi.fn();
    //el event listener debe ser el mencionado "change"
    element.addEventListener('change', changeSpy);

    // simula el click
    label.click();
    await element.updateComplete;

    // se verifica que solo el click de un solo evento change
    expect(changeSpy).toHaveBeenCalledTimes(1);
    const emittedEvent = changeSpy.mock.calls[0][0]; // Obtiene el objeto evento
    
    expect(emittedEvent.detail).toEqual({
      checked: true,
      name: 'radio-name',
      id: element.id 
    });
  });

  it('3.2. Evento en disabled: NO debe disparar un evento "change" si está en disabled', async () => {

    element.disabled = true; //se configura en disabled
    await element.updateComplete;
    const changeSpy = vi.fn();
    element.addEventListener('change', changeSpy);
    label.click();
    await element.updateComplete;

    // espera recibir un evento pero no se obtiene
    expect(changeSpy).not.toHaveBeenCalled();
  });

});