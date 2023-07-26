import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RelationDistributionService } from '../services/relation-distribution.service';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import * as Highcharts from 'highcharts';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-distribution-by-rel-grp',
  templateUrl: './distribution-by-rel-grp.component.html',
  styleUrls: ['./distribution-by-rel-grp.component.scss']
})
export class DistributionByRelGrpComponent implements OnInit {
  data: any;
  errorMsg: string | undefined;
  graphLoader: boolean = true;
  private filterParams: any;
  loadingChart: boolean = false;

  @Input() ProceedDoFilterApply?: Subject<any>; //# Input for ProceedDoFilter is getting from clinical details html 

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _RDS: RelationDistributionService,
    private globalVariableService: GlobalVariableService,
  ) { }

  ngOnInit(): void {
    this.filterParams = this.globalVariableService.getFilterParams();

    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      console.log("data2: ", data);
      if (data === undefined) { // data=undefined true when apply filter from side panel
        this.filterParams = this.globalVariableService.getFilterParams();
        this.getDistributionByRelGroup(this.filterParams);
        console.log("new Filters by rel group charts: ", this.filterParams);
      }
    });
    this.getDistributionByRelGroup(this.filterParams);

  }

  getDistributionByRelGroup(_filterParams: any) {
    if (_filterParams.source_node != undefined) {

      console.log("new Filters by rel group charts IN: ", this.filterParams);
      this.loadingChart = true;

      this._RDS.distribution_by_relation_grp(this.filterParams).subscribe(
        (response: any) => {
          this.data = response.nodeSelectsRecords;
          this.drawColumnChart();
        },
        (error: any) => {
          console.error(error)
          this.errorMsg = error;
          this.loadingChart = false;
        },
        () => {
          this.loadingChart = false;
        }
      );
    }
  }

  drawColumnChart() {
    let graphData: any[] = [];
    console.log(this.data);
    //console.log(this.data[4]['count']);
    for (let i = 0; i < this.data.length; i++) {
      graphData.push([this.data[i]['grouped_edge_types_name'], this.data[i]['count']]);
    }
    console.log(graphData)
    Highcharts.chart('container', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Distribution by Relation Group'
      },
      subtitle: {
        //text: 'EvolverAI'
      },
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Article Count'
        },
        stackLabels: {
          //defer: false,
          crop: false,
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: 'black'
          }
        }
      },
      legend: {
        enabled: true,

      },
      tooltip: {
        pointFormat: 'Count: <b>{point.y} </b>'
      },
      series: [{
        name: 'Relation Group',
        colors: [
          '#046EB5'
        ],
        type: 'column',
        data: graphData,
        colorByPoint: true,
        dataLabels: {
          enabled: true,
          crop: false,
          overflow: 'allow',
          rotation: 360,
          //color: '#3066C4',
          align: 'center',
          format: '{point.y}', // one decimal {point.y:.1f}
          y: 10, // 10 pixels down from the top
          style: {
            fontSize: '13px',
            //fontFamily: 'Verdana, sans-serif'
          }
        },
        accessibility: {
          enabled: false
        },

      }],

    });
    this.graphLoader = false;
  }
}
