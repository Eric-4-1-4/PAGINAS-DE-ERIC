import { auth } from "../FireBase/Firebase.js";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";



document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const terminos = document.getElementById("terminos").checked;

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    if (!terminos) {
      alert("Debes aceptar los términos y condiciones.");
      return;
    }

    try {
      // Verificar si el correo ya está en uso
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.length > 0) {
        alert("El correo ya está en uso, por favor utiliza otro.");
        return;
      }

      // Registrar usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: nombre
      });

      alert("Registro exitoso.");
      window.location.href = "Login.html";

    } catch (error) {
      const errorCode = error.code;
      console.error("Código de error:", errorCode);

      if (errorCode === 'auth/email-already-in-use') {
        alert("El correo ya está en uso, por favor utiliza otro.");
      } else {
        alert("Error al registrar: " + error.message);
      }
    }
  });
});
