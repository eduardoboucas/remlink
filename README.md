# 🔗 remlink

A `npm link` equivalent for remote, unpublished npm modules.

## Overview

Imagine you have a project that uses multiple pieces of functionality that you distribute as separate npm modules. If you're testing changes to one or many of those modules and you want to do an end-to-end test with the parent project (for example, in a CI workflow), you'll need to publish all of the sub-modules and pull them in. This creates a very long feedback loop.

With `remlink` you can replace every instance of a dependency (i.e. direct or transitive) with an unpublished version of a module, straight from GitHub. This lets you test an open PR without having to make any releases.

## Usage

1. Create a `remlink.config.json` at the root of the parent project indicating which modules you want to replace and where you want to pull them from.
2. Run `npx remlink`

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

With the file above, we'll replace `@netlify/config` and `@netlify/build` with an unpublished version from the `feat/test` branch on https://github.com/netlify/build.

Under the hood, `remlink` will pull the branch, run `npm install` (and any additional commands specified in `installCommands`), and create a symlink for any instance of the modules found in the dependency tree.

The `packages` object allows `remlink` to work with a monorepo, as you can link multiple modules from the same repository.
