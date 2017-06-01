# Reference

### Tools
*   [ESLint](http://eslint.org/) checks our source code for potential errors. We use AirBnB's [awesome eslint config](https://www.npmjs.com/package/eslint-config-airbnb) to help us follow best practices.
*   [Webpack](http://webpack.github.io/) is used for bundling / compiling.
*   [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html) provides our development environment.
*   [Babel](https://babeljs.io/) is used for compiling javascript.
*   [React](https://facebook.github.io/react) is used to write UI components.
*   [Mobx](https://mobxjs.github.io/mobx/) helps us manage state.
*   [Stylus](http://stylus-lang.com/) allows us to write better CSS.
*   [Leaflet](http://leafletjs.com/) is used for mapping.
*   [Onsen](http://onsen.io/v2/) provides mobile UI components with a native look and feel.

### Cordova plugins
The following cordova plugins are installed
* cordova-plugin-background-mode 0.7.2 "BackgroundMode"
* cordova-plugin-compat 1.1.0 "Compat"
* cordova-plugin-device 1.1.5 "Device"
* cordova-plugin-geolocation 2.4.1 "Geolocation"
* cordova-plugin-statusbar 2.2.0 "StatusBar"
* cordova-plugin-whitelist 1.3.0 "Whitelist"

### CouchDB setup
*   [Uncomplicated Firewall](https://help.ubuntu.com/community/UFW)
*   [Installing CouchDB 2.0 with HTTPS / SSL For Free](https://medium.com/@silverbackdan/installing-couchdb-2-0-nosql-with-centos-7-and-certbot-lets-encrypt-f412198c3051)
*   [Add systemd Startup Script For CouchDB](https://www.jamescoyle.net/how-to/2527-add-systemd-startup-script-for-couchdb)
*   [Apache as a proxy](https://cwiki.apache.org/confluence/display/COUCHDB/Apache+as+a+proxy)
*   [How To Install CouchDB and Futon on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-install-couchdb-and-futon-on-ubuntu-14-04)

### Quirks
* **geolocation**

    Geolocation in the browser via WiFi can be quirky and take some time.

### Known issues


### Other troubleshooting
* **npm permissions**

    If you see an error message in terminal about npm permissions, it can likely be fixed via the instructions here: [fixing-npm-permission](https://docs.npmjs.com/getting-started/fixing-npm-permissions)

    TL;DR version:
    ````bash
    $ sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
