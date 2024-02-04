import Database from "@ioc:Adonis/Lucid/Database";
import { test, } from "@japa/runner";
import { UserRepository } from "App/Repositories/user.repository";
import { UserService } from "App/Services/user/user.service";
import { UserFactory } from "Database/factories/UserFactory";
import sinon from "sinon";

// Função comum para configuração antes dos testes
async function setup() {
  const userService = new UserService(new UserRepository());
  return { userService };
}

async function beforeEachSetup() {
  return {
    paginationData: {
      withPagination: false,
      perPage: 3,
    },
    inputUserData: {
      id: 2,
      email: "bro@gmail.com",
      password: "123",
      age: 26,
      nome: 'Bro Gomes'
    },
  };
}

test.group("UserService", (group) => {
  // Cria as migrações e apaga elas antes de cada teste
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return async () => await Database.rollbackGlobalTransaction();
  });

  test("should list users without pagination when withPagination is false", async ({
    assert,
  }) => {
    const { paginationData } = await beforeEachSetup();
    paginationData.perPage = 0;
    const { userService } = await setup();

    await UserFactory.createMany(4);

    const result = await userService.query(paginationData);

    assert.notExists((result as any).total);
    assert.notExists((result as any).page);
    assert.notExists((result as any).perPage);
    assert.isArray(result, "Result should be an array");
  });
  test("should list users with pagination when withPagination is true", async ({
    assert,
  }) => {
    const { paginationData } = await beforeEachSetup();
    paginationData.perPage = 3;
    paginationData.withPagination = true;

    const { userService } = await setup();

    await UserFactory.createMany(4);

    const result = await userService.query(paginationData);

    assert.equal((result as any).total, 4, "total should be 4");
    assert.equal((result as any).page, 1);
    assert.equal((result as any).perPage, 3);
    assert.isArray((result as any).data, "result.data should be an array");
  });

  test("should create user successfully", async ({ assert }) => {
    const { inputUserData } = await beforeEachSetup();

    const newinputUserData = {
      id: 2,
      email: "bro@gmail.com",
      age: 26,
      nome: "Bro Gomes",
    };
    const { userService } = await setup();
    const result = await userService.execute(inputUserData);

    delete result.created_at;
    delete result.updated_at;

    assert.deepEqual(result, newinputUserData);
  });

  test("should not create user succefully if email is undefined or empty", async ({
    assert,
  }) => {
    const { inputUserData } = await beforeEachSetup();
    inputUserData.email = "";
    const { userService } = await setup();

    const result = await userService.execute(inputUserData);
    assert.equal(result.error, "Email is required");
  });
  test("should not create user succefully if name is undefined or empty", async ({
    assert,
  }) => {
    const { inputUserData } = await beforeEachSetup();
    inputUserData.nome = "";
    const { userService } = await setup();

    const result = await userService.execute(inputUserData);
    assert.equal(result.error, "Name is required");
  });

  test("should not create user succefully if password is undefined or empty", async ({
    assert,
  }) => {
    const { inputUserData } = await beforeEachSetup();
    inputUserData.password = "";
    const { userService } = await setup();

    const result = await userService.execute(inputUserData);
    assert.equal(result.error, "Password is required");
  });

  test("should list just one user", async ({ assert }) => {
    const { userService } = await setup();

    const user = await UserFactory.create();

    const findOneSpy = sinon.spy(userService, "findOne");
    const result = await userService.findOne(user.id);

    assert.equal((result as any)?.id, user.id);
    assert.equal(findOneSpy.calledOnce, true);

    findOneSpy.restore();
  });
  test("should update a user succefully", async ({ assert }) => {
    let inputUserData = {
      email: "pedro@gmail.com",
      age: 76,
      nome: "Jorge",
    };

    const { userService } = await setup();
    const user = await UserFactory.create();
    const result = await userService.update(user.id, inputUserData);

    let resultInput = {
      email: result.email,
      age: result.age,
      id: result.id,
      nome: result.nome,
    };

    assert.equal((result)?.id, user.id);

    assert.deepEqual(resultInput, { ...inputUserData, id: user.id });
  });

  test("should delete a user successfully", async ({ assert }) => {
    const { userService } = await setup();
    const user = await UserFactory.create();

    await userService.delete(user.id);
    const deletedUser = await userService.findOne(user.id);

    assert.notExists((deletedUser as any).id);
  });
});
