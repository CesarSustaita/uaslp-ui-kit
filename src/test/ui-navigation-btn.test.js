import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';


describe('UINavigationBtn - Renderizado y Propiedades', () => {

  let element; 
  let button; 

  beforeEach(async () => {
    element = document.createElement('ui-navigation-btn');
    document.body.appendChild(element);
    await element.updateComplete;
    button = element.shadowRoot.querySelector('button');
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('1.1. Estado por Defecto: Debe tener el texto "Previous"', () => {
    expect(element.type).toBe('previous');
    expect(element.disabled).toBe(false);
    
    expect(button.textContent.trim()).toContain('Previous'); 
  });

  it('1.2. Debe tener el texto por defecto "Next"', async () => {
    element.type = 'next';
    await element.updateComplete;

    expect(button.textContent.trim()).toContain('Next'); 
  });

  it('1.3. Renderizado de Label Personalizado: Debe usar el label en lugar del texto por defecto', async () => {
    element.type = 'next';
    element.label = 'Dashboard';
    await element.updateComplete;

    // valida el texto
    expect(button.textContent.trim()).toContain('Dashboard');
    expect(button.textContent.trim()).not.toContain('Next');
  });

  it('1.4. Propiedad "disabled": se debe de mostrar los estilos css', async () => {
    element.disabled = true;
    await element.updateComplete;

    // cambian los estilos
    expect(button.hasAttribute('disabled')).toBe(true);
    expect(element.disabled).toBe(true);
  });
});

describe('UINavigationBtn - Lógica de Contenido y Eventos', () => {

    let element; 
    let button; 
    let eventSpy;

    beforeEach(async () => {
        element = document.createElement('ui-navigation-btn');
        element.id = 'nav';
        document.body.appendChild(element);
        await element.updateComplete;
        button = element.shadowRoot.querySelector('button');

        eventSpy = vi.fn();
        element.addEventListener('click-navigation', eventSpy);
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    it('2.1. Orden de Contenido (txt): SVG debe ir ANTES del texto', async () => {
       
        await element.updateComplete; 
        // se verifica que sea el svg <-
        const firstChild = button.children[0]; 
        // lo confirma
        expect(firstChild.tagName.toUpperCase()).toBe('SVG');
    });

    it('2.2. Orden de Contenido ("next"): SVG debe ir DESPUÉS del texto', async () => {
        element.type = 'next';
        await element.updateComplete; 

        // checa que el svg sea al final ->
        const lastChild = button.children[button.children.length - 1]; 
        
        // confirma que sea el ultimo.
        expect(lastChild.tagName.toUpperCase()).toBe('SVG');
    });

    it('2.3. Lanzamiento de Evento Válida: Debe emitir click-navigation', async () => {
        element.type = 'next';
        await element.updateComplete;
        button.click();
        expect(eventSpy).toHaveBeenCalledTimes(1);
        
        const emittedEvent = eventSpy.mock.calls[0][0];
        // Valida la estructura del detalle: id y action
        expect(emittedEvent.detail).toEqual({ 
            id: 'nav',
            action: 'next'
        });
    });

    it('2.4. Lanzamiento de Evento en disabled: NO debe emitir evento ni propagar nada', async () => {
        element.disabled = true;
        await element.updateComplete;
        const nativeClickSpy = vi.fn();
        document.body.addEventListener('click', nativeClickSpy);
        button.click();
        // no emite ninguna llamada
        expect(eventSpy).not.toHaveBeenCalled();
        // rectifica que no haya propagado nada
        expect(nativeClickSpy).not.toHaveBeenCalled();
        document.body.removeEventListener('click', nativeClickSpy);
    });

});