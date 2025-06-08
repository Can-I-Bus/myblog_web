export const deepClone = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    let copy = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = deepClone(obj[key]); // 递归拷贝
        }
    }
    return copy;
};

export const parseTime = (time) => {
    let format = 'y-m-d h:i:s';
    const date = new Date(time);
    const dateMap = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
    };
    Object.entries(dateMap).forEach(([key, value]) => {
        if (value < 10) {
            format = format.replace(key, `0${value}`);
        } else {
            format = format.replace(key, value);
        }
    });
    return format;
};

export const debounce = (func, delay) => {
    let timer;
    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};
