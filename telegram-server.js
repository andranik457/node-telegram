
/**
 * Module Dependencies
 */

const app = require("express")();
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const logger = require("morgan");
// const winston = require("winston");
// const globals = require("./modules/globals");
const bodyParser = require("body-parser");
const expressJwt = require("express-jwt");
// const abClean = require("./middleware/abClean");
const auth = require("./middleware/auth");
const makeLowerCase = require("./modules/helpers").makeReqVariablesLowercase;



// const routes = require("./routes/routes");
// const mix = require("./routes/mix");
// const resource = require("./routes/resource");
const api = require("./routes/api");
// const playlists = require("./routes/playlists");
// const users = require("./routes/users");
// const authRouter = require("./routes/auth");

// const { parseAcceptLanguage } = require("./middleware/language");
// require("./events/listeners/index");

/* Express middleware */
// app.use(parseAcceptLanguage({ acceptLanguageCodes: ["en", "es"] }));
app.use("/api", expressJwt({ secret: process.env.JWT_SECRET }));
app.use(bodyParser.urlencoded({ extended: false, type: "application/x-www-form-urlencoded" }));
app.use(bodyParser.text({ type: "application/x-www-form-urlencoded", limit: "6mb" }));
app.use(bodyParser.raw({ type: "image/*", limit: "6mb" }));
app.use(bodyParser.json({
    type: function (v) {
        if (v.headers["content-type"]) {
            if (v.headers["content-type"].match(/multipart\/form-data/)) {
                return false;
            }
        }
        return true;
    },
    limit: "6mb"
}));

app.use(logger("dev"));
app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        if (req.headers["access-control-request-headers"]) {
            res.header("Access-Control-Allow-Headers", req.headers["access-control-request-headers"]);
        }
        return res.send();
    }
    next();
});

app.use((req, res, next) => {
    const os = req.headers["app-os"] && req.headers["app-os"].match(/android/i) ? "Android" : "iOS";
    const bn = req.headers["app-build-number"] && !isNaN(req.headers["app-build-number"]) ? parseInt(req.headers["app-build-number"]) : 0;
    req.device = { os, bn, is: (i) => os.toLowerCase() === i.toLowerCase() };
    next();
});

// app.use("/", abClean);
// app.use("/api", auth.userAuth);
// app.use("/mix", auth.freeAuth);
// app.use("/mix/search", makeLowerCase);
// app.use("/api/playlist", makeLowerCase);
// app.use("/api/users", makeLowerCase);
//
// /* Routes */
// app.use("/api", api);
// app.use("/api/users", users);
// app.use("/mix", mix);
// app.use("/resource", resource);
// app.use("/api/v1/playlists", playlists);
// app.use("/auth", authRouter);
// app.use("/", routes);

/* Production Error Handler */
app.use((err, req, res, next) => {
    let log = err;
if (err.status === 401) { log = `401: ${err.message || "Unauthorized error"} : ${req.originalUrl}`; }
if (err.status === 404) { log = `404: ${err.message || "Not Found"} ${req.originalUrl}`; }
console.log("error", log);

res.status(err.status || 500);
if (err.content) {
    return res.json({ error: err.content || {} });
}
if (err.code && err.code.toString() === "11000") {
    return res.status(409).json({ message: "duplicate key error, please be sure you sent request once at a time", error: {} });
}
res.json({ message: err.message, error: {} });
});

/* Application Listening On PORT */
app.listen(process.env.SERVER_PORT, process.env.SERVER_HOSTNAME,
    console.log("info", `Node.js server is running at http://${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT} 
    in ${process.env.NODE_ENV} mode with process id ${process.pid}`)
);

/* Checking Uncaught Exceptions */
process.on("uncaughtException", err => {
    console.log("error", (new Date()).toUTCString() + " uncaughtException:", err.message);
console.log("error", err.stack);
process.exit(1);
});
