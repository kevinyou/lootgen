<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { getCommits, type Commits } from "../services/githubService";

const commits = ref<Commits | null>(null);

const loadCommits = async () => {
  commits.value = null;
  const res = await getCommits({
    owner: "lrdwhyt",
    repo: "coscheduler",
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

const sortedWordFrequencies = computed(() => {
  const pairs = Object.entries(wordFrequencies.value).map(([word, freq]) => ({
    word,
    freq,
  }));
  return pairs.sort((a, b) => a.freq - b.freq);
});

const mostFrequentWord = computed(() => {
  return (
    sortedWordFrequencies.value[sortedWordFrequencies.value.length - 1]?.word ||
    ""
  );
});

const leastFrequentWord = computed(() => {
  return sortedWordFrequencies.value[0]?.word || "";
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

const weekdays = computed(() => {
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
        <li>
          The most common word in descriptions is "{{ mostFrequentWord }}".
        </li>
        <li>
          The least common word in descriptions is "{{ leastFrequentWord }}".
        </li>
      </ul>
      <table>
        <tr>
          <th>Day of the Week</th>
          <th>Number of Commits</th>
        </tr>
        <tr v-for="[key, val] in weekdays" :key="key">
          <td>
            {{ key }}
          </td>
          <td>
            {{ val }}
          </td>
        </tr>
      </table>
    </div>
  </main>
</template>

<style scoped></style>
