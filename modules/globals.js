
const mongoose = require("mongoose");
const { connBase } = require("../connections/mongo");
const {
    AppSettingsModel,
    SystemSettingsModel,
    LicensorsSettingsModel,
    YTRefusedArtistsSettingsModel,
    YTRefusedLicensorsSettingsModel,
    refusedArtistsSettingsModel,
    CountriesModel,
    GroupsModel
} = require("../models/defaults");

let countriesSettings = {};
let groupsSettings = {};
let globalSettings = {};

async function getCountries (force = false) {
    if (!force && globalSettings.countries) {
        return globalSettings.countries;
    }
    let list = await CountriesModel.find({ enabledStatus: true }, {
        _id: true,
        name: true,
        displayName: true,
        mainCountry: true,
        groupId: true,
        store: true
    }, {
        lean: true
    });

    return (globalSettings.countries = list);
}

async function getGroups (force = false) {
    if (!force && globalSettings.groups) {
        return globalSettings.groups;
    }
    let list = await GroupsModel.find({}, {
        _id: true,
        settings: true,
        countryId: true,
        pages: true
    }, {
        lean: true
    });
    return globalSettings.groups = list;
}

async function getAppSettings (force = false) {
    if (!force && globalSettings.appSettings) {
        return globalSettings.appSettings;
    }
    let list = await AppSettingsModel.find({}, {
        _id: true,
        settings: true,
        name: true
    }, {
        lean: true
    });
    return globalSettings.appSettings = list;
}

async function getSystemSettings (force = false) {
    if (!force && globalSettings.systemSettings) {
        return globalSettings.systemSettings;
    }
    let list = await SystemSettingsModel.find({}, {
        _id: true,
        settings: true,
        name: true
    }, {
        lean: true
    });
    return globalSettings.systemSettings = list;
}

async function getLicensorsSettings (force = false) {
    if (!force && globalSettings.licensorsSetting) {
        return globalSettings.licensorsSetting;
    }
    let list = await LicensorsSettingsModel.find({
    }, {
        _id: true,
        settings: true
    }, {
        lean: true
    });
    list.forEach(item => {
        let _settings = {};
        let keys = Object.keys(item.settings);
        keys.forEach((key) => {
            if (item.settings[key].value) {
                _settings[ key ] = item.settings[key];
            }
        });
        item.settings = _settings;
    });
    return globalSettings.licensorsSetting = list;
}

async function getYtRefusedLicensorsSettings (force = false) {
    if (!force && globalSettings.ytRefusedLicensorsSetting) {
        return globalSettings.ytRefusedLicensorsSetting;
    }
    let list = await YTRefusedLicensorsSettingsModel.find({
    }, {
        _id: true,
        settings: true
    }, {
        lean: true
    });
    list.forEach(item => {
        let _settings = {};
        let keys = Object.keys(item.settings);
        keys.forEach((key, value) => {
            if (item.settings[key].value) {
                _settings[ key ] = item.settings[key];
            }
        });
        item.settings = _settings;
    });
    return (globalSettings.ytRefusedLicensorsSetting = list);
}

async function getRefusedArtistsSettings (force = false) {
    if (!force && globalSettings.refusedArtistsSetting) {
        return globalSettings.refusedArtistsSetting;
    }
    let list = await refusedArtistsSettingsModel.find({}, {
        _id: true,
        artists: true
    }, {
        lean: true
    });
    list.forEach(item => {
        let _artists = {};
        if (item.artists) {
            let keys = Object.keys(item.artists);
            keys.forEach((key, value) => {
                _artists[key] = value;
            });
        }
        item.artists = _artists;
    });
    return (globalSettings.refusedArtistsSetting = list);
}

async function getYtRefusedArtistsSettings (force = false) {
    if (!force && globalSettings.ytRefusedArtistsSetting) {
        return globalSettings.ytRefusedArtistsSetting;
    }
    let list = await YTRefusedArtistsSettingsModel.find({}, {
        _id: true,
        artists: true
    }, {
        lean: true
    });

    list.forEach(item => {
        let _artists = {};
        if (item.artists) {
            let keys = Object.keys(item.artists);
            keys.forEach((key, value) => {
                _artists[key] = value;
            });
        }
        item.artists = _artists;
    });
    globalSettings.ytRefusedArtistsSetting = list;
    return globalSettings.ytRefusedArtistsSetting;
}

function getGroupsSettings (groupId = null) {
    return groupId ? groupsSettings[groupId] : groupsSettings;
}

function getCountriesSettings (countryCode = null) {
    return countryCode ? countriesSettings[countryCode] : countriesSettings;
}

async function setGroupsSettings () {
    let groups = await getGroups();
    let appSettings = await getAppSettings();
    let systemSettings = await getSystemSettings();
    let licensorSettings = await getLicensorsSettings();
    let ytRefusedLicensorsSettings = await getYtRefusedLicensorsSettings();
    let refusedArtistsSettings = await getRefusedArtistsSettings();
    let ytRefusedArtistsSettings = await getYtRefusedArtistsSettings();

    let _i = (group, key) => group.settings[key]
        ? { _id: mongoose.Types.ObjectId(group.settings[key]) }
        : null;

    groups.forEach(group => {
        groupsSettings[ group._id.toString() ] = {
            _id: group._id,
            settings: {
                appSetting: appSettings.find(i => i._id.toString() === group.settings.appSettingId),
                systemSetting: systemSettings.find(i => i._id.toString() === group.settings.systemSettingId),
                licensorSetting: licensorSettings.find(i => i._id.toString() === group.settings.licensorsSettingId),
                ytRefusedLicensorsSetting: ytRefusedLicensorsSettings.find(i => i._id.toString() === group.settings.ytRefusedLicensorsSettingId),
                refusedArtistsSetting: refusedArtistsSettings.find(i => i._id.toString() === group.settings.refusedArtistsSettingId),
                ytRefusedArtistsSetting: ytRefusedArtistsSettings.find(i => i._id.toString() === group.settings.ytRefusedArtistsSettingId),
                blockedRoutesSetting: _i(group, "blockedRoutesSettingId"),
                offlineAdsSetting: _i(group, "offlineAdsSettingId"),
                adQueueSetting_iOS: _i(group, "adQueueSetting_iOS"),
                adQueueSetting_Android: _i(group, "adQueueSetting_Android"),
                adMainSetting_iOS: _i(group, "adMainSetting_iOS"),
                adMainSetting_Android: _i(group, "adMainSetting_Android"),
                adFilterSetting_iOS: _i(group, "adFilterSetting_iOS"),
                adFilterSetting_Android: _i(group, "adFilterSetting_Android"),
                adContainerSetting_iOS: _i(group, "adContainerSetting_iOS"),
                adContainerSetting_Android: _i(group, "adContainerSetting_Android"),
                refusedTracksSetting: _i(group, "refusedTracksSettingId"),
                brandedWalletSetting: _i(group, "brandedWalletSettingId"),
                dailyDropSetting: _i(group, "dailyDropSettingId")
            },
            pages: group.pages
        };
    });
    return groupsSettings;
}

async function setCountriesSettings () {
    let groupSettings_ = getGroupsSettings();
    let countries = await getCountries();
    countries.forEach(country => {
        let displayName = country.name;
        countriesSettings[ displayName ] = country;
        countriesSettings[ displayName ].groups = {};

        country.groupId.forEach(groupId => {
            countriesSettings[displayName].groups[groupId] = groupSettings_[groupId];
            if (groupSettings_[groupId]) {
                groupSettings_[groupId].country = country;
            }
        });
    });

    countries.forEach(country => {
        if (country.mainCountry) {
            country.mainCountry = countriesSettings[country.mainCountry.name];
        }
    });
    return countriesSettings;
}

async function forceUpdate () {
    await Promise.all([
        getCountries(true),
        getGroups(true),
        getAppSettings(true),
        getSystemSettings(true),
        getLicensorsSettings(true),
        getYtRefusedLicensorsSettings(true),
        getRefusedArtistsSettings(true),
        getYtRefusedArtistsSettings(true),
        setGroupsSettings()
    ]);
    await setCountriesSettings();
}

setInterval(async () => {
    await forceUpdate();
}, 60000 * 5);

connBase.on("connected", async () => {
    await forceUpdate();
});

module.exports = {
    getCountries,
    getGroups,
    getAppSettings,
    getSystemSettings,
    getLicensorsSettings,
    getYtRefusedLicensorsSettings,
    getRefusedArtistsSettings,
    getYtRefusedArtistsSettings,
    getGroupsSettings,
    getCountriesSettings
};
