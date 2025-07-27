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

// Función para agregar productos al carrito
document.addEventListener("DOMContentLoaded", () => {
  const botonesAgregar = document.querySelectorAll(".add-to-cart-btn");

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const productoElemento = boton.closest(".product-item");
      const nombre = productoElemento.querySelector("h3").textContent;
      const descripcion = productoElemento.querySelector(".product-description").textContent;
      const precio = productoElemento.querySelector(".product-price").textContent;

      const producto = { nombre, descripcion, precio };

      // Obtener carrito actual desde localStorage
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

      // Agregar nuevo producto al carrito
      carrito.push(producto);

      // Guardar el nuevo carrito en localStorage
      localStorage.setItem("carrito", JSON.stringify(carrito));

      // Redirigir al carrito
      window.location.href = "/Carrito/carrito.html";
    });
  });
});

document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const productItem = button.closest(".product-item");
    const name = productItem.querySelector("h3").textContent;
    const description = productItem.querySelector(".product-description").textContent;
    const price = productItem.querySelector(".product-price").textContent;
    const image = productItem.querySelector(".product-image").getAttribute("src");

    const product = {
      name,
      description,
      price,
      image,
      quantity: 1,
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = cart.findIndex(item => item.name === product.name);
    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Redirigir al carrito
    window.location.href = "/Carrito/carrito.html";
  });
});
