export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T | null>;
  findById(id: string | number): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: string | number, data: Partial<T>): Promise<T>;
  delete(id: string | number): Promise<void>;
}
