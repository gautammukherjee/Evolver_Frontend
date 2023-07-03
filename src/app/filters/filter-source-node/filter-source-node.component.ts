import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, Input, Pipe, PipeTransform, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-filter-source-node',
  templateUrl: './filter-source-node.component.html',
  styleUrls: ['./filter-source-node.component.scss']
})
export class FilterSourceNodeComponent implements OnInit {

  @Output() onSelectSourceNode: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;

  private filterParams: any;
  public alphabeticallyGroupedSourceNodes: any = '';
  public selectedSourceNodes: any = [];
  public sourceNodes: any = [];
  // public sourceNodes: Array<object> = [];
  private params: object = {};
  private result: any = [];
  public loading: boolean = false;
  public sourceNodesCheck: boolean = false;
  public enableFilter: boolean = false;;
  public filterText: string = '';
  public seeMoreFilterText: string = '';
  public filterPlaceholder: string = '';
  public seeMoreFilterPlaceholder: string = '';
  public filterInput = new FormControl();
  public seeMoreFilterInput = new FormControl();
  public isAllSelected: boolean = false;
  togglecollapseStatus: boolean = false;
  private seeMoreNodeSelectsModal: any;
  mouseOverON: any = undefined;
  otherMouseOverONElem: any = undefined;
  public disableProceed = true;
  sourceNodeFilter: string = '';
  sourceNodeFilterText: string = '';
  // hideCardBody: boolean = true;


  constructor(
    private nodeSelectsService: NodeSelectsService,
    private globalVariableService: GlobalVariableService,
    private modalService: NgbModal,
    private elementRef: ElementRef
  ) { }



  ngOnInit(): void {

    //To filter the gene lists
    this.enableFilter = true;
    this.filterText = "";
    this.filterPlaceholder = "Source Nodes Filter..";

    //To filter the "SEE MORE" gene lists
    this.seeMoreFilterText = "";
    this.seeMoreFilterPlaceholder = "Search Source Nodes";
    //End here

    // this.globalVariableService.setSelectedSourceNodes([10810]);
    // this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
    // console.log("selectedSourceNodes: ", this.selectedSourceNodes);

    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters source node: ", this.filterParams);

    // this.UpdateFilterDataApply?.subscribe(event => {  // Calling from details, details working as mediator
    //   console.log("eventSource:: ", event.clickOn);
    //   if (event.clickOn == undefined) {
    //     // this.hideCardBody = true;
    //     this.selectedSourceNodes = []; // Reinitialized, because when data updated on click TA, it should empty locally

    //     this.filterParams = this.globalVariableService.getFilterParams();
    //     // console.log("click on node selected: ", this.filterParams.nnrt_id);

    //     this.getSourceNode(event, 2);
    //     // } else if (event !== undefined && event.clickOn != 'geneFilter' && event.clickOn != 'geneFilter')
    //   } else if (event.clickOn !== undefined && event.clickOn != 'diseasesIndicationsFilter') {
    //     // this.hideCardBody = true;
    //     this.selectedSourceNodes = []; // Reinitialized, because when data updated on click TA, it should empty locally
    //     // this.globalVariableService.setSelectedSourceNodes([10810]);
    //     // this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
    //     // this.filterParams = this.globalVariableService.getFilterParams();
    //     // console.log("change on click: ", this.filterParams);
    //     this.getSourceNode(event, 2);
    //   }
    // });
    // this.getSourceNode(event, 1);
    // this.hideCardBody = true;
  }

  ngOnDestroy() {
    this.UpdateFilterDataApply?.unsubscribe();
  }

  getSourceNode(searchval: any) {
    console.log("searchval: ", searchval);
    console.log("searchval2: ", searchval.length);
    if (searchval.length > 2) {
      this.loading = true;
      // localStorage.setItem('searchval', searchval);
      this.filterParams = this.globalVariableService.getFilterParams({ "searchval": searchval });
      console.log("filterparamsSearchFirst: ", this.filterParams);
      // this.params = this.globalVariableService.getFilterParams();
      this.nodeSelectsService.getSourceNode(this.filterParams)
        .subscribe(
          data => {
            this.result = data;
            // console.log("result: ", this.result);
            this.sourceNodes = this.result.sourceNodeRecords;
            console.log("sourceNodes: ", this.sourceNodes);
            // this.loading = true;

            // this.alphabeticallyGroupedSourceNodes = this.groupBy(this.sourceNodes, 'source_node_name');
            // console.log("alphabeticallyGroupedSourceNodes: ", this.alphabeticallyGroupedSourceNodes);
            //if (event !== undefined && event.type == 'load') { // i.e No Genes selected previously
            // for (let i = 0; i < this.result.sourceNodeRecords.length && i < 1; i++) {
            //   this.selectedSourceNodes.push(this.result.sourceNodeRecords[i].source_node);
            //   //this.selectedSourceNodes = [];
            // }
            // console.log("selected source Nodes: ", this.selectedSourceNodes);
            // this.globalVariableService.setSelectedSourceNodes(this.selectedSourceNodes);
            //} else {
            //this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
            //}
          },
          err => {
            // this.sourceNodesCheck = true;
            this.loading = false;
            console.log(err.message)
          },
          () => {
            // this.sourceNodesCheck = true;
            this.loading = false;
            console.log("loading finish")
          }
        );
    }
  }

  selectSourceNode(sourceNode: any, event: any, from: any = null) {
    if (event.target.checked) {
      this.selectedSourceNodes.push(sourceNode.source_node);
    } else {
      this.selectedSourceNodes.splice(this.selectedSourceNodes.indexOf(sourceNode.source_node), 1);
    }

    console.log("selectedSourceNodes: ", this.selectedSourceNodes);
    // this.globalVariableService.resetfiltersInner();// On click TA other filter's data will update, so've to reset filter selected data   

    // if (from != 'nodeSelectsWarningModal')
    //   this.proceed();
    this.enableDisableProceedButton();
  }

  collapseMenuItem() {
    this.togglecollapseStatus = !this.togglecollapseStatus;
  }

  selectAll(event: any, nodeSelectsWarningModal: any) {
    if (this.isAllSelected) {
      this.sourceNodes.map((element: any) => {
        console.log("element: ", element);
        this.selectedSourceNodes.push(element.source_node);
      })
    } else {
      this.selectedSourceNodes = [];
    }
    this.enableDisableProceedButton();
  }

  resetSourceNode() {
    this.selectedSourceNodes = [];
    this.globalVariableService.setSelectedSourceNodes(this.selectedSourceNodes);
    this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
    // this.proceed();
  }

  // reloadNode() {
  //   // this.globalVariableService.resetChartFilter();
  //   // this.hideCardBody = !this.hideCardBody;
  //   this.params = this.globalVariableService.getFilterParams();
  //   // if (!this.hideCardBody)
  //   this.getSourceNode(this.params);
  // }

  SeeMore(evt: any, seeMoreSourceNodeModal: any) {
    this.seeMoreNodeSelectsModal = this.modalService.open(seeMoreSourceNodeModal, { size: 'lg', windowClass: 'diseaseModal-custom-class', keyboard: false, backdrop: 'static' });
  }

  seeMoreClosePopup() {
    this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  closePopup() {
    this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  public seeMoreproceed() {
    this.proceed();
    this.enableDisableProceedButton();
  }

  proceed() {
    this.globalVariableService.setSelectedSourceNodes(this.selectedSourceNodes);
    this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
    if (this.seeMoreNodeSelectsModal != undefined)
      this.seeMoreNodeSelectsModal.close();
    this.onSelectSourceNode.emit();
  }

  private enableDisableProceedButton() {
    if (this.selectedSourceNodes.length < 1) {
      this.disableProceed = true;
    } else {
      this.disableProceed = false;
    }
  }

  private groupBy(collection: any, property: any) {   //collection:Array, property:String
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!collection) {
      return null;
    }

    const groupedCollection = collection.reduce((previous: any, current: any) => {
      if (!previous[current[property].charAt(0)]) {
        previous[current[property].charAt(0)] = [current];
      } else {
        previous[current[property].charAt(0)].push(current);
      }

      return previous;
    }, {});
    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
  }

  scrollToView(key: any) {
    var elmnt = document.getElementById(key);
    if (elmnt !== null)
      elmnt.scrollIntoView();
  }

}
