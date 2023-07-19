// import { remote } from 'electron'; 
const { remote } = require('electron'); 

// const  createProduct  = remote.main; 
const {createProduct} = require('../main'); 

let product = {
    name: '', 
    cost: 0, 
    stock: 0, 
    proveedor: '',
    categoria: ''
}; 

agregarProducto.addEventListener('submit', async e=> {
    e.preventDefault();
    product.name = document.getElementById('name').value
    product.cost = document.getElementById('cost').value
    product.stock = document.getElementById('stock').value
    product.proveedor = document.getElementById('proveedor').value    
    console.log(product); 

    product.name === '' ? alert('El Nombre del producto no puede estar vacio') : ''; 
    product.stock == 0 || '' ? alert('La compra no es válida') : ''; 

    const result = await createProduct(product); 
    return result; 
})


