import { faker } from '@faker-js/faker';


declare module '@faker-js/faker' {
  interface PersonModule {
    // Add the custom sciper method
    sciper(): number;
  }
}

// Extend faker.person with a custom sciper function
faker.person.sciper = function () {
  return faker.number.int({min: 100000, max: 999999})
};

export { faker };
