import express, { request, response } from 'express'
import dotenv from 'dotenv'
import {SignJWT, jwtVerify} from 'jose'
import { connection, readUsers, readStores, readItems } from './database/db.js'

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.text())

//Registrar un usuario
app.post('/register', (request, response) =>{
    const user = request.body;
    if(user.name && user.username && user.password){
        const sql = 'INSERT INTO users(name, username, password) VALUES ?'
        const values = [[user.name, user.username, user.password]]
        connection.query(sql,[values], (err, resul) =>{
            if(err) throw err
            response.status(200).json({
                message: 'User created succesfully!'
            })
        })
    }else{
        response.status(400).json({
            message: 'missing attributes'})
    } 
})

//Consultar usuarios de la base de datos
app.get('/users', async (request, response) => {
    const usersDb = await readUsers()
    if(usersDb){
        const sql = 'SELECT * FROM users'
        connection.query(sql, (err, resul) => {
            if(err) throw err
            response.status(200).json({
                users: resul
            })
        })
    }else{
        response.status(200).json({
            message:'Connection failed'
        })
    }
    
    
})

//Consultar usuario por id
app.get('/users/:id', async (request, response) =>{
    const userId = request.params.id
    const userDb = await readUsers()

    const user = userDb.find(userNameElement => userNameElement.id === Number(userId))

    if(user){
        response.status(200).json({
            id: user.id,
            name: user.name,
            username: user.username,
            password: user.password
        })
    }else{
        response.status(404).json({
            message: 'Store name not register!'
        })
    }    
})

//Actualizar los datos de un usuario
app.put('/users/:id', async (request, response) => {
    const userId = request.params.id
    const userName = request.body.name
    const userUserName = request.body.username
    const userPassword = request.body.password
    const usersDb = await readUsers()

    const checkusersId = usersDb.find(usersElement => usersElement.id === Number(userId))

    if(checkusersId){
        const sql = 'UPDATE users SET name = ?, username = ?, password = ? WHERE id = ?'
        connection.query(sql, [userName, userUserName, userPassword, userId], (err, resul) => {
            if(err) throw err
            response.status(200).json({
                name: userName,
                username: userUserName,
                password: userPassword,
                message: 'User updated successfully',
            })
        })  
    }else{
        response.status(400).json({
            message: 'Error'
        })
    }  
})

//Eliminar un usuario
app.delete('/users/:id', async (request, response) =>{
    const userId = request.params.id
    const userDb = await readStores()
    const checkuserId = userDb.map(userElement => userElement.id).includes(Number(userId))

    if(checkuserId){
        const sql = 'DELETE FROM users WHERE id = ?'
        const values = [[ userId ]]

        connection.query(sql, [values], (err, resul) => {
            if(err) throw err
            response.status(200).json({
                message: 'User deleted'
            })
        })
    }else{
        response.status(400).json({
            message: 'User not found'
        })
    }  
})

//Loguear un usuario
app.post('/auth', async (request, response) =>{
    const user = request.body
    //Almeceno en una variable los usuarios registrados en la base de datos
    const userDb = await readUsers()

    //Recorro el array con los datos de los usuarios para comparar si uno de los nombres de usuario de la base de datos coincide con el enviado en el body
    const username = userDb.map(usernameElement => usernameElement.username).includes(user.username)
    
    //Recorro el array con los datos de los usuarios para comparar si la contraseña coincide con la enviado en el body
    const password = userDb.map(usernameElement => Number(usernameElement.password)).includes(user.password)                
    
    //Aqui valido que el nombre de usuario y la contraseña sean true para proceder a generar el token
    if(username === true && password === true){
        //Capturo el id del usuario que se intenta loguear
    const userId = userDb.map(usernameElement => usernameElement.id)

    //Generar token y devolver el token
    const jwtConstructor = new SignJWT({ userId })
    
    const encoder = new TextEncoder()
    const jwt = await jwtConstructor
    .setProtectedHeader({alg: 'HS256', type: 'JWT'})
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(encoder.encode(process.env.JWT_PRIVATE_KEY))
        response.status(200).send({
            message: "successful login!",
            access_token: jwt
        })
    }else{
        response.status(401).json({
            message: "Username and/or password do not exist"
        })
    }  
})

//Crear una nueva tienda
app.post('/store/:name', async (request, response) => {
    const store = request.params.name
    const storesDb = await readStores()
    const storesDbName = storesDb.map(storeNameElement => storeNameElement.name).includes(store)
    if(storesDbName){
        response.status(400).json({
            message:'Store name already registered'})
    }else{
        const sql = 'INSERT INTO stores (name, items) VALUES ?'
        const values = [[ store, '' ]]
        connection.query(sql, [values], async (err, resul) => {
            if(err) throw err   
            const storesName = await readStores()
            const idStore = storesName.find(storeName => storeName.name === store)
           response.status(200).json({
                id: idStore.id,
                name: idStore.name,
                items: []
           })           
        })
    }    
})

//Consultar una tienda por parametro
app.get('/store/:name', async (request, response) =>{
    const storeName = request.params.name
    const storeDb = await readStores()

    const store = storeDb.find(storeNameElement => storeNameElement.name === storeName)

    if(store){
        response.status(200).json({
            id: store.id,
            name: store.name,
            items: []
        })
    }else{
        response.status(404).json({
            message: 'Store name not register!'
        })
    }    
})

//Consultar todas las tiendas
app.get('/stores', async (request, response) => {
    const storesDb = await readStores()
    if(storesDb){
        const sql = 'SELECT * FROM stores'
        connection.query(sql, (err, resul) => {
            if(err) throw err
            response.status(200).json({
                stores: storesDb
            })
        })
    }else{
        response.status(400).json({
            message: 'Connection failed'
        })
    }
})

//Actualizar los datos de una tienda
app.put('/store/:name', async (request, response) => {
    const storeName = request.params.name
    const storeBodyName = request.body.name
    const storeBodyPrice = request.body.price
    const storesDb = await readItems()

    const checkNameIncDb = storessDb.map(storesElement => storesElement.name).includes(storeName)
    const checkItemsId = storessDb.find(storesElement => storesElement.name === storeName)
    const storesId = checkItemsId.id

    if(checkNameIncDb){
        const sql = 'UPDATE stores SET name = ?, item = ? WHERE id = ?'
        connection.query(sql, [storeBodyName, storeBodyPrice, storesId], (err, resul) => {
            if(err) throw err
            response.status(200).json({
                name: storeBodyName,
                price: storeBodyPrice,
                store_id: storesId,
                message: 'Store updated successfully',
            })
        })  
    }else{
        response.status(400).json({
            message: 'Error'
        })
    }  
})


//Eliminar una tienda
app.delete('/store/:name', async (request, response) =>{
    const store = request.params.name
    const storeDb = await readStores()
    const storeName = storeDb.map(storeNameElement => storeNameElement.name).includes(store)

    if(storeName){
        const sql = 'DELETE FROM stores WHERE name = ?'
        const values = [[ store ]]

        connection.query(sql, [values], (err, resul) => {
            if(err) throw err
            response.status(200).json({
                message: 'Store deleted'
            })
        })
    }else{
        response.status(400).json({
            message: 'Store not found'
        })
    }  
})

//Crear un item
app.post('/item/:name', async (request, response) => {
    const idStore = Number(request.body.store_id)
    const nameItem = request.params.name
    const priceItem = request.body.price

    const storesDb = await readStores()
    
    const checkIdIncStoreDb = storesDb.map(storeElement => storeElement.id).includes(idStore)

    if(checkIdIncStoreDb){
        const sql = 'INSERT INTO items(name, price, store_id) VALUES ?'
        const values = [[ nameItem, priceItem, idStore  ]]
        console.log(values)
        connection.query(sql, [values], async (err, result) => {
            if(err)throw err
            const itemsDb = await readItems()
            const checkItemDb = itemsDb.find(itemsElement => itemsElement.name === nameItem)
            console.log(checkItemDb)
            response.status(200).json({
                item: checkItemDb
            })
        })    
    }else{
        response.status(400).json({
            message: 'The ID does not have a store assigned'
        })
    }
})

//Consultar un item por su parametro name
app.get('/item/:name', async (request, response) =>{
    const authorization = request.headers.authorization
    const nameItem = request.params.name
    console.log(nameItem)
    const itemsDb = await readItems()

    const checkNameFilDb = itemsDb.filter(itemsElement => itemsElement.name === nameItem)
    
    if(!authorization){
        return response.status(401).json({
            message: 'Unauthorized'
        })
    }else{
        try {
            const encoder = new TextEncoder()
            const jwtData = await jwtVerify(authorization, encoder.encode(process.env.JWT_PRIVATE_KEY))

                response.status(200).json({
                    items: checkNameFilDb
                })
        } catch (error) {
            return response.status(401).json({
                message: 'Unauthorized'
            })
        }
    }

    
})

//Consultar todos loa items
app.get('/items', async (request, response) => {
    const itemsDb = await readItems()
    const sql = 'SELECT * FROM'
    connection.query(sql, (err, resul) =>{
        response.status(200).json({
            items: itemsDb
        })
    })
})


//Actualizar los datos de un item
app.put('/item/:name', async (request, response) => {
    const itemName = request.params.name
    const itemBodyName = request.body.name
    const itemBodyPrice = request.body.price
    const itemsDb = await readItems()

    const checkNameIncDb = itemsDb.map(itemsElement => itemsElement.name).includes(itemName)
    const checkItemsId = itemsDb.find(itemsElement => itemsElement.name === itemName)
    const itemsId = checkItemsId.id

    if(checkNameIncDb){
        const sql = 'UPDATE items SET name = ?, price = ? WHERE id = ?'
        connection.query(sql, [itemBodyName, itemBodyPrice, itemsId], (err, resul) => {
            if(err) throw err
            response.status(200).json({
                name: itemBodyName,
                price: itemBodyPrice,
                store_id: itemsId,
                message: 'Item updated successfully',
            })
        })  
    }else{
        response.status(400).json({
            message: 'Error'
        })
    }  
})

//Eliminar un item
app.delete('/item/:name', async (request, response) => {
    const item = request.params.name
    const itemDb = await readItems()
    const itemName = itemDb.map(storeNameElement => storeNameElement.name).includes(item)

    if(itemName){
        const sql = 'DELETE FROM items WHERE name = ?'
        const values = [[ item ]]

        connection.query(sql, [values], (err, resul) => {
            if(err) throw err
            response.status(200).json({
                message: 'Item deleted'
            })
        })
    }else{
        response.status(400).json({
            message: 'Item not found'
        })
    }  
})

app.listen(PORT, () => {
    console.log(`Servidor inicializado en el puerto ${PORT}`)
})