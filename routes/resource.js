
/**
 * Module dependencies
 */

const router = require("express").Router();
// const filesFunction = require("../modules/resources");
const { streamImage } = require("../modules/gridfs/profile");

// router.get("/avatar/:id", streamImage);

router.get("/country/icon/:id", streamImage);
//
// router.get("/icon/:id", (req, res, next) => {
//     filesFunction.getIcon(req, (err, readStream, file) => {
//         if (err) return next(err);
//         res.header("Content-Type", file.contentType || file);
//         readStream.pipe(res);
//     });
// });
//
// router.get("/ads/:name", (req, res, next) => {
//     res.header("Accept-Ranges", "bytes");
//     const type = "ads";
//     filesFunction.getResourceAd(req, res, type, (err, readStream) => {
//         if (err) return next(err);
//         readStream.pipe(res);
//     });
// });
//
// router.get("/audio/:name", (req, res, next) => {
//     res.header("Accept-Ranges", "bytes");
//     const type = "audio";
//     filesFunction.getResourceAd(req, res, type, (err, readStream) => {
//         if (err) return next(err);
//         readStream.pipe(res);
//     });
// });

module.exports = router;
