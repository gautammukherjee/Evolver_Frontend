import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RelationDistributionService } from '../services/relation-distribution.service';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import * as Highcharts from 'highcharts';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pmid-count-with-gene-and-disease',
  templateUrl: './pmid-count-with-gene-and-disease.component.html',
  styleUrls: ['./pmid-count-with-gene-and-disease.component.scss']
})
export class PmidCountWithGeneAndDiseaseComponent implements OnInit {
  //data: any = {};
  result: any = {};
  errorMsg: string | undefined;
  graphLoader: boolean = true;
  private filterParams: any;
  highcharts = Highcharts;
  chartOptions: any;
  eventIntensityGraph: any = [];
  pmid_Count: any = [];
  public graphDateCategory: any = [];

  //dateCat: any;
  @Input() ProceedDoFilterApply?: Subject<any>;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _RDS: RelationDistributionService,
    private globalVariableService: GlobalVariableService,
  ) { }

  ngOnInit(): void {
    this.filterParams = this.globalVariableService.getFilterParams();
    this.pmidCount(this.filterParams);

    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      console.log("eventData: ", data);
      if (data === undefined) { // data=undefined true when apply filter from side panel
        // this.hideCardBody = true;
        this.filterParams = this.globalVariableService.getFilterParams();
        this.pmidCount(this.filterParams);
        console.log("new Filters for articles: ", this.filterParams);
      }
    });
  }

  pmidCount(params: any) {
    if (params.source_node != undefined) {
      this.graphLoader = true;
      this._RDS.pmid_count_gene_disease(params).subscribe(
        (data: any) => {

          this.result = data;
          this.eventIntensityGraph = this.result.nodeSelectsRecords;
          this.drawAreaChart();
        },
        (error: any) => {
          console.error(error)
          this.errorMsg = error;
        },
        () => {
          this.graphLoader = false;
        }
      );
    }
  }

  drawAreaChart() {

//    console.log("In drawAreaChart");
  //  console.log(this.data);

    this.pmid_Count = [];
    this.graphDateCategory = [];

    this.eventIntensityGraph.forEach((element: any) => {
      var dateCat = element.publication_date;
      console.log("dateCat: ", dateCat);

      this.pmid_Count.push({
        'y': parseFloat(element.count),
        // 'date': element.yr,
//        toolTipText: '<table style="border: 1; border-color: #D0021B;" cellspacing="2" cellpadding="2"><tr><td style="font-size:12px;">Date Quarter: </td><td style="font-size:11px;">' + dateCat + '</td></tr><tr><td style="font-size:12px; color: #B9D4F4;"><strong>Event Count:</strong> </td><td style="font-size:11px; color: #B9D4F4;"><strong>' + element.count_events + '</strong></td></tr><tr><td style="font-size:12px; color: #FADC7B;"><strong>Average Intensity: </strong></td><td style="font-size:11px; color: #FADC7B;"><strong>' + parseFloat(Highcharts.numberFormat(element.avg_intensity, 2)) + '</strong></td></tr></table>',
      });
      this.graphDateCategory.push(dateCat);
    });

    // let categories: any[] = [];
    // for (let i = 0; i < this.data.length; i++) {
    //   categories.push(this.data[i]['node_node_relation_types']);

    // }

    this.chartOptions = {
      chart: {
        type: 'areaspline'
      },
      title: {
        text: 'Count of PMID with Relevant Genes or Diseases'
      },
      subtitle: {
        style: {
          position: 'absolute',
          right: '0px',
          bottom: '10px'
        }
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 150,
        y: 100,
        floating: true,
        borderWidth: 1,
        backgroundColor: '#FFFFFF'
      },
      xAxis: {
        categories: this.graphDateCategory
      },
      yAxis: {
        title: {
          text: 'Distinct values of PMID'
        }
      },
      tooltip: {
        shared: true,
        valueSuffix: ' units'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.5
        }
      },
      series: [
        {
          name: 'Distinct values of PMID',
          data: this.pmid_Count
        },

      ]


    };
    this.graphLoader = false;

  };

}