
/* Module dependencies */

let { connBase } = require("../connections/mongo");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* Default Schema */
const defaultSchema = new Schema({}, {
    versionKey: false,
    strict: false
});

/* Library */
const collectionsSchema = new Schema({
    userId: { type: String },
    collectionId: { type: String },
    displayName: { type: String },
    itemType: { type: String },
    type: { type: String },
    category: { type: String },
    createdAt: { type: Number },
    updatedAt: { type: Number },
    deletedAt: { type: String },
    privacy: { type: String },
    order: { type: Number },
    store: { type: String },
    items: { type: Array }
}, {
    versionKey: false
});

// Profile
const profileItemNumericSchema = new Schema({
    share: { type: String, enum: ["public", "private"] },
    value: { type: Number, default: null }
}, { versionKey: false, _id: false });

const profileItemStringSchema = new Schema({
    share: { type: String, enum: ["public", "private"] },
    value: { type: String, default: null }
}, { versionKey: false, _id: false });

const profileSchema = new Schema({
    country: profileItemStringSchema,
    language: profileItemStringSchema,
    city: profileItemStringSchema,
    region: profileItemStringSchema,
    address: profileItemStringSchema,
    postal: profileItemStringSchema,
    timezone: profileItemStringSchema,
    email: profileItemStringSchema,
    campusId: profileItemNumericSchema,
    phone: profileItemStringSchema,
    image: profileItemStringSchema,
    firstName: profileItemStringSchema,
    lastName: profileItemStringSchema,
    screenName: profileItemStringSchema,
    birthDay: profileItemStringSchema,
    birthYear: profileItemNumericSchema,
    ageMin: profileItemNumericSchema,
    ageMax: profileItemNumericSchema,
    gender: profileItemStringSchema,
    ancestry: profileItemStringSchema,
    trackDownloaded: profileItemNumericSchema,
    trackPlayed: profileItemNumericSchema,
    followers: profileItemNumericSchema,
    following: profileItemNumericSchema,
    playlists: profileItemNumericSchema
}, { versionKey: false, _id: false });

const locationSchema = new Schema({
    ip: { type: String },
    country: { type: String, default: null },
    city: { type: String, default: null },
    region: { type: String, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    timezone: { type: String, default: null },
    postal: { type: Schema.Types.Mixed, default: null },
    updatedAt: { type: String, default: null }
}, { versionKey: false, _id: false });

const deviceSchemaStructure = {
    deviceId: { type: String, required: true, default: null },
    serialNumber: { type: String, default: null },
    type: { type: String, default: null },
    brandName: { type: String, default: null },
    model: { type: String, default: null },
    os: { type: String, default: null },
    appVersion: { type: String, default: null },
    appBuildNumber: { type: Number, default: null },
    aaid: { type: String, default: null },
    idfa: { type: String, default: null },
    token: { type: Schema.Types.Mixed, default: null },
    isJailBroken: { type: Boolean, default: null },
    notificationAllowed: { type: Boolean, required: false, default: null },
    updatedAt: { type: Number, required: true, default: null },
    createdAt: { type: Number, required: false, default: null },
    appType: { type: String },
    isActive: { type: Boolean },
    loggedInAt: { type: Number },
    loggedOutAt: { type: Number }
};

const userDeviceSchema = new Schema(deviceSchemaStructure, { versionKey: false, strict: false, _id: false });
const deviceSchema = new Schema(deviceSchemaStructure, { versionKey: false, strict: false });

const balanceSchema = new Schema({
    status: { type: String, required: true, default: "active" },
    balance: { type: Number, required: true, default: 0 }
}, { versionKey: false, _id: false });

const walletsSchema = new Schema({
    coins: balanceSchema,
    diamonds: balanceSchema,
    kin: { type: balanceSchema, required: false }
}, { versionKey: false, _id: false });

const accesseSchema = new Schema({
    createdAt: { type: Number, required: true },
    expiredAt: { type: Number, required: true }
}, { versionKey: false, _id: false });
const accessesSchema = new Schema({
    vip: { type: accesseSchema, required: false },
    adFree: { type: accesseSchema, required: false }
}, { versionKey: false, _id: false });

const promoCodeInvitationsSchema = new Schema({
    inviterUserId: { type: String, required: true },
    inviteeUserId: { type: String, required: true },
    coinsCost: { type: Number, required: true },
    inviterPromoCode: { type: String, required: true },
    createdAt: { type: Number, required: true },
    coinsReceivedAt: { type: Number },
    active: { type: Boolean, required: true }
}, { versionKey: false });

const userConfigSchema = new Schema({
    isPromoCodeActive: { type: Boolean, required: false, default: true },
    isSearchable: { type: Boolean, required: false, default: true },
    isStoreOpen: { type: Boolean, required: false, default: true }
}, { versionKey: false, _id: false });

const userSchema = new Schema({
    userId: { type: String, required: true },
    useMode: { type: String, default: null },
    credentials: { type: Schema.Types.Mixed, required: true, default: {} },
    profile: profileSchema,
    location: locationSchema,
    devices: [ userDeviceSchema ],
    wallets: walletsSchema,
    accesses: accessesSchema,
    config: userConfigSchema,
    updatedAt: { type: Number, required: true },
    createdAt: { type: Number, required: true },
    deletedAt: { type: String, default: null },
    lastActiveTime: { type: Number, required: true },
    lastActiveHour: { type: Number, required: true },
    status: { type: String, enum: ["approved", "declined", "pending"] }
}, {
    minimize: false,
    versionKey: false
});

const tokenSchema = new Schema({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    transactionId: { type: Number, required: true, default: 0 },
    iat: { type: Number, required: true },
    bearer: { type: String, required: true },
    country: { type: String, default: null },
    groupId: { type: String, required: true },
    mode: { type: String, default: null }
}, {
    minimize: false,
    versionKey: false
});

const verificationSchema = new Schema({
    service: { type: String, required: true },
    account: { type: String, required: true },
    action: { type: String },
    token: { type: String, required: true },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number },
    status: { type: String, required: true }
}, {
    minimize: false,
    versionKey: false
});

const dailySignUpsSchema = new Schema({
    date: { type: String, required: true },
    groupId: { type: String, required: true },
    count: { type: Number, required: true }
}, {
    minimize: false,
    versionKey: false
});

const dailyDropActivityScheama = new Schema({
    settingId: { type: String, required: true },
    settingKey: { type: String, required: true },
    userId: { type: String, required: true },
    coins: { type: Number },
    checkedAt: { type: Number, required: true }
}, {
    minimize: false,
    versionKey: false
});

const referrersScheama = new Schema({
    userId: { type: String, required: true },
    service: { type: String, required: true },
    referrer: { type: String, required: true },
    meta: { type: Object, required: false, default: {} },
    createdAt: { type: Number, required: true }
}, {
    minimize: false,
    versionKey: false
});

const checkInLocationsScheama = new Schema({
    locationId: { type: String, required: true },
    location: { type: { type: String, default: "Point", coordinates: Array } },
    locationInfo: { type: Object, required: true },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true }
}, {
    minimize: false,
    versionKey: false
});

const kinUserScheama = new Schema({
    userId: { type: String, required: true },
    account: { type: Object, required: true, default: {} },
    response: { type: String, required: false },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true }
}, {
    minimize: false,
    versionKey: false
});

/* Mongo Models */

const TokenModel = connBase.model("Token", tokenSchema);
const AdsModel = connBase.model("Ads", defaultSchema, "offlineAdsSettings");
const AdsMainSettingsModel = connBase.model("AdsMainSettings", defaultSchema, "adsMainSettings");
const AdsFiltersSettingsModel = connBase.model("AdsFiltersSettings", defaultSchema, "adsFiltersSettings");
const AdsQueuesSettingsModel = connBase.model("AdsQueuesSettings", defaultSchema, "adsQueuesSettings");
const AdsContainersSettingsModel = connBase.model("AdsContainersSettings", defaultSchema, "adsContainersSettings");
const PlaylistsModel = connBase.model("Playlists", defaultSchema, "playlists");
const PlaylistsTracksModel = connBase.model("PlaylistsTracks", defaultSchema, "playlistsTracksRels");
const PlaylistsUsersModel = connBase.model("PlaylistsUsersRels", defaultSchema, "playlistsUsersRels");
const CampusesModel = connBase.model("Campuses", defaultSchema, "campuses");
const ActionDownloadsModel = connBase.model("audioDownloads", defaultSchema, "audioDownloads");
const ActionPlaysModel = connBase.model("audioPlays", defaultSchema, "audioPlays");
const CheckinsModel = connBase.model("Checkins", defaultSchema, "checkins");
const GroupsModel = connBase.model("Groups", defaultSchema, "groups");
const CountriesModel = connBase.model("Countries", defaultSchema, "countries");
const UsersModel = connBase.model("Users", userSchema, "users");
const CoinsTransfersModel = connBase.model("CoinsTransfers", defaultSchema, "coinsTransfers");
const FollowersModel = connBase.model("followeesFollowers", defaultSchema, "followeesFollowers");
const VerificationsModel = connBase.model("Verifications", verificationSchema, "verifications");
const TemplatesModel = connBase.model("Templates", defaultSchema, "templates");
const ListsModel = connBase.model("Lists", defaultSchema, "lists");
const ListItemsModel = connBase.model("ListItems", defaultSchema, "listItems");
const PagesModel = connBase.model("Pages", defaultSchema, "pages");
const SponsorsModel = connBase.model("SponsorsModel", defaultSchema, "sponsors");
const BrandedWalletSettingsModel = connBase.model("BrandedWalletSettings", defaultSchema, "brandedWalletSettings");
const AppResources = connBase.model("AppResources", defaultSchema, "appResources");
const DevicesModel = connBase.model("Devices", deviceSchema, "devices");
const AppSettingsModel = connBase.model("AppSettings", defaultSchema, "appSettings");
const SystemSettingsModel = connBase.model("SystemSettings", defaultSchema, "systemSettings");
const LicensorsSettingsModel = connBase.model("LicensorsSettings", defaultSchema, "licensorsSettings");
const YTRefusedLicensorsSettingsModel = connBase.model("YtRefusedLicensorsSettings", defaultSchema, "YTRefusedLicensorsSettings");
const refusedArtistsSettingsModel = connBase.model("refusedArtistsSettings", defaultSchema, "refusedArtistsSettings");
const YTRefusedArtistsSettingsModel = connBase.model("ytRefusedArtistsSettingId", defaultSchema, "YTRefusedArtistsSettings");
const CollectionsModel = connBase.model("collectionsSchema", collectionsSchema, "collections");
const AutoincrementModel = connBase.model("Autoincrement", defaultSchema, "autoincrement");
const PromoCodeInvitationsModel = connBase.model("PromoCodeInvitations", promoCodeInvitationsSchema, "promoCodeInvitations");
const DailySignUpsModel = connBase.model("DailySignUps", dailySignUpsSchema, "dailySignUps");
const NotificationsModel = connBase.model("Notifications", defaultSchema, "notifications");
const DailyDropSettingModel = connBase.model("DailyDropSettings", defaultSchema, "dailyDropSettings");
const DailyDropActivityModel = connBase.model("DailyDropActivities", dailyDropActivityScheama, "dailyDropActivities");
const ReferrersModel = connBase.model("Referrers", referrersScheama, "referrers");
const CheckInLocationsModel = connBase.model("checkInLocations", checkInLocationsScheama, "checkInLocations");
const kinUsersModel = connBase.model("KinUsers", kinUserScheama, "kinUsers");

module.exports = {
    TokenModel,
    AdsModel,
    AdsMainSettingsModel,
    AdsFiltersSettingsModel,
    AdsQueuesSettingsModel,
    AdsContainersSettingsModel,
    PlaylistsModel,
    PlaylistsTracksModel,
    CampusesModel,
    ActionDownloadsModel,
    ActionPlaysModel,
    CheckinsModel,
    GroupsModel,
    AppSettingsModel,
    SystemSettingsModel,
    LicensorsSettingsModel,
    YTRefusedLicensorsSettingsModel,
    refusedArtistsSettingsModel,
    YTRefusedArtistsSettingsModel,
    PlaylistsUsersModel,
    CountriesModel,
    UsersModel,
    CoinsTransfersModel,
    FollowersModel,
    VerificationsModel,
    TemplatesModel,
    ListsModel,
    ListItemsModel,
    PagesModel,
    SponsorsModel,
    BrandedWalletSettingsModel,
    AppResources,
    DevicesModel,
    CollectionsModel,
    AutoincrementModel,
    PromoCodeInvitationsModel,
    DailySignUpsModel,
    NotificationsModel,
    DailyDropSettingModel,
    DailyDropActivityModel,
    ReferrersModel,
    CheckInLocationsModel,
    kinUsersModel
};
