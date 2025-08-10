const  express = require ('express')
const dotenv = require ('dotenv')
const path = require ('path')
const app = require ('./app')
const connectDatabase = require('./Config/dataBase')

dotenv.config({path:path.join(__dirname,'Config','config.env')})
connectDatabase()

app.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}`))