#  Ethoinformatics App

A mobile GPS web application framework designed to enable the collection of flexible data structures in an offline environment. 

Using simple schema files, users can easily define data relationships and hierarchies for both the frontend application and backend data storage. The application can be deployed to either an Android or iOS device.

## About Ethoinformatics
**Ethology** is the study of animal behavior.

**Informatics** is the application of computational methods for collecting, managing, and analyzing data.

**Ethoinformatics** is the application of informatic techniques for animal behavior research. While this term has been coined elsewhere, its usage has so far been infrequent and inconsistent. We advocate wider use of the term in recognition of the increasing complexity and abundance of ethological data.

More information is available at [ethoinformatics.org](http://ethoinformatics.org/)

## Project Goals
Lack of standardization in data management is a major impediment to comparative research. To work towards common standards in behavioral research, we take a four-part integrative approach:

1. Develop a body of data standards, including a set of vocabularies and technical specifications, for behavioral research.
2. Develop data collection software for behavioral research in the field.
3. Develop database software and a series of tools for data upload/download, visualization, and analysis.
4. Develop a long-term online repository as a resource for uploading, downloading, and archiving data.


## Table of contents
* [Requirements](#requirements)
* [Getting Started](#getting-started)
* [Application](#application)
    * [Project Structure](#project-structure)
    * [Define Schema](#project-structure)
    * [Build and Run](#build-and-run)
* [CouchDB](#couchdb)
* [Deploying to Mobile Device](#mobile)
* [Reference](#reference)



## Requirements

### Dependencies
Ensure the following are installed on your system:

1. [node](https://nodejs.org/) and [npm](https://www.npmjs.com/)
2. [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Getting started
1. Clone git repo from github
    ```bash
    $ git clone <github url>
    ```

2. Install dependencies
    ```bash
    $ npm install
    ```

5. Boot development environment (webpack-dev-server)
    ```bash
    $ npm run dev
    ```
    Visit [http://localhost:8080/](http://localhost:8080/)

    > The development environment runs a [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html) in the background on :8080, so make sure you don't have another server running on this port. Webpack watches updates to source code in /src and rebundles the app automatically. The server uses [Hot Module Replacement](https://webpack.github.io/docs/hot-module-replacement.html) to update the app in-place when changes are made. If there are errors during bundling, you will see them in your terminal.

## Application


### Project structure
    .
    ├── cordova                 # Cordova-specific files
    ├── dist                    # Compiled files
    ├── node_modules            # Dependencies installed via package.json
    ├── public                  # Static files, e.g. index.html
    ├── src                     # Source
    │   ├── components          # UI Components
    │   ├── constants           # Constants
    │   ├── schemas             # Data definitions
    │   ├── stores              # Data and business logic
    │   ├── utilities           # Utilities
    │   ├── config.js           # Configuration
    │   ├── main.js             # Entry point - mounts app to DOM
    │   └── router.js           # URL router
    ├── package.json            # Dependencies
    ├── README.md
    ├── webpack<env>config.js   # Webpack (bundler) config
    └── ...                     # etc.

### Configure
**src/config.js** is the point of contact for configuring top-level application variables, such as the remote CouchDB URL, the local PouchDB database name, etc.

### Define your data structures
In **src/schema**, we define the shape of our data. Each schema corresponds to a separate "entity". Each key in a schema defines a property and an associated data type.

    ...
    ├── src
    │   └── schemas
    │       ├── foo.yaml
    │       └── bar.yaml
    └── ...

### Generate interface from schema

<table>
  <tr>
    <th width="30%">Define Schema</th>
    <th width="20%">Generated Interface</th>
  </tr>
  <tr>
    <td>Defined in diary.yaml</td>
    <th rowspan="2"><img src="https://cloud.githubusercontent.com/assets/206423/26733989/91b0e040-478a-11e7-8d6c-014948f360b3.png"></th>
  </tr>

<tr>
    <td><pre><code>
 name: Diary
 displayField: datetime
 fields:
   - name: title
     type: String
   - name: observer
     type: Observer
     lookup: true
   - name: datetime
     type: Date
   - name: location
     type: Geolocation
     options:
     track: true
   - name: contacts
     type: [Contact]
   - name: biologicalSamples
     type: [BiologicalSample]
   - name: plantSamples
     type: [PlantSample]
   - name: comments
     type: [String]
        
 </code></pre></td>
 </tr>
</table>


### Build and Run
We run / build our application via scripts defined in package.json:

1. **Run development environment**
    ```bash
    $ npm run dev
    ```
    Visit http://localhost:8080/

2. **Bundle source code**
    ```bash
    $ npm run build
    ```
    Output to:
    ```
    └── dist
    ```

3. **Bundle source code & build with Cordova for iOS**
    
    Setup Cordova before running build scripts
    
    ```bash
    $ npm run build-cordova-ios
    ```
    Output to:
    ```
    └── cordova
        └── platforms
            └──  ios
    ```

4. **Bundle source code & build with Cordova for Android**
    
    Setup Cordova before running build scripts
    
    ```bash
    $ npm run build-cordova-android
    ```
    Output to:
    ```
    └── cordova
        └── platforms
            └──  android
    ```
    
    
 ## CouchDB

The application uses CouchDB 2.0 for uploading and downloading saved records.

See the [CouchDB 2.0 Docs](http://docs.couchdb.org/en/2.0.0/install/) for instructions.

### Digital Ocean Setup

The following instructions 

1.  Setup Ubuntu droplet image
    
    See [Digital Ocean Instructions](https://www.digitalocean.com/community/tutorials/how-to-create-your-first-digitalocean-droplet-virtual-server/) for instructions.


2.  Download and unarchive Couch source
    ```
    curl http://www-us.apache.org/dist/couchdb/source/2.0.0/apache-couchdb-2.0.0.tar.gz | tar xz
    ```

3.  Enter directory of download
    ```
    $ cd apache-couchdb-2.0.0/
    ```

4.  Enter directory of download
    ```
    $ ./configure
    ```

5.  Update configuration file /etc/local.ini
    ```
    [chttpd]
    port = 5984
    bind_address = 0.0.0.0   
    ```

6.  On Ubuntu, add “ufw” firewall rule for TCP packets on the couches port (5984)
    ```
    $ sudo ufw allow 5984/tcp
    ```
   
7.  Run CouchDB as a Daemon
    ```
    $ cat <<EOT >> /etc/systemd/system/couchdb.service
      [Unit]
      Description=Couchdb service
      After=network.target

      [Service]
      Type=simple
      User=couchdb
      ExecStart=/home/couchdb/couchdb/bin/couchdb -o /dev/stdout -e /dev/stderr
      Restart=always
      EOT    
    ```

8.  Reload the systemd daemon and add the couchdb service to the startup routine
    ```
    systemctl  daemon-reload
    systemctl  start couchdb.service
    systemctl  enable couchdb.service
    ```

### Running CouchDB and application on the same machine

Though the database would normally run on a different server, it could be setup to run on the same machine as the application for quick testing. CORS will need to be enabled via the CouchDB web console. The setting is under the Configuration Tab. Set this to enable and select All domains (*).  
    
    
## Mobile

If you want to deploy to iOS or Android with [Cordova](https://cordova.apache.org):

1. Install Cordova globally:

    ```bash
    $ npm install -g cordova
    ```

2. Add a platform:
    ```bash
    $ cd cordova
    $ cordova platform add ios --save
    $ cordova platform add android --save
    ``` 

    See the [Cordova Docs](https://cordova.apache.org/docs/en/latest/guide/overview/) for more information.

    
    
## Reference

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
