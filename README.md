# remlink

A `npm link` equivalent for remote modules.

## Usage

_remlink.config.json_
```json
{
  "links": [
    {
      "repo": "netlify/build",
      "branch": "feat/avail-system-logger-to-zisi",
      "packages": {
        "@netlify/config": "packages/config",
        "@netlify/build": "packages/build"
      },
      "installCommands": ["npm run build"]
    }
  ]
}
```