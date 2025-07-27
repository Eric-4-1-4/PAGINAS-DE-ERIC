import { auth } from '../FireBase/Firebase.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

console.log("Auth cargado:", auth);

document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // ✅ Intentar login directamente
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "../Home/Home.html";

    } catch (error) {
        const errorCode = error.code;
        console.error("Código de error:", errorCode);

        if (errorCode === 'auth/user-not-found') {
            alert('Favor de registrarse.');
        } else if (errorCode === 'auth/wrong-password') {
            alert('La contraseña es incorrecta.');
        } else if (errorCode === 'auth/invalid-credential') {
            alert('Correo o contraseña incorrectos.');
        } else {
            alert('Error: ' + error.message);
        }
    }
});
