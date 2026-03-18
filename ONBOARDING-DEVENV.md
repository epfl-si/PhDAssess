# 🧑‍💻 Onboarding for devs that like to use devenv

This project uses devenv to provide a consistent local development environment.

## Prerequisites (one-time setup)
- Install Nix
- Install devenv

## Daily workflow
Run `devenv shell` and follow the indications. You can install direnv to automate this step.

## Secrets
They are defined by the `secretspec.toml` and loaded directly from keybase when the devenv shell is loaded.
See `devenv.yaml`.
