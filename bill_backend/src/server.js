import app from "./app.js";
import config from "./config/app.config.js";

// Start Server
const startServer = () => {
    const PORT = 2000;
    app.listen(PORT, () => {
        console.log(`✅ Backend running in ${config.server.env} mode`);
        console.log(`🚀 Server available at http://localhost:${PORT}`);
    });
};

startServer();
