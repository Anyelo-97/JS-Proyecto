const cursos = document.getElementById("cursos");
const addCursos = document.getElementById("addCursos")

const savedData = JSON.parse(localStorage.getItem('user'));

if (savedData) {
  Object.keys(savedData).forEach(key => {
      const input = document.getElementById(key);
      if (input) {
          input.value = savedData[key];
      }
  });
}
const rol = savedData.rol
if (rol === "Administrativo") {
    addCursos.innerHTML = `  
    <button id="btnAdd" class="btnAdd">Añadir curso</button>
    
    `;

}

