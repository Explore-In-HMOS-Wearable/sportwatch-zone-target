import router from '@system.router';
import { storeManager } from '../../common/StorageService';

function buildHeights() {
    const arr = [];
    for (let h = 150; h <= 210; h++) {

        arr.push(`${h} cm`);
    }
    return arr;
}

export default {
    data: {
        heightList: buildHeights(),
        heightIndex: 20
    },

    onShow() {
        const that = this;
        storeManager.get('height', '170', function (value) {
            const h = parseInt(value);
            that.heightIndex = h - 150;
        });
        if (this.$refs.pickerViewObj) {
            this.$refs.pickerViewObj.rotation({ focus: true });
        }
    },

    onHide() {
        if (this.$refs.pickerViewObj) {
            this.$refs.pickerViewObj.rotation({ focus: false });
        }
    },

    onDestroy() {
        if (this.$refs.pickerViewObj) {
            this.$refs.pickerViewObj.rotation({ focus: false });
        }
    },

    onHeightChange(e) {
        const index = e.newSelected;
        const height = 150 + index;
        this.heightIndex = index;
        storeManager.set('height', height);
    },

    goBack() {
        router.replace({ uri: 'pages/settings/settings' });
    }
}