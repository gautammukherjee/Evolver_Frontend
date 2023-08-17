import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, Input, Pipe, PipeTransform, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter-destination-node',
  templateUrl: './filter-destination-node.component.html',
  styleUrls: ['./filter-destination-node.component.scss']
})
export class FilterDestinationNodeComponent implements OnInit {

  @Output() onSelectDestinationNode: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;

  // public alphabeticallyGroupedGenes = [];

  private filterParams: any;
  public selectedDestinationNodes: any = [];
  public destinationNodes: any = [];
  private params: object = {};
  private result: any = [];
  public loading: boolean = false;
  public isloading: boolean = false;
  // public destinationNodesCheck: boolean = false;
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
  public disableProceed: boolean = true;
  searchInput: any = null;
  destinationNodeFilter: string = '';
  // public showDestinationBody: boolean = true;
  notEmptyPost: boolean = true;
  notscrolly: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 500;

  constructor(
    private nodeSelectsService: NodeSelectsService,
    private globalVariableService: GlobalVariableService,
    private modalService: NgbModal,
    private elementRef: ElementRef
  ) {
  }

  ngOnInit(): void {
    // this.filterParams = this.globalVariableService.getFilterParams();
    // this.getDestinationNode(event, 1);

    // this.UpdateFilterDataApply?.subscribe(event => {  // Calling from details, details working as mediator
    //   console.log("event Destination:: ", event.clickOn);
    //   if (event.clickOn == undefined) {
    //     this.getResetDestinationNode();
    //   }
    // });

    this.UpdateFilterDataApply?.subscribe(event => {  // Calling from details, details working as mediator
      console.log("event Destination: ", event.clickOn);
      this.notEmptyPost = true;
      if (event.clickOn == undefined) {
        console.log("Source Level 2:1 ", event.clickOn);
        this.getResetDestinationNode();
      } else if (event.clickOn !== undefined && (event.clickOn == 'sourceNodeFilter')) {
        // this.hideCardBody = true;
        this.filterParams = this.globalVariableService.getFilterParams();
        console.log("Source Level 2:2 ", event.clickOn);
        // if (this.firstTimeCheck === false) // Node select only one time reload when we choose destination nodes are selected
        this.getDestinationNode();
      }
    });
    // this.getDestinationNode();
    // this.selectedDestinationNodes = Array.from(this.globalVariableService.getSelectedDestinationNodes());
  }

  ngOnDestroy() {
    // this.UpdateFilterDataApply?.unsubscribe();
  }

  public getResetDestinationNode() {
    this.destinationNodes = [];
    this.searchInput = '';
  }

  getDestinationNode() {
    this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": 0, "limitValue": this.itemsPerPage });
    console.log("filterparamsFirst: ", this.filterParams);
    this.selectedDestinationNodes = []
    this.currentPage = 1;
    if (this.filterParams.source_node != undefined) {
      this.loading = true;
      this.nodeSelectsService.getDestinationNode(this.filterParams)
        .subscribe(
          data => {            
            this.result = data;
            this.destinationNodes = this.result.destinationNodeRecords;
            console.log("destinationNodes: ", this.destinationNodes);
          },
          err => {
            // this.destinationNodesCheck = true;
            this.loading = false;
            console.log(err.message)
          },
          () => {
            // this.destinationNodesCheck = true;
            this.loading = false;
            console.log("loading finish")
          }
        );
    } else {
      this.destinationNodes = [];
      this.globalVariableService.resetfilters();
    }
  }

  getDestinationNodeOnChange() {
    this.selectedDestinationNodes = []
    if (this.searchInput && this.searchInput.length > 2) {
      this.loading = true;
      this.filterParams = this.globalVariableService.getFilterParams({ "searchval": this.searchInput });
      console.log("filterparamsSearchSource: ", this.filterParams);
      this.nodeSelectsService.getDestinationNode(this.filterParams)
        .subscribe(
          data => {            
            this.result = data;
            this.destinationNodes = this.result.destinationNodeRecords;
            console.log("destinationNodesKeyup: ", this.destinationNodes);
          },
          err => {
            // this.destinationNodesCheck = true;
            this.loading = false;
            console.log(err.message)
          },
          () => {
            // this.destinationNodesCheck = true;
            this.loading = false;
            console.log("loading finish")
          }
        );
    } else {
      // this.destinationNodes = [];
      // this.globalVariableService.resetfilters();
    }
  }

  selectDestinationNode(destinationNode: any, event: any, from: any = null) {
    if (event.target.checked) {
      this.selectedDestinationNodes.push(destinationNode.destination_node);
    } else {
      this.selectedDestinationNodes.splice(this.selectedDestinationNodes.indexOf(destinationNode.destination_node), 1);
    }
    console.log("selectedDestinationNodes: ", this.selectedDestinationNodes);

    this.globalVariableService.setSelectedDestinationNodes(this.selectedDestinationNodes);
    this.selectedDestinationNodes = Array.from(this.globalVariableService.getSelectedDestinationNodes());
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters DESTINATION: ", this.filterParams);

    // this.globalVariableService.resetfiltersInner();// On click TA other filter's data will update, so've to reset filter selected data
    // if (from != 'nodeSelectsWarningModal')
    this.proceed();
    this.enableDisableProceedButton();
  }

  collapseMenuItem() {
    this.togglecollapseStatus = !this.togglecollapseStatus;
  }

  resetDestinationNode() {
    this.searchInput = '';
    this.disableProceed = true;
    this.selectedDestinationNodes = [];
    this.globalVariableService.setSelectedDestinationNodes(this.selectedDestinationNodes);
    this.selectedDestinationNodes = Array.from(this.globalVariableService.getSelectedDestinationNodes());
    this.proceed();
  }

  // reloadNode() {
  //   // this.globalVariableService.resetChartFilter();
  //   // this.hideCardBody = !this.hideCardBody;
  //   this.params = this.globalVariableService.getFilterParams();
  //   // if (!this.hideCardBody)
  //   this.getDestinationNode(this.params);
  // }

  SeeMore(evt: any, seeMoreDestinationNodeModal: any) {
    this.seeMoreNodeSelectsModal = this.modalService.open(seeMoreDestinationNodeModal, { size: 'lg', windowClass: 'diseaseModal-custom-class', keyboard: false, backdrop: 'static' });
  }

  seeMoreClosePopup() {
    this.selectedDestinationNodes = Array.from(this.globalVariableService.getSelectedDestinationNodes());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  closePopup() {
    this.selectedDestinationNodes = Array.from(this.globalVariableService.getSelectedDestinationNodes());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  public seeMoreproceed() {
    this.proceed();
    this.enableDisableProceedButton();
  }

  proceed() {
    this.globalVariableService.setSelectedDestinationNodes(this.selectedDestinationNodes);
    this.selectedDestinationNodes = Array.from(this.globalVariableService.getSelectedDestinationNodes());
    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters destination: ", this.filterParams);

    if (this.seeMoreNodeSelectsModal != undefined)
      this.seeMoreNodeSelectsModal.close();
    this.onSelectDestinationNode.emit();
  }

  private enableDisableProceedButton() {
    if (this.selectedDestinationNodes.length < 1) {
      this.disableProceed = true;
    } else {
      this.disableProceed = false;
    }
  }

  scrollToView(key: any) {
    var elmnt = document.getElementById(key);
    if (elmnt !== null)
      elmnt.scrollIntoView();
  }

  // onDestinationHeaderClick() {
  //   this.showDestinationBody = !this.showDestinationBody;
  // }

  onScroll() {
    console.log('onScroll Here');
    if (this.notscrolly && this.notEmptyPost) {
      // this.spinner.show();
      this.notscrolly = false;
      this.currentPage++;
      this.loadNextPost();
    }else{
      console.log('else');
    }
  }

  loadNextPost() {
    // this.toggleLoading();
    this.isloading = true;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filterParams = this.globalVariableService.getFilterParams({ "offSetValue": startIndex, "limitValue": this.itemsPerPage });
    console.log("filterparamScroll: ", this.filterParams);
    // this.selectedDestinationNodes = []
    if (this.filterParams.source_node != undefined) {
      
      this.nodeSelectsService.getDestinationNode(this.filterParams)
        .subscribe(
          data => {
            this.loading = true;
            this.result = data;
            // this.destinationNodes = this.result.destinationNodeRecords;
            // console.log("destinationNodes Inside: ", this.destinationNodes);
            // console.log("len: ", this.result.destinationNodeRecords.length);

            if (this.result.destinationNodeRecords.length === 0) {
              this.notEmptyPost = false;
            }
            this.destinationNodes = this.destinationNodes.concat(this.result.destinationNodeRecords);
            // this.diseases_syns = this.newPost.diseasesSynsRecords;
            console.log("finalTotal: ", this.destinationNodes);
            // console.log("length: ", this.destinationNodes.length);
            this.notscrolly = true;

          },
          err => {
            // this.destinationNodesCheck = true;
            this.isloading = false;
            this.loading = false;
            console.log(err.message)
          },
          () => {
            // this.destinationNodesCheck = true;
            this.isloading = false;
            this.loading = false;
            console.log("loading finish")
          }
        );
    } else {
      this.destinationNodes = [];
      this.globalVariableService.resetfilters();
    }

   

  }


}
