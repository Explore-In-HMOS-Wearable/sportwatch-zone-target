import router from '@system.router';
import { historyManager } from '../../common/HistoryService';

export default {
    data: {
        records: [],
        rawRecords: [],
        hasRecords: false
    },

    onShow() {
        const that = this;
        historyManager.load(function (records) {
            const list = [];
            for (let i = 0; i < records.length; i++) {
                const r = records[i];
                list.push({
                    line1: `${r.date}   ${r.durationText}`,
                    line2: `HR ${r.averageHR}   ${r.steps} st   ${r.distance} m`,
                    idx: i
                });
            }
            that.records = list;
            that.rawRecords = records;
            that.hasRecords = list.length > 0;
        });
    },

    openDetail(idx) {
        router.replace({
            uri: 'pages/detail/detail',
            params: {
                recordJson: JSON.stringify(this.rawRecords[idx])
            }
        });
    },

    goBack() {
        router.replace({ uri: 'pages/index/index' });
    }
}