import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NodeSelectsService } from '../services/common/node-selects.service';

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

  // @Output() onGraphSelection: EventEmitter<any> = new EventEmitter();
  @Input() ProceedDoFilterApply?: Subject<any>; //# Input for ProceedDoFilter is getting from clinical details html 

  private filterParams: any;
  phase: any = {};
  resultNodes: any = [];
  resultEdges: any = [];
  loadingMap = false;
  nodesCheckLength = true;
  public legendsNodeTypes: any = [];

  public results: any = {};
  public nodeData: any = {};
  public sourcenodeData: any = {};
  public sourceId: any = {};

  public destinationnodeData: any = {};
  private groupedNodeType = [];
  public edgeData: any = {};
  masterListsData = [];
  diseaseGenesEdgesData = [];
  private modalRef: any;
  @ViewChild('showNode', { static: false }) show_nodes?: ElementRef;
  @ViewChild('showEdge', { static: false }) show_edges?: ElementRef;

  node_name: string = '';
  edge_name: string = '';
  mapTypes: string = '';
  layout: any = {};
  graphData: any = [];
  doFilterApply: Subject<any> = new Subject();  // ## P= Parent
  constructor(
    private globalVariableService: GlobalVariableService,
    private nodeSelectsService: NodeSelectsService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) { }


  graphSelected() {
    //    this.doFilterApply.next({ clickOn: param });
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("you here you1:: ", this.filterParams);
    this.getMasterListsMap(this.filterParams);
    this.globalVariableService.resetNode();
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("you here you2:: ", this.filterParams);
  }

  ngOnInit() {
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("you here2:: ", this.filterParams);
    this.mapTypes = this.filterParams.mapType;

    // this.drawChart();

    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      console.log("data: ", data);
      if (data === undefined) { // data=undefined true when apply filter from side panel
        this.filterParams = this.globalVariableService.getFilterParams();
        this.getMasterListsMap(this.filterParams);
        console.log("new Filters2: ", this.filterParams);
      }
      else if (data.clickOn == 'clickOnEventDetails') { // because graph should not change when click on this component itself
        this.filterParams = this.globalVariableService.getFilterParams(this.globalVariableService.getFilterParams());
        console.log("new Filters3: ", this.filterParams);
        this.getMasterListsMap(this.filterParams);
      }

    });
    this.getMasterListsMap(this.filterParams);
  }

  ngOnDestroy() {
    // needed if child gets re-created (eg on some model changes)
    // note that subsequent subscriptions on the same subject will fail
    // so the parent has to re-create parentSubject on changes
    this.ProceedDoFilterApply?.unsubscribe();
  }

  getMasterListsMap(_filterParams: any) {
    console.log("inside: ");
    if (_filterParams.source_node != undefined) {
      this.loadingMap = true;

      // this.filterParams = this.globalVariableService.getFilterParams();
      console.log("master map for filter: ", _filterParams);

      this.nodeSelectsService.getMasterLists(_filterParams).subscribe(
        data => {
          this.nodeData = [];
          this.sourcenodeData = [];
          this.sourceId = [];
          this.destinationnodeData = [];
          this.edgeData = [];
          this.groupedNodeType = [];
          this.legendsNodeTypes = [];

          this.resultNodes = data;
          this.masterListsData = this.resultNodes.masterListsData;
          console.log("masterListsData: ", this.masterListsData);
          // console.log("masterListsDataLengtH: ", this.masterListsData.length);
          if (this.masterListsData.length > 0) {
            this.nodesCheckLength = false;
          } else {
            this.nodesCheckLength = true;
          }
          // console.log("bdbdd: ", this.nodesCheckLength);

          this.masterListsData.forEach((event: any) => {
            //Source Node data
            this.sourcenodeData.push({
              id: Math.floor(event.sourcenode), name: event.sourcenode_name, colorNode: '#BF63A2', shapeType: 'round-hexagon', nodeType: 'source'
            });

            //Destination node data
            this.destinationnodeData.push({
              id: Math.floor(event.destinationnode), name: event.destinationnode_name, colorNode: '#4B5DA1', shapeType: 'circle', nodeType: 'target'
            });

            this.legendsNodeTypes.push({ node_name: event.sourcenode, color_code: '#4B5DA1' });

            //Edge data
            this.edgeData.push({
              // data: { source: Math.floor(event.source_id), target: Math.floor(event.target_id), PMID: event.pmidlist, colorCode: "pink", strength: Math.floor(event.edge_weight) },
              data: { source: Math.floor(event.sourcenode), target: Math.floor(event.destinationnode), neIds: event.ne_ids, colorCode: "#00e600", strength: Math.floor(2) },
            });
          });

          console.log("sourcenodeData: ", this.sourcenodeData);
          console.log("destinationnodeData: ", this.destinationnodeData);

          //Source id
          const key = 'id';
          const arrayUniqueBySourceId = [...new Map(this.sourcenodeData.map((item: any) =>
            [item[key], item])).values()];
          console.log("arrayUniqueBySourceId: ", arrayUniqueBySourceId);

          //Destination id
          const key2 = 'id';
          const arrayUniqueByDestinationId = [...new Map(this.destinationnodeData.map((item: any) =>
            [item[key2], item])).values()];
          console.log("arrayUniqueByDestinationId: ", arrayUniqueByDestinationId);

          this.results = [...arrayUniqueByDestinationId, ...arrayUniqueBySourceId];
          console.log("new Results:::: ", this.results);

          const key3 = 'id';
          const arrayUniqueResultsData = [...new Map(this.results.map((item: any) =>
            [item[key3], item])).values()];
          console.log("arrayUniqueResultsData: ", arrayUniqueResultsData);

          arrayUniqueResultsData.forEach((event: any) => {
            //Node data
            this.nodeData.push({
              // data: { id: Math.floor(event.node_id), name: event.node, node_type: event.nodetype, weight: 100, colorCode: event.colourcode, shapeType: 'octagon' },
              data: { id: Math.floor(event.id), name: event.name, node_type: event.nodeType, weight: 100, colorCode: event.colorNode, shapeType: event.shapeType }
            });
          });

          // console.log("nodeData: ", this.nodeData);
          // console.log("edgeData: ", this.edgeData);
          // console.log("legendsNodeTypes:: ", this.legendsNodeTypes);

          const x = this.legendsNodeTypes.reduce(
            (accumulator: any, current: any) => accumulator.some((x: any) => x.node_name === current.node_name) ? accumulator : [...accumulator, current], []
          )

          this.legendsNodeTypes = x;
          console.log("legendsNodeTypes: ", this.legendsNodeTypes);
          this.drawChart();
        },
        err => {
          this.loadingMap = false;
          console.log(err.message);
        },
        () => {
          this.loadingMap = false;
        }
      );
    } else {
      console.log("go else: ");
      this.nodeData = [];
      this.edgeData = [];
      this.drawChart();
    }
  }

  private drawChart() {
    this.layout = {
      // name: 'grid',
      // animate: true,

      name: 'cose',
      idealEdgeLength: 50,
      nodeOverlap: 4,
      // refresh: 20,
      nodeSpacing: 10,
      spacingFactor: 152,
      fit: true,
      padding: 20,
      randomize: false,
      componentSpacing: 40,
      nodeRepulsion: 400000,
      edgeElasticity: 100,
      nestingFactor: 5,
      gravity: 1,
      numIter: 1000,
      initialTemp: 200,
      coolingFactor: 0.95,
      minTemp: 1.0,
      animate: false,
      animationThreshold: 250,
      boundingBox: { x1: 0, y1: 0, w: 1000, h: 1000 }
    };

    // this.graphData = {
    //   nodes:
    //     [
    //       {
    //         "data": {
    //           "id": "434",
    //           "name": "node1",
    //           "node_type": "circular",
    //           "weight": 100,
    //           "colorCode": "red",
    //           "shapeType": "octagon"
    //         }
    //       },
    //       {
    //         "data": {
    //           "id": "700",
    //           "name": "node2",
    //           "node_type": "circular",
    //           "weight": 100,
    //           "colorCode": "red",
    //           "shapeType": "octagon"
    //         }
    //       },
    //       {
    //         "data": {
    //           "id": "68",
    //           "name": "node3",
    //           "node_type": "circular",
    //           "weight": 100,
    //           "colorCode": "red",
    //           "shapeType": "octagon"
    //         }
    //       },
    //       {
    //         "data": {
    //           "id": "650",
    //           "name": "node4",
    //           "node_type": "circular",
    //           "weight": 100,
    //           "colorCode": "red",
    //           "shapeType": "octagon"
    //         }
    //       },
    //       {
    //         "data": {
    //           "id": "782",
    //           "name": "node5",
    //           "node_type": "circular",
    //           "weight": 100,
    //           "colorCode": "red",
    //           "shapeType": "octagon"
    //         }
    //       }
    //     ],
    //   edges:
    //     [
    //       {
    //         "data": {
    //           "source": "700",
    //           "target": "434",
    //           "colorCode": "pink",
    //           "strength": 2,
    //         }
    //       },
    //       {
    //         "data": {
    //           "source": "434",
    //           "target": "700",
    //           "colorCode": "pink",
    //           "strength": 2,
    //         }
    //       },
    //       {
    //         "data": {
    //           "source": "68",
    //           "target": "650",
    //           "colorCode": "pink",
    //           "strength": 2,
    //         }
    //       },
    //       {
    //         "data": {
    //           "source": "782",
    //           "target": "68",
    //           "colorCode": "pink",
    //           "strength": 2,
    //         }
    //       },
    //       {
    //         "data": {
    //           "source": "650",
    //           "target": "782",
    //           "colorCode": "pink",
    //           "strength": 2,
    //         }
    //       }
    //     ]
    // };

    this.graphData = {
      nodes:
        this.nodeData,
      edges:
        this.edgeData
    };

    console.log("graphdatas22: ", this.graphData);
  }

  nodeChange(event: any) {
    this.node_name = event;
    console.log("checked here!!", this.node_name);

    // this.showNodeInfo(event);

    // var node_name = event.target;
    // console.log("node_name: ", this.node_name);
    this.modalRef = this.modalService.open(this.show_nodes, { size: 'lg', keyboard: false, backdrop: 'static' });
  }

  edgeChange(event: any) {
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

  clickedEdges(elem: any) { //when you select the indication from dropdown menu
    let edge_select = parseInt(elem.target.value);
    this.globalVariableService.setSelectedEdges(edge_select);
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("Click Edges:: ", this.filterParams);
    if (this.filterParams.nnrt_id != undefined)
      this.getMasterListsMap(this.filterParams);
    // this.onGraphSelection.emit();
  }

  refreshMap(elem: any) {
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("refresh Map:: ", this.filterParams);
    if (this.filterParams.nnrt_id != undefined)
      this.getMasterListsMap(this.filterParams);
  }

  searchConnections = function () {

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
