# PSMod
NodeJS routine that generates a webservice-based PrestaShop module,
oriented to develop new backoffice functionalities.

# Usage
```js
var psmod = require('psmod');
psmod({
    dir: 'modules',
    name: 'mymodule',
    className: 'MyModule',
    displayName: 'My Module',
    description: 'This is my module',
    tab: 'others',
    version: '1.0.0',
    author: 'John Doe',
    email: 'john@email.com',
    copyright: '2020 John Doe',
    ext_css: '', // External CSS file
    ext_js: '',  // External JS file
    ext_ws: '',  // External Webservice
    update_interval: 86400
});
```
# Logo
After generating the module you can change its logo.png.
It will not change again after re-compile.
