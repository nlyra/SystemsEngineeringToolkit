# SystemsEngineeringToolkit

## To run (regular way).

- Download Node.js.
- Set up a Mongo Database (Atlas or Local).

### Set up and run the server:

- In cmd inside folder (./server/), run ```npm install```.
- In the config.json add the fields:
  {
      "db_url": (insert mongo db url),
      "server_url": (insert server url),
      "key": (insert key, preferably a strong one, this if for encryption of passwords),
      "emailInfo": { (this is for forgot password, so preferably an email dedicated to that)
          "service": (mail provider like gmail, outlook, hotmail),
          "emailUsername": (email),
          "emailPassword": (password)
      }
  }
- run in CMD ```npm start```.

### Set up and run front end:

- in cmd inside folder (./frontend/toolkit-webapp/), run: ```npm install```.
- In the config.json add the fields:
  "server_url": (server url)
- run in CMD ```npm start```.

### create an admin user.

- first create a regular student user on the website by registering.
- once created go to mongo and update the user field roleID to 2 (int).



## To run (docker way).

- run docker.

### Server side changes:

- In the config.json add the fields:
  {
      "db_url": (insert mongo db url for docker: "mongodb://mongo:27017/se_toolkit"),
      "server_url": (insert server url),
      "key": (insert key, preferably a strong one, this if for encryption of passwords),
      "emailInfo": { (this is for forgot password, so preferably an email dedicated to that)
          "service": (mail provider like gmail, outlook, hotmail),
          "emailUsername": (email),
          "emailPassword": (password)
      }
  }


### Front end side changes:
- In the config.json add the fields:
  "server_url": (server url).

### Docker instructions:

- on cmd inside folder (./SystemsEngineeringToolkit/).
- run ```docker-compose build``` this is to build the website, once finished continue.
- run ```docker-compose up``` this is to run the website, the front end might take a minute or two.

### create an admin user:

- first create a regular student user on the website by registering.
- once created go to the docker command line and run mongo ```mongo```.
- check that se_toolkit db was created by running ```show dbs```.
- select the se_tollkit db by running: ```use se_toolkit```.
- to change the role of the created user run this command:
  ```db.users.update({ "email":(insert email of created user surrounded by "") }, { "roleID":2 })```.
- log in again and check if you have the creator and admin functionalities.