import type { Endpoints } from "@octokit/types";
// Keep this synced with package.json:dependencies:octokit
import { Octokit } from "https://cdn.skypack.dev/pin/octokit@v2.0.7-bIjDAPxq3TpWV34ifrMi/mode=imports,min/optimized/octokit.js";

const GET_REPOS_URL = "GET /repos/{owner}/{repo}";
type GetReposParameters = Endpoints[typeof GET_REPOS_URL]["parameters"];
export type GetReposResponse = Endpoints[typeof GET_REPOS_URL]["response"];

export const getRepos = async (params: GetReposParameters) => {
  const octokit = new Octokit();
  const res: GetReposResponse = await octokit.request(GET_REPOS_URL, params);

  return res;
};
