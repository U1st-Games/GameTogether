import signalingServer  from "./signalingServer";
import fileServer from "./fileServer";
import initServer from "./initServer";

const { io, app } = initServer();
fileServer(app);
signalingServer(io);


