exports.parse = function (text) {
    return text.split(/\n{2,}/g).map(function (block) {
        return block.split(/\n/);
    }).filter(function (entry) { return entry.length > 0; });
};