# 🔗 remlink

A `npm link` equivalent for remote, unpublished npm modules.

## Overview

Imagine you have a project that uses multiple pieces of functionality that you distribute as separate npm modules. If you're testing changes to one or many of those modules and you want to do an end-to-end test with the parent project (for example, in a CI workflow), you'll need to publish all of the sub-modules and pull them in. This creates a very long feedback loop.

With `remlink` you can replace every instance of a dependency (i.e. direct or transitive) with an unpublished version of a module, straight from GitHub. This lets you test an open PR without having to make any releases.

## Usage

1. Create a `remlink.config.json` at the root of the parent project indicating which modules you want to replace and where you want to pull them from.

    ```json
    {
      "links": [
        {
          "repo": "my-org/my-repo",
          "branch": "some-branch",
          "installCommands": ["npm run build"]
        }
      ]
    }
    ```

2. Run `npx remlink`

With this file, `remlink` will:

1. Download the repository at https://github.com/my-org/my-repo
2. Run `npm install` to install its dependencies
3. Run `npm run remlink` to run any `remlink` script that has been defined in `package.json`
4. Run any commands listed in `installCommands`
5. Create symlinks for any instances of the module in the dependency tree to the local module

### Monorepos

If you want to link a repository that holds a monorepo, you can define a `packages` object that maps module names to their relative paths inside the repository.

```json
{
  "links": [
    {
      "repo": "netlify/build",
      "branch": "feat/test",
      "packages": {
        "@netlify/config": "packages/config",
        "@netlify/build": "packages/build"
      },
      "installCommands": ["npm run build"]
    }
  ]
}
```
