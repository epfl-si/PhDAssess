{ pkgs, lib, config, inputs, ... }:
{
  packages = [
    pkgs.meteor
  ];

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
    PHDASSESS_DESACTIVATE_ZEEBE = "false";

    # Secrets
    AUTH_ENTRA_TENANT_ID = config.secretspec.secrets.AUTH_ENTRA_TENANT_ID or "";
    AUTH_ENTRA_CLIENT_ID = config.secretspec.secrets.AUTH_ENTRA_CLIENT_ID or "";
    AUTH_ENTRA_SECRET = config.secretspec.secrets.AUTH_ENTRA_SECRET or "";

    PHDASSESS_ENCRYPTION_KEY = config.secretspec.secrets.PHDASSESS_ENCRYPTION_KEY or "";

    ALFRESCO_URL = config.secretspec.secrets.ALFRESCO_URL or "";
    ALFRESCO_USERNAME = config.secretspec.secrets.ALFRESCO_USERNAME or "";
    ALFRESCO_PASSWORD = config.secretspec.secrets.ALFRESCO_PASSWORD or "";

    API_EPFL_CH_TOKEN = config.secretspec.secrets.API_EPFL_CH_TOKEN or "";

  };

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
    meteor --settings=settings.json
  '';

  enterShell = ''
    echo ""
    echo "🎓 📈 ✅ PhDAssess Development Environment 💻 ☄️"
    echo "=================================="
    echo "👉  Project: epfl-si/PhDAssess"
    echo "📌  Running devenv shell…"
    echo ""

    check-and-stop-if-missing-proto

    echo ""
    echo "Use 'start' to serve the web app."
  '';
}
