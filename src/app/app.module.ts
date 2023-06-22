import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ManagePasswordComponent } from './manage-password/manage-password.component';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NetworkMapComponent } from './network-map/network-map.component';
import { NgCytoComponent } from './ng-cyto/ng-cyto.component';
import { EventDescriptionComponent } from './event-description/event-description.component';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FilterDataRangeComponent } from './filters/filter-data-range/filter-data-range.component';
import { NodeDataPipe } from './pipes/nodeDataPipe';
import { SourceNodePipe } from './pipes/sourceNodePipe';
import { DestinationNodePipe } from './pipes/destinationNodePipe';
import { EdgeTypePipe } from './pipes/edgeTypePipe';
import { FilterNodeSelectComponent } from './filters/filter-node-select/filter-node-select.component';
import { NoPageComponent } from './no-page/no-page.component';
import { FilterSourceNodeComponent } from './filters/filter-source-node/filter-source-node.component';
import { FilterDestinationNodeComponent } from './filters/filter-destination-node/filter-destination-node.component';
import { FilterEdgeTypeComponent } from './filters/filter-edge-type/filter-edge-type.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    ManagePasswordComponent,
    IndexComponent,
    DashboardComponent,
    NetworkMapComponent,
    NgCytoComponent,
    EventDescriptionComponent,
    FilterNodeSelectComponent,
    FilterSourceNodeComponent,
    FilterDestinationNodeComponent,
    FilterEdgeTypeComponent,
    HeaderComponent,
    FooterComponent,
    FilterDataRangeComponent,
    NoPageComponent,
    NodeDataPipe,
    SourceNodePipe,
    DestinationNodePipe,
    EdgeTypePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    FilterDataRangeComponent,
    FilterNodeSelectComponent,
    FilterSourceNodeComponent,
    FilterDestinationNodeComponent,
    FilterEdgeTypeComponent,
    NoPageComponent,
    NodeDataPipe,
    SourceNodePipe,
    DestinationNodePipe,
    EdgeTypePipe
  ],
  schemas: [],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
