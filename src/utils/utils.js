/**
 * Retrieves the value of a specified query parameter from the current URL
 * @param param - the name of the query parameter to retrieve
 * @returns the value of the specified query parameter, or null if it does not exist
 */
export function getUrlParam(param)
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    return urlParams.get(param);
}

export class removeArray {
    static removeFromArray(arr, item) {
        ~arr.indexOf(item) && arr.splice(arr.indexOf(item), 1);
        return arr;
    }

    static removeAllFromArray(arr, callback) {
        for (let i = arr.length - 1; i >= 0; --i) {
            const item = arr[i];
            callback?.(item);
            removeFromArray(arr, item);
        }
        return arr;
    }
}

/** Linear interpolation */
export function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

/** Clamp a number to minimum and maximum values */
export function clamp(v, min = 0, max = 1) {
    if (min > max) [min, max] = [max, min];
    return v < min ? min : v > max ? max : v;
}

/** Function: Rectangular hit detection */
export function AABBCollision(objA, objB) {
    if (
        objA.x < objB.x + objB.width &&
        objA.x + objA.width > objB.x &&
        objA.y + objA.height > objB.y &&
        objA.y < objB.y + objB.height
    ) {
        return true;
    } else {
        return false;
    }
}

//Description: Read/write data from local storage
export class LocalStorage {
    constructor(name) {
        this.name = name;
        this.data = {};
    }
    delete() {
        window.localStorage.removeItem(this.name);
    }
    load() {
        let data;
        if (window.localStorage) {
            data = JSON.parse(window.localStorage.getItem(this.name));
        }
        if (data) {
            this.data = data;
            return true;
        }
        return false;
    }
    save() {
        let data = JSON.stringify(this.data);
        if (window.localStorage) {
            window.localStorage.setItem(this.name, data);
        }
    }
}
