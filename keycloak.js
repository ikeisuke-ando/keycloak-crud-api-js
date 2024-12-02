import KeycloakConnect from "keycloak-connect";

const config = {
    realm: "trabalho-pratico",
    'auth-server-url': "https://tdsoft-auth.hsborges.dev/",
    resource: "public-cli",
    "confidential-port": 0,
    "ssl-required": "external",
};

const keycloak = new KeycloakConnect({}, config);

export default keycloak;