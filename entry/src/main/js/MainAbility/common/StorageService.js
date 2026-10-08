import storage from '@system.storage';

function getValue(key, defaultValue, callback) {
    storage.get({
        key: key,
        success: function (data) {
            const value = data || defaultValue;
            callback(value);
        },
        fail: function () {
            callback(defaultValue);
        }
    });
}

function setValue(key, value) {
    storage.set({
        key: key,
        value: String(value),
        success: function () {
        },
        fail: function (data, code) {
            console.error(`setValue fail: ${code}`);
        }
    });
}

export const storeManager = {
    get: getValue,
    set: setValue
}