const main = document.getElementById("main-container")
const cursosDt = JSON.parse(localStorage.getItem("cursos")) || [];


main.innerHTML = cursosDt.map(c => `
      <table>
        <tr>${c.area}</tr>
      </table>  
      <span class="curso-area">${c.area}</span>
        
        <span class="curso-nivel nivel-${c.nivel.toLowerCase()}">${c.nivel}</span>
      <h3 class="curso-nombre">${c.nombre}</h3>
      <p class="curso-desc">${c.descripcion || "Sin descripción"}</p>
      <div class="curso-footer">
      
        <span>⏱ ${c.duracion}</span>
        <span>📋 ${c.sesiones.length} sesión${c.sesiones.length !== 1 ? "es" : ""}</span>
        <span>👨‍🏫 ${c.sesiones[0]?.docenteNombre || "Sin docente"}</span>  
      </div>
    </div>
  `).join("");

main.innerHTML = cursosDt.map(c => `
        <table>
            <tr> 
                <th>Nombre</th>
                <td>${c.nombre}</td>
            </tr>
            <tr> 
                <th>Area</th>
                <td>${c.area}</td>
            </tr>
            <tr> 
                <th>Duracion</th>
                <td>${c.duracion}</td>
            </tr>
            <tr> 
                <th>Sesiones</th>
                <td>${c.sesiones.length}</td>
            </tr>
      </table>  
    `
  ).join("");


