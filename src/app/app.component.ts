import { EventData } from "./../models/Response";
import { AgmInfoWindow, MapsAPILoader, MouseEvent } from "@agm/core";
import { Component, ElementRef, NgZone, ViewChild } from "@angular/core";
import { AgmOpt, marker } from "src/models/Response";
import { User } from "src/models/User";
import { MyServiceService } from "./my-service.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  private geoCoder;
  searchedPosition: marker;
  startPosition: any;
  endPosition: any;
  agmOpt: AgmOpt;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private myService: MyServiceService
  ) {
    this.initMap();
    this.searchedPosition = new marker();
  }
  initMap() {
    this.agmOpt = new AgmOpt();
    this.agmOpt.maxZoom = 22;
    this.agmOpt.minZoom = 3;
  }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();

      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.searchedPosition.lat = place.geometry.location.lat();
          this.searchedPosition.lng = place.geometry.location.lng();
          this.agmOpt.zoom = 12;
          //To get start position of the direction
          this.getStartPosition();
          this.GetVehicleProche();
        });
      });
    });
    this.initDropdown();
  }

  private setCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.searchedPosition.lat = position.coords.latitude;
        this.searchedPosition.lng = position.coords.longitude;
        this.agmOpt.zoom = 8;
        this.getStartPosition();
        this.getAddress();
        this.GetVehicleProche();
      });
    }
  }

  getAddress() {
    this.geoCoder.geocode(
      {
        location: {
          lat: this.searchedPosition.lat,
          lng: this.searchedPosition.lng,
        },
      },
      (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            this.agmOpt.zoom = 12;
            this.searchedPosition.address = results[0].formatted_address;
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      }
    );
  }
  defaultUser: User[] = [
    new User("motivation", "admin", "motivation123321"),
    new User("alaqsa", "admin", "19641964"),
    new User("actitrans", "admin", "666666"),
    new User("vanadinite", "admin", "senda123"),
  ];
  user: User = new User();
  listEventData: EventData[] = [];
  GetVehicleProche() {
    this.GetConnectedUser();
    let webServiceUrl =
      "http://wsdv.sendatrack.com/GPS/Lst_div/" +
      this.user.compte +
      "/" +
      this.user.login +
      "/" +
      this.user.motDePass +
      "/" +
      this.rayon +
      "/" +
      this.searchedPosition.lat +
      "/" +
      this.searchedPosition.lng;
    this.myService.GetVehicleProche(webServiceUrl).subscribe(
      (data) => {
        this.listEventData = data;
        this.listEventData = this.listEventData.map((e) => {
          e.icon = this.getIcon(e);
          return e;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
  GetConnectedUser() {
    let compte = localStorage.getItem("compte");
    let login = localStorage.getItem("login");
    let motDePass = localStorage.getItem("motDePass");
    this.user.compte = compte ? compte : this.defaultUser[0].compte;
    this.user.login = login ? login : this.defaultUser[0].login;
    this.user.motDePass = motDePass ? motDePass : this.defaultUser[0].motDePass;
  }

  previousWindow: AgmInfoWindow = null;

  clickMarker(infoWindow: AgmInfoWindow, event: any = null) {
    if (this.previousWindow && this.previousWindow.isOpen) {
      this.previousWindow.close();
    }
    this.previousWindow = infoWindow;
    if (event) {
      this.drawDirection(event);
    }
  }

  dragEndMarker(event) {
    this.searchedPosition.lat = event.coords.lat;
    this.searchedPosition.lng = event.coords.lng;
    this.getStartPosition();
    this.getAddress();
  }

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  initDropdown() {
    this.dropdownList = ["10 Km", "50 Km", "100 Km", "200 Km", "300 Km"];
    this.selectedItems = ["10 Km"];
    this.dropdownSettings = {
      singleSelection: true,
      idField: "item_id",
      textField: "item_text",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: "Rechercher",
    };
  }
  rayon: number = 10;
  onItemSelect(item: any) {
    let val: string = item.split(" ")[0];
    this.rayon = +val; //convert to number
    if (this.searchedPosition.address) {
      this.GetVehicleProche();
    }
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  getIcon(marker: EventData) {
    let tmp = 50;
    var icon = {
      labelOrigin: { x: tmp, y: tmp }, //16,48
      url: "./assets/images/va.png",
      scaledSize: {
        width: tmp, //20, 90
        height: tmp, //40, 90
      },
    };
    if (marker.StatusCode != 62467) {
      switch (marker.Heading_desc) {
        case "N":
          icon.url = "./assets/images/vmn.png";
          break;
        case "NE":
          icon.url = "./assets/images/vmne.png";
          break;
        case "NO":
          icon.url = "./assets/images/vmno.png";
          break;
        case "S":
          icon.url = "./assets/images/vms.png";
          break;
        case "SE":
          icon.url = "./assets/images/vmse.png";
          break;
        case "SO":
          icon.url = "./assets/images/vmso.png";
          break;

        case "E":
          icon.url = "./assets/images/vme.png";
          break;
        case "O":
          icon.url = "./assets/images/vmo.png";
          break;

        default:
          icon.url = "./assets/images/vmn.png";
          break;
      }
    }
    return icon;
  }

  renderOptions = {
    suppressMarkers: true,
  };
  isDrew: boolean = false;
  drawDirection(event: any) {
    let lat = event.latitude;
    let lng = event.longitude;
    if (
      this.endPosition &&
      lat == this.endPosition.lat &&
      lng == this.endPosition.lng &&
      this.isDrew
    ) {
      this.isDrew = !this.isDrew;
    } else {
      this.isDrew = true;
    }
    this.endPosition = { lat: lat, lng: lng };
  }

  getStartPosition() {
    this.startPosition = {
      lat: this.searchedPosition.lat,
      lng: this.searchedPosition.lng,
    };
  }
  public onChange(event: any) {
    console.log(event.routes[0].legs[0].duration.text);
    console.log(event.routes[0].legs[0].distance.text);
    console.log(event.request.travelMode);
    // You can do anything.
    console.log(event);
  }

  listTravelMode:string[]=['DRIVING', 'TRANSIT', 'WALKING']
  travelMode:string='DRIVING';
}
