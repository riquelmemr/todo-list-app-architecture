interface ICacheRepository {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<"OK">;
  delete(key: string): Promise<number>;
}

export { ICacheRepository };

