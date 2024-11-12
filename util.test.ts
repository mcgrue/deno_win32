import { assert, assertEquals, assertNotEquals } from "jsr:@std/assert";

import * as util from "./util.ts";
import { uint8ArrayToFormattedHex } from "./util.ts";

Deno.test("cstr2ptrW() and readCString()", () => {
  // input string
  const str = `Manic Monday!`; 
  
  // convert string to pointer
  const ptr = util.cstr2ptrW(str) as unknown as Deno.PointerObject<unknown>;
  
  // validate pointer
  const ptr_val = Deno.UnsafePointer.value(ptr);
  assertNotEquals(ptr_val, null);

  // read string data from pointer
  const str2 = util.readCString(ptr);

  // assert they're the same
  assertEquals(str, str2);
  assertEquals(str.length, str2.length);
});

Deno.test("uint8ArrayToFormattedHex()", () => {

  const buffer = new ArrayBuffer(28);
  const uint8Array = new Uint8Array(buffer);
  
  for(let i=0; i<buffer.byteLength; i++) {
    uint8Array[i] = i;
  }

const expected = 
`00 01 02 03  04 05 06 07
08 09 0a 0b  0c 0d 0e 0f
10 11 12 13  14 15 16 17
18 19 1a 1b  \n`;

  const hex = uint8ArrayToFormattedHex(uint8Array);

  assertEquals(hex,expected);

});

Deno.test("zeroFillBigIntHex()", () => {
  const badFoodDec = 195948557;
  const badFoodHex = badFoodDec.toString(16);
  assertEquals(badFoodHex, "badf00d");

  const badFoodDecBigInt = BigInt(badFoodDec);
  assertEquals(util.zeroFillBigIntHex(badFoodDecBigInt), "000000000badf00d");
});

Deno.test("get_n_bytes_from_ptr()", () => {
  const buffer = new ArrayBuffer(8);
  const data = new Uint8Array(buffer);
  data[0] = 255;
  data[1] = 0;
  data[2] = 254;
  data[3] = 1;
  data[4] = 253;
  data[5] = 2;
  data[6] = 252;
  data[7] = 3;
  
  const ptr = Deno.UnsafePointer.of(data);
  assertNotEquals(ptr, null);

  const result = util.get_n_bytes_from_ptr(ptr as Deno.PointerObject, 1);
  assertEquals(1,result.byteLength)

  const resultAsUint8Array = new Uint8Array(result);
  assertEquals(resultAsUint8Array[0], 255)


  const result2 = util.get_n_bytes_from_ptr(ptr as Deno.PointerObject, 4);
  assertEquals(4,result2.byteLength)

  const result2AsUint8Array = new Uint8Array(result2);
  assertEquals(result2AsUint8Array[0], 255)
  assertEquals(result2AsUint8Array[1], 0)
  assertEquals(result2AsUint8Array[2], 254)
  assertEquals(result2AsUint8Array[3], 1)
});

Deno.test("dumpObjectProperties()", () => {
  const obj = {
    a: 1,
    b: "two",
    c: 3.0,
    d: true,
    fnOne : () => { return 1; },
    fnTwo : () => { return 1; },
  };

  const dump = util.dumpObjectProperties(obj);
  assert(dump.indexOf("Attribute: a = 1") > -1);
  assert(dump.indexOf("Attribute: b = two") > -1);
  assert(dump.indexOf("Attribute: c = 3") > -1);
  assert(dump.indexOf("Attribute: d = true") > -1);
  assert(dump.indexOf("Function: fnOne()") > -1);
  assert(dump.indexOf("Function: fnTwo()") > -1);
});


Deno.test("get_ptr_from_offset()", () => {
  const str = "Taco Tuesday!";
  const str_ptr = util.cstr2ptrW(str) as unknown as Deno.PointerObject<unknown>;
  assertNotEquals(str_ptr, null);

  // console.log(`string pointer is at ${util.zeroFillBigIntHex(Deno.UnsafePointer.value(str_ptr))}`);

  const buffer = new ArrayBuffer(24);
  const data = new Uint8Array(buffer);
  const dataView = new DataView(buffer);
  dataView.setBigUint64(3, Deno.UnsafePointer.value(str_ptr), true);
  const struct_ptr = Deno.UnsafePointer.of(data);

  assertNotEquals(struct_ptr, null);

  // console.log(`struct pointer is at ${util.zeroFillBigIntHex(Deno.UnsafePointer.value(struct_ptr))}`);
  // console.log(`${uint8ArrayToFormattedHex(data)}`)

  const view = new Deno.UnsafePointerView(struct_ptr as Deno.PointerObject);
  const resultBuffer = view.getArrayBuffer(8, 3);
  const resultDataView = new DataView(resultBuffer);

  // demonstrate that we can manually read the pointer value from the buffer
  {
    const result = resultDataView.getBigUint64(0, true);
    assertEquals(result, BigInt(Deno.UnsafePointer.value(str_ptr)));
    assertEquals(result, Deno.UnsafePointer.value(str_ptr));
    assertEquals(str, util.readCString(str_ptr));
    const from_val = Deno.UnsafePointer.create(result);
    assertEquals(str, util.readCString(from_val as unknown as Deno.PointerObject<unknown>));
  }

  {
    const from_fn = util.get_ptr_from_offset(struct_ptr as unknown as Deno.PointerObject<unknown>, 3);
    assertNotEquals(from_fn, null);

    // console.log(`extracted string pointer from struct at ${util.zeroFillBigIntHex(Deno.UnsafePointer.value(from_fn))}`);

    assertEquals(from_fn, str_ptr);

    assertEquals(str, util.readCString(from_fn));
  }
  

  // const dataView = new DataView(buffer);
  // dataView.setBigUint64(3, BigInt(65535), true);
  // console.log(`${uint8ArrayToFormattedHex(data)}`)

  // const backOut = dataView.getBigUint64(3, true);
  // assertEquals(backOut, BigInt(65535));
  
  // const backOutBadOffset = dataView.getBigUint64(2, true);
  // assertEquals(backOutBadOffset, BigInt(16776960)); // FF FF 00

  // do a workflow

  dataView.setBigUint64(3, Deno.UnsafePointer.value(str_ptr), true);
  
  dataView.setBigUint64(11, Deno.UnsafePointer.value(str_ptr), true);
});


// 
// create_WNDCLASSA
// get_n_bytes_from_ptr
// get_ptr_from_offset

// cstr2ptrW
// readCString
// uint8ArrayToFormattedHex