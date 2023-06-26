import { CreateShortnerInput } from "./create-shortner.input";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateShortnerInput extends PartialType(CreateShortnerInput) {
  id: string;
}
