const email = document.getElementById("email");
const password = document.getElementById("password");
const btnIngresar = document.getElementById("ingresar");
const btnRegistrar = document.getElementById("registrar");

const submitButton = btnIngresar || btnRegistrar;

if (!submitButton);

submitButton.disabled = true;

email.addEventListener("input", validarCampos);
password.addEventListener("input", validarCampos);

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
    submitButton.disabled = 
        email.value.trim() === "" || 
        password.value.trim() === "";
}

function register() {
    const user = {
        email: email.value.trim(),
        password: password.value.trim()
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
        password.value.trim() === userGuardado.password
    ) {
        alert("Login correcto ✅");
        window.location.href = "/pages/menu.html";
    } else {
        alert("Los datos ingresados no están registrados ❌");
    }
}

