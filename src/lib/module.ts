import { execa } from "execa";

export interface Module {
  name: string;
  dependencies: Record<string, Module>;
  path: string;
}

export const getModuleTree = async (moduleNames: string[]) => {
  const { stdout } = await execa("npm", ["la", ...moduleNames, "--json"]);
  const data = JSON.parse(stdout) as Module;

  return data;
};

export const getModulePaths = (
  node: Module,
  moduleName: string,
  paths: Set<string> = new Set()
) => {
  if (node.name === moduleName) {
    paths.add(node.path);

    return paths;
  }

  for (const dependency in node.dependencies) {
    getModulePaths(node.dependencies[dependency], moduleName, paths);
  }

  return paths;
};
