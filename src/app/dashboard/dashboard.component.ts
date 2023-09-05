import { Component, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { Router } from '@angular/router';
import { GlobalVariableService } from '../services/common/global-variable.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  doFilterApply: Subject<any> = new Subject();  // ## P= Parent
  doFilterApplyTab2: Subject<any> = new Subject();  // ## P= Parent
  doFilterApplyTab3: Subject<any> = new Subject();  // ## P= Parent
  doFilterApplyTab4: Subject<any> = new Subject();  // ## P= Parent
  doFilterApplyTab5: Subject<any> = new Subject();  // ## P= Parent
  doUpdateFilterDataApply: Subject<any> = new Subject();
  showSidebar: boolean = true;
  viewMode = 'event_list';
  showLevels: boolean = true;
  currentLevel: number = 1;
  maxLevel: number = 2;
  isSourceNodes: boolean = false;
  public selectedNodeSelects2: any = [];
  public selectedTabs: any = [];

  private filterParams: any;

  constructor(private globalVariableService: GlobalVariableService, private router: Router) {
    // this.globalVaiableService.setSelectedTa([1]);
  }

  ngOnInit(): void {
    // this.selectedNodeSelects2 = Array.from(this.globalVariableService.getSelectedNodeSelects2());
    // console.log("node selects2 in submit2222: ", this.selectedNodeSelects2);

    this.globalVariableService.resetfilters();// on hard reset when page gets loaded
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("main page filters: ", this.filterParams);
  }

  ontoggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  dateRangeChanged(e: any) {
    this.doFilterApply.next(e);
  }

  nodeChanged(clickOn: any) {
    this.filterParams = this.globalVariableService.getFilterParams();
    // console.log("filterparams in node change: ", this.filterParams['tabType']);

    if (this.filterParams['tabType'] == "map" || this.filterParams['tabType'] == "default") {
      this.doFilterApply.next(undefined);
    }
    else if (this.filterParams['tabType'] == "details") {
      this.doFilterApplyTab2.next(undefined);
    }
    else if (this.filterParams['tabType'] == "relation") {
      this.doFilterApplyTab3.next(undefined);
    }
    else if (this.filterParams['tabType'] == "articlecount") {
      this.doFilterApplyTab4.next(undefined);
    }
    else if (this.filterParams['tabType'] == "ct") {
      this.doFilterApplyTab5.next(undefined);
    }
    this.doUpdateFilterDataApply.next({ clickOn: clickOn });
  }
  sourceNodeChanged(clickOn: any, e: any) {
    if (e && e.length > 0) {
      this.isSourceNodes = true;
    }
    // this.doFilterApply.next(undefined);
    this.doUpdateFilterDataApply.next({ clickOn: clickOn });
  }
  destinationNodeChanged(clickOn: any) {
    // this.doFilterApply.next(undefined);
    // this.doUpdateFilterDataApply.next(e);
    this.doUpdateFilterDataApply.next({ clickOn: clickOn });
  }
  edgeTypeChanged(clickOn: any) {
    // this.doFilterApply.next(e);
    this.doUpdateFilterDataApply.next({ clickOn: clickOn });
  }

  // submitChanged(e: any) {
  //   console.log("e: ", e);
  //   this.doFilterApply.next(e);
  // }

  // submitChangedTab2(e: any) {
  //   this.doFilterApplyTab2.next(e);
  // }

  // submitChangedTab3(e: any) {
  //   this.doFilterApplyTab3.next(e);
  // }

  // submitChangedTab4(e: any) {
  //   this.doFilterApplyTab4.next(e);
  // }

  graphSelected(param: any) {
    console.log("your Graph:: ", param);
    this.doFilterApply.next({ clickOn: param });
  }

  nodeChanged2(clickOn: any) {
    // this.doFilterApply.next(e);
    // this.doUpdateFilterDataApply.next(e);
    this.doUpdateFilterDataApply.next({ clickOn: clickOn });
  }

  // edgeTypeChanged2(e: any) {
  //   // this.doFilterApply.next(e);
  // }

  // sourceNodeChanged2(clickOn: any) {
  //   // this.doFilterApply.next(undefined);
  //   this.doUpdateFilterDataApply.next({ clickOn: clickOn });
  // }
  // destinationNodeChanged2(clickOn: any) {
  //   // this.doFilterApply.next(undefined);
  //   // this.doUpdateFilterDataApply.next(e);
  //   this.doUpdateFilterDataApply.next({ clickOn: clickOn });
  // }


  secondTab() {
  }

  onToggleLevel() {
    this.showLevels = !this.showLevels;
  }

  onAddLevel() {

    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("filterparams main level click: ", this.filterParams['tabType']);

    if (this.filterParams['tabType'] == "map" || this.filterParams['tabType'] == "default") {
      this.doFilterApply.next(undefined);
    }
    else if (this.filterParams['tabType'] == "details") {
      this.doFilterApplyTab2.next(undefined);
    }
    else if (this.filterParams['tabType'] == "relation") {
      this.doFilterApplyTab3.next(undefined);
    }
    else if (this.filterParams['tabType'] == "articlecount") {
      this.doFilterApplyTab4.next(undefined);
    }
    else if (this.filterParams['tabType'] == "ct") {
      this.doFilterApplyTab5.next(undefined);
    }

    // this.doFilterApply.next(undefined);
    this.showLevels = true;
    this.currentLevel = this.currentLevel + 1;
  }

  onSubmit() {
    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("filterparams main2: ", this.filterParams['tabType']);

    if (this.filterParams['tabType'] == "map" || this.filterParams['tabType'] == "default") {
      this.doFilterApply.next(undefined);
    }
    else if (this.filterParams['tabType'] == "details") {
      this.doFilterApplyTab2.next(undefined);
    }
    else if (this.filterParams['tabType'] == "relation") {
      this.doFilterApplyTab3.next(undefined);
    }
    else if (this.filterParams['tabType'] == "articlecount") {
      this.doFilterApplyTab4.next(undefined);
    }
    else if (this.filterParams['tabType'] == "ct") {
      this.doFilterApplyTab5.next(undefined);
    }
  }

  onSubmitTab(event: any, tab: any) {
    if (tab == 'map') {
      this.globalVariableService.setTabsSelected('map');
      // this.selectedTabs = Array.from(this.globalVariableService.getTabsSelected());
      // this.filterParams = this.globalVariableService.getFilterParams();
      // console.log("filterparams map Type: ", this.filterParams);
      this.doFilterApply.next(undefined);
    }
    else if (tab == 'details') {
      this.globalVariableService.setTabsSelected('details');
      // console.log("filterparams details Type: ", this.filterParams);
      this.doFilterApplyTab2.next(undefined);
    }
    else if (tab == 'relation') {
      this.globalVariableService.setTabsSelected('relation');      
      // console.log("filterparams relation Type: ", this.filterParams);
      this.doFilterApplyTab3.next(undefined);
    }
    else if (tab == 'articlecount') {
      this.globalVariableService.setTabsSelected('articlecount');      
      // console.log("filterparams article Type: ", this.filterParams);
      this.doFilterApplyTab4.next(undefined);
    }
    else if (tab == 'ct') {
      this.globalVariableService.setTabsSelected('ct');      
      // console.log("filterparams article Type: ", this.filterParams);
      this.doFilterApplyTab5.next(undefined);
    }

    // console.log("yes2: ", this.currentLevel);
    // if (this.currentLevel == 2) {
    //   // this.selectedNodeSelects2='';
    //   // const nodeSelects2 = (this.selectedNodeSelects2 != '' ? this.selectedNodeSelects2 : '');
    //   console.log("node selects2 in submit11: ", this.selectedNodeSelects2);

    //   if (this.selectedNodeSelects2 == "") {
    //     alert("Please select Node Pair Type");
    //   } else {
    //     this.globalVariableService.setSelectedNodeSelects2(this.selectedNodeSelects2);
    //     this.selectedNodeSelects2 = Array.from(this.globalVariableService.getSelectedNodeSelects2());
    //     this.doFilterApply.next(undefined);
    //   }
    //   // console.log("node selects2 in submit22: ", this.selectedNodeSelects2);
    //   // if (this.selectedNodeSelects2 != "") {
    //   //   this.doFilterApply.next(undefined);
    //   // } else {
    //   //   alert("Please select Node Pair Type");
    //   // }
    // } else {
    //   this.doFilterApply.next(undefined);
    // }
  }

  resetAllFilters() {
    this.globalVariableService.resetfilters();// On click TA other filter's data will update, so've to reset filter selected data   
    window.location.reload();
    // this.proceed();
  }

  deleteSecondDegree(clickOn:any){
    this.showLevels = !this.showLevels;
    this.currentLevel = this.currentLevel - 1;
    
    this.doUpdateFilterDataApply.next({ clickOn: clickOn });
    this.globalVariableService.resetfiltersForLevel2();

    this.filterParams = this.globalVariableService.getFilterParams();
    console.log("filterparams after level 2 delete: ", this.filterParams);
  }

}
