import {Express} from "express";

const accountSid = 'AC2e112f147e6283be9839c47a0cf7598d';
const authToken = process.env.authToken || '';
const client = require('twilio')(accountSid, authToken);

const stunTurnTokenManager = (app: Express) => {
    app.use("/stunturntoken", async (req, res) => {
        const token = await client.tokens.create();
        res.send(token);
    });
}

export default stunTurnTokenManager;
