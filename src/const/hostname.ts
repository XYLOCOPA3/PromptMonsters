export const HOST_NAME =
  process.env.STAGE === "production"
    ? "prompt-monsters.com"
    : process.env.STAGE === "demo"
    ? "prompt-monsters-demo-jp.azurewebsites.net"
    : process.env.STAGE === "develop"
    ? "prompt-monsters-develop-jp.azurewebsites.net"
    : "localhost:3000";
