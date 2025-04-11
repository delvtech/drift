# Contributing

- [Branch Naming](#branch-naming)
- [Creating a release](#creating-a-release)

## Branch Naming

Use lower-hyphen-case in the following format for branch names:

```sh
<user-alias>/[docs/feature/bugfix/hotfix/chore]/<title>
```

- `user-alias`: Your GitHub username or alias.
- `docs/feature/bugfix/hotfix/chore`: The type of change you're making.
- `title`: A short description of the change.

**Examples**:

```sh
ryangoree/bugfix/typo
ryangoree/docs/update-readme
ryangoree/feature/epoch-block
```

## Creating a release

This repo uses [changesets](https://github.com/changesets/changesets) to manage
versioning and changelogs. This means you shouldn't need to manually change any
of the internal package versions.

Before opening a PR, run:

```sh
yarn changeset
```

Follow the prompts to describe the changes you've made and commit the changeset
file that it generates.

As changesets are committed to the `main` branch, the [changesets github
action](https://github.com/changesets/action) in the release workflow will
automatically keep track of the pending `package.json` and `CHANGELOG.md`
updates in an open PR titled `chore: version packages`.

Once this PR is merged, the release workflow will be triggered, creating new
tags and github releases, and publishing the updated packages to NPM. **These
PRs should be carefully reviewed!**
