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
  showSidebar: boolean = false;

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

  nodeChanged(e: any) {
    // this.doFilterApply.next(e);
    this.doUpdateFilterDataApply.next(e);
  }
  sourceNodeChanged(e: any) {
    // this.doFilterApply.next(e);
  }
  destinationNodeChanged(e: any) {
    // this.doFilterApply.next(e);
  }
  edgeTypeChanged(e: any) {
    // this.doFilterApply.next(e);
  }

}
