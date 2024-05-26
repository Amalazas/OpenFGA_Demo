import fetch from 'node-fetch';
import express from 'express';
const app = express();
const port = 5000;

// how many checks against FGA/not-FGA did we manage to do
let checks = 0;

let username = "alice"
let startTime = new Date();
let endTime = new Date();
let endpoint = 'http://localhost:4000/getThingOpenFGA'

app.post('/setExperimentTime', (req, res) => {
    startTime = new Date(req.query['startTime']);
    endTime = new Date(req.query['endTime']);
    //reset checks on time set - experiment was reset
    checks = 0;
    res.send(`Set experiment for ${startTime} to ${endTime}`)
})

// server address - we might need to change it from 'http://localhost:4000/getThing' to, for example 'http://localhost:4000/getThingOpenFGA' (or another server in Go or other language)
app.post('/setExperimentEndpoint', (req, res) => {
    endpoint = req.query['endpoint']
    checks = 0;
    res.send(`Set endpoint to ${endpoint}`)
})

// we will verify against the OpenFGA model with the username - passed simply by string
app.post('/setUsername', (req, res) => {
    username = req.query['username']
    checks = 0;
    res.send(`Set username to ${username}`)
})

app.get('/checks', (req, res) => {
    res.send(checks.toString());
});

app.listen(port, () => {
    console.log(`Client listening on port ${port}`);
})


async function sendCheck() {
    if(Date.now() > startTime && Date.now() < endTime) {
        const res = await fetch(`${endpoint}?username=${username}`);
        console.log(res);
        checks++;
        console.log(checks);
    }
    setTimeout(sendCheck, 1)
}

setTimeout(sendCheck, 100)
