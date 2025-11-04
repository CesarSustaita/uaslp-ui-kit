import { describe, expect, it, vi } from 'vitest';


describe('UI-Switch - Properties and IDs', () => {

    let element;

    beforeEach(async() => {
      element = document.createElement('ui-switch');
      document.body.appendChild(element); 

      await element.updateComplete;
    });

    afterEach(() => {
      document.body.removeChild(element);
    });

    // -----------------------TEST - SECTION ---------------------------

    it('1.1: Propiedades: "checked=false" y "disabled=false" por defecto', () => {
        
        expect(element.checked).toBe(false);
        expect(element.disabled).toBe(false);

        // Verifica el estado del <input> interno en el Shadow DOM
        const input = element.shadowRoot.querySelector('input');
        expect(input.checked).toBe(false);
        expect(input.disabled).toBe(false);
    });

    it('1.2: Tiene un ID y un <label for> para accesibilidad', () => {
      const label = element.shadowRoot.querySelector('label');
      const input = element.shadowRoot.querySelector('input');

      // Verifica que el ID (aleatorio o no) existe y no está vacío
      expect(input.id).toBeDefined();
      expect(input.id.length).toBeGreaterThan(0); 

      expect(label.getAttribute('for')).toBe(input.id);
    });

    it('1.3: Se muestran las propiedades "checked" y "disabled" al switch/input', async () => {
    
      element.checked = true;
      element.disabled = true;

      await element.updateComplete;

      // Verifica que el <input> interno recibió los cambios
      const input = element.shadowRoot.querySelector('input');
      expect(input.checked).toBe(true);
      expect(input.disabled).toBe(true);
    });
});


describe('UISwitch - Interacción del Usuario (Clicks)', () => {
  
  let element;
  let label;

  beforeEach(async () => {
    element = document.createElement('ui-switch');
    document.body.appendChild(element);
    await element.updateComplete;
    // Obtenemos el label una vez
    label = element.shadowRoot.querySelector('label');
  });

  afterEach(() => {
    document.body.removeChild(element);
  });


  it('2.1. Haciendo Click: Cambio de checked de false a true', async () => {
    
    expect(element.checked).toBe(false);//el click esta apagado
    label.click(); //el click esta activado

    await element.updateComplete; 

    expect(element.checked).toBe(true);
    label.click(); // esta activo y despues se apaga

    await element.updateComplete;

    expect(element.checked).toBe(false); // debe de estar en la posicion final
  });


  it('2.2. Click disabled: NO debe cambiar el switch si disabled es true', async () => {
    
    element.disabled = true;
    await element.updateComplete;

    expect(element.checked).toBe(false);

    label.click();
    await element.updateComplete;

    expect(element.checked).toBe(false);
  });

});

describe('UISwitch - 3. Lanzamiento de Eventos (handleChange)', () => {

  let element;
  let label;

  beforeEach(async () => {
    element = document.createElement('ui-switch');
    document.body.appendChild(element);
    await element.updateComplete;
    label = element.shadowRoot.querySelector('label');
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('3.1. Evento: Se dispara un evento "change" al hacer click', async () => {
    
    const changeSpy = vi.fn();
    element.addEventListener('change', changeSpy);

    label.click(); //se hace el click
    await element.updateComplete;

    expect(changeSpy).toHaveBeenCalled(); //si se llamo?
    expect(changeSpy).toHaveBeenCalledTimes(1);//cuantas veces? 

    // se obtiene el evento change con la informacion
    const emittedEvent = changeSpy.mock.calls[0][0]; 
    
    //se obtiene el checked y el id
    expect(emittedEvent.detail).toEqual({
      checked: true,
      id: element.id
    });
  });


  it('3.2. Evento: NO debe disparar el evento "change" si está deshabilitado el switch', async () => {

    element.disabled = true; // se activa el disabled del componente
    await element.updateComplete;
    const changeSpy = vi.fn();
    element.addEventListener('change', changeSpy);

    label.click(); //se hace el click
    await element.updateComplete;

    expect(changeSpy).not.toHaveBeenCalled();
  });
});

