
// const winston = require("winston");
const mongoose = require("mongoose");
mongoose.Promise = Promise;

const options = (db) => {
    const opt = {
        url: process.env[`MONGO_${db}_HOST`],
        options: {
            useNewUrlParser: process.env[`MONGO_${db}_USE_NEW_URL_PARSER`] || true,
            autoReconnect: process.env[`MONGO_${db}_AUTO_RECONNECT`] || false,
            bufferMaxEntries: parseInt(process.env[`MONGO_${db}_BUFFER_MAX_ENTRIES`] || 0),
            bufferCommands: process.env[`MONGO_${db}_BUFFER_COMMAND`] || false,
            connectTimeoutMS: parseInt(process.env[`MONGO_${db}_CONNECTION_TIMEOUT_MS`] || 30000),
            poolSize: parseInt(process.env[`MONGO_${db}_POOL_SIZE`] || 50),
            useUnifiedTopology: true
        }
    };

    if (process.env[`MONGO_${db}_REPLICA_SET`]) {
        opt.options.replicaSet = process.env[`MONGO_${db}_REPLICA_SET`];
        opt.options.readPreference = process.env[`MONGO_${db}_READ_PREFERENCE`] || "secondaryPreferred";
        opt.options.useUnifiedTopology = true;
    }

    return opt;
};

const createConnection = (conf, connection) => {
    connection = mongoose.createConnection(conf.url, conf.options);

    connection.on("disconnected", (e) => {
        console.log("error", "Reconnecting to " + conf.url);
        setTimeout(() => { createConnection(conf, connection); }, 5000);
    });

    connection.on("error", (e) => {
        console.log("error", e);
    });

    connection.on("open", () => {
        console.log("info", "Connected to " + conf.url);
    });

    return connection;
};

mongoose.connect(options("TELEGRAM").url, options("TELEGRAM").options);

mongoose.connection.on("disconnected", (e) => {
    console.log("error", "Reconnecting to " + options("TELEGRAM").url);
    setTimeout(() => {
        mongoose.connect(options("TELEGRAM").url, options("TELEGRAM").options);
    }, 5000);
});

mongoose.connection.on("open", (e) => {
    console.log("info", "Connected to " + options("TELEGRAM").url);
});

let connBase = mongoose.connection;
// let connProfile = createConnection(options("PROFILE"));

module.exports = {
    connBase,
    // connProfile,
};
