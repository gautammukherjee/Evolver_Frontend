import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RelationDistributionService } from '../services/relation-distribution.service';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import * as Highcharts from 'highcharts';

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
  
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _RDS: RelationDistributionService,
    private globalVariableService: GlobalVariableService,
  ) { }

  ngOnInit(): void {
    this.filterParams = this.globalVariableService.getFilterParams();
    this._RDS.distribution_by_relation_grp(this.filterParams).subscribe(
      (response: any) => {
        this.data = response.nodeSelectsRecords;
        this.drawColumnChart();
      },
      (error: any) => { 
        //console.error(error)
        //this.errorMsg = error;
      }
    );

  }

  drawColumnChart() {
    let graphData:any[] = [];
    
    //console.log(this.data);
    //console.log(this.data[4]['count']);
    for(let i=0; i<this.data.length;i++){
      graphData.push([this.data[i]['Temp Edge Types_Name'],this.data[i]['count']]);
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
        text: 'EvolverAI'
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
          text: 'Count'
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        pointFormat: 'Name: <b>{point.y:.1f} millions</b>'
      },
      series: [{
        name: 'Population',
        colors: [
          '#046EB5'
        ],
        type: 'column',
        data: graphData,
        colorByPoint: true,
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          align: 'right',
          format: '{point.y:.1f}', // one decimal
          y: 10, // 10 pixels down from the top
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        },
        accessibility:{
          enabled:false
        },
        
      }],

    });
    this.graphLoader = false;
  }
}
