let currentStep = 1;
const totalSteps = 4;
const labels = ["Datos Personales", "Composición", "Medidas", "Salud"];

function updateUI() {
    // Actualizar barra de progreso
    document.getElementById('progressBar').style.width = ((currentStep / totalSteps) * 100) + '%';
    document.getElementById('stepLabel').innerText = labels[currentStep - 1];
    document.getElementById('stepCounter').innerText = `${currentStep}/${totalSteps}`;

    // Mostrar/Ocultar cartas
    for (let i = 1; i <= totalSteps; i++) {
        const card = document.getElementById('step' + i);
        if (i === currentStep) {
            card.classList.add('active');
            // Resetear scroll interno
            const scrollArea = card.querySelector('.card-scroll-area');
            if(scrollArea) scrollArea.scrollTop = 0;
        } else {
            card.classList.remove('active');
        }
    }
}

function nextStep(step) {
    const currentCard = document.getElementById('step' + step);
    const requiredInputs = currentCard.querySelectorAll('input[required], select[required]');
    let valid = true;

    // Validación de campos requeridos
    requiredInputs.forEach(input => {
        if (!input.value) {
            valid = false;
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
}

function prevStep(step) {
    if (currentStep > 1) {
        currentStep--;
        updateUI();
    }
}

// Inicializar la interfaz al cargar el script
document.addEventListener('DOMContentLoaded', updateUI);