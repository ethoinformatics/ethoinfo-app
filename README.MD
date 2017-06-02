# 🐵 ethoinfo-app

## About
A mobile web app designed to enable the collection of flexible data structures in an offline environment. http://ethoinformatics.org/


## Table of contents
* [Requirements](#requirements)
* [Getting Started](#getting-started)
* [CouchDB](docs/couchdb.md)
* [Application](docs/application.md)
* [Mobile](docs/mobile.md)
* [Next Steps](docs/nextsteps.md)
* [Reference](docs/reference.md)



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

### Generate interface from schema

<table>
  <tr>
    <th width="20%">Define Schema</th>
    <th width="40%">Generated Interface</th>
  </tr>
  <tr>
    <td><div class="highlight highlight-source-yaml"><pre>
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
        
 <div></pre></td>
<td><img src="https://cloud.githubusercontent.com/assets/206423/26733989/91b0e040-478a-11e7-8d6c-014948f360b3.png"></td>
  </tr>

  <tr>
    <td><div class="highlight highlight-source-yaml"><pre>
name: BiologicalSample 
displayField: sampleLabel
fields:
  - name: subjects
    type: [Subject]
    lookup: true
    - name: sampleLabel
      type: String 
    - name: datetime
      type: Date
    - name: sampleType
      type: [BiologicalSampleType] 
    - name: storageMedium
      type: BiologicalSampleMedium 
    - name: storageContainer
      type: BiologicalSampleContainer
    - name: location
      type: Geolocation
    - name: sampleQuality
      type: SampleQuality 
    
 <div></pre></td>
<td><img src="https://cloud.githubusercontent.com/assets/206423/26734034/b521d8ea-478a-11e7-8513-1d24db99d419.png"></td>
  </tr>
  
  <tr>
    <td><div class="highlight highlight-source-yaml"><pre>
name: Taxonomy
displayField: scientificName
fields:
  - name: scientificName
    type: String
  - name: kingdom
    type: String
  - name: phylum
    type: String
  - name: class
    type: String
  - name: order
    type: String
  - name: family
    type: String
  - name: genus
    type: String
  - name: species
    type: String
    
 <div></pre></td>
<td><img src="https://cloud.githubusercontent.com/assets/206423/26734241/51bc4b22-478b-11e7-99b4-faabf8aa7815.png"></td>
  </tr>


</table>


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
    
    
    
    
