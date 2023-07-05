import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { GlobalVariableService } from './../services/common/global-variable.service';
import { NodeSelectsService } from '../services/common/node-selects.service';
import { Subject, BehaviorSubject, map, mergeMap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as moment from "moment";

declare var jQuery: any;

@Component({
  selector: 'app-distribution-by-relation-type',
  templateUrl: './distribution-by-relation-type.component.html',
  styleUrls: ['./distribution-by-relation-type.component.scss'],
  providers: [DatePipe]
})
export class DistributionByRelationTypeComponent implements OnInit {
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
  distributionData: any = [];
  distributionDataDetails: any = [];
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
    this.getDistributionByRelationType(this.filterParams);

    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      console.log("eventData: ", data);
      if (data === undefined) { // data=undefined true when apply filter from side panel
        // this.hideCardBody = true;
        this.filterParams = this.globalVariableService.getFilterParams();
        this.getDistributionByRelationType(this.filterParams);
        console.log("new Filters for articles: ", this.filterParams);
      }
    });
  }

  getDistributionByRelationType(_filterParams: any) {
    if (_filterParams.source_node != undefined) {
      this.loadingDesc = true;
      console.log("filterparams: ", _filterParams);
      this.nodeSelectsService.getDistributionRelationType(_filterParams).subscribe(
        data => {
          console.log("data: ", data);
          this.resultNodes = data;
          this.distributionData = this.resultNodes.distributionData;
          console.log("distributionData: ", this.distributionData);
          this.distributionDataDetails = [];

          this.distributionData.forEach((event: any) => {
            var temps: any = {};

            // temps["news_id"] = event.news_id;
            temps["source_node_name"] = event.source_node_name;
            temps["destination_node_name"] = event.destination_node_name;
            temps["pmid_count"] = event.count;
            temps["temp_edge_types_name"] = event.temp_edge_types_name;
            this.distributionDataDetails.push(temps);
          });

          jQuery('#showDistributionRelationData').bootstrapTable({
            bProcessing: true,
            bServerSide: true,
            pagination: true,
            // showRefresh: true,
            // showToggle: true,
            showColumns: true,
            // search: true,
            pageSize: 25,
            // pageList: [10, 25, 50, 100, All],
            striped: true,
            showFilter: true,
            filter: true,
            showExport: true,
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
            data: this.distributionDataDetails,
          });

          jQuery('#showDistributionRelationData').bootstrapTable("load", this.distributionDataDetails);

          jQuery('#showDistributionRelationData').on("search.bs.table", function (e: any) {
            jQuery('#showDistributionRelationData').bootstrapTable("load", e.distributionDataDetails);
          })
            .on("search.bs.table", function (e: any) {
              jQuery('#showDistributionRelationData').bootstrapTable("load", e.distributionDataDetails);
            })
            .on("page-change.bs.table", function (e: any) {
              jQuery('#showDistributionRelationData').bootstrapTable("load", e.distributionDataDetails);
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
  }

  getEdgeTypes(edgeTypeIdsPost: any) {
    return this.nodeSelectsService.getEdgeTypeName({ 'edge_type_ids': edgeTypeIdsPost }).pipe(map((p: any) => {
      this.result = p;
      return p;
    }));
  }

}
