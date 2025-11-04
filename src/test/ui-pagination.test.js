import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent } from '@testing-library/dom'; 

describe('UIPagination - 1. Propiedades y Estado Inicial', () => {

  let element; 
  let prevButton; 
  let nextButton; 

  beforeEach(async () => {
    element = document.createElement('ui-pagination');
    document.body.appendChild(element);
    await element.updateComplete;
    
    const buttons = element.shadowRoot.querySelectorAll('.pagination-button');
    prevButton = buttons[0]; 
    nextButton = buttons[buttons.length - 1]; 
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

    // -----------------------TEST - SECTION ---------------------------

  it('1.1. Estado por Defecto: Debe inicializar con currentPage en 1 y totalPages en 13 por defecto', async () => {
    await element.updateComplete;
    expect(element.currentPage).toBe(1);
    expect(element.totalPages).toBe(13); 
  });

  it('1.2. Botón Deshabilitado: Si esta en la página 1', async () => {
    element.currentPage = 1;
    await element.updateComplete;

    expect(prevButton.hasAttribute('disabled')).toBe(true);
    expect(nextButton.hasAttribute('disabled')).toBe(false); 
  });

});

describe('UIPagination - 2. Lógica de Navegación', () => {

    let element; 
    let prevButton; 
    let nextButton; 
    let changePageSpy;

    beforeEach(async () => {
        // escenario de prueba: 10 páginas, en la página 5
        element = document.createElement('ui-pagination');
        element.totalPages = 10;
        element.currentPage = 5;
        document.body.appendChild(element);
        
        await element.updateComplete;
        
        const buttons = element.shadowRoot.querySelectorAll('.pagination-button');
        prevButton = buttons[0]; 
        nextButton = buttons[buttons.length - 1]; 

        //verificar si se dispara el evento 'page-change'
        changePageSpy = vi.fn();
        element.addEventListener('page-change', changePageSpy);
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    it('2.1. Cambio de Página (Click): Debe cambiar a la Página 6 y emitir el evento', async () => {
        // Encontrar el 5to botón, que es la PÁGINA 6
        const page6Button = element.shadowRoot.querySelector('.page-numbers button:nth-child(5)'); 
 
        page6Button.click();
        await element.updateComplete;

        // Verifica que la propiedad cambió a 6
        expect(element.currentPage).toBe(6);
        
        // Verifica que se emitió el evento con el valor correcto
        expect(changePageSpy).toHaveBeenCalledTimes(1);
        expect(changePageSpy.mock.calls[0][0].detail.page).toBe(6);
    });

    it('2.2. Botón "Next" Deshabilitado: Debe estar deshabilitado en la última página', async () => {
        // Ir a la última página 10
        element.currentPage = 10;
        await element.updateComplete;

        expect(nextButton.hasAttribute('disabled')).toBe(true);
        expect(prevButton.hasAttribute('disabled')).toBe(false); 
    });
    
    it('2.3. No Cambia si es la Misma Página: No debe emitir evento', async () => {
        const activePageButton = element.shadowRoot.querySelector('.pagination-button.active'); 
        //simula click
        activePageButton.click();
        await element.updateComplete;

        expect(element.currentPage).toBe(5);
        expect(changePageSpy).not.toHaveBeenCalled();
    });

    it('2.4. Cambio con Flechas: Debe moverse a la página siguiente al hacer clic en Next', async () => {
        // pagina 5
        expect(element.currentPage).toBe(5);

        // Click en el btn
        nextButton.click();
        await element.updateComplete;

        // Debe moverse a la pagina 6
        expect(element.currentPage).toBe(6);
        expect(changePageSpy).toHaveBeenCalledTimes(1);
    });

});


