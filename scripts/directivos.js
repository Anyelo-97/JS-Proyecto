const avatarName = document.getElementById('avatar-name');

const savedData = JSON.parse(localStorage.getItem('user'));

if (savedData) {
  Object.keys(savedData).forEach(key => {
    const input = document.getElementById(key);
    if (input) input.value = savedData[key];
  });
  avatarName.textContent = savedData.named;
}

const rol = savedData?.rol;

const STORAGE_KEY = 'academia_directivos';

// ejemplos de muestra
const SAMPLE_DATA = [
    { id: 1, identificacion: '10234567', nombres: 'Roberto',  apellidos: 'Álvarez Mora',    email: 'ralvarez@academia.edu.co',  telefono: '+57 310 234 5678', cargo: 'Rector' },
    { id: 2, identificacion: '20345678', nombres: 'Sandra',   apellidos: 'Fuentes López',   email: 'sfuentes@academia.edu.co',  telefono: '+57 311 345 6789', cargo: 'Tutor' },
];

// estado
let directivos     = [];
let editingId      = null;
let pendingDeleteId = null;

// inicio
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    directivos = saved ? JSON.parse(saved) : [...SAMPLE_DATA];
    if (!saved) guardar();
    renderTabla();
    actualizarStats();
});

// guardado
function guardar() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(directivos));
}

//las stats (estadisticas in spanish)
function actualizarStats() {
    document.getElementById('stat-total').textContent = directivos.length;

    const cargos = directivos.map(d => d.cargo).filter(Boolean);
    document.getElementById('stat-cargos').textContent = new Set(cargos).size;

    if (cargos.length > 0) {
        const freq = {};
        cargos.forEach(c => freq[c] = (freq[c] || 0) + 1);
        const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
        // esto hace que sea mas corto si es que es largototote
        document.getElementById('stat-top').textContent = top.split(' ').slice(0, 2).join(' ');
    } else {
        document.getElementById('stat-top').textContent = '—';
    }
}

// hacer ver mejor la tablita
function renderTabla() {
    const busqueda    = document.getElementById('search-input').value.toLowerCase().trim();
    const filtroCargo = document.getElementById('filter-cargo').value;

    const filtrados = directivos.filter(d => {
        const coincideBusqueda = !busqueda ||
            [d.identificacion, d.nombres, d.apellidos, d.email, d.telefono, d.cargo]
            .some(v => v?.toLowerCase().includes(busqueda));
        const coincideCargo = !filtroCargo || d.cargo === filtroCargo;
        return coincideBusqueda && coincideCargo;
    });

    const tbody        = document.getElementById('table-body');
    const vacio        = document.getElementById('table-empty');
    const tableWrapper = document.querySelector('.table-wrapper');

    if (filtrados.length === 0) {
        tbody.innerHTML       = '';
        vacio.style.display   = 'block';
        tableWrapper.style.display = 'none';
        return;
    }

    vacio.style.display        = 'none';
    tableWrapper.style.display = 'block';

    tbody.innerHTML = filtrados.map(d => {
        const iniciales  = getIniciales(d.nombres, d.apellidos);
        const classCargo = getClaseCargo(d.cargo);

        return `
        <tr>
            <td>
                <div class="dir-cell">
                    <div class="dir-avatar">${iniciales}</div>
                    <div>
                        <div class="dir-nombre">${esc(d.nombres)} ${esc(d.apellidos)}</div>
                        <div class="dir-sub">${esc(d.email)}</div>
                    </div>
                </div>
            </td>
            <td>
                <code style="background:#f5f0ff;color:#7c3aed;padding:3px 8px;border-radius:6px;font-size:0.8rem;font-weight:700;">
                    ${esc(d.identificacion)}
                </code>
            </td>
            <td style="color:#6b7fa8;font-size:0.85rem;">
                <span style="display:flex;align-items:center;gap:5px;">
                    <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.86 19.86 0 013.08 4.18 2 2 0 015 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L9.09 9.91a16 16 0 006.99 7l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/></svg>
                    ${esc(d.telefono)}
                </span>
            </td>
            <td style="color:#6b7fa8;font-size:0.85rem;">${esc(d.email)}</td>
            <td><span class="cargo-badge ${classCargo}">${esc(d.cargo)}</span></td>
            <td>
                <div class="actions-cell">
                    <button class="btn-icon edit"   onclick="abrirEditar(${d.id})"   title="Editar">
                        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn-icon delete" onclick="abrirConfirmar(${d.id})" title="Eliminar">
                        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

// aqui se usa para lo del guardado y abrir el agregar directivos muchacho
function openModal() {
    editingId = null;
    document.getElementById('directivo-form').reset();
    document.getElementById('edit-id').value           = '';
    document.getElementById('modal-heading').textContent    = 'Nuevo Directivo';
    document.getElementById('modal-subheading').textContent = 'Completa los datos para registrar un directivo';
    document.getElementById('modal-icon').textContent       = '+';
    document.getElementById('submit-label').textContent     = 'Guardar directivo';
    resetPreview();
    document.getElementById('modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('f-identificacion').focus(), 100);
}

// ── esta vaina para editar a los directivos presentes, porsi cambiaron de trabajo o les subieron de posicion y sueldo
function abrirEditar(id) {
    const d = directivos.find(x => x.id === id);
    if (!d) return;
    editingId = id;

    document.getElementById('edit-id').value          = id;
    document.getElementById('f-identificacion').value = d.identificacion;
    document.getElementById('f-nombres').value        = d.nombres;
    document.getElementById('f-apellidos').value      = d.apellidos;
    document.getElementById('f-email').value          = d.email;
    document.getElementById('f-telefono').value       = d.telefono;
    document.getElementById('f-cargo').value          = d.cargo;

    document.getElementById('modal-heading').textContent    = 'Editar Directivo';
    document.getElementById('modal-subheading').textContent = `Editando: ${d.nombres} ${d.apellidos}`;
    document.getElementById('modal-icon').textContent       = '✏️';
    document.getElementById('submit-label').textContent     = 'Guardar cambios';

    updatePreview();
    document.getElementById('modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

//cerrar tabla
function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
}

function handleOverlayClick(e) {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
}

// vista de lo hecho
function updatePreview() {
    const nombres   = document.getElementById('f-nombres').value.trim();
    const apellidos = document.getElementById('f-apellidos').value.trim();
    const cargo     = document.getElementById('f-cargo').value;

    document.getElementById('avatar-initials').textContent =
        nombres || apellidos ? getIniciales(nombres, apellidos) : '?';

    document.getElementById('preview-nombre').textContent =
        nombres || apellidos ? `${nombres} ${apellidos}`.trim() : 'Nombre completo';

    document.getElementById('preview-cargo').textContent =
        cargo || 'Cargo no definido';
}

function resetPreview() {
    document.getElementById('avatar-initials').textContent  = '?';
    document.getElementById('preview-nombre').textContent   = 'Nombre completo';
    document.getElementById('preview-cargo').textContent    = 'Cargo no definido';
}

// eta vaina es para que se guarde el archivo y se actualice quedando al dia
function handleSubmit(e) {
    e.preventDefault();
    const fd   = new FormData(document.getElementById('directivo-form'));
    const data = Object.fromEntries(fd.entries());

    // Validar si hay identificación duplicada o mas
    const dup = directivos.find(d => d.identificacion === data.identificacion && d.id !== editingId);
    if (dup) {
        mostrarToast('La identificación ya está registrada.', 'error');
        return;
    }

    if (editingId) {
        const idx = directivos.findIndex(d => d.id === editingId);
        directivos[idx] = { ...directivos[idx], ...data };
        mostrarToast('Directivo actualizado correctamente', 'success');
    } else {
        const nuevoId = directivos.length > 0 ? Math.max(...directivos.map(d => d.id)) + 1 : 1;
        directivos.push({ id: nuevoId, ...data });
        mostrarToast('Directivo registrado correctamente', 'success');
    }

    guardar();
    renderTabla();
    actualizarStats();
    closeModal();
}

// esto es para que asegures de que quieres despe- elminar un directivo
function abrirConfirmar(id) {
    pendingDeleteId = id;
    const d = directivos.find(x => x.id === id);
    document.getElementById('confirm-text').textContent =
        `Se eliminará a "${d.nombres} ${d.apellidos}". Esta acción no se puede deshacer.`;
    document.getElementById('confirm-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('confirm-delete-btn').onclick = confirmarEliminar;
}

function closeConfirm() {
    document.getElementById('confirm-overlay').classList.remove('open');
    document.body.style.overflow = '';
    pendingDeleteId = null;
}

function handleConfirmOverlay(e) {
    if (e.target === document.getElementById('confirm-overlay')) closeConfirm();
}

function confirmarEliminar() {
    if (!pendingDeleteId) return;
    const d = directivos.find(x => x.id === pendingDeleteId);
    directivos = directivos.filter(x => x.id !== pendingDeleteId);
    guardar();
    renderTabla();
    actualizarStats();
    closeConfirm();
    if (d) mostrarToast(`🗑️ ${d.nombres} ${d.apellidos} eliminado`, 'success');
}

// el toast
function mostrarToast(msg, tipo = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = `toast ${tipo} show`;
    setTimeout(() => toast.classList.remove('show'), 3200);
}

// ayuditas para el registro y eso
function getIniciales(nombres, apellidos) {
    const n = (nombres  || '').trim()[0] || '';
    const a = (apellidos || '').trim()[0] || '';
    return (n + a).toUpperCase() || '?';
}

function getClaseCargo(cargo) {
    if (!cargo) return 'cargo-default';
    const clave = cargo.replace(/\s+/g, '-');
    const conocidos = [
        'Rector', 'Fundador', 'Lider de area','Psicólogo', 'Tutor'
    ];
    return conocidos.includes(clave) ? `cargo-${clave}` : 'cargo-default';
}

function esc(str) {
    return String(str || '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


function toggleDropdown(name) {
    const dropdown = document.getElementById('dropdown-' + name);
    const btn      = document.getElementById('btn-' + name);
    if (!dropdown) return;
    const isOpen = dropdown.classList.contains('open');
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.nav-link, .avatar-btn').forEach(b => b.classList.remove('open'));
    if (!isOpen) {
        dropdown.classList.add('open');
        if (btn) btn.classList.add('open');
    }
}

document.addEventListener('click', e => {
    if (!e.target.closest('.dropdown-wrapper')) {
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
        document.querySelectorAll('.nav-link, .avatar-btn').forEach(b => b.classList.remove('open'));
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeConfirm(); }
});
