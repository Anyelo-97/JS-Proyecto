let currentOpen = null;
const avatarName = document.getElementById('avatar-name');
const savedData = JSON.parse(localStorage.getItem('user'));

if (savedData) {
  Object.keys(savedData).forEach(key => {
      const input = document.getElementById(key);
      if (input) {
          input.value = savedData[key];
      }
  });
  avatarName.textContent = savedData.named;
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