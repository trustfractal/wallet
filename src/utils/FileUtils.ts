import { encode } from "js-base64";

export const exportFile = (value: string, filename = "file.txt"): void => {
  const blob = new Blob([encode(value)], { type: "text/plain" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
