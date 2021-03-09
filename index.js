const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { networkInterfaces } = require('os');
const mongoose = require('mongoose');
const { Task } = require('./models')
const app = express();
const port = 8100;
const backupURL = "http://192.168.1.7:8101/backup";

axios.post('http://192.168.0.26:3000/server', getIPs())
.then(res => console.log(res))
.catch(err => console.log(err.message))

mongoose.connect('mongodb://mongo:27017/tasklist', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

app.use(cors());
app.use(express.json())
app.post('/tasks', (req, res) => {
    let task = new Task(req.body)
    task.save()
        .then(resp => res.send({ ok: true }))
        .catch(err => res.send({ ok: false, error: { message: 'Hubo un error en la DB', dbMessage: err.message } }))
})

app.get('/tasks', (req, res) => {
    Task.find((err, tasks) => {
        if (err)
            res.send({ ok: false, error: { message: 'Hubo un error en la DB', dbMessage: err.message } })
        else
            res.send({ ok: true, tasks })
    })
})

//get pedir monitoreo
app.get('/monitor', (req, res) => {
    let d = new Date()
    res.send({ time: d, ok: true })
})

app.listen(port, () => {
    console.log(`Servidor encendido en localhost:${port}`)
})

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("DB conectado")
    axios.get(backupURL)
        .then(data => {
            //data 
            //ALIMENTAR
            console.log(data)
            /*data.data.data.task.forEach(element => {
                let task = new Task(element)
                task.save()
            })*/
        })
    
    setInterval(async() => {
        let taskList = { tasks: [] };
        await Task.find((err, tasks) => {
            taskList.tasks = tasks;
        })

        axios.post(backupURL, taskList)
            .then(data => console.log(data.data))
            .catch(err => console.error(err.message))
    }, 10000)
});

function getIPs(){
    const nets = networkInterfaces();
    const results = {}

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                
                results[name].push(net.address);
            }
        }
    }

    return results.eth0;
}