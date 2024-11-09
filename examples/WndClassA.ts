import * as win32 from "../mod.ts";
import * as util from "../util.ts";

const ptr = win32.create_WNDCLASSA("Taco Tuesday!");

const ptr_val = Deno.UnsafePointer.value(ptr);

console.log(`struct pointer ${util.zeroFillBigIntHex(ptr_val, 64)}`);

// const ptr_2 = Deno.UnsafePointer.offset(ptr, 64);
// const ptr_val_2 = Deno.UnsafePointer.value(ptr_2);
// console.log(`string pointer ${util.zeroFillBigIntHex(ptr_val_2, 64)}`);

console.log(`string pointer? ${util.zeroFillBigIntHex(util.get_ptr_from_offset(ptr, 64), 64)}`);

// const str = util.readCString(ptr_2);
// console.log(`string: ${str}`);



// console.log(`The contents of the last 8 bytes of the WINDCLASSA ptr should be 'Taco Tuesday!', they are: ${util.readCString(Deno.UnsafePointer.offset(ptr, 64/4))}`);

