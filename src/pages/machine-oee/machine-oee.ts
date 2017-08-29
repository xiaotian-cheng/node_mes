import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { MachineServiceProvider } from "../../providers/machine-service";
import { MachineKpi } from "../../utils/machine-kpi";

@Component({
  selector: 'page-machine-oee',
  templateUrl: 'machine-oee.html',
})
export class MachineOeePage {
  @ViewChild('barCanvas') barCanvas;
  machine : any;
  barChart: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private machineSvc :MachineServiceProvider) {
    this.machine = this.navParams.data.machine;

    Chart.plugins.register({
        afterDatasetsDraw: function(chart, easing) {
                // To only draw at the end of animation, check for easing === 1
                var ctx = chart.ctx;
                chart.data.datasets.forEach(function (dataset, i) {
                    var meta = chart.getDatasetMeta(i);
                    if (!meta.hidden) {
                        meta.data.forEach(function(element, index) {
                            // Draw the text in black, with the specified font
                            ctx.fillStyle = 'rgb(0, 0, 0)';
                            var fontSize = 16;
                            var fontStyle = 'normal';
                            var fontFamily = 'Helvetica Neue';
                            ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
                            // Just naively convert to string for now
                            var dataString = dataset.data[index].toString();
                            // Make sure alignment settings are correct
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            var padding = 5;
                            var position = element.tooltipPosition();
                            ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
                        });
                    }
                });
            }
    });
  }

  ionViewWillLeave(){
    console.log("ionViewWillLeave");
  }

  ionViewDidLeave(){
      console.log("ionViewDidLeave");
  }

  ionViewWillEnter(){
    console.log("ionViewWillEnter");
  }

  ionViewDidEnter(){
      console.log("ionViewDidEnter");
  }

  ionViewDidLoad() {
      this.machineSvc.getMachinesKPI(null,null).subscribe((machineKPIs: MachineKpi[]) => {
        let kpi = machineKPIs[0];
        this.barChart.data.datasets[0].data[0] = kpi.Availability;
        this.barChart.data.datasets[0].data[1] = kpi.Performance;
        this.barChart.data.datasets[0].data[2] = kpi.Quality;
        this.barChart.data.datasets[0].data[3] = kpi.OEE;
        this.barChart.update();
      });
      
    this.barChart = new Chart(this.barCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: ["Avail.", "Perf.", "Quality", "OEE"],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: [
                        'blue',
                        'blue',
                        'blue',
                        'blue'
                    ],
                    borderColor: [
                        'red',
                        'red',
                        'red',
                        'red'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                tooltips: {
                    enabled: false
                },
                responsive: true,
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true,
                            max: 120
                        }
                    }]
                }
            } 
        });
  }
}
