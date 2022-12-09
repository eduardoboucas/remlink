import { promises as fs } from "fs";

export const createLink = async (targetPath: string, linkPath: string) => {
  const stats = await fs.lstat(linkPath).catch(() => null);

  if (stats) {
    if (stats.isSymbolicLink()) {
      const symlinkRealpath = await fs.realpath(linkPath).catch(() => null);

      if (linkPath === symlinkRealpath) {
        return;
      }
    }

    if (stats.isDirectory()) {
      await fs.rm(linkPath, { recursive: true });
    } else {
      await fs.unlink(linkPath);
    }
  }

  await fs.symlink(targetPath, linkPath);
};
