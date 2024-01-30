import { test } from "@japa/runner";
import { TaskRepository } from "App/Repositories/task.repository";
import { TaskService } from "App/Services/task/task.service";

async function setup() {
  const taskService = new TaskService(new TaskRepository())
  return { taskService }
}

async function beforeEachSetup() {
  return {
    paginationData: {
      withPagination: false,
      perPage: 3,
    },
    inputUserData: {

    },
  };
}

test.group('TaskService', () => {
  test('should list tasks without pagination', async ({ assert }) => {
    const { taskService } = await setup()
    const { paginationData } = await beforeEachSetup()
    paginationData.perPage = 0
    const result = await taskService.query(paginationData)
    assert.notExists((result as any).page)
    assert.notExists((result as any).perPage)
    assert.notExists((result as any).total)
  })
  test('should list tasks with pagination', async ({ assert }) => {
    const { taskService } = await setup()
    const { paginationData } = await beforeEachSetup()
    paginationData.withPagination = true
    const result = await taskService.query(paginationData)
    assert.equal((result as any).page, 1)
    assert.equal((result as any).perPage, 3)
    assert.equal((result as any).total, 1)
    assert.isDefined((result as any).data)
  })

  test("should list tasks with its relation with user when withPagination is true", async ({ assert }) => {
    const { taskService } = await setup();
    const { paginationData } = await beforeEachSetup();
    paginationData.withPagination = true;
    const result = await taskService.query(paginationData);

    assert.isDefined((result as any).data[0].user);
  });
  test("should list tasks with its relation with user when withPagination is false", async ({ assert }) => {
    const { taskService } = await setup();
    const { paginationData } = await beforeEachSetup();

    const result = await taskService.query(paginationData);

    assert.isDefined((result as any)[0].user);
  });

  test("should list tasks with its relation with priority when withPagination is true", async ({
    assert,
  }) => {
    const { taskService } = await setup();
    const { paginationData } = await beforeEachSetup();
    paginationData.withPagination = true;
    const result = await taskService.query(paginationData);

    assert.isDefined((result as any).data[0].priority);
  });

  test("should list tasks with its relation with user when withPagination is false", async ({
    assert,
  }) => {
    const { taskService } = await setup();
    const { paginationData } = await beforeEachSetup();

    const result = await taskService.query(paginationData);

    assert.isDefined((result as any)[0].priority);
  });
})
