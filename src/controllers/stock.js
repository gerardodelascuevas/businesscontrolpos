const { getProducts, submitShop, submitTicket, updateMyProducts } = require('../main'); 

let products = new Array; 
let filterProducts = []
const allProducts = async ()=> {
    products = await getProducts();
    renderProducts();       
}

const filtro = ()=> {
  let filtrados = products.map(x=> x.CATEGORIA) 
  let uniqueArray = [...new Set(filtrados)];
  const header = document.getElementById('header'); 
  header.innerHTML = '';
    header.innerHTML += `
    <select id='categorias' name='categorias'> 
    <option value='full'> Filtrar por categoria </option>
    <option value='full'> Todos </option> 
    ${uniqueArray.map(x=> (
      `<option value= '${x}'> ${x} </option>`
    ))}      
    </select> `;      
selectCategory()
}

const selectCategory = ()=> {
  const categoria = document.querySelector('#categorias'); 
  categoria.addEventListener('change', evento => {
     categoriaSelecta = evento.target.value; 
     if(categoriaSelecta == 'full'){
      filterProducts = products.slice(0,10); 
      renderProducts()
     } else {
       let misFiltrados = products.filter(x=> x.CATEGORIA == categoriaSelecta); 
       filterProducts = misFiltrados.slice(0,10); 
       renderProducts();
     }    
  })       
}

const miBusqueda = document.getElementById('buscar'); 
miBusqueda.addEventListener('change', e=> {
  let buscado = e.target.value; 
  buscado = buscado.toLowerCase().trim();  
  if(buscado){
   filterProducts = products.filter(x=> x.name.toLowerCase().trim().includes(buscado)) 
  } else {
    filterProducts = [];
  }  
  renderProducts()
})

const renderProducts = ()=> {
  let productList = document.getElementById('products'); 
  productList.innerHTML = ''; 
  productList.innerHTML += ``; 
  filterProducts.length ==0 ? 
  productList.innerHTML += `<h1> Sin Resultados </h1>`
  : 
  filterProducts.map(x=> {
    console.log(x)
    if(x.CATEGORIA == 'accesorios'){
      productList.innerHTML += `
      <div class="card card-body my-2 " >   
        <h4><b>${x.name}</b>  <em> id: ${x.id} </em> </h4>    
        <h3> Precio Publico $ ${Math.round(x.cost * 1.3)} </h3> 
        <h3> Precio Frecuente $ ${Math.round(x.cost * 1.25)} </h3> 
        <h3> Precio Distribuidor antes socio $ ${Math.round(x.cost * 1.2)} </h3> 
        <h3> Precio Accionista $ ${Math.round(x.cost * 1.1)} </h3> 
        <h3> Precio de Costo --> $ ${x.cost} <h3> 
        <h6> Piezas en Inventario: ${x.stock} </h6> 
        ${x.detalle && x.detalle !== 'null' && x.detalle !== 'undefined' ? `  <b><span class= "detalle"> Detalle: ${x.detalle}</span> </b>` : ''}
        <input type='number' placeholder='Escribe el precio que deseas aplicar en el producto' id='${x.name}' class='precioPozolov'> </input>  
        
        <button id='agregarCarrito' onclick="capturarCompra('${x.name}', '${x.stock}', '${x.cost}', '${Math.round(x.cost * 1.3)}', ${x.id})"> Agregar al carrito </button>
      
      </div> 
      `
    } else {
       productList.innerHTML += `
        <div class="card card-body my-2 " > 

        <h4><b>${x.name}</b>  <em> id: ${x.id} </em> </h4>    
        <h3> Precio Publico $ ${Math.round(x.cost * 1.16)} </h3> 
        <h3> Precio Frecuente $ ${Math.round(x.cost * 1.14)} </h3> 
        <h3> Precio Distribuidor antes socio $ ${Math.round(x.cost * 1.125)} </h3> 
        <h3> Precio Accionista $ ${Math.round(x.cost * 1.075)} </h3> 
        <h3> Precio de Costo --> $ ${x.cost} <h3> 
        <h6> Piezas en Inventario: ${x.stock} </h6> 
        ${x.detalle && x.detalle !== 'null' && x.detalle !== 'undefined' ? ` <b><span  class= "detalle"> Detalle: ${x.detalle}</span></b>` : ''}
        <input type='number' placeholder='Escribe el precio que deseas aplicar en el producto' id='${x.name}' class='precioPozolov'> </input>  
        
        <button id='agregarCarrito' onclick="capturarCompra('${x.name}', '${x.stock}', '${x.cost}', '${Math.round(x.cost * 1.16)}', ${x.id})"> Agregar al carrito </button>
        
        </div> 
        `
    }
   
  })
  productList.innerHTML += `

`; 
  capturarCompra();
  filtro()
}

let fecha = new Date();
let mes = Number(fecha.getMonth())+1; 
let miFecha = fecha.getDate() + '-' + mes + '-'+ fecha.getFullYear();

let shopingCart = new Array; 

//EVITAR CARGAR PRODUCTO CON UN PRECIO DISTINTO 
const checkCarritoBeforeUpdateCarrito = (id, personalPrice)=> {
   let found = shopingCart.find(x=> x.id == id)
   let result
   if(found){
    result = personalPrice == found.price ? true : false; 
   } else result = true; 
   return result
}

let active = false; 
const capturarCompra = async (product, stock, cost, publicPrice, id, otroPrecio)=> {
  let personalPrice; 
  if(otroPrecio) {
    personalPrice = otroPrecio; 
  }else {
    personalPrice = (document.getElementById(product).value) ? (document.getElementById(product).value) : 0;
  } 
  if(personalPrice && personalPrice !== 0) personalPrice = personalPrice
  else personalPrice = publicPrice
  let verificando = checkCarritoBeforeUpdateCarrito(id, personalPrice)
  if(verificando){
    shopingCart.push({
        name: product,
        id: id,     
        stock, stock, 
        cost: cost,    
        price: personalPrice
      });
      if(!active){
        active = true; 
        datosCliente(); 
        carrito();  
        }
      else carrito();  
  } else alert('¡No puedes agregar el mismo producto con Precios diferentes!')
}

const myShop = ()=> {
  let carrito = countMyItem(); 
  return carrito; 
}

const countMyItem = () => {
  let myItemName = shopingCart.map(x => Object.assign({
      piece: 1,
      id: x.id,
      name: x.name,
      cost: x.cost,
      stock: x.stock,
      price: x.price,
  }))

  let myCartWithoutTwoItems = myItemName.reduce((acc, el) => {
      let existingElement = acc.find(e => e.id === el.id)
      if (existingElement) {
          return acc.map(x => {
              if (x.id === el.id) {
                  return {
                      ...x,
                      piece: x.piece + el.piece
                  }
              }
              return x
          })
      }
      return [...acc, el]
  }, [])

  return myCartWithoutTwoItems
}

const myPayToStore = ()=> {  
  let myProductPrice = shopingCart.map(x=> Number(x.price)); 
  const myFinallPay = myProductPrice.length ? myProductPrice.reduce((acc, el) => acc + el) : 0; 
  return myFinallPay; 
}

const myCostOfTicket = ()=> {
  let myCost = shopingCart.map(x=> Number(x.cost)); 
  const myFinallCost = myCost.length ? myCost.reduce((acc, el)=> acc + el, 0) : 0; 
  return myFinallCost;
}

const datosCliente = ()=> {
  let head = document.getElementById('head');
  head.innerHTML = '';
  head.innerHTML += `
  <h6> Dia: ${miFecha} </h6>
  <span> Cliente: </span> 
  <input type='text' id='cliente' placeholder='Nombre del Cliente'> </input>
  <span> ¿Esta compra es a crédito? </span> 
  <select name='credito' id='credito'> 
    <option value='no'> No </option> 
    <option value='si'> Si </option>     
  </select>
  <span> Método de pago </span> 
  <select name='metodopago' id='metodopago'> 
    <option value='efectivo'> Efectivo </option> 
    <option value='tajeta credito'> Tarjeta de credito </option> 
    <option value='tarjeta debito'> Tarjeta de debito </option> 
    <option value='cheque'> Cheque </option>
    <option value='transferencia'> Transferencia electronica de fondos </option>     
  </select>
  <span> ¿El cliente desea facturar su compra? </span> 
  <select name='factura' id='factura'> 
    <option value='no'> No </option> 
    <option value='si'> Si </option>    
  </select>  
  `
}

const carrito = ()=> {
  dropMyBag(); 
  let pago = document.getElementById('pago');  
  let micarrito = document.getElementById('carrito'); 
  micarrito.innerHTML = '';
  pago.innerHTML = '';
  let myShop1 = myShop();

  micarrito.innerHTML += `  <div class='ticket'> 
  <img src='../img/logosantagertrudis.ico' alt='BusinessControl' id='logo'/> 
  <span> BusinessControl </span> 
  <div> <img src='../img/whatsapp.jpeg' alt='contacto' id='contacto' /> <span class='telefono'> 222 440 4412 </span> 
  <br> <span class='telefono'> businesscontrol@gmail.com </span> 
  <p> Fecha: ${miFecha} </p>
  </div> 

</div> `
  myShop1.map(x=> {
  micarrito.innerHTML += `
  <div class='card card-body my-2 mainCard' 'container'> 
    <button class='btn btn-danger' class='borrar' onclick="borrarProducto(${x.id})" > X </button>
    <p> Producto: ${x.name} </p>
    <div id='alinearbotones'> 
      <button id='bajarPieza' class='miniboton btn' onclick="ajustarConBotones('${x.id}', '${x.name}', '${x.stock}', '${x.cost}', '${Math.round(x.cost * 1.16)}', 'bajar', ${x.price})"> - </button>
      <p> Piezas ${x.piece} </p> 
      <button id='subirPieza' class='miniboton btn' onclick="ajustarConBotones('${x.id}', '${x.name}', '${x.stock}', '${x.cost}', '${Math.round(x.cost * 1.16)}', 'aumentar', ${x.price})"> + </button>
    </div>
    <p> Precio: ${x.price} </p>
    <input class='hidden' type='number' min=0 placeholder='Editar Piezas en el carrito'id='${x.id}'/>
    <button class='btn maxiboton' onclick="editarPiezas('${x.id}', '${x.name}', '${x.stock}', '${x.cost}', '${Math.round(x.cost * 1.16)}')"> Agregar Piezas al carrito </button>
  </div>
`
 })
 micarrito.innerHTML += `<div class='mainCard'>
  <div class='container'> <h6> <b>Total $ ${myPayToStore()} </b> </h6> </div>

 <span> Gracias por tu compra! </span> 
  
 <div class='container'>      
    <span class='telefono'> Tecnología desarrollada Por Gerardo de las Cuevas </span> 
 </div> 
</div>
 `
pago.innerHTML += `
 <div> 

  <button id='cargarCompra' class='btn btn-primary'> Comprar Ahora </button> 
</div>
`
 submitOrder();
}

//funcionalidad de botones para subir y bajar cantidad de articulos del carrito
const ajustarConBotones = (id, nombre, cantidad, costo, precioPublico, queHacer, precioVenta)=> {
  let hacer = queHacer; 
  id = Number(id)
  if(hacer =='aumentar'){    
    capturarCompra(nombre, cantidad, costo, precioPublico, id, precioVenta)
  } else if(hacer =='bajar'){
    let index = shopingCart.findIndex(x=> x.id == id)
    if(index !== -1){
      shopingCart.splice(index, 1)
      carrito()
    }
  }
}

//borrar determinado articulo del carrito
const borrarProducto = (id)=> {
  let encontrado = shopingCart.find(x=> x.id == id)
  shopingCart = shopingCart.filter(x=> x.id !== encontrado.id)
  carrito()
}

//agregando piezas desde el input
const editarPiezas = (id, product, stock, cost, publicPrice)=> {
  let piezas = Number(document.getElementById(id).value)
  id = Number(id)
  //manda a llamar a capturar compra hasta que se cumpla el bucle: 
  //capturarCompra = async (product, stock, cost, publicPrice, id)
  if(piezas){  
    for(let i=0; i<piezas; i++){    
      capturarCompra(product, stock, cost, publicPrice, id); 
    }
  }
}

const dropMyBag = ()=> {
  const drop = document.getElementById('vaciarCarrito'); 
  drop.addEventListener('click',()=> { 
    shopingCart = []
    window.location.reload();
  })
}

const submitOrder =  ()=> {
  const order = countMyItem(); 
  document.getElementById('cargarCompra').addEventListener('click',  ()=> {
    order.forEach(async element => {
      let cantidad = Number(element.stock) - element.piece; 
      await submitShop(element.name, cantidad);   
    });
    let myOrder = order.map(x=> {
     let myclientOrder = {
      product: x.name, 
      cantidad: x.piece, 
      precio: x.price
     }
     return myclientOrder; 
    })
    let total = myPayToStore(); 
    let facturar = document.getElementById('factura').value
    let credito = document.getElementById('credito').value
    let jsonOrder = JSON.stringify(myOrder)
    let miPago = document.getElementById('metodopago').value
    let miCosto = myCostOfTicket(); 
   
 
    let myTicket = {
      client: cliente.value,
      fecha: miFecha, 
      products: jsonOrder,
      valor: total, 
      facturar: facturar, 
      credito: credito, 
      pago: miPago, 
      costo: miCosto     
    }
    if(myTicket.credito == 'no'){
      try {
        submitTicket(myTicket);
        alert('compra cargada con exito')
        window.print() 
        
      } catch (error) {
        console.error(error)
      }
    
    } else if(myTicket.client && myTicket.credito == 'si'){
      try {
        myTicket.pago = 'por definir'
        submitTicket(myTicket);
        alert('compra cargada con exito');
        window.print();
      } catch (error) {
        console.error(error)
      }
     
    }  else {
      alert('No puedes cargar una compra a credito sin agregar el nombre del cliente')
    }  
  })  
} 

const init = async ()=> {
    await allProducts()   
}

init();