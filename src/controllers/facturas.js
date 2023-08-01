const { default: Swal } = require("sweetalert2");
const { facturasPendientes, loadFacturaDone } = require("../main")


const render = async ()=> {
    const facturas = await facturasPendientes(); 
    const main = document.getElementById('main'); 
    console.log(facturas)
    main.innerHTML = ''; 
    if(facturas.length){
        facturas.map(x=> {
        main.innerHTML += `
            <div class='card'> 
            <span> Nombre:  ${x.client} </span>
            <span> Fecha: ${x.fecha} </span> 
            <span> Productos: ${x.products} </span> 
            <span> Valor de la nota: ${x.valor} </span>  
                <div> 
                    <button id='cargarPago' onclick='cargarFactura(${x.id})' class='btn btn-primary'> Factura Hecha </button>             
                </div>             
            </div> 
            `
        })
    } else {
        main.innerHTML += `
        <h1> No tienes Facturas pendientes </h1> 
        `
    }    
}

async function cargarFactura(id){
    await loadFacturaDone(id); 
    Swal.fire(
        'Base de datos actualizada exitosamente! ',
        'Presiona para continuar!',
        'success'
      )
    window.location.reload(); 
}

const init = ()=> {
    render();
}

init(); 