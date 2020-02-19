var psmod = require('./index');
psmod({
    dir: 'module',
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