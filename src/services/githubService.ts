import type { Endpoints } from "@octokit/types";
// Keep this synced with package.json:dependencies:octokit
import { Octokit } from "https://cdn.skypack.dev/pin/octokit@v2.0.7-bIjDAPxq3TpWV34ifrMi/mode=imports,min/optimized/octokit.js";

const GET_REPOS_URL = "GET /repos/{owner}/{repo}";
type GetReposParameters = Endpoints[typeof GET_REPOS_URL]["parameters"];
type GetReposResponse = Endpoints[typeof GET_REPOS_URL]["response"];
export type RepoMetadata = GetReposResponse["data"];

export const getRepos = async (params: GetReposParameters) => {
  const octokit = new Octokit();
  const res = await octokit.request(GET_REPOS_URL, params);

  return res.data;
};

const GET_COMMITS_URL = "GET /repos/{owner}/{repo}/commits";
type GetCommitsParameters = Endpoints[typeof GET_COMMITS_URL]["parameters"];
type GetCommitsResponse = Endpoints[typeof GET_COMMITS_URL]["response"];
export type Commits = GetCommitsResponse["data"];
export type Commit = Commits[number];

const getCommits = async (params: GetCommitsParameters): Promise<Commit[]> => {
  const octokit = new Octokit();
  const res = await octokit.request(GET_COMMITS_URL, params);

  return res.data;
};

export const getAllCommits = async (
  params: GetCommitsParameters
): Promise<Commit[]> => {
  let pageNumber = 1;
  const allCommits: Commit[] = [];
  let pageCommits: Commit[];
  do {
    pageCommits = await getCommits({ ...params, page: pageNumber });
    console.log({ pageNumber, n: pageCommits.length });
    allCommits.push(...pageCommits);
    pageNumber++;
  } while (pageCommits.length > 0);

  return allCommits // OoOoO I forgot a semicolon
};
