import { Component, OnInit, EventEmitter, Output, ElementRef, Renderer2, ChangeDetectorRef, Input, Pipe, PipeTransform, ViewChild, ViewChildren } from '@angular/core';
import { NodeSelectsService } from '../../services/common/node-selects.service';
import { GlobalVariableService } from '../../services/common/global-variable.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { map, startWith } from 'rxjs/operators';
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
  public selectedSourceNodes: any = [];
  public sourceNodes: any = [];
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
      console.log("event Source:: ", event.clickOn);
      if (event.clickOn == undefined) {
        this.getResetSourceNode();
      }
    });
  }

  ngOnDestroy() {
    // this.UpdateFilterDataApply?.unsubscribe();
  }

  public getResetSourceNode() {
    this.sourceNodes = [];
  }

  getSourceNode() {
    // console.log("val: ", this.searchInput);
    if (this.searchInput.length > 2) {
      this.loading = true;
      this.filterParams = this.globalVariableService.getFilterParams({ "searchval": this.searchInput });
      console.log("filterparamsSearchSource: ", this.filterParams);
      // this.params = this.globalVariableService.getFilterParams();
      this.nodeSelectsService.getSourceNode(this.filterParams)
        .subscribe(
          data => {
            this.result = data;
            this.sourceNodes = this.result.sourceNodeRecords;
            console.log("sourceNodes: ", this.sourceNodes);
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
    }
  }

  selectSourceNode(sourceNode: any, event: any, warning: any = null) {
    if (event.target.checked) {
      this.selectedSourceNodes.push(sourceNode.source_node);
    } else {
      this.selectedSourceNodes.splice(this.selectedSourceNodes.indexOf(sourceNode.source_node), 1);
    }
    console.log("selectedSourceNodes: ", this.selectedSourceNodes.length);


    // if (this.selectedSourceNodes.length > 2) {
    //   console.log("when more then one Source is selected");
    //   this.warningModalRef = this.modalService.open(warning, { size: 'lg', keyboard: false, backdrop: 'static' });
    // } else if (warning != null && this.selectedSourceNodes.length == 1) {
    // }
    this.globalVariableService.setSelectedSourceNodes(this.selectedSourceNodes);
    this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("new Filters SOURCE:: ", this.filterParams);

    // this.globalVariableService.resetfiltersInner();// On click TA other filter's data will update, so've to reset filter selected data   
    // if (from != 'nodeSelectsWarningModal')
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
    this.selectedSourceNodes = [];
    this.globalVariableService.setSelectedSourceNodes(this.selectedSourceNodes);
    this.selectedSourceNodes = Array.from(this.globalVariableService.getSelectedSourceNodes());
    // this.proceed();
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
    this.warningModalRef.close();
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

  scrollToView(key: any) {
    var elmnt = document.getElementById(key);
    if (elmnt !== null)
      elmnt.scrollIntoView();
  }

  // onSourceHeaderClick() {
  //   this.showSourceBody = !this.showSourceBody;
  // }

}
