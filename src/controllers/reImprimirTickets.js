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
        <div class='ticket'> 
            <img src='../img/logoplan.jpg' alt='Plan de Guinea' id='logo'/>         
            <span> Agro Plan  </span> 
            <div id='alinearwasa'> <img src='../img/whatsapp.jpeg' alt='contacto' id='contacto' /> <span class='telefono'> 231 180 8329 </span></div> 
            <span class='telefono'> comunidadguinea@gmail.com </span>  
      
        </div> 

        <span> Fecha ${ticket.fecha} </span>
        <span> Nota: ${ticket.id}</span>  
        <span> Productos: ${JSON.parse(ticket.products).map(y=> (`
        <div class='interCard card'>
                <span> Producto: ${y.product} </span>
                <span> Precio: ${y.precio} </span>
                <span> Cantidad: ${y.cantidad}</span>
        </div>
        `))} </span>
        <span> <b> Total: $ ${(ticket.valor).toFixed(2)} </b></span>
        <span> Gracias por tu compra! </span>     
           
            <span class='telefono'> Tecnología desarrollada en Plan de Guinea </span> 
        

        </div>     
    <button class='btn btn-primary' onclick='reImprimir()'> ReImprimir Ticket </button>
   
        
    `    
} else{
    container.innerHTML += `
    <div class='card card-body my-2' > 
        <h3> No se encontro la nota buscada </h3>
    </div>
    `
}
}

function reImprimir(){
    window.print(); 
}
