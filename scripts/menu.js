let currentOpen = null;
const avatarName = document.getElementById('avatar-name');
const savedData = JSON.parse(localStorage.getItem('user'));
const iniciales = document.getElementById("avatar")

if (savedData) {
  Object.keys(savedData).forEach(key => {
      const input = document.getElementById(key);
      if (input) {
          input.value = savedData[key];
      }
  });
  avatarName.textContent = savedData.named;
}

iniciales.textContent = avatarName.textContent.substring(0, 2).toUpperCase();


function toggleDropdown(name) {
  const dropdown = document.getElementById('dropdown-' + name);
  const btn = document.getElementById('btn-' + name);
  const backdrop = document.getElementById('backdrop');

  if (!dropdown || !btn) return;

  // Cierra otro dropdown abierto
  if (currentOpen && currentOpen !== name) {
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
