import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, Input, Pipe, PipeTransform, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter-edge-type-level2',
  templateUrl: './filter-edge-type-level2.component.html',
  styleUrls: ['./filter-edge-type-level2.component.scss']
})
export class FilterEdgeTypeLevel2Component implements OnInit {

  @Output() onSelectEdgeType2: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;

  // public alphabeticallyGroupedGenes = [];

  private filterParams: any;
  public selectedEdgeTypes2: any = [];
  public selectedEdgeTypesNames2: any = [];
  public edgeTypes2: any = [];
  private params: object = {};
  private result: any = [];
  public loading: boolean = false;
  public firstTimeCheck: boolean = false;
  public edgeTypesCheck: boolean = false;
  public enableFilter: boolean = false;;
  public filterText: string = '';
  public seeMoreFilterText: string = '';
  public filterPlaceholder: string = '';
  public seeMoreFilterPlaceholder: string = '';
  public filterInput = new FormControl();
  public seeMoreFilterInput = new FormControl();
  public isAllSelected: boolean = false;
  togglecollapseStatus: boolean = false;
  mouseOverON: any = undefined;
  otherMouseOverONElem: any = undefined;
  public disableProceed = true;
  edgeTypeFilter: string = '';
  edgeTypeFilterText: string = '';
  //diseaseCheck: any;
  //diseaseCheckCT: any;
  public destNodeCheck2: boolean = false;

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
    this.filterPlaceholder = "Edge Type Filter..";

    //To filter the "SEE MORE" gene lists
    this.seeMoreFilterText = "";
    this.seeMoreFilterPlaceholder = "Search Edge Type";
    //End here

    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters1: ", this.filterParams);

    this.UpdateFilterDataApply?.subscribe(event => {  // Calling from details, details working as mediator
      console.log("Edge Level: ", event.clickOn);
      if (event.clickOn !== undefined && event.clickOn == 'sourceNodeFilter') {
        console.log("Edge Level 2:2 ", event.clickOn);
        this.getEdgeType2(event);
      }
    });
    this.getEdgeType2(event);
    this.selectedEdgeTypes2 = Array.from(this.globalVariableService.getSelectedEdgeTypes2());
  }

  ngOnDestroy() {
    this.UpdateFilterDataApply?.unsubscribe();
  }

  public getEdgeType2(event: any) {
    this.filterParams = this.globalVariableService.getFilterParams();
    this.selectedEdgeTypesNames2 = []

    if (this.filterParams.source_node != undefined) {
      this.loading = true;
      // this.firstTimeCheck = true;
      this.nodeSelectsService.getEdgeType()
        .subscribe(
          data => {
            this.result = data;
            // console.log("result: ", this.result);
            this.edgeTypes2 = this.result.edgeTypeRecords;
            // console.log("edgeTypes2: ", this.edgeTypes2);

            if (event !== undefined && event.type == 'load') { // i.e No Genes selected previously
              for (let i = 0; i < this.result.edgeTypeRecords.length && i < 1; i++) {
                // this.selectedEdgeTypes2.push(this.result.edgeTypeRecords[i].edge_type_id);
                this.selectedEdgeTypes2 = [];
              }
              console.log("selected Edge Types: ", this.selectedEdgeTypes2);
              // this.globalVariableService.setSelectedEdgeTypes2(this.selectedEdgeTypes2);
            } else {
              this.selectedEdgeTypes2 = Array.from(this.globalVariableService.getSelectedEdgeTypes2());
            }
          },
          err => {
            this.edgeTypesCheck = true;
            this.loading = false;
            console.log(err.message)
          },
          () => {
            this.edgeTypesCheck = true;
            this.loading = false;
            console.log("loading finish")
          }
        );
    }
    else {
      this.edgeTypes2 = [];
      this.globalVariableService.resetfilters();
    }
  }

  selectEdgeType(edgeType: any, event: any, from: any = null) {
    if (event.target.checked) {
      this.selectedEdgeTypes2.push(edgeType.edge_type_id);
      this.selectedEdgeTypesNames2.push(edgeType.edge_type_name);
    } else {
      this.selectedEdgeTypes2.splice(this.selectedEdgeTypes2.indexOf(edgeType.edge_type_id), 1);
      this.selectedEdgeTypesNames2.splice(this.selectedEdgeTypesNames2.indexOf(edgeType.edge_type_name), 1);
    }

    console.log("selectedEdgeTypesID2: ", this.selectedEdgeTypes2);
    // this.globalVariableService.resetfiltersInner();// On click TA other filter's data will update, so've to reset filter selected data   

    this.globalVariableService.setSelectedEdgeTypes2(this.selectedEdgeTypes2);
    this.selectedEdgeTypes2 = Array.from(this.globalVariableService.getSelectedEdgeTypes2());
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters Edge Types2: ", this.filterParams);

    // if (from != 'edgeSelectsWarningModal')
    //   this.proceed();
    this.enableDisableProceedButton();
  }

  collapseMenuItem() {
    this.togglecollapseStatus = !this.togglecollapseStatus;
  }

  selectAll(event: any) {
    // console.log("is_all: ", this.isAllSelected);
    if (this.isAllSelected) {
      this.selectedEdgeTypes2=[];
      this.result.edgeTypeRecords.map((element: any) => {
        this.selectedEdgeTypes2.push(element.edge_type_id);
      })
    } else {
      this.selectedEdgeTypes2 = [];
    }
    this.globalVariableService.setSelectedEdgeTypes2(this.selectedEdgeTypes2);
    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("select all edge types2: ", this.filterParams);
    // this.enableDisableProceedButton();
  }

  resetEdgeType() {
    this.selectedEdgeTypes2 = [];
    this.globalVariableService.setSelectedEdgeTypes2(this.selectedEdgeTypes2);
    this.selectedEdgeTypesNames2 = [];
    this.selectedEdgeTypes2 = Array.from(this.globalVariableService.getSelectedEdgeTypes2());
    // console.log("selected Edge Type: ", this.selectedEdgeTypes2);
    // this.proceed();
  }

  // reloadEdgeType() {
  //   // this.globalVariableService.resetChartFilter();
  //   this.params = this.globalVariableService.getFilterParams();
  //   // if (!this.hideCardBody)
  //   this.getEdgeType(this.params);
  // }

  closePopup() {
    this.selectedEdgeTypes2 = Array.from(this.globalVariableService.getSelectedEdgeTypes2());
    this.isAllSelected = false;
  }

  public seeMoreproceed() {
    this.proceed();
    // this.enableDisableProceedButton();
  }

  proceed() {
    this.globalVariableService.setSelectedEdgeTypes2(this.selectedEdgeTypes2);
    this.selectedEdgeTypes2 = Array.from(this.globalVariableService.getSelectedEdgeTypes2());
    this.onSelectEdgeType2.emit();
  }

  private enableDisableProceedButton() {
    if (this.selectedEdgeTypes2.length < 1) {
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

}
