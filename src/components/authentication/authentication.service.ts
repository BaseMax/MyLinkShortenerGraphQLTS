import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../../models/user.model";
import { RegisterInput } from "./dto/register.input";
import { hashSync, compareSync } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { LoginInput } from "./dto/login.input";
import { createTransport, Transporter, SentMessageInfo } from "nodemailer";
import { ExpireCode } from "../../models/expireCode.model";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { ResetPasswordInput } from "./dto/resetPass.input";

@Injectable()
export class AuthenticationService {
  private readonly smtpServer: Transporter<SentMessageInfo>;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(ExpireCode.name)
    private readonly expirecodeModel: Model<ExpireCode>,
    private readonly jwtService: JwtService,
  ) {
    this.smtpServer = createTransport({
      host: process.env.SMTP_SERVER_HOST,
      port: process.env.SMTP_SERVER_PORT as unknown as number,
      secure: true,
      auth: {
        user: process.env.SMTP_SERVER_USERNAME,
        pass: process.env.SMTP_SERVER_PASSWORD,
      },
    });
  }

  private hashT(i: string) {
    return hashSync(i, 8);
  }

  private compareHash(i: string, h: string) {
    return compareSync(i, h);
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
      user: newUser,
      message: "user created successfuly",
      accepted: true,
    };
  }

  public async login({ email, password }: LoginInput) {
    const user = await this.userModel.findOne({ email });

    const ispasswordCorrect = this.compareHash(password, user.password || "");
    if (!user || !ispasswordCorrect)
      return {
        user: null,
        message: "user not found",
        accepted: false,
      };

    const accessToken = this.jwtService.sign({ id: user._id });
    return {
      accessToken,
      user,
      message: "login successful",
      accepted: true,
    };
  }

  public async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user)
      return {
        message: "user not found with this email",
        accepted: false,
      };

    const code = +`${Math.random()}`.split(".")[1].slice(0, 5);

    await this.expirecodeModel.create({ email: user.email, code });

    const { accepted } = (await this.smtpServer.sendMail({
      to: user.email,
      subject: "password reset",
      text: "this is your code",
      html: "<b>Hello world?</b>",
    })) as SMTPTransport.SentMessageInfo;

    return {
      message: "email sended to you",
      accepted: true,
      sendTo: accepted[0],
    };
  }

  public async resetPassword(rp: ResetPasswordInput) {
    const cx = await this.expirecodeModel.findOne({ code: rp.code });

    if ((cx.code || 0) !== rp.code || !cx)
      return {
        changed: false,
        accepted: false,
        message: "code is expired or not correct",
      };

    rp.password = this.hashT(rp.password);

    const { modifiedCount } = await this.userModel.updateOne(
      { email: cx.email },
      { $set: { password: rp.password } },
    );

    return {
      changed: modifiedCount >= 1 ? true : false,
      accepted: true,
      message: "your password changed",
    };
  }
}
