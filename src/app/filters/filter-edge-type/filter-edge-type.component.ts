import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, Input, Pipe, PipeTransform, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter-edge-type',
  templateUrl: './filter-edge-type.component.html',
  styleUrls: ['./filter-edge-type.component.scss']
})
export class FilterEdgeTypeComponent implements OnInit {

  @Output() onSelectEdgeType: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;

  // public alphabeticallyGroupedGenes = [];

  private filterParams: any;
  public selectedEdgeTypes: any = [];
  public edgeTypes: any = [];
  private params: object = {};
  private result: any = [];
  public loading: boolean = false;
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
  hideCardBody: boolean = true;
  showEdgeBody: boolean = false;

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

    // this.UpdateFilterDataApply?.subscribe(event => {  // Calling from details, details working as mediator
    //   console.log("eventEdgeType:: ", event);
    //   if (event == undefined) {
    //     this.hideCardBody = true;
    //     this.selectedEdgeTypes = []; // Reinitialized, because when data updated on click TA, it should empty locally
    //     this.getEdgeType(event, 2);
    //   } else if (event !== undefined && event.clickOn != 'geneFilter' && event.clickOn != 'geneFilter')
    //     this.hideCardBody = true;
    //   this.getEdgeType(event, 2);
    // });
    this.getEdgeType(event, 1);
    // this.hideCardBody = true;

    this.selectedEdgeTypes = Array.from(this.globalVariableService.getSelectedEdgeTypes());
  }

  ngOnDestroy() {
    this.UpdateFilterDataApply?.unsubscribe();
  }

  public getEdgeType(event: any, type: any) {
    this.loading = true;
    this.params = this.globalVariableService.getFilterParams();


    //if (this.diseaseCheck !== undefined || this.diseaseCheckCT !== undefined) {
    this.nodeSelectsService.getEdgeType()
      .subscribe(
        data => {
          this.result = data;
          // console.log("result: ", this.result);
          this.edgeTypes = this.result.edgeTypeRecords;
          console.log("edgeTypes: ", this.edgeTypes);

          if (event !== undefined && event.type == 'load') { // i.e No Genes selected previously
            for (let i = 0; i < this.result.edgeTypeRecords.length && i < 1; i++) {
              // this.selectedEdgeTypes.push(this.result.edgeTypeRecords[i].edge_type_id);
              this.selectedEdgeTypes = [];
            }
            console.log("selected Edge Types: ", this.selectedEdgeTypes);
            // this.globalVariableService.setSelectedEdgeTypes(this.selectedEdgeTypes);
          } else {
            this.selectedEdgeTypes = Array.from(this.globalVariableService.getSelectedEdgeTypes());
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
    // }
    // else {
    //   this.genes = [];
    //   this.loading = false;
    // }
  }

  selectEdgeType(edgeType: any, event: any, from: any = null) {
    if (event.target.checked) {
      this.selectedEdgeTypes.push(edgeType.edge_type_id);
    } else {
      this.selectedEdgeTypes.splice(this.selectedEdgeTypes.indexOf(edgeType.edge_type_id), 1);
    }

    console.log("selectedEdgeTypes: ", this.selectedEdgeTypes);
    // this.globalVariableService.resetfiltersInner();// On click TA other filter's data will update, so've to reset filter selected data   

    if (from != 'edgeSelectsWarningModal')
      this.proceed();
    this.enableDisableProceedButton();
  }

  collapseMenuItem() {
    this.togglecollapseStatus = !this.togglecollapseStatus;
  }

  // selectAll(event: any, geneWarningModal: any) {
  //   if (this.isAllSelected) {
  //     this.result.map((element: any) => {
  //       // console.log("element: ", element);
  //       this.selectedEdgeTypes.push(element.edge_type_id);
  //     })
  //   } else {
  //     this.selectedEdgeTypes = [];
  //   }
  //   this.enableDisableProceedButton();
  // }

  resetEdgeType() {
    this.selectedEdgeTypes = [];
    this.globalVariableService.setSelectedEdgeTypes(this.selectedEdgeTypes);
    this.selectedEdgeTypes = Array.from(this.globalVariableService.getSelectedEdgeTypes());
    console.log("selected Edge Type: ", this.selectedEdgeTypes);
    // this.proceed();
  }

  // reloadEdgeType() {
  //   // this.globalVariableService.resetChartFilter();
  //   // this.hideCardBody = !this.hideCardBody;
  //   this.params = this.globalVariableService.getFilterParams();
  //   // if (!this.hideCardBody)
  //   this.getEdgeType(this.params);
  // }

  closePopup() {
    this.selectedEdgeTypes = Array.from(this.globalVariableService.getSelectedEdgeTypes());
    this.isAllSelected = false;
  }

  public seeMoreproceed() {
    this.proceed();
    // this.enableDisableProceedButton();
  }

  proceed() {
    this.globalVariableService.setSelectedEdgeTypes(this.selectedEdgeTypes);
    this.selectedEdgeTypes = Array.from(this.globalVariableService.getSelectedEdgeTypes());
    this.onSelectEdgeType.emit();
  }

  private enableDisableProceedButton() {
    if (this.selectedEdgeTypes.length < 1) {
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

  onEdgeHeaderClick() {
    this.showEdgeBody = !this.showEdgeBody;
  }

}
