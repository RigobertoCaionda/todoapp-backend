import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { TaskRepository } from "App/Repositories/task.repository";
import { TaskService } from "App/Services/task/task.service";
import { PriorityFactory } from "Database/factories/PriorityFactory";
import { TaskFactory } from "Database/factories/TaskFactory";
import { UserFactory } from "Database/factories/UserFactory";

async function setup() {
  const taskService = new TaskService(new TaskRepository());
  return { taskService };
}

async function beforeEachSetup() {
  return {
    paginationData: {
      withPagination: false,
      perPage: 3,
    },
  };
}

test.group("TaskService", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return async () => await Database.rollbackGlobalTransaction();
  });
  test("should list tasks without pagination", async ({ assert }) => {
    const { taskService } = await setup();
    const { paginationData } = await beforeEachSetup();
    await TaskFactory.createMany(4);
    const result = await taskService.query(paginationData);
    assert.notExists((result as any).page);
    assert.notExists((result as any).perPage);
    assert.notExists((result as any).total);
    assert.isArray(result);
  });
  test("should list tasks with pagination", async ({ assert }) => {
    const { taskService } = await setup();
    const { paginationData } = await beforeEachSetup();
    paginationData.withPagination = true;
    await TaskFactory.createMany(4);
    const result = await taskService.query(paginationData);
    assert.equal((result as any).page, 1);
    assert.equal((result as any).perPage, 3);
    assert.equal((result as any).total, 4);
    assert.isArray((result as any).data);
  });

  test("should list tasks with its relation with user when withPagination is true", async ({
    assert,
  }) => {
    const { taskService } = await setup();
    const { paginationData } = await beforeEachSetup();
    paginationData.withPagination = true;
    await TaskFactory.createMany(4);
    const result = await taskService.query(paginationData);

    assert.isDefined((result as any).data[0].user);
  });
  test("should list tasks with its relation with user when withPagination is false", async ({
    assert,
  }) => {
    const { taskService } = await setup();
    const { paginationData } = await beforeEachSetup();
    await TaskFactory.createMany(4);
    const result = await taskService.query(paginationData);

    assert.isDefined(result[0].user);
  });

  test("should list tasks with its relation with priority when withPagination is true", async ({
    assert,
  }) => {
    const { taskService } = await setup();
    const { paginationData } = await beforeEachSetup();
    paginationData.withPagination = true;
    await TaskFactory.createMany(4);
    const result = await taskService.query(paginationData);

    assert.isDefined((result as any).data[0].priority);
  });

  test("should list tasks with its relation with user when withPagination is false", async ({
    assert,
  }) => {
    const { taskService } = await setup();
    const { paginationData } = await beforeEachSetup();

    await TaskFactory.createMany(4);
    const result = await taskService.query(paginationData);

    assert.isDefined(result[0].priority);
  });

  test("should create a task successfully", async ({ expect }) => {
    const { taskService } = await setup();
    const user = await UserFactory.create();
    const priority = await PriorityFactory.create();
    let inpuTaskData = {
      descricao: "Task de teste",
      startDate: undefined,
      endDate: undefined,
      finished: undefined,
      userId: user.id,
      priorityId: priority.id,
    };

    const inputTaskDataSnackCase = {
      descricao: "Task de teste",
      start_date: undefined,
      end_date: undefined,
      finished: undefined,
      user_id: user.id,
      priority_id: priority.id,
    };

    const result = await taskService.execute(inpuTaskData);
    delete result.created_at;
    delete result.updated_at;
    delete result.id;

    expect(result).toStrictEqual(inputTaskDataSnackCase);
  });

  test("should not create a task successfully if description is undefined or empty", async ({
    expect,
  }) => {
    const { taskService } = await setup();
    const user = await UserFactory.create();
    const priority = await PriorityFactory.create();
    let inpuTaskData = {
      descricao: "",
      startDate: undefined,
      endDate: undefined,
      finished: undefined,
      userId: user.id,
      priorityId: priority.id,
    };

    const result = await taskService.execute(inpuTaskData);

    expect(result.error).toEqual("Description is required");
  });
  test("should not create a task successfully if userId doesn't exist", async ({
    expect,
  }) => {
    const { taskService } = await setup();

    const priority = await PriorityFactory.create();
    let inpuTaskData = {
      descricao: "Task de Teste",
      startDate: undefined,
      endDate: undefined,
      finished: undefined,
      userId: undefined,
      priorityId: priority.id,
    };

    const result = await taskService.execute(inpuTaskData);

    expect(result.error).toEqual("UserId is required");
  });
  test("should not create a task successfully if priorityId doesn't exist", async ({
    expect,
  }) => {
    const { taskService } = await setup();
    const user = await UserFactory.create();

    let inpuTaskData = {
      descricao: "Task de Teste",
      startDate: undefined,
      endDate: undefined,
      finished: undefined,
      userId: user.id,
      priorityId: undefined,
    };

    const result = await taskService.execute(inpuTaskData);

    expect(result.error).toEqual("PriorityId is required");
  });
  test("should list just one task", async ({ expect }) => {
    const { taskService } = await setup();
    const task = await TaskFactory.create();

    const result = await taskService.findOne(task.id);

    expect((result as any).id).toEqual(task.id);
    expect((result as any).descricao).toEqual(task.descricao);
    expect((result as any).priority).toBeDefined();
    expect((result as any).user).toBeDefined();
  });
  test("should  a user delete his own task successfully", async ({ expect }) => {
    const { taskService } = await setup();
    const task = await TaskFactory.create();

    await taskService.delete(task.id, task.userId);

    const result = await taskService.findOne(task.id);
    expect(result).toBeUndefined();
  });

   test("should  not a user delete a task successfully if it is not his own task", async ({
     expect,
   }) => {
     const { taskService } = await setup();
     const task = await TaskFactory.create();

     const result = await taskService.delete(task.id, 10000);

     const deletedTask = await taskService.findOne(task.id);
     expect((deletedTask as any).id).toBeDefined();
     expect(result.error).toEqual("Can not delete another users tasks");
   });
   test("should  not a user delete a task successfully if the task does not exist", async ({
     expect,
   }) => {
     const { taskService } = await setup();
     const task = await TaskFactory.create();

     const result = await taskService.delete(10000, task.userId);

     expect(result.error).toEqual("Task does not exist");
   });

  test("should a user update successfully his own task", async ({ expect }) => {
    const { taskService } = await setup();
    const priorities = await PriorityFactory.createMany(2);

    const task = await TaskFactory.create();
    const inputTaskData = {
      descricao: "Nova Descrição",
      userId: task.userId,
      priorityId: priorities[1].id,
      finished: true,
    };
    const updatedTask = await taskService.update(task.id, inputTaskData);

    expect(updatedTask.id).toEqual(task.id);
    expect(updatedTask.descricao).toEqual(inputTaskData.descricao);
    expect(updatedTask.userId).toEqual(inputTaskData.userId);
    expect(updatedTask.priorityId).toEqual(inputTaskData.priorityId);
    expect(updatedTask.finished).toEqual(1);
  });

  test("should not a user update successfully a task if it is not his own task", async ({ expect }) => {
    const { taskService } = await setup();

    const task = await TaskFactory.create();
    const inputTaskData = {
      descricao: "Nova Descrição",
      userId: 1000,
      finished: true,
    };
    const updatedTask = await taskService.update(task.id, inputTaskData);

    expect(updatedTask.error).toEqual("Can not update another users tasks");

  });

   test("should not a user update successfully a task if the task does not exist", async ({
     expect,
   }) => {
     const { taskService } = await setup();

     const inputTaskData = {
       descricao: "Nova Descrição",
       userId: 1000,
       finished: true,
     };
     const updatedTask = await taskService.update(10000, inputTaskData);

     expect(updatedTask.error).toEqual("Task does not exist");
   });

  test("should list successfully all tasks belonging to a certain user", async ({
    expect,
  }) => {
    const { taskService } = await setup();
    const users = await UserFactory.createMany(2);
    const priority = await PriorityFactory.create();

    await taskService.execute({
      descricao: "Tarefa 101",
      priorityId: priority.id,
      userId: users[0].id,
    });
    await taskService.execute({
      descricao: "Tarefa 102",
      priorityId: priority.id,
      userId: users[0].id,
    });
    await taskService.execute({
      descricao: "Tarefa 103",
      priorityId: priority.id,
      userId: users[0].id,
    });
    await taskService.execute({
      descricao: "Tarefa 104",
      priorityId: priority.id,
      userId: users[1].id,
    });

    const userTasks = await taskService.findUserTasks(users[0].id);
    expect((userTasks as any).length).toEqual(3);
    expect((userTasks[0] as any).descricao).toEqual("Tarefa 101");
    expect((userTasks[1] as any).descricao).toEqual("Tarefa 102");
    expect((userTasks[2] as any).descricao).toEqual("Tarefa 103");
  });
  test("should not list successfully all tasks belonging to a certain user when userId is undefined", async ({
    expect,
  }) => {
    const { taskService } = await setup();
    const userId = undefined;
    const userTasks = await taskService.findUserTasks(Number(userId));

    expect((userTasks as any).error).toEqual("userId is required");
  });
  test("should list all finished tasks", async ({ expect }) => {
    const { taskService } = await setup();

    const user = await UserFactory.create();
    const priority = await PriorityFactory.create();
    await taskService.execute({
      descricao: "tarefa 1",
      finished: true,
      userId: user.id,
      priorityId: priority.id,
    });
    await taskService.execute({
      descricao: "tarefa 2",
      finished: true,
      userId: user.id,
      priorityId: priority.id,
    });
    await taskService.execute({
      descricao: "tarefa 3",
      finished: true,
      userId: user.id,
      priorityId: priority.id,
    });
    await taskService.execute({
      descricao: "tarefa 4",
      userId: user.id,
      priorityId: priority.id,
    });

    const result = await taskService.getFinishedTasks();
    expect(result.length).toEqual(3);
    expect((result as any)[0].finished).toEqual(1);
  });
  test("should list all unfinished tasks", async ({ expect }) => {
    const { taskService } = await setup();

    const user = await UserFactory.create();
    const priority = await PriorityFactory.create();
    await taskService.execute({
      descricao: "tarefa 1",
      finished: true,
      userId: user.id,
      priorityId: priority.id,
    });
    await taskService.execute({
      descricao: "tarefa 2",
      finished: true,
      userId: user.id,
      priorityId: priority.id,
    });
    await taskService.execute({
      descricao: "tarefa 3",
      finished: true,
      userId: user.id,
      priorityId: priority.id,
    });
    await taskService.execute({
      descricao: "tarefa 4",
      userId: user.id,
      priorityId: priority.id,
    });

    const result = await taskService.getUnFinishedTasks();
    expect(result.length).toEqual(1);
    expect((result as any)[0].finished).toEqual(0);
  });

  test('should list all finished tasks of a certain user when pagination is false', async ({ expect }) => {
    const { taskService } = await setup()
    const { paginationData } = await beforeEachSetup()
    const users = await UserFactory.createMany(2)

    const task1 = await TaskFactory.create()
    const task2 = await TaskFactory.create()
    const task3 = await TaskFactory.create()
    const task4 = await TaskFactory.create()
    await task1.merge({ descricao: 'Tarefa 1', finished: true, userId: users[0].id }).save()
    await task2.merge({ descricao: 'Tarefa 2', finished: true, userId: users[0].id }).save()
    await task3.merge({ descricao: 'Tarefa 3', userId: users[0].id }).save()
    await task4.merge({ descricao: 'Tarefa 4', finished: true, userId: users[1].id }).save()

    const finishedTasks = await taskService.query(paginationData, {'userId': users[0].id, 'finished': true  })
    expect((finishedTasks as any).length).toEqual(2)
    expect(finishedTasks[0].descricao).toEqual("Tarefa 1");
    expect(finishedTasks[1].descricao).toEqual("Tarefa 2");
  })

  test("should list all finished tasks of a certain user when pagination is true", async ({
    expect,
  }) => {
    const { taskService } = await setup();
    const { paginationData } = await beforeEachSetup();
    const users = await UserFactory.createMany(2);

    const task1 = await TaskFactory.create();
    const task2 = await TaskFactory.create();
    const task3 = await TaskFactory.create();
    const task4 = await TaskFactory.create();
    await task1
      .merge({ descricao: "Tarefa 1", finished: true, userId: users[0].id })
      .save();
    await task2
      .merge({ descricao: "Tarefa 2", finished: true, userId: users[0].id })
      .save();
    await task3.merge({ descricao: "Tarefa 3", userId: users[0].id }).save();
    await task4
      .merge({ descricao: "Tarefa 4", finished: true, userId: users[1].id })
      .save();

      paginationData.withPagination = true
    const finishedTasks = await taskService.query(paginationData, {
      userId: users[0].id,
      finished: true,
    });
    expect((finishedTasks as any).data.length).toEqual(2);
    expect((finishedTasks as any).data[0].descricao).toEqual("Tarefa 1");
    expect((finishedTasks as any).data[1].descricao).toEqual("Tarefa 2");
  });
});
