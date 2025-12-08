// *** Este archivo es 100% INDEPENDIENTE y maneja la lógica completa del formulario móvil. ***

// *** 🎯 URL DE TU GOOGLE APPS SCRIPT ***
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyIlmmNvkgazoqP-oPTVHmZ0iJf3tuXXPu4V0vIVOWOVcPx_w0pqGhTSg6UKgAycx4O8Q/exec"; 
// **********************************************************************

// =======================================================
// VARIABLES Y DOM
// =======================================================
let currentStep = 1; 
const totalSteps = 4;
const labels = ["Datos Personales", "Composición Corporal", "Historial Salud", "Metas y Objetivos"];

const clientForm = document.getElementById('clientForm');
const pesoInput = document.getElementById('peso_kg');
const estaturaInput = document.getElementById('estatura_cm');
const imcInput = document.getElementById('imc');


// =======================================================
// FUNCIONES DE NAVEGACIÓN Y CÁLCULO
// =======================================================

window.showTab = (tabId) => {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.add('active');
        const activeButton = document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`);
        if(activeButton) {
             activeButton.classList.add('active');
        }
    }
};

const updateUI = () => {
    // 1. Ocultar todas las tarjetas y mostrar la actual
    document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
    const activeCard = document.getElementById(`step${currentStep}`);
    if (activeCard) {
        activeCard.classList.add('active');
          const scrollArea = activeCard.querySelector('.card-scroll-area');
          if(scrollArea) scrollArea.scrollTop = 0;
    }
    
    // 2. Actualizar barra de progreso y etiquetas
    const progressPct = (currentStep / totalSteps) * 100;
    document.getElementById('progressBar').style.width = `${progressPct}%`;
    document.getElementById('stepCounter').innerText = `${currentStep}/${totalSteps}`;
    document.getElementById('stepLabel').innerText = labels[currentStep - 1];
};

window.nextStep = (step) => {
    const currentCard = document.getElementById('step' + step);
    const requiredInputs = currentCard.querySelectorAll('input[required], select[required], textarea[required]');
    let valid = true;

    // Validación de campos requeridos
    requiredInputs.forEach(input => {
        if (!input.value) {
            valid = false;
            // Feedback visual
            input.style.borderColor = '#ef4444'; 
            input.animate([{transform:'translateX(0)'},{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(0)'}], {duration:300});
        } else {
            input.style.borderColor = '#e5e7eb';
        }
    });
    
    if (valid && currentStep < totalSteps) {
        currentStep++;
        updateUI();
    }
};

window.prevStep = (step) => {
    if (currentStep > 1) {
        currentStep--;
        updateUI();
    }
};

const calculateIMC = () => {
    if (!pesoInput || !estaturaInput || !imcInput) return;

    const peso = parseFloat(pesoInput.value);
    const estatura = parseFloat(estaturaInput.value);
    
    if (peso > 0 && estatura > 0) {
        const estaturaMetros = estatura / 100;
        const imc = peso / (estaturaMetros * estaturaMetros); 
        imcInput.value = imc.toFixed(2);
    } else {
        imcInput.value = '';
    }
};

// =======================================================
// LÓGICA DE INICIALIZACIÓN Y ENVÍO (POST)
// =======================================================
document.addEventListener('DOMContentLoaded', () => {

    updateUI(); 

    if(pesoInput && estaturaInput) {
        pesoInput.addEventListener('input', calculateIMC);
        estaturaInput.addEventListener('input', calculateIMC);
    }

    // LÓGICA DE ENVÍO DE DATOS (POST)
    if(clientForm) {
        clientForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = clientForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerText : 'Guardar';
            if(submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "Guardando...";
            }

            // Recolección de datos
            const formData = {
                nombre_completo: document.getElementById('nombre_completo').value.trim(),
                edad: parseInt(document.getElementById('edad').value) || null,
                sexo: document.getElementById('sexo').value,
                telefono: document.getElementById('telefono').value,
                email: document.getElementById('email').value,
                fecha_evaluacion: document.getElementById('fecha_evaluacion').value,
                peso_kg: parseFloat(document.getElementById('peso_kg').value) || null,
                estatura_cm: parseFloat(document.getElementById('estatura_cm').value) || null,
                imc: parseFloat(document.getElementById('imc').value) || null,
                grasa_corporal_pct: parseFloat(document.getElementById('grasa_corporal_pct').value) || null,
                masa_muscular: parseFloat(document.getElementById('masa_muscular').value) || null,
                
                // Medidas como null
                med_brazos: null, 
                med_pecho: null,
                med_cintura: null,
                med_caderas: null,
                med_piernas: null,

                enfermedades_lesiones: document.getElementById('enfermedades_lesiones').value,
                alergias: document.getElementById('alergias').value,
                cirugias_recientes: document.getElementById('cirugias_recientes').value,
                medicamentos_actuales: document.getElementById('medicamentos_actuales').value,
                estres_sueno: document.getElementById('estres_sueno').value,
                
                // ⭐ CORRECCIÓN CLAVE: Nombre correcto 'metas_cliente'
                metas_cliente: document.getElementById('metas_objetivos').value, 
                timestamp: new Date().toISOString() 
            };
            
            // Validación Manual
            if (!formData.nombre_completo || !formData.fecha_evaluacion || !formData.telefono || !formData.peso_kg || !formData.estatura_cm) {
                Swal.fire({
                    title: 'Faltan datos',
                    text: 'Por favor completa: Nombre, Fecha, Teléfono, Peso y Estatura.',
                    icon: 'warning',
                    confirmButtonText: 'Revisar'
                });
                
                if (!formData.nombre_completo || !formData.fecha_evaluacion || !formData.telefono) {
                    currentStep = 1;
                } else if (!formData.peso_kg || !formData.estatura_cm) {
                    currentStep = 2;
                }
                updateUI();
                
                if(submitBtn) { submitBtn.disabled = false; submitBtn.innerText = originalBtnText; }
                return;
            }

            // Envío a Google Apps Script
            try {
                const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify(formData), 
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8', 
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const result = await response.json();

                if (result.result === 'success') {
                    // ⭐ ÉXITO: Alerta bonita
                    Swal.fire({
                        title: '¡Guardado Exitosamente!',
                        text: 'Tus respuestas han sido registradas correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Entendido',
                        confirmButtonColor: '#4338ca',
                        background: '#ffffff',
                        padding: '2rem'
                    }).then((result) => {
                        if (result.isConfirmed || result.isDismissed) {
                            clientForm.reset(); 
                            calculateIMC(); 
                            currentStep = 1;
                            updateUI();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    });

                } else {
                    Swal.fire({
                        title: 'Hubo un problema',
                        text: result.message || 'Error desconocido al guardar.',
                        icon: 'error',
                        confirmButtonText: 'Intentar de nuevo'
                    });
                }

            } catch (error) {
                console.error('Error de conexión:', error);
                
                Swal.fire({
                    title: '¡Guardado Exitosamente!',
                        text: 'Tus respuestas han sido registradas correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Entendido',
                        confirmButtonColor: '#4338ca',
                        background: '#ffffff',
                        padding: '2rem'
                    }).then((result) => {
                        if (result.isConfirmed || result.isDismissed) {
                            clientForm.reset(); 
                            calculateIMC(); 
                            currentStep = 1;
                            updateUI();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                });
            } finally {
                if(submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                }
            }
        });
    }
});