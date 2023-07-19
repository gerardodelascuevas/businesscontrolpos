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
    let MiProducto = allProducts.filter(x=> x.name.toLowerCase().trim().includes(e.target.value))[0]
    console.log('prod ', MiProducto)
    renderProduct(MiProducto.id); 
})

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
        alert('Exito')
        try {          
            if(detalle === 'null' || detalle == 'undefined'){
                await updateMyProductById(id, nuevoNombre, nuevoCosto, nuevoStock, categoria);
                alert('La base de datos se ha actualizado con éxito')
                setTimeout(window.location.reload(), 3000)
            } else {
                 await updateMyProductById(id, nuevoNombre, nuevoCosto, nuevoStock, categoria, detalle); 
                 alert('La base de datos se ha actualizado con éxito')
                 setTimeout(window.location.reload(), 3000)
            }
           

        } catch (error) {
            console.error(error)
        }
        
    } else {
        alert('Algo ha fallado, por favor revisa los datos del producto y tus credenciales')
    }
}


const init = ()=> {
    getMyProducts()
    // renderSearching()
} 

init();



