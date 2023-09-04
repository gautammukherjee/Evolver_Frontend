import { Component, OnInit, EventEmitter, Output, ElementRef, Renderer2, ChangeDetectorRef, Input, Pipe, PipeTransform, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-filter-source-node-level2',
  templateUrl: './filter-source-node-level2.component.html',
  styleUrls: ['./filter-source-node-level2.component.scss']
})
export class FilterSourceNodeLevel2Component implements OnInit {

  @Output() onSelectSourceNode: EventEmitter<any> = new EventEmitter();
  @Input() UpdateFilterDataApply?: Subject<any>;
  private filterParams: any;
  public selectedSourceNodes2: any = [];
  public sourceNodes2: any = [];
  // public sourceNodes: Array<object> = [];
  // private params: object = {};
  private result: any = [];
  public loading: boolean = false;
  public enableFilter: boolean = false;;
  public isAllSelected: boolean = false;
  togglecollapseStatus: boolean = false;
  private seeMoreNodeSelectsModal: any;
  public disableProceed = true;
  // showSourceBody: boolean = false;
  private warningModalRef: any;
  searchInput: any = null;
  sourceNodeFilter: string = '';

  constructor(
    private nodeSelectsService: NodeSelectsService,
    private globalVariableService: GlobalVariableService,
    private modalService: NgbModal,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
    })
  }

  ngOnInit(): void {
    // this.globalVariableService.setSelectedSourceNodes([10810]);
    // this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
    // console.log("selectedSourceNodes: ", this.selectedSourceNodes);

    // this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("new Filters source node: ", this.filterParams);

    this.UpdateFilterDataApply?.subscribe(event => {  // Calling from details, details working as mediator
      console.log("Source Level2: ", event.clickOn);
      if (event.clickOn == undefined) {
        // console.log("Source Level 2:1 ", event.clickOn);
        this.getResetSourceNode();
      } else if (event.clickOn !== undefined && (event.clickOn == 'sourceNodeFilter' || event.clickOn == 'edgeTypeFilter' || event.clickOn == 'destinationNodeFilter' || event.clickOn == 'nodeLevel2Filter' || event.clickOn == 'deleteLevel2')) {
        // this.hideCardBody = true;
        this.isAllSelected = false;
        this.filterParams = this.globalVariableService.getFilterParams();
        // console.log("Source Level 2:2 ", event.clickOn);
        // if (this.firstTimeCheck === false) // Node select only one time reload when we choose destination nodes are selected
        this.getSourceNode2();
      }
    });
    this.getSourceNode2();
    this.selectedSourceNodes2 = Array.from(this.globalVariableService.getSelectedSourceNodes2());
  }

  ngOnDestroy() {
    this.UpdateFilterDataApply?.unsubscribe();
  }

  public getResetSourceNode() {
    this.sourceNodes2 = [];
  }

  getSourceNode2() {
    this.globalVariableService.resetSourceNode2(); // reset the source node when source node component refresh
    this.filterParams = this.globalVariableService.getFilterParams();
    this.selectedSourceNodes2 = []

    if (this.filterParams.source_node != undefined) {
      this.loading = true;
      this.nodeSelectsService.getSourceNode2(this.filterParams)
        .subscribe(
          data => {
            this.result = data;
            this.sourceNodes2 = this.result.sourceNodeRecords2;
            console.log("sourceNodes2: ", this.sourceNodes2);
          },
          err => {
            this.loading = false;
            console.log(err.message)
          },
          () => {
            this.loading = false;
            console.log("loading finish")
          }
        );
    } else {
      this.sourceNodes2 = [];
      this.globalVariableService.resetfilters();
    }
  }

  selectSourceNode(sourceNode: any, event: any, warning: any = null) {
    if (event.target.checked) {
      this.selectedSourceNodes2.push(sourceNode.source_node);
    } else {
      this.selectedSourceNodes2.splice(this.selectedSourceNodes2.indexOf(sourceNode.source_node), 1);
    }
    // console.log("selectedSourceNodes2: ", this.selectedSourceNodes2.length);

    // if (this.selectedSourceNodes2.length > 2) {
    //   console.log("when more then one Source is selected");
    //   this.warningModalRef = this.modalService.open(warning, { size: 'lg', keyboard: false, backdrop: 'static' });
    // } else if (warning != null && this.selectedSourceNodes2.length == 1) {
    // }
    this.globalVariableService.setSelectedSourceNodes2(this.selectedSourceNodes2);
    this.selectedSourceNodes2 = Array.from(this.globalVariableService.getSelectedSourceNodes2());
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters SOURCE2:: ", this.filterParams);

    // this.globalVariableService.resetfiltersInner();// On click TA other filter's data will update, so've to reset filter selected data   
    // if (from != 'nodeSelectsWarningModal')
    // this.proceed();
    this.enableDisableProceedButton();
  }

  selectAll() {
    console.log("is_all: ", this.isAllSelected);

    this.selectedSourceNodes2 = [];
    if (this.isAllSelected) {
      this.sourceNodes2.map((element: any) => {
        this.selectedSourceNodes2.push(element.source_node);
      });
    } else {
      this.selectedSourceNodes2 = [];
    }
    console.log("By selectedSourceNodes2: ", this.selectedSourceNodes2);

    this.proceed();
    this.enableDisableProceedButton();
  }

  collapseMenuItem() {
    this.togglecollapseStatus = !this.togglecollapseStatus;
  }

  resetSourceNode() {
    this.searchInput = '';
    this.disableProceed = true;
    // console.log("event: ", event);
    // this.globalVariableService.resetfilters();
    this.selectedSourceNodes2 = [];
    this.globalVariableService.setSelectedSourceNodes2(this.selectedSourceNodes2);
    this.selectedSourceNodes2 = Array.from(this.globalVariableService.getSelectedSourceNodes2());
    // this.proceed();
  }

  seeMoreClosePopup() {
    this.selectedSourceNodes2 = Array.from(this.globalVariableService.getSelectedSourceNodes2());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
  }

  closePopup() {
    this.selectedSourceNodes2 = Array.from(this.globalVariableService.getSelectedSourceNodes2());
    this.isAllSelected = false;
    this.seeMoreNodeSelectsModal.close();
    this.warningModalRef.close();
  }

  public seeMoreproceed() {
    this.proceed();
    this.enableDisableProceedButton();
  }

  proceed() {
    this.globalVariableService.setSelectedSourceNodes2(this.selectedSourceNodes2);
    this.selectedSourceNodes2 = Array.from(this.globalVariableService.getSelectedSourceNodes2());
    if (this.seeMoreNodeSelectsModal != undefined)
      this.seeMoreNodeSelectsModal.close();
    this.onSelectSourceNode.emit();
  }

  private enableDisableProceedButton() {
    if (this.selectedSourceNodes2.length < 1) {
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

  // onSourceHeaderClick() {
  //   this.showSourceBody = !this.showSourceBody;
  // }

}
