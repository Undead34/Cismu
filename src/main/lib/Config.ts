import { IConfig, IBounds } from "../../shared/types/cismu";
import logger from "../../shared/lib/logger";
import { write } from "../../shared/lib/fs";
import { paths } from "./Constants";
import electron from "electron";
import path from "path";
import fs from "fs";

type Primitive = string | number | boolean | null | undefined;

class Config {
  public config: IConfig | null;
  public configPath: string;
  private lastModified: number;

  constructor() {
    this.lastModified = this.getLastModified();
    this.configPath = paths.files.setting;
    this.config = null;
  }

  getDefaultConfig(): IConfig {
    return {
      hardwareAcceleration: true,
      musicFolders: [],
      bounds: {
        width: 900,
        height: 550,
        x: undefined,
        y: undefined,
      },
      state: "firststart",
    };
  }

  private getLastModified() {
    try {
      return fs.statSync(this.configPath).mtime.getTime();
    } catch (e) {
      return 0;
    }
  }

  async save(minify = false) {
    try {
      if (this.lastModified && this.lastModified !== this.getLastModified()) {
        logger.warn("Not saving settings, it has been externally modified.");
        return;
      }
      // Save the configuration
      const output = minify ? JSON.stringify(this.config) : JSON.stringify(this.config, null, 2);
      await write(this.configPath, output, { atomic: true });
    } catch (error) {
      logger.error("An error occurred while saving the configuration", error);
    }
  }

  load(): void {
    // Module Init
    this.loadConfig(this.configPath);
  }

  get bounds() {
    return this.checkBounds(this.config.bounds);
  }

  private checkBounds(bounds?: IBounds): IBounds {
    try {
      const defaultConfig = this.getDefaultConfig();
      if (bounds === undefined) {
        bounds = defaultConfig.bounds;
      }

      // check if the browser window is offscreen
      const display = electron.screen.getDisplayNearestPoint({
        x: Math.round(bounds.x),
        y: Math.round(bounds.y),
      }).workArea;

      const onScreen =
        bounds.x >= display.x &&
        bounds.x + bounds.width <= display.x + display.width &&
        bounds.y >= display.y &&
        bounds.y + bounds.height <= display.y + display.height;

      if (!onScreen) {
        return {
          width: defaultConfig.bounds.width,
          height: defaultConfig.bounds.height,
          x: display.width / 2 - defaultConfig.bounds.width / 2,
          y: display.height / 2 - defaultConfig.bounds.height / 2,
        };
      }

      return bounds;
    } catch (error) {
      logger.error(error);
    }
  }

  private isPrimitive(value: unknown): value is Primitive {
    return value === null || typeof value !== "object";
  }

  private cloneDeep<T>(value: T): T {
    if (this.isPrimitive(value)) {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map((item) => this.cloneDeep(item)) as unknown as T;
    }
    if (typeof value === "object") {
      const clonedObj = {} as T;
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          clonedObj[key] = this.cloneDeep(value[key]);
        }
      }
      return clonedObj;
    }
    // This code should be unreachable, but TypeScript requires a return statement
    // for all code paths, so we'll throw an error to make it happy.
    logger.error("Unhandled value type");
  }

  createConfig() {
    this.config = this.cloneDeep(this.getDefaultConfig());
    this.save();
  }

  private loadConfig(configPath: string) {
    if (!configPath) logger.error("An unexpected error has occurred in the configPath");
    configPath = path.resolve(configPath);

    // Check if directory exists, creates it if needed
    try {
      if (!fs.existsSync(path.dirname(configPath))) {
        fs.mkdirSync(path.dirname(configPath), { recursive: true });
      }

      // Load the file
      this.config = JSON.parse(fs.readFileSync(configPath).toString());

      if (this.isPrimitive(this.config)) {
        this.config = null;
      }
    } catch (err) {
      this.config = null;
      logger.error("The configuration file appears to be corrupted");
    }
  }
}

export default Config;
