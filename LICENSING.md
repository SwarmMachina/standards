# SwarmMachina licensing policy

This policy applies to all current and future SwarmMachina repositories.
Licensing and copyright are declared at repository level. Do not add SPDX,
license, or copyright headers to first-party source files.

## Open-source projects

Use the Mozilla Public License 2.0 for first-party code that is published or
otherwise distributed as open source.

Every repository must contain:

- `LICENSE` with the unmodified canonical MPL-2.0 text;
- `COPYRIGHT` with the canonical SwarmMachina copyright notice;
- a `License` section in `README.md` that links to `LICENSE`;
- `"license": "MPL-2.0"` in `package.json`, when present.

Use this copyright notice without a year:

```text
Copyright Contributors to SwarmMachina.

This notice applies to the first-party contents of this repository.
Third-party components retain their respective copyright and license notices.
```

The contributor wording remains the default unless ownership has been assigned
to a specific legal entity. A brand name or `SwarmMachina Team` must not be used
as a substitute for an identified copyright holder.

## Proprietary projects

Projects that grant no external license must contain:

- a root `LICENSE` stating that the repository is proprietary and that no
  license is granted;
- a root `COPYRIGHT` ending with `All rights reserved.`;
- `"private": true` and `"license": "UNLICENSED"` in `package.json`, when
  present;
- a matching `License` section in `README.md`.

## Third-party content

Never remove or replace third-party copyright and license notices. Repositories
that vendor third-party source or distribute it in binaries must also contain:

- `THIRD_PARTY_NOTICES.md` with component names, upstream locations, copyright
  notices, and license identifiers;
- the required license texts under `LICENSES/`;
- those files in every source, binary, and package distribution.

Generated third-party files retain their upstream notices. Generated
first-party files follow the repository license and require no file header.

## Changes

Changing a repository between the open-source and proprietary profiles
requires approval from every copyright holder whose work is affected. Existing
releases remain available under the license under which they were published.
