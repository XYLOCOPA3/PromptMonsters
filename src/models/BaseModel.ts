import { ObjectCopier } from "@/models/ObjectCopier";

/**
 * BaseModel
 * @model
 * @keit0728
 */
export class BaseModel<T = string> extends ObjectCopier {
  /**
   * Constructor
   * @param id ID
   * @param createdAt Created at date
   * @param updatedAt Updated at date
   */
  constructor(
    public readonly id: T,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {
    super();
  }
}
