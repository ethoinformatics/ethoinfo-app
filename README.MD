# 🐵 ethoinfo-app

## About
A mobile web app designed to enable the collection of flexible data structures in an offline environment. http://ethoinformatics.org/


## Table of contents
* [Requirements](#requirements)
* [Getting Started](#getting-started)
* [Couchdb](docs/couchdb.md)
* [Application](docs/application.md)
* [Mobile](docs/mobile.md)
* [Next Steps](docs/nextsteps.md)
* [Reference](docs/reference.md)



## Requirements

### Dependencies
Ensure the following are installed on your system:

1. [node](https://nodejs.org/) and [npm](https://www.npmjs.com/)
2. [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Optional
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

## Project structure
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

## Usage

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

### Run
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

3. **Bundle source code & build with cordova for iOS**
    ```bash
    $ npm run build-cordova-ios
    ```
    Output to:
    ```
    └── cordova
        └── platforms
            └──  ios
    ```

4. **Bundle source code & build with cordova for android**
    ```bash
    $ npm run build-cordova-android
    ```
    Output to:
    ```
    └── cordova
        └── platforms
            └──  android
    ```
