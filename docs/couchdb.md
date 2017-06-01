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
