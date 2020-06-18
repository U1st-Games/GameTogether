import {Express} from "express";

const accountSid = 'AC2e112f147e6283be9839c47a0cf7598d';
const authToken = '28c44ba5b932cb06e4bb97ae3282418a';
const client = require('twilio')(accountSid, authToken);

const stunTurnTokenManager = (app: Express) => {
    app.use("/stunturntoken", async (req, res) => {
        const token = await client.tokens.create();
        res.send(token);
    });
}

export default stunTurnTokenManager;
