import { describe, expect, it, vi } from 'vitest';

describe('UI-button - Properties ', () => {

    let element;

    beforeEach(() => {
      element = document.createElement('ui-button');
      document.body.appendChild(element); 
    });

    afterEach(() => {
      document.body.removeChild(element);
    });


    // -----------------------TEST - SECTION ---------------------------


  it('Propiedad Size: Debe ser "medium" por defecto (sin clase "sm")', async () => {
    
    await element.updateComplete;

    expect(element.size).toBe('medium'); 
    
    const button = element.shadowRoot.querySelector('button');
    expect(button.classList.contains('sm')).toBe(false); 

  });

  // ----------------------- TEST 2: PRUEBA DE CAMBIO DE VALOR (SMALL) ---------------------------

  it('Propiedad Size: Debe aplicar la clase "sm" cuando size="small"', async () => {
    
    element.size = 'small';
    await element.updateComplete;

    expect(element.size).toBe('small'); 
    
    const button = element.shadowRoot.querySelector('button');
    expect(button.classList.contains('sm')).toBe(true); 

  });

   // ----------------------- TEST 3: PRUEBA DE CAMBIO DE VALOR TIPO DE BTN ---------------------------
  it('Propiedad Type: Debe ser "primary" por defecto', async () => {
    await element.updateComplete;

    expect(element.type).toBe('primary'); 
    
    const button = element.shadowRoot.querySelector('button');
    expect(button.classList.contains('primary')).toBe(true); 

  });

   // ----------------------- TEST 4: PRUEBA DE CAMBIO DE VALOR TIPO DE BTN ---------------------------

  it('Propiedad Type: Debe ser "secondary"', async () => {
    element.type = 'secondary';
    await element.updateComplete;

    expect(element.type).toBe('secondary'); 
    
    const button = element.shadowRoot.querySelector('button');
    expect(button.classList.contains('secondary')).toBe(true); 

  });

  // ----------------------- TEST 5: PRUEBA DE CAMBIO DE VALOR TIPO DE BTN ---------------------------

  it('Propiedad Type: Debe ser "tertiary"', async () => {
    element.type = 'tertiary';
    await element.updateComplete;

    expect(element.type).toBe('tertiary'); 
    
    const button = element.shadowRoot.querySelector('button');
    expect(button.classList.contains('tertiary')).toBe(true); 

  });


  // ----------------------- TEST 6: PRUEBA DE CAMBIO DE VALOR TIPO DE BTN ---------------------------

  it('Propiedad Disabled: Se activa correctamente', async () => {
    element.disabled = true;
    await element.updateComplete;

    expect(element.disabled).toBe(true); 
    
    const button = element.shadowRoot.querySelector('button');
    expect(button.disabled).toBe(true); 

  });

   // ----------------------- TEST 7: PRUEBA DE CAMBIO DE VALOR TIPO DE BTN ---------------------------

  it('Propiedad fullWidth: Se activa correctamente', async () => {
    element.fullWidth = true;
    await element.updateComplete;

    expect(element.fullWidth).toBe(true); 
    
    const button = element.shadowRoot.querySelector('button');
    expect(button.classList.contains('full-width')).toBe(true); 

  });


  // ------------------------ TEST 8: Evento click -------------------
  it('Se dispara el evento "click":', async () => {
    
    const clickSpy = vi.fn();
    
    element.addEventListener('click', clickSpy);

    await element.updateComplete;

    const internalButton = element.shadowRoot.querySelector('button');
    internalButton.click(); 

    expect(clickSpy).toHaveBeenCalled();
   
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });


  // ----------------------- TEST 9: Evento click ---------------------------
  it('NO debe disparar un evento "click" si el botón está deshabilitado', async () => {
    
    element.disabled = true;
    
    const clickSpy = vi.fn();
    element.addEventListener('click', clickSpy);
    
    await element.updateComplete; 

    const internalButton = element.shadowRoot.querySelector('button');

    expect(internalButton.disabled).toBe(true); 
    internalButton.click();

    expect(clickSpy).not.toHaveBeenCalled();
  });


});