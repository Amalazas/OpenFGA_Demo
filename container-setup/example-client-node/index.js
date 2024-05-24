import fetch from 'node-fetch';
import express from 'express';
const app = express();
const port = 5000;


let hits = 0;
// how many checks against FGA/not-FGA did we manage to do
let checks = 0;

let startTime = new Date();
let endTime = new Date();

app.post('/setExperimentTime', (req, res) => {
    startTime = new Date(req.query['startTime']);
    endTime = new Date(req.query['endTime']);

    //reset checks on time set - experiment was reset
    checks = 0;

    res.send(`Set experiment for ${startTime} to ${endTime}`)
})

app.get('/checks', (req, res) => {
    res.send(checks.toString());
});

app.listen(port, () => {
    console.log(`Client listening on port ${port}`);
})


function sendCheck() {
    if(Date.now() > startTime && Date.now() < endTime) {
        const res = fetch('http://localhost:4000/getThing?username=test');
        console.log(res);
        checks++;
        console.log(checks);
    }
    setTimeout(sendCheck, 1)
}

setTimeout(sendCheck, 100)
