import { test } from "@japa/runner";
import { UserRepository } from "App/Repositories/user.repository";
import { UserService } from "App/Services/user/user.service";
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

test.group("UserService", () => {
  test("should list users without pagination when withPagination is false", async ({
    assert,
  }) => {
    const { paginationData } = await beforeEachSetup()
   paginationData.perPage = 0;
    const { userService } = await setup();

    const result = await userService.query(paginationData);
    assert.notExists((result as any).total);
    assert.notExists((result as any).page);
    assert.notExists((result as any).perPage);
  });
  test("should list users with pagination when withPagination is true", async ({
    assert,
  }) => {
    const { paginationData } = await beforeEachSetup();
    paginationData.perPage = 3;
    paginationData.withPagination = true;

    const { userService } = await setup();

    const result = await userService.query(paginationData);
    assert.equal((result as any).total, 1, "total should be 1");
    assert.equal((result as any).page, 1);
    assert.equal((result as any).perPage, 3);
    assert.isDefined((result as any).data);
  });

  test("should create user successfully", async ({ assert }) => {

    const { inputUserData } = await beforeEachSetup();

    const newinputUserData = {
      id: 2,
      email: "bro@gmail.com",
      age: 26,
      nome: 'Bro Gomes'
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
    inputUserData.email = ''
    const { userService } = await setup();

    const result = await userService.execute(inputUserData);
    assert.equal(result.error, "Email is required");
  });
  test("should not create user succefully if name is undefined or empty", async ({
    assert,
  }) => {

    const { inputUserData } = await beforeEachSetup();
    inputUserData.nome = ''
    const { userService } = await setup();

    const result = await userService.execute(inputUserData);
    assert.equal(result.error, "Name is required");
  });

  test("should not create user succefully if password is undefined or empty", async ({
    assert,
  }) => {
    const { inputUserData } = await beforeEachSetup();
    inputUserData.password = ''
    const { userService } = await setup();

    const result = await userService.execute(inputUserData);
    assert.equal(result.error, "Password is required");
  });

  test("should list just one user", async ({ assert }) => {
    const id = 1;
    const { userService } = await setup();
    const findOneSpy = sinon.spy(userService, "findOne");
    const result = await userService.findOne(id);

    assert.equal((result as any)?.id, id);
    assert.equal(findOneSpy.calledOnce, true);

    findOneSpy.restore();
  });
  test("should update a user succefully", async ({ assert }) => {
    let inputUserData = {
      id: 1,
      email: "pedro@gmail.com",
      age: 76,
      nome: 'Jorge'
    };

    const id = 1;
    const { userService } = await setup();
    const result = await userService.update(id, inputUserData);

    let resultInput = {
      email: result.email,
      age: result.age,
      id: result.id,
      nome: result.nome
    };

    assert.equal((result as any)?.id, id);

    assert.deepEqual(resultInput, inputUserData);
  });

  test("should delete a user successfully", async ({ assert }) => {
    const { userService } = await setup();
    const id = 1;
    await userService.delete(id);
    const user = userService.findOne(id);
    assert.notExists((user as any).id);
  });
});
