import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer, Inject } from '@angular/core';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DiseaseGeneNetworkmapService } from 'src/app/services/neuroscience/disease-gene-networkmap.service';

import * as $ from "jquery";

declare var jQuery: any;

@Component({
  selector: 'app-network-map',
  templateUrl: './network-map.component.html',
  // styles: [
  //   `ng2-cytoscape {
  //       height: 100vh;
  //       float: left;
  //       width: 100%;
  //       position: relative;
  //   }`,
  //   '.modal-header {border-bottom-color: #EEEEEE;background-color: #32404E;color: #fff;}'
  // ],
  styleUrls: ['./network-map.component.scss']
})
export class NetworkMapComponent implements OnInit {

  @Input() ProceedDoFilterApply: Subject<any>; //# Input for ProceedDoFilter is getting from clinical details html 

  private filterParams;
  phase: any = {};
  resultNodes: any = [];
  resultEdges: any = [];
  loading = false;
  nodesCheck = false;
  public legendsNodeTypes = [];
  public nodeData: any = {};
  private groupedNodeType = [];
  public edgeData: any = {};
  diseaseGenesNodesData = [];
  diseaseGenesEdgesData = [];
  private modalRef: any;
  @ViewChild('showNode', { static: false }) show_nodes: ElementRef;
  @ViewChild('showEdge', { static: false }) show_edges: ElementRef;

  node_name: string;
  edge_name: string;
  mapTypes: string;
  layout: any = {};
  graphData: any = [];
  doFilterApply: Subject<any> = new Subject();  // ## P= Parent
  constructor(
    private globalVariableService: GlobalVariableService,
    private diseaseGeneNetworkmapService: DiseaseGeneNetworkmapService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) { }


  graphSelected() {
    //    this.doFilterApply.next({ clickOn: param });
    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("you here:: ", this.filterParams);
    this.getDiseaseGeneMap(this.filterParams);
  }

  ngOnInit() {
    this.filterParams = this.globalVariableService.getFilterParams();
    this.mapTypes = this.filterParams.mapType;
    // this.getDiseaseGeneMap(this.filterParams);

    this.ProceedDoFilterApply.subscribe(data => {  // Calling from details, details working as mediator
      if (data === undefined) { // data=undefined true when apply filter from side panel
        this.filterParams = this.globalVariableService.getFilterParams();
        this.getDiseaseGeneMap(this.filterParams);
        console.log("new Filters2: ", this.filterParams);
      }
      else if (data.clickOn == 'clickOnEventDetails') { // because graph should not change when click on this component itself
        this.filterParams = this.globalVariableService.getFilterParams(this.globalVariableService.getFilterParams());
        console.log("new Filters3: ", this.filterParams);
        this.getDiseaseGeneMap(this.filterParams);
      }

    });
  }

  ngOnDestroy() {
    // needed if child gets re-created (eg on some model changes)
    // note that subsequent subscriptions on the same subject will fail
    // so the parent has to re-create parentSubject on changes
    this.ProceedDoFilterApply.unsubscribe();
  }

  getDiseaseGeneMap(_filterParams) {

    this.loading = true;
    this.diseaseGeneNetworkmapService.getDiseaseGeneNetworkNodeData(_filterParams).subscribe(
      data => {
        this.nodeData = [];
        this.groupedNodeType = [];
        this.legendsNodeTypes = [];

        this.resultNodes = data;
        this.diseaseGenesNodesData = this.resultNodes.nameNodes;
        console.log("diseaseGenesNodesData: ", this.diseaseGenesNodesData);
        this.diseaseGenesNodesData.forEach(event => {
          this.nodeData.push({
            data: { id: Math.floor(event.node_id), name: event.node, node_type: event.nodetype, weight: 100, colorCode: event.colourcode, shapeType: 'octagon' },
          });
          this.legendsNodeTypes.push({ node_name: event.nodetype, color_code: event.colourcode });
        });
        console.log("nodeData: ", this.nodeData);
        // console.log("legendsNodeTypes:: ", this.legendsNodeTypes);

        const x = this.legendsNodeTypes.reduce(
          (accumulator, current) => accumulator.some(x => x.node_name === current.node_name) ? accumulator : [...accumulator, current], []
        )
        this.legendsNodeTypes = x;
        console.log("legendsNodeTypes: ", this.legendsNodeTypes);
        // this.drawChart();
      },
      err => {
        console.log(err.message);
      },
      () => {
        this.loading = true;

        this.diseaseGeneNetworkmapService.getDiseaseGeneNetworkEdgeData(_filterParams).subscribe(
          data => {
            this.edgeData = [];
            this.resultEdges = data;
            this.diseaseGenesEdgesData = this.resultEdges.nameEdges;
            console.log("diseaseGenesEdgesData: ", this.diseaseGenesEdgesData);
            this.diseaseGenesEdgesData.forEach(event => {
              this.edgeData.push({
                data: { source: Math.floor(event.source_id), target: Math.floor(event.target_id), PMID: event.pmidlist, colorCode: "pink", strength: Math.floor(event.edge_weight) },
              });
            });
            console.log("edgeData: ", this.edgeData);

            var checkNodes = Array.from(this.globalVariableService.getSelectedNodes()); //check the node id exist then show the graph
            console.log("checkNodes: ", checkNodes);
            if (checkNodes.length > 0) {
              this.nodesCheck = true;
              this.drawChart();
            } else {
              this.nodesCheck = false;
            }

          },
          err => {
            console.log(err.message);
          },
          () => {
            this.loading = false;
          }
        );

      }
    );
  }

  private drawChart() {
    this.layout = {
      name: 'concentric',
    };

    this.graphData = {
      nodes:
        this.nodeData,
      edges:
        this.edgeData
    };
    console.log("graphdatas22: ", this.graphData);
  }

  // nodeChange(event) {
  //   this.node_name = event;
  //   console.log("checked here!!", this.node_name);

  //   // this.showNodeInfo(event);

  //   // var node_name = event.target;
  //   // console.log("node_name: ", this.node_name);
  //   this.modalRef = this.modalService.open(this.show_nodes, { size: 'lg', keyboard: false, backdrop: 'static' });
  // }

  edgeChange(event) {
    this.edge_name = event;

    this.modalRef = this.modalService.open(this.show_edges, { size: 'lg', keyboard: false, backdrop: 'static' });

    // var pubmedEdgeDetails;
    // pubmedEdgeDetails = "<div style='float:left;'>";
    // pubmedEdgeDetails += '<div style="color: #00ffff;"><strong>SUID</strong></div>';
    // pubmedEdgeDetails += '<div style="padding-bottom:10px;">Name</div>';
    // pubmedEdgeDetails += "</div>";
    // $("#pubmedURLs").html(pubmedEdgeDetails);
    // $('#myModalEdge').modal('show');

  }

  clickedEdges(elem) { //when you select the indication from dropdown menu
    let edge_select = parseInt(elem.target.value);
    this.globalVariableService.setSelectedEdges(edge_select);
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("heres:: ", this.filterParams);
    if (this.filterParams.node_id != undefined)
      this.getDiseaseGeneMap(this.filterParams);
  }

  searchConnections22 = function () {

    console.log("aaaa");
    alert("bbbbb");
    // Declare variables
    // var input, filter, ul, li, a, i, txtValue;
    // input = document.getElementById('searchInput');
    // filter = input.value.toUpperCase();
    // ul = document.getElementById("myUL");
    // li = ul.getElementsByTagName('li');

    // // Loop through all list items, and hide those who don't match the search query
    // for (i = 0; i < li.length; i++) {
    //   a = li[i].getElementsByTagName("a")[0];
    //   txtValue = a.textContent || a.innerText;
    //   if (txtValue.toUpperCase().indexOf(filter) > -1) {
    //     li[i].style.display = "";
    //   } else {
    //     li[i].style.display = "none";
    //   }
    // }
  }


}
