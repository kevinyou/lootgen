<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getRepos, type GetReposResponse } from "./services/githubService";

const repoMetadata = ref<GetReposResponse | null>(null);

const loadRepoMetadata = async () => {
  repoMetadata.value = null;
  const res = await getRepos({
    owner: "lrdwhyt",
    repo: "coscheduler",
  });
  repoMetadata.value = res;
};

onMounted(async () => {
  await loadRepoMetadata();
});
</script>

<template>
  <main>
    <h1>Welcome to coschedulerscheduler.</h1>

    <div v-if="repoMetadata">
      <p>
        You can access
        <a :href="repoMetadata.data.html_url"
          >coscheduler's source code at GitHub</a
        >.
      </p>

      <p>The owner of coscheduler is {{ repoMetadata.data.owner.login }}.</p>
    </div>
    <div v-else>Loading...</div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
