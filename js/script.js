let cuenta = 0;
let usuarioActual = JSON.parse(localStorage.getItem('usuarioActual')) || null;

function mostrarMensaje(mensaje) {
    alert(mensaje);
}

function registrarUsuario(nombreUsuario, contraseña) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (usuarios.find(usuario => usuario.nombreUsuario === nombreUsuario)) {
        mostrarMensaje('El nombre de usuario ya existe');
    } else {
        usuarios.push({ nombreUsuario, contraseña });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        mostrarMensaje('Registro exitoso');
        window.location.href = '/templates/login.html';
    }
}

function iniciarSesion(nombreUsuario, contraseña) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(usuario => usuario.nombreUsuario === nombreUsuario && usuario.contraseña === contraseña);
    if (usuario) {
        usuarioActual = usuario;
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        mostrarMensaje('Inicio de sesión exitoso');
        window.location.href = '/templates/cuenta.html';
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
    document.getElementById('registerButton')?.addEventListener('click', () => {
        const nombreUsuario = document.getElementById('registerUsername').value;
        const contraseña = document.getElementById('registerPassword').value;
        if (nombreUsuario && contraseña) {
            registrarUsuario(nombreUsuario, contraseña);
        } else {
            mostrarMensaje('Por favor, complete todos los campos');
        }
    });

    document.getElementById('loginButton')?.addEventListener('click', () => {
        const nombreUsuario = document.getElementById('loginUsername').value;
        const contraseña = document.getElementById('loginPassword').value;
        if (nombreUsuario && contraseña) {
            iniciarSesion(nombreUsuario, contraseña);
        } else {
            mostrarMensaje('Por favor, complete todos los campos');
        }
    });

    document.getElementById('checkBalance')?.addEventListener('click', verificarSaldo);

    document.getElementById('transferFunds')?.addEventListener('click', () => {
        let montoTransferir = parseFloat(prompt('Ingrese el monto a transferir'));
        if (isNaN(montoTransferir) || montoTransferir <= 0) {
            mostrarMensaje('Monto inválido');
        } else {
            transferirFondos(montoTransferir);
        }
    });

    document.getElementById('depositFunds')?.addEventListener('click', () => {
        let montoDepositar = parseFloat(prompt('Ingrese el monto a depositar'));
        if (isNaN(montoDepositar) || montoDepositar <= 0) {
            mostrarMensaje('Monto inválido');
        } else {
            depositarFondos(montoDepositar);
        }
    });
});
