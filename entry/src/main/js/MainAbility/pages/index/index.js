import router from '@system.router';

export default {
    goWorkout() {
        router.replace({ uri: 'pages/workout/workout' });
    },
    goHistory() {
        router.replace({ uri: 'pages/history/history' });
    },
    goSettings() {
        router.replace({ uri: 'pages/settings/settings' });
    }
};
