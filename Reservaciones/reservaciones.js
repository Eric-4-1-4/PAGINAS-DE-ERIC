import { auth, db } from "../FireBase/Firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const usernameElement = document.getElementById("username");
  const useremailElement = document.getElementById("useremail");
  const reservationDateInput = document.getElementById("reservation-date");

  const modal = document.getElementById("reservation-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const form = document.getElementById("reservation-form");
  const modalUsername = document.getElementById("modal-username");
  const modalEmail = document.getElementById("modal-email");

  const cancelModal = document.getElementById("cancel-modal");
  const cancelForm = document.getElementById("cancel-form");
  const cancelUsername = document.getElementById("cancel-username");
  const cancelEmail = document.getElementById("cancel-email");
  const closeCancelBtn = document.getElementById("close-cancel-modal");

  let currentUser = null;
  let selectedTable = null;

  /*FECHA MÍNIMA Y VALOR POR DEFECTO*/
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  if (reservationDateInput) {
    reservationDateInput.value = formattedDate;
    reservationDateInput.min = formattedDate;
  }

  /*SIDEBAR*/
  menuToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    sidebar.classList.toggle("open");
  });

  document.addEventListener("click", (event) => {
    if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
      sidebar.classList.remove("open");
    }
  });

  /*FUNCIÓN: MARCAR MESAS RESERVADAS SOLO PARA LA FECHA SELECCIONADA*/
  async function marcarMesasReservadas(fechaSeleccionada) {
    /* 1. Limpiar todas las clases previas */
    document.querySelectorAll(".table").forEach((mesa) => {
      mesa.classList.remove("reserved", "selected");
      mesa.classList.add("available");
    });

    /* 2. Consultar reservaciones de ESA fecha */
    const reservasRef = collection(db, "reservaciones");
    const q = query(reservasRef, where("fecha", "==", fechaSeleccionada));
    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const mesaId = data.mesa.split(" ")[1]; // "Mesa 3" → "3"
      const mesaElement = document.querySelector(`.table[data-id="${mesaId}"]`);
      if (mesaElement) {
        mesaElement.classList.remove("available");
        if (data.correo === currentUser?.email) {
          mesaElement.classList.add("selected");   // Azul (reservada por el usuario)
        } else {
          mesaElement.classList.add("reserved");   // Rojo (reservada por otro)
        }
      }
    });
  }


  /*DETECTAR CAMBIO DE FECHA*/
  reservationDateInput.addEventListener("change", async () => {
    if (currentUser) {
      await marcarMesasReservadas(reservationDateInput.value);
    }
  });

  /*AUTENTICACIÓN*/
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;

      const nombre = user.displayName || "Nombre no disponible";
      const correo = user.email || "Correo no disponible";

      usernameElement.textContent = nombre;
      useremailElement.textContent = correo;
      modalUsername.value = nombre;
      modalEmail.value = correo;

      /*Mostrar las reservaciones DE LA FECHA ACTUAL SELECCIONADA*/
      await marcarMesasReservadas(reservationDateInput.value);
    }
  });

  /*MANEJO DE CLIC EN MESAS*/
  document.querySelectorAll(".table").forEach((table) => {
    table.addEventListener("click", async () => {
      if (!currentUser) return alert("Debes iniciar sesión para reservar.");

      if (table.classList.contains("reserved")) {
        alert("Esta mesa ya está reservada por otro usuario.");
        return;
      }

      const mesaId = table.dataset.id;
      selectedTable = `Mesa ${mesaId}`;

      if (table.classList.contains("selected")) {
        const confirmar = confirm("¿Deseas cancelar esta reservación?");
        if (!confirmar) return;

        cancelUsername.value =
          currentUser.displayName || "Nombre no disponible";
        cancelEmail.value = currentUser.email || "Correo no disponible";
        cancelModal.classList.remove("hidden");
      } else {
        modalUsername.value =
          currentUser.displayName || "Nombre no disponible";
        modalEmail.value = currentUser.email || "Correo no disponible";
        modal.classList.remove("hidden");
      }
    });
  });

  /*RESERVAR MESA*/
  closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    form.reset();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const phone = document.getElementById("phone").value;
    const people = document.getElementById("people").value;
    const comment = document.getElementById("comment").value;
    const date = reservationDateInput.value;

    const reserva = {
      usuario: currentUser.displayName,
      correo: currentUser.email,
      telefono: phone,
      personas: parseInt(people),
      comentario: comment,
      mesa: selectedTable,
      fecha: date,
      timestamp: new Date()
    };

    try {
      await addDoc(collection(db, "reservaciones"), reserva);

      const mesaElement = document.querySelector(
        `.table[data-id="${selectedTable.split(" ")[1]}"]`
      );
      if (mesaElement) {
        mesaElement.classList.remove("available");
        mesaElement.classList.add("selected");
      }
    } catch (error) {
      console.error("Error al guardar la reservación:", error);
      alert("Ocurrió un error al registrar la reservación.");
    }

    form.reset();
    modal.classList.add("hidden");
  });

  /*CANCELAR RESERVACIÓN*/
  closeCancelBtn.addEventListener("click", () => {
    cancelModal.classList.add("hidden");
    cancelForm.reset();
  });

  cancelForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const razon = document.getElementById("cancel-reason").value;
    const cancelacion = {
      usuario: currentUser.displayName,
      correo: currentUser.email,
      razon,
      mesa: selectedTable,
      fecha_cancelacion: new Date()
    };

    try {
      await addDoc(collection(db, "cancel_reservation"), cancelacion);

      const reservasRef = collection(db, "reservaciones");
      const q = query(
        reservasRef,
        where("mesa", "==", selectedTable),
        where("correo", "==", currentUser.email)
      );
      const querySnapshot = await getDocs(q);

      for (const docSnap of querySnapshot.docs) {
        await deleteDoc(docSnap.ref);
      }

      const mesaElement = document.querySelector(
        `.table[data-id="${selectedTable.split(" ")[1]}"]`
      );
      if (mesaElement) {
        mesaElement.classList.remove("selected");
        mesaElement.classList.add("available");
      }
    } catch (error) {
      console.error("Error al cancelar la reservación:", error);
      alert("Ocurrió un error al registrar la cancelación.");
    }

    cancelForm.reset();
    cancelModal.classList.add("hidden");
  });
});
