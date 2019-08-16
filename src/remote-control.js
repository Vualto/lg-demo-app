function RemoteControlHandler(videoPlayer) {
    this._videoPlayer = videoPlayer;
    document.addEventListener("keydown", this._handleKeyDown.bind(this));
}

RemoteControlHandler.prototype._handleKeyDown = function (keyDownEvent) {
    let keyCode;
    if (typeof keyDownEvent === "undefined" || keyDownEvent == null) return;
    keyCode = keyDownEvent.keyCode;
    if (keyCode === 0) return;
    switch (keyCode) {
        case 13:
            this._videoPlayer.togglePause();
            break;
        case 415:
            this._videoPlayer.play();
            break;
        case 19:
            this._videoPlayer.pause();
            break;
        default:
            console.log(keyCode);

    }
}