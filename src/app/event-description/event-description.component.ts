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
  @Input() currentLevel: any;
  @Input() toggleLevels: any;
  private filterParams: any;
  result: any = [];
  resultNodes: any = [];

  loadingDesc = false;
  params: any;
  layout: any = {};
  graphData: any = [];
  // diseaseCheck: any;
  // hideCardBody: boolean = true;
  private modalRef: any;

  loaderEdgeType = false;
  private edgeTypeDescModal: any;
  @ViewChild('edgeTypeDescModal', { static: false }) edgeTypeDescModal_Detail: ElementRef | any;


  loaderArticle = false;
  private articleModal: any;
  @ViewChild('articleModal', { static: false }) articleModal_Detail: ElementRef | any;

  edgeTypeList: any = [];
  helpContents: any;
  masterListsData: any = [];
  masterListsDataDetails: any = [];
  edgeTypesLists: any = [];
  public edgeTypes: any = [];
  public edgeHere: any = [];
  public articleHere: any = [];
  articleList: any = [];

  constructor(
    private globalVariableService: GlobalVariableService,
    private nodeSelectsService: NodeSelectsService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters1: ", this.filterParams);
    this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": 2000});
    this.getEventDescription(this.filterParams);

    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      //console.log("eventData: ", data);
      if (data === undefined) { // data=undefined true when apply filter from side panel
        // this.hideCardBody = true;
        this.filterParams = this.globalVariableService.getFilterParams();
        this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": 2000});
        this.getEventDescription(this.filterParams);
        //console.log("new Filters for articles: ", this.filterParams);
      }
    });
  }

  getEventDescription(_filterParams: any) {
    //console.log("abc = "+_limit.load_value);
    if (_filterParams.source_node != undefined) {

      // $('.overlay').fadeOut(500);
      this.loadingDesc = true;

      // this.diseaseCheck = _filterParams['di_ids']; // if disease_id is checked
      // console.log("checked here Disease in event description: ", this.diseaseCheck);
      // if (this.diseaseCheck !== undefined) {
      //console.log("filterparams: ", _filterParams);
      this.nodeSelectsService.getMasterLists(_filterParams).subscribe(
        data => {
          //console.log("data: ", data);
          this.resultNodes = data;
          this.masterListsData = this.resultNodes.masterListsData;
          //console.log("masterListsDataLength: ", this.masterListsData.length);
          this.masterListsDataDetails = [];

          this.masterListsData.forEach((event: any) => {
            var temps: any = {};

            //Get the Edge Type Name
            const regex = /[{}]/g;
            const edgeTypeIds = event.edge_type_ids;
            const edgeTypeIdsPost = edgeTypeIds.replace(regex, '');
            //console.log("event: ", event);//use this variable, gautam

            const edgeTypeNeIds = event.ne_ids;
            const edgeTypeNeIdsPost = edgeTypeNeIds.replace(regex, '');
            //console.log(edgeTypeNeIdsPost);

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
            //temps["edgeTypes"] = "<button class='btn btn-sm btn-primary'>Edge Types</button> &nbsp;";
            temps["edgeNe"] = "<button class='btn btn-sm btn-primary'>Articles</button> &nbsp;";
            //temps["edgeType_articleType"] = event.edge_type_article_type_ne_ids;
            temps["edgeTypesID"] = edgeTypeIdsPost;
            temps["edgeNeId"] = edgeTypeNeIdsPost;
            this.masterListsDataDetails.push(temps);
            // console.log("masterListsData Event: ", this.masterListsDataDetails);
          },
          );

          jQuery('#showEventDescription').bootstrapTable({
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
            // exportOptions: {
            //   ignoreColumn: [5],
            //   // columns: [6],
            //   // visible: [6,'true'],
            // },
            // columns: [
            //   {
            //     dataField: 'active_ingredients',
            //     text: 'Active Ingredients',
            //     headerStyle: { 'white-space': 'nowrap' }
            //   }],
            // columns: [
            //   // {
            //   //   title: 'Title',
            //   //   field: 'title',
            //   //   class: 'text-left',
            //   // },
            //   // {
            //   //   title: 'Active Ingredients/Brand',
            //   //   field: 'active_ingredient',
            //   //   class: 'text-left',
            //   // }
            // ],
            data: this.masterListsDataDetails,
            onClickRow: (field: any, row: any, $element: any) => {
              //edge types
              /*if ($element == "edgeTypes") {
                this.loaderEdgeType = true;
                this.modalRef = this.modalService.open(this.edgeTypeDescModal_Detail, { size: 'lg', keyboard: false, backdrop: 'static' });
                this.getEdgeTypes(field.edgeTypesID);
              }*/
              if ($element == "edgeNe") {
                this.loaderArticle = true;
                this.modalRef = this.modalService.open(this.articleModal_Detail, { size: 'xl', keyboard: false, backdrop: 'static' });
                this.ArticlePopup(field.edgeNeId, field.sourcenode_name, field.destinationnode_name, field.edgeTypesID, this.getArticles);
              }
            },
          });
          jQuery('#showEventDescription').bootstrapTable("load", this.masterListsDataDetails);
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


  //Currently getEdgeTypes() not in use.
  /*getEdgeTypes(edgeTypeIdsPost: any) {
    this.edgeHere = "";
    this.nodeSelectsService.getEdgeTypeName({ 'edge_type_ids': edgeTypeIdsPost }).subscribe((p: any) => {
      this.result = p;
      this.edgeHere = this.result;
      this.loaderEdgeType = false;
    });
  }*/

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  Commented by Gautam Mukherjee
  getEdgeTypesInternally() is executing to get edge-types in Article Popup. 
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  getEdgeTypesInternally(edgeTypeIdsPost: any) {
    this.edgeHere = "";
    this.nodeSelectsService.getEdgeTypeName({ 'edge_type_ids': edgeTypeIdsPost }).subscribe((p: any) => {
      this.edgeHere = "";
      this.result = p;
      this.result.forEach((event: any) => {
        this.edgeHere += event.edge_type_name+"<br>";
      });
    });
  }
  // reloadDescription() {
  //   console.log("Event description: ")
  //   // this.globalVariableService.resetChartFilter();
  //   this.hideCardBody = !this.hideCardBody;
  //   this.filterParams = this.globalVariableService.getFilterParams();
  //   if (!this.hideCardBody)
  //     this.getEventDescription(this.filterParams);

  // }


  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  Commented by Gautam Mukherjee
  ArticlePopup() is the main function and getArticles() is the callback function. 
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  ArticlePopup(edgeNeId: any, sourceNode: string, destinationNode: string, edgeTypesID: number, getArticles_callback: any) {
    this.getEdgeTypesInternally(edgeTypesID);
    //if(this.edgeHere!=""){
    getArticles_callback(edgeNeId, sourceNode, destinationNode, edgeTypesID, this);
    //}
  }

  getArticles(edgeNeId: any, sourceNode: string, destinationNode: string, edgeTypesID: number, t: any) {
    t.articleHere = [];
    const edgeNeIdArr = edgeNeId.split(",");
    //console.log(typeof edgeNeIdArr + edgeNeIdArr +edgeNeIdArr[0]);
    var pubmedBaseUrl = "https://www.ncbi.nlm.nih.gov/pubmed/";
    t.nodeSelectsService.getEdgePMIDLists({ 'ne_ids': edgeNeIdArr }).subscribe((p: any) => {
      t.result = p;
      //console.log(this.result);
      t.articleHere = t.result.pmidLists;
      t.articleList = [];
      t.articleHere.forEach((event: any) => {
        var temps: any = {};
        temps["source"] = sourceNode;
        temps["destination"] = destinationNode;
        temps["pmid"] = "<a target='_blank' style='color: #BF63A2 !important;' href='" + pubmedBaseUrl + event.pmid + "'>" + event.pmid + "</a>";
        temps["publication_date"] = event.publication_date;
        temps["title"] = event.title;
        temps["edge_type"] = t.edgeHere;
        t.articleList.push(temps);
      });
      jQuery('#articles_details').bootstrapTable({
        bProcessing: true,
        bServerSide: true,
        pagination: true,
        showToggle: true,
        showColumns: true,
        search: true,
        pageSize: 25,
        striped: true,
        showFullscreen: true,
        stickyHeader: true,
        showExport: true,
        data: t.articleList
      });

      t.loaderArticle = false;
    });



  }

  loadNextDataSet(event:any){
    //console.log(event.target.value);
    this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": event.target.value, "limitValue": 2000});
    this.getEventDescription(this.filterParams);
  }

}
