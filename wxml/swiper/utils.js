export const wait = (num = 0) => new Promise(r => setTimeout(r, num))

/** inChunk(0, 5)(9) --> 2
 inChunk(0, 5)(-1) --> 4*/
export const inChunk = (min, max) => val => {
    if (max === min) return
    if (min > max) [min, max] = [max, min]
    while (val < min) {
        val += max - min
    }
    while (val > max) {
        val -= max - min
    }
    return val
}

export const isInChunk = (curr, period, pool) => idx => {
    const end = (curr + period) % pool
    if (end > curr) {
        return idx >= curr && idx < end
    } else {
        return idx >= curr || idx < end
    }
}
