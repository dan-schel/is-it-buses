Generate some tests for ${file}.ts.

The tests should go tests/${file}.test.ts.

Use the structure:

```ts
import { describe, expect, it } from "vitest";
import { ClassName } from "@/server/some-class";

describe("ClassName", () => {
  describe("#method", () => {
    it("...", () => {
      //...
    });
  });
});
```

Note the `@/server/some-class` import. `@/` is an alias for the root directory, so it maps to `server/some-class.ts`.

If applicable, put the tests for the happy path first before ones for edge cases and errors.

Keep all tests as minimal as possible, and try to write as few tests as needed.

When you're done, test that the tests work with `npm run test` and fix any errors if they don't.
