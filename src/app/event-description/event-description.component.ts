import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { GlobalVariableService } from './../services/common/global-variable.service';
import { NodeSelectsService } from '../services/common/node-selects.service';
import { Subject, BehaviorSubject, map, mergeMap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as moment from "moment";

declare var jQuery: any;

@Component({
  selector: 'app-event-description',
  templateUrl: './event-description.component.html',
  styleUrls: ['./event-description.component.scss'],
  providers: [DatePipe]
})
export class EventDescriptionComponent implements OnInit {
  @Input() ProceedDoFilterApply?: Subject<any>; //# Input for ProceedDoFilter is getting from clinical details html
  private filterParams: any;
  result: any = [];
  resultNodes: any = [];

  loadingDesc = false;
  params: any;
  layout: any = {};
  graphData: any = [];
  // diseaseCheck: any;
  // hideCardBody: boolean = true;
  modalRef: any;
  helpContents: any;
  masterListsData: any = [];
  masterListsDataDetails: any = [];
  edgeTypesLists: any = [];
  public edgeTypes: any = [];
  public edgeHere: any = [];

  constructor(
    private globalVariableService: GlobalVariableService,
    private nodeSelectsService: NodeSelectsService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters1: ", this.filterParams);
    this.getEventDescription(this.filterParams);

    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      console.log("eventData: ", data);
      if (data === undefined) { // data=undefined true when apply filter from side panel
        // this.hideCardBody = true;
        this.filterParams = this.globalVariableService.getFilterParams();
        this.getEventDescription(this.filterParams);
        console.log("new Filters for articles: ", this.filterParams);
      }
    });
  }

  getEventDescription(_filterParams: any) {
    if (_filterParams.source_node != undefined) {

      // $('.overlay').fadeOut(500);
      this.loadingDesc = true;

      // this.diseaseCheck = _filterParams['di_ids']; // if disease_id is checked
      // console.log("checked here Disease in event description: ", this.diseaseCheck);
      // if (this.diseaseCheck !== undefined) {
      console.log("filterparams: ", _filterParams);
      this.nodeSelectsService.getMasterLists(_filterParams).subscribe(
        data => {
          console.log("data: ", data);
          this.resultNodes = data;
          this.masterListsData = this.resultNodes.masterListsData;
          console.log("masterListsDataLength: ", this.masterListsData.length);
          this.masterListsDataDetails = [];

          this.masterListsData.forEach((event: any) => {
            var temps: any = {};

            //Get the Edge Type Name
            const regex = /[{}]/g;
            const edgeTypeIds = event.edge_type_ids;
            const edgeTypeIdsPost = edgeTypeIds.replace(regex, '');
            // console.log("edgeTypeIdsPost: ", edgeTypeIdsPost);

            // var edgeHere = this.getEdgeTypes(edgeTypeIdsPost);
            // console.log("edgeHere: ", edgeHere);
            // this.nodeSelectsService.getEdgeTypeName({ 'edge_type_ids': edgeTypeIdsPost }).subscribe((s: any) => {
            //   this.result = s;
            //   this.edgeHere = this.result;
            //   this.edgeTypesLists = [];
            //   this.edgeHere.forEach((event: any) => {
            //     this.edgeTypesLists.push(event.edge_type_name);
            //   });
            //   console.log("edgeHere: ", this.edgeTypesLists);
            // });

            // temps["news_id"] = event.news_id;
            temps["sourcenode_name"] = event.sourcenode_name;
            temps["destinationnode_name"] = event.destinationnode_name;
            temps["level"] = event.level;
            // temps["edgeTypes"] = this.edgeTypesLists;
            this.masterListsDataDetails.push(temps);
            // console.log("masterListsData Event: ", this.masterListsDataDetails);
          },
          );

          jQuery('#showEventDescription').bootstrapTable({
            bProcessing: true,
            bServerSide: true,
            pagination: true,
            // showRefresh: true,
            // showToggle: true,
            // showColumns: true,
            // search: true,
            pageSize: 25,
            // pageList: [10, 25, 50, 100, All],
            striped: true,
            showFilter: true,
            filter: true,
            // showExport: true,
            exportOptions: {
              ignoreColumn: [5],
              // columns: [6],
              // visible: [6,'true'],
            },
            // columns: [
            //   {
            //     dataField: 'active_ingredients',
            //     text: 'Active Ingredients',
            //     headerStyle: { 'white-space': 'nowrap' }
            //   }],
            columns: [
              // {
              //   title: 'Title',
              //   field: 'title',
              //   class: 'text-left',
              // },
              // {
              //   title: 'Active Ingredients/Brand',
              //   field: 'active_ingredient',
              //   class: 'text-left',
              // }
            ],
            data: this.masterListsDataDetails,
          });

          jQuery('#showEventDescription').bootstrapTable("load", this.masterListsDataDetails);

          jQuery('#showEventDescription').on("search.bs.table", function (e: any) {
            jQuery('#showEventDescription').bootstrapTable("load", e.masterListsDataDetails);
          })
            .on("search.bs.table", function (e: any) {
              jQuery('#showEventDescription').bootstrapTable("load", e.masterListsDataDetails);
            })
            .on("page-change.bs.table", function (e: any) {
              jQuery('#showEventDescription').bootstrapTable("load", e.masterListsDataDetails);
            });

        },
        err => {
          console.log(err.message);
          this.loadingDesc = false;
        },
        () => {
          this.loadingDesc = false;
        }
      );
    }
    // }
    // else {
    //   this.masterListsData = [];
    //   this.loadingDesc = false;
    // }
  }

  // getEdgeTypes2(edgeTypeIdsPost: any) {
  //   return this.getEdgeTypes(edgeTypeIdsPost).subscribe(s => {
  //     this.result = s;
  //   })
  // }

  // getEdgeTypes(edgeTypeIdsPost: any) {
  //   return this.nodeSelectsService.getEdgeTypeName({ 'edge_type_ids': edgeTypeIdsPost }).subscribe((p: any) => {
  //     this.result = p;
  //     this.edgeHere = this.result.edgeTypeName;
  //     this.edgeTypesLists = [];
  //     this.edgeHere.forEach((event: any) => {
  //       this.edgeTypesLists.push(event.edge_type_name);
  //     });
  //     // console.log("edgeHere: ", this.edgeTypesLists);
  //     return this.edgeTypesLists;
  //   });
  // }

  // reloadDescription() {
  //   console.log("Event description: ")
  //   // this.globalVariableService.resetChartFilter();
  //   this.hideCardBody = !this.hideCardBody;
  //   this.filterParams = this.globalVariableService.getFilterParams();
  //   if (!this.hideCardBody)
  //     this.getEventDescription(this.filterParams);

  // }

}
