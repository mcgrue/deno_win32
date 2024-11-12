
const dll = Deno.dlopen("kernel32.dll", {
  GetLastError: {
    parameters: [],
    result: "i64",
  },
  FormatMessageW: {
    parameters: ["i64", "pointer", "i64", "i64", "pointer", "i64", "pointer"],
    result: "i64",
  },
});

function close() {
  dll.close();
}

function ptrAddrIsNull(ptr_address:bigint|null): boolean {
  return ptr_address === null || ptr_address === 0n;
}

// Function to create a pointer that could be nullptr
function createOptionalPointer(ptr_address:bigint|null): Deno.UnsafePointer | null {
  if (!ptrAddrIsNull(ptr_address)) {
    return Deno.UnsafePointer.create(ptr_address as bigint);
  } else {
    // Return null to represent a nullptr
    return null;
  }
}

export { close, dll, ptrAddrIsNull, createOptionalPointer };
