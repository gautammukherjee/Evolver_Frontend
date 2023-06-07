import { Component, OnChanges, Renderer, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import { DiseaseGeneNetworkmapService } from 'src/app/services/neuroscience/disease-gene-networkmap.service';

// import * as $ from 'jquery';
// declare var jQuery: any;

declare var cytoscape: any;
declare var require: any;
declare var jQuery: any;

var cytoscape = require('cytoscape');
var cyqtip = require('cytoscape-qtip');
cyqtip(cytoscape); // register extension

@Component({
    selector: 'ng2-cytoscape',
    template: '<div id="cy"></div>',
    styles: [`#cy {
        height: 100%;
        width: 100%;
        position: relative;
        left: 0;
        top: 0;
    }`]
})


export class NgCytoComponent implements OnChanges {

    @Input() public elements: any;
    @Input() public style: any;
    @Input() public layout: any;
    @Input() public zoom: any;

    @Output() onGraphSelection: EventEmitter<any> = new EventEmitter();
    @Output() select: EventEmitter<any> = new EventEmitter<any>();

    private modalRef: any;
    private params: object = {};
    private _selectedNodes: any;
    private checkedNodes = [];

    node_name: string;
    edge_name: string;
    loading = false;
    private filterParams;
    resultSDGs: any = [];
    dataSDGs = [];
    SDGDetails: any = [];
    nodeName;

    // searchConnections;

    @ViewChild('showNode', { static: false }) show_nodes: ElementRef;
    @ViewChild('showEdge', { static: false }) show_edges: ElementRef;

    public constructor(private globalVariableService: GlobalVariableService, private renderer: Renderer, private el: ElementRef, private modalService: NgbModal, private diseaseGeneNetworkmapService: DiseaseGeneNetworkmapService) {

        this._selectedNodes = this.globalVariableService.getSelectedNodes();

        this.layout = this.layout || {
            name: 'grid',
            directed: true,
            padding: 0
        };

        this.zoom = this.zoom || {
            min: 0.1,
            max: 1.5
        };

        this.style = this.style || cytoscape.stylesheet()

            .selector('node')
            .css({
                'shape': 'data(shapeType)',
                'width': 25.0,
                'height': 25.0,
                'text-valign': 'center',
                'text-outline-color': 'data(colorCode)',
                'background-color': 'data(colorCode)',
                'color': '#32404E',
                'font-size': 6,
                'font-weight': 'bold',
                'content': 'data(name)'
            })
            .selector(':selected')
            .css({
                'border-width': 1,
                'border-color': 'black'
            })
            .selector('edge')
            .css({
                'text-opacity': '1.0',
                'color': 'rgb(0,0,0)',
                'source-arrow-shape': 'none',
                'font-family': 'SansSerif',
                'font-weight': 'normal',
                'line-style': 'solid',
                'target-arrow-shape': 'none',
                'target-arrow-color': 'rgb(0,0,0)',
                'source-arrow-color': 'rgb(0,0,0)',
                'opacity': '1.0',
                'font-size': '10',
                'width': '0.4',
                'line-color': '#000',
                //'curve-style': 'bezier',
            })
            .selector('edge.questionable')
            .css({
                'line-style': 'dotted',
                'target-arrow-shape': 'diamond'
            })
            .selector('.faded')
            .css({
                'opacity': 0.25,
                'text-opacity': 0
            });
    }

    public ngOnChanges(): any {
        this.render();
        // console.log(this.el.nativeElement);
    }

    public render(): any {
        let cy_contianer = this.renderer.selectRootElement("#cy");
        let localselect = this.select;

        let cy = cytoscape({
            container: cy_contianer,
            layout: this.layout,
            minZoom: this.zoom.min,
            maxZoom: this.zoom.max,
            style: this.style,
            elements: this.elements,
        });

        // console.log("cy:: ", cy._private.elements);

        cy.on('click', 'node', (e) => {
            var node = e.target;

            var neighborhood = node.neighborhood().add(node);
            // console.log("neighbr1: ", node.neighborhood().nodes());

            cy.elements().addClass('faded');
            neighborhood.removeClass('faded');
            localselect.emit(node.data('name'));

            var TargetNode = node[0]._private.data;
            console.log("act: ", node[0]._private.data);

            var directlyConnectedNodes = node.neighborhood().nodes();
            console.log("nodesHere: ", directlyConnectedNodes);
            $("#nodeDetails").html("");
            if (directlyConnectedNodes != undefined) {
                var nodeDetails = "";
                nodeDetails += "<div style='float:left;'>";
                nodeDetails += '<div style="padding: 5px;"><strong>' + TargetNode.name + '</strong></div>';
                nodeDetails += '<div style="padding: 5px;"><strong>Node Type: ' + TargetNode.node_type + '</strong></div>';
                nodeDetails += '<div style="padding: 5px;"><strong>Connections: </strong></div>';

                nodeDetails += '<input type="text" id="searchInput" autocomplete="off" onkeyup="searchConnections()" placeholder="&#xf002; Search for connections..">';

                nodeDetails += "<ul style='padding: 2px 18px;'>";
                directlyConnectedNodes.forEach(directlyConnectedNode => {
                    // window.gv = directlyConnectedNode;
                    //console.log("inner: ", directlyConnectedNode);
                    // console.log("inner: ", gv);
                    nodeDetails += "<li style='list-style: initial; color:" + directlyConnectedNode._private.data.colorCode + " '>" + directlyConnectedNode._private.data.name + "</li>"; //22509 -HSP90 molecular
                });
                nodeDetails += "</ul>";
                nodeDetails += "</div>";
                $("#nodeDetails").html(nodeDetails);
            } else {
                $("#nodeDetails").html("");
            }
            $('#myModalNode').modal('show');
            this.showNodeInfo(node._private.data.id);
        });

        cy.on('tap', function (e) {
            if (e.target === cy) {
                cy.elements().removeClass('faded');
            }
        });

        cy.on('mouseover', 'node', (e) => {
            var node = e.target;
            // console.log("actRight: ", node[0]._private.data);
            let node_ids = parseInt(node[0]._private.data.id);

            node.qtip({
                content: e.target._private.data.name,
                show: {
                    event: e.type,
                    ready: true,
                    solo: true
                },
                hide: {
                    // event: 'mouseout'
                }
            }, e);

            if (node[0]._private.data.node_type == "FDG") {
                this.globalVariableService.setSelectedNodesForSDG(node_ids);
                // this.globalVariableService.getSelectedNodesForSDG();
                this.filterParams = this.globalVariableService.getFilterParams();
                console.log("filterparams: ", this.filterParams);

                this.diseaseGeneNetworkmapService.getSDGLists(this.filterParams).subscribe(
                    data => {
                        this.resultSDGs = data;
                        this.dataSDGs = this.resultSDGs.nameSDGs;
                        console.log("dataSDGs: ", this.dataSDGs);

                        if (this.dataSDGs.length > 0) {

                            $("#nodeName").html("Second Degree Gene: "+ e.target._private.data.name); // To show the title in popup

                            this.SDGDetails = [];
                            var pubmedBaseUrl = "https://www.ncbi.nlm.nih.gov/pubmed/";
                            this.dataSDGs.forEach(dataSDG => {
                                var temps = {};
                                temps["name"] = dataSDG.sdg_name;
                                temps["edge_weight"] = dataSDG.edge_weight;

                                temps["pmid_lists"] = "";
                                dataSDG.pmidlist.forEach(pmidLists => {
                                    temps["pmid_lists"] += "<a target='_blank' href='" + pubmedBaseUrl + pmidLists.trim() + "'>" + pubmedBaseUrl + pmidLists.trim() + "</a><br/>";
                                });
                                this.SDGDetails.push(temps);
                            });
                            console.log("lists:: ", this.SDGDetails);

                            jQuery('#demo-table2').bootstrapTable({
                                bProcessing: true,
                                bServerSide: true,
                                pagination: true,
                                showColumns: true,
                                pageSize: 25,
                                // pageList: [10, 25, 50, 100, All],
                                striped: true,
                                showFilter: true,
                                filter: true,
                                data: this.SDGDetails,
                            });

                            jQuery('#demo-table2').bootstrapTable("load", this.SDGDetails);

                            jQuery('#demo-table2').on("search.bs.table", function () {
                                jQuery('#demo-table2').bootstrapTable("load", this.SDGDetails);
                            })
                                .on("search.bs.table", function () {
                                    jQuery('#demo-table2').bootstrapTable("load", this.SDGDetails);
                                })
                                .on("page-change.bs.table", function () {
                                    jQuery('#demo-table2').bootstrapTable("load", this.SDGDetails);
                                });
                            $('#myModalSDGLists').modal('show');
                        }
                    },
                    err => {
                        console.log(err.message);
                    },
                    () => {
                        this.loading = false;
                    }
                )
            }
            // this.showNodeInfo(node[0]._private.data.id);
        });

        cy.on('tap', 'edge', function (e) {
            var edge = e.target._private.data;
            // console.log("PMID: ", e.target._private.data);

            var pubmedURLsDownload;
            if (edge.PMID != undefined) {
                // var PMIDList = edge.PMID.split(",");
                var pubmedBaseUrl = "https://www.ncbi.nlm.nih.gov/pubmed/";
                pubmedURLsDownload = "";
                edge.PMID.forEach(PMID => {
                    pubmedURLsDownload += "<div style='list-style: none; font-size: 14px;'><a target='_blank' style='color: white !important;' href='" + pubmedBaseUrl + PMID.trim() + "'>" + pubmedBaseUrl + PMID.trim() + "</a></div>";
                });
                pubmedURLsDownload += "<div style='clear: both;'><hr/></div>";
            } else {
                pubmedURLsDownload = "<h4>No PMID Found..</h4>";
                pubmedURLsDownload += "<div style='clear: both;'><hr/></div>";
            }

            var sourceData = e.target._private.source._private.data;
            var targetData = e.target._private.target._private.data;

            var pubmedEdgeDetails;
            pubmedEdgeDetails = "<div style='float:left;'>";
            pubmedEdgeDetails += '<div style="color: #00ffff;"><strong>Source Name</strong></div>';
            pubmedEdgeDetails += '<div style="padding-bottom:10px;">' + sourceData.name + '</div>';
            pubmedEdgeDetails += '<div style="color: #00ffff;"><strong>Target Name</strong></div>';
            pubmedEdgeDetails += '<div style="padding-bottom:10px;">' + targetData.name + '</div>';
            pubmedEdgeDetails += '<div style="color: #00ffff;"><strong>Edge Weight</strong></div>';
            pubmedEdgeDetails += '<div style="padding-bottom:10px;">' + edge.strength + '</div>';
            pubmedEdgeDetails += "</div>";
            console.log("pubmedEdgeDetails: ", pubmedEdgeDetails);
            $("#pubmedURLsDownload").html(pubmedURLsDownload);
            $("#pubmedURLs").html(pubmedEdgeDetails);
            $('#myModalEdge').modal('show');
        });
    }

    public showNodeInfo(nodeId) {
        console.log("nodeId: ", nodeId);
        this.checkedNodes = Array.from(this.globalVariableService.getSelectedNodes()); //get the existing node id
        this.checkedNodes.push(parseInt(nodeId));  // and append the selecting nodeid
        this.globalVariableService.setSelectedNodes(this.checkedNodes);
        // console.log("select2: ", this.checkedNodes);
        this.onGraphSelection.emit();

        // this.node_name = "piyush";
        // this.modalRef = this.modalService.open(this.show_nodes, { size: 'lg', keyboard: false, backdrop: 'static' });
    }



    searchConnections = function () {

        console.log("sdfsfs");
        alert("sfsfsf");
        // Declare variables
        var input, filter, ul, li, a, i, txtValue;
        input = document.getElementById('searchInput');
        filter = input.value.toUpperCase();
        ul = document.getElementById("myUL");
        li = ul.getElementsByTagName('li');

        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("a")[0];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }

}
