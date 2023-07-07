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
  selectedDestinationNodes = [];
  selectedEdgeTypes = [];
  selectedEdgeTypes2 = [];

  selectedNodes = '';
  selectedEdges: any;
  selectedMapsType: any;


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
  setSelectedDestinationNodes(destination_nodes: any) {
    this.selectedDestinationNodes = destination_nodes;
  }
  getSelectedDestinationNodes() {
    return this.selectedDestinationNodes;
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

  getFilterParams(mergeParam = {}) {  // Use of parameter is for if someone wants to pass filter params custom,
    this.filterParams = {
      from_date: this.getFromDate(),
      to_date: this.getToDate(),
      nnrt_id: this.getSelectedNodeSelects() != undefined ? this.getSelectedNodeSelects() : 1,
      nnrt_id2: this.getSelectedNodeSelects2() != undefined ? this.getSelectedNodeSelects2() : '',
      source_node: this.getSelectedSourceNodes().length > 0 ? this.getSelectedSourceNodes() : undefined,
      destination_node: this.getSelectedDestinationNodes().length > 0 ? this.getSelectedDestinationNodes() : undefined,
      edge_type_id: this.getSelectedEdgeTypes().length > 0 ? this.getSelectedEdgeTypes() : undefined,
      edge_type_id2: this.getSelectedEdgeTypes2().length > 0 ? this.getSelectedEdgeTypes2() : undefined,


      node_id: this.getSelectedNodes() != undefined ? this.getSelectedNodes() : undefined,
      edge_select: this.getSelectedEdges() != undefined ? this.getSelectedEdges() : 1,
      mapType: this.getMapsSelected() != undefined ? this.getMapsSelected() : 'default',
    };
    return Object.assign(mergeParam, this.filterParams);
  }

  resetfilters() {
    this.setSelectedNodeSelects(1);
    this.setSelectedSourceNodes([]);
    this.setSelectedDestinationNodes([]);
    this.setSelectedNodeSelects2(undefined);
    // this.setSelectedEdgeTypes([]);
    this.setSelectedEdgeTypes2([]);
  }

  resetfiltersInner() {
  }

  resetfiltersTA() {
    // this.setSelectedTextSearch(undefined);
  }
}
