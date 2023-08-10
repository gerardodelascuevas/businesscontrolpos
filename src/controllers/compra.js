const { default: Swal } = require('sweetalert2');
const { getProducts, updateMyProducts, submitFactura, createProduct } = require('../main'); 


//ALMACENAR FECHA DEL DIA DE CAPTURA
let fecha = new Date();
let mes = Number(fecha.getMonth())+1; 
let miFecha = fecha.getDate() + '-' + mes + '-'+ fecha.getFullYear();

//COMPARAR PRECIOS
let allproducts = []; 

//CARGAR TODOS LOS PRODUCTOS EN UN ARREGLO PARA SUGERIR PRODUCTOS 
let allProducts2 = []; 

//VERIFICAR COSTOS ANTERIORES: 
const oldStock = async ()=> {
    allproducts = await getProducts(); 
    return allproducts; 
}

//GUARDAR DATOS DE LA FACTURA 
let productsInBill = [];

let factura = {
    numero: 0, 
    proveedor: '',
    pago: '',    
    productos: [],
    total: 0,
}

let product = {
    name: '', 
    cost: 0, 
    stock: 0, 
    detalle: '',
    CATEGORIA: '',
    costeo: ''
};

//SUGERIR PRODUCTOS: 

function autocompleteProduct(inputValue) {
  let suggestionsContainer = document.getElementById("suggestions");
  suggestionsContainer.innerHTML = ""; // Limpiar las sugerencias anteriores
  
  if (inputValue.length === 0) {
    return; // Si no hay texto en el input, no mostrar sugerencias
  }
  
  let matchedProducts = findMatchingProducts(inputValue);
  
  // Mostrar las sugerencias
  matchedProducts.forEach(function(product) {
    let suggestion = document.createElement("div");    
    suggestionsContainer.innerHTML += `<option class='selectPozolov' onclick="fillInputs('${product.name}', '${product.cost}', '${product.CATEGORIA}',  ${product.detalle})"> ${product.name} </option>`
    suggestionsContainer.appendChild(suggestion);
  });
}

function findMatchingProducts(inputValue) {
  let matchedProducts = [];
  if(inputValue){
    matchedProducts = allProducts2.filter(x=> x.name.toLowerCase().trim().includes(inputValue))
    if(matchedProducts.length > 5) matchedProducts = matchedProducts.slice(0,4);  
   } else {
    matchedProducts = [];
   }
  return matchedProducts;
}

//Rellenar datos de los Inputs en base a sugerencia:

function fillInputs(name, cost, categoria, detalle){
  document.getElementById('name').value = name; 
  document.getElementById('cost').value = cost; 
  document.getElementById('categoria').value = categoria; 
  if(detalle) document.getElementById('detalle').value = detalle; 
}


//CARGAR PRODUCTO A LA NOTA 
agregarProducto.addEventListener('submit', async e=> {
    e.preventDefault();
    factura.numero = document.getElementById('nota').value.trim()
    factura.proveedor = document.getElementById('proveedor').value.trim()
    factura.pago = document.getElementById('credito-contado').value 
    factura.total = parseFloat(document.getElementById('total').value)
    factura.fecha = miFecha
   
    product.name = document.getElementById('name').value.trim()  
    product.cost = document.getElementById('cost').value
    product.CATEGORIA = document.getElementById('categoria').value.trim()
    product.stock = document.getElementById('stock').value
    product.costeo = document.getElementById('costeo').value
    product.detalle = document.getElementById('detalle').value.trim()

    productsInBill.push(product)
    factura.productos = JSON.stringify(productsInBill);
    document.getElementById('name').value = ''; 
    document.getElementById('cost').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('stock').value = ''; 
    document.getElementById('detalle').value = ''; 
    product = {}
    renderProductsInBill();
})

const renderProductsInBill = ()=> {
    const products = document.getElementById('products'); 
    products.innerHTML = `
    <div>
        <h3> Datos de la Factura </h3> 
        <p> Número de Nota: ${factura.numero} </p> 
        <p> Monto de la nota: ${factura.total} </p>
        <p> Proveedor: ${factura.proveedor} </p> 
        <p> Fecha de captura: ${miFecha} </p> 
    </div>`
    productsInBill.map(x=> {
        products.innerHTML += `
        <div class='card card-body my-2 mainCard'> 
            <p> Producto: ${x.name} <p>
            <p> Costo actual: ${x.cost} </p> 
            <p> Unidades compradas: ${x.stock} </p>
            <p> Categoria: ${x.CATEGORIA} </p>
            <b><p> Detalle: ${x.detalle}</b> </p>
            <p> Metodo de costeo aplicado: ${x.costeo} </p> 
        </div> 
        `
    })    
}

    //PRODUCTOS EN BASE DE DATOS YA 
const cargar = document.getElementById('cargar')
cargar.addEventListener('click', async()=> {        
  const oldProducts = await oldStock();   
  for(let i = 0; i < productsInBill.length; i++) {
    let productExists = false;
    for(let j = 0; j < oldProducts.length; j++) {
      if(oldProducts[j].name.trim() == productsInBill[i].name.trim()) {
        productExists = true;
        if(productsInBill[i].costeo == 'ultimocosto') {
          let stock = Number(oldProducts[j].stock) + Number(productsInBill[i].stock);
          let cost = productsInBill[i].cost;
          let categoria = productsInBill[i].CATEGORIA
          if(!categoria) categoria = oldProducts[j].CATEGORIA; 
          let detalle = productsInBill[i].detalle
          if(!detalle) categoria = oldProducts[j].detalle; 
          await updateMyProducts(oldProducts[j].name.trim(), cost, stock, categoria);
          Swal.fire(
            'Base de datos exitosamente! ',
            `Se ha actualizado ${oldProducts[j].name.trim()} al último costo ${cost} y un nuevo stock ${stock}`,
            'success'
          )
        } else {
          let stock = Number(oldProducts[j].stock) + Number(productsInBill[i].stock);
          let newcost = ((oldProducts[j].stock * oldProducts[j].cost) + (productsInBill[i].stock * productsInBill[i].cost)) / stock;
          let categoria = productsInBill[i].CATEGORIA 
          let detalle = productsInBill[i].detalle
          if(!categoria) categoria = oldProducts[j].CATEGORIA;
          if(!detalle) categoria = oldProducts[j].detalle; 
          await updateMyProducts(oldProducts[j].name.trim(), newcost, stock, categoria);
          Swal.fire(
            'Base de datos exitosamente! ',
            `Se ha actualizado ${oldProducts[j].name.trim()} al costo promedio ${newcost} y un nuevo stock ${stock}`,
            'success'
          )
        }
        break;
      }
    }
    if(!productExists) {
      let myProduct = {
        name: productsInBill[i].name, 
        cost: productsInBill[i].cost, 
        stock: productsInBill[i].stock,                        
        categoria: productsInBill[i].CATEGORIA,
        detalle: productsInBill[i].detalle
      }; 
      const result = await createProduct(myProduct);
      Swal.fire(
        'Base de datos exitosamente! ',
        `Se ha creado el producto ${myProduct.name} con un costo de ${myProduct.cost} y un stock de ${myProduct.stock}`,
        'success'
      )
    }
  }
  Swal.fire(
    'Base de datos actualizada exitosamente! ',
    'Presiona para continuar!',
    'success' 
  ).then(()=> submitFactura(factura))
 .then(()=> window.location.reload());            
});

const init = async ()=> {
 allProducts2 =  await getProducts(); 
}

init(); 

