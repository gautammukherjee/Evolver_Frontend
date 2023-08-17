import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject, map, mergeMap } from 'rxjs';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var jQuery: any;

@Component({
  selector: 'app-ct_disease_assoc',
  templateUrl: './ct_disease_assoc.component.html',
  styleUrls: ['./ct_disease_assoc.component.scss'],
  providers: [DatePipe]
})
export class CTDiseaseAssocComponent implements OnInit {

  @Input() ProceedDoFilterApply?: Subject<any>; //# Input for ProceedDoFilter is getting from clinical details html
  @Input() currentLevel: any;
  @Input() toggleLevels: any;
  private filterParams: any;
  result: any = [];

  loader: boolean = false;
  CTData: any = [];
  hideCardBody: boolean = true;
  loadingDesc = false;
  params: any;
  layout: any = {};
  notEmptyPost: boolean = true;
  notscrolly: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 2;
  public isloading: boolean = false;
  diseaseAssocData: any = [];
  diseaseAssocDetailsData: any = [];

  constructor(
    private globalVariableService: GlobalVariableService,
    private nodeSelectsService: NodeSelectsService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.getCTDataAssocWithDisease();

    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      //console.log("eventData: ", data);      
      if (data === undefined) { // data=undefined true when apply filter from side panel
        // this.hideCardBody = true;
        this.getCTDataAssocWithDisease();
      }
    });
  }


  getCTDataAssocWithDisease() {

    this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });
    if (this.filterParams.source_node != undefined) {

      // $('.overlay').fadeOut(500);
      this.loadingDesc = true;

      //console.log("filterparams: ", _filterParams);
      this.nodeSelectsService.getMasterLists(this.filterParams).subscribe(
        data => {
          //console.log("data: ", data);
          this.result = data;
          this.diseaseAssocData = this.result.masterListsData;
          console.log("Load data: ", this.diseaseAssocData);

          // this.loadingDesc = false;
          this.diseaseAssocDetailsData = [];
          let j = 0;
          this.diseaseAssocData.forEach((event: any) => {
            var temps: any = {};

            // temps["news_id"] = event.news_id;
            temps["sourcenode_name"] = event.sourcenode_name;
            temps["destinationnode_name"] = event.destinationnode_name;
            temps["level"] = event.level;
            temps["edgeTypesID"] = event.edgeTypeIdsPost;
            temps["edgeNeId"] = event.edgeTypeNeIdsPost;
            temps["pmidCount"] = event.pmidCount;
            this.diseaseAssocDetailsData.push(temps);
            this.bootstrapTableChart();
          });
        },
        err => {
          console.log(err.message);
          // this.loadingDesc = false;
        },
        () => {
          // this.loadingDesc = false;
        }
      );
    }

  }

  bootstrapTableChart() {
    jQuery('#CT_data').bootstrapTable({
      bProcessing: true,
      bServerSide: true,
      pagination: true,
      // showRefresh: true,
      showToggle: true,
      showColumns: true,
      search: true,
      pageSize: 25,
      // pageList: [10, 25, 50, 100, All],
      striped: true,
      //showFilter: true,
      // filter: true,
      showFullscreen: true,
      stickyHeader: true,
      showExport: true,
      data: this.diseaseAssocDetailsData,
      onClickRow: (field: any, row: any, $element: any) => {

      },
    });
    jQuery('#CT_data').bootstrapTable("load", this.diseaseAssocDetailsData);
  }


  reloadCTData() {
    console.log("ct data: ")
    // this.globalVariableService.resetChartFilter();

    this.hideCardBody = !this.hideCardBody;
    this.filterParams = this.globalVariableService.getFilterParams();
    if (!this.hideCardBody)
      this.getCTDataAssocWithDisease();
  }

}
