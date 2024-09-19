let cuenta = 0;
let usuarioActual = JSON.parse(localStorage.getItem('usuarioActual')) || null;
let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];

// Function to show inline messages
function mostrarMensaje(mensaje, tipo = 'info') {
    const messageBox = document.getElementById('messageBox');
    if (messageBox) {
        messageBox.innerHTML = `<div class="${tipo}">${mensaje}</div>`;
        setTimeout(() => messageBox.innerHTML = '', 3000);
    } else {
        console.error('messageBox element not found');
    }
}

// Function to update the balance display
function actualizarSaldo() {
    document.getElementById('currentBalance').textContent = cuenta.toFixed(2);
}

// Function to update the last transaction display
function actualizarUltimaTransaccion() {
    const ultimaTransaccion = transacciones[transacciones.length - 1];
    if (ultimaTransaccion) {
        document.getElementById('lastTransaction').textContent = `${ultimaTransaccion.tipo}: $${ultimaTransaccion.monto.toFixed(2)}`;
    } else {
        document.getElementById('lastTransaction').textContent = 'N/A';
    }
}

// Function to update the transaction history table
function actualizarHistorialTransacciones() {
    const transactionTable = document.getElementById('transactionTable');
    transactionTable.innerHTML = '';
    transacciones.forEach(transaccion => {
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

// Function to register a new user
async function registrarUsuario(nombreUsuario, contraseña) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (usuarios.find(usuario => usuario.nombreUsuario === nombreUsuario)) {
        mostrarMensaje('El nombre de usuario ya existe', 'error');
    } else {
        usuarios.push({ nombreUsuario, contraseña });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        mostrarMensaje('Registro exitoso', 'success');
        setTimeout(() => window.location.href = '/templates/login.html', 2000);
    }
}

// Function to log in a user
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

// Function to check balance
function verificarSaldo() {
    mostrarMensaje(`Tu saldo es: ${cuenta}`, 'info');
}

// Function to transfer funds
function transferirFondos(monto) {
    if (monto > cuenta) {
        mostrarMensaje('Fondos insuficientes', 'error');
    } else {
        cuenta -= monto;
        const transaccion = {
            fecha: new Date().toLocaleString(),
            tipo: 'Transferencia',
            monto: -monto,
            saldo: cuenta
        };
        transacciones.push(transaccion);
        localStorage.setItem('transacciones', JSON.stringify(transacciones));
        mostrarMensaje(`Tu nuevo saldo es: ${cuenta}`, 'success');
        updateBalanceChart(cuenta);
        updateTransactionChart(-monto);
        actualizarSaldo();
        actualizarUltimaTransaccion();
        actualizarHistorialTransacciones();
    }
}

// Function to deposit funds
function depositarFondos(monto) {
    cuenta += monto;
    const transaccion = {
        fecha: new Date().toLocaleString(),
        tipo: 'Depósito',
        monto: monto,
        saldo: cuenta
    };
    transacciones.push(transaccion);
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
    mostrarMensaje(`Tu nuevo saldo es: ${cuenta}`, 'success');
    updateBalanceChart(cuenta);
    updateTransactionChart(monto);
    actualizarSaldo();
    actualizarUltimaTransaccion();
    actualizarHistorialTransacciones();
}

// Adding event listeners after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize balance and transaction history on page load
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
});
