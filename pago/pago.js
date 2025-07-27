document.addEventListener("DOMContentLoaded", () => {
  const resumenContainer = document.getElementById("resumen-compra");
  const totalPagoElement = document.getElementById("total-pago");
  const mensajeFinal = document.getElementById("mensaje-final");
  const mensajeContenido = mensajeFinal.querySelector(".mensaje-contenido");
  const cerrarBtn = document.getElementById("cerrar-mensaje");
  const overlay = document.getElementById("overlay-bloqueo");
  const formulario = document.getElementById("payment-form");

  const carrito = JSON.parse(localStorage.getItem("cart")) || [];
  let subtotal = 0;

  /* -------- Generar resumen -------- */
  if (carrito.length === 0) {
    resumenContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
    totalPagoElement.textContent = "Q 0.00";
  } else {
    carrito.forEach(prod => {
      const pUnit = parseFloat(prod.price.replace("Q", "").trim());
      const totalProd = pUnit * prod.quantity;
      subtotal += totalProd;

      resumenContainer.insertAdjacentHTML(
        "beforeend",
        `<div style="margin-bottom:10px;text-align:left;">
           <strong>${prod.name}</strong><br>
           Cantidad: ${prod.quantity}<br>
           Precio unitario: Q${pUnit.toFixed(2)}<br>
           Total: Q${totalProd.toFixed(2)}
         </div>`
      );
    });

    const envio = 25;
    totalPagoElement.textContent = `Q ${(subtotal + envio).toFixed(2)}`;
  }

  /* -------- Cerrar mensaje / ir a Home -------- */
  cerrarBtn.addEventListener("click", () => {
    overlay.style.display = "none";
    document.body.style.overflow = "";          // reactivar scroll
    window.location.href = "../Home/Home.html";
  });

  /* -------- Enviar formulario -------- */
  formulario.addEventListener("submit", e => {
    e.preventDefault();

    const nombre     = document.getElementById("nombre").value.trim();
    const correo     = document.getElementById("correo").value.trim();
    const telefono   = document.getElementById("telefono").value.trim();
    const direccion  = document.getElementById("direccion").value.trim();
    const metodo     = formulario.metodo.value;

    if (!nombre || !correo || !telefono || !direccion || !metodo) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    /* Vaciar carrito */
    localStorage.removeItem("cart");

    /* Mostrar mensaje y bloquear fondo */
    mensajeContenido.innerHTML = `
      <strong>¡Gracias por tu compra, ${nombre}!</strong><br><br>
      Tu pedido será enviado a:<br><strong>${direccion}</strong><br><br>
      Te contactaremos al: <strong>${telefono}</strong>.<br>
      Método de pago: <strong>${metodo === "tarjeta" ? "Tarjeta" : "Efectivo"}</strong>
    `;
    overlay.style.display  = "block";
    mensajeFinal.style.display = "block";
    document.body.style.overflow = "hidden";   // desactiva scroll

    /* Deshabilitar formulario */
    formulario.style.opacity = "0.4";
    formulario.querySelector("button[type='submit']").disabled = true;
  });
});
