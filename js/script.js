let usuarioActual = JSON.parse(localStorage.getItem('usuarioActual')) || null;

function mostrarMensaje(mensaje, tipo = 'info') {
    const messageBox = document.getElementById('messageBox');
    if (messageBox) {
        messageBox.innerHTML = `<div class="${tipo}">${mensaje}</div>`;
        setTimeout(() => messageBox.innerHTML = '', 3000);
    } else {
        console.error('messageBox element not found');
    }
}

function actualizarSaldo() {
    if (usuarioActual) {
        document.getElementById('currentBalance').textContent = usuarioActual.balance.toFixed(2);
    }
}

function actualizarUltimaTransaccion() {
    if (usuarioActual && usuarioActual.transacciones.length > 0) {
        const ultimaTransaccion = usuarioActual.transacciones[usuarioActual.transacciones.length - 1];
        document.getElementById('lastTransaction').textContent = `${ultimaTransaccion.tipo}: $${ultimaTransaccion.monto.toFixed(2)}`;
    } else {
        document.getElementById('lastTransaction').textContent = 'N/A';
    }
}

function actualizarHistorialTransacciones() {
    const transactionTable = document.getElementById('transactionTable');
    transactionTable.innerHTML = '';
    if (usuarioActual) {
        usuarioActual.transacciones.forEach(transaccion => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaccion.fecha}</td>
                <td>${transaccion.tipo}</td>
                <td>${transaccion.monto.toFixed(2)}</td>
                <td>${transaccion.saldo.toFixed(2)}</td>
            `;
            transactionTable.appendChild(row);
        });
    }
}

async function registrarUsuario(nombreUsuario, contraseña) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (usuarios.find(usuario => usuario.nombreUsuario === nombreUsuario)) {
        mostrarMensaje('El nombre de usuario ya existe', 'error');
    } else {
        const nuevoUsuario = {
            nombreUsuario,
            contraseña,
            balance: 0,
            transacciones: []
        };
        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        mostrarMensaje('Registro exitoso', 'success');
        setTimeout(() => window.location.href = '/templates/login.html', 2000);
    }
}

async function iniciarSesion(nombreUsuario, contraseña) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(usuario => usuario.nombreUsuario === nombreUsuario && usuario.contraseña === contraseña);
    if (usuario) {
        usuarioActual = usuario;
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        mostrarMensaje('Inicio de sesión exitoso', 'success');
        setTimeout(() => window.location.href = '/templates/cuenta.html', 2000);
    } else {
        mostrarMensaje('Nombre de usuario o contraseña inválidos', 'error');
    }
}

function verificarSaldo() {
    if (usuarioActual) {
        mostrarMensaje(`Tu saldo es: ${usuarioActual.balance}`, 'info');
    }
}

function transferirFondos(monto) {
    if (usuarioActual) {
        if (monto > usuarioActual.balance) {
            mostrarMensaje('Fondos insuficientes', 'error');
        } else {
            usuarioActual.balance -= monto;
            const transaccion = {
                fecha: new Date().toLocaleString(),
                tipo: 'Transferencia',
                monto: -monto,
                saldo: usuarioActual.balance
            };
            usuarioActual.transacciones.push(transaccion);
            actualizarDatosUsuarioActual();
            mostrarMensaje(`Tu nuevo saldo es: ${usuarioActual.balance}`, 'success');
            actualizarSaldo();
            actualizarUltimaTransaccion();
            actualizarHistorialTransacciones();
        }
    }
}

function depositarFondos(monto) {
    if (usuarioActual) {
        usuarioActual.balance += monto;
        const transaccion = {
            fecha: new Date().toLocaleString(),
            tipo: 'Depósito',
            monto: monto,
            saldo: usuarioActual.balance
        };
        usuarioActual.transacciones.push(transaccion);
        actualizarDatosUsuarioActual();
        mostrarMensaje(`Tu nuevo saldo es: ${usuarioActual.balance}`, 'success');
        actualizarSaldo();
        actualizarUltimaTransaccion();
        actualizarHistorialTransacciones();
    }
}

function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    mostrarMensaje('Sesión cerrada exitosamente', 'success');
    setTimeout(() => window.location.href = '/templates/login.html', 2000);
}

function actualizarDatosUsuarioActual() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const index = usuarios.findIndex(usuario => usuario.nombreUsuario === usuarioActual.nombreUsuario);
    if (index !== -1) {
        usuarios[index] = usuarioActual;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarSaldo();
    actualizarUltimaTransaccion();
    actualizarHistorialTransacciones();

    document.getElementById('registerButton')?.addEventListener('click', () => {
        const nombreUsuario = document.getElementById('registerUsername').value;
        const contraseña = document.getElementById('registerPassword').value;
        if (nombreUsuario && contraseña) {
            registrarUsuario(nombreUsuario, contraseña);
        } else {
            mostrarMensaje('Por favor, complete todos los campos', 'error');
        }
    });

    document.getElementById('loginButton')?.addEventListener('click', () => {
        const nombreUsuario = document.getElementById('loginUsername').value;
        const contraseña = document.getElementById('loginPassword').value;
        if (nombreUsuario && contraseña) {
            iniciarSesion(nombreUsuario, contraseña);
        } else {
            mostrarMensaje('Por favor, complete todos los campos', 'error');
        }
    });

    document.getElementById('checkBalance')?.addEventListener('click', verificarSaldo);

    document.getElementById('openTransferModal')?.addEventListener('click', () => {
        document.getElementById('transferModal').style.display = 'block';
    });

    document.getElementById('closeTransferModal')?.addEventListener('click', () => {
        document.getElementById('transferModal').style.display = 'none';
    });

    document.getElementById('transferForm')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const montoTransferir = parseFloat(document.getElementById('transferAmount').value);
        if (isNaN(montoTransferir) || montoTransferir <= 0) {
            mostrarMensaje('Monto inválido', 'error');
        } else {
            transferirFondos(montoTransferir);
            document.getElementById('transferModal').style.display = 'none';
        }
    });

    document.getElementById('openDepositModal')?.addEventListener('click', () => {
        document.getElementById('depositModal').style.display = 'block';
    });

    document.getElementById('closeDepositModal')?.addEventListener('click', () => {
        document.getElementById('depositModal').style.display = 'none';
    });

    document.getElementById('depositForm')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const montoDepositar = parseFloat(document.getElementById('depositAmount').value);
        if (isNaN(montoDepositar) || montoDepositar <= 0) {
            mostrarMensaje('Monto inválido', 'error');
        } else {
            depositarFondos(montoDepositar);
            document.getElementById('depositModal').style.display = 'none';
        }
    });

    document.getElementById('logoutButton')?.addEventListener('click', cerrarSesion);
    // document.getElementById('balanceChart')?.addEventListener('click', () => {
});
