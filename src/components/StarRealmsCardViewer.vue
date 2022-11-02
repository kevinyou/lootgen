<script setup lang="ts">
import type { StarRealms } from "@/services/starRealmsCards";
import { computed } from "vue";
import { ref } from "vue";
// from https://gist.github.com/ineffably/e39c99b9d1f4fd00b98dfdbbd223b52e
import RAW_DATA from "../assets/star-realms-cards.json";
const DATA = RAW_DATA as StarRealms.Card[];

const factionEmojiMap = {
  "Star Empire": "🟡",
  "Machine Cult": "🔴",
  "Trade Federation": "🔵",
  Blob: "🟢",
  Unaligned: "⚪",
};

const getFactionEmojis = (factionString: string) => {
  let x = factionString;
  for (const [key, value] of Object.entries(factionEmojiMap)) {
    x = x.replace(key, value);
  }
  return x;
};

const counter = ref<number | null>(null);
const card = computed<StarRealms.Card | null>(() => {
  if (counter.value === null) {
    return null;
  }
  console.log(DATA);
  return DATA[counter.value];
});
const pickShip = () => {
  counter.value = Math.floor(Math.random() * DATA.length);
};
</script>

<template>
  <div class="card" v-if="card">
    <div class="faction">{{ getFactionEmojis(card.Faction) }}</div>
    <div class="name">{{ card.Name }}</div>
    <div class="cost">{{ card.Cost }}</div>
    <div class="type">{{ `${card.Faction} ${card.Type}` }}</div>
    <div class="text">{{ card.Text }}</div>
    <div class="set">{{ card.Set }}</div>
    <div class="defense">{{ card.Defense }}</div>
  </div>
  <button @click="pickShip()">Click me</button>
</template>

<style scoped>
.card {
  width: 70%;
  height: 300px;
  display: grid;
  grid-template-areas:
    "faction name name name cost"
    "type type type type type"
    "text text text text text"
    "set defense defense defense defense";
}
.faction {
  grid-area: faction;
  text-align: left;
}
.name {
  grid-area: name;
  text-align: center;
}
.cost {
  grid-area: cost;
  text-align: right;
}
.type {
  grid-area: type;
  text-align: center;
}
.text {
  grid-area: text;
  text-align: center;
}
.set {
  grid-area: set;
  text-align: left;
}
.defense {
  grid-area: defense;
  text-align: right;
}
</style>
