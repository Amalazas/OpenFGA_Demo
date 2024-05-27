import { addSeconds } from 'date-fns';
import express from 'express';
import axios from 'axios';

const app = express();
const port = 6000;

const collectingEndpoints = ['http://localhost:4000/showCheckCount', 'http://localhost:5000/checks']

const schedulingEndpoints = ['http://localhost:4000/setExperimentTime', 'http://localhost:5000/setExperimentTime'];

app.get('/collectResults', async (req, res) => {
    
    try {
        const promises = collectingEndpoints.map(endpoint => {
            return axios.get(endpoint, {}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        });

        const results = await Promise.all(promises);
        const responseStr = results.map(response => response.data).reduce((prev, current) => (prev + ' ' + current),'');
        res.send(responseStr);
    } catch (error) {
        console.error('Error collecting results:', error);
        res.status(500).send('Error scheduling tests');
    }
})


app.post('/scheduleTest', async (req, res) => {
    const startOffset = parseInt(req.query['startOffset'], 10);
    const endOffset = parseInt(req.query['endOffset'], 10);
    
    if (endOffset <= startOffset) {
        console.error('endOffset cannot be less than or equal to startOffset');
        return res.status(400).send('endOffset cannot be less than or equal to startOffset');
    }

    const now = new Date();

    const startTime = addSeconds(now, startOffset);
    const endTime = addSeconds(now, endOffset);

    const startTimeISO = startTime.toISOString();
    const endTimeISO = endTime.toISOString();
    
    try {
        const promises = schedulingEndpoints.map(endpoint => {
            const url = `${endpoint}?startTime=${startTimeISO}&endTime=${endTimeISO}`;
            return axios.post(url, {}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        });

        await Promise.all(promises);
        res.send('All tests scheduled successfully');
        setTimeout(() => {console.log('safe to collect results');}, (endOffset+2)*1000);
    } catch (error) {
        console.error('Error scheduling tests:', error);
        res.status(500).send('Error scheduling tests');
    }
});

app.listen(port, () => {
    console.log(`Test orchestrator listening on port ${port}`);
})
