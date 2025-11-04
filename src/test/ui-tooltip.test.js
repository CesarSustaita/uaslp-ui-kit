import { describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom'; 

describe('UITooltip - 1. Propiedades y Renderizado', () => {

  let element; 
  let container; 

  beforeEach(async () => {
    element = document.createElement('ui-tooltip');
    document.body.appendChild(element);
    await element.updateComplete;
    container = element.shadowRoot.querySelector('.tooltip-container');
    expect(container).not.toBeNull(); 
  });

  afterEach(() => {
    document.body.removeChild(element);
  });
    
// -----------------------TEST - SECTION ---------------------------

  it('1.1. Estados por Defecto', () => {
    expect(element.text).toBe('Mensaje de ayuda.');
    expect(element.body).toBe('');
    expect(element.position).toBe('top');
    expect(element.visible).toBe(false);
  });

  it('1.2. Renderizado de Contenido: "text" y "body" deben renderizarse', async () => {
    element.text = 'Título del Tooltip';
    element.body = 'Descripción.';
    await element.updateComplete;

    const titleDiv = element.shadowRoot.querySelector('.title');
    const bodyDiv = element.shadowRoot.querySelector('.body-text');

    expect(titleDiv.textContent).toBe('Título del Tooltip');
    expect(bodyDiv.textContent).toBe('Descripción.');
  });

  it('1.3. Aplicación de Posición: "position" debe aplicarse al contenedor', async () => {
    element.position = 'right'; //top, bottom, left
    await element.updateComplete;

    // valida los estilos css de right
    expect(container.getAttribute('position')).toBe('right');
  });

  it('1.4. Atributo tabindex: Debe asegurarse de que existe para foco/accesibilidad', () => {
    //  tabindex nesta en connectedCallback)
    //  el componente se renderiza en el beforeEach
    
    // Verificamos que el atributo tabindex fue seteado
    expect(element.getAttribute('tabindex')).toBe('0');
  });

});

describe('UITooltip - 2. Interacción y Visibilidad', () => {

    let element; 
    let container;

    beforeEach(async () => {
        element = document.createElement('ui-tooltip');
        document.body.appendChild(element);
        await element.updateComplete;
        container = element.shadowRoot.querySelector('.tooltip-container');
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    // -----------------------MOUSE INTERACCIONES---------------------------

    it('2.1. Mouse - Mostrar: Debe ser visible en "mouseenter"', async () => {
        expect(element.visible).toBe(false);

        // simula la deteccion del mouse
        fireEvent.mouseEnter(element);
        await element.updateComplete;
        //cambia de estado a visible
        expect(element.visible).toBe(true);
        expect(container.classList.contains('is-visible')).toBe(true);
    });

    it('2.2. Mouse - Ocultar: Debe ocultarse en "mouseleave"', async () => {
        // se forza que se vea el tooltip
        element.visible = true;
        await element.updateComplete;
        expect(element.visible).toBe(true);
        
        // se simula el mouseleave
        fireEvent.mouseLeave(element);
        await element.updateComplete;

        // debe ser falsa la visibilidad una vez de que deja el foco el mouseleave
        expect(element.visible).toBe(false);
        // cambia el estado a false
        expect(container.classList.contains('is-visible')).toBe(false);
    });

    // -----------------------TECLADO INTERACCIONES---------------------------

    it('2.3. Teclado - Mostrar: Debe ser visible en "focus"', async () => {
        expect(element.visible).toBe(false);
        
        // se simula por medio del teclado 
        fireEvent.focus(element);
        await element.updateComplete;

        // cambia el estado a true
        expect(element.visible).toBe(true);
        expect(container.classList.contains('is-visible')).toBe(true);
    });

    it('2.4. Teclado - Ocultar: Debe ocultarse en "blur"', async () => {
        // se mantiene la visibilidad
        element.visible = true;
        await element.updateComplete;
        expect(element.visible).toBe(true);
        
        // se simula que se pierde el foco
        fireEvent.blur(element);
        await element.updateComplete;

        // cambia de true a false. 
        expect(element.visible).toBe(false);
        expect(container.classList.contains('is-visible')).toBe(false);
    });
    
});
