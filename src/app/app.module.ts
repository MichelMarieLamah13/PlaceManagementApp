import { BrowserModule } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';
import { AgmCoreModule, GoogleMapsAPIWrapper, MarkerManager } from "@agm/core";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccordionModule } from '@syncfusion/ej2-angular-navigations';
import { HttpClientModule, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyServiceService } from './my-service.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularDraggableModule } from 'angular2-draggable';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { ResizableModule } from 'angular-resizable-element';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AgmDirectionModule } from 'agm-direction';


//@Injectable()
//export class HttpConfigInterceptor implements HttpInterceptor {
//  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//debugger;

//   const dupReq = req.clone({ headers: req.headers.set('Access-Control-Allow-Origin','https://my-json-server.typicode.com') });
//   return next.handle(dupReq);
// }

      // if (!request.headers.has('Content-Type')) {
      //     request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
      // }

      // request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
      //const dupReq  = request.clone({ headers: request.headers.set('Access-Control-Allow-Origin','http://backup.sendatrack.com:8080/events7/data.jsonx' ) });
     // return next.handle(dupReq);
      // return next.handle(request).pipe(
      //     map((event: HttpEvent<any>) => {
      //         if (event instanceof HttpResponse) {
      //             console.log('event--->>>', event);
      //         }
      //         return event;
      //     }));
///  }
//}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,AccordionModule,
    AppRoutingModule,
    ResizableModule,
    HttpClientModule,
    AngularDraggableModule,
    AgmJsMarkerClustererModule,
    NgbModule,
    FormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      //apiKey: 'AIzaSyCRvhg2ugM_rAjfM-_orPVvSPOrBLTCOI8'
      apiKey:'AIzaSyAv-gQfsVWULK4vu2THDXFXUmg9cc-MVz4',
      libraries: ['places']
    }) ,
    NgxEchartsModule,
    NgMultiSelectDropDownModule.forRoot(),
    AgmDirectionModule
  ],
  exports:[
    NgbModule
  ],
  providers: [MyServiceService , GoogleMapsAPIWrapper,
    MarkerManager
    //{ provide: HTTP_INTERCEPTORS , useClass: HttpConfigInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
