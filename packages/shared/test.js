import assert from "node:assert/strict";
import test from "node:test";
import { add, greet } from "./index.js";

test("greet uses World when no name is provided", () => {
  assert.equal(greet(), "Hello, World!");
});

test("greet includes the supplied name", () => {
  assert.equal(greet("Ada Lovelace"), "Hello, Ada Lovelace!");
});

test("greet uses World for empty or whitespace-only names", () => {
  assert.equal(greet(""), "Hello, World!");
  assert.equal(greet("   \t"), "Hello, World!");
});

test("greet trims surrounding whitespace from a name", () => {
  assert.equal(greet("  Ada  "), "Hello, Ada!");
});

test("greet rejects non-string names", () => {
  assert.throws(() => greet(null), TypeError);
});

test("add returns the sum of finite numbers", () => {
  assert.equal(add(2, 3), 5);
  assert.equal(add(-1.5, 0.5), -1);
});

test("add rejects non-numbers and non-finite values", () => {
  for (const [a, b] of [["2", 3], [NaN, 1], [1, Infinity], [1, -Infinity]]) {
    assert.throws(() => add(a, b), TypeError);
  }
});
