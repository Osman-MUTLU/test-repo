export function greet(name = "World") {
  if (typeof name !== "string") {
    throw new TypeError("name must be a string");
  }

  const normalizedName = name.trim();
  return `Hello, ${normalizedName || "World"}!`;
}

export function add(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new TypeError("a and b must be finite numbers");
  }

  return a + b;
}
