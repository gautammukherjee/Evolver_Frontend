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
  resultPMIDLists: any = [];
  resultNodes: any = [];
  resultPMID: any = [];
  pmidCount: any;

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
  masterListsDataLoaded: any = [];
  masterListsDataOnScroll: any = [];
  masterListsDataDetailsLoaded: any = [];
  masterListsDataDetailsExtra: any = [];
  masterListsDataDetailsCombined: any = [];
  edgeTypesLists: any = [];
  public edgeTypes: any = [];
  public edgeHere: any = [];
  public articleHere: any = [];
  articleList: any = [];
  public articleHerePMID: any = [];
  articlePMID: any = [];
  notEmptyPost: boolean = true;
  notscrolly: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  public isloading: boolean = false;
  loaderEvidence = false;

  constructor(
    private globalVariableService: GlobalVariableService,
    private nodeSelectsService: NodeSelectsService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters1: ", this.filterParams);
    this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });
    this.getEventDescription(this.filterParams);

    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      //console.log("eventData: ", data);
      this.notEmptyPost = true;
      if (data === undefined) { // data=undefined true when apply filter from side panel
        // this.hideCardBody = true;
        this.filterParams = this.globalVariableService.getFilterParams();
        this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });
        this.getEventDescription(this.filterParams);
        //console.log("new Filters for articles: ", this.filterParams);
      }
    });
  }

  getEventDescription(_filterParams: any) {
    //console.log("abc = "+_limit.load_value);
    this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });
    if (this.filterParams.source_node != undefined) {

      // $('.overlay').fadeOut(500);
      this.loadingDesc = true;

      //console.log("filterparams: ", _filterParams);
      this.nodeSelectsService.getMasterLists(this.filterParams).subscribe(
        data => {
          //console.log("data: ", data);
          this.resultNodes = data;
          this.masterListsData = this.resultNodes.masterListsData;
          console.log("Load data: ", this.masterListsData);
        },
        err => {
          console.log(err.message);
          // this.loadingDesc = false;
        },
        () => {
          // this.loadingDesc = false;
          this.masterListsDataDetailsLoaded = [];
          let j = 0;
          this.masterListsData.forEach((event: any) => {

            var temps: any = {};
            //Get the Edge Type Name
            const regex = /[{}]/g;
            const edgeTypeIds = event.edge_type_ids;
            const edgeTypeIdsPost = edgeTypeIds.replace(regex, '');
            //console.log("event: ", event);//use this variable, gautam

            const edgeTypeNeIds = event.ne_ids;
            const edgeTypeNeIdsPost = edgeTypeNeIds.replace(regex, '');

            // temps["news_id"] = event.news_id;
            temps["sourcenode_name"] = event.sourcenode_name;
            temps["destinationnode_name"] = event.destinationnode_name;
            temps["level"] = event.level;
            //temps["edgeTypes"] = "<button class='btn btn-sm btn-primary'>Edge Types</button> &nbsp;";

            //temps["edgeType_articleType"] = event.edge_type_article_type_ne_ids;
            temps["edgeTypesID"] = edgeTypeIdsPost;
            temps["edgeNeId"] = edgeTypeNeIdsPost;

            this.nodeSelectsService.getEdgePMIDCount({ 'edge_type_pmid': edgeTypeNeIdsPost }).subscribe((p: any) => {
              this.resultPMID = p;
              this.pmidCount = this.resultPMID.pmidCount[0]['pmid_count'];
              // console.log("pmidCount: ", this.resultPMID.pmidCount[0]);
              // temps["pmidCount"] = this.pmidCount;
              temps["edgeNeCount"] = "<button class='btn btn-sm btn-primary'>Articles <span class='badge bg-secondary bg-warning text-dark'>" + this.pmidCount + "</span></button> &nbsp;";
              // temps["edgeNe"] = "<button class='btn btn-sm btn-primary'>Edge Type Article </button> &nbsp;";
              this.masterListsDataDetailsLoaded.push(temps);
              this.masterListsDataDetailsCombined = this.masterListsDataDetailsLoaded;

              console.log(this.masterListsData.length, "=>", j + 1)
              if (this.masterListsData.length == j + 1) {
                this.loadingDesc = false;
                console.log("masterListsData Event Loaded: ", this.masterListsDataDetailsCombined);
                this.bootstrapTableChart();
              }
              j++;
            });

          });
        }
      );
    }
    // }
    // else {
    //   this.masterListsData = [];
    //   this.loadingDesc = false;
    // }
  }

  bootstrapTableChart() {
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
      data: this.masterListsDataDetailsCombined,
      onClickRow: (field: any, row: any, $element: any) => {
        //edge types
        // if ($element == "edgeNeCount") {
        //   this.loaderEdgeType = true;
        //   this.modalRef = this.modalService.open(this.edgeTypeDescModal_Detail, { size: 'lg', keyboard: false, backdrop: 'static' });
        //   this.showPMIDLists(field.edgeNeId, field.sourcenode_name, field.destinationnode_name);
        // }
        // if ($element == "edgeNe") {
        //   this.loaderArticle = true;
        //   this.modalRef = this.modalService.open(this.articleModal_Detail, { size: 'xl', keyboard: false, backdrop: 'static' });
        //   this.ArticlePopup(field.edgeNeId, field.sourcenode_name, field.destinationnode_name, field.edgeTypesID, this.getArticles);
        // }
        if ($element == "edgeNeCount") {
          this.loaderArticle = true;
          this.modalRef = this.modalService.open(this.articleModal_Detail, { size: 'xl', keyboard: false, backdrop: 'static' });
          this.ArticlePopup(field.edgeNeId, field.sourcenode_name, field.destinationnode_name, field.edgeTypesID);
        }
      },
    });
    jQuery('#showEventDescription').bootstrapTable("load", this.masterListsDataDetailsCombined);
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
        this.edgeHere += event.edge_type_name + "<br>";
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
  // ArticlePopup(edgeNeId: any, sourceNode: string, destinationNode: string, edgeTypesID: number, getArticles_callback: any) {
  //   this.getEdgeTypesInternally(edgeTypesID);
  //   //if(this.edgeHere!=""){
  //   getArticles_callback(edgeNeId, sourceNode, destinationNode, edgeTypesID, this);
  //   //}
  // }

  ArticlePopup(edgeNeId: any, sourceNode: string, destinationNode: string, edgeTypesID: number) {
    this.articleHere = [];
    const edgeNeIdArr = edgeNeId.split(",");
    //console.log(typeof edgeNeIdArr + edgeNeIdArr +edgeNeIdArr[0]);
    var pubmedBaseUrl = "https://www.ncbi.nlm.nih.gov/pubmed/";
    this.nodeSelectsService.getEdgeTypeSentencePMIDLists({ 'ne_ids': edgeNeIdArr }).subscribe((p: any) => {
      this.result = p;
      console.log(this.result);
      this.articleHere = this.result.pmidListsSentence;
      this.articleList = [];
      this.articleHere.forEach((event: any) => {
        var temps: any = {};
        temps["source"] = sourceNode;
        temps["destination"] = destinationNode;
        temps["pmid"] = "<a target='_blank' style='color: #BF63A2 !important;' href='" + pubmedBaseUrl + event.pmid + "'>" + event.pmid + "</a>";
        temps["publication_date"] = event.publication_date;
        temps["title"] = event.title;
        temps["edge_type"] = event.edge_type_name
        temps["ne_id"] = event.ne_id;
        temps["sentence_btn"] = "<button class='btn btn-sm btn-primary' value='" + event.ne_id + "'>Sentences</button>";
        this.articleList.push(temps);
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
        data: this.articleList,
        onClickCell: (field: any, value: any, row: any, $element: any) => {
          //console.log(field);//sentence_btn
          //console.log(value);//<button class='btn btn-sm btn-primary' value='8785438'>Sentences</button>
          //console.log(JSON.stringify(row));// ** entire row data
          //console.log($element);
          let sentences: any;
          let html: string;
          if (field == "sentence_btn") {
            this.loaderEvidence = true;
            console.log(row.ne_id);
            $("#evidence_data").show();
            $("#evidence_data").html("");
            this.nodeSelectsService.getEvidenceData({ 'ne_id': row.ne_id }).subscribe((p: any) => {
              sentences = p;
              console.log(JSON.stringify(sentences));
              if (sentences.evidence_data.length == 0) {
                $("#evidence_data").html("<div class='alert alert-danger'>No Evidence found in database!</div>");
              } else {
                html = "";
                let e1_color: string;
                let e2_color: string;
                let sentence_text1: string;
                let sentence_text2: string;
                let sentence_text3: string;
                let sentence_text4: string;
                let sentence_text5: string;

                for (let i = 0; i < sentences.evidence_data.length; i++) {

                  if (sentences.evidence_data[i].e1_type_name === "DISEASE_OR_SYMPTOM") {
                    e1_color = "#118ab2";
                  } else if (sentences.evidence_data[i].e1_type_name === "FUNCTIONAL_MOLECULE") {
                    e1_color = "#118ab2";
                  } else if (sentences.evidence_data[i].e1_type_name === "GENE_OR_GENE_PRODUCT") {
                    e1_color = "#118ab2";
                  } else if (sentences.evidence_data[i].e1_type_name === "ANATOMY") {
                    e1_color = "#118ab2";
                  } else if (sentences.evidence_data[i].e1_type_name === "MODEL") {
                    e1_color = "#118ab2";
                  } else {
                    e1_color = "#000";
                  }

                  if (sentences.evidence_data[i].e2_type_name === "DISEASE_OR_SYMPTOM") {
                    e2_color = "#118ab2";
                  } else if (sentences.evidence_data[i].e2_type_name === "FUNCTIONAL_MOLECULE") {
                    e2_color = "#118ab2";
                  } else if (sentences.evidence_data[i].e2_type_name === "GENE_OR_GENE_PRODUCT") {
                    e2_color = "#118ab2";
                  } else if (sentences.evidence_data[i].e2_type_name === "ANATOMY") {
                    e2_color = "#118ab2";
                  } else if (sentences.evidence_data[i].e2_type_name === "MODEL") {
                    e2_color = "#118ab2";
                  } else {
                    e2_color = "#000";
                  }

                  sentence_text1 = sentences.evidence_data[i].sentence;
                  sentence_text2 = sentence_text1.replace("<E1>", "<mark style='color:#A8E890'>");
                  sentence_text3 = sentence_text2.replace("</E1>", "</mark>");
                  sentence_text4 = sentence_text3.replace("<E2>", "<mark style='color:#FF8787'>");
                  sentence_text5 = sentence_text4.replace("</E2>", "</mark>");

                  //console.log(sentence_text5);


                  html = "<div class='card m-2'><div class='card-body'>";
                  html += "<div class='row m-2'>";
                  html += "<div class='col'><span style='color:" + e1_color + "'>" + sentences.evidence_data[i].gene_symbol_e1 + "</span>(" + sentences.evidence_data[i].e1_type_name + ")</div>";
                  html += "<div class='col'>" + sentences.evidence_data[i].edge_name + "</div>";
                  html += "<div class='col'><span style='color:" + e1_color + "'>" + sentences.evidence_data[i].gene_symbol_e2 + "</span>(" + sentences.evidence_data[i].e2_type_name + ")</div>";
                  html += "<div class='col'> Pmid:" + sentences.evidence_data[i].pubmed_id + "</div>";
                  html += "</div>";
                  html += "<div>";
                  html += "<div class='col'><p class='m-4'>" + sentence_text5 + "</p></div>";
                  html += "</div>";
                  html += "</div></div>";

                  $("#evidence_data").append(html);

                  console.log(JSON.stringify(sentences));

                  this.loaderEvidence = false;
                };//for
              this.loaderEvidence = false;
              }
            });
          }
        }
      });
      this.loaderArticle = false;
    });

  }

  showPMIDLists(edgeNeId: any, sourceNode: string, destinationNode: string) {
    const edgeNeIdArr = edgeNeId.split(",");
    //console.log(typeof edgeNeIdArr + edgeNeIdArr +edgeNeIdArr[0]);
    var pubmedBaseUrl = "https://www.ncbi.nlm.nih.gov/pubmed/";
    this.nodeSelectsService.getEdgePMIDLists({ 'ne_ids': edgeNeIdArr }).subscribe((pmid: any) => {
      this.loaderEdgeType = false;
      this.resultPMIDLists = pmid;
      console.log(this.resultPMIDLists);
      this.articleHerePMID = this.resultPMIDLists.pmidLists;
      this.articlePMID = [];
      this.articleHerePMID.forEach((event: any) => {
        var temps: any = {};
        temps["source"] = sourceNode;
        temps["destination"] = destinationNode;
        temps["pmid"] = "<a target='_blank' style='color: #BF63A2 !important;' href='" + pubmedBaseUrl + event.pmid + "'>" + event.pmid + "</a>";
        temps["publication_date"] = event.publication_date;
        temps["title"] = event.title;
        this.articlePMID.push(temps);
      });
      jQuery('#articles_details_pmid').bootstrapTable({
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
        data: this.articlePMID
      });
    });
  }


  onDescScroll() {
    console.log('onScroll Here');
    if (!this.isloading && !this.loadingDesc) {
      if (this.notscrolly && this.notEmptyPost && this.filterParams['tabType'] == "details") {
        console.log('onScroll Here inside');
        // this.spinner.show();
        this.notscrolly = false;
        this.currentPage++;
        this.loadNextDataSet();
      }
    } else {
      console.log('onScroll Here2', this.isloading);
    }
  }

  loadNextDataSet() {

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;

    this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": startIndex, "limitValue": this.itemsPerPage });
    this.notscrolly = true;
    // this.getEventDescription(this.filterParams);

    if (this.filterParams.source_node != undefined) {
      // this.loadingDesc = true;
      this.isloading = true;

      this.nodeSelectsService.getMasterLists(this.filterParams).subscribe(
        data => {
          //console.log("data: ", data);
          this.resultNodes = data;
          if (this.resultNodes.masterListsData.length === 0) {
            this.notEmptyPost = false;
            this.isloading = false;
          }

          this.masterListsData = this.resultNodes.masterListsData;
          console.log("infinite data: ", this.masterListsData);

        },
        err => {
          console.log(err.message);
          // this.loadingDesc = false;
        },
        () => {
          // this.loadingDesc = false;
          this.masterListsDataDetailsExtra = [];
          let k = 0;
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

            // temps["news_id"] = event.news_id;
            temps["sourcenode_name"] = event.sourcenode_name;
            temps["destinationnode_name"] = event.destinationnode_name;
            temps["level"] = event.level;
            //temps["edgeTypes"] = "<button class='btn btn-sm btn-primary'>Edge Types</button> &nbsp;";
            //temps["edgeType_articleType"] = event.edge_type_article_type_ne_ids;
            temps["edgeTypesID"] = edgeTypeIdsPost;
            temps["edgeNeId"] = edgeTypeNeIdsPost;

            // Start For distinct pmid count here
            this.nodeSelectsService.getEdgePMIDCount({ 'edge_type_pmid': edgeTypeNeIdsPost }).subscribe((p: any) => {
              this.resultPMID = p;
              this.pmidCount = this.resultPMID.pmidCount[0]['pmid_count'];
              // console.log("pmidCount Inside: ", this.resultPMID.pmidCount[0]);

              // temps["pmidCount"] = this.pmidCount;
              temps["edgeNeCount"] = "<button class='btn btn-sm btn-primary'>Articles <span class='badge bg-secondary bg-warning text-dark'>" + this.pmidCount + "</span></button> &nbsp;";
              // temps["edgeNe"] = "<button class='btn btn-sm btn-primary'>Edge Type Article </button> &nbsp;";

              // temps["edgeNe"] = "<button class='btn btn-sm btn-primary'>Articles <span class='badge bg-secondary bg-warning text-dark'>" + this.pmidCount + "</span></button> &nbsp;";
              this.masterListsDataDetailsExtra.push(temps);

              console.log(this.masterListsData.length, "=>", k + 1)
              if (this.masterListsData.length == k + 1) {
                this.loadingDesc = false;
                this.isloading = false;
                console.log("new data Added: ", this.masterListsDataDetailsExtra);

                this.masterListsDataDetailsCombined = this.masterListsDataDetailsCombined.concat(this.masterListsDataDetailsExtra);
                console.log("Total Add: ", this.masterListsDataDetailsCombined);
                this.notscrolly = true;
                this.bootstrapTableChart();
              }
              k++;
            }
            );
            // End here for pmid distinct count
          });
        }
      );
    }

  }

  // loadNextDataSetOLD(event: any) {
  //   //console.log(event.target.value);
  //   this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": event.target.value, "limitValue": 8000 });
  //   this.getEventDescription(this.filterParams);
  // }


}
