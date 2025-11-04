import { describe, expect, it, vi } from 'vitest';

describe('UITag - 1. Propiedades y Lógica de Clases', () => {

  let element;

  beforeEach(async () => {
    element = document.createElement('ui-tag');
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

 // -----------------------TEST - SECTION ---------------------------

  it('1.1. Estado por Defecto: type="primary", tag="neutral" y no "removable"', () => {
    expect(element.type).toBe('primary');
    expect(element.tag).toBe('neutral');
    expect(element.removable).toBe(false);
    expect(element.hasBorder).toBe(false);
  });

  it('1.2. Combinacion de estilos: se debe aplicar las clases', async () => {
    element.tag = 'positive';
    element.type = 'secondary';
    element.hasBorder = true;
    await element.updateComplete;

    // obtiene el nombre del contenedor del tag
    const container = element.shadowRoot.querySelector('.tag-container');
    
    // Valida si los datos mencionados se muestran como deben de ser
    expect(container.classList.contains('positive')).toBe(true);
    expect(container.classList.contains('secondary')).toBe(true);
    expect(container.classList.contains('hasBorder')).toBe(true);
  });

  it('1.3. isRemovable btn: por defecto no debe de aparecer', () => {
    const removeButton = element.shadowRoot.querySelector('.remove-icon');
    // no debe de existir
    expect(removeButton).toBe(null);
  });

  it('1.4. Propiedad removable = True debe de mostrar el btn', async () => {
    element.removable = true;
    await element.updateComplete;

    // busca el btn
    const removeButton = element.shadowRoot.querySelector('.remove-icon');
    
    expect(removeButton).not.toBe(null); // si debe existir
  });

  it('2.1. Renderizado de Slot: Se muestra el texto asignado', async () => {
    
    element.textContent = 'Tag de Prueba';
    await element.updateComplete;

    // obtiene el slot del componente
    const slot = element.shadowRoot.querySelector('slot');
    const assignedNodes = slot.assignedNodes();

    // Verifica que sea un texto
    expect(assignedNodes.length).toBeGreaterThan(0);
    expect(assignedNodes[0].nodeType).toBe(Node.TEXT_NODE); 
    expect(assignedNodes[0].textContent).toBe('Tag de Prueba');
  });

});

describe('UITag - 3. Emisión de Eventos', () => {

  let element;

  beforeEach(async () => {
    element = document.createElement('ui-tag');
    element.removable = true; 
    element.id = 'tag-de-prueba'; // Asignamos un ID para probar el 'detail'
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('3.1. Lanzamiento de Evento: Debe disparar "tag-remove" al hacer clic en el botón "X"', async () => {
    const removeSpy = vi.fn();
    element.addEventListener('tag-remove', removeSpy);
    //se obtiene le btn para remover
    const removeButton = element.shadowRoot.querySelector('.remove-icon');
    expect(removeButton).not.toBe(null); 

    //se simula el click
    removeButton.click();
    await element.updateComplete;

    // checa que se haya mandado solo una vez el click
    expect(removeSpy).toHaveBeenCalledTimes(1); 
  });

  it('3.2. Verificación: El evento "tag-remove" debe contener el "id"', async () => {

    const removeSpy = vi.fn();
    element.addEventListener('tag-remove', removeSpy);
    const removeButton = element.shadowRoot.querySelector('.remove-icon');
    removeButton.click();
    await element.updateComplete;
    expect(removeSpy).toHaveBeenCalled(); 

    const emittedEvent = removeSpy.mock.calls[0][0]; // Obtiene el objeto 'event'
    
    // obtiene lo que lanzo el evento
    expect(emittedEvent.detail).toEqual({
      id: 'tag-de-prueba' 
    });
  });

  it('3.3. NO se debe disparar "tag-remove" al hacer clic en el contenedor (fuera del botón "X")', async () => {

    const removeSpy = vi.fn();
    element.addEventListener('tag-remove', removeSpy);
    const container = element.shadowRoot.querySelector('.tag-container');
    container.click(); 
    await element.updateComplete;

    expect(removeSpy).not.toHaveBeenCalled(); 
  });

});
