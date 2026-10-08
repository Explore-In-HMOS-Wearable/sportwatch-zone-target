import { Builder, Message, P2pClient } from '../wearenginesdk/wearengine';
import { PHONE_APP_FINGERPRINT, PHONE_APP_PACKAGE_NAME } from '../constants/constants.js';

let p2pClient = new P2pClient();
let messageClient = new Message();
let builderClient = new Builder();

let onMessageCallback = null;

function ensurePeer(){
    p2pClient.setPeerPkgName(PHONE_APP_PACKAGE_NAME);
    p2pClient.setPeerFingerPrint(PHONE_APP_FINGERPRINT);
}

function init() {
    ensurePeer()
    console.info('WEAR init done')
}

function setMessageHandler(handler) {
    onMessageCallback = handler;
}

function registerReceiver() {
    ensurePeer();
    p2pClient.registerReceiver({
        onSuccess: function () {
            console.info('Wearengine receiver registered');
        },
        onFailure: function () {
            console.info('Wearengine receiver register fail');
        },
        onReceiveMessage: function (data) {
            if (onMessageCallback) {
                onMessageCallback(data);
            }
        }
    });
}

function unregisterReceiver() {
    p2pClient.unregisterReceiver({
        onSuccess: function () {
            console.info('receiver unregistered');
        }
    });
}

function sendSummary(summaryJson, callback) {
    ensurePeer();
    console.info('WEAR send attempt')
    builderClient.setDescription(summaryJson);
    messageClient.builder = builderClient;

    p2pClient.send(messageClient, {
        onSuccess: function () {
            if (callback) {
                callback(true);
            }
        },
        onFailure: function () {
            if (callback) {
                callback(false);
            }
        },
        onSendResult: function (resultCode) {
            console.info(`send result: ${resultCode.data} code: ${resultCode.code}`);
        },
        onSendProgress: function (progressNum) {
            console.info(`send progress: ${progressNum}`);
        }
    });
}

export const wearEngineService = {
    init: init,
    setMessageHandler: setMessageHandler,
    registerReceiver: registerReceiver,
    unregisterReceiver: unregisterReceiver,
    send: sendSummary
};