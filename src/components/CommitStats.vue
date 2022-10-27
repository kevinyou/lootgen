<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { getAllCommits, type Commits } from "../services/githubService";
import BarChart from "../components/BarChart";

const props = defineProps<{
  owner: string;
  repo: string;
}>();
const commits = ref<Commits | null>(null);

const loadCommits = async () => {
  commits.value = null;
  const res = await getAllCommits({
    owner: props.owner,
    repo: props.repo,
  });
  commits.value = res;
};

const commitMessages = computed(() => {
  const commitsArray = commits.value;
  if (commitsArray === null) {
    return [];
  }
  return commitsArray.map((commit) => commit.commit.message);
});

const getWordFrequencies = (messages: string[]) => {
  const frequencyMap: Record<string, number> = {};
  for (let message of messages) {
    const lowercaseCharacters = message
      .toLocaleLowerCase()
      .replace(/[^a-z ]+/g, "");
    for (let token of lowercaseCharacters.split(" ")) {
      frequencyMap[token] = (frequencyMap[token] || 0) + 1;
    }
  }
  return frequencyMap;
};

const wordFrequencies = computed(() =>
  getWordFrequencies(commitMessages.value)
);

const sortedWordFrequencies = computed<[string, number][]>(() => {
  const pairs = Object.entries(wordFrequencies.value).map(([word, freq]) => ({
    word,
    freq,
  }));
  return pairs
    .sort((a, b) => b.freq - a.freq)
    .map(({ word, freq }) => [word, freq]);
});

const commitTimestamps = computed(() => {
  const commitsArray = commits.value;
  if (commitsArray === null) {
    return [];
  }
  return commitsArray.map((commit) => commit.commit?.committer?.date);
});

const DAYS_OF_THE_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const weekdays = computed<[string, number][]>(() => {
  const dates = commitTimestamps.value
    .filter((x) => !!x)
    .map((value) => new Date(value as string));
  const commitWeekdays = dates.map((date) =>
    date.toLocaleString("en-US", { timeZone: "Asia/Tokyo", weekday: "long" })
  );

  const weekdayFrequencies: Record<string, number> = {};
  for (let commitWeekday of commitWeekdays) {
    weekdayFrequencies[commitWeekday] =
      (weekdayFrequencies[commitWeekday] || 0) + 1;
  }
  return DAYS_OF_THE_WEEK.map((dayOfTheWeek) => {
    return [dayOfTheWeek, weekdayFrequencies[dayOfTheWeek] || 0];
  });
});

onMounted(async () => {
  await loadCommits();
});
</script>

<template>
  <main>
    <div v-if="commits">
      <ul>
        <li>The repo has {{ commits.length }} commits.</li>
      </ul>
      <BarChart
        chartId="commitsPerWeekday"
        :chartData="weekdays"
        datasetLabel="Number of Commits"
      />
      <BarChart
        chartId="wordFrequency"
        :chartData="sortedWordFrequencies"
        datasetLabel="Word Frequency in Commit Messages"
      />
    </div>
  </main>
</template>

<style scoped></style>
