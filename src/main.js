const { BrowserWindow, Notification } = require('electron'); 
const { getConnection } = require('./database'); 

let window; 

async function createProduct(product){
    try {
        const conn = await getConnection();
        parseFloat(product.coast)
        const result = await conn.query('INSERT INTO products SET ?', product);
        return product; 
    } catch (error) {
        console.log(error);
    }  
}; 

async function getProducts(){
    const conn = await getConnection(); 
    const result = conn.query('SELECT * FROM products');     
    return result
}

async function submitShop(product, stock){
    const conn = await getConnection(); 
    const result = conn.query(`UPDATE products SET stock = ${stock} WHERE name = "${product}";`);     
    return result;
}

async function getTickets(){
    const conn = await getConnection(); 
    const result = conn.query('SELECT * FROM tickets');     
    return result
}

async function submitTicket(ticket){
    try {
        const conn = await getConnection(); 
        parseFloat(ticket.valor)
        const result = await conn.query('INSERT INTO tickets SET ?', ticket);
        console.log(result)
    } catch (error) {
        console.error(error)
    };
}    
    
async function submitFactura(factura){
    try {
        const conn = await getConnection(); 
        parseFloat(factura.total); 
        const result = await conn.query('INSERT INTO facturas SET ?', factura); 
        console.log(result); 
    } catch (error) {
        console.error(error)
    }
}

async function updateMyProducts(product, newprice, newstock, newcategoria, newDetalle){
    try {
        const conn = await getConnection(); 
        const cost = parseFloat(newprice);
        const result = conn.query(`UPDATE products SET stock = ${newstock}, cost = ${cost}, CATEGORIA = '${newcategoria}', detalle = '${newDetalle}' WHERE name = "${product}";`);
        console.log(result); 
    } catch (error) {
        console.error(error)
    }
}

async function getFacturas(){
    try {
        const conn = await getConnection(); 
        const result = conn.query('SELECT * FROM facturas;');
        return result;
    } catch (error) {
        console.error(error)
    }
}

async function submitPago(pago){
    try {
        const conn = await getConnection(); 
        const result = conn.query(`INSERT INTO pagos SET ?`, pago ); 
        return result; 
    } catch (error) {
        console.error(error);
    }
}

async function getDates(){
    try {
        const conn = await getConnection(); 
        const result = conn.query('select tickets.fecha from tickets;');
        return result; 
    } catch (error) {
        console.error(error)
    }
}

async function getSomeTickets(fecha){
    try {
        const conn = await getConnection(); 
        const result = conn.query(`SELECT * FROM tickets WHERE fecha ='${fecha}';`);
        return result; 
    } catch (error) {
        console.error(error)
    }
}

async function getSomeBills(fecha){
    try {
        const conn = await getConnection(); 
        const result = conn.query(`SELECT * FROM facturas WHERE fecha ='${fecha}';`);
        return result; 
    } catch (error) {
        console.error(error)
    }
}

async function getSomePagos(fecha){
    try {
        const conn = await getConnection();
        const result = conn.query(`SELECT * FROM pagos WHERE fecha ='${fecha}';`);
        return result; 
    } catch (error) {
        console.error(error)
    }
}

async function getExpiredTickets(){
    try {
        const conn = await getConnection(); 
        const result = conn.query(`SELECT * FROM tickets WHERE credito = 'si';`)
        return result; 
    } catch (error) {
        console.error(error)
    }
}

async function getMyExpiredTicket(id){
    try {
        const conn = await getConnection(); 
        const result = conn.query(`SELECT * FROM tickets WHERE id = ${id};`)
        return result; 
    } catch (error) {
        console.error(error)
    }
}

async function loadPayFromExpiredTiket(id){
    try {
        const conn = await getConnection(); 
        const result = await conn.query(`UPDATE tickets SET credito = "no" WHERE id = "${id}";`); 
        return result; 

    } catch (error) {
        console.error(error)
    }
}

async function facturasPendientes(){
    try {
        const conn = await getConnection(); 
        const result = conn.query(`SELECT * FROM tickets WHERE facturar = 'si';`)
        return result; 
    } catch (error) {
        console.error(error)
    }
}

async function loadFacturaDone(id){
    try {
        const conn = await getConnection(); 
        const result = conn.query(`UPDATE tickets SET facturar = "no" WHERE id = "${id}";`);
        return result; 
    } catch (error) {
        console.error(error)
    }
}

async function getMyProductById(id){
    try {
        const conn = await getConnection(); 
        const result = conn.query(`SELECT * FROM products WHERE ID = ${id};`)
        return result;
    } catch (error) {
        console.error(error)
    }

}

async function updateMyProductById(id, product, newprice, newstock, categoria, detalle){
    try {
        const conn = await getConnection(); 
        const cost = parseFloat(newprice);
        conn.query(`UPDATE products SET name = "${product}", stock = ${newstock}, detalle = '${detalle}', cost = ${cost}, CATEGORIA = '${categoria}' WHERE id = "${id}";`);
        //return result;
    } catch (error) {
        console.error(error)
    }
}

async function updateProductWhenYouDeleteTickets(id, stock){
    try {
        const conn = await getConnection(); 
        const result = conn.query(`UPDATE products SET stock = ${stock} WHERE id = ${id};`);
        return result;
    } catch (error) {
        console.error(error);
    }
}

async function updateMyTicketValues(id, metodoPago, factura, cliente, credito){
    try {
        const conn = await getConnection(); 
        const result = conn.query(`UPDATE tickets SET client = "${cliente}", pago = "${metodoPago}", facturar = "${factura}", credito = "${credito}" WHERE id = "${id}";`)
        return result; 
    } catch (error) {
        console.error(error);
    }
}

async function getProductByName(name){
    try {
        const conn = await getConnection(); 
        const result = conn.query(`SELECT * FROM products WHERE name = '${name}';`)
        return result; 
    } catch (error) {
        console.error(error);
    }
}

async function deleteTicket(id){
    try {
        const conn = await getConnection(); 
        const result = conn.query(`DELETE FROM tickets WHERE id = ${id};`)
        return result; 
    } catch (error) {
        console.error(error);
    }
}
const createWindow = ()=> {
    window = new BrowserWindow({
        width: 800, 
        height: 600, 
        webPreferences: {
            nodeIntegration: true, 
            enableRemoteModule: true, 
            contextIsolation: false,          
           nodeIntegrationInWorker: true,                                                 
          
        }
    })
    window.loadFile('src/ui/index.html');
    // window.setThumbarButtons([
    //     {  
    //       icon: path.join(__dirname, './img/logonegro.jpeg'),
    //       tooltip: 'button1',        
    //       click () { console.log('button1 clicked') }
    //     }]);
}

module.exports = {
    createWindow, 
    createProduct, 
    getProducts, 
    submitShop, 
    submitTicket, 
    getTickets,
    submitFactura,
    getFacturas,
    updateMyProducts,
    submitPago,
    getDates,
    getSomeTickets,
    getSomeBills,
    getSomePagos,
    getExpiredTickets,
    loadPayFromExpiredTiket,
    getMyExpiredTicket, 
    facturasPendientes,
    loadFacturaDone,
    getMyProductById,
    updateMyProductById,
    updateMyTicketValues,
    updateProductWhenYouDeleteTickets,
    getProductByName, 
    deleteTicket
}