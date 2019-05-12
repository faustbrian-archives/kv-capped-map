// tslint:disable: no-unsafe-any
import "jest-extended";
import { StoreSync } from "../src";

describe("Capped Map", () => {
	it("should set and get an entry", () => {
		const store = new StoreSync<string, number>(100);
		store.put("foo", 1);
		store.put("bar", 2);

		expect(store.get("foo")).toBe(1);
		expect(store.count()).toBe(2);
	});

	it("should get an entry", () => {
		const store = new StoreSync<string, number>(2);
		store.put("1", 1);
		store.put("2", 2);

		expect(store.get("1")).toBe(1);
		expect(store.get("3")).toBeUndefined();

		store.put("3", 3);

		expect(store.has("1")).toBeFalse();
		expect(store.has("2")).toBeTrue();
		expect(store.has("3")).toBeTrue();
	});

	it("should set entries and remove ones that exceed the maximum size", () => {
		const store = new StoreSync<string, number>(2);
		store.put("foo", 1);
		store.put("bar", 2);

		expect(store.get("foo")).toBe(1);
		expect(store.get("bar")).toBe(2);

		store.put("baz", 3);
		store.put("faz", 4);

		expect(store.has("foo")).toBeFalse();
		expect(store.has("bar")).toBeFalse();
		expect(store.has("baz")).toBeTrue();
		expect(store.has("faz")).toBeTrue();
		expect(store.count()).toBe(2);
	});

	it("should update an entry", () => {
		const store = new StoreSync<string, number>(100);
		store.put("foo", 1);

		expect(store.get("foo")).toBe(1);

		store.put("foo", 2);

		expect(store.get("foo")).toBe(2);
		expect(store.count()).toBe(1);
	});

	it("should return if an entry exists", () => {
		const store = new StoreSync<string, number>(100);
		store.put("1", 1);

		expect(store.has("1")).toBeTrue();
	});

	it("should remove the specified entrys", () => {
		const store = new StoreSync<string, number>(100);
		store.put("1", 1);
		store.put("2", 2);

		expect(store.forget("1")).toBeTrue();
		expect(store.has("1")).toBeFalse();
		expect(store.has("2")).toBeTrue();
		expect(store.forget("1")).toBeFalse();
		expect(store.count()).toBe(1);
	});

	it("should remove the specified entrys", () => {
		const store = new StoreSync<string, number>(2);
		store.put("1", 1);
		store.put("2", 2);

		expect(store.count()).toBe(2);
		expect(store.forget("1")).toBeTrue();
		expect(store.has("1")).toBeFalse();
		expect(store.has("2")).toBeTrue();

		store.forget("2");

		expect(store.count()).toBe(0);
	});

	it("should remove all entrys", () => {
		const store = new StoreSync<string, number>(3);
		store.put("1", 1);
		store.put("2", 2);
		store.put("3", 3);

		expect(store.count()).toBe(3);

		store.flush();

		expect(store.count()).toBe(0);
	});

	it("should return the keys", () => {
		const store = new StoreSync<string, number>(3);
		store.put("1", 1);
		store.put("2", 2);
		store.put("3", 3);

		expect(store.keys()).toEqual(["1", "2", "3"]);
	});

	it("should return the values", () => {
		const store = new StoreSync<string, number>(3);
		store.put("1", 1);
		store.put("2", 2);
		store.put("3", 3);

		expect(store.values()).toEqual([1, 2, 3]);
	});

	it("should return the entry count", () => {
		const store = new StoreSync<string, number>(100);
		store.put("1", 1);
		store.put("2", 2);

		expect(store.count()).toBe(2);

		store.forget("1");

		expect(store.count()).toBe(1);

		store.put("3", 3);

		expect(store.count()).toBe(2);
	});

	it("should resize the map", () => {
		const store = new StoreSync<string, number>(3);
		store.put("1", 1);
		store.put("2", 2);
		store.put("3", 3);

		expect(store.count()).toBe(3);

		store.resize(4);
		store.put("1", 1);
		store.put("2", 2);
		store.put("3", 3);
		store.put("4", 4);
		store.put("5", 5);

		expect(store.count()).toBe(4);
		expect(store.has("1")).toBeFalse();
		expect(store.has("2")).toBeTrue();
		expect(store.has("3")).toBeTrue();
		expect(store.has("4")).toBeTrue();
		expect(store.has("5")).toBeTrue();

		expect(store.count()).toBe(4);

		store.resize(2);

		expect(store.count()).toBe(2);
		expect(store.has("1")).toBeFalse();
		expect(store.has("2")).toBeFalse();
		expect(store.has("3")).toBeFalse();
		expect(store.has("4")).toBeTrue();
		expect(store.has("5")).toBeTrue();
	});
});
