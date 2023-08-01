const { default: Swal } = require('sweetalert2');
const {getMyProductById, updateMyProductById, getProducts} = require('../main')

const buscar = document.getElementById('buscar');
const miid = document.querySelector('#id'); 
let id;

let allProducts = new Array; 

async function getMyProducts(){
    allProducts = await getProducts(); 
}

//se debe mandar a llamar renderProduct con el ID del producto a renderizar 
const nombreBuscado = document.getElementById('nombre'); 
nombreBuscado.addEventListener('change', (e)=> {
    console.log(e.target.value)
    // let MiProducto = allProducts.filter(x=> x.name.toLowerCase().trim().includes(e.target.value))[0]
    // console.log('prod ', MiProducto)
    autocompleteProduct(e.target.value)
   // renderProduct(MiProducto.id); 
})

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
      suggestionsContainer.innerHTML += `<option class='selectPozolov' onclick="fillInputs('${product.name}', ${product.id})"> ${product.name} </option>`
      suggestionsContainer.appendChild(suggestion);
    });
  }
  
  function findMatchingProducts(inputValue) {
    let matchedProducts = [];
    if(inputValue){
      matchedProducts = allProducts.filter(x=> x.name.toLowerCase().trim().includes(inputValue))
      if(matchedProducts.length > 5) matchedProducts = matchedProducts.slice(0,4);  
     } else {
      matchedProducts = [];
     }
    return matchedProducts;
  }
  
  //Rellenar datos de los Inputs en base a sugerencia Pozolezca:
  
  function fillInputs(name, id){    
    renderProduct(id);
  }

const container = document.getElementById('container');

const renderProduct = async(id)=> {   
    container.innerHTML = ''
    let product = await getMyProductById(id)
    product = product[0]
    console.log(product)
    if(product){
        container.innerHTML = `
        <div class = 'card'> 
            <span> Producto: ${product.name}</span>
            <span> Costo: $ ${product.cost}</span>
            <span> Cantidad en Inventario: ${product.stock}</span>
            <span> Categoria: ${product.CATEGORIA} </span>
            <span> Detalle para producto especial: ${product.detalle} </span>
            </div>
            <b><p> A continuación puedes Modificar los valores editando los inputs y guardando los cambios: </p></b>
            <div class = 'card'> 
                <input placeholder = 'Actualizar Nombre' id='nuevoNombre' value='${product.name}'/>
                <input placeholder = 'Actualizar Costo' type='number' id='nuevoCosto' value='${product.cost}'/>
                <input placeholder = 'Actualizar Stock' type='number' id='nuevoStock' value='${product.stock}'/>
                <input placeholder = 'Actualizar Categoria' id='nuevaCategoria' value ='${product.CATEGORIA}' />
                <input placeholder = 'Actualizar detalle' id='nuevoDetalle' value = '${product.detalle}' />
            </div>

            <input id='password' placeholder = 'Contraseña de administrador' type = 'password' />
            <button class='btn btn-primary' onclick='saveChanges(${product.id})'> Guardar Cambios </button>
        `
    } else {
        container.innerHTML = `
        <div class = 'card'> 
            <h3> Producto no encontrado en la base de datos </h3>
        </div>
        `
    }
}

const password = 'rpolozov123'; 

const saveChanges = async(id)=> {
    let nuevoNombre = document.getElementById('nuevoNombre').value
    let nuevoCosto = document.getElementById('nuevoCosto').value
    let nuevoStock = document.getElementById('nuevoStock').value
    let contraseña = document.getElementById('password').value
    let categoria = document.getElementById('nuevaCategoria').value
    categoria = categoria.trim().toLowerCase();
    let detalle = document.getElementById('nuevoDetalle').value

    if(id && nuevoNombre && nuevoCosto && nuevoStock && password === contraseña){
        Swal.fire({
            icon: 'success',
            title: `Éxito!`,
            showConfirmButton: false,
            timer: 1500
          })
        try {          
            if(detalle === 'null' || detalle == 'undefined'){
                await updateMyProductById(id, nuevoNombre, nuevoCosto, nuevoStock, categoria);
                Swal.fire({
                    icon: 'success',
                    title: `La base de datos se ha actualizado con éxito!`,
                    showConfirmButton: false,
                    timer: 1500
                  }).then(()=> setTimeout(window.location.reload(), 1000))
              
            } else {
                 await updateMyProductById(id, nuevoNombre, nuevoCosto, nuevoStock, categoria, detalle); 
                 wal.fire({
                    icon: 'success',
                    title: `La base de datos se ha actualizado con éxito!`,
                    showConfirmButton: false,
                    timer: 1500
                  }).then(()=> setTimeout(window.location.reload(), 1000))                
            }
           

        } catch (error) {
            console.error(error)
        }
        
    } else {
        return Swal.fire({
            icon: 'error',
            title: `Algo ha fallado, por favor revisa los datos del producto y tus credenciales`,
            showConfirmButton: false,
            timer: 1500
          })
    }
}


const init = ()=> {
    getMyProducts()
    // renderSearching()
} 

init();



