exports.pad = function (number, width) {
    width = width || 2;
    number = (number || 0).toString();
    var len = number.length;
    return len >= width ? number : new Array(width - number.length + 1).join('0') + number;
}