var nativeTrim = String.prototype.trim,
    nativeTrimLeft = String.prototype.trimLeft,
    nativeTrimRight = String.prototype.nativeTrimRight,
    space = '[' + '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
        '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF' + ']',
    ltrim = RegExp('^' + space + space + '*'),
    rtrim = RegExp(space + space + '*$');

var coreTrim = (() => {
    nativeTrimLeft = nativeTrimLeft ? nativeTrimLeft : function () {
        return this.replace(ltrim, '');
    };
    nativeTrimRight = nativeTrimRight ? nativeTrimRight : function () {
        return this.replace(rtrim, '');
    };
    return (str, type) => {
        str = str + "";
        if (type & 1) str = nativeTrimLeft.call(str);
        if (type & 2) str = nativeTrimRight.call(str);
        return str;
    }
})();
export var trim = (str) => {
    return coreTrim(str, 3);
}

export var trimLeft = (str) => {
    return coreTrim(str, 1);
}

export var trimRight = (str) => {
    return coreTrim(str, 2);
}