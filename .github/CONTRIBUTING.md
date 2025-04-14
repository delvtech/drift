# Contributing

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installing Dependencies](#installing-dependencies)
  - [Working in a Monorepo](#working-in-a-monorepo)
- [Testing](#testing)
- [Branch Naming](#branch-naming)
- [Creating a release](#creating-a-release)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 22.x
- [Yarn](https://yarnpkg.com)
- [Foundry](https://book.getfoundry.sh) (only required if working on contracts)

You can install Node.js using [nvm](https://github.com/nvm-sh/nvm). After
following the [installation
instructions](https://github.com/nvm-sh/nvm#installing-and-updating), run the
following commands to install and use Node.js 22.x:

```sh
nvm install 22
nvm use # run from the root of the project
```

If Yarn is not already installed, you can install it using npm:

```sh
npm install --global yarn
```

If working on contracts, install Foundry following its [installation
instructions](https://book.getfoundry.sh/getting-started/installation).

### Installing Dependencies

After the prerequisites are installed, install all package and development
dependencies using Yarn:

```sh
yarn  # run from the root of the project
```

### Working in a Monorepo

In a [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces) monorepo,
the root `package.json` file contains a list of workspaces, each of which is
it's own package with it's own `package.json` file.

You can work with the root `package.json` mostly like you would with any other:

```sh
yarn <script-name>

# use the -W flag when installing root dependencies
yarn -W add <package-name>
```

To target a specific package, use the `workspace` command:

```sh
yarn workspace <package-name> <script-name>
yarn workspace <package-name> add <package-name>
```

## Testing

Many of the tests in this repo require access to an RPC node to run. The RPC
endpoints are defined in the `.env` files in each package. Create them using the
`.env.example` files as a template and fill in the required values. You can
either point to an external RPC API like [Alchemy](https://www.alchemy.com/), or
to a local node like [`anvil`](https://book.getfoundry.sh/anvil/).

Once the `.env` files are set up, tests can be run using the `test` scripts:

```sh
# run all tests
yarn test

# run tests for a specific package (usually preferred to avoid nonce issues)
yarn workspace <package-name> test
```

## Branch Naming

Use lower-hyphen-case in the following format for branch names:

```sh
<user-alias>/[commit-type/]<title>
```

- `user-alias`: Your GitHub username or alias.
- `commit-type`: The type of change you're making.
  - `feat`: A new feature or improvement.
  - `fix`: A patch for a bug.
  - `chore`: A maintenance task, non-critical change, or documentation update.
- `title`: A short label/description of the change.

**Examples**:

```sh
ryangoree/feat/epoch-block
ryangoree/fix/overloaded-calls
ryangoree/chore/fix-comment-typo
ryangoree/chore/update-readme-examples
```

## Creating a release

This repo uses [changesets](https://github.com/changesets/changesets) to manage
versioning and changelogs. This means you shouldn't need to manually change any
of the internal package versions.

Before opening a PR, run:

```sh
yarn changeset
```

Follow the prompts to describe the changes you've made using the
[semver](https://semver.org/) versioning scheme and commit the generated
changeset file.

As changesets are committed to the `main` branch, the [changesets github
action](https://github.com/changesets/action) in the release workflow will
automatically keep track of the pending `package.json` and `CHANGELOG.md`
updates in an open PR titled `chore: version packages`. Once this PR is merged,
the release workflow will be triggered, creating new tags and github releases,
and publishing the updated packages to NPM. **These PRs should be carefully
reviewed!**
