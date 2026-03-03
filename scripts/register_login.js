const email = document.getElementById("email");
const password = document.getElementById("password");
const btningresar = document.getElementById("ingresar");
const btnRegistrar = document.getElementById("registrar");

btningresar.disabled = true;
btnRegistrar.disabled = true;

email.addEventListener("input", validarCampos);
password.addEventListener("input", validarCampos);

btnRegistrar.addEventListener("click", register);
btningresar.addEventListener("click", login);

function validarCampos() {
    if (email.value !== "" && password.value !== "") {
        btningresar.disabled = false;
        btnRegistrar.disabled = false;
    } else {
        btningresar.disabled = true;
        btnRegistrar.disabled = true;
    }
}

function register(e) {
    e.preventDefault();

    const user = {
        email: email.value,
        password: password.value
    };

    localStorage.setItem("user", JSON.stringify(user));
    alert("Usuario registrado correctamente");
}

function login(e) {
    e.preventDefault();

    const userGuardado = JSON.parse(localStorage.getItem("user"));

    if (!userGuardado) {
        alert("No hay usuario registrado");
        return;
    }

    if (
        email.value === userGuardado.email &&
        password.value === userGuardado.password
    ) {
        alert("Login correcto ✅");
    } else {
        alert("Los datos ingresados no están registrados ❌");
    }
}