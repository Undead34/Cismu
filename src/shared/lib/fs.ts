import { v4 as uuid } from "uuid";
import { promisify } from "util";
import path from "path";
import glob from "glob";
import fs from "fs";

type TData = number | string | boolean | null | undefined | symbol | NodeJS.ArrayBufferView;

interface IOptions {
  atomic?: boolean;
  mode?: number;
  encoding?: BufferEncoding;
  chown?: {
    uid: number;
    gid: number;
  };
}

function randomTempName(): string {
  return "." + uuid();
}

/**
 * Writes data to a file at the specified path.
 * @param path Path of the file to write.
 * @param data Data to write to the file. Can be of type number, string, boolean, null, undefined, symbol or NodeJS.ArrayBufferView.
 * @param options Write options.
 * A promise that is resolved when the data has been written to the file.
 */
async function write(filePath: string, data: TData, options: IOptions): Promise<void> {
  try {
    const isPrimitive = (typeof data !== "object" && typeof data !== "function") || data === null;
    const tempPath = path.join(path.dirname(filePath), randomTempName());

    if (!fs.existsSync(path.dirname(tempPath))) {
      await promisify(fs.mkdir)(path.dirname(tempPath));
    }

    const fd = await promisify(fs.open)(options.atomic ? tempPath : filePath, "w", options.mode || 0o666);

    if (ArrayBuffer.isView(data)) {
      // If the data is an ArrayBufferView, it writes it as an ArrayBufferView.
      await promisify(fs.write)(fd, data, 0, data.byteLength, 0);
    } else if (isPrimitive) {
      // If the data are primitive, it writes them with the encoding specified in the options
      await promisify(fs.write)(fd, data.toString(), null, options.encoding || "utf-8");
    } else {
      // If the data is not compatible, it throws an error
      throw new Error("The data provided is not supported. Only ArrayBufferView and primitive data are supported.");
    }

    await promisify(fs.close)(fd);

    // Updates the file permissions if they were specified in the options
    if (options.chown) {
      await promisify(fs.chown)(tempPath, options.chown.uid, options.chown.gid);
    }

    if (options.mode) {
      await promisify(fs.chmod)(tempPath, options.mode);
    }

    if (options.atomic) {
      await promisify(fs.rename)(tempPath, filePath);
    }
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Writes data to a file at the specified path.
 * @param path Path of the file to write.
 * @param data Data to write to the file. Can be of type number, string, boolean, null, undefined, symbol or NodeJS.ArrayBufferView.
 * @param options Write options.
 * A promise that is resolved when the data has been written to the file.
 */
function writeSync(filePath: string, data: TData, options: IOptions): void {
  try {
    const isPrimitive = (typeof data !== "object" && typeof data !== "function") || data === null;
    const tempPath = path.join(path.dirname(filePath), randomTempName());

    if (!fs.existsSync(path.dirname(tempPath))) {
      fs.mkdirSync(path.dirname(tempPath));
    }

    const fd = fs.openSync(options.atomic ? tempPath : filePath, "w", options.mode || 0o666);

    if (ArrayBuffer.isView(data)) {
      // If the data is an ArrayBufferView, it writes it as an ArrayBufferView.
      fs.writeSync(fd, data, 0, data.byteLength, 0);
    } else if (isPrimitive) {
      // If the data are primitive, it writes them with the encoding specified in the options
      fs.writeSync(fd, data.toString(), null, options.encoding || "utf-8");
    } else {
      // If the data is not compatible, it throws an error
      throw new Error("The data provided is not supported. Only ArrayBufferView and primitive data are supported.");
    }

    fs.closeSync(fd);

    // Updates the file permissions if they were specified in the options
    if (options.chown) {
      fs.chownSync(tempPath, options.chown.uid, options.chown.gid);
    }

    if (options.mode) {
      fs.chmodSync(tempPath, options.mode);
    }

    if (options.atomic) {
      fs.renameSync(tempPath, filePath);
    }
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Reads data from a file at the specified path.
 * @param path Path of the file to read.
 * @param options Read options.
 * @returns A promise that resolves with the data read from the file.
 */
async function read(filePath: string, encoding?: BufferEncoding): Promise<TData> {
  try {
    const fd = await promisify(fs.open)(filePath, "r");
    const stat = await promisify(fs.fstat)(fd);
    const bufferSize = stat.size;
    const buffer = Buffer.alloc(bufferSize);
    await promisify(fs.read)(fd, buffer, 0, bufferSize, 0);

    await promisify(fs.close)(fd);

    return buffer.toString(encoding || "utf-8") as TData;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Reads data from a file at the specified path.
 * @param path Path of the file to read.
 * @param options Read options.
 * @returns The data read from the file.
 */
function readSync(filePath: string, encoding?: BufferEncoding): TData {
  try {
    const fd = fs.openSync(filePath, "r");
    const stat = fs.fstatSync(fd);
    const bufferSize = stat.size;
    const buffer = Buffer.alloc(bufferSize);
    fs.readSync(fd, buffer, 0, bufferSize, 0);

    fs.closeSync(fd);

    return buffer.toString(encoding || "utf-8") as TData;
  } catch (error) {
    throw new Error(error);
  }
}

async function isDirectory(path: string) {
  try {
    const stats = await fs.promises.lstat(path);
    return stats.isDirectory();
  } catch (error) {
    throw new Error(error);
  }
}

function isDirectorySync(path: string): boolean {
  try {
    if (fs.lstatSync(path).isDirectory()) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(error);
  }
}

async function remove(path: string) {
  try {
    const isDir = await isDirectory(path);
    if (isDir) {
      await fs.promises.rmdir(path);
    } else {
      await fs.promises.unlink(path);
    }
  } catch (error) {
    throw new Error(error);
  }
}

function removeSync(path: string) {
  try {
    if (isDirectorySync(path)) {
      fs.rmdirSync(path);
    } else {
      fs.unlinkSync(path);
    }
  } catch (error) {
    throw new Error(error);
  }
}

async function access(path: string, mode: number) {
  try {
    await fs.promises.access(path, mode);
    return true;
  } catch (error) {
    return false;
  }
}

function accessSync(path: string, mode: number) {
  try {
    fs.accessSync(path, mode);
    return true;
  } catch (error) {
    return false;
  }
}

const exists = fs.existsSync;
const mkdirSync = fs.mkdirSync;

export { write, writeSync, read, readSync, exists, mkdirSync, remove, removeSync, access, accessSync };
