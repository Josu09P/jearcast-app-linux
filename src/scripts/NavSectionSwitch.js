document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav-section");
  const sections = document.querySelectorAll("section[id]");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Quitar clase activa de todos
      links.forEach((l) => l.classList.remove("active"));

      // Agregar clase activa al actual
      link.classList.add("active");

      // Obtener id desde el href
      const sectionId = link.getAttribute("href").substring(1);

      // Ocultar todas las secciones
      sections.forEach((section) => {
        section.style.display = "none";
      });

      // Mostrar solo la sección deseada
      const sectionToShow = document.getElementById(sectionId);
      if (sectionToShow) sectionToShow.style.display = "block";
    });
  });

  // Activar por defecto la primera sección
  const defaultSection = document.getElementById("home-music");
  if (defaultSection) defaultSection.style.display = "block";
});