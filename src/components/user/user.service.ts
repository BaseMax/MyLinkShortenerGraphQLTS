import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../../models/user.model";
import { UpdateUserInput } from "./dto/update-user.input";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly usermodel: Model<User>,
  ) {}

  public async updateProfile(id: string, updateUserInput: UpdateUserInput) {
    const updatedUser = await this.usermodel.findOneAndUpdate(
      { _id: id },
      { $set: updateUserInput },
      { returnOriginal: false },
    );
    return updatedUser;
  }

  public async getUser(id: string) {
    const user = await this.usermodel.findOne({ _id: id });
    return user;
  }
}
