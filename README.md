![ColorLab.js](assets/logo/ColorLabMasked/colorlab.masked.svg)
# ColorLab.js 
modern, lightweight JavaScript library for advanced color manipulation and conversion in web projects.

## ​🚀 Features
- Supports conversion between Hex, RGB/A, HSL/A, HSV/A, CMYK, and CSS Color Keywords.
- Smart color input normalization and validation using robust Regular Expressions.
- Includes built-in color harmony generation (e.g., complementary, triadic).
- Lightweight and designed for modern JavaScript environments (using private class fields).

## 🛠 Installation
ColorLab.js is designed as a standalone class. Simply include the file in your project.

``` HTML 
<!-- Add ColorLab.js library to your HTML document -->
<script src=".../ColorLab.js"></script>
```

``` JavaScript 
// Use in Your JavaScript file
const colorLab = new ColorLab();

```

## 📚 API Reference
new ColorLab()
Creates a new instance of the ColorLab utility.

| Property | Type | Description |
|---|---|---|
| version | string | The current version of the library. |

### 1. Color Detection and Validation
detect(input)
Detects the format of the input color string.

| Parameter | Type | Description |
|---|---|---|
| input | string | The color string (e.g., '#ff0000', 'rgb(255, 0, 0)', 'red'). |
| Returns | Type | Description |
|---|---|---|
| string | undefined | The detected format: 'keyword', 'hex', 'rgb', 'hsl', 'hsv', or 'cmyk'. Returns undefined if the format is invalid. |

Example:
``` JavaScript 
colorLab.detect('#00f');      // 'hex'
colorLab.detect('hsl(120, 100%, 50%)'); // 'hsl'
colorLab.detect('Crimson');   // 'keyword'
colorLab.detect('invalid');   // undefined
```

### 2. Color Conversion
The primary conversion method is to, which acts as a dispatcher based on the input color format.
to.<format>(input)
Converts an input color string of any supported format into the specified target format.

| Parameter | Type | Description |
|---|---|---|
| input | string | The color string in any supported format. |
| Target Format (<format>) | Returns | Description |
|---|---|---|
| hex | string | undefined |
| rgb | string | undefined |
| hsl | string | undefined |
| hsv | string | undefined |
| cmyk | string | undefined |
| keyword | string | undefined |

Example:

``` JavaScript 
const redHex = '#ff0000';

colorLab.to.rgb(redHex);       // 'rgb(255 0 0)'
colorLab.to.hsl(redHex);       // 'hsl(0deg 100% 50% / 1)'
colorLab.to.cmyk(redHex);      // 'cmyk(0% 100% 100% 0%)'
colorLab.to.keyword(redHex);   // 'Red' (or closest match)

// Converting from a different format:
const greenHsl = 'hsl(120, 100%, 50%)';

colorLab.to.hex(greenHsl);     // '#00FF00FF'
colorLab.to.rgb(greenHsl);     // 'rgb(0 255 0 / 1)'
```

### 3. Color Harmonies (Advanced)
The library has internal logic (#H) to generate color harmonies by rotating the Hue component.
While the harmony generation method is not directly exposed in the provided code snippet, based on the private structure, a potential future public method would use the following schemas:

| Harmony Name | Hue Rotations (in degrees) | Description |
|---|---|---|
| analogous | [0, 30, -30] | Colors adjacent to each other on the color wheel. |
| complementary | [0, 180] | Two colors opposite each other on the color wheel. |
| triadic | [0, 120, -120] | Three colors equally spaced around the color wheel. |
| tetradic | [0, 60, 180, 240] | Two pairs of complementary colors. |
| split-complementary | [0, 30, 180, 210] | A base color and the two colors adjacent to its complement. |
| compound | [0, 150, -150] | A combination of complementary and analogous colors. |
| square | [0, 90, -90, 180] | Four colors equally spaced around the color wheel. |
Expected Usage (Conceptual Public API):

``` JavaScript 
// NOTE: This method is inferred and may not be publicly exposed in the current version.
// colorLab.getHarmony('#4a86e8', 'triadic'); 
// => ['#4a86e8', '...', '...']

````
