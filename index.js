const express = require('express')
const mongoose = require('mongoose')
const app = express();
const port = 8100;

app.use(express.json())

app.post('/tasks', (req, res)=>{
    res.send({ok:true})
})

app.listen(port, ()=>{
    console.log(`Servidor encendido en localhost:${port}`)
})