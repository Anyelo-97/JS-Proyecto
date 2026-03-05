const cursos = document.getElementById("cursos");
const addCursos = document.getElementById("addCursos");
const avatarName = document.getElementById('avatar-name');
const savedData = JSON.parse(localStorage.getItem('user'));
let currentOpen = null;

if (savedData) {
  Object.keys(savedData).forEach(key => {
    const input = document.getElementById(key);
    if (input) input.value = savedData[key];
  });
  avatarName.textContent = savedData.named;
}

const rol = savedData.rol;

if (rol === "Administrativo") {
  addCursos.innerHTML = `<button id="btnAdd" class="btnAdd">+ Añadir curso</button>`;

  document.getElementById("btnAdd").addEventListener("click", () => {
    abrirModal();
  });
}


/**
 * Abre o cierra un dropdown por su ID.
 * @param {string} id - El identificador del dropdown (docentes, directivos, cursos, perfil)
 */
function toggleDropdown(id) {
  const dropdown = document.getElementById('dropdown-' + id);
  const btn = document.getElementById('btn-' + id);
  const backdrop = document.getElementById('backdrop');

  if (!dropdown || !btn) return;

  // Cierra otro dropdown abierto
  if (currentOpen && currentOpen !== id) {
    closeDropdown(currentOpen);
  }

  const isOpen = dropdown.classList.contains('open');

  if (isOpen) {
    closeDropdown(id);
  } else {
    dropdown.classList.add('open');
    btn.classList.add('open');
    backdrop.classList.add('active');
    currentOpen = id;
  }
}

/**
 * Cierra un dropdown por su ID
 * @param {string} id - identificador de dropdown
 */
function closeDropdown(id) {
  const dropdown = document.getElementById('dropdown-' + id);
  const btn = document.getElementById('btn-' + id);

  if (dropdown) dropdown.classList.remove('open');
  if (btn) btn.classList.remove('open');
  document.getElementById('backdrop').classList.remove('active');
  currentOpen = null;
}

// Cierra el dropdown al hacer clic en el backdrop
document.getElementById('backdrop').addEventListener('click', () => {
  if (currentOpen) closeDropdown(currentOpen);
});

// Asigna el toggle al botón de perfil
document.getElementById('btn-perfil').addEventListener('click', () => {
  toggleDropdown('perfil');
});

// Cierra dropdowns al presionar Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && currentOpen) {
    closeDropdown(currentOpen);
  }
});





// ─── MODAL ───────────────────────────────────────────────
function abrirModal() {
  // Evitar duplicados
  if (document.getElementById("modalCurso")) return;

  const overlay = document.createElement("div");
  overlay.id = "modalCurso";
  overlay.className = "modal-overlay";

  overlay.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <h2>Nuevo Curso</h2>
        <button class="modal-close" id="cerrarModal">✕</button>
      </div>

      <div class="modal-body">
        <!-- Datos principales -->
        <div class="form-group">
          <label>Nombre del curso <span class="req">*</span></label>
          <input type="text" id="nombreCurso" placeholder="Ej: Introducción a Python">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Área de enfoque <span class="req">*</span></label>
            <select id="areaCurso">
              <option value="">Seleccionar...</option>
              <option>Coding</option>
              <option>Matematicas</option>
              <option>Humanidades</option>
              <option>Ser</option>
              <option>Diseño gráfico</option>
              <option>Inglés</option>
              <option>Otro</option>
            </select>
          </div>

          <div class="form-group">
            <label>Duración <span class="req">*</span></label>
            <input type="text" id="duracionCurso" placeholder="Ej: 8 semanas">
          </div>
        </div>

        <div class="form-group">
          <label>Nivel de dificultad / Nivel alcanzado <span class="req">*</span></label>
          <div class="nivel-options">
            <label class="nivel-chip"><input type="radio" name="nivel" value="Principiante"> Principiante</label>
            <label class="nivel-chip"><input type="radio" name="nivel" value="Básico"> Básico</label>
            <label class="nivel-chip"><input type="radio" name="nivel" value="Intermedio"> Intermedio</label>
            <label class="nivel-chip"><input type="radio" name="nivel" value="Avanzado"> Avanzado</label>
            <label class="nivel-chip"><input type="radio" name="nivel" value="Experto"> Experto</label>
          </div>
        </div>

        <div class="form-group">
          <label>Breve descripción</label>
          <textarea id="descCurso" rows="3" placeholder="¿De qué trata este curso?"></textarea>
        </div>

        <!-- Sesiones -->
        <div class="sesiones-header">
          <label>Sesiones</label>
          <button type="button" id="btnAddSesion" class="btn-add-sesion">+ Añadir sesión</button>
        </div>
        <div id="listaSesiones" class="lista-sesiones"></div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancelar" id="cancelarModal">Cancelar</button>
        <button class="btn-guardar" id="guardarCurso">Guardar curso</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("cerrarModal").addEventListener("click", cerrarModal);
  document.getElementById("cancelarModal").addEventListener("click", cerrarModal);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) cerrarModal(); });

  let sesionCount = 0;
  document.getElementById("btnAddSesion").addEventListener("click", () => {
    sesionCount++;
    const sesionEl = document.createElement("div");
    sesionEl.className = "sesion-item";
    sesionEl.dataset.id = sesionCount;
    sesionEl.innerHTML = `
      <div class="sesion-num">S${sesionCount}</div>
      <div class="sesion-fields">
        <input type="text" placeholder="Título de la sesión" class="sesion-titulo">
        <input type="text" placeholder="Descripción breve" class="sesion-desc">
      </div>
      <button class="sesion-remove" title="Eliminar">✕</button>
    `;
    sesionEl.querySelector(".sesion-remove").addEventListener("click", () => {
      sesionEl.remove();
      renumerarSesiones();
    });
    document.getElementById("listaSesiones").appendChild(sesionEl);
  });

  document.getElementById("guardarCurso").addEventListener("click", () => {
    guardarCurso();
  });
}

function renumerarSesiones() {
  document.querySelectorAll(".sesion-item").forEach((el, i) => {
    el.querySelector(".sesion-num").textContent = `S${i + 1}`;
  });
}

function cerrarModal() {
  const modal = document.getElementById("modalCurso");
  if (modal) {
    modal.classList.add("modal-salida");
    setTimeout(() => modal.remove(), 250);
  }
}

function guardarCurso() {
  const nombre = document.getElementById("nombreCurso").value.trim();
  const area = document.getElementById("areaCurso").value;
  const duracion = document.getElementById("duracionCurso").value.trim();
  const desc = document.getElementById("descCurso").value.trim();
  const nivelEl = document.querySelector('input[name="nivel"]:checked');

  if (!nombre || !area || !duracion || !nivelEl) {
    alert("Por favor completa los campos obligatorios (*)");
    return;
  }

  const sesiones = [];
  document.querySelectorAll(".sesion-item").forEach((el, i) => {
    sesiones.push({
      numero: i + 1,
      titulo: el.querySelector(".sesion-titulo").value.trim(),
      descripcion: el.querySelector(".sesion-desc").value.trim(),
    });
  });

  const curso = {
    id: Date.now(),
    nombre,
    area,
    duracion,
    descripcion: desc,
    nivel: nivelEl.value,
    sesiones,
  };

  const cursosGuardados = JSON.parse(localStorage.getItem("cursos")) || [];
  cursosGuardados.push(curso);
  localStorage.setItem("cursos", JSON.stringify(cursosGuardados));

  cerrarModal();
  renderizarCursos();
}

function renderizarCursos() {
  const cursosGuardados = JSON.parse(localStorage.getItem("cursos")) || [];
  const contenedor = document.getElementById("cursos");

  if (cursosGuardados.length === 0) {
    contenedor.innerHTML = `<p class="no-cursos">No hay cursos registrados aún.</p>`;
    return;
  }

  contenedor.innerHTML = cursosGuardados.map(c => `
    <div class="curso-card">
      <div class="curso-card-header">
        <span class="curso-area">${c.area}</span>
        <span class="curso-nivel nivel-${c.nivel.toLowerCase()}">${c.nivel}</span>
      </div>
      <h3 class="curso-nombre">${c.nombre}</h3>
      <p class="curso-desc">${c.descripcion || "Sin descripción"}</p>
      <div class="curso-footer">
        <span>⏱ ${c.duracion}</span>
        <span>📋 ${c.sesiones.length} sesión${c.sesiones.length !== 1 ? "es" : ""}</span>
      </div>
    </div>
  `).join("");
}

renderizarCursos();