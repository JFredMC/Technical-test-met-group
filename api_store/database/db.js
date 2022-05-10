import mysql from 'mysql'

export const connection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: '',
    database: 'api_prueba'
})

connection.connect((err) =>{
    if(err) throw err
    console.log('La conexion a la base de datos fue exitosa!')
})

//Consulto los usuarios de la base de datos para luego usar la información
export const readUsers = () =>{
    return new Promise((resolve, reject) =>{
        const sql = 'SELECT * FROM users;'
        connection.query(sql, async (err, resul) => {
            if(err) throw err
            const usersDB = await resul
            resolve(usersDB)
        })
    })
}

//Consulto las tiendas de la base de datos para luego usar la información
export const readStores = () =>{
    return new Promise((resolve, reject) =>{
        const sql = 'SELECT * FROM stores;'
        connection.query(sql, async (err, resul) => {
            if(err) throw err
            const storesDB = await resul
            resolve(storesDB)
        })
    })
}

//Consulto los items de la base de datos para luego usar la información
export const readItems = () =>{
    return new Promise((resolve, reject) =>{
        const sql = 'SELECT * FROM items;'
        connection.query(sql, async (err, resul) => {
            if(err) throw err
            const itemsDB = await resul
            resolve(itemsDB)
        })
    })
}