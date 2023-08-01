// import { remote } from 'electron'; 
const { remote } = require('electron'); 

// const  createProduct  = remote.main; 
const {createProduct} = require('../main'); 
const { default: Swal } = require('sweetalert2');

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

    product.name === '' ? Swal.fire({
        icon: 'error',
        title: `El Nombre del producto no puede estar vacio`,
        showConfirmButton: false,
        timer: 1500
      }) : ''; 
    product.stock == 0 || '' ? Swal.fire({
        icon: 'error',
        title: `La compra no es válida`,
        showConfirmButton: false,
        timer: 1500
      }): ''; 

    const result = await createProduct(product); 
    return result; 
})


