const { getDates, getTicketsDataForReport, getPagosDataForReport } = require("../main")

let allDates = []
let datesToShow = []
let miMes; 

//LLENAR ARREGLO CON TODAS LAS FECHAS
const fillAllDates = async ()=> {    
    const fechas = await getDates()
    allDates = fechas.flat();
    allDates.forEach(x => {
        const parts = x.fecha.split("-")   
        const fechaToPush = parts[1].concat('-' + parts[2]); 
        datesToShow.push(fechaToPush); 
    })
    renderDates()
}

//SUSTITUIR NUMEROS POR STRINGS DE FECHAS 
function replaceStrings(x){ 
    const fechaCut = x.slice(-4)   
        if(x[0]== '1') {
           return'Enero-'.concat(fechaCut)
        }
        if(x[0]== '2'){
            return 'Febrero-'.concat(fechaCut)
        }
        if(x[0]== '3'){
            return 'Marzo-'.concat(fechaCut)
        }
        if(x[0]== '4'){
            return 'Abril-'.concat(fechaCut)
        }
        if(x[0]== '5') {
            return 'Mayo-'.concat(fechaCut)
        }
        if(x[0]== '6'){
            return 'Junio-'.concat(fechaCut)
        }
        if(x[0]== '7'){            
            return 'Julio-'.concat(fechaCut)
        }
        if(x[0]== '8'){
           return 'Agosto-'.concat(fechaCut)
        }
        if(x[0]== '9'){
            return 'Septiembre-'.concat(fechaCut)
        }
        if(x[0]== '10'){
            return 'Octubre-'.concat(fechaCut)
        }
        if(x[0]== '11'){
            return 'Noviembre-'.concat(fechaCut)
        }
        if(x[0]== '12') {
            return 'Diciembre-'.concat(fechaCut)
        }

    
}

//ELIMINAR FECHAS REPETIDAS
const misDiasFiltrados = ()=> {
    let misDias = datesToShow
    let diasListos = misDias.reduce((acc, el) => {
        let existingElement = acc.find(e => e[0]=== el[0])
        if (existingElement) {
            return acc.map(x => {
                if (x=== el) {
                    return x                        
                    }                
                return x
            })
        }
        return [...acc, el]
    }, [])
  
    return diasListos;
}

//RENDERIZAR LAS FECHAS
function renderDates(){
  const select = document.getElementById('select'); 
  select.innerHTML = ''
  const datesToRender = misDiasFiltrados(datesToShow)
  select.innerHTML+= `
  <select id='getInfo' name='getInfo'>
  ${datesToRender.map(x=> (
    `<option value = ${x} > ${replaceStrings(x)} </option> `
  ))} </select> 
  `
  const mes = document.querySelector('#getInfo'); 
  mes.addEventListener('change', e=> {
      miMes = e.target.value; 
      renderData()
  })
  renderData()
}



//CARGAR DATOS DE TICKETS
async function renderData(){
    const getInfo = document.getElementById('getInfo').value
    const res = await getTicketsDataForReport(getInfo); 
    console.log(res)
    const ventasMes = res.reduce((acc, el)=> el.credito === 'no' ? acc + Number(el.valor) : acc + 0, 0); 
    const costoVentasMes = res.reduce((acc, el)=> el.credito === 'no' ? acc + Number(el.costo) : acc + 0, 0);    
   const efevoMov = await getPagosDataForReport(getInfo);
   const pagosTotales = efevoMov.reduce((acc, el)=> el.tipo === 'pago a proveedores' ?  acc + Number(el.monto) : acc + 0, 0); 
   const cobrosTotales = efevoMov.reduce((acc, el)=> el.tipo === 'cobro a clientes' ? acc + Number(el.monto) : acc + 0, 0); 
   renderInfo(getInfo, ventasMes, costoVentasMes, pagosTotales, cobrosTotales);
}

//RENDERIZAR LA INFORMACION
function renderInfo(mes, ventasTotales, costoVentas, pagos, cobros){
    const container = document.getElementById('container')
    container.innerHTML=''
    container.innerHTML += `
        <h1> Bienvenido Administrador </h1>
        <h4> Durante el mes número ${mes} este fue el comportamiento de tu empresa: <h4>
        <h3> Ventas al contado: $${separator(ventasTotales)} </h3>
        <h3> Costo de las ventas al contado: $${separator(costoVentas)} </h3>
        <h3> Utilidad bruta del periodo: $${separator(ventasTotales - costoVentas)}
        <h3> Pagos Totales Registrados: ${pagos} </h3>
        <h3> Cobros Totales Registrados: ${cobros} </h3> 
        <h3> Saldo: ${separator(ventasTotales - costoVentas - pagos + cobros)} </h3>
    `
}

//visualizar con comas las cantidades de efectivo
function separator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
  }

const init = async ()=> {
    await fillAllDates(); 
    
}

init(); 