export function applyColorTheme(color) {
  document.body.style.setProperty('--main-bg-color', color);
  localStorage.setItem('user-theme-color', color);
}

export function loadColorTheme() {
  const savedColor = localStorage.getItem('user-theme-color');
  if (savedColor) {
    applyColorTheme(savedColor);
  }
}

export function initThemeSelector() {
  const buttons = document.querySelectorAll('.theme-color');
  const check = document.getElementById('theme-selected-check');
  const picker = document.getElementById('customColorPicker');

  function showCheck() {
    check.classList.remove('d-none');
    setTimeout(() => check.classList.add('d-none'), 1500);
  }

  function selectButton(button) {
    buttons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      applyColorTheme(color);
      selectButton(btn);
      showCheck();
    });
  });

  if (picker) {
    picker.addEventListener('input', (e) => {
      const color = e.target.value;
      applyColorTheme(color);
      selectButton(picker.parentElement); // marca como seleccionado el picker
      showCheck();
    });
  }

  // Marcar el color activo al iniciar
  const currentColor = localStorage.getItem('user-theme-color');
  if (currentColor) {
    buttons.forEach(btn => {
      if (btn.dataset.color === currentColor) {
        selectButton(btn);
      }
    });
  }
}
