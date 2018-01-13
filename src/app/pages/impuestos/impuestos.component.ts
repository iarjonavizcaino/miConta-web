import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-impuestos',
  templateUrl: './impuestos.component.html',
  styleUrls: ['./impuestos.component.css']
})
export class ImpuestosComponent implements OnInit {
  canvas: any;
  ctx: any;
  pieChart: any;
  myChart: any;

  constructor() { }

  ngOnInit() {
    this.loadChart();
  }

  loadChart() {
    this.canvas = document.getElementById('pieCanvas');
    this.ctx = this.canvas.getContext('2d');

    const barChartData = {
      labels: ['IVA', 'IEPS', 'ISR'],
      datasets: [{
        label: 'test',
        data: [7168732, 12345678, 895733],
        backgroundColor: [
          'rgba(95,142,181,0.7)', // blue
          'rgba(245,141,141,0.7)',  // red
          'rgba(193,243,86,0.7)'  // green
        ],
        hoverBackgroundColor: [
          '#59a2c5',
          '#F58D8D',
          '#C1F356'
        ]
      }]
    };
    this.myChart = new Chart(this.ctx, {
      type: 'pie',
      data: barChartData,
    });
  }

}
