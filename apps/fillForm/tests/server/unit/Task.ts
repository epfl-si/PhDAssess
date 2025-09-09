import chai, {assert} from 'chai'
import chaiDateTime from "chai-datetime";
chai.use(chaiDateTime);
import dayjs from "dayjs";

import {Task, Tasks} from "/imports/model/tasks";
import {convertDefinitionToGraph} from "/imports/ui/components/Dashboard/DefinitionGraphed";
import {stepsDefinitionV2} from "/tests/factories/dashboard/dashboardDefinition";

const dbCleaner = require("meteor/xolvio:cleaner");
const Factory = require("meteor/dburles:factory").Factory


describe('Unit tests Tasks', function () {
  beforeEach(function () {
    dbCleaner.resetDatabase({}, () => {
      Factory.create("task");
      Factory.create("task");
    });
  });

  it('should have at least a task', async function () {
    const tasks = Tasks.find({});
    assert.notStrictEqual(await tasks.countAsync(), 0);
    // tasks.forEach(t => {
    //   // @ts-ignore
    //   const { customHeaders, variables, ...taskLight } = t
    //   console.log(taskLight)
    // })
  });

  // testing the test engine about dates, and how we are able to filter it with Mongo
  it('should be able to read and write dates', async function () {
    Factory.create("task", {
        "journal.lastSeen": dayjs().subtract(15, 'days').toDate(),
      }
    )

    const tasks = await Tasks.find({}).fetchAsync()
    assert.isNotEmpty(tasks)

    tasks.forEach((task) => {
      assert.isDefined(task.journal.lastSeen)
      const lastSeen = new Date(task.journal.lastSeen!)
      assert.beforeOrEqualDate(lastSeen, new Date())
    })

    // can we find the obsolete one ?
    const obsoleteTasks = await Tasks.find({
      "journal.lastSeen": { $lte: dayjs().subtract(1, 'day').toDate() },
    }).fetchAsync()
    const notObsoleteTasks = await Tasks.find({
      "journal.lastSeen": { $gte: dayjs().subtract(1, 'day').toDate() },
    }).fetchAsync()

    assert.lengthOf(obsoleteTasks, 1)
    assert.isAbove(notObsoleteTasks.length, 1)
  });
});


describe('Unit tests Tasks dashboard definition', async function () {
  let taskWithoutDefinition: Task | undefined
  let tasksWithDefinition: Task[]

  beforeEach(function () {
    dbCleaner.resetDatabase({}, () => {
      Factory.create("task", {
        "variables.dashboardDefinition": undefined
      });
      Factory.create("task", {
        "variables.dashboardDefinition": stepsDefinitionV2
      });
    });
  });

  it('should have a dashboard definition', async function () {
    taskWithoutDefinition = await Tasks.findOneAsync({ 'variables.dashboardDefinition': { $exists: false } })
    tasksWithDefinition = await Tasks.find({ 'variables.dashboardDefinition': { $exists: true } }).fetchAsync()

    assert.isUndefined(taskWithoutDefinition?.variables.dashboardDefinition)

    tasksWithDefinition.forEach(
      (task) => {
        assert.isDefined(task.variables.dashboardDefinition)
        assert(task.variables.dashboardDefinition)  // test that it is some valid json
      }
    )
  });

  it('should have a dashboard definition graph-able', function () {
    tasksWithDefinition.forEach(
      (task) => {
        if (task.variables?.dashboardDefinition) {
          const graphedDefinition = convertDefinitionToGraph(
            task.variables.dashboardDefinition
          )
          assert(graphedDefinition)
          assert.isNotEmpty(graphedDefinition.nodes())
        }
      }
    )
  });
});
