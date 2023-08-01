const { default: Swal } = require("sweetalert2");
const { getMyExpiredTicket, updateMyTicketValues, getProductByName, updateProductWhenYouDeleteTickets, deleteTicket } = require("../main");

const buscar = document.getElementById('buscar')
let miNota; 
buscar.addEventListener('change', async (e)=> {
    miNota = e.target.value
    const ticket = await getMyExpiredTicket(miNota)
    renderTicket(ticket[0])
})

const renderTicket = (ticket)=> {
    console.log(ticket)
    const container = document.getElementById('container')
    container.innerHTML = ''; 
    if(ticket){    
    container.innerHTML += `
    <div class="card card-body my-2" id='parte2'> 
    <span> Fecha ${ticket.fecha} </span>
    <span> Nota: ${ticket.id}</span>
    <span> Cliente: ${ticket.client} </span>
    <span> Productos: ${JSON.parse(ticket.products).map(y=> (`
        <div class='interCard card'>
            <span> Producto: ${y.product} </span>
            <span> Precio: ${y.precio} </span>
            <span> Cantidad: ${y.cantidad}</span>
        </div>
    `))} </span>
    <span> <b> Valor de la Venta: $ ${(ticket.valor).toFixed(2)} </b></span>
    <span> Costo de la Nota: $ ${ticket.costo.toFixed(2)} </span>
    <span> Facturar: ${ticket.facturar} </span> 
    <span> Credito : ${ticket.credito} </span> 
    <span> Pago : ${ticket.pago} </span>
    <span> Utilidad individual: $ ${(ticket.valor - ticket.costo).toFixed(2)} </span> 
    <span> Margen de utilidad: ${(((ticket.valor *100)/ ticket.costo)-100).toFixed(2)} % </span> 
        <div> 
        <input type='password' id='password' password='clave de administrador'/>
            <button class='btn btn-danger' onclick='deleteMyTicket(${ticket.id})'> Eliminar Nota </button>
        </div>
        
    `
    setearValores(ticket.client,  ticket.id)
} else{
    container.innerHTML += `
    <div class='card card-body my-2' > 
        <h3> No se encontro la nota buscada </h3>
    </div>
    `
}
}

//Eliminar Nota 
async function deleteMyTicket(ticket){
    const password = 'rpolozov123'
    const thePassword = document.getElementById('password').value; 
    if(!ticket){
        console.log('no hay ticket')
    } 
    if(password !== thePassword){
        return Swal.fire({
            icon: 'error',
            title: `Verifica tu clave de administrador`,
            showConfirmButton: false,
            timer: 1500
          })
    } else {
        try {
        const nota = await getMyExpiredTicket(ticket)
        let productos = JSON.parse(nota[0].products)
        console.log(productos, productos.length); 
        for(let i = 0; i<productos.length; i++){
            let productForUpdate = await getProductByName(productos[i].product)
            let cantidad = Number(productForUpdate[0].stock) + Number(productos[i].cantidad); 
            await updateProductWhenYouDeleteTickets(productForUpdate[0].id, cantidad)
        }
            await deleteTicket(ticket)
            return Swal.fire({
                icon: 'success',
                title: `La base de datos se ha modificado con éxito`,
                showConfirmButton: false,
                timer: 1500
              }).then(()=> setTimeout(window.location.reload(), 1000)); 
        } catch (error) {
            return Swal.fire({
                icon: 'error',
                title: `Algo ha fallado, contacta al equipo de desarrollo`,
                showConfirmButton: false,
                timer: 1500
              }).then(()=> console.error(error));
            
        }       
    }
}

//alterar nombre de cliente, metodo de pago, facturar y credito: 
const setearValores = (name, id) => {
  const setear = document.getElementById('setear');
  setear.innerHTML = `
    <div class='card'>
        <input placeholder='Actualizar Nombre de cliente' id='nuevoNombre' value='${name}'/>
        <span> Actualizar Metodo de Pago: </span>
        <select name='metodopago' id='metodopago' defaultValue ='efectivo'> 
            <option value='efectivo'> Efectivo </option> 
            <option value='tajeta credito'> Tarjeta de credito </option> 
            <option value='tarjeta debito'> Tarjeta de debito </option> 
            <option value='transferencia'> Transferencia electronica de fondos </option>     
        </select>
        <span> Actualizar Datos en Facturación: </span>
        <select name='factura' id='factura' defaultValue='no'> 
            <option value='no'> No </option> 
            <option value='si'> Si </option>    
        </select> 
        <span> Actualizar Credito </span>
        <select name='credito' id='credito' defaultValue='no'> 
            <option value='no'> No </option> 
            <option value='si'> Si </option> 
        </select>
            <button class='btn btn-primary' id='myButton' onclick="getData(${id})"> Guardar Cambios </button> 
    </div>
  `;
};

async function getData(id) {
let nuevaFactura = document.getElementById('factura').value
let nuevoCredito = document.getElementById('credito').value
let nuevoPago = document.getElementById('metodopago').value
let nuevoNombre = document.getElementById('nuevoNombre').value
if(nuevoCredito === 'si') nuevoPago = 'por definir'; 
await editarTicketEnBaseDeDatos(id, nuevoNombre, nuevoPago, nuevaFactura, nuevoCredito); 
};
const editarTicketEnBaseDeDatos = async (id, cliente, nuevoPago, nuevaFacturacion, nuevoCredito)=> {
    console.log(cliente, nuevoPago, nuevaFacturacion, nuevoCredito)
    try {
        await updateMyTicketValues(id, nuevoPago, nuevaFacturacion, cliente, nuevoCredito)
        return Swal.fire({
            icon: 'success',
            title: `Base de datos editada con éxito`,
            showConfirmButton: false,
            timer: 1500
          })
    } catch (error) {      
        return Swal.fire({
            icon: 'error',
            title: `Algo ha fallado, contacta al equipo de desarrollo`,
            showConfirmButton: false,
            timer: 1500
          }).then(()=> console.error(error))
    }
    
}