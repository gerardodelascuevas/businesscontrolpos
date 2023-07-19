const readXlsxFile = require('read-excel-file');  
const { createProduct } = require('../main'); 

const fileSelector = document.getElementById('file');
fileSelector.addEventListener('change', async (event) => {
  const fileList = await readXlsxFile(event.target.files[0])
  fileList.shift()
  fileList.map(async x=> {
    let product = {        
            name: x[0], 
            cost: x[1], 
            stock: x[3],            
            CATEGORIA: x[2],              
    }
    await createProduct(product)
  }).then(()=> alert('Productos Cargados Correctamente a la base de datos'))
  .catch(e=> console.error(e))
  const myList = JSON.stringify(fileList)
  console.log(myList)
  console.log(fileList);
});
