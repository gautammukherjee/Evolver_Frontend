import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';

declare var jQuery: any;

@Component({
  selector: 'app-ct_disease_assoc',
  templateUrl: './ct_disease_assoc.component.html',
  styleUrls: ['./ct_disease_assoc.component.scss']
})
export class CTDiseaseAssocComponent implements OnInit {
  loader: boolean = false;
  CTData: any = [];
  hideCardBody: boolean = true;
  private filterParams: any;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private globalVariableService: GlobalVariableService,
  ) { }
  
  ngOnInit() {
    this.hideCardBody = true;
    this.filterParams = this.globalVariableService.getFilterParams();
    // this.getCTDataAssocWithDisease(this.filterParams);
  }

  getCTDataAssocWithDisease(_filterParams: any) {

    jQuery('#CT_data').bootstrapTable({
      bProcessing: true,
      bServerSide: true,
      pagination: true,
      // showRefresh: true,
      showToggle: true,
      showColumns: true,
      search: true,
      pageSize: 25,
      // pageList: [10, 25, 50, 100, All],
      striped: true,
      //showFilter: true,
      // filter: true,
      showFullscreen: true,
      stickyHeader: true,
      showExport: true,

      //data: this.CTData,
      // onClickRow: (field: any, row: any, $element: any) => {

      // },
    });
    jQuery('#CT_data').bootstrapTable("load");
  }

  reloadCTData() {
    console.log("ct data: ")
    // this.globalVariableService.resetChartFilter();

    this.hideCardBody = !this.hideCardBody;
    this.filterParams = this.globalVariableService.getFilterParams();
    if (!this.hideCardBody)
      this.getCTDataAssocWithDisease(this.filterParams);
  }

}
