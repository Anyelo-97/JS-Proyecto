const STORAGE_KEY = 'academia_docentes';

const SAMPLE_DATA = [
    { id: 1, codigo: 'DOC-001', identificacion: '12345678', nombres: 'María', apellidos: 'González Ruiz', email: 'mgonzalez@academia.edu.co', area: 'Biología', foto: '' },
    { id: 2, codigo: 'DOC-002', identificacion: '87654321', nombres: 'Carlos', apellidos: 'Martínez López', email: 'cmartinez@academia.edu.co', area: 'Informática', foto: '' },
    { id: 3, codigo: 'DOC-003', identificacion: '11223344', nombres: 'Ana', apellidos: 'Torres Vargas', email: 'atorres@academia.edu.co', area: 'Matemáticas', foto: '' },
    { id: 4, codigo: 'DOC-004', identificacion: '55667788', nombres: 'Pedro', apellidos: 'Ramírez Silva', email: 'pramirez@academia.edu.co', area: 'Física', foto: '' },
    { id: 5, codigo: 'DOC-005', identificacion: '99001122', nombres: 'Laura', apellidos: 'Jiménez Castro', email: 'ljimenez@academia.edu.co', area: 'Literatura', foto: '' },
];

// estado
let docentes = [];
let editingId = null;
let pendingDeleteId = null;

document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    docentes = saved ? JSON.parse(saved) : [...SAMPLE_DATA];
    if (!saved) save();
    renderTable();
    updateStats();
});

// almacenamiento
function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docentes));
}

//datos
function updateStats() {
    document.getElementById('stat-total').textContent = docentes.length;
    const areas = new Set(docentes.map(d => d.area).filter(Boolean));
    document.getElementById('stat-areas').textContent = areas.size;
    document.getElementById('stat-new').textContent = Math.min(docentes.length, 2);
}

// ── RENDER TABLE ──
function renderTable() {
    const search = document.getElementById('search-input').value.toLowerCase().trim();
    const areaFilter = document.getElementById('filter-area').value;

    let filtered = docentes.filter(d => {
        const matchSearch = !search || [d.codigo, d.identificacion, d.nombres, d.apellidos, d.email].some(v => v?.toLowerCase().includes(search));
        const matchArea = !areaFilter || d.area === areaFilter;
        return matchSearch && matchArea;
    });

    const tbody = document.getElementById('table-body');
    const empty = document.getElementById('table-empty');
    const tableWrapper = document.querySelector('.table-wrapper');

    if (filtered.length === 0) {
        tbody.innerHTML = '';
        empty.style.display = 'block';
        tableWrapper.style.display = 'none';
        return;
    }

    empty.style.display = 'none';
    tableWrapper.style.display = 'block';

    tbody.innerHTML = filtered.map(d => {
        const initials = getInitials(d.nombres, d.apellidos);
        const areaClass = getAreaClass(d.area);
        const avatarHtml = d.foto
            ? `<div class="doc-avatar"><img src="${escapeHtml(d.foto)}" alt="${escapeHtml(d.nombres)}" onerror="this.style.display='none';this.parentElement.textContent='${initials}'"></div>`
            : `<div class="doc-avatar">${initials}</div>`;

        return `
        <tr>
            <td>
                <div class="doc-cell">
                    ${avatarHtml}
                    <div>
                        <div class="doc-name">${escapeHtml(d.nombres)} ${escapeHtml(d.apellidos)}</div>
                        <div class="doc-fullname">${escapeHtml(d.email)}</div>
                    </div>
                </div>
            </td>
            <td><code style="background:var(--primary-lighter);color:var(--primary);padding:3px 8px;border-radius:6px;font-size:0.8rem;font-weight:700;">${escapeHtml(d.codigo)}</code></td>
            <td style="color:var(--text-muted);font-size:0.85rem;">${escapeHtml(d.identificacion)}</td>
            <td style="color:var(--text-muted);font-size:0.85rem;">${escapeHtml(d.email)}</td>
            <td><span class="area-badge ${areaClass}">${escapeHtml(d.area)}</span></td>
            <td>
                <div class="actions-cell">
                    <button class="btn-icon edit" onclick="openEdit(${d.id})" title="Editar">
                        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn-icon delete" onclick="openConfirm(${d.id})" title="Eliminar">
                        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

// ── MODAL OPEN/CLOSE ──
function openModal() {
    editingId = null;
    document.getElementById('docente-form').reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('modal-heading').textContent = 'Nuevo Docente';
    document.getElementById('modal-subheading').textContent = 'Completa los datos para registrar un docente';
    document.getElementById('modal-icon').textContent = '➕';
    document.getElementById('submit-label').textContent = 'Guardar docente';
    resetAvatarPreview();
    document.getElementById('modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('f-codigo').focus(), 100);
}

function openEdit(id) {
    const d = docentes.find(x => x.id === id);
    if (!d) return;
    editingId = id;

    document.getElementById('edit-id').value = id;
    document.getElementById('f-codigo').value = d.codigo;
    document.getElementById('f-identificacion').value = d.identificacion;
    document.getElementById('f-nombres').value = d.nombres;
    document.getElementById('f-apellidos').value = d.apellidos;
    document.getElementById('f-email').value = d.email;
    document.getElementById('f-area').value = d.area;
    document.getElementById('f-foto').value = d.foto || '';

    document.getElementById('modal-heading').textContent = 'Editar Docente';
    document.getElementById('modal-subheading').textContent = `Editando: ${d.nombres} ${d.apellidos}`;
    document.getElementById('modal-icon').textContent = '✏️';
    document.getElementById('submit-label').textContent = 'Guardar cambios';

    updateAvatarPreview();
    document.getElementById('modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
}

function handleOverlayClick(e) {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
}

// ── AVATAR PREVIEW ──
function updateAvatarPreview() {
    const nombres = document.getElementById('f-nombres').value.trim();
    const apellidos = document.getElementById('f-apellidos').value.trim();
    const fotoUrl = document.getElementById('f-foto').value.trim();

    const initialsEl = document.getElementById('avatar-initials');
    const imgEl = document.getElementById('avatar-img');

    initialsEl.textContent = nombres || apellidos ? getInitials(nombres, apellidos) : '?';

    if (fotoUrl) {
        imgEl.src = fotoUrl;
        imgEl.style.display = 'block';
        imgEl.onerror = () => { imgEl.style.display = 'none'; };
        imgEl.onload = () => { imgEl.style.display = 'block'; };
    } else {
        imgEl.style.display = 'none';
        imgEl.src = '';
    }
}

function resetAvatarPreview() {
    document.getElementById('avatar-initials').textContent = '?';
    document.getElementById('avatar-img').style.display = 'none';
    document.getElementById('avatar-img').src = '';
}

// ── SUBMIT ──
function handleSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('docente-form');
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());

    // Check duplicate codigo (excluding current)
    const dupCodigo = docentes.find(d => d.codigo.toLowerCase() === data.codigo.toLowerCase() && d.id !== editingId);
    if (dupCodigo) { showToast('El código ya existe. Usa uno diferente.', 'error'); return; }

    const dupId = docentes.find(d => d.identificacion === data.identificacion && d.id !== editingId);
    if (dupId) { showToast('La identificación ya está registrada.', 'error'); return; }

    if (editingId) {
        const idx = docentes.findIndex(d => d.id === editingId);
        docentes[idx] = { ...docentes[idx], ...data };
        showToast('✓ Docente actualizado correctamente', 'success');
    } else {
        const newId = docentes.length > 0 ? Math.max(...docentes.map(d => d.id)) + 1 : 1;
        docentes.push({ id: newId, ...data });
        showToast('✓ Docente registrado correctamente', 'success');
    }

    save();
    renderTable();
    updateStats();
    closeModal();
}

// ── DELETE ──
function openConfirm(id) {
    pendingDeleteId = id;
    const d = docentes.find(x => x.id === id);
    document.getElementById('confirm-text').textContent = `Se eliminará a "${d.nombres} ${d.apellidos}". Esta acción no se puede deshacer.`;
    document.getElementById('confirm-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';

    document.getElementById('confirm-delete-btn').onclick = () => confirmDelete();
}

function closeConfirm() {
    document.getElementById('confirm-overlay').classList.remove('open');
    document.body.style.overflow = '';
    pendingDeleteId = null;
}

function handleConfirmOverlay(e) {
    if (e.target === document.getElementById('confirm-overlay')) closeConfirm();
}

function confirmDelete() {
    if (!pendingDeleteId) return;
    const name = docentes.find(d => d.id === pendingDeleteId);
    docentes = docentes.filter(d => d.id !== pendingDeleteId);
    save();
    renderTable();
    updateStats();
    closeConfirm();
    if (name) showToast(`🗑️ ${name.nombres} ${name.apellidos} eliminado`, 'success');
}

// ── TOAST ──
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3200);
}

// ── HELPERS ──
function getInitials(nombres, apellidos) {
    const n = (nombres || '').trim()[0] || '';
    const a = (apellidos || '').trim()[0] || '';
    return (n + a).toUpperCase() || '?';
}

function getAreaClass(area) {
    if (!area) return 'area-default';
    const key = area.replace(/\s+/g, '-');
    const known = ['Coding','Matemáticas','Ser','DiseñoGrafico','Inglés'];
    return known.includes(key) ? `area-${key}` : 'area-default';
}

function escapeHtml(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── NAV DROPDOWN ──
function toggleDropdown(name) {
    const dropdown = document.getElementById('dropdown-' + name);
    const btn = document.getElementById('btn-' + name);
    if (!dropdown) return;
    const isOpen = dropdown.classList.contains('open');
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.nav-link, .avatar-btn').forEach(b => b.classList.remove('open'));
    if (!isOpen) {
        dropdown.classList.add('open');
        if (btn) btn.classList.add('open');
    }
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-wrapper')) {
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
        document.querySelectorAll('.nav-link, .avatar-btn').forEach(b => b.classList.remove('open'));
    }
});

// Close modals with ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeConfirm();
    }
});
