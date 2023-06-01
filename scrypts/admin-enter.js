const url = "https://products-server-production.up.railway.app/";

///Verify admins
let admins = [];

const getAdmins = async (url) => {
  try {
    const endpoint = "admins";
    const resp = await fetch(`${url}${endpoint}`);
    const response = await resp.json();
    admins = response;
  } catch (error) {
    console.log(error);
  }
};

getAdmins(url);

function validarUsuario(event) {
  event.preventDefault();

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const mensajeError = document.getElementById("mensaje-error");

  const username = usernameInput.value;
  const password = passwordInput.value;

  let usuarioActivo = null;
  let mostrarError = true; 

  admins.forEach((usuario) => {
    if (usuario.username === username && usuario.password === password) {
      usuarioActivo = usuario;
      mostrarError = false; 
    }
  });

  if (usuarioActivo) {
    location.href = "../html/admin-info.html";
  } else {
    if (mostrarError) {
      showNotification("Username or password incorrect. Please try again");
      usernameInput.value = ""; 
      passwordInput.value = ""; 
    }
  }
}


// notification mensaje
function showNotification(message) {
  const notification = document.querySelector(".notification");
  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

const botonLogin = document.getElementById("boton-login");
botonLogin.addEventListener("click", validarUsuario);