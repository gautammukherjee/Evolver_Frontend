import { Component } from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'app-ct_disease_assoc',
  templateUrl: './ct_disease_assoc.component.html',
  styleUrls: ['./ct_disease_assoc.component.scss']
})
export class CTDiseaseAssocComponent {
  loader: boolean = false;
  CTData: any = [];
  ngOnInit() {
    this.getCTDataAssocWithDisease();
  }

  getCTDataAssocWithDisease() {

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
      onClickRow: (field: any, row: any, $element: any) => {

      },
    });
    jQuery('#CT_data').bootstrapTable("load");
  }
}
