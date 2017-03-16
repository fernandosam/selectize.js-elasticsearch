# Selectize.js-elasticsearch
Use selectize.js with elasticsearch

## Elasticsearch Installation

The first step is download and install [elasticsearch](https://github.com/elastic/elasticsearch).

- [Download](https://www.elastic.co/downloads/elasticsearch) and unzip the Elasticsearch official distribution.
- Run bin/elasticsearch on unix, or bin\elasticsearch.bat on windows.
- Run curl -X GET http://localhost:9200/.

## http-server

http-server is a simple, zero-configuration command-line http server.

Installation via npm:
```
npm install http-server -g
```

## Run the project

Download or clone this project and open the project folder:
```
cd Selectize.js-elasticsearch/
```

Run http-server:
```
http-server -o -cors -c-1 -i
```

Now you can visit http://localhost:8080 to view your server and view Selectize.js-elasticsearch in action.
