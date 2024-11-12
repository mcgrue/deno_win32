import { assert, assertEquals, assertNotEquals } from "jsr:@std/assert";

import {ptrAddrIsNull} from "./dll.ts";


Deno.test("ptrAddrIsNull() returns true for null", () => {
  assertEquals(ptrAddrIsNull(null), true);
});

Deno.test("ptrAddrIsNull() returns true for 0n", () => {
  assertEquals(ptrAddrIsNull(0n), true);
});

Deno.test("ptrAddrIsNull() returns false for a non-zero BigInt", () => {
  assertEquals(ptrAddrIsNull(1n), false);
});
