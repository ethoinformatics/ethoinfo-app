## CouchDB

The application uses CouchDB 2.0 for uploading and downloading saved records.

See the [CouchDB 2.0 Docs](http://docs.couchdb.org/en/2.0.0/install/) for instructions on setup.

### Cloud hosted



### Running CouchDB and application on the same machine

Though the database would normally run on a different server, it could be setup to run on the same machine as the application for quick testing. CORS will need to be enabled via the CouchDB web console. The setting is under the Configuration Tab. Set this to enable and select All domains (*).  
