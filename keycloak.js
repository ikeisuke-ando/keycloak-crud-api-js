import KeycloakConnect from "keycloak-connect";
import session from "express-session";

export const memoryStore = new session.MemoryStore();

const config = {
    realm: "trabalho-pratico",
    'auth-server-url': "https://tdsoft-auth.hsborges.dev/",
    resource: "public-cli",
    "confidential-port": 0,
    "ssl-required": "external",
}

const  keycloak = new KeycloakConnect({store: memoryStore}, config);

export default keycloak;