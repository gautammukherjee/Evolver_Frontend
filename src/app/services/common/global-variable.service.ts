import { Component, Injectable, OnInit } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GlobalVariableService {

  constructor() { }
  errors = {
    dbTableColumnError: 'DataBase Table Structure Got Changed...Will Update Soon. ',
    dbConnectionTerminated: 'DataBaseConnection Terminated Unexpectedly'
  };

  // selectedTa = this.configureTAID();
  selectedTa = [];
  selectedNewsType = [];
  // defaultTAID: any;
  selectedDefaultTasWithName: any = [];

  filterParams = {};
  selectedIndication = [];
  selectedCompany = [];
  selectedDevelopment = [];
  selectedDrug = [];
  selectedNodeSelects = '';
  selectedNodeSelects2 = '';
  selectedSourceNodes = [];
  selectedSourceNodes2 = [];
  selectedDestinationNodes = [];
  selectedDestinationNodes2 = [];
  selectedAllDestinationNodes: number = 0;
  selectedAllDestinationNodes2: number = 0;
  selectedEdgeTypes = [];
  selectedEdgeTypes2 = [];
  selectedAllForCTDestinationNodes = [];

  selectedNodes = [];
  selectedEdges: any;
  selectedMapsType: any;
  selectedTabsType: any;


  selectedChooseDate = [];

  public initFromDate = { month: ((new Date()).getMonth() + 1), day: ((new Date()).getDate()), year: ((new Date()).getFullYear() - 1) };
  public initToDate = { month: ((new Date()).getMonth() + 1), day: ((new Date()).getDate()), year: ((new Date()).getFullYear()) };
  // public initFromDate = (((new Date()).getFullYear() - 5) + '-' + ((new Date()).getMonth() + 1) + '-' + (new Date()).getDate());
  // public initToDate = ((new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1) + '-' + (new Date()).getDate());

  fromDate = this.initFromDate;
  toDate = this.initToDate;

  // configureTAID() {
  //   this.defaultTAID = parseInt(localStorage.getItem('selectedDefaultTA') || '{}');
  //   return [this.defaultTAID];
  // }

  setFromDate(from_date: any) {
    this.fromDate = from_date;
  }
  getFromDate() {
    // return this.fromDate;
    return this.fromDate.month + '-' + this.fromDate.day + '-' + this.fromDate.year;
  }
  setToDate(to_date: any) {
    this.toDate = to_date;
  }
  getToDate() {
    // return this.toDate;
    return this.toDate.month + '-' + this.toDate.day + '-' + this.toDate.year;
  }
  setSelectedNodeSelects(nodes: any) {
    this.selectedNodeSelects = nodes;
  }
  getSelectedNodeSelects() {
    return this.selectedNodeSelects;
  }

  setSelectedNodeSelects2(nodes2: any) {
    this.selectedNodeSelects2 = nodes2;
  }
  getSelectedNodeSelects2() {
    return this.selectedNodeSelects2;
  }

  setSelectedSourceNodes(source_nodes: any) {
    this.selectedSourceNodes = source_nodes;
  }
  getSelectedSourceNodes() {
    return this.selectedSourceNodes;
  }

  setSelectedSourceNodes2(source_nodes2: any) {
    this.selectedSourceNodes2 = source_nodes2;
  }
  getSelectedSourceNodes2() {
    return this.selectedSourceNodes2;
  }

  setSelectedDestinationNodes(destination_nodes: any) {
    this.selectedDestinationNodes = destination_nodes;
  }
  getSelectedDestinationNodes() {
    return this.selectedDestinationNodes;
  }

  setSelectedDestinationNodes2(destination_nodes2: any) {
    this.selectedDestinationNodes2 = destination_nodes2;
  }
  getSelectedDestinationNodes2() {
    return this.selectedDestinationNodes2;
  }

  setSelectedAllDestinationNodes(val: number) {
    this.selectedAllDestinationNodes = val;
  }
  getSelectedAllDestinationNodes() {
    return this.selectedAllDestinationNodes;
  }

  setSelectedAllForCTDestinationNodes(filteredData: any) {
    this.selectedAllForCTDestinationNodes = filteredData;
  }
  getSelectedAllForCTDestinationNodes() {
    return this.selectedAllForCTDestinationNodes;
  }


  setSelectedEdgeTypes(edge_types: any) {
    this.selectedEdgeTypes = edge_types;
  }
  getSelectedEdgeTypes() {
    return this.selectedEdgeTypes;
  }
  setSelectedEdgeTypes2(edge_types2: any) {
    this.selectedEdgeTypes2 = edge_types2;
  }
  getSelectedEdgeTypes2() {
    return this.selectedEdgeTypes2;
  }

  setSelectedNodes(nodes: any) {
    this.selectedNodes = nodes;
  }
  getSelectedNodes() {
    return this.selectedNodes;
  }
  setSelectedEdges(edge_select: any) {
    this.selectedEdges = edge_select;
  }
  getSelectedEdges() {
    return this.selectedEdges;
  }

  setMapsSelected(mapType: any) {
    this.selectedMapsType = mapType;
  }
  getMapsSelected() {
    return this.selectedMapsType;
  }

  setTabsSelected(tabType: any) {
    this.selectedTabsType = tabType;
  }
  getTabsSelected() {
    return this.selectedTabsType;
  }

  getFilterParams(mergeParam = {}) {  // Use of parameter is for if someone wants to pass filter params custom,
    this.filterParams = {
      from_date: this.getFromDate(),
      to_date: this.getToDate(),
      nnrt_id: this.getSelectedNodeSelects() != undefined ? this.getSelectedNodeSelects() : 2,
      nnrt_id2: this.getSelectedNodeSelects2() != undefined ? this.getSelectedNodeSelects2() : undefined,
      source_node: this.getSelectedSourceNodes().length > 0 ? this.getSelectedSourceNodes() : undefined,
      source_node2: this.getSelectedSourceNodes2().length > 0 ? this.getSelectedSourceNodes2() : undefined,
      destination_node: this.getSelectedDestinationNodes().length > 0 ? this.getSelectedDestinationNodes() : undefined,
      destination_node2: this.getSelectedDestinationNodes2().length > 0 ? this.getSelectedDestinationNodes2() : undefined,
      destination_node_all: this.getSelectedAllDestinationNodes() == 1 ? this.getSelectedAllDestinationNodes() : 0,
      // destination_node2_all: this.getSelectedAllDestinationNodes2() != undefined ? this.getSelectedAllDestinationNodes2() : 0,
      edge_type_id: this.getSelectedEdgeTypes().length > 0 ? this.getSelectedEdgeTypes() : undefined,
      edge_type_id2: this.getSelectedEdgeTypes2().length > 0 ? this.getSelectedEdgeTypes2() : undefined,


      node_id: this.getSelectedNodes().length > 0 ? this.getSelectedNodes() : undefined,
      edge_select: this.getSelectedEdges() != undefined ? this.getSelectedEdges() : 1,
      mapType: this.getMapsSelected() != undefined ? this.getMapsSelected() : 'default',
      tabType: this.getTabsSelected() != undefined ? this.getTabsSelected() : 'default',
      destination_node_all_for_ct: this.getSelectedAllForCTDestinationNodes().length > 0 ? this.getSelectedAllForCTDestinationNodes() : undefined
    };
    return Object.assign(mergeParam, this.filterParams);
  }

  resetfilters() {
    // this.setSelectedNodeSelects(2);
    this.setSelectedSourceNodes([]);
    this.setSelectedSourceNodes2([]);
    this.setSelectedDestinationNodes([]);
    this.setSelectedNodeSelects2(undefined);
    this.setSelectedEdgeTypes([]);
    this.setSelectedEdgeTypes2([]);
  }

  resetfiltersForLevel2() {
    this.setSelectedNodeSelects2(undefined);
    this.setSelectedSourceNodes2([]);
    this.setSelectedDestinationNodes2([]);
    this.setSelectedEdgeTypes2([]);
  }

  resetNode() {
    this.setSelectedNodes([]);
  }

  resetSourceNode2() {
    this.setSelectedSourceNodes2([]);
  }
  resetDestinationNode2() {
    this.setSelectedDestinationNodes2([]);
  }

  resetfiltersInner() {
  }

  resetfiltersTA() {
    // this.setSelectedTextSearch(undefined);
  }
}
