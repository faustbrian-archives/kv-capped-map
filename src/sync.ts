import { IKeyValueStoreSync } from "@konceiver/kv";

export class StoreSync<K, T> implements IKeyValueStoreSync<K, T> {
	private constructor(private store: Map<K, T>, private maxSize: number) {
		this.resize(maxSize);
	}

	public static new<K, T>(maxSize: number): StoreSync<K, T> {
		return new StoreSync<K, T>(new Map<K, T>(), maxSize);
	}

	public all(): [K, T][] {
		return [...this.store.entries()];
	}

	public keys(): K[] {
		return [...this.store.keys()];
	}

	public values(): T[] {
		return [...this.store.values()];
	}

	public get(key: K): T | undefined {
		return this.store.get(key);
	}

	public getMany(keys: K[]): (T | undefined)[] {
		return [...keys].map((key: K) => this.get(key));
	}

	public pull(key: K): T | undefined {
		const item: T | undefined = this.get(key);

		this.forget(key);

		return item;
	}

	public pullMany(keys: K[]): (T | undefined)[] {
		const items: (T | undefined)[] = this.getMany(keys);

		this.forgetMany(keys);

		return items;
	}

	public put(key: K, value: T): boolean {
		if (this.store.size >= this.maxSize) {
			this.store.delete(this.store.keys().next().value);
		}

		this.store.set(key, value);

		return this.has(key);
	}

	public putMany(values: [K, T][]): boolean[] {
		return values.map((value: [K, T]) => this.put(value[0], value[1]));
	}

	public has(key: K): boolean {
		return this.store.has(key);
	}

	public hasMany(keys: K[]): boolean[] {
		return [...keys].map((key: K) => this.has(key));
	}

	public missing(key: K): boolean {
		return !this.has(key);
	}

	public missingMany(keys: K[]): boolean[] {
		return [...keys].map((key: K) => this.missing(key));
	}

	public forget(key: K): boolean {
		return this.store.delete(key);
	}

	public forgetMany(keys: K[]): boolean[] {
		return [...keys].map((key: K) => this.forget(key));
	}

	public flush(): boolean {
		this.store.clear();

		return this.count() === 0;
	}

	public count(): number {
		return this.store.size;
	}

	public isEmpty(): boolean {
		return this.count() === 0;
	}

	public isNotEmpty(): boolean {
		return !this.isEmpty();
	}

	public resize(maxSize: number): void {
		this.maxSize = maxSize;

		if (this.store.size > this.maxSize) {
			this.store = new Map<K, T>(this.all().slice(this.maxSize));
		}
	}
}
