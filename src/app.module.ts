import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose";
import { config } from "dotenv";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { resolve } from "path";
import { AuthenticationModule } from "./components/authentication/authentication.module";

config({
  path: resolve(__dirname, "../.env"),
});

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
    AuthenticationModule,
  ],
})
export class AppModule {}
