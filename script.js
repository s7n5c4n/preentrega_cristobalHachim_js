let cuenta = 0;
let usuarios = [];
let usuarioActual = null;

function mostrarMensaje(mensaje) {
    alert(mensaje);
}

function registrarUsuario(nombreUsuario, contraseña) {
    let usuarios = JSON.parse(sessionStorage.getItem('usuarios')) || []; // Recuperar usuarios almacenados
    if (usuarios.find(usuario => usuario.nombreUsuario === nombreUsuario)) {
        mostrarMensaje('El nombre de usuario ya existe');
    } else {
        usuarios.push({ nombreUsuario, contraseña });
        sessionStorage.setItem('usuarios', JSON.stringify(usuarios)); // Almacenar usuarios actualizados
        mostrarMensaje('Registro exitoso');
        window.location.href = '/login.html';
    }
}

function iniciarSesion(nombreUsuario, contraseña) {
    let usuarios = JSON.parse(sessionStorage.getItem('usuarios')) || []; // Recuperar usuarios almacenados
    const usuario = usuarios.find(usuario => usuario.nombreUsuario === nombreUsuario && usuario.contraseña === contraseña);
    if (usuario) {
        usuarioActual = usuario;
        sessionStorage.setItem('usuarioActual', JSON.stringify(usuario)); // Almacenar el usuario actual
        mostrarMensaje('Inicio de sesión exitoso');
        window.location.href = '/cuenta.html';
    } else {
        mostrarMensaje('Nombre de usuario o contraseña inválidos');
    }
}

function verificarSaldo() {
    mostrarMensaje(`Tu saldo es: ${cuenta}`);
}

function transferirFondos(monto) {
    if (monto > cuenta) {
        mostrarMensaje('Fondos insuficientes');
    } else {
        cuenta -= monto;
        mostrarMensaje(`Tu nuevo saldo es: ${cuenta}`);
    }
}

function depositarFondos(monto) {
    cuenta += monto;
    mostrarMensaje(`Tu nuevo saldo es: ${cuenta}`);
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('registerButton')) {
        document.getElementById('registerButton').addEventListener('click', () => {
            const nombreUsuario = document.getElementById('registerUsername').value;
            const contraseña = document.getElementById('registerPassword').value;
            if (nombreUsuario && contraseña) {
                registrarUsuario(nombreUsuario, contraseña);
            } else {
                mostrarMensaje('Por favor, complete todos los campos');
            }
        });
    }

    if (document.getElementById('loginButton')) {
        document.getElementById('loginButton').addEventListener('click', () => {
            const nombreUsuario = document.getElementById('loginUsername').value;
            const contraseña = document.getElementById('loginPassword').value;
            if (nombreUsuario && contraseña) {
                iniciarSesion(nombreUsuario, contraseña);
            } else {
                mostrarMensaje('Por favor, complete todos los campos');
            }
        });
    }

    if (document.getElementById('checkBalance')) {
        document.getElementById('checkBalance').addEventListener('click', verificarSaldo);
    }

    if (document.getElementById('transferFunds')) {
        document.getElementById('transferFunds').addEventListener('click', () => {
            let montoTransferir = parseFloat(prompt('Ingrese el monto a transferir'));
            if (isNaN(montoTransferir) || montoTransferir <= 0) {
                mostrarMensaje('Monto inválido');
            } else {
                transferirFondos(montoTransferir);
            }
        });
    }

    if (document.getElementById('depositFunds')) {
        document.getElementById('depositFunds').addEventListener('click', () => {
            let montoDepositar = parseFloat(prompt('Ingrese el monto a depositar'));
            if (isNaN(montoDepositar) || montoDepositar <= 0) {
                mostrarMensaje('Monto inválido');
            } else {
                depositarFondos(montoDepositar);
            }
        });
    }
});

