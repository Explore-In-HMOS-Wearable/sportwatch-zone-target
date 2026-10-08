import router from '@system.router';
import { storeManager } from '../../common/StorageService';

export default {
    data: {
        age: 30
    },

    onShow() {
        const that = this;
        storeManager.get('age', '30', function (value) {
            that.age = parseInt(value);
        });
        if (this.$refs.ageProxy) {
            this.$refs.ageProxy.rotation({ focus: true });
        }
    },

    onHide() {
        if (this.$refs.ageProxy) {
            this.$refs.ageProxy.rotation({ focus: false });
        }
    },

    onDestroy() {
        if (this.$refs.ageProxy) {
            this.$refs.ageProxy.rotation({ focus: false });
        }
    },

    handleCrown(e) {
        const newAge = e.value;
        if (newAge >= 10 && newAge <= 100) {
            this.age = newAge;
            storeManager.set('age', this.age);
        }
    },

    ageUp() {
        if (this.age < 100) {
            this.age = this.age + 1;
            storeManager.set('age', this.age);
        }
    },

    ageDown() {
        if (this.age > 10) {
            this.age = this.age - 1;
            storeManager.set('age', this.age);
        }
    },

    goBack() {
        router.replace({ uri: 'pages/settings/settings' });
    }
}