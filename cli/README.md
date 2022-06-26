oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @startcore/startcore
$ @startcore/startcore COMMAND
running command...
$ @startcore/startcore (--version)
@startcore/startcore/0.0.8 linux-x64 node-v16.14.2
$ @startcore/startcore --help [COMMAND]
USAGE
  $ @startcore/startcore COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`@startcore/startcore help [COMMAND]`](#startcorestartcore-help-command)
* [`@startcore/startcore init`](#startcorestartcore-init)
* [`@startcore/startcore plugins`](#startcorestartcore-plugins)
* [`@startcore/startcore plugins:install PLUGIN...`](#startcorestartcore-pluginsinstall-plugin)
* [`@startcore/startcore plugins:inspect PLUGIN...`](#startcorestartcore-pluginsinspect-plugin)
* [`@startcore/startcore plugins:install PLUGIN...`](#startcorestartcore-pluginsinstall-plugin-1)
* [`@startcore/startcore plugins:link PLUGIN`](#startcorestartcore-pluginslink-plugin)
* [`@startcore/startcore plugins:uninstall PLUGIN...`](#startcorestartcore-pluginsuninstall-plugin)
* [`@startcore/startcore plugins:uninstall PLUGIN...`](#startcorestartcore-pluginsuninstall-plugin-1)
* [`@startcore/startcore plugins:uninstall PLUGIN...`](#startcorestartcore-pluginsuninstall-plugin-2)
* [`@startcore/startcore plugins update`](#startcorestartcore-plugins-update)
* [`@startcore/startcore sync`](#startcorestartcore-sync)
* [`@startcore/startcore ui`](#startcorestartcore-ui)

## `@startcore/startcore help [COMMAND]`

Display help for @startcore/startcore.

```
USAGE
  $ @startcore/startcore help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for @startcore/startcore.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `@startcore/startcore init`

describe the command here

```
USAGE
  $ @startcore/startcore init

DESCRIPTION
  describe the command here

EXAMPLES
  $ @startcore/startcore init
```

_See code: [dist/commands/init.ts](https://github.com/startcore/startcore/blob/v0.0.8/dist/commands/init.ts)_

## `@startcore/startcore plugins`

List installed plugins.

```
USAGE
  $ @startcore/startcore plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ @startcore/startcore plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.0/src/commands/plugins/index.ts)_

## `@startcore/startcore plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ @startcore/startcore plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ @startcore/startcore plugins add

EXAMPLES
  $ @startcore/startcore plugins:install myplugin 

  $ @startcore/startcore plugins:install https://github.com/someuser/someplugin

  $ @startcore/startcore plugins:install someuser/someplugin
```

## `@startcore/startcore plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ @startcore/startcore plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ @startcore/startcore plugins:inspect myplugin
```

## `@startcore/startcore plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ @startcore/startcore plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ @startcore/startcore plugins add

EXAMPLES
  $ @startcore/startcore plugins:install myplugin 

  $ @startcore/startcore plugins:install https://github.com/someuser/someplugin

  $ @startcore/startcore plugins:install someuser/someplugin
```

## `@startcore/startcore plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ @startcore/startcore plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ @startcore/startcore plugins:link myplugin
```

## `@startcore/startcore plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ @startcore/startcore plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ @startcore/startcore plugins unlink
  $ @startcore/startcore plugins remove
```

## `@startcore/startcore plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ @startcore/startcore plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ @startcore/startcore plugins unlink
  $ @startcore/startcore plugins remove
```

## `@startcore/startcore plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ @startcore/startcore plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ @startcore/startcore plugins unlink
  $ @startcore/startcore plugins remove
```

## `@startcore/startcore plugins update`

Update installed plugins.

```
USAGE
  $ @startcore/startcore plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

## `@startcore/startcore sync`

```
USAGE
  $ @startcore/startcore sync
```

_See code: [dist/commands/sync.ts](https://github.com/startcore/startcore/blob/v0.0.8/dist/commands/sync.ts)_

## `@startcore/startcore ui`

```
USAGE
  $ @startcore/startcore ui
```

_See code: [dist/commands/ui.ts](https://github.com/startcore/startcore/blob/v0.0.8/dist/commands/ui.ts)_
<!-- commandsstop -->
