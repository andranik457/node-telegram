
const moment = require("moment");
const router = require("express").Router();
const { expressCaller } = require("../modules/helpers");
// const adSettingsFunction = require("../modules/adSettings");
// const brandedWalletFunction = require("../modules/brandedWallet");
// const adsFunction = require("../modules/ads");
// const playlistFunction = require("../modules/playlists");
// const actionListFunction = require("../modules/actionLists");
// const checkinFunction = require("../modules/checkin");
// const TrackFunction = require("../modules/preview-download");
// const CommentsFunction = require("../modules/comments");
// const LikesFunctions = require("../modules/likes");
// const { getSocialInfo } = require("../modules/socialLists");
// const winston = require("winston");
// const { addAppLog, updateDeviceToken } = require("../modules/devices");
// const { iosInAppPurchase, googlePlayInAppPurchase, getIdentifiers } = require("../modules/inAppPurchase");
// const { uploadProfileImage } = require("../modules/gridfs/profile");
// const { getReplacement } = require("../modules/tracks/common");
// const { updateCoins, getBalance } = require("../modules/balance");
// const { verifyTransfers, getTransfers } = require("../modules/payments/transfers");
// const { getDailyDrops, checkInDailyDrop } = require("../modules/dailyDrop");
// const { getNotifications } = require("../modules/notifications");
// const { mediaData } = require("../modules/mediaData");
// const { insertWishlistTrack, deleteWishlistTrack, getWishlistTracksSummary, getWishlistTracks } = require("../modules/library/wishlist/tracks");
// const { registerKinUser, getKinUserAccount, kinWhiteList } = require("../modules/kin");
// const CheckInLocations = require("../modules/checkInLocations");

/**
 * Settings API
 */

// router.get("/system/data", (req, res) => {
//     const time = new Date();
// res.json({
//     "status": "OK",
//     "result": {
//         "time": moment(time).unix(),
//         "date": moment(time).format("YYYY-MM-DD HH:mm")
//     }
// });
// });
//
// /**
//  * AdConfiguration
//  */
//
// router.get("/settings/adConfigurations", (req, res, next) => {
//     adSettingsFunction.getSettingsAd(req, (err, result) => {
//     if (err) return next(err);
// res.send(result);
// });
// });
//
// /**
//  * BrandedWallet
//  */
//
// router.get("/settings/brandedWallet", (req, res, next) => {
//     brandedWalletFunction.getBrandedWalletSettings(req, res, (err, result) => {
//     if (err) return next(err);
// res.send(result);
// });
// });
//
// /**
//  * Ads API
//  */
//
// router.get("/ads", (req, res, next) => {
//     adsFunction.getAds(req, (err, result) => {
//     if (err) return next(err);
// res.send(result);
// });
// });
// /**
//  * APIs For PlayLists
//  */
//
// router.get("/playlist/:id/total", async (req, res, next) => {
//     try {
//         res.send(await playlistFunction.getPlaylists(req));
// } catch (err) { winston.log("error", err); next(err); }
// });
//
// router.get("/playlist/:id/tracks", async (req, res, next) => {
//     try {
//         res.send(await playlistFunction.getTracks(req));
// } catch (err) { winston.log("error", err); next(err); }
// });
//
// /**
//  * APIs For Action Lists
//  */
//
// router.get("/playlist/user/:id/:type/tracks", async (req, res, next) => {
//     try {
//         res.send(await actionListFunction.getTracks(req));
// } catch (err) { winston.log("error", err); next(err); }
// });
//
// router.delete("/tracks/:trackId", async (req, res, next) => {
//     try {
//         res.send(await actionListFunction.removeDownloadTrack(req));
// } catch (err) { winston.log("error", err); next(err); }
// });
//
// router.get("/tracks/summary", async (req, res, next) => {
//     try {
//         return res.send(await actionListFunction.getTracksSummary(req));
// } catch (err) { winston.log("error", err); next(err); }
// });
//
// /**
//  * Check-in API
//  */
//
// router.post("/check-in", (req, res) => {
//     checkinFunction.addCheckin(req.headers, req.body, result => res.send(result));
// });
//
// /**
//  * Preview/Download track
//  */
//
// router.get("/tracks/7d/:id/download", (req, res) => {
//     const type = "download";
// res.redirect(TrackFunction.getAction(req, type));
// });
//
// /**
//  * Comments
//  */
//
// router.get("/comments/:id", (req, res) => {
//     CommentsFunction.get(req)
//     .then(result => res.send(result))
// .catch(err => {
//     winston.log("error", err);
// res.status(500);
// return res.json({
//     status: 1001,
//     title: "Oops!",
//     text: "Something went wrong. Please try again."
// });
// });
// });
//
// router.post("/comment/:id", (req, res) => {
//     CommentsFunction.add(req)
//     .then(result => res.send(result))
// .catch(err => {
//     winston.log("error", err);
// res.status(500);
// return res.json({
//     status: 1001,
//     title: "Oops!",
//     text: "Something went wrong. Please try again."
// });
// });
// });
//
// router.post("/like/:id", (req, res, next) => {
//     LikesFunctions.add(req)
//     .then(result => res.send(result))
// .catch(next);
// });
//
// router.put("/device/token", async (req, res, next) => {
//     try { res.send({ status: "OK", result: await updateDeviceToken(req) }); } catch (err) { winston.log("error", err); next(err); }
// });
//
// router.post("/app/log", async (req, res, next) => {
//     try { res.send({ status: "OK", result: await addAppLog(req) }); } catch (err) {
//     winston.log("error", err); next(err);
// }
// });
//
// router.delete("/like/:id", (req, res) => {
//     LikesFunctions.remove(req)
//     .then(result => res.send(result))
// .catch(err => {
//     winston.log("error", err);
// res.status(500);
// return res.json({
//     status: 1001,
//     title: "Oops!",
//     text: "Something went wrong. Please try again."
// });
// });
// });
//
// router.post("/social/list", async (req, res) => {
//     if (!req.body || !req.body.keys || !req.body.keys.length) {
//     res.status(400);
//     return res.json({
//         status: 1001,
//         title: "Oops!",
//         text: "Something went wrong. Please try again."
//     });
// }
//
// try {
//     const result = await getSocialInfo(req.user.userId, req.body.keys);
//     return res.send(result);
// } catch (err) {
//     winston.log("error", err);
//     res.status(500);
//     return res.json({
//         status: 1001,
//         title: "Oops!",
//         text: "Something went wrong. Please try again."
//     });
// }
// });
//
// router.put("/profile/image", async (req, res) => {
//     uploadProfileImage(req)
//     .then(result => res.send({ status: "OK", result: result }))
// .catch(err => {
//     winston.log("error", err);
// res.status(500);
// return res.json({
//     error: err
// });
// });
// });

// router.put("/balance/coins", async (req, res, next) => {
//     try {
//         return res.send(await updateCoins(req));
// } catch (err) {
//     next(err);
// }
// });
//
// router.get("/tracks/:id/replacement", async (req, res, next) => {
//     try {
//         const result = await getReplacement(req, res);
// return res.send(result);
// } catch (err) {
//     next(err);
// }
// });

//
// router.get("/ads/daily-drops", expressCaller(getDailyDrops));
// router.post("/ads/daily-drops/:settingKey/check-in", expressCaller(checkInDailyDrop));
// router.put("/media/data", expressCaller(mediaData));
// router.get("/coins/transfers", expressCaller(getTransfers));
// router.post("/coins/transfers/verify", expressCaller(verifyTransfers));
// router.post("/in-app-purchase/verify/app-store", expressCaller(iosInAppPurchase));
// router.get("/in-app-purchase/identifiers", expressCaller(getIdentifiers));
// router.post("/in-app-purchase/verify/google-play", expressCaller(googlePlayInAppPurchase));
// router.get("/balance", expressCaller(getBalance));
// router.get("/wishlists/tracks", expressCaller(getWishlistTracks));
// router.post("/wishlists/tracks", expressCaller(insertWishlistTrack));
// router.delete("/wishlists/tracks/:trackId", expressCaller(deleteWishlistTrack));
// router.get("/wishlists/tracks/summary", expressCaller(getWishlistTracksSummary));
// router.get("/notifications", expressCaller(getNotifications));
// router.post("/register-kin-user", expressCaller(registerKinUser));
// router.get("/get-kin-user-account", expressCaller(getKinUserAccount));
// router.post("/kin-whitelist", expressCaller(kinWhiteList));
// router.get("/checkin/locations", expressCaller(CheckInLocations.getCheckInLocations));
// router.post("/checkin/locations", expressCaller(CheckInLocations.insertCheckInLocations));

module.exports = router;
