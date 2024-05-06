import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from '../../../Services/marker-service.service';

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40]
});

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss']
})
export class MapPageComponent implements AfterViewInit {
  private map: any;

  constructor(private ms: MarkerService, private route: ActivatedRoute) { }

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.route.queryParams.subscribe(params => {
      const lat = +params['lat'];
      const lng = +params['lng'];
      if (lat && lng) {
        this.map.setView([lat, lng], 13); // Zoom level 13
        L.marker([lat, lng], { icon }).addTo(this.map);
      } else {
        this.getMarkers();
      }
    });
  }

  private getMarkers(): void {
    this.ms.RestoreCords().subscribe(gpsData => {
      gpsData.forEach(data => {
        L.marker([data.LAT, data.LNG], { icon }).addTo(this.map);
      });
    });
  }
}
