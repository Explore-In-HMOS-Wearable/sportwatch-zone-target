export default class ZoneCalculator {
    constructor(age) {
        this.hrMax = 220 - age;
    }

    calculateZone(hr) {
        if (hr <= 0) {
            return 0;
        }
        const percent = (hr / this.hrMax) * 100;
        if (percent < 50) {
            return 0;
        } else if (percent < 60) {
            return 1;
        } else if (percent < 70) {
            return 2;
        } else if (percent < 80) {
            return 3;
        } else if (percent < 90) {
            return 4;
        }
        return 5;
    }

    static zoneColor(zone) {
        switch (zone) {
            case 1:
                return '#4a90d9';
            case 2:
                return '#5cb85c';
            case 3:
                return '#f5c518';
            case 4:
                return '#f0932b';
            case 5:
                return '#e74c3c';
            default:
                return '#888888';
        }
    }

    static zoneLabel(zone) {
        {
            switch (zone) {
                case 1:
                    return 'Zone 1 - Warm Up';
                case 2:
                    return 'Zone 2 - Fat Burn';
                case 3:
                    return 'Zone 3 - Cardio';
                case 4:
                    return 'Zone 4 - Peak';
                case 5:
                    return 'Zone 5 - Max';
                default:
                    return 'Rest';
            }
        }
    }
}