# environment

This library handles secrets integration and storage with [infisical](https://infisical.wuguishifu.dev).

## Setup

1. Install and connect to [Tailscale](https://tailscale.com/).

1. Install the [Infisical CLI](https://infisical.com/docs/cli/overview).

   ```sh
   brew install infisical/get-cli/infisical
   ```

1. Log into the Infisical CLI.

   ```sh
   nx auth environment
   ```

1. Copy the root `.env.example` file to `.env`.

1. Run the setup command.

   ```sh
   nx setup environment
   ```
