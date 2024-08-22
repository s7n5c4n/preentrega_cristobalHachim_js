let cuenta = 0

let inicio = prompt("1-. Inicio de sesion /n 2.- Registro")

if (inicio == "1"){
    alert("seleccionaste login")
    Login()
}
else if(inicio == "2"){
    alert("seleccionaste Register")
    Register()
}
else{
    alert("seleciona solo uno de los dos")
}

function Register(Users, password){
    const RegisterUsers = prompt("Registrarse, Ingrese su usuario")
    const Registerpassword = prompt("cree la constrasena")
    Users = RegisterUsers
    password = Registerpassword
    Login(Users, password) 
}

function Login(Users, password){
    for(let i = 0; i < 3; i++){
        const LoginUsers = prompt("bienvenido ingrese su usuario")
        const LoginPassword = prompt("ingrese su contrasena")
        let intentos = 0
        if (Users == LoginUsers && password == LoginPassword){
            alert("bienvenido")
            Acciones()
            break;
        }
        else{
            console.log("errores")
            intentos =+ i
        }
    }
}

function Acciones(Users){
    let accion = prompt("1-Ver estado de la cuenta /n 2-Transferir /n 3-depositar a tu cuenta")
    if (accion == "1"){
        alert("tu saldo es de" + "" + cuenta)
    }
    else if (accion == "2"){
        let Transferir = parseFloat(prompt("ingrese el monto a transferir"))
        if(Transferir > cuenta){
            alert("la transferencia supera su monto de su cuenta que es de: "+ "" + cuenta)
        }
        else{
            cuenta =  cuenta -(Transferir)
            alert("su nuevo saldo es de: " + cuenta)
        }
    }
    else if(accion == "3"){
        let depositar = parseFloat(prompt("ingrese el monto a depositar a su cuenta"))
        cuenta = cuenta + depositar
        alert("su nuevo saldo es de:" + cuenta)
    }
    else{
        alert("ingrese un numero proporcionado en la interfaz porfavor")
    }
    Acciones();
}
