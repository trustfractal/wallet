export const exportFile = (value: string, filename = "file.txt"): void => {
  console.log(value);

  const blob = new Blob([btoa(value)], { type: "text/plain" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importFile = (file: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
        try {
          if (event.target === null || event.target.result === null) {
            reject("Invalid file");
            return;
          }

          const value = event.target.result as string;

          resolve(atob(value));
        } catch (error) {
          reject(error);
        }
      });
      reader.readAsText(file);
    } catch (error) {
      reject(error);
    }
  });
};
