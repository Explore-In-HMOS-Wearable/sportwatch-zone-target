import router from '@system.router';
import { storeManager } from '../../common/StorageService';

export default {
    data: {
        age: 30,
        heightCm: 170,
        vibration: true
    },

    onShow() {
        const that = this;
        storeManager.get('age', '30', function (value) {
            that.age = parseInt(value);
        });
        storeManager.get('height', '170', function (value) {
            that.heightCm = parseInt(value);
        });
        storeManager.get('vibration', 'true', function (value) {
            that.vibration = value === 'false' ? false : true;
        });
    },

    goAge() {
        router.replace({ uri: 'pages/setting-age/setting-age' });
    },

    goHeight() {
        router.replace({ uri: 'pages/setting-height/setting-height' });
    },

    toggleVibration() {
        this.vibration = !this.vibration;
        storeManager.set('vibration', this.vibration);
    },

    goBack() {
        router.replace({ uri: 'pages/index/index' });
    }
}