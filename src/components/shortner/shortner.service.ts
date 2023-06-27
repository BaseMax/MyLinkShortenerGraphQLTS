import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { randomBytes } from "crypto";
import mongoose, { Model } from "mongoose";
import { ShortUrl } from "../../models/shorturl.model";
import { CreateShortnerInput } from "./dto/create-shortner.input";
import { UpdateShortnerInput } from "./dto/update-shortner.input";
import { toFile } from "qrcode";
import { resolve } from "path";
import { existsSync, mkdirSync } from "fs";

@Injectable()
export class ShortnerService {
  constructor(
    @InjectModel(ShortUrl.name) private readonly shortUrlModel: Model<ShortUrl>,
  ) {
    this.createPublicFolder();
  }

  private createPublicFolder() {
    const fp = resolve(__dirname, `../../public/`);
    if (!existsSync(fp)) mkdirSync(fp);
  }

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

    if (!cs.shortUrl) {
      const baseUrl = cs.destinationUrl.match(/^(https?:\/\/[^\/]+)/)[1];
      const randomString = this.generateRandomBytes();
      cs.shortUrl = baseUrl.concat("/", randomString);
    }

    const su = await this.shortUrlModel.create({
      alias: cs.alias,
      destinationUrl: cs.destinationUrl,
      expirationDate: cs.expirationDate ? cs.expirationDate : null,
      shortUrl: cs.shortUrl,
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

  public async deleteUrl(sui: string) {
    const { deletedCount } = await this.shortUrlModel.deleteOne({ _id: sui });
    return {
      id: sui,
      deleted: deletedCount >= 1 ? true : false,
    };
  }

  public async generateQRcode(linkId: string) {
    const shortUrl = await this.shortUrlModel.findOne({ _id: linkId });
    if (!shortUrl) return {};
    if (shortUrl.QRcodePath)
      return {
        id: linkId,
        QRcodeUrl: shortUrl.QRcodePath,
      };

    const baseUrl = process.env.PUBLIC_FILE_URL;
    const fileName = `${this.generateRandomBytes(12)}.png`;
    const QRcodePath = baseUrl.concat(fileName);

    const si = await this.shortUrlModel.findOneAndUpdate(
      { _id: linkId },
      { $set: { QRcodePath } },
      { returnOriginal: false },
    );

    toFile(resolve(__dirname, `../../public/${fileName}`), QRcodePath);

    return {
      id: linkId,
      QRcodeUrl: si.QRcodePath,
    };
  }

  public async toggleLinkActivation(id: string, isactive: boolean) {
    const story = await this.shortUrlModel.findOneAndUpdate(
      { _id: id },
      { $set: { isactive } },
      { returnOriginal: false },
    );
    return story;
  }
}
