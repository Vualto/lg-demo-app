// let source = "https://d4n6abhl94bwn.cloudfront.net/live/39cfafb4-8e27-4819-9aec-5e6c6dd1aba0/playready_vudrm_inline_dvb.isml/.mpd";

// encrypted
let source = "https://d4n6abhl94bwn.cloudfront.net/live/39cfafb4-8e27-4819-9aec-5e6c6dd1aba0/cenc_vudrm_inline_dvb.isml/.mpd";
let token = "vualto-demo|2019-08-16T08:54:24Z|RAQrLiTYv+Z8U9LrxO0JDw==|0bb6b957de392064df5cc8d5b34245c8fca60fd2";

// unencrypted
// let source = "https://d1chyo78gdexn4.cloudfront.net/vualto-demo/elephants-dream/elephants-dream_nodrm.ism/manifest.mpd";
// let token;

function App() {
    var launched = false;
    const launch = function (data) {
        console.log(data);
        if (launched) return;
        launched = true;
        this._videoPlayer = null;
        let container = document.getElementById("player-container");
        this._videoPlayer = new VideoElementPlayer(container, source, token);
        if (!!token) {
            console.log("take the DRM route");
            this._videoPlayer.loadDrm().then((clientId) => {
                this._videoPlayer.loadPlayer(clientId);
            });
        } else {
            console.log("take the NON DRM route");
            this._videoPlayer.loadPlayer(null);
        }
        this._remoteControlHandler = new RemoteControlHandler(this._videoPlayer);
    }

    document.addEventListener("webOSLaunch", launch);
    document.addEventListener("webOSRelaunch", launch);
}