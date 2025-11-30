// *** Este archivo es EXCLUSIVO para el formulario móvil. ***

document.addEventListener('DOMContentLoaded', () => {

    // *** 🎯 URL DE TU GOOGLE APPS SCRIPT (Misma URL) ***
    const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxZ_lsNOECVi2RxbANScWR6kgAmTneNbkPXL9RWER_SK5tP-QEyUXUT3BlgT4XLJBFWyQ/exec"; 
    // *************************************************

    const clientForm = document.getElementById('clientForm');
    const pesoInput = document.getElementById('peso_kg');
    const estaturaInput = document.getElementById('estatura_cm');
    const imcInput = document.getElementById('imc');

    // --- CÁLCULO AUTOMÁTICO DE IMC ---
    const calculateIMC = () => {
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
    
    // Solo agregar listeners si los elementos existen (para evitar errores si este script se usara en otro lado)
    if(pesoInput && estaturaInput) {
        pesoInput.addEventListener('input', calculateIMC);
        estaturaInput.addEventListener('input', calculateIMC);
    }


    // --- ENVÍO DEL FORMULARIO (POST) ---
    if(clientForm) {
        clientForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = clientForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerText : 'Guardar';
            if(submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "Guardando...";
            }

            // Recolectar datos
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
                med_brazos: parseFloat(document.getElementById('med_brazos').value) || null,
                med_pecho: parseFloat(document.getElementById('med_pecho').value) || null,
                med_cintura: parseFloat(document.getElementById('med_cintura').value) || null,
                med_caderas: parseFloat(document.getElementById('med_caderas').value) || null,
                med_piernas: parseFloat(document.getElementById('med_piernas').value) || null,
                enfermedades_lesiones: document.getElementById('enfermedades_lesiones').value,
                alergias: document.getElementById('alergias').value,
                cirugias_recientes: document.getElementById('cirugias_recientes').value,
                medicamentos_actuales: document.getElementById('medicamentos_actuales').value,
                estres_sueno: document.getElementById('estres_sueno').value,
                timestamp: new Date().toISOString() 
            };

            if (!formData.nombre_completo || !formData.fecha_evaluacion) {
                alert('Por favor, completa el Nombre Completo y la Fecha de Evaluación.');
                if(submitBtn) { submitBtn.disabled = false; submitBtn.innerText = originalBtnText; }
                return;
            }

            // Envío de la solicitud HTTP POST
            try {
                const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify(formData), 
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const result = await response.json();

                if (response.ok && result.result === 'success') {
                    alert('¡Cliente registrado con éxito!');
                    clientForm.reset(); 
                    calculateIMC(); 
                    // Regresar al primer paso del formulario móvil
                    if(typeof updateUI === 'function') {
                        currentStep = 1;
                        updateUI();
                    }
                } else {
                    alert('Error al guardar los datos: ' + (result.message || 'Error desconocido'));
                }

            } catch (error) {
                console.error('Error de conexión:', error);
                alert('Error de red o conexión al intentar guardar los datos.');
            } finally {
                if(submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                }
            }
        });
    }
}); 