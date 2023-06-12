import { network } from 'hardhat';
import fs from 'fs';

export const recordContractsData = async (contractName: string, contractAddress: string) => {
  let data;
  let networkName = network.name ? network.name : "undefined";
  const dirPath = `./scripts/helpers/contracts-data/${networkName}/${contractName}`;

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const now = new Date();
  const dateTimeJpn =
    now.getFullYear() +
    "_" +
    now.getMonth() +
    "_" +
    now.getDate() +
    "_" +
    now.getHours() +
    "_" +
    now.getMinutes() +
    "_" +
    now.getSeconds();

  data = {
    name: contractName,
    address: contractAddress,
    time: dateTimeJpn,
  };

  fs.writeFileSync(
    `${dirPath}/${contractName}-data.json`,
    JSON.stringify(data, null, 2)
  );

  fs.writeFileSync(
    `${dirPath}/${contractName}-data-${dateTimeJpn}.json`,
    JSON.stringify(data, null, 2)
  );
};