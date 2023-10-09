import {
  DeepPartial,
  EntityTarget,
  FindOptionsWhere,
  ObjectLiteral,
  Repository
} from "typeorm";
import { TypeORMProvider } from "../../../../main/database";
import { IBaseRepository } from "../interfaces/base-repository.interface";

/**
 * @param T: Entity
 * @param M: Model
 */
abstract class BaseRepository<T extends ObjectLiteral, M>
  implements IBaseRepository<T, M>
{
  // Propriedade que recebe a entidade do repositório
  protected entityClass!: EntityTarget<T>;

  // Método abstrato que recebe uma entity, mapeia e retorna uma model
  protected abstract mapToModel(item: T): M;

  protected getRepository(): Repository<T> {
    return TypeORMProvider.client.getRepository(this.entityClass);
  }

  async create(item: T): Promise<M> {
    const repository = this.getRepository();
    const result = await repository.save(item);

    return this.mapToModel(result);
  }

  async getById(id: string): Promise<M | null> {
    const repository = this.getRepository();
    const item = await repository.findOne({
      where: { ["id" as keyof T]: id } as FindOptionsWhere<T>,
    });

    return item ? this.mapToModel(item) : null;
  }

  async getByOne(key: string, value: string): Promise<M | null> {
    const repository = this.getRepository();
    const item = await repository.findOne({
      where: { [key]: value } as FindOptionsWhere<T>,
    });

    return item ? this.mapToModel(item) : null;
  }

  async update(id: string, item: DeepPartial<T>): Promise<M | null> {
    const repository = this.getRepository();
    const result = await repository.update(id, item);

    if (result.affected === 0) {
      return null;
    }

    const updatedItem = await repository.findOne({
      where: { ["id" as keyof T]: id } as FindOptionsWhere<T>,
    });

    return updatedItem ? this.mapToModel(updatedItem) : null;
  }

  async delete(key: string, value: string): Promise<void> {
    const repository = this.getRepository();
    const result = await repository.delete({
      [key]: value,
    } as FindOptionsWhere<T>);

    if (result.affected === 0) {
      throw new Error("Ocorreu um erro ao deletar este item.");
    }
  }

  public createEntityInstance(item: DeepPartial<T>): T {
    return TypeORMProvider.client.manager.create(this.entityClass, item);
  }
}

export { BaseRepository };

