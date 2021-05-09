export const exportFile = (value: string, filename = "file.txt"): void => {
  const blob = new Blob([btoa(value)], { type: "text/plain" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importFile = (): void => {
  const input = document.createElement("input");
  input.type = "file";
  input.onchange = () => console.log("changed");
  document.body.appendChild(input);
  input.click();

  console.log(input);
};
