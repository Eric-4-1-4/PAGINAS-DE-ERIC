// Importar Firebase Auth
import { auth } from "../FireBase/Firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  // Obtener elementos del DOM
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const usernameElement = document.getElementById("username");
  const useremailElement = document.getElementById("useremail");

  // Abrir/cerrar menú lateral
  menuToggle.addEventListener('click', (event) => {
    event.stopPropagation(); 
    sidebar.classList.toggle('open');
  }); 

  // EL CÓDIGO PARA MOSTRAR/OCULTAR EL SUBMENU HA SIDO ELIMINADO

  // Cerrar menú si se hace click fuera
  document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
      sidebar.classList.remove('open');
      // La línea para ocultar el submenu también se eliminó
    }
  });

  // Detectar usuario autenticado y mostrar nombre y correo
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const nombre = user.displayName || "Nombre no disponible";
      const correo = user.email || "Correo no disponible";
      usernameElement.textContent = nombre;
      useremailElement.textContent = correo;
    }
  });
});
