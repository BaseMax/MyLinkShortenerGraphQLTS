import { Module } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { AuthenticationResolver } from "./authentication.resolver";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import userSchema, { User } from "../../models/user.model";
import expireCodeSchema, { ExpireCode } from "../../models/expireCode.model";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRETKEY,
      signOptions: { expiresIn: "1000s" },
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
      {
        name: ExpireCode.name,
        schema: expireCodeSchema,
      },
    ]),
  ],
  providers: [AuthenticationResolver, AuthenticationService],
})
export class AuthenticationModule {}
