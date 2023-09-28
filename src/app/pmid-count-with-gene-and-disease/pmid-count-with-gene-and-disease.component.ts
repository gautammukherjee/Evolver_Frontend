import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RelationDistributionService } from '../services/relation-distribution.service';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import * as Highcharts from 'highcharts';
import { Subject, forkJoin } from 'rxjs';

@Component({
  selector: 'app-pmid-count-with-gene-and-disease',
  templateUrl: './pmid-count-with-gene-and-disease.component.html',
  styleUrls: ['./pmid-count-with-gene-and-disease.component.scss']
})
export class PmidCountWithGeneAndDiseaseComponent implements OnInit {
  //data: any = {};
  result: any = {};
  errorMsg: string | undefined;
  graphLoader: boolean = false;
  byDefault: boolean = false;
  private filterParams: any;
  highcharts = Highcharts;
  chartOptions: any;
  pmidCountGraph: any = [];
  pmidCountGraphFinal: any = [];
  pmid_Count: any = [];
  public graphDateCategory: any = [];
  datCatQuarter: any;
  noDataFound: boolean = false;

  firstLoadApiResult: any;
  secondLoadApiResult: any;
  masterListsDataCountGraph: any = [];
  masterListsDataDetailsLevelOne: any = [];
  masterListsDataDetailsLevelTwo: any = [];

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
        console.log("new Filters for article count: ", this.filterParams);
      }
    });
  }

  pmidCount(_filterParams: any) {

    // if ((_filterParams.source_node != undefined && _filterParams.nnrt_id2 == undefined && _filterParams.source_node2 == undefined) || ((_filterParams.nnrt_id2 != undefined && _filterParams.nnrt_id2 != "") && _filterParams.source_node2 != undefined)) {
    if ((_filterParams.source_node != undefined && _filterParams.nnrt_id2 == undefined && _filterParams.source_node2 == undefined && _filterParams.destination_node2 == undefined) ||
      (_filterParams.source_node2 != undefined && _filterParams.nnrt_id2 != undefined)) {
      console.log("Rel group charts IN: ", this.filterParams);

      this.graphLoader = true;
      this.noDataFound = false;

      if (_filterParams.nnrt_id != undefined) {

        const firstAPIs = this._RDS.pmid_count_gene_disease_revamp_level_one(this.filterParams);
        let combinedDataAPI;
        if (_filterParams.nnrt_id2 != undefined) {
          const secondAPI = this._RDS.pmid_count_gene_disease_revamp_level_two(this.filterParams);
          combinedDataAPI = [firstAPIs, secondAPI];
        } else {
          combinedDataAPI = [firstAPIs];
        }

        forkJoin(combinedDataAPI) //we can use more that 2 api request 
          .subscribe(
            result => {
              console.log("you load here: ", result);
              //this will return list of array of the result
              this.firstLoadApiResult = result[0];
              this.secondLoadApiResult = result[1];
              console.log("first Load Api Result: ", this.firstLoadApiResult);
              console.log("second Load Api Result: ", this.secondLoadApiResult);

              ////////// **************** Merging the data into one place *******************////////////////              
              this.masterListsDataDetailsLevelOne = this.firstLoadApiResult.nodeSelectsRecords;
              this.masterListsDataCountGraph = this.masterListsDataDetailsLevelOne;
              console.log("First Level Data: ", this.masterListsDataCountGraph);
              let firstLevelDataStore = this.masterListsDataDetailsLevelOne; //Store the First level data

              //Second Degree Data
              if (this.secondLoadApiResult != undefined) {
                //Second level data and Combined data first and second level
                this.masterListsDataDetailsLevelTwo = this.secondLoadApiResult.nodeSelectsRecords2;
                console.log("Second Level Data: ", this.masterListsDataDetailsLevelTwo);

                this.masterListsDataCountGraph = [].concat(firstLevelDataStore, this.masterListsDataDetailsLevelTwo);
                console.log("Combined Data Load: ", this.masterListsDataCountGraph);
              }

              this.pmidCountGraph = [];
              this.masterListsDataCountGraph.forEach((event: any) => {
                this.pmidCountGraph.push({
                  count: event.count,
                  publication_date: event.publication_date,
                  date: new Date(event.publication_date)
                });
              });
              this.pmidCountGraph.sort((a: any, b: any) => a.date - b.date);
              console.log("pmidCountGraph2: ", this.pmidCountGraph);

              //Combined the two array with unique publication date and sum the count values
              this.pmidCountGraphFinal = this.pmidCountGraph.reduce((acc:any, ele:any) => {
                const existingPMIDCount = acc.find((x:any) => x.publication_date === ele.publication_date);
                if(!existingPMIDCount) return acc.concat(ele);
                return (existingPMIDCount.count += ele.count, acc);
              },[])
              console.log("response: ", this.pmidCountGraphFinal);
              
              this.drawAreaChart();

              // this._RDS.pmid_count_gene_disease_revamp_level_one(_filterParams).subscribe(
              //   (data: any) => {
              //     this.result = data;
              //     this.pmidCountGraph = this.result.nodeSelectsRecords;
              //     // console.log("pmid count: ", this.pmidCountGraph.length);
              //     this.drawAreaChart();
              //   },
              //   (error: any) => {
              //     console.error(error)
              //     this.errorMsg = error;
              //   },
              //   () => {
              //     this.graphLoader = false;
              //   }
              // );
            });
      }
    }
    else if (_filterParams.source_node != undefined) {
      console.log("Please choose source node level 2");
      this.noDataFound = true;
    }
  }

  drawAreaChart() {

    //    console.log("In drawAreaChart");
    //  console.log(this.data);

    this.pmid_Count = [];
    this.graphDateCategory = [];

    this.pmidCountGraphFinal.forEach((element: any) => {
      var dateCat = element.publication_date;
      // console.log("dateCat: ", dateCat);

      let quarterSplit = dateCat.split(' ');
      let quarterSplitDate = quarterSplit[0].split('-');
      // console.log('urlSegments2: ', quarterSplitDate);

      switch (quarterSplitDate[1]) {
        case '01':
          this.datCatQuarter = "Q1";
          break;
        case '04':
          this.datCatQuarter = "Q2";
          break;
        case '07':
          this.datCatQuarter = "Q3";
          break;
        default:
          this.datCatQuarter = "Q4";
          break;
      }
      var dateQuarter = this.datCatQuarter + " - " + quarterSplitDate[0];
      this.pmid_Count.push({
        'y': parseFloat(element.count),
        //'date': dateQuarter, toolTipText: '<table style="border: 1; border-color: #D0021B;" cellspacing="2" cellpadding="2"><tr><td style="font-size:12px;">Date Quarter: </td><td style="font-size:11px;">' + dateCat + '</td></tr><tr><td style="font-size:12px; color: #B9D4F4;"><strong>Event Count:</strong> </td><td style="font-size:11px; color: #B9D4F4;"><strong>' + element.count + '</strong></td></tr></table>',
      });
      this.graphDateCategory.push(dateQuarter);
    });

    this.chartOptions = {
      chart: {
        type: 'areaspline'
      },
      title: {
        // text: 'Count of PMID with Relevant Genes or Diseases'
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
        //verticalAlign: 'top',
        x: 150,
        y: 100,
        floating: true,
        borderWidth: 1,
        backgroundColor: '#FFFFFF'
      },
      xAxis: {
        title: {
          text: 'Publication Date'
        },
        categories: this.graphDateCategory
      },
      yAxis: {
        title: {
          text: 'Distinct values of PMID'
        }
      },
      tooltip: {
        shared: true,
        valueSuffix: ''
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