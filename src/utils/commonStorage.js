// https://github.com/null-none/react-localstorage
export default {
	isBrowser: () => typeof (window) !== 'undefined',

	set: function (key, value) {
		localStorage[key] = value;
		return localStorage[key];
	},
	get: function (key, defaultValue = undefined, silent = true) {
		var value = this.isBrowser() ? (localStorage.hasOwnProperty(key) ? localStorage[key] : defaultValue) : null;

		// if silent=false throw error
		if (!silent && !value)
			throw key + " not found in localStorage";

		return value;
	},
	setObject: function (key, value) {
		localStorage[key] = JSON.stringify(value);
		return localStorage[key];
	},
	getObject: function (key, defaultValue = {}, silent = true) {
		const value = this.get(key, JSON.stringify(defaultValue), silent);

		try {
			return JSON.parse(value);
		} catch (e) {
			// will raise error for parsing
			if (!silent)
				throw 'Error in parsing value'
		}
	},
	clear: function () {
		return localStorage.clear();
	},
	remove: function (key) {
		return localStorage.removeItem(key);
	},
};
