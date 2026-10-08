import router from '@system.router';
import { wearEngineService } from '../../common/WearEngineService';

export default {
    data: {
        type: '',
        date: '',
        durationText: '',
        averageHR: 0,
        maxHR: 0,
        steps: 0,
        distance: 0,
        recordJson: '',
        sendStatus: ''
    },

    onInit() {
        if (this.recordJson) {
            const record = JSON.parse(this.recordJson);
            this.type = record.type;
            this.date = record.date;
            this.durationText = record.durationText;
            this.averageHR = record.averageHR;
            this.maxHR = record.maxHR;
            this.steps = record.steps;
            this.distance = record.distance;
        }
    },

    sendToPhone() {
        this.sendStatus = 'Sending...';
        const that = this;
        wearEngineService.send(this.recordJson, function (ok) {
            that.sendStatus = ok ? 'Sent!' : 'Failed';
        });
    },

    goBack() {
        router.replace({ uri: 'pages/history/history' });
    }
}