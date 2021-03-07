const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const { Task } = require('./models')
const app = express();
const port = 8100;
const backupURL = "http://192.168.0.26:8101/backup";

mongoose.connect('mongodb://localhost:27017/tasklist', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

app.use(cors());
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

//get pedir monitoreo

setInterval(async ()=>{
    let taskList = { tasks:[] };
    await Task.find((err, tasks) => {
        taskList.tasks = tasks;
    })
    
    axios.post(backupURL, taskList)
    .then(data => console.log(data.data))
}, 10000)

app.listen(port, ()=>{
    console.log(`Servidor encendido en localhost:${port}`)
})

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log("DB conectado")
    axios.get(backupURL)
    .then(data=>{
        //data 
         //ALIMENTAR
    })
   
});
