import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, Input, Pipe, PipeTransform, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter-destination-node-level2',
  templateUrl: './filter-destination-node-level2.component.html',
  styleUrls: ['./filter-destination-node-level2.component.scss']
})
export class FilterDestinationNodeLevel2Component implements OnInit {

  @Output() onSelectDestinationNode: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;

  // public alphabeticallyGroupedGenes = [];

  private filterParams: any;
  public selectedDestinationNodes2: any = [];
  public destinationNodes2: any = [];
  private params: object = {};
  private result: any = [];
  public loading: boolean = false;
  public destinationNodesCheck: boolean = false;
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
  // public showDestinationBody: boolean = true;

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

    this.UpdateFilterDataApply?.subscribe(event => {  // Calling from details, details working as mediator
      console.log("Destination level2:: ", event.clickOn);
      if (event.clickOn == undefined) {
        this.getResetDestinationNode();
      }
    });
  }

  ngOnDestroy() {
    // this.UpdateFilterDataApply?.unsubscribe();
  }

  public getResetDestinationNode() {
    this.destinationNodes2 = [];
  }

  getDestinationNode() {
    this.filterParams = this.globalVariableService.getFilterParams();
    if (this.filterParams.source_node != undefined) {
      if (this.searchInput.length > 2) {
        this.loading = true;
        this.filterParams = this.globalVariableService.getFilterParams({ "searchval": this.searchInput });
        console.log("filterparamsSearchDestination: ", this.filterParams);
        this.nodeSelectsService.getDestinationNode2(this.filterParams)
          .subscribe(
            data => {
              this.result = data;
              this.destinationNodes2 = this.result.destinationNodeRecords2;
              console.log("destinationNodes2: ", this.destinationNodes2);
            },
            err => {
              this.destinationNodesCheck = true;
              this.loading = false;
              console.log(err.message)
            },
            () => {
              this.destinationNodesCheck = true;
              this.loading = false;
              console.log("loading finish")
            }
          );
      }
    } else {
      this.globalVariableService.resetfilters();
    }
  }

  selectDestinationNode(destinationNode: any, event: any, from: any = null) {
    if (event.target.checked) {
      this.selectedDestinationNodes2.push(destinationNode.destination_node);
    } else {
      this.selectedDestinationNodes2.splice(this.selectedDestinationNodes2.indexOf(destinationNode.destination_node), 1);
    }
    console.log("selectedDestinationNodes2: ", this.selectedDestinationNodes2);

    this.globalVariableService.setSelectedDestinationNodes(this.selectedDestinationNodes2);
    this.selectedDestinationNodes2 = Array.from(this.globalVariableService.getSelectedDestinationNodes2());
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters DESTINATION 2: ", this.filterParams);

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
    this.selectedDestinationNodes2 = [];
    this.globalVariableService.setSelectedDestinationNodes2(this.selectedDestinationNodes2);
    this.selectedDestinationNodes2 = Array.from(this.globalVariableService.getSelectedDestinationNodes2());
    // this.proceed();
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
    this.selectedDestinationNodes2 = Array.from(this.globalVariableService.getSelectedDestinationNodes2());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  closePopup() {
    this.selectedDestinationNodes2 = Array.from(this.globalVariableService.getSelectedDestinationNodes2());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  public seeMoreproceed() {
    this.proceed();
    this.enableDisableProceedButton();
  }

  proceed() {
    this.globalVariableService.setSelectedDestinationNodes2(this.selectedDestinationNodes2);
    this.selectedDestinationNodes2 = Array.from(this.globalVariableService.getSelectedDestinationNodes2());
    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters destination: ", this.filterParams);

    if (this.seeMoreNodeSelectsModal != undefined)
      this.seeMoreNodeSelectsModal.close();
    this.onSelectDestinationNode.emit();
  }

  private enableDisableProceedButton() {
    if (this.selectedDestinationNodes2.length < 1) {
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

}
