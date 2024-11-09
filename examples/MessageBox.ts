import * as win32 from "../mod.ts";

win32.create_WNDCLASSA("Deno nono FFI");

const msgboxID = win32.MessageBox(
  null,
  "Hello BUTTS World\n你好，世界\nこんにちは世界\nBonjour le monde\nمرحبا بالعالم",
  "Deno nono FFI",
  win32.MB_YESNO | win32.MB_ICONWARNING,
);

switch (msgboxID) {
  case win32.IDYES:
    console.log("yes");
    break;
  case win32.IDNO:
    console.log("no");
    break;
  default:
    console.error("unreachable");
}
