import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { randomBytes } from "crypto";
import mongoose, { Model } from "mongoose";
import { ShortUrl } from "../../models/shorturl.model";
import { CreateShortnerInput } from "./dto/create-shortner.input";

@Injectable()
export class ShortnerService {
  constructor(
    @InjectModel(ShortUrl.name) private readonly shortUrlModel: Model<ShortUrl>,
  ) {}

  private generateMongoId(i: string) {
    return new mongoose.Types.ObjectId(i);
  }

  private generateRandomBytes(length?: number) {
    return randomBytes(length ? length : 10)
      .toString("hex")
      .concat(new Date().toISOString());
  }

  public async createShortUrl(cs: CreateShortnerInput) {
    const urlExists = await this.shortUrlModel.findOne({
      destinationUrl: cs.destinationUrl,
    });
    if (urlExists) return urlExists;

    const baseUrl = cs.destinationUrl.match(/^(https?:\/\/[^\/]+)/)[1];

    const randomString = this.generateRandomBytes();

    const shortUrl = baseUrl.concat("/", randomString);

    const su = await this.shortUrlModel.create({
      alias: cs.alias,
      destinationUrl: cs.destinationUrl,
      expirationDate: cs.expirationDate ? cs.expirationDate : null,
      shortUrl,
      userId: this.generateMongoId(cs.userId),
    });

    return su;
  }
}
