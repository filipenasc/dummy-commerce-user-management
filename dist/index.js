"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT) || 8080;
app.use((0, cors_1.default)({
    origin: '*'
}));
mongoose_1.default.connect(process.env.MONGODB_CONNECTION);
// Middleware to parse JSON body
app.use(express_1.default.json());
app.use(routes_1.router);
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
//# sourceMappingURL=index.js.map