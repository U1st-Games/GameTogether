import {Express} from "express";

const accountSid = 'AC2e112f147e6283be9839c47a0cf7598d';
let client: any;
if (process.env.authToken) {
    client = require('twilio')(accountSid, process.env.authToken);
}

const stunTurnTokenManager = (app: Express) => {
    app.use("/stunturntoken", async (req, res) => {
        if(client) {
            const token = await client.tokens.create();
            res.send(token);
        } else {
            res.status(400);
            res.send('No auth token for STUN/TURN server');
        }
    });
}

export default stunTurnTokenManager;
