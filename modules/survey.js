
/**
 * Modoule Dependencies
 */

const Busboy                = require("busboy");
const mongo         = require("mongodb");
const ObjectID              = require('mongodb').ObjectID;


const { connBase } = require("../connections/mongo");
const mongoose = require("mongoose");

const bucket = mongoose.mongo;

const gridfs        = require("gridfs-stream" );
// const fs            = require('fs');

// const winston               = require("winston");
// const config                = require("../config/config");
// const mongoRequests         = require("../dbQueries/mongoRequests");

    // const mongoRequestsFiles    = require("../dbQueries/mongoRequestsFiles");

// const successTexts          = require("../texts/successTexts");

    // const errorTexts            = require("../texts/errorTexts");
    // const helperFunc            = require("../modules/helper");

// const userHelperFunc        = require("../modules/userHelper");
// const resourcesFunc         = require("../modules/resources");


const survey = {

    async create (req) {


        let userId = '75417854';
        const gfs = new bucket.GridFSBucket(connBase.db, { bucketName: "fs" });
        let busboy = new Busboy({ headers: req.headers,
            limits: {
                fileSize: 6 * 1024 * 1024
            } });

        return new Promise((resolve, reject) => {
            busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
                // if (!fieldname) {
                //     reject(new BadRequestException("key is empty"));
                // }
                let type = mimetype;
                if (type === "image/png" || type === "image/jpg" || type === "image/jpeg" || type === "image/pjpeg") {
                    let extension = mimetype.replace("image/", ".");

                    var writeStream = gfs.openUploadStream(userId, { contentType: type });
                    let writestreamId = writeStream.id;
                    console.log(writestreamId);


                    file.pipe(writeStream);

                    file.on("limit", function () {
                        // reject(new PayloadTooLargeException());
                    });

                    writeStream.on("error", (err) => {
                        // return reject(new BadRequestException(err));
                    });

                    // let image = process.env.HOST_IMAGES + "/resource/avatar/" + writestreamId + extension;
                    let image = "http://127.0.0.1:3006/resource/icon/" + writestreamId + extension;
                    console.log(image);
                    // writeStream.on("finish", () => {
                    //     /* Change Profile Image */
                    //     UsersModel.findOneAndUpdate(
                    //         { userId: "" + userId },
                    //         { $set: { "profile.image.value": image } }, { lean: true }, function (err) {
                    //             if (err) {
                    //                 reject(err);
                    //                 return;
                    //             }
                    //             resolve({ profile: { image } });
                    //         });
                    // });
                } else {
                    // reject(new BadRequestException("wrong format"));
                }
            });
            req.pipe(busboy);
        });














        return

        // let currentDate = Math.floor(Date.now() / 1000);
        //
        // let busboy = new Busboy({
        //     headers: req.headers,
        //     limits: {
        //         files: 1,
        //         fileSize: 2 * 1024 * 1024
        //     }
        // });
        //
        // let composeResult = null;
        // let fileStoreResult = null;
        // let fieldData = {};
        //
        // return new Promise((resolve, reject) => {
        //     busboy.on('file', async (fieldName, file, fileName, encoding, mimeType) => {
        //         let data = {
        //             file: file,
        //             filename: fileName,
        //             fieldName: fieldName,
        //             type: mimeType,
        //             fileSize: "2Mb"
        //         };
        //
        //
        //         // console.log(connBase);
        //         let gfs = gridfs(connBase, mongo);
        //
        //         // console.log(gfs);
        //         // return
        //
        //         let writeStream = await gfs.createWriteStream({filename: data.filename});
        //
        //         console.log(writeStream);
        //         return
        //
        //
        //         data.file.pipe(writeStream);
        //
        //         data.file.on('limit', function() {
        //             // console.log("File size can't be greater "+ data.fileSize);
        //         });
        //
        //         writeStream.on('error', (error) => {
        //             // console.log(error);
        //         });
        //
        //         writeStream.on('close', (file) => {
        //             // console.log('Stored File: ' + file.filename);
        //         });
        //
        //         writeStream.on('finish', (file) => {
        //             // console.log('finish File: ' + file);
        //         });
        //
        //         writeStream.on('pipe', (file) => {
        //             // console.log('pipe File: ' + file);
        //         });
        //
        //         let fileDocId = writeStream.id.toString();
        //
        //         console.log(fileDocId);
        //         return;
        //
        //
        //
        //
        //
        //         console.log(data);
        //         return
        //         fileStoreResult = await mongoRequestsFiles.storeResource(data);
        //     });
        //
        //     busboy.on('field', function (fieldName, fieldValue, truncated, valTruncated, encoding, mimeType) {
        //         fieldData[fieldName] = fieldValue;
        //     });
        //
        //     busboy.on('finish', async () => {
        //         // create and validate some data
        //         const possibleFields = {
        //             subject: {
        //                 name: "Subject",
        //                 type: "text",
        //                 minLength: 1,
        //                 maxLength: 264,
        //                 required: true
        //             },
        //             text: {
        //                 name: "Text",
        //                 type: "text",
        //                 minLength: 1,
        //                 maxLength: 2048,
        //                 required: true
        //             },
        //             conversationId: {
        //                 name: "ConversationId",
        //                 type: "text",
        //                 minLength: 24,
        //                 maxLength: 24
        //             }
        //         };
        //
        //         // check conversationId
        //         let conversationId = null;
        //         if (undefined !== fieldData.conversationId) {
        //             // check is correct mongoId
        //             if (!ObjectID.isValid(fieldData.conversationId)) {
        //                 return Promise.reject(errorTexts.mongId);
        //             }
        //
        //             // check is set message
        //             let messageDocument = await getMessageById(fieldData.conversationId);
        //             if (null === messageDocument) {
        //                 return Promise.reject({
        //                     code: 400,
        //                     status: "error",
        //                     message: "Please check conversationId and try again (conversationId not found)"
        //                 });
        //             }
        //
        //             conversationId = fieldData.conversationId;
        //
        //             // unset subject from message
        //             delete(possibleFields['subject']);
        //             delete(fieldData['subject'])
        //         }
        //
        //         let data = {
        //             body: fieldData,
        //             userInfo: req.userInfo,
        //             editableFields: possibleFields,
        //             editableFieldsValues: fieldData
        //         };
        //
        //         // try to validate data
        //         let validateError = null;
        //         await helperFunc.validateData(data)
        //             .catch(error => {
        //                 validateError = true;
        //                 return reject(error)
        //             });
        //         if (validateError) {
        //             return
        //         }
        //
        //         let messageInfo = {
        //             conversationId: conversationId,
        //             status: "Open",
        //             creatorId: data.userInfo.userId,
        //             subject: data.body.subject,
        //             text: data.body.text,
        //             createdAt: currentDate
        //         };
        //
        //         // if (fileStoreResult) {
        //         //     messageInfo.fileUrl = config[process.env.MODE].httpUrl +'/resource/'+ fileStoreResult;
        //         // }
        //         //
        //         // composeResult = await composeMessage(messageInfo);
        //         //
        //         // if (200 === composeResult.code) {
        //         //     return resolve(composeResult)
        //         // }
        //         // else {
        //         //     return reject(composeResult)
        //         // }
        //     });
        //
        //     req.pipe(busboy);
        // });

    }


};

module.exports = survey;