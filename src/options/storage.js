import browser from 'webextension-polyfill';
import _ from 'lodash';
import { reactive } from 'vue';
import { getAllMaps } from '../maps.js';

export const storage = browser.storage;
const storageArea = storage.sync || storage.local;

const mapNames = _.map(getAllMaps(), 'name');
const mapChecks = _.map(getAllMaps(), function (map){
	if ('default_check' in map) {
		return map['default_check'];
	} else {
		return false;
	};
});

const enabledMaps = reactive(_.zipObject(mapNames, mapChecks));
const preferences = reactive({
	'alwaysOpenInNewTab': false,
});

init();

export { init,
    enabledMaps as observableEnabledMaps,
    preferences as observablePreferences,
    setMapEnabled,
    setPreference
};

function init() {
    storageArea.get('enabledMaps').then((stored) => {
      _.assign(enabledMaps, stored.enabledMaps);
    });
    storageArea.get('preferences').then((stored) => {
      _.assign(preferences, stored.preferences);
    });
  storageArea.onChanged.addListener(onChanged);
}

function setMapEnabled(map, enabled) {
  enabledMaps[map.name] = enabled;
  storageArea.set({enabledMaps});
}
function setPreference(item, preference) {
	preferences[item] = preference;
	storageArea.set({preferences});
}

function onChanged(changes) {
  _.assign(enabledMaps, changes.enabledMaps.newValue);
  _.assign(preferences, changes.preferences.newValue);
}
