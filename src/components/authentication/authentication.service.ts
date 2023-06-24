import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../../models/user.model";
import { RegisterInput } from "./dto/register.input";
import { hashSync, compareSync } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  private hashT(i: string) {
    return hashSync(i, 8);
  }

  private compareHash(h: string, i: string) {
    return compareSync(h, i);
  }

  public async register(ri: RegisterInput) {
    const userExists = await this.userModel.findOne({ email: ri.email });
    if (userExists)
      return {
        message: "user exists with this email",
        created: false,
      };

    ri.password = this.hashT(ri.password);

    const newUser = await this.userModel.create(ri);

    const accessToken = this.jwtService.sign({ id: newUser._id });

    return {
      accessToken,
      newUser,
      message: "user created successfuly",
      created: true,
    };
  }
}
