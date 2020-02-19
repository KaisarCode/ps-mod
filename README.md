# PrestaShop Webservice Module
NodeJS routine that generates a webservice-based PrestaShop module,
oriented to develop new backoffice functionalities.

# Install
```npm install -s presta-wsmod```

# Usage
```js
var wsmod = require('presta-wsmod');
wsmod({
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
    ext_css: '',
    ext_js: '',
    ext_ws: '',
    update_interval: 86400
});
```
# Logo
After generating the module you can change its logo.png.
It will not change again after re-compile.
