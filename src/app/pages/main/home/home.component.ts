import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Observable, Subscriber } from 'rxjs';
import { environment } from '../../../../environments/environment'
import { HttpClient } from '@angular/common/http';


@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  map: any;

  drawingEnabled = false;
  
  lines : any[] = [];

  constructor(private http: HttpClient) { }

  public ngAfterViewInit(): void {
    this.loadMap();
    // this.map.on('click', this.onMapClick);
  }

  private getCurrentPosition(): any {
    return new Observable((observer: Subscriber<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          observer.complete();
        });
      } else {
        observer.error();
      }
    });
  }

  // Salta una alerta cuando clickeas en el mapa
  private onMapClick(e: any) {
    alert("You clicked the map at " + e.latlng);
  }

  private loadMap(): void {
    this.map = L.map('map').setView([0, 0], 1);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
      id: 'mapbox/streets-v11',
      accessToken: environment.mapbox.accessToken,
    }).addTo(this.map);

    this.getCurrentPosition()
    .subscribe((position: any) => {
      this.map.setView([position.latitude, position.longitude], 13);
    });


    // L.polygon([
    //   [-33.4372, -70.6506],
    //   [-33.4489, -70.6693],
    //   [-33.4569, -70.6483],
    //   [-33.4263,  -70.6099]
    // ]).addTo(this.map);
  }

  toggleDrawing(): void {
    if (this.drawingEnabled) {
      this.map.off('click');
      this.drawingEnabled = false;
    } else {
      this.map.on('click', (e: any) => {
        console.log(e.latlng)
        const latlng = e.latlng;
        this.lines.push(latlng);
        L.polyline([this.lines], {color: 'green'}).addTo(this.map);
      });
      this.drawingEnabled = true;
    }
  }

  guardarTextoEnBD(texto: string): void {
    const url = 'https://feriapp-1fc77-default-rtdb.firebaseio.com/texto.json';
    const payload = { texto };
    this.http.request('PUT', url, { body: payload }).subscribe(
      (r: any) => console.log('Texto guardado con éxito en la base de datos en tiempo real de Firebase', r)
    );
  }
  
  

  ngOnInit(): void {
    this.guardarTextoEnBD('a')
  }

}
