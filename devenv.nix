{ pkgs, lib, config, inputs, ... }:

let
  isNixOS = config.env ? IS_NIXOS;

  needed_packages = [
    pkgs.nodejs_22
    pkgs.openssl
    pkgs.secretspec
  ];

  meteorFhs = pkgs.buildFHSEnv {
    name = "meteor-fhs";
    targetPkgs = pkgs: needed_packages;

    runScript = ''
        bash
      '';
  };
in
{
  packages =
    if isNixOS then
      [ meteorFhs ]
    else
      needed_packages;

  dotenv.enable = true;

  env = {
    NODE_ENV = "development";
    DEBUG = "*,-babel,-compression-connect*,-combined-stream2,-express:*,-connection-pool,-connect:*,-send,-body-parser:*,-compression,-finalhandler,-express*,-router,-router:*,-http-proxy-middleware";
    DEBUG_COLORS = "yes";
    MONGO_PERSISTENT_URL = "mongodb://127.0.0.1:3001/meteor";
  };

  scripts.meteor-install.exec = ''
    if ! command -v meteor >/dev/null; then
      echo "Installing Meteor..."
      curl https://install.meteor.com/ | sh
    else
      echo "Meteor is already installed"
    fi
  '';

  scripts.alert-if-missing-proto.exec = ''
    dir=/proto;
    if [ ! -d "$dir" ] && [ -z "$(ls -A "$dir")" ]; then
      echo "⚠️ Warning, you miss the Zeebe proto file needed by this project.";
      echo "  Please run this as root before continuing";
      echo "    sudo mkdir -p /proto";
      echo "    sudo cp ./node_modules/zeebe-node/proto/zeebe.proto /proto";
      echo "    sudo chmod 755 /proto";
      echo "    sudo chmod 644 /proto/zeebe.proto";
      exit 1;
    fi
  '';

  scripts.start.exec = ''
    if ! command -v meteor >/dev/null; then
      echo "First install Meteor first with meteor-install"
    else
      meteor npm start
    fi
  '';

  enterShell = ''
    export PATH="$HOME/.meteor:$PATH"
    echo "Checking for required proto file 🔬..."
    alert-if-missing-proto
    echo "✅ proto file found."

    ${lib.optionalString isNixOS ''
      echo "❄️ 🔥️ Entering Meteor FHS dev environment for NixOs. ❄️"
      exec meteor-fhs
      echo "🔥 You are in the PhDAssess dev environment 🚀 Next: use the 'start' command"
    ''}

    ${lib.optionalString (!isNixOS) ''
      echo "🔥 You are in the PhDAssess dev environment 🚀 Next: use the 'start' command"
    ''}
  '';
}
