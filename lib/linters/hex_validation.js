'use strict';

var path = require('path');

module.exports = function (options) {
    var filename = path.basename(options.path);
    var config = options.config;
    var node = options.node;
    var color;
    var value;

    // Bail if the linter isn't wanted
    if (!config.hexValidation || (config.hexValidation && !config.hexValidation.enabled)) {
        return null;
    }

    // Not applicable, bail
    if (node.type !== 'declaration') {
        return null;
    }

    node.forEach('value', function (element) {
        value = element.first('color');
    });

    // No colors found, bail
    if (!value) {
        return null;
    }

    color = '#' + value.content;
    if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color)) {
        return {
            column: value.start.column,
            file: filename,
            line: value.start.line,
            linter: 'hexValidation',
            message: 'Hexadecimal color "' + color + '" should be either three or six characters long.'
        };
    }

    return true;
};