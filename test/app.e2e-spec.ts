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
  let expirecodeModel: Model<any>;

  beforeAll(async () => {
    await connect("mongodb://127.0.0.1:27017/urlshortner");

    userModel = model("users", new Schema({}, { strict: false }));
    expirecodeModel = model("expirecodes", new Schema({}, { strict: false }));
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  describe("authentication", () => {
    const authUser = {
      email: "authUser@gmail.com",
      password: "authUser",
      name: "authUser",
      avatar: "avatar",
    };
    it("should register successfuly", async () => {
      const mutation = `
      mutation auth($input: registerInput!) {
        register(ri: $input) {
         accessToken
         accepted
         user {
            id
          }
        }
      }
      `;
      const input = {
        input: authUser,
      };

      const { status, body } = await request(app.getHttpServer())
        .post("/graphql")
        .send({ query: mutation, variables: input });

      expect(status).toBe(200);
      expect(body.data.register).toHaveProperty("user");
      expect(body.data.register.user).toHaveProperty("id");
      expect(body.data.register).toHaveProperty("accessToken");
      expect(body.data.register).toHaveProperty("accepted");
      expect(body.data.register.accepted).toBeTruthy();
    });

    it("should login successfuly", async () => {
      const mutation = `
      mutation auth($input: loginInput!) {
        login(ri: $input) {
         accessToken
         accepted
         user {
            id
          }
        }
      }
      `;
      const input = {
        input: {
          email: authUser.email,
          password: authUser.password,
        },
      };

      const { status, body } = await request(app.getHttpServer())
        .post("/graphql")
        .send({ query: mutation, variables: input });

      expect(status).toBe(200);
      expect(body.data.login).toHaveProperty("user");
      expect(body.data.login.user).toHaveProperty("id");
      expect(body.data.login).toHaveProperty("accessToken");
      expect(body.data.login).toHaveProperty("accepted");
      expect(body.data.login.accepted).toBeTruthy();
    });

    it("should send email for password reset", async () => {
      const mutation = `
      mutation auth {
        forgotPassword(email: "${authUser.email}") {
          accepted
            message
            sendTo
        }
      }
      
      `;
      const { status, body } = await request(app.getHttpServer())
        .post("/graphql")
        .send({ query: mutation });

      expect(status).toBe(200);
      expect(body.data.forgotPassword).toHaveProperty("accepted");
      expect(body.data.forgotPassword).toHaveProperty("message");
      expect(body.data.forgotPassword).toHaveProperty("sendTo");
      expect(body.data.forgotPassword.accepted).toBeTruthy();
      expect(typeof body.data.forgotPassword.sendTo).toBe("string");
    });

    it("should change password", async () => {
      const ex = await expirecodeModel.findOne({ email: authUser.email });

      const mutation = `
      mutation auth {
        resetPassword(rp: {
          code: ${ex.code}
          password: "test2"
        }) {
          accepted
          changed
          message
        }
      }
      `;

      const { status, body } = await request(app.getHttpServer())
        .post("/graphql")
        .send({ query: mutation });

      expect(status).toBe(200);
      expect(body.data.resetPassword).toHaveProperty("accepted");
      expect(body.data.resetPassword.accepted).toBeTruthy();
      expect(body.data.resetPassword).toHaveProperty("changed");
      expect(body.data.resetPassword.changed).toBeTruthy();
      await userModel.deleteOne({ email: authUser.email });
    });
  });
});
