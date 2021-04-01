/*
 * Inpage -> Content Script : ExtensionConnection
 * Script -> Inpage :  InpageConnection
 *
 * Script -> Background : Background Connection
 * Background -> Script : ContentScriptConnection
 */

const INPAGE_ATTESTER = "fractal-inpage-attester";
const INPAGE_PUBLISHER = "fractal-inpage-publisher";
const CONTENT_SCRIPT_ATTESTER = "fractal-contentscript-attester";
const CONTENT_SCRIPT_PUBLISHER = "fractal-contentscript-publisher";
const BACKGROUND = "fractal-background";

export const inpage_attester = {
  name: CONTENT_SCRIPT_ATTESTER,
  target: INPAGE_ATTESTER,
};

export const inpage_publisher = {
  name: CONTENT_SCRIPT_PUBLISHER,
  target: INPAGE_PUBLISHER,
};

export const extension_attester = {
  name: INPAGE_ATTESTER,
  target: CONTENT_SCRIPT_ATTESTER,
};

export const extension_publisher = {
  name: INPAGE_PUBLISHER,
  target: CONTENT_SCRIPT_PUBLISHER,
};

export const background = {
  name: BACKGROUND,
};
