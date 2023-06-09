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
import { FilterNodeSelectLevel2Component } from './filters/filter-node-select-level2/filter-node-select-level2.component';
import { NoPageComponent } from './no-page/no-page.component';
import { FilterSourceNodeComponent } from './filters/filter-source-node/filter-source-node.component';
import { FilterDestinationNodeComponent } from './filters/filter-destination-node/filter-destination-node.component';
import { FilterEdgeTypeComponent } from './filters/filter-edge-type/filter-edge-type.component';
//import { SafePipeModule } from 'safe-pipe';
import { SafePipe } from './pipes/safe.pipe';
import { BioInfomaticsComponent } from './bio-infomatics/bio-infomatics.component';

import { FilterEdgeTypeLevel2Component } from './filters/filter-edge-type-level2/filter-edge-type-level2.component';
import { EventChartComponent } from './event-chart/event-chart.component';


import { HighchartsChartModule } from 'highcharts-angular';
import { DistributionByRelGrpComponent } from './distribution-by-rel-grp/distribution-by-rel-grp.component';
import { DetailsOfAssocDataComponent } from './details-of-assoc-data/details-of-assoc-data.component';
import { PmidCountWithGeneAndDiseaseComponent } from './pmid-count-with-gene-and-disease/pmid-count-with-gene-and-disease.component';
//import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { DistributionByRelationTypeComponent } from './distribution-by-relation-type/distribution-by-relation-type.component';





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
    FilterNodeSelectLevel2Component,
    FilterSourceNodeComponent,
    FilterDestinationNodeComponent,
    FilterEdgeTypeComponent,
    FilterEdgeTypeLevel2Component,
    HeaderComponent,
    FooterComponent,
    FilterDataRangeComponent,
    NoPageComponent,
    NodeDataPipe,
    SourceNodePipe,
    DestinationNodePipe,
    EdgeTypePipe,
    SafePipe,
    BioInfomaticsComponent,
    EventChartComponent,
    DistributionByRelGrpComponent,
    DetailsOfAssocDataComponent,
    PmidCountWithGeneAndDiseaseComponent,
    DistributionByRelationTypeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    //SafePipeModule 
    HighchartsChartModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    FilterDataRangeComponent,
    FilterNodeSelectComponent,
    FilterNodeSelectLevel2Component,
    FilterSourceNodeComponent,
    FilterDestinationNodeComponent,
    FilterEdgeTypeComponent,
    FilterEdgeTypeLevel2Component,
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
      provide: [HTTP_INTERCEPTORS],
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
