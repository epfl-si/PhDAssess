# PhD Assess

Provide form tasks to users, so they can fulfil their PhD assessment process.

You can take a look at the process by installing the [BPMN Modeler](https://camunda.com/download/modeler/) and by opening [the process definition](https://github.com/epfl-si/PhDAssess-meta/blob/main/bpmn/phdAssessProcess.bpmn).

Technically, the application consists of a Meteor server, defined as a [Zeebe](https://zeebe.io) worker. It shows all jobs of type `phdAssessFillForm` as a task/todo-list. A user can complete his/her form tasks through FormIO forms.

## Run

### Prerequiste

- Have docker & docker-compose
- [Have meteor](https://www.meteor.com/developers/install)
- Assert you have access to Keybase credentials, available in /keybase/team/epfl_phdassess.test/
- Read the .env.sample and create a copy as `.env`:
  ```
  cp .env.sample .env
  ```
- Edit the `.env` to suit your needs
- Do the same for `.node-env.sample` with:
  ```
  cp .node-env.sample .node-env
  ```

### Start the support infrastructure

The support infrastructure is required for the Meteor app to function (in addition to Meteor's usual, internally managed requirement of a MongoDB database). It consists of Zeebe (the persistent store for workflow data and metadata).
This command runs them through a docker-compose setup:
```
./phd.mjs start
```

Now you should have a quorum of three Zeebe running, and microservices for them.

You can stop them with
```
./phd.mjs stop
```

### Start the Web framework

  - Set yourself in the web framework folder
    ```
    cd ./apps/fillForm
    ```
  - Install dependencies
    ```
    meteor npm i
    ```
  - Start the server
    ```
    meteor npm start
    ```

#### Troubleshoot

If you get an error about not having a proto file in `/proto/`, use this trick and start the server again:
`ln -s ./apps/fillForm/node_modules/zeebe-node/proto/zeebe.proto* /proto/`

### Deploy a workflow
  ```
  ./phd.mjs deploy-bpmn
  ```

### Browse

  - Open http://localhost:3000

### Stop the support infrastructure

```
./phd.mjs stop
```

# Advanced Tasks

## Observe the latest MongoDB activities

Whenever Zeebe sends work to Meteor, the `tasks_journal` collection gets updated. To retrieve the latest status thereof:

```
oc -n {your_oc_namespace} exec -i services/web-app-db -- mongo --quiet meteor --eval "printjson(db.tasks_journal.find().sort({lastSeen:1}).toArray());" | grep -v '"msg"' | sed -e 's/ISODate(\(".*"\))/\1/' | jq .
```

## Test

Run
```
cd ./apps/fillForm
meteor test --driver-package meteortesting:mocha --port 3100
```

Add --full-app or --once if needed

Choose only server or client with env TEST_SERVER=0 TEST_CLIENT=0:
```
TEST_SERVER=0 meteor test --driver-package meteortesting:mocha --port 3100
```
