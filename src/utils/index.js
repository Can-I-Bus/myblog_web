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
