import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RelationDistributionService } from '../services/relation-distribution.service';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import * as Highcharts from 'highcharts';
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);
import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);
import { Subject, BehaviorSubject } from 'rxjs';
import { NodeSelectsService } from '../services/common/node-selects.service';

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
  loadingMessage: boolean = true;
  noDataFound: boolean = false;
  // Highcharts: typeof Highcharts = Highcharts;
  highcharts = Highcharts;
  chartOptions: any;
  dataEdgeNames: any = [];


  categories: any = [];
  graphData: any = [];
  drillDownData: any = [];
  drillDownDataFinal: any = [];

  public edgeTypesFirst: any = [];
  // public edgeTypes: any = [];
  private result: any = [];
  public selectedEdgeTypes: any = [];
  public selectedEdgeTypesByGroup: any = [];

  @Input() ProceedDoFilterApply?: Subject<any>; //# Input for ProceedDoFilter is getting from clinical details html 

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _RDS: RelationDistributionService,
    private globalVariableService: GlobalVariableService,
    private nodeSelectsService: NodeSelectsService,
  ) { }

  ngOnInit(): void {
    this.filterParams = this.globalVariableService.getFilterParams();


    this.nodeSelectsService.getEdgeTypeFirst()
      .subscribe(
        data => {
          this.result = data;
          this.edgeTypesFirst = this.result.edgeTypeFirstRecords;
          console.log("edge Types First: ", this.edgeTypesFirst);
        });

    this.ProceedDoFilterApply?.subscribe(data => {  // Calling from details, details working as mediator
      // console.log("data2: ", data);
      if (data === undefined) { // data=undefined true when apply filter from side panel
        this.filterParams = this.globalVariableService.getFilterParams();
        this.getDistributionByRelGroup(this.filterParams);
        console.log("new Filters by rel group charts: ", this.filterParams);
      }
    });
    this.getDistributionByRelGroup(this.filterParams);
  }

  getDistributionByRelGroup(_filterParams: any) {

    // if ((_filterParams.source_node != undefined && _filterParams.nnrt_id2 == undefined) || (_filterParams.nnrt_id2 != undefined && _filterParams.source_node2!=undefined)) {

    if ((_filterParams.source_node != undefined && _filterParams.nnrt_id2 == undefined && _filterParams.source_node2 == undefined) || ((_filterParams.nnrt_id2 != undefined && _filterParams.nnrt_id2 != "") && _filterParams.source_node2 != undefined)) {
      console.log("new Filters by rel group charts IN: ", this.filterParams);
      this.loadingChart = true;
      this.noDataFound = false;

      this._RDS.distribution_by_relation_grp(this.filterParams).subscribe(
        (response: any) => {
          this.data = response.nodeSelectsRecords;
        },
        (error: any) => {
          console.error(error)
          this.errorMsg = error;
          // this.loadingChart = false;
        },
        () => {
          // this.loadingChart = false;

          //HERE add the data
          this.graphData = [];
          this.categories = [];

          this.drillDownData = [];
          this.drillDownDataFinal = [];

          console.log("relGroupData: ", this.data);
          //console.log(this.data[4]['count']);
          for (let i = 0; i < this.data.length; i++) {
            this.categories.push(this.data[i]['grouped_edge_types_name']);
            // graphData.push([this.data[i]['grouped_edge_types_name'], this.data[i]['count']]);
            this.graphData.push({ name: this.data[i]['grouped_edge_types_name'], y: this.data[i]['count'], drilldown: this.data[i]['edge_group_id'] });

            ////////////////// Here get the edge type name on the basis of edge group id ///////////////////////

            // Pass edge group id and return edge_type_id to mapping with edge and edge group
            this.selectedEdgeTypesByGroup.push(this.data[i]['edge_group_id']);

            this.selectedEdgeTypes = this.edgeTypesFirst.filter((item: any) => (
              this.selectedEdgeTypesByGroup.includes(item.edge_group_id)
            )).map((item: any) => item.edge_type_id)
            console.log("selected Edge Types", this.selectedEdgeTypes);
            // console.log("selectedEdgeTypesName: ", this.selectedEdgeTypesNames);

            this.filterParams = this.globalVariableService.getFilterParams({ "edge_type_id_selected": this.selectedEdgeTypes});
            this._RDS.distribution_by_relation_grp_get_edge_type_drilldown(this.filterParams).subscribe(
              (response: any) => {
                this.dataEdgeNames = response.edgeNamesDrillDown;
                console.log("names: ", this.dataEdgeNames);

                for (let j = 0; j < this.dataEdgeNames.length; j++) {
                  this.drillDownData.push([this.dataEdgeNames[j]['edge_types_name'], this.dataEdgeNames[j]['count']]);
                }

                this.drillDownDataFinal.push({ id: this.data[i]['edge_group_id'], data: this.drillDownData });
                // console.log("drillDownDataFinal1: ", this.drillDownDataFinal);
                this.drillDownData = [];

                if (this.data.length == i + 1) {
                  this.loadingChart = false;
                  this.loadingMessage = false;
                  console.log("graphdataHere: ", this.graphData)
                  console.log("drillDownDataFinal2: ", this.drillDownDataFinal)
                  this.drawColumnChart();
                } else {
                  console.log("else here");
                }
              }
            );

            this.selectedEdgeTypesByGroup = [];
            // this.drillDownDataFinal = [];
            //////////////////////// End get the edge type name on the basis of edge group id /////////////////////////////
          }



        }
      );
    } else if (_filterParams.source_node != undefined) {
      console.log("Please choose source node level 2");
      this.noDataFound = true;
    }
  }

  drawColumnChart() {


    // Highcharts.chart('container', {
    //   chart: {
    //     type: 'column'
    //   },
    //   title: {
    //     text: 'Distribution by Relation Group'
    //   },
    //   subtitle: {
    //     //text: 'EvolverAI'
    //   },
    //   xAxis: {
    //     categories: categories,
    //     labels: {
    //       rotation: -45,
    //       style: {
    //         fontSize: '13px',
    //         fontFamily: 'Verdana, sans-serif'
    //       }
    //     }
    //   },
    //   yAxis: {
    //     type: 'logarithmic',
    //     title: {
    //       text: 'Article Count'
    //     },
    //     stackLabels: {
    //       //defer: false,
    //       crop: false,
    //       enabled: true,
    //       style: {
    //         fontWeight: 'bold',
    //         color: 'black'
    //       }
    //     }
    //   },
    //   plotOptions: {
    //     column: {
    //       stacking: "normal"
    //     }
    //   },
    //   legend: {
    //     enabled: true,

    //   },
    //   tooltip: {
    //     pointFormat: 'Count: <b>{point.y} </b>'
    //   },
    //   series: [{
    //     name: 'Relation Group',
    //     colors: [
    //       '#046EB5'
    //     ],
    //     type: 'column',
    //     data: graphData,
    //     colorByPoint: true,
    //     dataLabels: {
    //       enabled: true,
    //       crop: false,
    //       overflow: 'allow',
    //       rotation: 360,
    //       //color: '#3066C4',
    //       align: 'center',
    //       format: '{point.y}', // one decimal {point.y:.1f}
    //       y: 10, // 10 pixels down from the top
    //       style: {
    //         fontSize: '13px',
    //         //fontFamily: 'Verdana, sans-serif'
    //       }
    //     },
    //     accessibility: {
    //       enabled: false
    //     },

    //   }],

    // });

    this.chartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Distribution by Relation Group'
      },
      xAxis: {
        type: 'category',
        // categories: this.categories,
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      yAxis: {
        type: 'logarithmic',
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
      plotOptions: {
        column: {
          stacking: "normal"
        }
      },
      legend: {
        enabled: true,

      },
      tooltip: {
        pointFormat: 'Count: <b>{point.y} </b>'
      },

      series: [{
        name: 'Home',
        colorByPoint: true,
        type: 'column',
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

        // data: [
        //     {name: 'DISTANT RELATION', y: 145, drilldown: 'DISTANT RELATION'},
        //     {name: 'MUTATION', y: 3, drilldown: 'MUTATION'},
        //     {name: 'ACTIVATION', y: 1, drilldown: 'ACTIVATION'},
        //     {name: 'INHIBITION', y: 1, drilldown: 'INHIBITION'},
        //     {name: 'REGULATES_OR_MODULATE', y: 1, drilldown: 'REGULATES_OR_MODULATE'}
        // ]
        data: this.graphData
      }],
      drilldown: {

        // series: [{id: 'Distant Relation', data: ['Distant Relation', 11]},
        // {id: 'MUTATION', data: [['MUTATION', 1],['MUTATION_LEAD_TO_CAUSES', 12]]},
        // {id: 'ACTIVATION', data: [['ACTIVATION', 11], ['ACTIVATION_LEAD_TO_ACTIVATION', 12], ['ACTIVATION_LEAD_TO_INHIBITION', 13], ['ACTIVATION_LEAD_TO_TREATS', 14], ['ACTIVATION_LEAD_TO_CAUSES', 15]] },
        // {id: 'INHIBITION', data: [['INHIBITION', 21],['INHIBITION_LEAD_TO_INHIBITION', 22], ['INHIBITION_LEAD_TO_ACTIVATION', 23], ['INHIBITION_LEAD_TO_CAUSES', 24],['INHIBITION_LEAD_TO_TREATS', 25]]},
        // {id: 'REGULATES_OR_MODULATE', data: [['REGULATES_OR_MODULATE', 31], ['POSSIBLE_SYNONYM', 32]]}]
        series: this.drillDownDataFinal
      }
    };
    this.graphLoader = false;
  }
}
