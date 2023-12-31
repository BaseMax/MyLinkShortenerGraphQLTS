import { join, resolve } from "path";
import { config } from "dotenv";

config({
  path: resolve(__dirname, "../.env"),
});
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { AuthenticationModule } from "./components/authentication/authentication.module";
import { ShortnerModule } from "./components/shortner/shortner.module";
import { UserModule } from "./components/user/user.module";
import { ServeStaticModule } from "@nestjs/serve-static";

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      typePaths: ["src/components/**/*.graphql"],
      sortSchema: true,
      context: ({ req }) => ({ req }),
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          errors: error.extensions.originalError,
        } as any;
        return graphQLFormattedError;
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "public"),
      renderPath: "public",
    }),
    AuthenticationModule,
    ShortnerModule,
    UserModule,
  ],
})
export class AppModule {}
