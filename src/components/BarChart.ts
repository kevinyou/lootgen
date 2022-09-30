import { defineComponent, h, type PropType } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type Plugin,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default defineComponent({
  name: "BarChart",
  components: { Bar },
  props: {
    chartId: {
      type: String,
      default: "bar-chart",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object as PropType<Partial<CSSStyleDeclaration>>,
      default: () => {},
    },
    plugins: {
      type: Array as PropType<Plugin<"bar">[]>,
      default: () => [],
    },
    chartData: {
      type: Array as PropType<[string, number][]>,
      default: () => [],
    },
    datasetLabel: {
      type: String,
      default: () => "",
    },
  },
  setup(props) {
    const labels = props.chartData.map((pair) => pair[0]);
    const data = props.chartData.map((pair) => pair[1]);
    const chartData = {
      labels,
      datasets: [
        {
          label: props.datasetLabel,
          backgroundColor: "rgb(0, 189, 126)",
          data,
        },
      ],
    };

    const chartOptions = { responsive: true };

    return () =>
      h(Bar, {
        chartData,
        chartOptions,
        chartId: props.chartId,
        width: props.width,
        height: props.height,
        cssClasses: props.cssClasses,
        styles: props.styles,
        plugins: props.plugins,
      });
  },
});
