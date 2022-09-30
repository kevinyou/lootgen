<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getRepos, type RepoMetadata } from "./services/githubService";
import MainPageHeader from "./components/MainPageHeader.vue";
import CommitStats from "./components/CommitStats.vue";

const repoMetadata = ref<RepoMetadata | null>(null);

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
  <header>
    <div class="wrapper">
      <MainPageHeader msg="Welcome to coschedulerscheduler." />
    </div>
  </header>
  <main>
    <div v-if="repoMetadata">
      <p>
        You can access
        <a :href="repoMetadata.html_url">coscheduler's source code at GitHub</a
        >.
      </p>

      <p>The owner of coscheduler is {{ repoMetadata.owner.login }}.</p>
    </div>
    <div v-else>Loading...</div>
    <CommitStats />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
