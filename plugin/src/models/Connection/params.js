/*
 * Inpage -> Content Script : ExtensionConnection
 * Script -> Inpage :  InpageConnection
 *
 * Script -> Background : Background Connection
 * Background -> Script : ContentScriptConnection
 */

const INPAGE = "fractal-inpage";
const CONTENT_SCRIPT = "fractal-contentscript";
const BACKGROUND = "fractal-background";

export const inpage = {
  name: CONTENT_SCRIPT,
  target: INPAGE,
};

export const extension = {
  name: INPAGE,
  target: CONTENT_SCRIPT,
};

export const background = {
  name: BACKGROUND,
};
