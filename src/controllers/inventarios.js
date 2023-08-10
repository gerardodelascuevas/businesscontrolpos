

const { getProducts } = require('../main'); 

let products = new Array; 

const allProducts = async ()=> {
    products = await getProducts();
    renderProducts();   
    calcularValorTotal(); 
}

let arrayValores = new Array;
let miValor = 0;

let active = false; 
const renderProducts = ()=> {
active = true; 
loader()
  let productList = document.getElementById('inventarios'); 
  productList.innerHTML = ''; 
  products.map(x=> {
    productList.innerHTML += `
    <div class="card card-body my-2" > 
    <h3> ${x.name} </h3> 

    <h3> Piezas en Inventario: ${x.stock} </h3>
    <h3> Precio de Costo --> $ ${x.cost} <h3> 
    <h3> Valor del Inventario $ ${Math.round(x.cost * x.stock)} </h3>
   
    </div> 
    `
    let valorDelProducto = x.cost * x.stock
    arrayValores.push(valorDelProducto)
  })
  active = false; 
}
const loader = ()=> {
  if(active){
    let loaderSection = document.querySelector('.loader-section');
    loaderSection.classList.add('loaded');
  }
}
const calcularValorTotal = ()=> {
  let valorTotal = document.getElementById('valorTotal');
  valorTotal.innerHTML = '';
  
  arrayValores.length > 1 ? arrayValores.map(x=> {
    miValor += x;
  }) : console.log('Hay un error en el mapeo del arreglo arrayValores')

  const valoresAgroPlan = separator(miValor)
  
  valorTotal.innerHTML +=`Valor del Inventario $ ${valoresAgroPlan}`;
}

function separator(numb) {
  var str = numb.toString().split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
}

const init = async ()=> {
  loader()
    await allProducts()
}

init();