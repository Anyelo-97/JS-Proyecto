document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('profileForm');
    
    //Cargar datos del LocalStorage al iniciar
    const savedData = JSON.parse(localStorage.getItem('userProfile'));

    if (savedData) {
        Object.keys(savedData).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = savedData[key];
            }
        });
        
     //Actualizar el nombre visual en el header
        document.getElementById('display-name').textContent = savedData.nombre || "Usuario";
    }

    //Guardar datos al hacer submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        //Guardar en LocalStorage como String JSON
        localStorage.setItem('userProfile', JSON.stringify(data));

        //Actualizar UI al instante mr anyelo
        document.getElementById('display-name').textContent = data.nombre;
        
        alert('¡Información guardada con éxito!');
    });
});