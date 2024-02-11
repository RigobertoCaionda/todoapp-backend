import Database from "@ioc:Adonis/Lucid/Database";
import { test, } from "@japa/runner";
import { SharingTaskRepository } from "App/Repositories/sharing-task.repository";
import { SharingTaskService } from "App/Services/sharing-task/sharing-task.service";
import { SharingTaskFactory } from "Database/factories/SharingTask";
import { TaskFactory } from "Database/factories/TaskFactory";
import { UserFactory } from "Database/factories/UserFactory";

async function setup() {
  const sharingTaskService = new SharingTaskService(new SharingTaskRepository());
  return { sharingTaskService };
}

async function beforeEachSetup() {
  return {
    paginationData: {
      withPagination: false,
      perPage: 3,
    },
    inputSharingTaskData: {

    },
  };
}

test.group("SharingTaskService", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return async () => await Database.rollbackGlobalTransaction();
  });

  test('should create a sharing task successfully', async ({ expect }) => {
    const inputSharingTaskData: any = {}
    const { sharingTaskService } = await setup()
    const user = await UserFactory.create()
    const task = await TaskFactory.create()
    inputSharingTaskData.taskId = task.id;
    inputSharingTaskData.userId = user.id;
    const result = await sharingTaskService.execute(inputSharingTaskData)
    delete result.created_at;
    delete result.id;
    delete result.updated_at;
    const newInputSharingTaskData = {
      user_id: inputSharingTaskData?.userId,
      task_id: inputSharingTaskData?.taskId
    };
    expect(result).toStrictEqual(newInputSharingTaskData);
  })

  test('should list sharing tasks withPagination', async ({ expect }) => {
    const { sharingTaskService } = await setup()
    const { paginationData } = await beforeEachSetup()
    paginationData.withPagination = true;
    paginationData.perPage = 10;
    await SharingTaskFactory.createMany(4)
    const result = await sharingTaskService.query(paginationData)
    expect((result as any).perPage).toEqual(10)
    expect((result as any).data.length).toEqual(4)
    expect((result as any).page).toEqual(1)
    expect((result as any).total).toEqual(4)
  })
  test('should list sharing tasks when withPagination is false', async ({ expect }) => {
    const { sharingTaskService } = await setup()
    const { paginationData } = await beforeEachSetup()
    await SharingTaskFactory.createMany(4)
    const result = await sharingTaskService.query(paginationData)
    expect((result as any).perPage).toBeUndefined()
    expect((result as any).data).toBeUndefined()
    expect((result as any).page).toBeUndefined()
    expect((result as any).total).toBeUndefined()
  })

  test("should be able to see another user's tasks if it was shared with him when pagination is true", async ({ expect }) => {
    const { sharingTaskService } = await setup()
    const { paginationData } = await beforeEachSetup()
    paginationData.withPagination = true
    const user = await UserFactory.create()
    const task = await TaskFactory.create()
    const sharingTask = await SharingTaskFactory.create()
    await sharingTask.merge({ userId: user.id, taskId: task.id }).save()
    const result = await sharingTaskService.query(paginationData, { userId: user.id });
    expect((result as any).data.length).toEqual(1)
    expect((result as any).perPage).toEqual(paginationData.perPage)
    expect((result as any).total).toEqual(1)
    expect((result as any).data[0].user).toBeDefined()
    expect((result as any).data[0].task).toBeDefined()
  })
  test("should be able to see another user's tasks if it was shared with him when pagination is false", async ({ expect }) => {
    const { sharingTaskService } = await setup()
    const { paginationData } = await beforeEachSetup()
    const user = await UserFactory.create()
    const task = await TaskFactory.create()
    const sharingTask = await SharingTaskFactory.create()
    await sharingTask.merge({ userId: user.id, taskId: task.id }).save()
    const result = await sharingTaskService.query(paginationData, { userId: user.id });
    expect((result as any).length).toEqual(1)
    expect((result as any).perPage).toBeUndefined()
    expect((result as any).total).toBeUndefined();
    expect((result as any)[0].user).toBeDefined()
    expect((result as any)[0].task).toBeDefined()
  })
})
