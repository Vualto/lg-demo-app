# VUDRM TVOS

## Description

This repository will demonstrate how to use [VUDRM](https://vudrm.vualto.com/) with [TVOS](http://webostv.developer.lge.com/).
If you have any questions please contact support@vualto.com

This repository is currently targeted at TVOS version 4.0

## Instructions

### Install dependencies

1. Follow developement environment setup steps on the [LG-TVOS](http://webostv.developer.lge.com/) site.
2. Clone the repository: `git clone git@github.com:Vualto/vudrm-tvos.git`
3. Use the tools built into the TVOS IDE to package and install the app on the emulator (non-DRM) local TV (DRM)

## Mandatory conditions

- to use DRM you will need to use MPEG-DASH with inline PlayReady thi is due to the need to construct the playready message to the `luna://com.webos.service.drm`, in order to do this you will need to decrypt the message from within the manifest, an example of how to do this can be found within the Manifest Parser.

## Useful links

### VUDRM

- [Contact vualto](https://www.vualto.com/contact-us/)
- [VUDRM](https://vudrm.vualto.com/)
- [VUDRM token documentation](https://docs.vualto.com/projects/vudrm/en/latest/VUDRM-token.html)

### mpeg-DASH

- [MPEG-DASH](https://en.wikipedia.org/wiki/Dynamic_Adaptive_Streaming_over_HTTP)
- [What is MPEG-DASH](https://www.streamingmedia.com/Articles/Editorial/What-Is-.../What-is-MPEG-DASH-79041.aspx)

### HLS

- [Apple's developer resources on HLS](https://developer.apple.com/streaming/)
- [HLS wikipedia](https://en.wikipedia.org/wiki/HTTP_Live_Streaming)
- [What is HLS?](<https://www.streamingmedia.com/Articles/Editorial/What-Is-.../What-is-HLS-(HTTP-Live-Streaming)-78221.aspx>)

### Encrypted media extensions

- [Encrypted media extensions specification](https://www.w3.org/TR/2016/CR-encrypted-media-20160705/)
- [Encrypted media extensions wikipedia](https://en.wikipedia.org/wiki/Encrypted_Media_Extensions)
- [Encrypted media extensions on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Encrypted_Media_Extensions_API)
- [Intro to encrypted media extensions](https://www.html5rocks.com/en/tutorials/eme/basics/)

### Build tools

- [npm](https://www.npmjs.com/)
- [grunt](https://gruntjs.com/)
