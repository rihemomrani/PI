import { Component, OnInit } from '@angular/core';
import { PredictionService } from '../../../Services/prediction.service';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {
  predictions: any;
  errorMessage: string | null = null;
  predictionData: any;

  constructor(private predictionService: PredictionService) {}

  ngOnInit() {
    this.fetchDataAndPredict();
  }

  fetchDataAndPredict() {
    this.predictionService.getAllPredictionData().subscribe({
      next: (data) => {
        this.errorMessage = null;
        this.predictionData = data[0]; // Store the used data
        const features = this.extractFeatures(data[0]); // Using the most recent data
        this.getPredictions(features);
      },
      error: (error) => {
        console.error('Error fetching all prediction data:', error);
        this.errorMessage = 'Error fetching prediction data';
      }
    });
  }

  extractFeatures(data: any): number[] {
    return [
      data.GPS.LAT,
      data.GPS.LNG,
      data.Acceleration.X,
      data.Acceleration.Y,
      data.Acceleration.Z,
      data.Gyroscope.X,
      data.Gyroscope.Y,
      data.Gyroscope.Z
    ];
  }

  getPredictions(features: number[]) {
    this.predictionService.getPrediction(features).subscribe({
      next: (data) => {
        this.predictions = data;
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Error getting predictions:', error);
        this.errorMessage = 'Error getting predictions';
      }
    });
  }
}
