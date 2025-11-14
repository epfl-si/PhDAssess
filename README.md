# PhD Assess

Provide form tasks to users, so they can fulfil their PhD assessment process.

You can take a look at the process by installing the [BPMN Modeler](https://camunda.com/download/modeler/) and by opening [the process definition](https://github.com/epfl-si/PhDAssess-meta/blob/main/bpmn/phdAssessProcess.bpmn).

The application consists of a Meteor server, defined as a [Zeebe](https://zeebe.io) worker. It shows all jobs of type `phdAssessFillForm` as a task/todo-list. A user can complete his/her form tasks through FormIO forms.

## Run

### Prerequisite

- [Install Meteor](https://www.meteor.com/developers/install)
- Read the .env.sample and create your copy as `.env`:
  ```
  cp .env.sample .env
  ```
- Edit the `.env` to suit your needs
- Do the same for `.node-env.sample` with:
  ```
  cp .node-env.sample .node-env
  ```
- Install dependencies
  ```
  meteor npm i
  ```

### Start
`meteor npm start`, then open http://localhost:3000

Be warned, you only get the frontend app. To have the full PhDAssess stack running, see https://github.com/epfl-si/PhDAssess.ops

### Troubleshoot

If you get an error about not having a proto file in `/proto/`, use this trick and start the server again:
`ln -s ./apps/fillForm/node_modules/zeebe-node/proto/zeebe.proto* /proto/`

## Test
```
cd ./apps/fillForm
meteor test --driver-package meteortesting:mocha --port 3100
```

Add --full-app or --once if needed

Choose only server or client with env TEST_SERVER=0 TEST_CLIENT=0:
```
TEST_SERVER=0 meteor test --driver-package meteortesting:mocha --port 3100
```
