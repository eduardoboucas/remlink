import { createWriteStream, promises as fs } from "fs";
import { join } from "path";

import { execa } from "execa";
import got from "got";
import slugify from "slugify";
import tar from "tar";
import tmp from "tmp-promise";

export const downloadFile = async (
  url: string,
  localPath: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const download = got.stream(url);
    const file = createWriteStream(localPath);

    download.on("error", (error) => {
      reject(error);
    });

    file
      .on("error", (error) => {
        reject(error);
      })
      .on("finish", () => {
        resolve();
      });

    download.pipe(file);
  });
};

interface DownloadOptions {
  branch: string;
  installCommands?: string[];
  localPath: string;
  repo: string;
}

export const downloadModule = async ({
  branch,
  installCommands = [],
  localPath,
  repo,
}: DownloadOptions) => {
  const slug = slugify(repo);
  const tarballURL = `https://github.com/${repo}/tarball/${branch}`;
  const tarball = await tmp.file({ postfix: ".tar.gz" });

  console.log(`🚠 Downloading '${tarballURL}'...`);

  await downloadFile(tarballURL, tarball.path);

  const localModulePath = join(localPath, slug);

  await fs.mkdir(localModulePath, { recursive: true });
  await tar.x({ C: localModulePath, file: tarball.path, strip: 1 });

  console.log(`📦 Installing dependencies in '${localModulePath}'...`);

  await execa("npm", ["install", "--ignore-scripts"], { cwd: localModulePath });

  for (const command of installCommands) {
    const [mainCommand, ...args] = command.split(" ");

    console.log(`🏃‍♂️ Running '${command}' in '${localModulePath}'...`);

    await execa(mainCommand, args, { cwd: localModulePath });
  }

  return localModulePath;
};
