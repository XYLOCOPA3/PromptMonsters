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
   * @param name user name
   * @param email email
   * @param icon icon
   */
  private constructor(
    public readonly name: string = "",
    public readonly email: string = "",
    public readonly icon: string = "",
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
