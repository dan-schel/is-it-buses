Generate some tests for the ${input:method:someMethodName} code in ${file}.ts.

Important: If the previous sentence contains "someMethodName", stop everything and ask me which method from the current file I want to generate tests for ("someMethodName" is a placeholder in this prompt's template).

The tests should go tests/${file}.test.ts (this file might already exist - if so, append to the tests already there).

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

Keep any new tests as minimal as possible, and try to write as few tests as needed.

Avoid modifying any existing tests unless absolutely necessary.

When you're done, test that the tests work with `npm run test` and fix any errors if they don't.
