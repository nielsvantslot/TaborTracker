import { AttachmentBuilder } from "discord.js";
import { createCanvas } from "canvas";
import { graphLength } from "../util/constants.js";
import Chart from "chart.js/auto";

export class Graph {
  constructor() {
    this.players = [];
    this.times = [];
  }

  async generateImage() {
    const canvas = createCanvas(400, 200);
    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: this.times,
        datasets: [
          {
            label: "Players Online",
            data: this.players,
            fill: false,
            pointStyle: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    const buffer = await canvas.toBuffer();
    return new AttachmentBuilder(buffer, { name: "image.png" });
  }

  push(data) {
    this.pushTime(data.time);
    this.pushPlayercount(data.players);
    return {
      players: this.players,
      times: this.times,
    };
  }

  setData(data) {
    this.players = data.players.slice(0, graphLength);
    this.times = data.times.slice(0, graphLength);
  }

  pushPlayercount(count) {
    this.players.push(count);
    if (this.players.length > graphLength) {
      this.players.shift();
    }
  }

  pushTime(count) {
    this.times.push(count);
    if (this.times.length > graphLength) {
      this.times.shift();
    }
  }
}
