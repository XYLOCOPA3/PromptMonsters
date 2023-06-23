import { PromptMonstersItem } from "../../../typechain-types";

export async function postDeployPromptMonstersItem(
  promptMonstersItem: PromptMonstersItem,
  externalLink: string,
) {
  await (await promptMonstersItem.setExternalLink(externalLink)).wait();
  return {
    promptMonstersItem,
  };
}
