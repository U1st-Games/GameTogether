import signalingServer  from "./signalingServer";
import fileServer from "./fileServer";
import initServer from "./initServer";
import opentokSessionMananger from "./opentokSessionManager";

const { io, app } = initServer();
opentokSessionMananger(app);
fileServer(app);
signalingServer(io);


