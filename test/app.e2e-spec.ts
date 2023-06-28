import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { connect, Model, model, Schema } from "mongoose";
import { hashSync } from "bcrypt";

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

  const generateUser = async () => {
    const newPass = hashSync(defaultUser.password, 8);
    await userModel.create({
      email: defaultUser.email,
      password: newPass,
      name: defaultUser.name,
      avatar: defaultUser.avatar,
    });
  };

  beforeAll(async () => {
    await connect("mongodb://127.0.0.1:27017/urlshortner");

    userModel = model("users", new Schema({}, { strict: false }));
    expirecodeModel = model("expirecodes", new Schema({}, { strict: false }));

    await generateUser();
  });

  const loginDefaultUser = async () => {
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
        email: defaultUser.email,
        password: defaultUser.password,
      },
    };

    const { body } = await request(app.getHttpServer())
      .post("/graphql")
      .send({ query: mutation, variables: input });
    accessTokens.defaultUser = body.data.login.accessToken;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    await loginDefaultUser();
  });

  describe("authentication", () => {
    const authUser = {
      email: "authUser@gmail.com",
      password: "authUser",
      name: "authUser",
      avatar: "avatar",
    };

    let authUserAccessToken: string;

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
      authUserAccessToken = body.data.login.accessToken;
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
    });

    it("should delete user", async () => {
      const query = `
      query auth {
        deleteAccount {
          id
          deleted
        }
      }
      `;
      const { status, body } = await request(app.getHttpServer())
        .post("/graphql")
        .send({ query })
        .set("Authorization", `accessToken=${authUserAccessToken}`);

      expect(status).toBe(200);
      expect(body.data.deleteAccount).toHaveProperty("id");
      expect(body.data.deleteAccount).toHaveProperty("deleted");
      expect(body.data.deleteAccount.deleted).toBeTruthy();
    });
  });

  describe("url shortner", () => {
    let shortUrlId: string;

    it("should create short url", async () => {
      const query = `
      mutation urlShort($input: CreateShortnerInput!) {
        createShortUrl(cs: $input) {
          alias
          id
          destinationUrl
          expirationDate
          shortUrl
        }
      }
      `;

      const variables = {
        input: {
          alias: "name",
          destinationUrl: "https://mongxodb.com/nkvnd",
        },
      };

      const { status, body } = await request(app.getHttpServer())
        .post("/graphql")
        .send({
          query,
          variables,
        })
        .set("Authorization", `accessToken=${accessTokens.defaultUser}`);

      expect(status).toBe(200);
      expect(body.data.createShortUrl).toHaveProperty("id");
      shortUrlId = body.data.createShortUrl.id;
    });

    it("should update short url", async () => {
      const query = `
      mutation urlShort($input: UpdateShortnerInput!) {
        updateShortUrl(cs: $input) {
          alias
          id
        }
      }
      `;
      const variables = {
        input: {
          alias: "testName",
          destinationUrl: "https://hi.com/hello",
          id: shortUrlId,
        },
      };

      const { status, body } = await request(app.getHttpServer())
        .post("/graphql")
        .send({ query, variables })
        .set("Authorization", `accessToken=${accessTokens.defaultUser}`);
      expect(status).toBe(200);
      expect(body.data.updateShortUrl).toHaveProperty("id");
      expect(body.data.updateShortUrl).toHaveProperty("alias");
      expect(body.data.updateShortUrl.alias).toBe("testName");
    });

    it("should create QR code to url", async () => {
      const query = `
      mutation url {
        generateQRcode(linkId: "${shortUrlId}") {
          id
          QRcodeUrl
        }
      }`;

      const { status, body } = await request(app.getHttpServer())
        .post("/graphql")
        .send({ query });

      expect(status).toBe(200);
      expect(body.data.generateQRcode).toHaveProperty("id");
      expect(body.data.generateQRcode).toHaveProperty("QRcodeUrl");
      expect(typeof body.data.generateQRcode.QRcodeUrl).toBe("string");
    });

    it("should activate short url", async () => {
      const query = `
      mutation url {
        toggleLinkActivation(linkId: "${shortUrlId}", activate: true) {
          id
          isactive
        }
      }`;

      const { status, body } = await request(app.getHttpServer())
        .post("/graphql")
        .send({ query });

      expect(status).toBe(200);
      expect(body.data.toggleLinkActivation).toHaveProperty("id");
      expect(body.data.toggleLinkActivation).toHaveProperty("isactive");
      expect(body.data.toggleLinkActivation.isactive).toBeTruthy();
    });

    it("should dectivate short url", async () => {
      const query = `
      mutation url {
        toggleLinkActivation(linkId: "${shortUrlId}", activate: false) {
          id
          isactive
        }
      }`;

      const { status, body } = await request(app.getHttpServer())
        .post("/graphql")
        .send({ query });

      expect(status).toBe(200);
      expect(body.data.toggleLinkActivation).toHaveProperty("id");
      expect(body.data.toggleLinkActivation).toHaveProperty("isactive");
      expect(body.data.toggleLinkActivation.isactive).toBeFalsy();
    });

    it("should return all short links", async () => {
      const query = `
      query url {
        getAllLinks(limit: 2, page: 1) {
          id
        }
      }
      `;

      const { status, body } = await request(app.getHttpServer())
        .post("/graphql")
        .send({ query });

      expect(status).toBe(200);
      expect(Array.isArray(body.data.getAllLinks)).toBe(true);
      expect(body.data.getAllLinks[0]).toHaveProperty("id");
    });

    it("should delete short url", async () => {
      const query = `
      mutation shortUr {
        deleteUrl(shortUrlId: "${shortUrlId}") {
          id
          deleted
        }
      }
      `;

      const { status, body } = await request(app.getHttpServer())
        .post("/graphql")
        .send({ query })
        .set("Authorization", `accessToken=${accessTokens.defaultUser}`);

      expect(status).toBe(200);
      expect(body.data.deleteUrl).toHaveProperty("id");
      expect(body.data.deleteUrl).toHaveProperty("deleted");
      expect(body.data.deleteUrl.deleted).toBeTruthy();
    });
  });

  describe("user", () => {
    it("should update user data", async () => {
      const query = `
      mutation user($input: UpdateUserInput!) {
        updateProfile(user: $input) {
          id
          name
        }
      }
      `;
      const variables = {
        input: {
          name: "new name",
          avatar: "avatar",
        },
      };
      const { status, body } = await request(app.getHttpServer())
        .post("/graphql")
        .send({ query, variables })
        .set("Authorization", `accessToken=${accessTokens.defaultUser}`);
      expect(status).toBe(200);
      expect(body.data.updateProfile).toHaveProperty("id");
      expect(body.data.updateProfile).toHaveProperty("name");
      expect(body.data.updateProfile.name).toBe("new name");
    });

    it("should return user data", async () => {
      const query = `
      query user {
        user {
          id
          name
          avatar
        }
      }
      `;
      const { status, body } = await request(app.getHttpServer())
        .post("/graphql")
        .send({ query })
        .set("Authorization", `accessToken=${accessTokens.defaultUser}`);
      expect(status).toBe(200);
      expect(body.data.user).toHaveProperty("id");
      expect(body.data.user).toHaveProperty("name");
      expect(body.data.user).toHaveProperty("avatar");
    });
  });
});
