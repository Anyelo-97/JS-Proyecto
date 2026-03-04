const email = document.getElementById("email");
const password = document.getElementById("password");
const btnIngresar = document.getElementById("ingresar");
const btnRegistrar = document.getElementById("registrar");
const rol = document.getElementById("rol");

const submitButton = btnIngresar || btnRegistrar;

if (!submitButton);

submitButton.disabled = true;

email.addEventListener("input", validarCampos);
password.addEventListener("input", validarCampos);
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
        email.value.trim() === "" || 
        password.value.trim() === "";

        if (rol) {
            camposValidos = camposValidos && rol.value !== "";
        }
        submitButton.disabled = !camposValidos;
}

function register() {
    const user = {
        email: email.value.trim(),
        password: password.value.trim(),
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
        password.value.trim() === userGuardado.password
    ) {

        // Guardamos sesión activa y rol
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("rolActivo", userGuardado.rol);

        alert("Login correcto ✅");

        window.location.replace("/pages/home.html");
    } else {
        alert("Datos incorrectos ❌");
    }
}

