const { default: Swal } = require("sweetalert2");
const { getFacturas, submitPago, getDates, getSomeTickets, getSomeBills, getSomePagos } = require("../main")
let filterTickets = new Array;

//FUNCION PARA CARGAR FACTURAS TOTALES EN EL ARRAY 
const tickets = async ()=> {
   //ticketsForShow = await getTickets();
   //checkDay();
   renderOptionDay();  
} 

//Para filtrar los dias en particular: 
let dayForprint = ''; 

let miDia = null; 

//Para seleccionar un dia en particular 
const selectDay = ()=> {
    const miFechaParticular = document.getElementById('miDiaEnEspecial')
    console.log(miFechaParticular)
    miFechaParticular.addEventListener('change', e=> {   
    let fecha = e.target.value; 
    miDia = fecha; 
    renderTickets(); 

})
     const dia = document.querySelector('#dayoption'); 
     dia.addEventListener('change', evento => {
        dayForprint = evento.target.value;
        miDia = dayForprint; 
        renderTickets();
     })     
}


const misDiasFiltrados = async ()=> {
    let misDias = await getDates();
    let diasListos = misDias.reduce((acc, el) => {
        let existingElement = acc.find(e => e.fecha === el.fecha)
        if (existingElement) {
            return acc.map(x => {
                if (x.fecha === el.fecha) {
                    return {
                        ...x,
                    }
                }
                return x
            })
        }
        return [...acc, el]
    }, [])
  
    return diasListos;
}

//FUNCION PARA RENDERIZAR EL SELECT CON LAS FECHAS
const renderOptionDay = async()=> {
    let myTickets = document.getElementById('selecciondia'); 
    let misDias = await misDiasFiltrados();
    let misDiasCortados = misDias.slice(misDias.length - 8); 
    // let misDiasCortados = misDias;
    misDias = misDiasCortados.map(x=> x.fecha)    
        myTickets.innerHTML += `
        <div> 
            <select id='dayoption' name= 'dayoption' class="form-select form-select-lg mb-3" aria-label=".form-select-lg example"> 
                <option value = 'full'> Seleccionar Dia </option>                
                        ${misDias.map(x=>(                           
                            `<option value = "${x}"> ${x} </option>`                            
                        ))}                  
            </select> 
           
        </div> 
        `   
        myTickets.innerHTML += `
                        <button class='btn btn-primary' onclick='window.print()'> Imprimir corte </button>
        `       
       selectDay();
}
//Funcion para renderizar compras
const renderBills = async()=>{ 
let billsToRender = await getSomeBills(miDia);
  const facturas = document.getElementById('facturas'); 
  let comprasdeldia = document.getElementById('comprasdeldia')
  comprasdeldia.innerHTML = ''; 
  facturas.innerHTML = ''; 
  comprasdeldia.innerHTML += `<h3> Compras del dia </h3>`;
  billsToRender.map(x=> {
    facturas.innerHTML += `
    <div class="card card-body my-2" id='parte1'> 
        <span> Fecha: ${x.fecha} </span> 
        <span> Proveedor ${x.proveedor} </span> 
        <span> Tipo de factura ${x.pago} </span> 
        <span> Productos ${JSON.parse(x.productos).map(y=> (`
            <div class='card interCard' >
                <span> Producto: ${y.name}</span>
                <span> Unidades compradas: ${y.stock}</span>
                <span> Costeo seleccionado: ${y.costeo}</span>
                <span> Categoria: ${y.CATEGORIA}</span>
            </div>
        `))} </span> 
        <span> Total: $ ${x.total} </span> 
    </div> 
    `
  }) 
  //renderMovements();
}

//FUNCION PARA RENDERIZAR LAS NOTAS VENDIDAS
const renderTickets = async()=> {
    let myTickets = document.getElementById('corte'); 
    let ventadeldia = document.getElementById('ventadeldia')
    ventadeldia.innerHTML = ''; 
    myTickets.innerHTML = ''; 
    let myTicketsToRender = await getSomeTickets(miDia);
    if(!myTicketsToRender){
        myTickets.innerHTML = `Lo siento, no he encontrado datos en la fecha Seleccionada`
    }
    filterTickets = myTicketsToRender; 
    ventadeldia.innerHTML += `  <h3> Ventas del dia </h3> ` 
    myTicketsToRender.map(x=> {
        if(x.pago === "por definir" || x.pago === "efectivo"){
            myTickets.innerHTML += `               
            <div class="card card-body my-2" id='parte2'> 
                <span> Fecha ${x.fecha} </span>
                <span> Nota: ${x.id}</span>
                <span> Cliente: ${x.client} </span>
                <span> Productos: ${JSON.parse(x.products).map(y=> (`
                    <div class='interCard card'>
                        <span> Producto: ${y.product} </span>
                        <span> Precio: ${y.precio} </span>
                        <span> Cantidad: ${y.cantidad}</span>
                    </div>
                `))} </span>
                <span> <b> Valor de la Venta: $ ${(x.valor).toFixed(2)} </b></span>
                <span> Costo de la Nota: $ ${x.costo.toFixed(2)} </span>
                <span> Facturar: ${x.facturar} </span> 
                <span> Credito : ${x.credito} </span> 
                <span> Pago : ${x.pago} </span>
                <span> Utilidad individual: $ ${(x.valor - x.costo).toFixed(2)} </span> 
                <span> Margen de utilidad: ${(((x.valor *100)/ x.costo)-100).toFixed(2)} % </span> 
            </div>
            `
        } else{
             myTickets.innerHTML += `               
        <div class="card card-body my-2 pink" id='parte2'> 
            <span> Fecha ${x.fecha} </span>
            <span> Nota: ${x.id}</span>
            <span> Cliente: ${x.client} </span>
            <span> Productos: ${JSON.parse(x.products).map(y=> (`
                <div class='interCard card'>
                    <span> Producto: ${y.product} </span>
                    <span> Precio: ${y.precio} </span>
                    <span> Cantidad: ${y.cantidad}</span>
                </div>
            `))} </span>
            <span> <b> Valor de la Venta: $ ${(x.valor).toFixed(2)} </b></span>
            <span> Costo de la Nota: $ ${x.costo.toFixed(2)} </span>
            <span> Facturar: ${x.facturar} </span> 
            <span> Credito : ${x.credito} </span> 
            <span> Pago : ${x.pago} </span>
            <span> Utilidad individual: $ ${(x.valor - x.costo).toFixed(2)} </span> 
            <span> Margen de utilidad: ${(((x.valor *100)/ x.costo)-100).toFixed(2)} % </span> 
        </div>
        `
        }
       
   

    })
    renderBills();
    showMyData();
    renderMovements();    
}
//VENTAS TOTALES
const ventaTotal = ()=> {
    let miVenta = filterTickets.reduce((accumulator, currentValue) => accumulator + currentValue.valor,0)
    return miVenta
}
//UTILIDADES DEL DIA 
const miutilidad = ()=> {
    let utilidades = filterTickets.map(x=> x.valor-x.costo)
    let miutilidad = utilidades.reduce((acc, el)=> acc + el, 0); 
    return miutilidad; 
}

//costo ventas
const miCosto = ()=> {
    let costo = filterTickets.reduce((acc, el)=> (acc) + Number(el.costo), 0); 
    return costo
}
//CALCULANDO TODOS LOS PAGOS DEL DIA 
const misPagosEfectivo = async()=> {
    let miPago = await getSomePagos(miDia);
    let misPagosFiltrados = new Array;
    miPago.forEach(x=> {
        x.tipo == 'pago a proveedores' ? 
        misPagosFiltrados.push(x) : null; 
    });
    let pagosEfevo = []
    misPagosFiltrados.forEach(x=> {
        if(x.metodo == 'efectivo') pagosEfevo.push(x);  
    })
    let pagosHechos = pagosEfevo.reduce((acc, el)=> acc + Number(el.monto), 0);
    return pagosHechos; 
}
const misPagosBancos = async()=> {
    let miPago = await getSomePagos(miDia);
    let misPagosFiltrados = new Array;
    miPago.forEach(x=> {
        x.tipo == 'pago a proveedores' ? 
        misPagosFiltrados.push(x) : null; 
    });
    let pagosBancos = []
    misPagosFiltrados.forEach(x=> {
        if(x.metodo !== 'efectivo' && x.metodo !== 'por definir') pagosBancos.push(x); 
    })
    let pagosHechos = pagosBancos.reduce((acc, el)=> acc + Number(el.monto), 0);
    return pagosHechos; 
}
//CALCULANDO TODOS LOS COBROS DEL DIA 
const misCobrosEfevo = async()=> {
    let miCobro = await getSomePagos(miDia);
    let misCobrosFiltrados = new Array; 
    miCobro.forEach(x=> {
        if(x.tipo == 'cobro a clientes') misCobrosFiltrados.push(x)
    });
    let misCobrosEfevo = []
    misCobrosFiltrados.forEach(x=> {
        if(x.metodo == 'efectivo') misCobrosEfevo.push(x)
    })
    let cobroshechos = misCobrosEfevo.reduce((acc, el)=> acc + Number(el.monto), 0);
    return cobroshechos; 
}
//CALCULANDO VENTAS EN EFECTIVO DEL DIA
const calculateCash = async()=> {
    let ventasDelDia = await getSomeTickets(miDia)
    let ventasEfevo = []
    ventasDelDia.forEach(x=> {
        if(x.pago == 'efectivo') ventasEfevo.push(x); 
    })
    let ventasEfevoCantidad = ventasEfevo.reduce((acc, el)=> acc + Number(el.valor), 0);
    let efectivoacredito = await ventasEfectivoCredito();
    let result = ventasEfevoCantidad - efectivoacredito
    return result; 
}
//CALCULANDO VENTAS DE BANCOS DEL DIA 
const calculateBank = async()=> {
    let ventasDelDia = await getSomeTickets(miDia)
    let ventasBancos = []
    ventasDelDia.forEach(x=> {
        if(x.pago !== 'efectivo' && x.pago !== 'por definir' && x.pago !== 'cheque') ventasBancos.push(x); 
    });
    let ventasBancosCantidad = ventasBancos.reduce((acc, el)=> acc + Number(el.valor), 0); 
    return ventasBancosCantidad
}
//CALCULANDO COBROS EN BANCOS DEL DIA 
const cobrosBancos = async ()=> {
    let miCobro = await getSomePagos(miDia);
    let misCobrosFiltrados = new Array; 
    miCobro.forEach(x=> {
        if(x.tipo == 'cobro a clientes') misCobrosFiltrados.push(x)
    });
    let misCobrosBancos = []
    miCobro.forEach(x=> {
        if(x.metodo !== 'efectivo' && x.metodo !== 'cheque') misCobrosBancos.push(x); 
    })
    let result = misCobrosBancos.reduce((acc, el)=> acc + Number(el.monto), 0); 
    return result; 
}
//CALCULANDO VENTAS PAGADAS CON CHEQUES 
const ventasCheque = async()=> {
    let ventasDelDia = await getSomeTickets(miDia)
    let ventasBancos = []
    ventasDelDia.forEach(x=> {
        if(x.pago == 'cheque') ventasBancos.push(x); 
    });
    let ventasBancosCantidad = ventasBancos.reduce((acc, el)=> acc + Number(el.valor), 0); 
    return ventasBancosCantidad
}
//VENTAS DEL DIA A CREDITO
const ventasCredito = async()=> {
    let miCredito = await getSomeTickets(miDia); 
    let creditoDia = [];
    miCredito.forEach(x=> {
        if(x.credito == 'si') creditoDia.push(x)
    })
    let result = creditoDia.reduce((acc, el)=> acc + Number(el.valor), 0); 
    return result; 
}

//ventas en efectivo a credito 
const ventasEfectivoCredito = async()=> {
    let ventasDelDia = await getSomeTickets(miDia)
    let arreglocreditos = []; 
    ventasDelDia.forEach(x=> {
        if(x.pago == 'efectivo' && x.credito =='si') arreglocreditos.push(x);    
     })          
    let result = arreglocreditos.reduce((acc, el)=> Number(acc) +  Number(el.valor), 0); 
    return Number(result); 
   
}
const efectivoPozolov = async()=> {
    //VENTAS EN EFECTIVO 
    let ventasEfectivo = await calculateCash()
    //VENTAS CREDITO 
    let creditos = await ventasCredito();     
    //COBROS EN EFECTIVO 
    let cobrosEfevo = await misCobrosEfevo(); 
    //PAGOS EN EFECTIVO 
    let pagosEfevo = await misPagosEfectivo();   
    //RETORNAR LA CANTIDAD 
    let result = (ventasEfectivo + cobrosEfevo - pagosEfevo ); 
    return result; 
}

//FILTRAR TICKETS A CREDITO 
const ticketsCredito = async()=> {
    let miCredito = await getSomeTickets(miDia); 
    let creditoDia = [];
    miCredito.forEach(x=> {
        if(x.credito == 'si') creditoDia.push(x)
    })
    let productosJson = []
    creditoDia.forEach(x=> {
        let obj = {
            client: x.client, 
            costo: x.costo, 
            credito: x.credito, 
            facturar: x.facturar, 
            fecha: x.fecha, 
            id: x.id, 
            pago: x.pago, 
            productos: JSON.parse(x.products), 
            valor: x.valor
        }
        productosJson.push(obj)
       })
    
return productosJson; 
}
//MOSTRAR INFORMACIÓN DE LOS MOVIMIENTOS DEL CORTE: 
const showMyData = async()=> { 
    const myData = document.getElementById('datos');
    myData.innerHTML = ''; 
    myData.innerHTML += `
    <div id='parte3'> 
        <input id='pagos' placeholder='Agregar Pago a proveedor' type='number'/>
        <select id='pagoproveedor' name='pagoproveedor'> 
            <option value='efectivo'> Efectivo </option> 
            <option value='cheque/transferencia'> Transferencia Bancaria </option>
        </select> <br>
        <textarea rows="4" cols="50" id='descripcionpago' placeholder="Descripción"></textarea> 
    </div>
    <div id='parte3'> 
        <input id='cobros' placeholder='Agregar Cobro a clientes' type='number' /> 
        <select id='pagocliente' name='pagocliente'> 
            <option value='efectivo'> Efectivo </option> 
            <option value='cheque/transferencia'> Transferencia Bancaria </option>
        </select> <br>
        <textarea rows="4" cols="50" id='descripcioncobro' placeholder="Descripción"></textarea>
        <br> 
        <button id='cargarpago' class='btn btn-primary' onclick={myCashMovement()}> Cargar Movimientos de Efectivo </button> <br>
    </div>


    <div class = 'card card-body my-2' id='parte4' style="page-break-after: always;">
    <img src='../img/logoplan.jpg' alt='logo'/ id='logo'> 
        <span> Fecha <b> ${miDia} </b></span> </br>
        <span><b> Venta totales:$ ${separator(ventaTotal())} </b></span> </br>
        <span><b> Costo de las ventas:$ ${separator(miCosto().toFixed(2))} </b></span> </br>
        <span><b> Porcentaje de Utilidad: ${ ( miutilidad() / (miCosto()) * 100 ).toFixed(2)} % </b></span> </br>
        <span><b> Utilidad del dia: $ ${ separator(miutilidad().toFixed(2)) } </b></span> </br>
 
        <span> <pre>     Ventas en Efectivo: $ ${await calculateCash()} </pre></span> <br>
        <span> <pre>     Ventas Bancos: $ ${await calculateBank()} </pre></span> <br>
        <span> <pre>     Ventas con Cheque: $ ${await ventasCheque()} </pre></span> <br>
        <h3> Egresos de Efectivo: </h3> </br>
        <span><pre>     Compras Realizados en Efectivo: $ ${await misPagosEfectivo()} </pre> </span><br>
        <span> <pre>    Compras Realizados con bancos: $ ${await misPagosBancos()}</pre> </span> <br>
        <h3> Creditos </h3> </br>
        <span> <pre>     Creditos Otorgados: $ ${await ventasCredito()}</pre></span>
        <h4> Ingresos al Efectivo </h4>
        <span> <pre>     Cobros en Efectivo: $ ${await misCobrosEfevo()} </pre></span> <br>
        <span> <pre>     Cobros en Bancos: $ ${await cobrosBancos()} </pre></span> <br> 
        <span> <b> Efectivo a Entregar: $ ${await separator(await efectivoPozolov())} </b></span> <br>
    </div>   
    `    
    notasACredito()
}

//cargar notas a credito para que las vean los bueyes 
const notasACredito = async()=> {
    const myData = document.getElementById('notasACredito');
    const titulo = document.getElementById('notasACreditoTitulo')
    titulo.innerHTML = '<h3> Notas a credito del dia: </h3>'
    let misCreditos = await ticketsCredito()
    misCreditos.map(x=> {
        myData.innerHTML += `
         <div class='card card-body my-2' id='parte2'>
            <span> Numero de nota: ${x.id} </span>
            <span> Fecha: ${x.fecha} </span> 
            <span> Cliente: ${x.client} </span>
            <span> Precio de venta de la nota: ${x.valor} </span>
            <span> Costo de la Nota: ${x.costo}</span>            
            <span> Productos: ${x.productos.map(y=> (`
            <div class='card interCard'> 
                <span> Producto: ${y.product}</span>
                <span> Precio: ${y.precio}</span>
                <span> Cantidad: ${y.cantidad}</span>
            </div>
        `))}</span>
        </div>`          
    })
}

//visualizar con comas las cantidades de efectivo
function separator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
  }
let movementsRendered = false;

const loadCashMovement = async (pago)=> {
    const result = await submitPago(pago); 
    //return result; 
}
//Funcion para cargar movimientos de efectivo 
const myCashMovement = () => {
    const pagos = document.getElementById('pagos').value;     
    const pagoDescription = document.getElementById('descripcionpago').value; 
    const cobros = document.getElementById('cobros').value; 
    const descripcioncobro = document.getElementById('descripcioncobro').value; 
    const pagoproveedor = document.getElementById('pagoproveedor').value; 
    const pagocliente = document.getElementById('pagocliente').value; 

    if(pagos){
        const pagoADB = {
            monto: pagos, 
            tipo: 'pago a proveedores',
            descripcion: pagoDescription, 
            metodo: pagoproveedor, 
            fecha: miDia
        }
        loadCashMovement(pagoADB); 
        Swal.fire(
            'Pago cargado con éxito ',
            'Presiona para continuar!',
            'success'
          ).then(()=> window.location.reload())
        document.getElementById('pagos').value = '';
        document.getElementById('descripcionpago').value = ''
        document.getElementById('cobros').value = ''
        document.getElementById('descripcioncobro').value = ''
    }
    if(cobros){
        const pagoADB = {
            monto: cobros, 
            tipo: 'cobro a clientes',
            descripcion: descripcioncobro,
            metodo: pagocliente, 
            fecha: miDia
        }
        loadCashMovement(pagoADB); 
        Swal.fire(
            'Cobro cargado con éxito ',
            'Presiona para continuar!',
            'success'
          ).then(()=> window.location.reload())
        document.getElementById('pagos').value = '';
        document.getElementById('descripcionpago').value = ''
        document.getElementById('cobros').value = ''
        document.getElementById('descripcioncobro').value = ''   
    }   
      
    if (!movementsRendered) {
       //renderMovements();
        movementsRendered = true;
    } else {
        const misDatos = document.getElementById('datosmovimientoscash'); 
        misDatos.innerHTML = ``;    
    }
   
}

const renderMovements = async() => {
    const misPagos = document.getElementById('pagos');
    misPagos.innerHTML = ''
    const pagosTitulo = document.getElementById('pagosTitulo');
    const misCobros = document.getElementById('cobros');
    misCobros.innerHTML = ''; 
    const cobrosTitulo = document.getElementById('cobrosTitulo');    
    pagosTitulo.innerHTML = '<h3> Egresos</h3>';
    cobrosTitulo.innerHTML = '<h3> Ingresos </h3>'
    let movementsToRender = await getSomePagos(miDia);
    let cobros = movementsToRender.filter(x=> x.tipo == 'cobro a clientes'); 
    let pagos = movementsToRender.filter(x=> x.tipo == 'pago a proveedores'); 
    pagos.map(x=> {
         misPagos.innerHTML += `
        <div class='card card-body my-2' id='parte5'> 
           <span> Fecha: ${x.fecha} </span>
           <span> Descripción: ${x.descripcion}</span>
           <span> Metodo: ${x.metodo}</span>
           <span> Monto ${x.monto} </span>
            
        </div>
    `;
    })
    cobros.map(x=> {
        misCobros.innerHTML += `
       <div class='card card-body my-2' id='parte5'> 
          <span> Fecha: ${x.fecha} </span>
          <span> Descripción: ${x.descripcion}</span>
          <span> Metodo: ${x.metodo}</span>
          <span> Monto ${x.monto} </span>
           
       </div>
   `;
   })
   
}
//FUNCION PARA TRAER TODAS LAS FACTURAS DE COMPRA
const getMyBills = async()=> {
    const result = await getFacturas(); 
    return result; 
} 

//FUNCION INICIALIZADORA DE LA INSTANCIA 
const init = ()=> {
    tickets(); 
}

init(); 