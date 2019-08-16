function VideoElementPlayer(parentDiv, source, token) {
    this._parentDiv = parentDiv;
    this._sourceUrl = source;
    this._token = token;
    this._clientId = null;
    this._player = null;
    this._playPending = false;
    this._msgId = null;
    this._mediaOptions = null;
    this._isDrmClientLoaded = false;
    this._manifestParser = null;
    this._message = null;

    this._createSource = function () {
        let source = document.createElement("source");
        source.src = this._sourceUrl;
        source.type = !this._mediaOptions
            ? "application/dash+xml"
            : "application/dash+xml;mediaOption=" + encodeURIComponent(JSON.stringify(this._mediaOptions));
        return source;
    }

    this.loadDrm = function () {
        return new Promise((resolve) => {
            let request = webOS.service.request("luna://com.webos.service.drm", {
                method: "load",
                parameters: {
                    drmType: "playready",
                    appId: "com.vualto.vudrm-tvos"
                },
                onSuccess: (result) => {
                    this._clientId = result.clientId;
                },
                onFailure: (result) => {
                    console.error({ result: result });
                    return;
                }
            });
            resolve();
        });
    }

    this._sendPlayReadyMessage = (message) => {
        console.log("clientID: ", this._clientId);
        request = webOS.service.request("luna://com.webos.service.drm", {
            method: "sendDrmMessage",
            parameters: {
                "clientId": this._clientId,
                "msgType": "application/vnd.ms-playready.initiator+xml",
                "msg": message,
                "drmSystemId": "9a04f079-9840-4286-ab92-e65be0885f95"
            },
            onSuccess: function (result) {
                console.log("playready response", result);
                this._msgId = result.msgId;
            },
            onFailure: function (result) {
                console.error({ result: result });
                return;
            }
        });
    }

    this._setDRMOptions = function () {
        this._mediaOptions = {};
        this._manifestParser = new ManifestParser(this._sourceUrl, this._token);
        this._manifestParser.parseManifest().then(manifest => {
            this._manifestParser.parsePlayReadyMessages(manifest).then(message => {
                this._message = message;
                this._mediaOptions.option = {};
                this._mediaOptions.option.drm = {};
                this._mediaOptions.option.drm.type = "playready";
                this._mediaOptions.option.drm.clientId = this._clientId;
            });
        });
    }

    this._playbackSuccess = function () {
        this._playPending = false;
    }

    this._playbackError = function (err) {
        console.error(err);
    }

    this._subscribeLicensingError = function () {
        var request = webOS.service.request("luna://com.webos.service.drm", {
            method: "getRightsError",
            parameters: {
                "clientId": this._clientId,
                "subscribe": true
            },
            onSuccess: (result) => { // Subscription Callback
                console.log("result", result)
                contentId = result.contentId;
                if (contentId == this._msgId) {
                    if (0 == result.errorState) {
                        console.log("No license");
                    }
                    else if (1 == result.errorState) {
                        console.log("Invalid license");
                    }
                }
            },
            onFailure: (result) => {
                console.log("[" + result.errorCode + "] " + result.errorText);
            }
        });
        //Register subscription handler
        subscriptionHandler = request;
    }
}

VideoElementPlayer.prototype.loadPlayer = function () {
    if (!!this._token) this._setDRMOptions(this._token);
    this._player = document.createElement("video");
    this._player.poster = "assets/poster.png";

    this._player.appendChild(this._createSource());
    this._parentDiv.appendChild(this._player);
    this._player.load();
}

VideoElementPlayer.prototype.play = function () {
    if (this._playPending) {
        console.info("a play request is pending try again in a few seconds");
        return;
    }

    if (!!this._token) {
        console.log("message", this._message);
        this._sendPlayReadyMessage(this._clientId, this._message);
        this._subscribeLicensingError();
    }
    this._playPending = true;
    this._player.play().then(this._playbackSuccess.bind(this), this._playbackError.bind(this));
}

VideoElementPlayer.prototype.pause = function () {
    if (this._playPending) {
        console.info("a play request is pending try again in a few seconds");
        return;
    }
    this._player.pause();
}

VideoElementPlayer.prototype.togglePause = function () {
    if (this._player.paused) {
        this.play();
    } else {
        this.pause();
    }
}