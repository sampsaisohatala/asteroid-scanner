import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AsteroidsProvider } from '../../providers/asteroids/asteroids';
import { DatePipe } from '@angular/common';
import { Chart } from 'chart.js';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  bubbleBar: any;
  asteroids: any;
  currentDate: any;
  pickedDate: any;
  numberOfNeo: number;
  isLoaded: boolean;
  canvas: any;

  public diameters: any = [];
  public names: any = [];
  public missDistances: any = [];
  public velocities: any = [];
  public datasets: any = [];

  constructor(public navCtrl: NavController,private asteroidsProvider: AsteroidsProvider, private datePipe: DatePipe) {
    this.isLoaded = false;
    let date = new Date();
    this.currentDate = this.datePipe.transform(date,"yyyy-MM-dd");
    this.pickedDate = this.currentDate;
  }

  ionViewDidLoad() {
    this.asteroidsProvider.getAllNeoAsteroids(this.pickedDate).subscribe(data => { 
      this.asteroids = data.near_earth_objects[this.currentDate];
      console.log(this.asteroids);
      this.numberOfNeo = this.asteroids.length;
      this.isLoaded = true;     
      this.drawBubbleChart();
    });
  }
  drawBubbleChart() {
    this.getNames();
    this.getDiameters();
    this.getVelocity();
    this.getMissDistance();
    this.createDatasets();
    this.canvas = document.getElementById('canvas');

    this.bubbleBar = new Chart(this.canvas, {    
      type: 'bubble',
      data: {
        labels: "",
        datasets: this.datasets
      },
      options: {
        responsive: true,
        aspectRatio: .7,
        scales: {
          scaleLabel: {
            fontSize: 1
          },
          yAxes: [{ 
            scaleLabel: {
              display: true,
              labelString: "Relative velocity km/s"
            }
          }],
          xAxes: [{ 
            scaleLabel: {
              display: true,
              labelString: "Miss distance km"
            }
          }]
        }
      }
    });
  }

  createDatasets() {
    if(this.datasets.length != 0){
      this.datasets = [];
    }

    for (let i = 0; i < this.numberOfNeo; i++) {

      let color = !this.asteroids[i].is_potentially_hazardous_asteroid ? "rgba(0,0,0,0.2)" : "rgba(255,0,0,0.2)";

      let dataset: any;
      dataset={
        label: this.names[i],
        backgroundColor: color,
        borderColor: "#000",
        data: [{
          x: this.missDistances[i],
          y: this.velocities[i],
          r: this.diameters[i] / 40// koitappa löytää parempi tapa
        }]
      }
      this.datasets.push(dataset);
    }
  }

  getNames() {
    for (let i = 0; i < this.numberOfNeo; i++) {
      let name: number = this.asteroids[i].name;
      this.names.push(name);  
    }
  }

  getDiameters() {
    for (let i = 0; i < this.numberOfNeo; i++) {
      let dm: number = this.asteroids[i].estimated_diameter.meters.estimated_diameter_max;
      this.diameters.push(dm);
    }
  }

  getMissDistance() {
    for (let i = 0; i < this.numberOfNeo; i++) {
      let distance: number = this.asteroids[i].close_approach_data[0].miss_distance.kilometers;
      this.missDistances.push(distance);
    }
  }

  getVelocity() {
    for (let i = 0; i < this.numberOfNeo; i++) {
      let velocity: number = this.asteroids[i].close_approach_data[0].relative_velocity.kilometers_per_second;
      this.velocities.push(velocity);
    }
  }

  getNewData() {
    this.isLoaded = false;
    this.deleteCanvas();
    this.createCanvas();
    this.asteroidsProvider.getAllNeoAsteroids(this.pickedDate).subscribe(data => {
      this.isLoaded = true;
      this.asteroids = [];
      this.asteroids = data.near_earth_objects[this.pickedDate];
      this.numberOfNeo = this.asteroids.length
      this.drawBubbleChart();
    });
  }
  
  deleteCanvas() {
    let elem = document.getElementById('canvas');
    elem.parentNode.removeChild(elem);
  }

  createCanvas() {
    let elem = document.createElement("canvas");
    elem.setAttribute('id','canvas');
    document.getElementById("canvasParent").appendChild(elem);
  }
}
