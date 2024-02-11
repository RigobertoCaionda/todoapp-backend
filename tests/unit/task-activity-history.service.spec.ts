import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { TaskActivityHistoryRepository } from "App/Repositories/task-activity-history.repository";
import { TaskActivityHistoryService } from "App/Services/task-activity-history/task-activity-history.service";
import { TaskActivityHistoryFactory } from "Database/factories/TaskActivityHistory";
import { TaskFactory } from "Database/factories/TaskFactory";
import { UserFactory } from "Database/factories/UserFactory";

async function setup() {
  const taskActivityHistoryService = new TaskActivityHistoryService(
    new TaskActivityHistoryRepository()
  );
  return { taskActivityHistoryService };
}

async function beforeEachSetup() {
  return {
    paginationData: {
      withPagination: false,
      perPage: 3,
    },
    inputTaskActivityHistoryData: {},
  };
}

test.group("TaskActivityHistoryService", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return async () => await Database.rollbackGlobalTransaction();
  });

  test("should create a task activity history successfully", async ({ expect }) => {
    const inputTaskActivityHistoryData: any = {};
    const { taskActivityHistoryService } = await setup();
    const user = await UserFactory.create();
    const task = await TaskFactory.create();
    inputTaskActivityHistoryData.taskId = task.id;
    inputTaskActivityHistoryData.userId = user.id;
    inputTaskActivityHistoryData.action = 'created';
    const result = await taskActivityHistoryService.execute(
      inputTaskActivityHistoryData
    );
    delete result.created_at;
    delete result.id;
    delete result.updated_at;
    const newInputTaskActivityHistoryData = {
      user_id: inputTaskActivityHistoryData?.userId,
      task_id: inputTaskActivityHistoryData?.taskId,
      action: inputTaskActivityHistoryData?.action,
    };
    expect(result).toStrictEqual(newInputTaskActivityHistoryData);
  });
  test("should not create a task activity history successfully if userId is undefined", async ({ expect }) => {
    const inputTaskActivityHistoryData: any = {};
    const { taskActivityHistoryService } = await setup();

    const task = await TaskFactory.create();
    inputTaskActivityHistoryData.taskId = task.id;
    inputTaskActivityHistoryData.userId = undefined;
    inputTaskActivityHistoryData.action = 'created';
    const result = await taskActivityHistoryService.execute(
      inputTaskActivityHistoryData
    );

    expect(result.error).toEqual('userId is required');
  });
  test("should not create a task activity history successfully if taskId is undefined", async ({ expect }) => {
    const inputTaskActivityHistoryData: any = {};
    const { taskActivityHistoryService } = await setup();

    const user = await UserFactory.create();
    inputTaskActivityHistoryData.taskId = undefined;
    inputTaskActivityHistoryData.userId = user.id;
    inputTaskActivityHistoryData.action = 'created';
    const result = await taskActivityHistoryService.execute(
      inputTaskActivityHistoryData
    );

    expect(result.error).toEqual('taskId is required');
  });
  test("should not create a task activity history successfully if action is undefined", async ({ expect }) => {
    const inputTaskActivityHistoryData: any = {};
    const { taskActivityHistoryService } = await setup();

    const user = await UserFactory.create();
    const task = await TaskFactory.create();
    inputTaskActivityHistoryData.taskId = task.id;
    inputTaskActivityHistoryData.userId = user.id;
    inputTaskActivityHistoryData.action = undefined;
    const result = await taskActivityHistoryService.execute(
      inputTaskActivityHistoryData
    );

    expect(result.error).toEqual('action is required');
  });

  test('should list task activity histories when Pagination is true', async ({ expect }) => {
    const { taskActivityHistoryService } = await setup();
    const { paginationData } = await beforeEachSetup();
    paginationData.withPagination = true;
    paginationData.perPage = 5
    await TaskActivityHistoryFactory.createMany(5)
    const result = await taskActivityHistoryService.query(paginationData)
    expect((result as any).perPage).toEqual(paginationData.perPage)
    expect((result as any).total).toEqual(5)
    expect((result as any).data.length).toEqual(5)
  })
  test('should list task activity histories when Pagination is false', async ({ expect }) => {
    const { taskActivityHistoryService } = await setup();
    const { paginationData } = await beforeEachSetup();
    await TaskActivityHistoryFactory.createMany(5)
    const result = await taskActivityHistoryService.query(paginationData)
    expect((result as any).perPage).toBeUndefined()
    expect((result as any).total).toBeUndefined;
    expect((result as any).data).toBeUndefined;
  })
  test('should list task activity histories when Pagination is false and we pass some filter', async ({ expect }) => {
    const { taskActivityHistoryService } = await setup();
    const { paginationData } = await beforeEachSetup();
    const user1 = await UserFactory.create()
    const user2 = await UserFactory.create()
    const taskActivityHisitory1 = await TaskActivityHistoryFactory.create()
    const taskActivityHisitory2 = await TaskActivityHistoryFactory.create()
    await taskActivityHisitory1.merge({ userId: user1.id }).save()
    await taskActivityHisitory2.merge({ userId: user2.id }).save()
    const result = await taskActivityHistoryService.query(paginationData, { userId: user1.id })
    expect((result as any).perPage).toBeUndefined()
    expect((result as any).total).toBeUndefined;
    expect((result as any).data).toBeUndefined;
    expect((result as any).length).toEqual(1)
    expect(result[0].userId).toEqual(user1.id)
  })
});
