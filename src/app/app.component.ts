import { MapsAPILoader, MouseEvent } from "@agm/core";
import { Component, ElementRef, NgZone, ViewChild } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title: string = "AGM project";
  agmOptions = {
    latitude: 0,
    longitude: 0,
    zoom: 0,
    maxZoom: 22,
    minZoom: 3,
    fitbounds: true,
    styles: [
      {
        featureType: "administrative.country",
        stylers: [{ visibility: "off" }],
      },
    ],
  };
  address: string;

  private geoCoder;
  map: any;
  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {}

  ngOnInit() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();

      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.agmOptions.latitude = place.geometry.location.lat();
          this.agmOptions.longitude = place.geometry.location.lng();
          this.agmOptions.zoom = 12;
        });
      });
    });
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.agmOptions.latitude = position.coords.latitude;
        this.agmOptions.longitude = position.coords.longitude;
        this.agmOptions.zoom = 8;
        this.getAddress(this.agmOptions.latitude, this.agmOptions.longitude);
      });
    }
  }

  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.agmOptions.latitude = $event.coords.lat;
    this.agmOptions.longitude = $event.coords.lng;
    this.getAddress(this.agmOptions.latitude, this.agmOptions.longitude);
  }

  getAddress(latitude: number, longitude: number) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        console.log(results);
        console.log(status);
        if (status === "OK") {
          if (results[0]) {
            this.agmOptions.zoom = 12;
            this.address = results[0].formatted_address;
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      }
    );
  }

  onMapReady(map: any) {
    this.map = map;
  }
  onZoomChange(zoom: number) {
    this.agmOptions.zoom = zoom;
  }
}
