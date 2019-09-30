
/**
 * Module dependencies
 */

const mongoRequests = require("../dbQueries/mongoRequests");

const resources = {

    getIcon: (req, next) => {
        mongoRequests.getIcon(req.params.id, (err, result, file) => {
            if (err) return next(err);
            if (!file.contentType) {
                file.contentType = process.env.ICON_IMAGE_DEFAULT_TYPE;
            }
            next(null, result, file);
        });
    },

    /**
     * get ads or audio binary from MongoDB
     * @param {Object} req
     * @param {Object} res
     * @param {String} type
     * @param {Function} next
     */

    getResourceAd: (req, res, type, next) => {
        const name = req.params.name;
        mongoRequests.getResourceAd(req, res, name, type, (err, result, file) => {
            if (err) return next(err);
            if (req.headers.range) {
                res.write(result);
                if (file.start >= file.end) {
                    res.end();
                }
                return;
            }
            if (file.contentType) {
                const type = file.contentType.split("/")[0];
                if (type === "video") {
                    file.contentType = process.env.VIDEO_AD_DEFULT_CONTENT_TYPE;
                }
            } else {
                file.contentType = process.env.VIDEO_AD_DEFULT_CONTENT_TYPE;
            }
            res.header("Content-Length", file.length);
            res.header("Content-Type", file.contentType || file);
            next(null, result, file);
        });
    }

};

module.exports = resources;
