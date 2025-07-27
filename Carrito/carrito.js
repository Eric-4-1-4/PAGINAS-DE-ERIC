import { auth } from "../FireBase/Firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const usernameElement = document.getElementById("username");
  const useremailElement = document.getElementById("useremail");

  menuToggle.addEventListener('click', (event) => {
    event.stopPropagation(); 
    sidebar.classList.toggle('open');
  });

  document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
      sidebar.classList.remove('open');
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      usernameElement.textContent = user.displayName || "Nombre no disponible";
      useremailElement.textContent = user.email || "Correo no disponible";
    }
  });

  // === Cargar productos del carrito ===
  const cartContainer = document.getElementById("cart-items-container");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  let subtotal = 0;

  cart.forEach((item, i) => {
    const itemTotal = parseFloat(item.price.replace("Q", "").trim()) * item.quantity;
    subtotal += itemTotal;

    const cartItemHTML = `
      <div class="cart-item-example" data-index="${i}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p class="cart-item-description">${item.description}</p>
          <div class="cart-item-quantity-control">
            <button class="quantity-btn decrement">-</button>
            <span class="item-quantity">${item.quantity}</span>
            <button class="quantity-btn increment">+</button>
          </div>
          <p class="cart-item-price">${item.price}</p>
        </div>
        <button class="remove-item-btn">
          <span class="material-icons">delete</span>
        </button>
      </div>
    `;
    cartContainer.insertAdjacentHTML("beforeend", cartItemHTML);
  });

  document.getElementById("cart-subtotal").textContent = `Q ${subtotal.toFixed(2)}`;
  document.getElementById("cart-total").textContent = `Q ${(subtotal + 25).toFixed(2)}`;

  // Botones de cantidad y eliminar
  cartContainer.addEventListener("click", (e) => {
    const index = e.target.closest(".cart-item-example")?.dataset.index;
    if (index === undefined) return;

    if (e.target.classList.contains("increment")) {
      cart[index].quantity++;
    } else if (e.target.classList.contains("decrement")) {
      cart[index].quantity = Math.max(1, cart[index].quantity - 1);
    } else if (e.target.closest(".remove-item-btn")) {
      cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload(); // recargar para ver cambios
  });

  // Acción al hacer clic en "Proceder al Pago"
  document.querySelector(".checkout-btn").addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    window.location.href = "../Pago/pago.html";
  });
});
