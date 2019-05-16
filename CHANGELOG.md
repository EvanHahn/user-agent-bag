# Changelog

## 0.2.0 - 2019-05-16
### Added
- `UserAgentBag` constructor creates an empty bag when passed `undefined` or `null`
- `UserAgentBag` constructor throws when other invalid types are passed
- `UserAgentBag.prototype.size` returns the number of products

### Fixed
- Parsing is skipped if the length is too large

## 0.1.0 - 2019-05-14
### Added
- `UserAgentBag` class with `entries`, `get`, `getAll`, `has`, and `toString`
