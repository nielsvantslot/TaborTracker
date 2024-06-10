import { AttachmentBuilder } from "discord.js";
import { createCanvas } from "canvas";
import Chart from "chart.js/auto";

export class PlayerGraph {
  #players;

  #times;

  constructor(times, playerCounts) {
    this.#players = playerCounts;
    this.#times = times;
  }

  async draw() {
    const canvas = createCanvas(400, 200);
    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: this.#times,
        datasets: [
          {
            label: "Players Online",
            data: this.#players,
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

    const buffer = canvas.toBuffer();
    return new AttachmentBuilder(buffer, { name: "image.png" });
  }
}
