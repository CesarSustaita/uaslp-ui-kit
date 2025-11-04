import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

vi.useFakeTimers();

// Describe: Agrupa todas las pruebas para el componente UINotification
describe('UI-Notification - Propiedades y Renderizado', () => {

  let element;
  let removeSpy; 
  // beforeEach: Configura el componente antes de cada prueba
  beforeEach(() => {
    removeSpy = vi.spyOn(Element.prototype, 'remove').mockImplementation(() => {});
    // Crea una instancia de tu componente (JSDOM lo encuentra gracias a setup.js)
    element = document.createElement('ui-notification');
    // Lo adjuntamos al DOM virtual para que se ejecute el ciclo de vida
    document.body.appendChild(element); 
  });

  // afterEach: Limpia el DOM después de cada prueba
  afterEach(() => {
    if (document.body.contains(element)) {
            document.body.removeChild(element);
        }
        
        vi.clearAllTimers(); 
        vi.restoreAllMocks();
  });
  
  // ----------------------------------------------------

  // Test 1: Verifica el valor por defecto y la reflexión de 'open'
  it('Atributo "open" si esta presente debe de mostrarse ', () => {
    expect(element.open).toBe(undefined); 
    
    element.setAttribute('open', '');
    
    expect(element.open).toBe(true); 
  });

  // Test 2: Verifica que el atributo 'type' se refleja en el contenedor CSS
  it('Se aplica la propiedad Type: Warning', async () => {
    element.type = 'warning';
    
    await element.updateComplete;

    const container = element.shadowRoot.querySelector('.notification-container');

    expect(container.getAttribute('type')).toBe('warning');
  });

  // Test 2.1
  it('Se aplica la propiedad Type: Info', async () => {

    element.type = 'info';
    
    await element.updateComplete;

    const container = element.shadowRoot.querySelector('.notification-container');
    
    expect(container.getAttribute('type')).toBe('info');
  });

   // Test 2.2
  it('Se aplica la propiedad Type: Positive', async () => {

    element.type = 'positive';
    
    await element.updateComplete;

    const container = element.shadowRoot.querySelector('.notification-container');
    
    expect(container.getAttribute('type')).toBe('positive');
  });

   // Test 2.3
  it('Se aplica la propiedad Type: Negative', async () => {

    element.type = 'negative';
    
    await element.updateComplete;

    const container = element.shadowRoot.querySelector('.notification-container');
    
    expect(container.getAttribute('type')).toBe('negative');
  });

  //3.0 Auto-cierre despues de tiempo de duracion establecido
  it('Auto-cierre tiempo configurado por defecto 4s', async () => {
    //element.duration = 4000;
    element.open = true;

    await element.updateComplete;

    vi.advanceTimersByTime(4000);

    expect(element.open).toBe(false);

  });

  //3.1 Auto-cierre despues de tiempo de duracion establecido
  it('Auto-cierre tiempo configurado por el usuario 6s', async () => {
    element.duration = 6000;
    element.open = true;

    await element.updateComplete;

    vi.advanceTimersByTime(6000);

    expect(element.open).toBe(false);

  });

  //4.0 Cierre cuando el btn cancel esta activo
  it('Atributo Removable cerrando/removiendo componente', async () => {
    element.removable = true;
    element.open = true;
    element.close();

    await element.updateComplete;

    expect(element.open).toBe(false);
    
  });


  // Test 5.0 Propiedad Position
  it('Se aplica la propiedad Position: TR', async () => {

    element.position = 'TR';
  
    await element.updateComplete;

    const container = element.shadowRoot.querySelector('.notification-container');
    
    expect(container.getAttribute('position')).toBe('TR');
  
  });

  // Test 5.1 Propiedad Position
  it('Se aplica la propiedad Position: TC', async () => {

    element.position = 'TC';
    
    await element.updateComplete;

    const container = element.shadowRoot.querySelector('.notification-container');
    
    expect(container.getAttribute('position')).toBe('TC');
    
  });

  // Test 5.2 Propiedad Position
  it('Se aplica la propiedad Position: TL', async () => {

    element.position = 'TL';
    
    await element.updateComplete;

    const container = element.shadowRoot.querySelector('.notification-container');
    
    expect(container.getAttribute('position')).toBe('TL');
    
  });


  // Test 5.3 Propiedad Position
  it('Se aplica la propiedad Position: BR', async () => {

    element.position = 'BR';
    
    await element.updateComplete;

    const container = element.shadowRoot.querySelector('.notification-container');
    
    expect(container.getAttribute('position')).toBe('BR');
    
  });

  // Test 5.4 Propiedad Position
  it('Se aplica la propiedad Position: BC', async () => {

    element.position = 'BC';
    
    await element.updateComplete;

    const container = element.shadowRoot.querySelector('.notification-container');
    
    expect(container.getAttribute('position')).toBe('BC');
    
  });

  // Test 5.5 Propiedad Position
  it('Se aplica la propiedad Position: BL', async () => {

    element.position = 'BL';
    
    await element.updateComplete;

    const container = element.shadowRoot.querySelector('.notification-container');
    
    expect(container.getAttribute('position')).toBe('BL');
    
  });

  it('Cierre Manual: Debe setear open=false y programar eliminación del DOM', async () => {
        // removeSpy ya está activo desde beforeEach
        element.removable = true;
        element.open = true; 
        await element.updateComplete;

        const closeBtn = element.shadowRoot.querySelector('.close-btn');
        closeBtn.click(); 

        await element.updateComplete;

        expect(element.open).toBe(false);
        
        // La eliminación ocurre después de 500ms 
        vi.advanceTimersByTime(500); 
        expect(removeSpy).toHaveBeenCalledTimes(1); 
    });
    
    it('Cierre Manual: Debe limpiar el temporizador automático', async () => {
        //  Iniciar temporizador automático de 4s
        element.open = true;
        await element.updateComplete;

        //  Clic en el botón de cierre (simulamos un cierre manual)
        element.close(); 
        await element.updateComplete;
        vi.advanceTimersByTime(4000); 
        expect(element.open).toBe(false);
        vi.advanceTimersByTime(500);
        expect(removeSpy).toHaveBeenCalled();
    });
    it('Prevención de Reinicio: Reabrir NO debe reiniciar el timer si ya estaba abierto', async () => {
        // Abrir e iniciar timer de 4s
        element.open = true;
        await element.updateComplete;

        // 2. Act: Reabrir ANTES de que termine (debe mantener el timer original)
        // Simulamos un cambio de propiedad que desencadena el update()
        element.open = true; 
        await element.updateComplete;

        vi.advanceTimersByTime(4000); 

        // Debe haberse cerrado con el primer timer
        expect(element.open).toBe(false); 
    });

});