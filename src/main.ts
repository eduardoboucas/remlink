import { resolve } from "path";

import { Link, readConfig } from "./lib/config.js";
import { downloadModule } from "./lib/downloader.js";
import { getModulePaths, getModuleTree, Module } from "./lib/module.js";
import { createLink } from "./lib/symlink.js";

interface LinkModulesOptions {
  modulesPath?: string;
}

const getLocalModules = async (links: Link[], modulesPath: string) => {
  const localModules: Map<string, string> = new Map();

  await Promise.all(
    links.map(async (link) => {
      const modulePath = await downloadModule({
        branch: link.branch,
        installCommands: link.installCommands,
        localPath: modulesPath,
        repo: link.repo,
      });

      for (const packageName in link.packages) {
        localModules.set(
          packageName,
          resolve(modulePath, link.packages[packageName])
        );
      }
    })
  );

  return localModules;
};

export const linkModules = async ({
  modulesPath: relativeModulesPath = "node_modules_remlinked",
}: LinkModulesOptions = {}) => {
  const config = await readConfig();

  if (config === undefined) {
    console.log(`ℹ️ Skipping remlink: no config file found.`);

    return;
  }

  const localModules = await getLocalModules(
    config.links,
    resolve(relativeModulesPath)
  );
  const moduleNames = [...localModules.keys()];
  const tree = await getModuleTree(moduleNames);

  await Promise.all(
    moduleNames.map((moduleName) => {
      const targetPath = localModules.get(moduleName);

      if (targetPath === undefined) {
        return;
      }

      return linkModule(tree, moduleName, targetPath);
    })
  );
};

const linkModule = async (
  tree: Module,
  moduleName: string,
  targetPath: string
) => {
  const linkPaths = getModulePaths(tree, moduleName);
  const links = [...linkPaths].map(async (linkPath) => {
    try {
      await createLink(targetPath, linkPath);

      console.log(`🔗 Created link: '${linkPath}' 👉 '${targetPath}'`);
    } catch (error) {
      console.error(`❌ Could not link '${linkPath}':`, error);
    }
  });

  await Promise.all(links);
};
