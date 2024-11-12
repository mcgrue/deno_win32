/**
 * Windows represents Unicode characters using UTF-16 encoding, in which each
 * character is encoded as a 16-bit value.
 * UTF-16 characters are called **wide** characters, to distinguish them from
 * 8-bit ANSI characters.
 *
 * Windows providing two parallel sets of APIs, one for ANSI strings and the
 * other for Unicode strings. For example, there are two functions to displays
 * a modal dialog box:
 *
 * - `MessageBoxA` - takes an ANSI string.
 * - `MessageBoxW` - takes a Unicode string.
 *
 * Javascript already uses UTF-16 internally - use `charCodeAt()`  to get the values.
 */
export function cstr2ptrW(cstr: string) : Deno.UnsafePointer {
  const buffer = new ArrayBuffer((cstr.length + 1) * 2);
  const u16 = new Uint16Array(buffer);
  for (let i = 0; i <= cstr.length; i++) {
    u16[i] = cstr.charCodeAt(i);
  }
  const ptr = Deno.UnsafePointer.of(u16);
  if (ptr === null) {
    throw new Error("Failed to create UnsafePointer");
  }

  return ptr;
}

export function uint8ArrayToFormattedHex(uint8Array: Uint8Array): string {
  const hexArray = Array.from(uint8Array)
    .map(byte => byte.toString(16).padStart(2, '0'));

  let formattedString = '';
  for (let i = 0; i < hexArray.length; i += 8) {
    const row = hexArray.slice(i, i + 8);
    formattedString += row.slice(0, 4).join(' ') + '  ' + row.slice(4).join(' ') + '\n';
  }

  return formattedString;
}

export function zeroFillBigIntHex(value: bigint): string {

  if(typeof value === 'object')
  {
    console.log('Dumping object');
    debugger;
    dumpObjectProperties(value);
    console.log('Done Dumping object');
  }

  

  console.log(`typeof value: ${typeof value}`);

  console.log(`value: ${value.valueOf()}`);
  
  const hexval = value.toString(16);
  console.log(`hexval: ${hexval}`);
  // const cur_length = hexval.length;

  return hexval.padStart(16, '0');
}

export function create_WNDCLASSA(className: string) : Deno.UnsafePointer {

  /*
    UINT style - Offset: 0 bytes (4 bytes in size)
    WNDPROC lpfnWndProc - Offset: 8 bytes (8 bytes in size)
    int cbClsExtra - Offset: 16 bytes (4 bytes in size)
    int cbWndExtra - Offset: 20 bytes (4 bytes in size)
    HINSTANCE hInstance - Offset: 24 bytes (8 bytes in size)
    HICON hIcon - Offset: 32 bytes (8 bytes in size)
    HCURSOR hCursor - Offset: 40 bytes (8 bytes in size)
    HBRUSH hbrBackground - Offset: 48 bytes (8 bytes in size)
    LPCSTR lpszMenuName - Offset: 56 bytes (8 bytes in size)
    LPCSTR lpszClassName - Offset: 64 bytes (8 bytes in size)
  */

  const buffer = new ArrayBuffer(72);
  const uint8Array = new Uint8Array(buffer);
  const dataView = new DataView(buffer);

  const unsafe_className_ptr = cstr2ptrW(className);
  const bigint_className_ptrval = Deno.UnsafePointer.value(unsafe_className_ptr as Deno.PointerObject);

  console.log(`string pointer 0x${zeroFillBigIntHex(bigint_className_ptrval)}`);

  dataView.setBigUint64(64, bigint_className_ptrval, true);

  console.log(uint8ArrayToFormattedHex(uint8Array));

  console.log( `cstr back out: ${readCString(unsafe_className_ptr)}` );

  const ptr = Deno.UnsafePointer.of(uint8Array);

  if(ptr === null) {
    throw new Error("Failed to create UnsafePointer");
  } else {
    console.log(`struct pointer (internal) 0x${zeroFillBigIntHex(Deno.UnsafePointer.value(ptr))}`);
  }

  return ptr;
}

export function get_n_bytes_from_ptr(ptr: Deno.UnsafePointer, n: number): ArrayBuffer { 
  if(n<0) {
    throw new Error("n must be greater than or equal to 0");
  }

  const buffer = new ArrayBuffer(n);
  const view = new Deno.UnsafePointerView(ptr as Deno.PointerObject);
  const uint8Array = new Uint8Array(buffer);

  for (let i = 0; i < 64; i++) {
    uint8Array[i] = view.getUint8(i);
  }

  return buffer;
}

export function get_ptr_from_offset(ptr: Deno.UnsafePointer, offsetInBytes: number): Deno.PointerObject<unknown> {

  if(offsetInBytes < 0 ) {
    throw new Error("offsetInBytes must be greater than or equal to 0");
  }

  const ptrSize = 8; // 64-bit pointer size

  const ptr_offs = Deno.UnsafePointer.offset(ptr as unknown as Deno.PointerObject, offsetInBytes)

  const buffer = get_n_bytes_from_ptr(ptr_offs as Deno.UnsafePointer, ptrSize);
  const ptrDataView = new DataView(buffer);

  const result = Deno.UnsafePointer.create(ptrDataView.getBigUint64(0, true));
  if(result === null) {
    throw new Error("Failed to create UnsafePointer");
  }
  
  return result;
}

export function readCString(ptr: Deno.UnsafePointer): string {

  if (ptr === null) {
    return "";
  } else {
    const view = new Deno.UnsafePointerView(ptr as Deno.PointerObject);

    let cstr = '';
    let offset = 0;
    let charCode;

    while ((view.getUint16(offset)) !== 0) {
      charCode = view.getUint8(offset);
      const char = String.fromCharCode(charCode);
      // console.log(`char: ${char}`);
      cstr += char;

      ++offset;
      ++offset;
    }

    return cstr;
  }
}

export function dumpObjectProperties(obj: object): string {
  const propertyNames = Object.getOwnPropertyNames(obj);

  let ret = "";

  propertyNames.forEach(propertyName => {
    const propertyValue = (obj as any)[propertyName];
    const propertyType = typeof propertyValue;

    if (propertyType === 'function') {
      const msg = `Function: ${propertyName}()`;
      console.log(msg);
      ret += msg + '\n';
    } else {
      const msg = `Attribute: ${propertyName} = ${propertyValue}`;
      console.log(msg);
      ret += msg + '\n';
    }

  });

  return ret;
}