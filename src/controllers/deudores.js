const { default: Swal } = require("sweetalert2");
const { getExpiredTickets, getMyExpiredTicket, submitPago, loadPayFromExpiredTiket } = require("../main");

let fecha = new Date();
let mes = Number(fecha.getMonth())+1; 
let miFecha = fecha.getDate() + '-' + mes + '-'+ fecha.getFullYear();
 
let misTickets = []

let nombre = document.getElementById('nombre')
nombre.addEventListener('change',e=> {
    misTickets = []
    let deudor = e.target.value
    render(deudor)
}); 


async function render(nombre) {
const allExpiredTickets = await getExpiredTickets(); 
const main = document.getElementById('main');
    if(!nombre){    
    main.innerHTML = ''
    if(allExpiredTickets.length){
        allExpiredTickets.map(x=> {
            main.innerHTML+= `
            <div class='card'> 
            <span> Nombre:  ${x.client} </span>
            <span> Fecha: ${x.fecha} </span> 
            <span> Productos: ${x.products} </span> 
            <span> Valor de la nota: ${x.valor} </span>  
                <div> 
                    <button id='cargarPago' onclick='cargarPago(${x.id})' class='btn btn-primary'> Agregar Pago </button> 
                    <select id='metodopago'> 
                        <option value='efectivo'> Efectivo </option> 
                        <option value='transferencia'> Transferencia Electronica </option> 
                        <option value='cheque'> Cheque </option> 
                        <option value='tarjeta'> Tarjeta </option> 
                    </select>
                </div>             
            </div> 
            `
        })        
    } else {
        main.innerHTML= `
        <h3> Enhorabuena, Agroveterinaria Plan de Guinea No tiene deudores, Sigue así! </h3> 
        `
    }
    } else {
        allExpiredTickets.forEach(x=> {
            if(x.client.includes(nombre)) misTickets.push(x); 
            main.innerHTML = ''; 
            misTickets.map(x=> {
                main.innerHTML+= `
                <div class='card'> 
                <span> Nombre:  ${x.client} </span>
                <span> Numero de Nota: ${x.id}</span>
                <span> Fecha: ${x.fecha} </span> 
                <span> Productos: ${x.products} </span> 
                <span> Valor de la nota: ${x.valor} </span>  
                    <div> 
                        <button id='cargarPago' onclick='cargarPago(${x.id})' class='btn btn-primary'> Agregar Pago </button> 
                        <select id='metodopago'> 
                            <option value='efectivo'> Efectivo </option> 
                            <option value='transferencia'> Transferencia Electronica </option> 
                            <option value='cheque'> Cheque </option> 
                            <option value='tarjeta'> Tarjeta </option> 
                        </select>
                    </div>             
                </div> 
                `
            })
        })
    }

}

const renderAll= async()=> {
const allExpiredTickets = await getExpiredTickets(); 
const main = document.getElementById('main');    
    main.innerHTML = ''
    if(allExpiredTickets.length){
        allExpiredTickets.map(x=> {
            main.innerHTML+= `
            <div class='card'> 
            <span> Nombre:  ${x.client} </span>
            <span> Fecha: ${x.fecha} </span> 
            <span> Productos: ${x.products} </span> 
            <span> Valor de la nota: ${x.valor} </span>  
                <div> 
                    <button id='cargarPago' onclick='cargarPago(${x.id})' class='btn btn-primary'> Agregar Pago </button> 
                    <select id='metodopago'> 
                        <option value='efectivo'> Efectivo </option> 
                        <option value='transferencia'> Transferencia Electronica </option> 
                        <option value='cheque'> Cheque </option> 
                        <option value='tarjeta'> Tarjeta </option> 
                    </select>
                </div>             
            </div> 
            `
        })        
    } else {
        main.innerHTML= `
        <h3> Enhorabuena, Agroveterinaria Plan de Guinea No tiene deudores, Sigue así! </h3> 
        `
    }
}
const cargarPago = async(id)=> {
    let factura = await getMyExpiredTicket(id); 
    factura = factura[0]; 
    let metodoPago = document.getElementById('metodopago').value
    let pago = {
        monto: factura.valor, 
        tipo: 'cobro a clientes', 
        descripcion: `Pago a la nota ${id} con la fecha ${factura.fecha} del cliente ${factura.client} efectuada en ${miFecha}`, 
        metodo: metodoPago, 
        fecha: miFecha,        
    }
    const hidden = document.getElementById('hidden'); 
    hidden.innerHTML = ''; 
    hidden.innerHTML += `
    <div class='ticket'> 
        <img src='../img/logoplan.jpg' alt='Plan de Guinea' id='logo'/>         
        <span> Agro Plan  </span> 
        <div id='alinearwasa'> <img src='../img/whatsapp.jpeg' alt='contacto' id='contacto' /> <span class='telefono'> 231 180 8329 </span></div> 
        <span class='telefono'> comunidadguinea@gmail.com </span> <br>
    </div>
    <div> 
    <span> Usted ha realizado el pago de la nota ${id} con fecha ${factura.fecha} el dia ${miFecha} con el metodo de pago ${metodoPago}</span>
    <br> <span> Gracias por su visita </span>
    </div>
    `
 
    
    
    await loadPayFromExpiredTiket(id); 
    await submitPago(pago); 
    window.print()
    Swal.fire(
        'Pago Cargado con éxito ',
        'Presiona para continuar!',
        'success'
      )   
    window.location.reload(); 
}

const init = ()=> {
    renderAll()
}

init(); 