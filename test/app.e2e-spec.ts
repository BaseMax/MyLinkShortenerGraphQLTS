import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { connect, Model, model, Schema } from "mongoose";

describe("AppController (e2e)", () => {
  const defaultUser = {
    email: "test@gmail.com",
    name: "test",
    password: "test",
    avatar: "test@",
  };

  const accessTokens = {
    defaultUser: "",
  };

  let app: INestApplication;

  // models
  let userModel: Model<any>;

  beforeEach(async () => {
    await connect("mongodb://127.0.0.1:27017/urlshortner");

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    userModel = model("users", new Schema({}, { strict: false }));
    await userModel.deleteMany({});
  });

  describe("authentication", () => {
    it("should register successfuly", async () => {
      const mutation = `
      mutation auth($input: registerInput!) {
        register(ri: $input) {
         accessToken
         created
         newUser {
            id
          }
        }
      }
      `;
      const input = {
        input: defaultUser,
      };

      const { status, body } = await request(app.getHttpServer())
        .post("/graphql")
        .send({ query: mutation, variables: input });

      accessTokens.defaultUser = body.data.register.accessToken;

      expect(status).toBe(200);
      expect(body.data.register).toHaveProperty("newUser");
      expect(body.data.register.newUser).toHaveProperty("id");
      expect(body.data.register).toHaveProperty("accessToken");
      expect(body.data.register).toHaveProperty("created");
      expect(body.data.register.created).toBeTruthy();
    });
  });
});
