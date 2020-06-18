import signalingServer  from "./signalingServer";
import fileServer from "./fileServer";
import initServer from "./initServer";
import opentokSessionMananger from "./opentokSessionManager";
import stunTurnTokenManager from "./stunTurnTokenManager";

const { io, app } = initServer();
stunTurnTokenManager(app);
opentokSessionMananger(app);
fileServer(app);
signalingServer(io);
