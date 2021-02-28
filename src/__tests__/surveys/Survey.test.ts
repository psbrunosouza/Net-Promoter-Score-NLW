import request from 'supertest';
import { app } from '../../app';
import createConnection from '../../database';
import { getConnection } from 'typeorm';

describe("Survey", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new Survey", async () => {
    const response = await request(app).post("/surveys").send({
      title: "Gostariamos de saber sua opnião",
	    description: "de 0 a 10 quanto você gostou do nosso serviço?",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("Should be able to get all Surveys", async () => {
    await request(app).post("/surveys").send({
      title: "Gostariamos de saber sua opnião novamente",
	    description: "de 0 a 5 quanto você gostou do nosso serviço?",
    });

    const response = await request(app).get("/surveys");

    expect(response.body.length).toBe(2);
  })
});