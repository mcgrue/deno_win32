import * as win32 from "../mod.ts";
import * as util from "../util.ts";

const ptr = win32.create_WNDCLASSA("Taco Tuesday!");

console.log(`ptr from create_WNDCLASSA: ${Deno.UnsafePointer.value(ptr)}`);




// const str = util.readCString(ptr_2);
// console.log(`string: ${str}`);
// console.log(`The contents of the last 8 bytes of the WINDCLASSA ptr should be 'Taco Tuesday!', they are: ${util.readCString(Deno.UnsafePointer.offset(ptr, 64/4))}`);

