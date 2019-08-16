function ManifestParser(url, token) {
	this._url = url;
	this._token = token;
	this._playReadyMessages;

	this._isInvalidCharacter = function (char) {
		let code = char.charCodeAt(0);
		let isUnwantedAsciiCode = code === 162;
		let isControlCode = code < 32
		return !isUnwantedAsciiCode && !isControlCode;
	}
}

ManifestParser.prototype.parsePlayReadyMessages = function (manifest) {
	return new Promise((resolve) => {
		let xml = new DOMParser().parseFromString(manifest, 'application/xml');

		let videoAdaptationSet = xml.querySelector('AdaptationSet[contentType="video"]');
		let pro = videoAdaptationSet.querySelector('pro');
		if (!pro || !pro.innerHTML) {
			console.warn("this manifest may not have been generated using inline DRM, as content sections have been found");
			return;
		}
		let decodedMessage = window.atob(pro.innerHTML);
		let message = decodedMessage.split("").filter(this._isInvalidCharacter).join("");
		message = message.substring(message.indexOf('<WRMHEADER'), message.length);
		let XMLMessage = '<?xml version="1.0" encoding="utf-8"?>'
			+ '<PlayReadyInitiator xmlns="http://schemas.microsoft.com/DRM/2007/03/protocols/">'
			+ '<LicenseAcquisition>'
			+ '<Header>' + message + '</Header>'
			+ '<SetCustomData>'
			+ '<CustomData>' + this._token + '</CustomData>'
			+ '</SetCustomData>'
			+ '</LicenseAcquisition>'
			+ '</PlayReadyInitiator>';
		resolve(XMLMessage);
	});
}

ManifestParser.prototype.parseManifest = function () {
	return fetch(this._url).then(function (response) {
		return response.text();
	}).then(function (data) {
		return data;
	});
}
