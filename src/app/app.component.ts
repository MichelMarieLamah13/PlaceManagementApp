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
  startAddress:string="";
  endAddress:string="";
  distanceItineraire:string="";
  dureeItineraire:string="";

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
    this.agmOpt.styles = [
      {
        featureType: "administrative.country",
        stylers: [{ visibility: "off" }],
      },
    ];
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
          this.searchedPosition.address = place.formatted_address;
          this.agmOpt.zoom = 12;
          //To get start position of the direction
          this.getStartPosition();
          this.GetVehicleProche();
        });
      });
    });
    this.initDropdown();
    this.initPiDropdown();
  }

  private setCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.searchedPosition.lat = position.coords.latitude;
        this.searchedPosition.lng = position.coords.longitude;
        this.agmOpt.zoom = 8;
        this.getStartPosition();
        this.getAddress();
        //this.GetVehicleProche();
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
            this.startAddress = this.searchedPosition.address;
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
    this.clearDirection();
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

  clickMarker(infoWindow: AgmInfoWindow, event: EventData = null) {

    if (this.previousWindow) {
      this.previousWindow.close();
    }
    this.previousWindow = infoWindow;
    if (event) {
      this.selectedMarker = event;
      this.endAddress = this.selectedMarker.Address;
      this.dureeItineraire="";
      this.distanceItineraire="";
      this.isDrew=false;
    }
  }

  dragEndMarker(event) {
    this.searchedPosition.lat = event.coords.lat;
    this.searchedPosition.lng = event.coords.lng;
    this.getStartPosition();
    this.getAddress();
    this.GetVehicleProche();
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

  piDropdownList = [];
  piSelectedItems = [];
  piDropdownSettings = {};
  listPI=[];
  initPiDropdown(){
    this.piDropdownList = [
      {
        item_id: 1,
        item_text: "India",
        image: "http://www.sciencekids.co.nz/images/pictures/flags96/India.jpg",
      },
      {
        item_id: 2,
        item_text: "Spain",
        image: "http://www.sciencekids.co.nz/images/pictures/flags96/Spain.jpg",
      },
      {
        item_id: 3,
        item_text: "United Kingdom",
        image:
          "http://www.sciencekids.co.nz/images/pictures/flags96/United_Kingdom.jpg",
      },
      {
        item_id: 4,
        item_text: "Canada",
        image:
          "http://www.sciencekids.co.nz/images/pictures/flags96/Canada.jpg",
        isDisabled: true,
      },
      {
        item_id: 5,
        item_text: "Israel",
        image:
          "http://www.sciencekids.co.nz/images/pictures/flags96/Israel.jpg",
      },
      {
        item_id: 6,
        item_text: "Brazil",
        image:
          "http://www.sciencekids.co.nz/images/pictures/flags96/Brazil.jpg",
      },
      {
        item_id: 7,
        item_text: "Barbados",
        image:
          "http://www.sciencekids.co.nz/images/pictures/flags96/Barbados.jpg",
      },
      {
        item_id: 8,
        item_text: "Mexico",
        image:
          "http://www.sciencekids.co.nz/images/pictures/flags96/Mexico.jpg",
      },
    ];
    this.piSelectedItems = [
      {
        item_id: 1,
        item_text: "India",
        image: "http://www.sciencekids.co.nz/images/pictures/flags96/India.jpg",
      },
      {
        item_id: 5,
        item_text: "Israel",
        image:
          "http://www.sciencekids.co.nz/images/pictures/flags96/Israel.jpg",
      },
    ];
    this.piDropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  get getPI() {
    return this.piDropdownList.reduce((acc, curr) => {
      acc[curr.item_id] = curr;
      return acc;
    }, {});
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
  selectedMarker:EventData;
  drawDirection() {
    if(this.selectedMarker){
      let lat = this.selectedMarker.GPSPoint_lat;
      let lng = this.selectedMarker.GPSPoint_lon;
      if (
        this.endPosition &&
        lat == this.endPosition.lat &&
        lng == this.endPosition.lng &&
        this.isDrew
      ) {
        this.isDrew = !this.isDrew;
      } else {
        this.isDrew = true;
        this.endPosition = { lat: lat, lng: lng };
        this.startAddress = this.searchedPosition.address;
      }

    }
  }

  getStartPosition() {
    this.startPosition = {
      lat: this.searchedPosition.lat,
      lng: this.searchedPosition.lng,
    };
    this.startAddress = this.searchedPosition.address;
  }
  public onChange(event: any) {
    this.dureeItineraire=event.routes[0].legs[0].duration.text;
    this.distanceItineraire=event.routes[0].legs[0].distance.text;
  }

  clearDirection(){
    this.endAddress="";
    this.dureeItineraire="";
    this.distanceItineraire="";
    this.isDrew=false;
    this.previousWindow=null;
  }

  listTravelMode:string[]=['DRIVING', 'TRANSIT', 'WALKING']
  travelMode:string='DRIVING';
}
