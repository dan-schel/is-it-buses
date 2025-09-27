export abstract class Collection<IdType extends string | number, T> {
  private _array: T[];
  private _map: Map<IdType, T>;

  constructor(items: T[]) {
    this._array = items;
    this._map = new Map(items.map((item) => [this._getID(item), item]));
  }

  protected abstract _getID(item: T): IdType;
  protected abstract _getRequireFailError(id: IdType): Error;
  protected abstract _getPredicateFailError(): Error;

  all(): T[] {
    return this._array;
  }

  get(id: IdType): T | null {
    return this._map.get(id) ?? null;
  }

  require(id: IdType): T {
    const item = this.get(id);
    if (item === null) {
      throw this._getRequireFailError(id);
    }
    return item;
  }

  has(id: IdType): boolean {
    return this._map.has(id);
  }

  map<X>(callback: (item: T) => X): X[] {
    return this._array.map(callback);
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this._array.filter(predicate);
  }

  first(predicate: (item: T) => boolean): T | null {
    return this._array.find(predicate) ?? null;
  }

  requireFirst(predicate: (item: T) => boolean): T {
    const item = this.first(predicate);
    if (item === null) {
      throw this._getPredicateFailError();
    }
    return item;
  }
}
