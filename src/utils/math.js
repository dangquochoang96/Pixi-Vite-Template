export class randomNumber {
    static randomRange(min, max, floor = true) {
        const value = Math.random() * (max - min) + min;
        return floor ? Math.floor(value) : value;
    }

    static randomItem(arr, random = Math.random) {
        return arr[Math.floor(random() * arr.length)];
    }
}

export class moveObject {
    // Moves obj towards its current rotation at its current speed.
    static run(obj) {
        obj.x += Math.cos(obj.rotation) * obj.speed;
        obj.y += Math.sin(obj.rotation) * obj.speed;
    }
    // Like run(), but returns an object and uses an independent rotation and distance.
    static project(obj, rot, dist) {
        return {
            x: obj.x + Math.sin(rot) * dist,
            y: obj.y + Math.cos(rot) * dist,
        };
    }
}

export class rotateObject {
    // Rotates obj to point at target.
    static rotateTo(obj, target) {
        obj.rotation = Math.atan2(target.y - obj.y, target.x - obj.x);
    }
    // Gradually rotates obj to point at target using obj.turnSpeed.
    static rotateToGradual(obj, target) {
        let goal = Math.atan2(target.y - obj.y, target.x - obj.x);
        obj.rotation += Math.sin(goal - obj.rotation) * obj.turnSpeed;
    }
}

/** Get the distance between a and b points */
export function getDistance(ax, ay, bx = 0, by = 0) {
    const dx = bx - ax;
    const dy = by - ay;
    return Math.sqrt(dx * dx + dy * dy);
}

// Snaps the value x to the current increment of step. Ex: snap(144, 5) results in 145.
export function snap(x, step) {
    return Math.round(x / step) * step;
}
