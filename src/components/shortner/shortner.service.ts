import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { randomBytes } from "crypto";
import mongoose, { Model } from "mongoose";
import { ShortUrl } from "../../models/shorturl.model";
import { CreateShortnerInput } from "./dto/create-shortner.input";
import { UpdateShortnerInput } from "./dto/update-shortner.input";

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

  public async updateShortUrl(cs: UpdateShortnerInput) {
    const urlExists = await this.shortUrlModel.findOne({ _id: cs.id });
    if (!urlExists) return {};

    const id = cs.id;
    delete cs.id;

    const updateUrl = await this.shortUrlModel.findOneAndUpdate(
      { _id: id },
      { $set: cs },
      { returnOriginal: false },
    );
    return updateUrl;
  }
}
