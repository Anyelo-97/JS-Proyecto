const email = document.getElementById("email");
const password = document.getElementById("password");
const named = document.getElementById("name");
const description = document.getElementById("description");
const btnIngresar = document.getElementById("ingresar");
const btnRegistrar = document.getElementById("registrar");
const rol = document.getElementById("rol");

const submitButton = btnIngresar || btnRegistrar;

if (!submitButton);

submitButton.disabled = true;

email.addEventListener("input", validarCampos);
password.addEventListener("input", validarCampos);
named.addEventListener("input", validarCampos);
description.addEventListener("input", validarCampos);

if (rol) rol.addEventListener("change", validarCampos);

submitButton.addEventListener("click", (e) => {
    e.preventDefault();

    if (btnRegistrar) {
        register();
    }

    if (btnIngresar) {
        login();
    }
});

function validarCampos() {
    let camposValidos = true;

    if (
        email.value.trim() === "" ||
        password.value.trim() === "" ||
        named.value.trim() === "" ||
        description.value.trim() === ""
    ) {
        camposValidos = false;
    }

    if (rol && rol.value === "") {
        camposValidos = false;
    }

    submitButton.disabled = !camposValidos;
}
function register() {
    const user = {
        email: email.value.trim(),
        password: password.value.trim(),
        named: named.value.trim(),
        description: description.value.trim(),
        rol: rol.value
    };

    localStorage.setItem("user", JSON.stringify(user));
    alert("Usuario registrado correctamente ✅");
    window.location.href = "/pages/menu.html";
}


function login() {

    const userGuardado = JSON.parse(localStorage.getItem("user"));

    if (!userGuardado) {
        alert("No hay usuario registrado ❌");
        return;
    }

    if (
        email.value.trim() === userGuardado.email &&
        password.value.trim() === userGuardado.password &&
        named.value.trim() === userGuardado.named &&
        description.value.trim() === userGuardado.description
    ) {

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("rolActivo", userGuardado.rol);
        console.log(userGuardado)

        alert("Login correcto ✅");

        window.location.replace("/pages/home.html");
    } else {
        alert("Datos incorrectos ❌");
    }
}



