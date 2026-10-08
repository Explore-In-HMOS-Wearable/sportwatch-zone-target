import file from '@system.file';

const FILE_PATH = 'internal://app/workouts.json'

function loadWorkouts(callback) {
    file.readText({
        uri: FILE_PATH,
        success: function (data) {
            try {
                const records = JSON.parse(data.text);
                callback(records)
            } catch (e) {
                callback([]);
            }
        },
        fail: function () {
            callback([]);
        }
    });
}

function saveWorkout(record, callback) {
    loadWorkouts(function (records) {
        records.unshift(record);
        file.writeText({
            uri: FILE_PATH,
            text: JSON.stringify(records),
            success: function () {
                if (callback) {
                    callback(true);
                }
            },
            fail: function (data, code) {
                console.error(`Failed to save workout: ${code}`);
                if (callback) {
                    callback(false)
                }
            }
        });
    });
}

export const historyManager = {
    load: loadWorkouts,
    save: saveWorkout
};