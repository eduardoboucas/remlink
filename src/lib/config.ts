import { promises as fs } from "fs";
import { join } from "path";
import process from "process";

const FILENAME = "remlink.config.json";

interface Config {
  links: Link[];
}

export interface Link {
  repo: string;
  branch: string;
  packages: Record<string, string>;
  installCommands?: string[];
}

export const readConfig = async (cwd = process.cwd()) => {
  const path = join(cwd, FILENAME);

  let data = "";

  try {
    data = await fs.readFile(path, "utf8");
  } catch {
    return;
  }

  try {
    const config = JSON.parse(data) as Config;

    return config;
  } catch (error) {
    console.error(`Could not parse ${FILENAME}:`, error);

    throw error;
  }
};
