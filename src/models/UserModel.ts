import { BaseModel } from "@/models/BaseModel";
import { UserId } from "@/types/UserId";

/**
 * UserModel
 * @model
 * @keit0728
 */
export class UserModel extends BaseModel<UserId> {
  /**
   * Constructor
   * You must create an instance with the static method `create`.
   * ```
   * export const dummyUser = UserModel.create({ id: "dummyId" });
   * ```
   */
  private constructor(
    public readonly privateKey: string = "",
    public readonly freePlay: boolean = true,
  ) {
    super("");
  }

  /**
   * Create instance
   * @param modifyObject modifyObject
   * @return {UserModel} UserModel
   */
  public static create(modifyObject: {
    [P in keyof UserModel]?: UserModel[P];
  }): UserModel {
    return new UserModel().copyWith(modifyObject);
  }
}
