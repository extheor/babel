function @@foo(a, b, c) {
  return a + b + c;
}

expect(foo(1, 2, 3)).toBe(6);
expect(foo(1)(2, 3)).toBe(6);
expect(foo(1, 2)(3)).toBe(6);
expect(foo(1)(2)(3)).toBe(6);