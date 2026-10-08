import router from '@system.router'
import sensor from '@system.sensor'
import ZoneCalculator from '../../common/ZoneCalculator'
import FeedbackService from '../../common/FeedbackService'
import { storeManager } from '../../common/StorageService'
import { historyManager } from '../../common/HistoryService'
import { distanceUtil } from '../../common/DistanceUtil'

export default {
    data: {
        heartRate: 0,
        zone: 0,
        zoneLabel: 'Rest',
        zoneColor: '#888888',
        listening: false,
        stepBaseline: -1,
        steps: 0,
        running: false,
        elapsed: 0,
        distance: 0,
        heightCm: 170,
        elapsedText: '00:00',
        calculator: null,
        timer: null,
        feedback: null,
        showZoneAlert: false,
        alertText: '',
        vibrationEnabled: true,
        maxHR: 0,
        hrSum: 0,
        hrCount: 0
    },

    onInit() {
        this.feedback = new FeedbackService();
        this.loadSettings();
    },

    onShow() {
        this.loadSettings();
        this.startSensors();
    },
    onHide() {
        this.stopWorkout();
        this.stopSensors();
    },
    onDestroy() {
        this.stopWorkout();
        this.stopSensors();
    },

    loadSettings() {
        const that = this;
        storeManager.get('age', '30', function (value) {
            that.calculator = new ZoneCalculator(parseInt(value));
        });
        storeManager.get('vibration', 'true', function (value) {
            that.vibrationEnabled = value === 'false' ? false : true;
        });
        storeManager.get('height', '170', function (value) {
            that.heightCm = parseInt(value)
        });
    },

    startSensors() {
        if (this.listening) {
            return;
        }
        this.listening = true;
        this.stepBaseline = -1;
        sensor.subscribeHeartRate({
            success: (ret) => {
                const hr = ret.heartRate;
                this.heartRate = hr;
                if (!this.calculator) {
                    return;
                }
                const z = this.calculator.calculateZone(hr);
                if (z !== this.zone) {
                    this.onZoneChange(z, this.zone);
                }
                this.zone = z;
                this.zoneLabel = ZoneCalculator.zoneLabel(z);
                this.zoneColor = ZoneCalculator.zoneColor(z);
                if (this.running && hr > 0) {
                    if (hr > this.maxHR) {
                        this.maxHR = hr;
                    }
                    this.hrSum = this.hrSum + hr;
                    this.hrCount = this.hrCount + 1;
                }
            },
            fail: (data, code) => {
                console.error(`HR fail: ${code}`);
            }
        });

        sensor.subscribeStepCounter({
            success: (ret) => {
                const total = ret.steps;
                if (this.stepBaseline < 0) {
                    this.stepBaseline = total;
                }
                this.steps = total - this.stepBaseline;
                this.distance = distanceUtil.fromSteps(this.steps, this.heightCm);
            },
            fail: (data, code) => {
                console.error(`Step fail: ${code}`);
            }
        });
    },

    onZoneChange(newZone, oldZone) {
        if (!this.running) {
            return;
        }
        if (this.vibrationEnabled) {
            this.feedback.vibrateForZoneChange(newZone, oldZone);
        }
        this.alertText = ZoneCalculator.zoneLabel(newZone);
        this.showZoneAlert = true;
        setTimeout(() => {
            this.showZoneAlert = false;
        }, 1500);
    },

    startWorkout() {
        if (this.running) {
            return;
        }
        this.running = true;
        this.elapsed = 0;
        this.elapsedText = '00:00';
        this.stepBaseline = -1;
        this.steps = 0;
        this.distance = 0;
        this.maxHR = 0;
        this.hrSum = 0;
        this.hrCount = 0;

        this.timer = setInterval(() => {
            this.elapsed = this.elapsed + 1;
            this.elapsedText = this.formatTime(this.elapsed);
        }, 1000);
    },

    stopWorkout() {
        if (!this.running) {
            return;
        }
        this.running = false;
        if (this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.saveRecord();
    },

    saveRecord() {
        if (this.elapsed < 1) {
            return;
        }
        const avg = this.hrCount > 0 ? Math.round(this.hrSum / this.hrCount) : 0;
        const now = new Date();
        const record = {
            date: `${now.getMonth() + 1}/${now.getDate()}`,
            durationText: this.formatTime(this.elapsed),
            averageHR: avg,
            maxHR: this.maxHR,
            steps: this.steps,
            distance: this.distance
        };
        historyManager.save(record, null);
    },

    formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        const mm = m < 10 ? `0${m}` : `${m}`;
        const ss = s < 10 ? `0${s}` : `${s}`;
        return `${mm}:${ss}`;
    },

    toggleWorkout() {
        if (this.running) {
            this.stopWorkout();
        } else {
            this.startWorkout();
        }
    },

    stopSensors() {
        if (this.listening) {
            sensor.unsubscribeHeartRate();
            sensor.unsubscribeStepCounter();
            this.listening = false;
        }
    },
    goBack() {
        this.stopWorkout();
        this.stopSensors();
        router.replace({ uri: 'pages/index/index' });
    }

}