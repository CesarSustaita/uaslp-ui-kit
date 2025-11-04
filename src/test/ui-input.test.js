import { describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/dom';

describe('UInput - 1. Propiedades y Renderizado', () => {

  let element;

  beforeEach(async () => {
    element = document.createElement('ui-input');
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

 // -----------------------TEST - SECTION ---------------------------

  it('1.1. Estado por Defecto - renderizacion de datos por defecto', () => {
    expect(element.label).toBe('Label');
    expect(element.description).toBe('');
    expect(element.placeholder).toBe('Placeholder');
    expect(element.error).toBe('');
    expect(element.disabled).toBe(false);
    expect(element.value).toBe('');
  });

  it('1.2. Renderizado de Textos: label y description ', async () => {
    element.label = 'Nombre Completo';
    element.description = 'Ayuda para el usuario';
    
    await element.updateComplete;

    // se agregan los textos en los elementos correspondientes
    const label = element.shadowRoot.querySelector('.label-text');
    const desc = element.shadowRoot.querySelector('.description-text');

    //se obtienen los textos mencionados
    expect(label.textContent).toBe('Nombre Completo');
    expect(desc).not.toBe(null); 
    expect(desc.textContent).toBe('Ayuda para el usuario');
  });

  it('1.3. Atributos: placeholder e inputmode deben pasarse ya que son atributos por defecto del input tipo text', async () => {
    element.placeholder = 'Escribe aquí...';
    element.inputmode = 'numeric';
    
    await element.updateComplete;

    const input = element.shadowRoot.querySelector('input.input-field');
    
    expect(input.placeholder).toBe('Escribe aquí...');
    expect(input.getAttribute('inputmode')).toBe('numeric');
  });

  it('1.4. Estado disabled debe implementarse', async () => {
    element.disabled = true;

    await element.updateComplete;
    const input = element.shadowRoot.querySelector('input.input-field');
    
    // Se espera que el input entre con los estilos disabled
    expect(input.disabled).toBe(true);
  });

  it('1.5. Estado de Error: "error" debe mostrar el mensaje y aplicar los estilos CSS', async () => {
    // obtiene la seccion del mensaje error
    let errorMsg = element.shadowRoot.querySelector('.error-message');
    expect(errorMsg).toBe(null); 
    // el usuario implmenta un mensaje de error si es que lo hay
    element.error = 'Este campo es obligatorio';
    await element.updateComplete;

    // en el input-container (general) se debe de implementar el hijo error
    const container = element.shadowRoot.querySelector('.input-container');
    errorMsg = element.shadowRoot.querySelector('.error-message');

    // nos asesoramos que si hay un error los estilos y el msm se agreguen correctamente.
    expect(container.classList.contains('has-error')).toBe(true);
    expect(errorMsg).not.toBe(null);
    expect(errorMsg.textContent).toBe('Este campo es obligatorio');
  });
});


describe('UInput - 2. Flujo de Datos y Eventos', () => {

  let element;
  let input; 

  beforeEach(async () => {
    element = document.createElement('ui-input');
    document.body.appendChild(element);
    await element.updateComplete;
    input = element.shadowRoot.querySelector('input.input-field');
    expect(input).not.toBe(null);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('2.1. Asignar valores de entrada y recibidos al input', async () => {

    expect(input.value).toBe('');
    element.value = 'Texto de prueba';
    await element.updateComplete;

    expect(input.value).toBe('Texto de prueba');
  });

  it('2.2. El input debe de lanzar un evento al estar siendo escrito por el usuario', async () => {
    
    const inputSpy = vi.fn();
    element.addEventListener('input', inputSpy); // Escucha el evento input

    //se hace la simulacion de escritura 
    fireEvent.input(input, { target: { value: 'hola' } });
    await element.updateComplete;

    // se verifica las veces que debe de ser lanzado el evento
    expect(inputSpy).toHaveBeenCalledTimes(1);
    
    // obtiene el valor del evento emitido
    const emittedEvent = inputSpy.mock.calls[0][0];
    expect(emittedEvent.detail).toEqual({ value: 'hola' });
  });

  it('2.3. Se dispara el evento cuando se pierde el foco en el mismo input', async () => {
    
    // 1. Arrange
    const changeSpy = vi.fn();
    element.addEventListener('change', changeSpy); // Escucha el evento 'change'

    fireEvent.change(input, { target: { value: 'mundo' } });
    await element.updateComplete;
    expect(changeSpy).toHaveBeenCalledTimes(1);
    const emittedEvent = changeSpy.mock.calls[0][0];
    expect(emittedEvent.detail).toEqual({ value: 'mundo' });
  });

  it('2.4.No debe disparar eventos si está en estado disabled', async () => {

    element.disabled = true;
    await element.updateComplete;
    
    const inputSpy = vi.fn();
    element.addEventListener('input', inputSpy);

    // se hace el intento de escritura
    fireEvent.input(input, { target: { value: 'prueba' } });
    await element.updateComplete;

    // no debe de disparar nada.
    expect(inputSpy).not.toHaveBeenCalled();
  });

});


describe('UInput - 3. Slots (Iconos)', () => {

  let element;

  beforeEach(async () => {
    element = document.createElement('ui-input');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('3.1. Renderizado de Slots: Se renderiza contenido en "icon-start" y "icon-end"', async () => {
    
    // se preparan y se asignan los slots
    const iconStart = document.createElement('span');
    iconStart.slot = 'icon-start'; // Asigna el slot
    iconStart.textContent = 'ICONO-INICIO';
    element.appendChild(iconStart); // Añade el icono al input

    const iconEnd = document.createElement('span');
    iconEnd.slot = 'icon-end';
    iconEnd.textContent = 'ICONO-FIN';
    element.appendChild(iconEnd);

    await element.updateComplete;

    // se implementan los slots dentro del input
    const slotStart = element.shadowRoot.querySelector('slot[name="icon-start"]');
    const slotEnd = element.shadowRoot.querySelector('slot[name="icon-end"]');

    // se verifica que el slot de icono de inicio y final se implemente
    expect(slotStart.assignedNodes().length).toBe(1);
    expect(slotStart.assignedNodes()[0].textContent).toBe('ICONO-INICIO');
    expect(slotEnd.assignedNodes().length).toBe(1);
    expect(slotEnd.assignedNodes()[0].textContent).toBe('ICONO-FIN');
  });

});