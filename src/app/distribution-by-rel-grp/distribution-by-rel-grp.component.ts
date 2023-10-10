import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RelationDistributionService } from '../services/relation-distribution.service';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import * as Highcharts from 'highcharts';
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);
import highcharts3D from 'highcharts/highcharts-3d';
highcharts3D(Highcharts);
import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);
import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { NodeSelectsService } from '../services/common/node-selects.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-distribution-by-rel-grp',
  templateUrl: './distribution-by-rel-grp.component.html',
  styleUrls: ['./distribution-by-rel-grp.component.scss']
})
export class DistributionByRelGrpComponent implements OnInit {
  data: any;
  errorMsg: string | undefined;
  graphLoader: boolean = true;
  graphLoaderDrill: boolean = false;
  private filterParams: any;
  loadingChart: boolean = false;
  loadingMessage: boolean = true;
  noDataFound: boolean = false;
  // Highcharts: typeof Highcharts = Highcharts;
  highcharts = Highcharts;
  chartOptions: any;
  dataEdgeNames: any = [];
  dataEdgeNamesFull: any = [];
  dataEdgeNamesFinal: any = [];

  categories: any = [];
  categories2: any = [];
  graphData: any = [];
  graphData2: any = [];
  drillDownData: any = [];

  firstLoadApiResult: any;
  secondLoadApiResult: any;
  firstLoadDrillApiResult: any;
  secondLoadDrillApiResult: any;
  masterListsDataEdgeGraph: any = [];
  masterListsDataEdgeGraphs: any = [];
  masterListsDataEdgeGraphFinal: any = [];
  masterListsDataDetailsLevelOne: any = [];
  masterListsDataDetailsLevelTwo: any = [];
  masterListsDrillDataDetailsLevelOne: any = [];
  masterListsDrillDataDetailsLevelTwo: any = [];


  public edgeTypesFirst: any = [];
  // public edgeTypes: any = [];
  private result: any = [];
  public selectedEdgeTypes: any = [];
  public selectedEdgeTypesByGroup: any = [];
  public selectedEdgeTypesByGroups: any = [];

  public alpha: number = 1;
  public beta: number = 1;
  public depth: number = 1;
  private modalRef: any;

  @ViewChild('showPopupEvent', { static: false }) show_popup_event: ElementRef | any;

  @Input() ProceedDoFilterApply?: Subject<any>; //# Input for ProceedDoFilter is getting from clinical details html 

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _RDS: RelationDistributionService,
    private globalVariableService: GlobalVariableService,
    private nodeSelectsService: NodeSelectsService,
    private modalService: NgbModal,
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
    if ((_filterParams.source_node != undefined && _filterParams.nnrt_id2 == undefined && _filterParams.source_node2 == undefined && _filterParams.destination_node2 == undefined) ||
      (_filterParams.source_node2 != undefined && _filterParams.nnrt_id2 != undefined)) {
      console.log("new Filters by rel group charts IN: ", this.filterParams);
      this.loadingChart = true;
      this.noDataFound = false;

      if (_filterParams.nnrt_id != undefined) {

        const firstAPIs = this._RDS.distribution_by_relation_grp_level_one(this.filterParams);
        let combinedDataAPI;
        if (_filterParams.nnrt_id2 != undefined) {
          const secondAPI = this._RDS.distribution_by_relation_grp_level_two(this.filterParams);
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
              this.masterListsDataEdgeGraph = this.masterListsDataDetailsLevelOne;
              console.log("First Level Data: ", this.masterListsDataEdgeGraph);
              let firstLevelDataStore = this.masterListsDataDetailsLevelOne; //Store the First level data

              //Second Degree Data
              if (this.secondLoadApiResult != undefined) {
                //Second level data and Combined data first and second level
                this.masterListsDataDetailsLevelTwo = this.secondLoadApiResult.nodeSelectsRecords2;
                console.log("Second Level Data: ", this.masterListsDataDetailsLevelTwo);
                this.masterListsDataEdgeGraph = [].concat(firstLevelDataStore, this.masterListsDataDetailsLevelTwo);
              }
              console.log("Combined Data Load: ", this.masterListsDataEdgeGraph);


              this.masterListsDataEdgeGraphFinal = [...new Set(this.masterListsDataEdgeGraph.map((x: any) => x.grouped_edge_types_name))];
              console.log("masterListsDataEdgeGraphFinal: ", this.masterListsDataEdgeGraphFinal);

              this.categories = [];
              for (let i = 0; i < this.masterListsDataEdgeGraphFinal.length; i++) {
                this.categories.push(this.masterListsDataEdgeGraphFinal[i]);

                
              }
              console.log("categories: ", this.categories);

              //First Degree
              this.graphData = [];
              for (let i = 0; i < this.masterListsDataDetailsLevelOne.length; i++) {
                this.graphData.push(this.masterListsDataDetailsLevelOne[i]['pmids']);
              }
              console.log("graphData1: ", this.graphData);

              //Second Degree
              this.graphData2 = [];
              for (let i = 0; i < this.masterListsDataDetailsLevelTwo.length; i++) {
                // this.categories.push(this.masterListsDataDetailsLevelTwo[i]['grouped_edge_types_name']);
                this.graphData2.push(this.masterListsDataDetailsLevelTwo[i]['pmids']);
              }
              console.log("graphData2: ", this.graphData2);


              // this.masterListsDataEdgeGraphs = [];
              // this.masterListsDataEdgeGraph.forEach((event: any) => {
              //   this.masterListsDataEdgeGraphs.push({
              //     pmids: event.pmids,
              //     edge_group_id: event.edge_group_id,
              //     grouped_edge_types_name: event.grouped_edge_types_name,
              //   });
              // });
              // console.log("masterListsDataEdgeGraphs: ", this.masterListsDataEdgeGraphs);

              // ////////////////// Here get the edge type name on the basis of edge group id ///////////////////////
              //Combined the two array with unique edge_group_id and sum the pmid values
              // this.masterListsDataEdgeGraphFinal = this.masterListsDataEdgeGraphs.reduce((acc2: any, ele2: any) => {
              //   const existingEdgeGroupCount = acc2.find((xx: any) => xx.edge_group_id === ele2.edge_group_id);
              //   if (!existingEdgeGroupCount) return acc2.concat(ele2);
              //   return (existingEdgeGroupCount.pmids += ele2.pmids, acc2);
              // }, [])
              // console.log("response: ", this.masterListsDataEdgeGraphFinal);              

              // this.graphData = [];
              // for (let i = 0; i < this.masterListsDataEdgeGraphFinal.length; i++) {
              //   this.categories.push(this.masterListsDataEdgeGraphFinal[i]['grouped_edge_types_name']);
              //   // graphData.push([this.masterListsDataEdgeGraphFinal[i]['grouped_edge_types_name'], this.masterListsDataEdgeGraphFinal[i]['pmids']]);
              //   this.graphData.push({ name: this.masterListsDataEdgeGraphFinal[i]['grouped_edge_types_name'], y: this.masterListsDataEdgeGraphFinal[i]['pmids'], edge_group_id: this.masterListsDataEdgeGraphFinal[i]['edge_group_id'] });
              // }

              this.loadingChart = false;
              this.loadingMessage = false;
              console.log("graphdataHere: ", this.graphData);
              this.drawColumnChart();

            },
            (error: any) => {
              console.error(error)
              this.errorMsg = error;
              // this.loadingChart = false;
            },
          );
      }
    } else if (_filterParams.source_node != undefined) {
      console.log("Please choose source node level 2");
      this.noDataFound = true;
    }
  }

  drawColumnChart() {
    Highcharts.chart('container', <any>{
      chart: {
        type: 'column',
        plotBorderWidth: 1,
        marginLeft: 250
      },
      title: {
        text: 'Distribution by Relation Group'
      },
      accessibility: {
        announceNewData: {
          enabled: true
        }
      },
      xAxis: {
        categories: this.categories,
        labels: {
          style: {
            fontSize: '11px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      yAxis: {
        type: 'logarithmic',
        title: {
          text: 'Article Count',
        },
      },
      legend: {
        enabled: false
      },
      tooltip: {
        format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
          'Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: "normal"
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y}'
          },
          cursor: 'pointer',
          point: {
            events: {
              click: (event: any) => {
                // console.log(event.point);
                this.modalRef = this.modalService.open(this.show_popup_event, { size: 'xl', keyboard: false, backdrop: 'static' });
                this.onRegionSelection(event);
              }
            }
          },
        }
      },
      // tooltip: {
      //   pointFormat: '<span style="color:{point.color}">Count</span>: <b>{point.y}</b>'
      // },
      // series: [{
      //   colorByPoint: true,
      //   data: this.graphData
      // }],

      series: [{
        name: 'Level1',
        data: this.graphData
      }, {
        name: 'Level2',
        data: this.graphData2
      }]

    });

    this.graphLoader = false;
  }

  onRegionSelection(event: any) {

    this.selectedEdgeTypesByGroups = [];
    this.graphLoaderDrill = true;

    this.selectedEdgeTypesByGroups.push(event.point.options.edge_group_id);
    console.log(this.selectedEdgeTypesByGroups);

    this.selectedEdgeTypes = this.edgeTypesFirst.filter((item: any) => (
      this.selectedEdgeTypesByGroups.includes(item.edge_group_id)
    )).map((item: any) => item.edge_type_id)
    console.log("selected Edge Types2", this.selectedEdgeTypes);

    // start here to get the drill down api
    this.filterParams = this.globalVariableService.getFilterParams({ "edge_type_id_selected": this.selectedEdgeTypes });

    const firstDrillAPIs = this._RDS.distribution_by_relation_grp_get_edge_type_drilldown_level_one(this.filterParams);
    let combinedDataDrillAPI;
    if (this.filterParams.nnrt_id2 != undefined) {
      const secondDrillAPIs = this._RDS.distribution_by_relation_grp_get_edge_type_drilldown_level_two(this.filterParams);
      combinedDataDrillAPI = [firstDrillAPIs, secondDrillAPIs];
    } else {
      combinedDataDrillAPI = [firstDrillAPIs];
    }

    forkJoin(combinedDataDrillAPI) //we can use more that 2 api request 
      .subscribe(
        result => {
          console.log("you load here: ", result);
          //this will return list of array of the result
          this.firstLoadDrillApiResult = result[0];
          this.secondLoadDrillApiResult = result[1];
          console.log("first Load Drill Api Result: ", this.firstLoadDrillApiResult);
          console.log("second Load Drill Api Result: ", this.secondLoadDrillApiResult);

          ////////// **************** Merging the data into one place *******************////////////////              
          this.masterListsDrillDataDetailsLevelOne = this.firstLoadDrillApiResult.edgeNamesDrillDown;
          this.dataEdgeNames = this.masterListsDrillDataDetailsLevelOne;
          console.log("First Level Data Drill: ", this.dataEdgeNames);
          let firstLevelDrillDataStore = this.masterListsDrillDataDetailsLevelOne; //Store the First level data

          //Second Degree Data
          if (this.secondLoadDrillApiResult != undefined) {
            //Second level data and Combined data first and second level
            this.masterListsDrillDataDetailsLevelTwo = this.secondLoadDrillApiResult.edgeNamesDrillDown2;
            console.log("Second Level Data Drill: ", this.masterListsDrillDataDetailsLevelTwo);
            this.dataEdgeNames = [].concat(firstLevelDrillDataStore, this.masterListsDrillDataDetailsLevelTwo);
          }
          console.log("Combined Data Load Drill: ", this.dataEdgeNames);

          this.dataEdgeNamesFull = [];
          this.dataEdgeNames.forEach((event: any) => {
            this.dataEdgeNamesFull.push({
              pmids: event.pmids,
              edge_type_id: event.edge_type_id,
              edge_types_name: event.edge_types_name,
              label: event.label,
            });
          });
          console.log("dataEdgeNamesFull: ", this.dataEdgeNamesFull);

          ////////////////// Here get the edge type name on the basis of edge edge_type_id ///////////////////////
          //Combined the two array with unique edge_type_id and sum the pmids values
          this.dataEdgeNamesFinal = this.dataEdgeNamesFull.reduce((acc2: any, ele2: any) => {
            const existingEdgeCount = acc2.find((xx: any) => xx.edge_type_id === ele2.edge_type_id);
            if (!existingEdgeCount) return acc2.concat(ele2);
            return (existingEdgeCount.pmids += ele2.pmids, acc2);
          }, [])
          console.log("response Drill: ", this.dataEdgeNamesFinal);

          this.drillDownData = [];
          for (let i = 0; i < this.dataEdgeNamesFinal.length; i++) {
            this.categories2.push(this.dataEdgeNamesFinal[i]['edge_types_name']);
            this.drillDownData.push({ name: this.dataEdgeNamesFinal[i]['edge_types_name'], y: this.dataEdgeNamesFinal[i]['pmids'], label: this.dataEdgeNamesFinal[i]['label'] });
          }

          this.loadingChart = false;
          console.log("drillDownData: ", this.drillDownData)
          this.drawColumnChartDrillDown();
        },
        err => {
          console.log(err.message);
          this.graphLoaderDrill = false;
        },
        () => {
          this.graphLoaderDrill = false;
        });

  }

  drawColumnChartDrillDown() {
    Highcharts.chart('container2', <any>{
      chart: {
        type: 'bar',
        plotBorderWidth: 1,
        marginLeft: 200
      },
      title: {
        text: 'Distribution by Relation Group'
      },
      accessibility: {
        announceNewData: {
          enabled: true
        }
      },
      xAxis: {
        type: 'category',
        labels: {
          style: {
            fontSize: '11px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      yAxis: {
        type: 'logarithmic',
        title: {
          text: 'Article Count',
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        column: {
          stacking: "normal"
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y}'
          }
        }
      },
      tooltip: {
        pointFormat: '<span style="color:{point.color}">Count</span>: <b>{point.y}</b>'
      },
      series: [{
        colorByPoint: true,
        data: this.drillDownData
      }],
    });
  }

}
