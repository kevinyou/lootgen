// Instructions from
// https://docs.skypack.dev/skypack-cdn/code/javascript#using-skypack-urls-in-typescript

// First, let TypeScript allow all module names starting with "https://". This will suppress TS errors.
declare module "https://*";

// Second, list out all your dependencies. For every URL, you must map it to its local module.
declare module "https://cdn.skypack.dev/pin/octokit@v2.0.7-bIjDAPxq3TpWV34ifrMi/mode=imports,min/optimized/octokit.js" {
  export * from "octokit";
}
