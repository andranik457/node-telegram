// const { BadRequestException, PayloadTooLargeException, NotFoundException } = require("../error/index");
// const { UsersModel } = require("../../models/defaults");
const mongoose = require("mongoose");
const Busboy = require("busboy");
// const _ = require("lodash");
const streamBuffers = require("stream-buffers");
const bucket = mongoose.mongo;
// const { connProfile } = require("../../connections/mongo");
// const { isEmptyArray } = require("../helpers");

const { connBase } = require("../../connections/mongo");

/**
 * Upload Profile ImageByBinary
 * @param {Object} req
 */

const uploadProfileImageByBinary = (req) => {
    let body = req.body;
    let userId = req.user.userId;

    let type = req.headers["content-type"];
    let extension = type.replace("image/", ".");
    const gfs = new bucket.GridFSBucket(connProfile.db, { bucketName: "fs" });

    return new Promise((resolve, reject) => {
        if (type === "image/png" || type === "image/jpg" || type === "image/jpeg" || type === "image/pjpeg") {
            let bufer = new Buffer(body, "binary");
            if (_.isEmpty(bufer)) {
                reject(new BadRequestException("empty data"));
            }
            var writeStream = gfs.openUploadStream(userId, { contentType: type });
            let writestreamId = writeStream.id;

            let readStream = new streamBuffers.ReadableStreamBuffer({
                chunkSize: bufer.length
            });

            readStream.push(bufer);
            readStream.push(null); // Push null to end readStream
            readStream.pipe(writeStream);

            writeStream.on("error", (err) => {
                reject(new BadRequestException(err));
            });
            let image = process.env.HOST_IMAGES + "/resource/avatar/" + writestreamId + extension;
            writeStream.on("finish", () => {
                /* Change Profile Image */
                UsersModel.findOneAndUpdate(
                    { userId: "" + userId },
                    { $set: { "profile.image.value": image } }, { lean: true }, function (err) {
                        if (err) {
                            reject(new BadRequestException(err));
                            return;
                        }
                        resolve({ profile: { image } });
                    });
            });
        } else {
            reject(new BadRequestException("wrong format"));
        }
    });
};

/**
 * Upload Profile ImageByFormData
 * @param {Object} req
 */

const uploadProfileImageByFormData = (req) => {
    let userId = req.user.userId;
    const gfs = new bucket.GridFSBucket(connProfile.db, { bucketName: "fs" });
    let busboy = new Busboy({ headers: req.headers,
        limits: {
            fileSize: 6 * 1024 * 1024
        } });
    return new Promise((resolve, reject) => {
        busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
            if (!fieldname) {
                reject(new BadRequestException("key is empty"));
            }
            let type = mimetype;
            if (type === "image/png" || type === "image/jpg" || type === "image/jpeg" || type === "image/pjpeg") {
                let extension = mimetype.replace("image/", ".");

                var writeStream = gfs.openUploadStream(userId, { contentType: type });
                let writestreamId = writeStream.id;

                file.pipe(writeStream);

                file.on("limit", function () {
                    reject(new PayloadTooLargeException());
                });

                writeStream.on("error", (err) => {
                    return reject(new BadRequestException(err));
                });

                let image = process.env.HOST_IMAGES + "/resource/avatar/" + writestreamId + extension;

                writeStream.on("finish", () => {
                        /* Change Profile Image */
                    UsersModel.findOneAndUpdate(
                            { userId: "" + userId },
                            { $set: { "profile.image.value": image } }, { lean: true }, function (err) {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                resolve({ profile: { image } });
                            });
                });
            } else {
                reject(new BadRequestException("wrong format"));
            }
        });
        req.pipe(busboy);
    });
};

/**
 * Get Default Avatar From ms-db2/profile
 * @param {Object} gfs
 * @param {Object} res
 * @param {Function} next
 */
const getDefaultImage = (gfs, res, next) => {
    let id = "5d921bad0552d4089ce1bc13";
    let defaultStream = gfs.openDownloadStream(mongoose.Types.ObjectId(id));

    defaultStream.on("end", () => {
        defaultStream = null;
        gfs = null;
    }).pipe(res);

    defaultStream.on("error", (err) => {
        defaultStream = null;
        gfs = null;
        next(new NotFoundException(err.message));
    });
};

module.exports = {

    /**
     * Get Image By Id From ms-db2/profile
     * @param {String} req
     * @param {Object} res
     * @param {Function} next
     */

    streamImage: (req, res, next) => {

        let gfs = new bucket.GridFSBucket(connBase.db, { bucketName: "fs" });
        return getDefaultImage(gfs, res, next);
        return;

        // const id = req.params.id.split(".")[0];
        // let gfs = new bucket.GridFSBucket(connBase.db, { bucketName: "fs" });

        let data = null;
        try {
            data = gfs.find({ _id: mongoose.Types.ObjectId(id) });
        } catch (e) {
            return next(new BadRequestException("invalid profile image id"));
        }

        if (!data) {
            return getDefaultImage(gfs, res, next);
        }
        data.toArray((err, docs) => {
            if (err || isEmptyArray(docs)) {
                return getDefaultImage(gfs, res, next);
            }
            res.header("Content-Type", docs && docs[0] && docs[0].contentType ? docs[0].contentType : process.env.PROFILE_IMAGE_DEFAULT_TYPE);

            let downloadStream = gfs.openDownloadStream(mongoose.Types.ObjectId(id));

            downloadStream.on("error", () => {
                getDefaultImage(gfs, res, next);
            });
            downloadStream.on("data", (chunk) => {
                // On Stream
                // console.log( chunk.length )
            }).pipe(res);
            downloadStream.on("end", function () {
                docs = null;
                gfs = null;
                downloadStream = null;
                res.send();
            });
        });
    },

    /**
     * Upload Profile Image
     * @param {Object} req
     */

    uploadProfileImage (req) {
        return new Promise((resolve, reject) => {
            let content = parseInt(req.headers["content-length"]);

            if (!content) {
                reject(new BadRequestException("empty data"));
            } else if (req.headers["content-type"].match(/image/)) {
                return resolve(uploadProfileImageByBinary(req));
            } else if (req.headers["content-type"].match(/multipart\/form-data/)) {
                return resolve(uploadProfileImageByFormData(req));
            } else {
                reject(new BadRequestException("wrong format"));
            }
        });
    }

};
