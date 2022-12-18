import * as IPFS from "ipfs-core";

let ipfs: any;

export async function getIPFS() {
  ipfs = await IPFS.create({ repo: "repo" + Math.random() });
  return ipfs;
}
