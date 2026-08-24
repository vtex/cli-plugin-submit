# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Publish to npm via DK-CICD `npm-publish-v1` and GitHub Trusted Publishing instead of the `NPM_TOKEN` Actions workflows

## [1.1.5] - 2026-08-24

### Fixed

- Handle non-JSON error messages in submit 400 responses instead of crashing the CLI

## [1.1.0] - 2021-11-22

### Changed

- Adapt feedback messages, as the PRs will be created asynchronously from now on

## [1.0.0] - 2021-07-07
### Fixed
- Make dependencies explicit.

## [0.2.0] - 2020-11-18

### Changed

- `extensions` and `vtex*` accounts can submit `vtex` apps as allowed first party apps vendors

## [0.1.2] - 2020-10-07
### Fixed
- Fix relative imports
- Update `vtex`

## [0.1.1] - 2020-10-06
### Added
- Handle App Store validation errors

## [0.1.0] - 2020-09-07

### Changed


[Unreleased]: https://github.com/vtex/cli-plugin-submit/compare/v1.1.5...HEAD
[1.1.5]: https://github.com/vtex/cli-plugin-submit/compare/v1.1.4...v1.1.5