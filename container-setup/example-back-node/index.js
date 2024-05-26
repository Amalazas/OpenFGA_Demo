const express = require('express');
const app = express();
const port = 4000;

//TODO - connect FGA, add request time measuring
const { OpenFgaClient } = require('@openfga/sdk');

const FGA_API_URL = 'http://localhost:8080';

// // Initialize the SDK with no auth - see "How to setup SDK client" for more options
 const fgaClient = new OpenFgaClient({
   apiUrl: FGA_API_URL, // required, e.g. https://api.fga.example
   storeId: "01HYVGVBDAGCF8A8VSHEGJFVC7",//process.env.FGA_STORE_ID; hardcoded for now
   //authorizationModelId: process.env.FGA_MODEL_ID, // Optional, can be overridden per request
 });

let hits = 0;

// how many checks against FGA/not-FGA did we manage to do
let checks = 0;

let startTime = new Date();
let endTime = new Date(Date.now() + 2*60*1000);

app.get('/test', (req,res) => res.send(`hello + ${hits}`));

app.post('/testincr', (req, res) => {
    hits++;
    res.send("posted");
})

app.get('/getThingOpenFGA', (req, res) => {
    let username = req.query['username'];
    currentTime = new Date();
    
    if(currentTime > startTime && currentTime < endTime){
        //in request we pass user name, eventually other stuff - hardcoded for now
        //checking if user anne has relation can_read with testDocument

        const fgaResult = fgaClient.check({
            user: 'user:' + username,
            relation: 'owner',
            object: 'document:doc1'
        })
        if (fgaResult.allowed) {
            checks++;
        }
        
        console.log("in time window")
        res.send(`checked resource`);
    } else {
        res.send('endpoint closed - not in the time window')
    }
})

app.get('/getThing', (req, res) => {
    let username = req.query['username'];
    currentTime = new Date();
    
    if(currentTime > startTime && currentTime < endTime){
        checks++;
        res.send(`checked resource`);
    } else {
        res.send('endpoint closed - not in the time window')
    }
})

app.get('/showCheckCount', (req, res) => {
    res.send(`${checks}`)
})

app.post('/setExperimentTime', (req, res) => {
    startTime = new Date(req.query['startTime']);
    endTime = new Date(req.query['endTime']);

    //reset checks on time set - experiment was reset
    checks = 0;

    res.send(`Set experiment for ${startTime} to ${endTime}`)
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

