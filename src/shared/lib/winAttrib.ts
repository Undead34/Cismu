import { IAttributeKeys, IAttributes } from "../types/cismu";
import { spawn } from "child_process";
import path from "path";
import os from "os";

function buildAttributeCommand(attributes: IAttributes, filePath: string) {
  const attributeKeys: IAttributeKeys = {
    archive: "A",
    hidden: "H",
    readonly: "R",
    system: "S",
  };

  const attribCommand = "attrib";
  const attributeFlags = Object.entries(attributes)
    .map(([key, value]: [keyof IAttributeKeys, any]) => {
      return value ? `+${attributeKeys[key]}` : `-${attributeKeys[key]}`;
    })
    .join("");
  const fullPath = path.join(filePath);

  return [attribCommand, attributeFlags, fullPath].join(" ");
}

export function setAttributes(filePath: string, attribs: IAttributes): Promise<string> {
  if (os.platform() === "win32") {
    const command = buildAttributeCommand(attribs, filePath);
    const spawnArgs = ["/c", command];

    return new Promise((resolve, reject) => {
      const process = spawn("cmd", spawnArgs);

      let commandOutput = "";

      process.stdout.on("data", (data) => {
        commandOutput += data.toString();
      });

      process.stderr.on("data", (data) => {
        reject(data.toString());
      });

      process.on("exit", () => {
        resolve(commandOutput);
      });
    });
  }
}
