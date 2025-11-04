import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

describe('UIAccordion - 1. Propiedades y Renderizado', () => {

  let element; 
  let details; 
  let summary;
  let labelDiv;

  beforeEach(async () => {
    element = document.createElement('ui-accordion');
    document.body.appendChild(element);
    await element.updateComplete;

    details = element.shadowRoot.querySelector('details');
    summary = element.shadowRoot.querySelector('summary');
    labelDiv = element.shadowRoot.querySelector('.label-text');
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('1.1. Estado por Defecto: Debe tener valores y estado "open=false"', () => {
    expect(element.title).toBe('Title');
    expect(element.label).toBe('Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes.');
    expect(element.open).toBe(false); 
    expect(element.name).toBe('accordion');
  });

  it('1.2. Renderizado de Contenido: El título y el label deben renderizarse', async () => {
    element.title = 'Sección de Configuración';
    element.label = 'Detalles de la configuración.';
    await element.updateComplete;
    // se muestra donde van
    expect(summary.textContent.trim()).toContain('Sección de Configuración');
    expect(labelDiv.textContent).toContain('Detalles de la configuración.');
  });

  it('1.3. Estado incial Cerrado: La propiedad "open=false" ', async () => {
    element.open = false;
    await element.updateComplete;
    expect(details.hasAttribute('open')).toBe(false);
  });
});

describe('UIAccordion - 2. Interacción y Sincronización', () => {

    let element; 
    let details; 
    let summary; 
    let toggleIcon;

    beforeEach(async () => {
        element = document.createElement('ui-accordion');
        document.body.appendChild(element);
        await element.updateComplete;

        details = element.shadowRoot.querySelector('details');
        summary = element.shadowRoot.querySelector('summary');
        toggleIcon = element.shadowRoot.querySelector('.toggle-icon');
        
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    it('2.1. Sincronización de open: Cambiar la propiedad "open" de Lit debe aplicar el atributo nativo', async () => {
        expect(details.hasAttribute('open')).toBe(false);
        element.open = true;
        await element.updateComplete;

        // se asesora que el cambio se realizo
        expect(details.hasAttribute('open')).toBe(true);
        expect(element.open).toBe(true);
    });

    it('2.2. Rotación del Ícono: El ícono debe rotar 180deg cuando está abierto', async () => {
        element.open = true;
        await element.updateComplete;

        // se obtiene el icono
        const style = window.getComputedStyle(toggleIcon);
        
        // obtiene la trasnformacion del icono
        expect(style.transform).not.toBe('none'); 
        // ontiene que la trasnformacion sea de 0 deg
        expect(toggleIcon.style.transform).not.toBe('rotate(0deg)');
    });

});
