import { describe, expect, it, vi } from 'vitest';

describe('UICheckbox - Estado y Propiedades', () => {

    let element;

    beforeEach(async () => {
      element = document.createElement('ui-checkbox');
      document.body.appendChild(element);
      await element.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(element);
    });

    
    // -----------------------TEST - SECTION ---------------------------

    it('1.1. Estado por Defecto: Debe active= false y disabled= false', () => {
      // saber que el estado es false en ambos
      expect(element.active).toBe(false);
      expect(element.disabled).toBe(false);
    });

    it('1.2. ID: El ID debe coincidir con el <input> y  <label>', () => {
      // clases internas del input y label
      const input = element.shadowRoot.querySelector('input.hidden-input');
      const label = element.shadowRoot.querySelector('label.checkbox-label');

      // se obtiene el ID que existe en el componente
      expect(input.id).toBeTruthy(); 
      // compara que sea el mismo input
      expect(label.getAttribute('for')).toBe(input.id);
    });

    it('1.3. Propiedades: "active" y "disabled" deben de pasar los cambios al componente', async () => {
      //se implementan los valores
      element.active = true;
      element.disabled = true;
      await element.updateComplete;

      // obtiene la clase del input
      const input = element.shadowRoot.querySelector('input.hidden-input');

      // Verifica que la propiedad "active" controla la propiedad "checked" del input
      expect(input.checked).toBe(true); 
      // Verifica que la propiedad "disabled" se aplique correctamente
      expect(input.disabled).toBe(true);
    });
});

describe('UICheckbox - Interacción del Usuario (clicks)', () => {

    let element;
    let label; 

    beforeEach(async () => {
      element = document.createElement('ui-checkbox');
      document.body.appendChild(element);
      await element.updateComplete;

      // se obtiene el label donde se hacen los clicks
      label = element.shadowRoot.querySelector('label.checkbox-label');
    });

    afterEach(() => {
      document.body.removeChild(element);
    });

    it('2.1. Click activado: Cambiar "active" de false a true al hacer clic en el', async () => {
      expect(element.active).toBe(false);

      //se simula el click del usuario
      label.click();
      await element.updateComplete; 

      // detecta el cambio de false a true
      expect(element.active).toBe(true);

      // Prueba de Toggle al hacer el cambio (animacion)
      label.click();
      await element.updateComplete;

      // se hace el cambio del toogle
      expect(element.active).toBe(false);
    });

    it('2.2. Click en disabled: NO debe cambiar el estado si disabled es true', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.active).toBe(false);

      // se simula el click al estar en false
      label.click();
      await element.updateComplete;

      // no debe de hacer ningun cambio se debe de mantener en false
      expect(element.active).toBe(false);
    });

});

describe('UICheckbox - Lanzamiento del Evento', () => {

    let element;
    let label;

    beforeEach(async () => {
      element = document.createElement('ui-checkbox');
      document.body.appendChild(element);
      await element.updateComplete;
      label = element.shadowRoot.querySelector('label.checkbox-label');
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

    // se obtiene los datos del evento si es active o no
    const emittedEvent = changeSpy.mock.calls[0][0];
    expect(emittedEvent.detail).toEqual({ active: true });

    label.click();
    await element.updateComplete;
    //al volver a presionar el estado active debe ser false para que se desactive el componente
    expect(changeSpy).toHaveBeenCalledTimes(2);
    const secondEvent = changeSpy.mock.calls[1][0];
    expect(secondEvent.detail).toEqual({ active: false });
  });

  it('3.2. Evento en disabled: NO se dispara el evento "change" si está en disabled', async () => {
    
    element.disabled = true;//se configura en disabled
    await element.updateComplete;
    const changeSpy = vi.fn();
    element.addEventListener('change', changeSpy);

    //se da el click
    label.click();
    await element.updateComplete;

    // espera recibir un evento pero no se obtiene
    expect(changeSpy).not.toHaveBeenCalled();
  });


});