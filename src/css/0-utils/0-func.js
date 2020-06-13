<?
// HEX to RGB
function hexToRgb(hex) {
    hex = hex || '';
    hex = hex.toString();
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
    } : null;
};

// Darken
function cssDarken(hex, amn) {
    var rgb = hexToRgb(hex);
    var r = rgb.r - amn;
    var g = rgb.g - amn;
    var b = rgb.b - amn;
    if (r < 0) r = 0;
    if (g < 0) g = 0;
    if (b < 0) b = 0;
    if (r > 255) r = 255;
    if (g > 255) g = 255;
    if (b > 255) b = 255;
    return rgbToHex(r,g,b);
};

// Vertical gradient
function cssGradY(c1, c2) { return `
    background: ${c1};
    background: -moz-linear-gradient(top, ${c1} 0%, ${c2} 100%);
    background: -webkit-linear-gradient(top, ${c1} 0%, ${c2} 100%);
    background: linear-gradient(to bottom, ${c1} 0%, ${c2} 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(
    startColorstr='${c1}',
    endColorstr='${c2}',
    GradientType=0 );
`};

// Radial gradient
function cssGradRad(c1, c2) { return `
    background: ${c1};
    background: -moz-radial-gradient(center, ellipse cover, ${c1} 0%, ${c2} 100%);
    background: -webkit-radial-gradient(center, ellipse cover, ${c1} 0%, ${c2} 100%);
    background: radial-gradient(ellipse at center, ${c1} 0%, ${c2} 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(
    startColorstr='${c1}',
    endColorstr='${c2}',
    GradientType=1 );
`};

// Vertical gloss
function cssGlossY(c1, c2) { return `
    background: ${c1};
    background: -webkit-gradient(linear, left top, left bottom,
    from(${c1}),
    color-stop(50%, ${c1}),
    color-stop(50%, ${c2}),
    to(${c2}));
    background: linear-gradient(to bottom,
    ${c1} 0%,
    ${c1} 50%,
    ${c2} 50%,
    ${c2} 100%);
`};

// Vertical text gradient
function cssGradTxtY(c1, c2) { return `
    background: -webkit-linear-gradient(
    ${c1},${c2});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`};
?>