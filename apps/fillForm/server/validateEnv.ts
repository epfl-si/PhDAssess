export const validateEnv = () => {
  //TODO: extend the list with the other needed values
  const required = [
    'ZEEBE_ADDRESS',
    'PHDASSESS_ENCRYPTION_KEY',
    'API_EPFL_CH_TOKEN',
    'ALFRESCO_USERNAME',
    'ALFRESCO_PASSWORD',
    'ALFRESCO_URL',
  ];
  const missing = required.filter(k => !process.env[k]);

  if (missing.length) {
    console.error(`Missing environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};
