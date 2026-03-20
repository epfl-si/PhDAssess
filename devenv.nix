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

    runScript = pkgs.writeShellScript "meteor-fhs-run" ''
      ${welcome}
      exec bash
    '';
  };

  welcome = ''
    echo "🔥 You are in the PhDAssess dev environment 💻 ☄"
    echo "It may be a good time to look into the PhDAssess.ops project and start the Zeebe quorum and his auxiliaries."
    echo "Next: use the 'start' command to launch Meteor"
  '';
in
{
  packages =
    if isNixOS then
      [ meteorFhs ]
    else
      needed_packages;

  dotenv.enable = true;

  # this env variables are loaded before NodeJS start
  env = {
    NODE_ENV = "development";
    # ignore some log info
    DEBUG = ''
        *
        ,-grpc
        ,-worker
        ,-babel
        ,-compression-connect*
        ,-combined-stream2
        ,-express:*
        ,-connection-pool
        ,-connect:*
        ,-send
        ,-body-parser:*
        ,-compression
        ,-finalhandler
        ,-express*
        ,-router
        ,-router:*
        ,-http-proxy-middleware
      '';
    DEBUG_COLORS = "yes";
    MONGO_PERSISTENT_URL = "mongodb://127.0.0.1:3001/meteor";
    TOOL_NODE_FLAGS = "";   # Meteor's node options
  };

  scripts.meteor-install.exec = ''
    if ! command -v meteor >/dev/null; then
      echo "Installing Meteor..."
      curl https://install.meteor.com/ | sh
    else
      echo "Meteor is already installed"
    fi
  '';

  scripts.check-and-stop-if-missing-proto.exec = ''
    echo "Checking for required proto file 🔬..."
    dir=/proto;
    if [ ! -d "$dir" ] && [ -z "$(ls -A "$dir")" ]; then
      echo "⚠️ Warning, you miss the Zeebe proto file needed by this project.";
      echo "  Please run this as root before continuing";
      echo "    sudo mkdir -p /proto";
      echo "    sudo cp ./node_modules/zeebe-node/proto/zeebe.proto /proto";
      echo "    sudo chmod 755 /proto";
      echo "    sudo chmod 644 /proto/zeebe.proto";
      exit 1;
    else
      echo "✅ proto file found."
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
    echo ""
    echo "🎓 📈 ✅ PhDAssess Development Environment 💻 ☄️"
    echo "=================================="
    echo "👉  Project: epfl-si/PhDAssess"
    echo "📌  Running devenv shell…"
    echo ""
    export PATH="$HOME/.meteor:$PATH"

    check-and-stop-if-missing-proto

    ${lib.optionalString isNixOS ''
      echo "❄️ 🔥️ Entering Meteor FHS dev environment for NixOs... ❄️"
      exec meteor-fhs
    ''}

    ${lib.optionalString (!isNixOS) ''
      ${welcome}
    ''}
  '';
}
