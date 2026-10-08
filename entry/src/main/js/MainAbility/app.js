import { wearEngineService } from './common/WearEngineService';
import brightness from '@system.brightness';

export default {
    onInit(){
        this.keepScreenOn();
    },
    onCreate() {
        wearEngineService.init();
        wearEngineService.setMessageHandler(function (data) {
            console.info(`Wearengine received: ${JSON.stringify(data)}`);
        });
        wearEngineService.registerReceiver();
    },

    onDestroy() {
        wearEngineService.unregisterReceiver();
    },

    keepScreenOn() {
        brightness.setKeepScreenOn({
            keepScreenOn: true,
            success: function () {
                console.info('screen on success');
            },
            fail: function () {
                console.info('screen on failed');
            }
        })
        brightness.setValue({
            value: 180,
            success: function () {
                console.info('handling set brightness success.');
            },
            fail: function (data, code) {
                console.error(`Handling set brightness value fail, code:: ${code}, result code ${data}`);

            }
        });
    }
}