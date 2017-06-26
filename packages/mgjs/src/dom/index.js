export var isElement = (obj) => {
    return obj && typeof obj === 'object' && obj.hasOwnProperty('nodeType') && obj.hasOwnProperty('parentElement');
}

export var isWindow = (obj) => {
    return obj && typeof obj === 'object' && obj.window === obj;
}