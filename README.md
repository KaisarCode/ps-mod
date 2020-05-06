## PSMod
Generates a WebService-oriented Prestashop module.
The CSS and JS scripts to control it will be located externally and served through a CDN.

## mod.json
Module definitions.

## lib.json
Libraries to use from KaisarCode's JSUtils.

https://github.com/KaisarCode/JSUtils.

## update.js
```node update```

Install/Update libraries.

## build.js
```node build```

Build module and external scripts.

## Compiled files
The compiled system will be located at /app folder.
- **/app/css:** Contains the external CSS file
- **/app/js:** Contains the external JS file
- **/app/mod:** Contains the module's folder and its zip