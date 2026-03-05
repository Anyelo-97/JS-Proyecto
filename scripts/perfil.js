document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('profileForm');
    const input = document.getElementById('nombre')
    
    //Cargar datos del LocalStorage al iniciar
    const savedData = JSON.parse(localStorage.getItem('user'));

    if (savedData) {
        Object.keys(savedData).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = savedData[key];
            }
        });
        
     //Actualizar el nombre visual en el header
        document.getElementById('display-name').textContent = savedData.named;
        document.getElementById('display-role').textContent = savedData.description;
        input.removeAttribute('placeholder');
        input.value = savedData.named;
    }

    //Guardar datos al hacer submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        //Guardar en LocalStorage como String JSON
        localStorage.setItem('userProfile', JSON.stringify(data));

        //Actualizar UI al instante mr anyelo
        document.getElementById('display-name').textContent = data.named;
        
        alert('¡Información guardada con éxito!');
    });
});