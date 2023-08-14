import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';

declare var jQuery: any;


@Component({
  selector: 'app-ct_investigator_rels',
  templateUrl: './ct_investigator_rels.component.html',
  styleUrls: ['./ct_investigator_rels.component.scss']
})
export class CTInvestigatorRelsComponent implements OnInit {
  loader: boolean = false;
  InvestigatorRelData: any = [];
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
    // this.getCTDataInvestigatorWithRels(this.filterParams);
  }

  getCTDataInvestigatorWithRels(_filterParams: any) {

    jQuery('#CT_Investigator_data').bootstrapTable({
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
      onClickRow: (field: any, row: any, $element: any) => {

      },
    });
    jQuery('#CT_Investigator_data').bootstrapTable("load");
  }

  reloadInvestigatorRelsData() {
    console.log("investigator Rels data: ")
    // this.globalVariableService.resetChartFilter();

    this.hideCardBody = !this.hideCardBody;
    this.filterParams = this.globalVariableService.getFilterParams();
    if (!this.hideCardBody)
      this.getCTDataInvestigatorWithRels(this.filterParams);
  }
}
