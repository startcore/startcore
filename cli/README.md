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
$ npm install -g @startcore/cli
$ @startcore/cli COMMAND
running command...
$ @startcore/cli (--version)
@startcore/cli/0.0.0 linux-x64 node-v16.14.2
$ @startcore/cli --help [COMMAND]
USAGE
  $ @startcore/cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`@startcore/cli hello PERSON`](#startcorecli-hello-person)
* [`@startcore/cli hello world`](#startcorecli-hello-world)
* [`@startcore/cli help [COMMAND]`](#startcorecli-help-command)
* [`@startcore/cli plugins`](#startcorecli-plugins)
* [`@startcore/cli plugins:install PLUGIN...`](#startcorecli-pluginsinstall-plugin)
* [`@startcore/cli plugins:inspect PLUGIN...`](#startcorecli-pluginsinspect-plugin)
* [`@startcore/cli plugins:install PLUGIN...`](#startcorecli-pluginsinstall-plugin-1)
* [`@startcore/cli plugins:link PLUGIN`](#startcorecli-pluginslink-plugin)
* [`@startcore/cli plugins:uninstall PLUGIN...`](#startcorecli-pluginsuninstall-plugin)
* [`@startcore/cli plugins:uninstall PLUGIN...`](#startcorecli-pluginsuninstall-plugin-1)
* [`@startcore/cli plugins:uninstall PLUGIN...`](#startcorecli-pluginsuninstall-plugin-2)
* [`@startcore/cli plugins update`](#startcorecli-plugins-update)

## `@startcore/cli hello PERSON`

Say hello

```
USAGE
  $ @startcore/cli hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Whom is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/startcore/cli/blob/v0.0.0/dist/commands/hello/index.ts)_

## `@startcore/cli hello world`

Say hello world

```
USAGE
  $ @startcore/cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

## `@startcore/cli help [COMMAND]`

Display help for @startcore/cli.

```
USAGE
  $ @startcore/cli help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for @startcore/cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `@startcore/cli plugins`

List installed plugins.

```
USAGE
  $ @startcore/cli plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ @startcore/cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `@startcore/cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ @startcore/cli plugins:install PLUGIN...

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
  $ @startcore/cli plugins add

EXAMPLES
  $ @startcore/cli plugins:install myplugin 

  $ @startcore/cli plugins:install https://github.com/someuser/someplugin

  $ @startcore/cli plugins:install someuser/someplugin
```

## `@startcore/cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ @startcore/cli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ @startcore/cli plugins:inspect myplugin
```

## `@startcore/cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ @startcore/cli plugins:install PLUGIN...

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
  $ @startcore/cli plugins add

EXAMPLES
  $ @startcore/cli plugins:install myplugin 

  $ @startcore/cli plugins:install https://github.com/someuser/someplugin

  $ @startcore/cli plugins:install someuser/someplugin
```

## `@startcore/cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ @startcore/cli plugins:link PLUGIN

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
  $ @startcore/cli plugins:link myplugin
```

## `@startcore/cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ @startcore/cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ @startcore/cli plugins unlink
  $ @startcore/cli plugins remove
```

## `@startcore/cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ @startcore/cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ @startcore/cli plugins unlink
  $ @startcore/cli plugins remove
```

## `@startcore/cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ @startcore/cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ @startcore/cli plugins unlink
  $ @startcore/cli plugins remove
```

## `@startcore/cli plugins update`

Update installed plugins.

```
USAGE
  $ @startcore/cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
