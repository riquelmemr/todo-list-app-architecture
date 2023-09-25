interface IBaseRepository<T, M> {
  create(item: T): Promise<M>;
  getById(id: string): Promise<M | null>;
  getByOne(key: string, value: string): Promise<M | null>;
  update(id: string, item: any): Promise<M | null>;
  delete(key: string, value: string): Promise<void>;
}

export { IBaseRepository };

