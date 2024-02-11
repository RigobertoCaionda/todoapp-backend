# TODO APP Backend
This project is aimed at managing to-do lists, offering various features such as marking tasks as completed, sharing a certain task with other users, user activity history, the ability to list completed or incomplete tasks, etc. In this project we have also test coverage with nyc istambul.

##  Prerequisites
-First of all, create the database todo_app_database and a second database named todo_app_database_test which will be used for testing, in order not to pollute the original database.
- Node.js
- npm or Yarn

## Installation

1. Clone the master branch of the repository:
```
git clone https://github.com/RigobertoCaionda/todoapp-backend.git
```

2. Enter the todo-app-backend directory:
```
cd todo-app-backend
```
3. Install the dependencies:
```
npm install or yarn install
```
4. Create the ***.env*** file and copy the contents of the ***.env.sample*** file and update it with your local database information
```
cp .env.sample .env
```

5. Make sure that all migrations have already been run
```
 node ace migration:run
```

6. Now you can run the server:
```
node ace serve --watch
```

If everything went well up to this point, you'll have the server running locally on port 3333

```
http://localhost:3333

```

## Running the tests
-Use the command npm run test to run all tests.
- Use the command npm run test:cov to run tests and see if we've got our test threshold.
- Use the command npm run cov:report to see the test coverage in an html file.

## Code Example:

Method to create a new user within the user service:
public async execute(userDto: UserProps) {
    if (!userDto.email) {
      return {
        error: "Email is required"
       };
    }

    if (!userDto.password) {
      return {
        error: "Password is required"
      }
    }

    if (!userDto.name) {
      return {
        error: "Name is required",
      };
    }
    const newUser = await this.userRepository.create(userDto);
    return newUser
  }

Test of the method that creates a new user in the user service:
test("should create user successfully", async ({ assert }) => {
    const { inputUserData } = await beforeEachSetup();

    const newinputUserData = {
      id: 2,
      email: "bro@gmail.com",
      age: 26,
      name: "Bro Gomes",
    };
    const { userService } = await setup();
    const result = await userService.execute(inputUserData);

    delete result.created_at;
    delete result.updated_at;

    assert.deepEqual(result, newinputUserData);
  });

## Credits
This project was developed by Rigoberto Caionda.

## Contact
If you have any questions or suggestions, please contact via email rigobertocaionda98@gmail.com.
