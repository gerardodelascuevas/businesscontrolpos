const xlsx = require('xlsx')
const { getProducts } = require("../main")


const products = async()=> {
    const result = await getProducts(); 
    return result; 
}

const exportar = document.getElementById('exportar'); 
exportar.addEventListener('click', async()=> {
    let misProductos = await products()
    console.log(misProductos)
    const worksheet = xlsx.utils.json_to_sheet(misProductos); 
    const workbook = xlsx.utils.book_new(); 
    xlsx.utils.book_append_sheet(workbook, worksheet, 'inventariosFarmacia');
    
    //generate buffer
    xlsx.write(workbook, {bookType: 'xlsx', type: 'buffer'})

    //binary string 
    xlsx.write(workbook, {bookType: 'xlsx', type: 'binary'})

    xlsx.writeFile(workbook, 'inventariosFarmacia.xlsx'); 
    
    console.log('exportando inventarios')
})