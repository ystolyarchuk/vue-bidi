# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-XX-XX

### Added
- Initial release
- `useBidi` composable for managing text direction
- `v-bidi` directive for automatic direction binding
- SCSS mixins for RTL/LTR styles
- Vue 3 plugin support

### Changed
- SCSS mixins now default to `$use-host-context: true` for scoped styles in Vue components
  - For scoped styles: use mixins without the second parameter (defaults to `true`)
  - For global styles: pass `false` as the second parameter

