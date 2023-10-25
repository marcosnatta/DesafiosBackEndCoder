import { fakerFR as faker } from "@faker-js/faker";
//import { Faker, fr } from "@faker-js/faker";

//const faker = new Faker({ locale: [fr] }); trae los productos en el idioma deseado

export const generateProduct = () => {
  const product = {
    id: faker.database.mongodbObjectId(),
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    category: faker.commerce.department(),
    stock: faker.number.int(100),
  };
  return product;
};