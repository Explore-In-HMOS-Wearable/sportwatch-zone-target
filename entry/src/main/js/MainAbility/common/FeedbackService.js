import vibrator from '@system.vibrator';

export default class FeedbackService {
    vibrateForZoneChange(newZone, oldZone) {
        const mode = newZone > oldZone ? 'long' : 'short';
        vibrator.vibrate({
            mode: mode,
            success: () => {
            },
            fail: (data, code) => {
                console.error(`Vibrate fail: ${code}`);
            }
        });
    }
}