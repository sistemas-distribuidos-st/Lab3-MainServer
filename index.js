const express = require('express')
const mongoose = require('mongoose');
const { Task } = require('./models')
const app = express();
const port = 8100;

mongoose.connect('mongodb://localhost/tasklist', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

app.use(express.json())
app.post('/tasks', (req, res)=>{
    let task = new Task(req.body)
    task.save()
    .then(resp=> res.send({ok:true}))
    .catch(err=>res.send({ok:false, error:{message:'Hubo un error en la DB', dbMessage: err.message}}))
})

app.get('/tasks', (req, res)=>{
    Task.find((err, tasks)=>{
        if(err)
            res.send({ok:false, error:{message:'Hubo un error en la DB', dbMessage: err.message}})
        else
            res.send({ok:true, tasks})
    })
})

app.listen(port, ()=>{
    console.log(`Servidor encendido en localhost:${port}`)
})

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>console.log("DB conectado"));