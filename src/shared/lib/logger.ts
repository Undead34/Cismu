import si from "systeminformation";
import { app } from "electron";
import path from "path";
import os from "os";

class Logger {
  private LoggerInit: number = new Date().getTime();
  private LOG_LEVEL: number = 2;

  constructor() {
    this.log("Starting Logger");
    if (this.LOG_LEVEL >= 2) {
      this.hw();
    }
  }

  debug(message: string) {
    if (process.env.NODE_ENV === "development") {
      const logMessage = `[${this.getTime()}]` + " | DEBUG | " + `[${message}]`;
      console.log(logMessage);
      this.writeToFile(logMessage);
    }
  }

  log(message: string) {
    const logMessage = `[${this.getTime()}]` + " | LOG | " + `[${message}]`;
    console.log(logMessage);
    this.writeToFile(logMessage);
  }

  alert(message: string) {
    const logMessage = `[${this.getTime()}]` + " | ALERT | " + `[${message}]`;
    console.warn(logMessage);
    this.writeToFile(logMessage);
  }

  warn(message: string) {
    const logMessage = `[${this.getTime()}]` + " | WARN | " + `[${message}]`;
    console.warn(logMessage);
    this.writeToFile(logMessage);
  }

  error(message: string, error?: Error) {
    if (error && this.LOG_LEVEL >= 2) {
      console.log(error.message, error.name, error.stack);
    }

    const logMessage = `[${this.getTime()}]` + " | ERROR | " + `[${message}]`;
    console.error(logMessage);
    this.writeToFile(logMessage);
  }

  crit(message: string | Error) {
    if (message instanceof Error) {
      //
    } else {
      const logMessage = `[${this.getTime()}]` + " | CRIT | " + `[${message}]`;
      console.error(logMessage);
      this.writeToFile(logMessage);
    }
  }

  private getTime(): number {
    return (new Date().getTime() - this.LoggerInit) / 1000;
  }

  private writeToFile(logMessage: string) {
    const logPath = path.join(app.getPath("crashDumps"), this.getLogName());
  }

  private getLogName() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}-${minutes}-${seconds}-${Math.floor(Math.random() * 100000)}.log`;
  }

  private async hw() {
    const [osInfo, cpu, mem, graphics, audio, chassis] = await Promise.all([
      si.osInfo(),
      si.cpu(),
      si.mem(),
      si.graphics(),
      si.audio(),
      si.chassis(),
    ]);

    this.log("-----HARDWARE INFORMATION START-----");
    this.log(`Operating System: ${osInfo.distro}, ${osInfo.arch}, release ${osInfo.release}`);
    this.log(`CPU Brand: ${cpu.vendor}`);
    this.log(`CPU Processor Name: ${os.cpus()[0].model}`);
    this.log(`CPU Identifier: ${cpu.manufacturer} Family ${cpu.family} Model ${cpu.model} Stepping ${cpu.stepping}`);
    this.log(`CPU Speed: ${cpu.speed}`);
    this.log(`CPU Topology: ${cpu.cores} Core`);

    graphics.controllers.map((controller) => {
      this.log(`GPU Manufacturer: ${controller.model}`);
      this.log(`GPU Memory: ${controller.vram}`);
    });

    graphics.displays.map((display) => {
      this.log(`Display Vendor: ${display.vendor}`);
      this.log(`Display Manufacturer: ${display.model}`);
      this.log(`Display Refresh Rate: ${display.currentRefreshRate}`);
      this.log(`Display Resolution X: ${display.resolutionX}`);
      this.log(`Display Resolution Y: ${display.resolutionY}`);
    });

    this.log(`GPU Memory: ${mem.total}`);
    this.log(`GPU Free Memory: ${mem.free}`);
    this.log(`GPU Used Memory: ${mem.used}`);

    audio.map((device) => {
      this.log(`Audio Device Name: ${device.name}`);
      this.log(`Audio Device Manufacturer: ${device.manufacturer}`);
      this.log(`Audio Device Driver: ${device.driver}`);
      this.log(`Audio Device Type: ${device.type}`);
      this.log(`Audio Device Status: ${device.status}`);
    });

    this.log(`Chassis Manufacturer: ${chassis.manufacturer}`);
    this.log(`Chassis Model: ${chassis.model}`);
    this.log(`Chassis Type: ${chassis.type}`);

    console.log(`[${this.getTime()}]`, "| INFO | ", "-----HARDWARE INFORMATION END-----");
  }
}

const logger = new Logger();

export default logger;
