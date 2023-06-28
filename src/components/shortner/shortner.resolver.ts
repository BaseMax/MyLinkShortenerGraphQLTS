import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import User, { Iuser } from "../../decorator/user.decorator";
import { CreateShortnerInput } from "./dto/create-shortner.input";
import { UpdateShortnerInput } from "./dto/update-shortner.input";
import { ShortnerService } from "./shortner.service";

@Resolver("Shortner")
export class ShortnerResolver {
  constructor(private readonly shortnerService: ShortnerService) {}

  @Mutation("createShortUrl")
  public async createShortUrl(
    @Args("cs") cs: CreateShortnerInput,
    @User() { id }: Iuser,
  ) {
    cs["userId"] = id;
    return await this.shortnerService.createShortUrl(cs);
  }

  @Mutation("updateShortUrl")
  public async updateShortUrl(@Args("cs") cs: UpdateShortnerInput) {
    return await this.shortnerService.updateShortUrl(cs);
  }

  @Mutation("deleteUrl")
  public async deleteUrl(@Args("shortUrlId") sui: string) {
    return await this.shortnerService.deleteUrl(sui);
  }

  @Mutation("generateQRcode")
  public async generateQRcode(@Args("linkId") linkId: string) {
    return await this.shortnerService.generateQRcode(linkId);
  }

  @Mutation("toggleLinkActivation")
  public async toggleLinkActivation(
    @Args("linkId") linkId: string,
    @Args("activate") activate: boolean,
  ) {
    return await this.shortnerService.toggleLinkActivation(linkId, activate);
  }

  @Query("getAllLinks")
  public async getAllLinks(
    @Args("limit") limit: number,
    @Args("page") page: number,
  ) {
    return await this.shortnerService.getAllLinks(limit, page);
  }

  @Query("getLink")
  public async getLink(@Args("id") id: string) {
    return await this.shortnerService.getLink(id);
  }

  @Query("getLinkbyShortenedURL")
  public async getLinkbyShortenedURL(@Args("url") url: string) {
    return await this.shortnerService.getLinkbyShortenedURL(url);
  }

  @Query("getMyLinks")
  public async getMyLinks(
    @Args("limit") limit: number,
    @Args("page") page: number,
    @User() { id }: Iuser,
  ) {
    return await this.shortnerService.getMyLinks(id, limit, page);
  }
}
