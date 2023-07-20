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
  doUpdateFilterDataApply: Subject<any> = new Subject();
  showSidebar: boolean = true;
  viewMode = 'event_list';
  showLevels: boolean = true;
  currentLevel: number = 1;
  maxLevel: number = 2;

  constructor(private globalVaiableService: GlobalVariableService, private router: Router) {
    // this.globalVaiableService.setSelectedTa([1]);
  }

  ngOnInit(): void {

  }

  ontoggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  dateRangeChanged(e: any) {
    this.doFilterApply.next(e);
  }

  nodeChanged(clickOn: any) {
    this.doFilterApply.next(undefined);
    this.doUpdateFilterDataApply.next({ clickOn: clickOn });
  }
  sourceNodeChanged(clickOn: any) {
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

  submitChanged(e: any) {
    this.doFilterApply.next(e);
  }

  graphSelected(param: any) {
    console.log("your Graph:: ", param);
    this.doFilterApply.next({ clickOn: param });
  }

  nodeChanged2(clickOn: any) {
    // this.doFilterApply.next(e);
    // this.doUpdateFilterDataApply.next(e);
    this.doUpdateFilterDataApply.next({ clickOn: clickOn });
  }

  edgeTypeChanged2(e: any) {
    // this.doFilterApply.next(e);
  }

  sourceNodeChanged2(clickOn: any) {
    // this.doFilterApply.next(undefined);
    this.doUpdateFilterDataApply.next({ clickOn: clickOn });
  }
  destinationNodeChanged2(clickOn: any) {
    // this.doFilterApply.next(undefined);
    // this.doUpdateFilterDataApply.next(e);
    this.doUpdateFilterDataApply.next({ clickOn: clickOn });
  }


  secondTab() {
  }

  onToggleLevel() {
    this.showLevels = !this.showLevels;
  }

  onAddLevel() {
    this.showLevels = true;
    this.currentLevel = this.currentLevel + 1;
  }

}
