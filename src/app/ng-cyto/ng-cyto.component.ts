import { Component, OnChanges, Renderer2, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import { NodeSelectsService } from '../services/common/node-selects.service';
// import cytoscape from 'cytoscape';

// import * as $ from 'jquery';
// declare var jQuery: any;

declare var cytoscape: any;
declare var require: any;
declare var jQuery: any;

var cytoscape = require('cytoscape');

var cyqtip = require('cytoscape-qtip');
cyqtip(cytoscape); // register extension

// require(['cytoscape-svg'], function (cytoscape: any, svg: any) {
//     svg(cytoscape); // register extension
// });

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
    private checkedNodes: any = [];

    node_name: string = '';
    edge_name: string = '';
    loading = false;
    private filterParams: any;
    resultSDGs: any = [];
    dataSDGs = [];
    SDGDetails: any = [];
    nodeName: any;
    resultNodes: any = [];
    edgeTypeNameData: any = [];
    loadingEdge: boolean = false;

    // searchConnections;

    @ViewChild('showNode', { static: false }) show_nodes?: ElementRef;
    @ViewChild('showEdge', { static: false }) show_edges?: ElementRef;

    public constructor(private globalVariableService: GlobalVariableService, private nodeSelectsService: NodeSelectsService, private renderer: Renderer2, private el: ElementRef, private modalService: NgbModal) {

        // this._selectedNodes = this.globalVariableService.getSelectedNodes();
        this._selectedNodes = this.globalVariableService.getSelectedSourceNodes();

        // this.layout = this.layout || {
        //     name: 'cose',
        //     directed: true,
        //     padding: 0
        // };

        this.zoom = this.zoom || {
            min: 0.2,
            max: 1.5
        };

        this.style = this.style || cytoscape.stylesheet()

            .selector('node')
            .css({
                'shape': 'data(shapeType)',
                'width': 'mapData(weight, 40, 80, 20, 60)',
                'content': 'data(name)',
                'text-valign': 'center',
                'text-outline-width': 1,
                'text-outline-color': 'data(colorCode)',
                'background-color': 'data(colorCode)',
                'color': '#fff'
            })
            .style({ "font-size": 10 })    // big font

            .selector(':selected')
            .css({
                'border-width': 1,
                'border-color': '#333'
            })
            .selector('edge')
            .css({
                'opacity': 0.666,
                'width': 'mapData(strength, 70, 100, 2, 6)',
                'target-arrow-shape': 'triangle',
                'source-arrow-shape': 'circle',
                'line-color': 'data(colorCode)',
                'source-arrow-color': 'data(colorCode)',
                'target-arrow-color': 'data(colorCode)'
            })
            .selector('edge.questionable')
            .css({
                'line-style': 'solid',
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

        // cy.svg(true)
        // console.log("cy:: ", cy._private.elements);

        // var dim = 12 / cy.zoom();
        // var maxDim = Math.max(dim, 2);
        // cy.nodes().css('font-size', maxDim);
        // cy.fit(cy.$(':selected'), 50)

        cy.on('click', 'node', (e: any) => {
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
                nodeDetails += '<div style="padding: 5px; color:#BF63A2"><strong>' + TargetNode.name + '</strong></div>';
                nodeDetails += '<div style="padding: 5px;"><strong>Node Type: ' + TargetNode.node_type + '</strong></div>';
                nodeDetails += '<div style="padding: 5px;"><strong>Connections: </strong></div>';

                //nodeDetails += '<input type="text" id="searchInput" autocomplete="off" onkeyup="searchConnections()" placeholder="&#xf002; Search for connections..">';

                nodeDetails += "<ul style='padding: 2px 18px;'>";
                directlyConnectedNodes.forEach((directlyConnectedNode: any) => {
                    // window.gv = directlyConnectedNode;
                    //console.log("inner: ", directlyConnectedNode);
                    // console.log("inner: ", gv);
                    // const el = document.getElementById("nodeClick");
                    // el?.addEventListener("onclick", this.nodeClickEvent);
                    nodeDetails += "<li style='list-style: initial; color:" + directlyConnectedNode._private.data.colorCode + "'>" + directlyConnectedNode._private.data.name + "</li>"; //22509 -HSP90 molecular
                });
                nodeDetails += "</ul>";
                nodeDetails += "</div>";

                $("#nodeDetails").html(nodeDetails);
            } else {
                $("#nodeDetails").html("");
            }
            ($('#myModalNode') as any).modal('show');
            // this.showNodeInfo(node[0]._private.data.id); //append the node and reload the graph
        });

        cy.on('cxttap', 'node', (e: any) => {
            var node = e.target;
            console.log("rightclick: ", node[0]._private.data.id);
            this.showNodeInfo(node[0]._private.data.id); //append the node and reload the graph
        });

        // cy.on("tap", "node", (evt: any) => {
        //     evt.cyTarget.connectedEdges().animate({
        //         style: { lineColor: "red" }
        //     })
        // });

        // cy.on('tap', function (e: any) {
        //     if (e.target === cy) {
        //         cy.elements().removeClass('faded');
        //     }
        // });

        cy.on('mouseover', 'node', (e: any) => {
            var node = e.target;
            // console.log("actRight: ", node[0]._private.data);
            let node_ids = parseInt(node[0]._private.data.id);
            // console.log("nodeIds: ", node_ids);

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
        });

        cy.on('tap', 'edge', (e: any) => {

            var edge = e.target._private.data;
            console.log("PMID: ", edge);

            //Get the NE_IDs Lists
            const regex = /[{}]/g;
            const edgeTypeNeIds = edge.neIds;
            const edgeTypeNeIdsPost = edgeTypeNeIds.replace(regex, '');
            // console.log("edgeTypeNeIdsPost: ", edgeTypeNeIdsPost);

            // let strArr = edge.edgeTypeNeIds.split(/[)]/);
            // // var strArr = edge.edgeTypeNeIds.split(')\", ');
            // console.log("edgeTypeNeIdsPost1: ", strArr); // gives ["15","16","17"];

            //////////////// get the pmid lists here /////////////////////
            // this.resultNodes = [];
            this.loadingEdge = true;

            //First reset the edge selection area
            var pubmedURLsDownloadLoader: any;
            pubmedURLsDownloadLoader = "<div class='overlay'><img style='position:absolute' src='../../assets/images/loader_big.gif' /></div>";
            $("#pubmedURLsDownloadLoader").html(pubmedURLsDownloadLoader);
            $("#pubmedURLsDownload").html('');
            $("#pubmedURLs").html('');
            ($('#myModalEdge') as any).modal('show');

            this.nodeSelectsService.getEdgePMIDLists({ 'ne_ids': edgeTypeNeIdsPost }).subscribe(
                data => {
                    // const legendsNodeTypes = [];
                    this.resultNodes = data;
                    this.edgeTypeNameData = this.resultNodes.pmidLists;
                    // console.log("edgeTypeNameData1: ", this.edgeTypeNameData);

                    var pubmedURLsDownload: any;
                    if (this.edgeTypeNameData != undefined) {
                        // var PMIDList = edge.PMID.split(",");
                        var pubmedBaseUrl = "https://www.ncbi.nlm.nih.gov/pubmed/";
                        pubmedURLsDownload = "";

                        pubmedURLsDownload = "<div>";
                        pubmedURLsDownload += "<div style='font-size: 15px; font-weight:bold; text-decoration:underline; color:#32404E'>Title & PMID Lists</div>";
                        this.edgeTypeNameData.forEach((PMID: any) => {
                            // console.log("PMID:: ", PMID.edge_type_name);
                            pubmedURLsDownload += "<div style='font-size: 14px;color:#32404E'>" + PMID.title + "</div>";
                            pubmedURLsDownload += "<div style='list-style: none; font-size: 14px;'><a target='_blank' style='color: #BF63A2 !important;' href='" + pubmedBaseUrl + PMID.pmid + "'>" + pubmedBaseUrl + PMID.pmid + "</a></div>";
                            pubmedURLsDownload += "<hr style='color:#32404E'/>";
                        });
                        pubmedURLsDownload += "<div style='clear: both;'><hr/></div>";
                        pubmedURLsDownload += "</div>";
                    } else {
                        pubmedURLsDownload = "<h4>No PMID Found..</h4>";
                        pubmedURLsDownload += "<div style='clear: both;'><hr/></div>";
                    }
                    // console.log("edgeTypeNameData5: ", pubmedURLsDownload);

                    var sourceData = e.target._private.source._private.data;
                    var targetData = e.target._private.target._private.data;

                    var pubmedEdgeDetails;
                    pubmedEdgeDetails = "<div>";
                    pubmedEdgeDetails += '<div style="color: #BF63A2;"><strong>Source Name</strong></div>';
                    pubmedEdgeDetails += '<div style="padding-bottom:10px; color: #BF63A2;">' + sourceData.name + '</div>';
                    pubmedEdgeDetails += '<div style="color: #4B5DA1;"><strong>Target Name</strong></div>';
                    pubmedEdgeDetails += '<div style="padding-bottom:10px; color: #4B5DA1;">' + targetData.name + '</div>';
                    // pubmedEdgeDetails += '<div style="color: #00ffff;"><strong>Edge Weight</strong></div>';
                    // pubmedEdgeDetails += '<div style="padding-bottom:10px;">' + edge.strength + '</div>';
                    pubmedEdgeDetails += "<hr style='color: #32404E;'/>";
                    pubmedEdgeDetails += "</div>";

                    // console.log("pubmedEdgeDetails: ", pubmedEdgeDetails);
                    $("#pubmedURLsDownloadLoader").html('');
                    $("#pubmedURLsDownload").html(pubmedURLsDownload);
                    $("#pubmedURLs").html(pubmedEdgeDetails);
                    ($('#myModalEdge') as any).modal('show');
                },
                err => {
                    this.loadingEdge = false;
                    console.log(err.message);
                },
                () => {
                    this.loadingEdge = false;
                });
        });

        //document.getElementById("#btnsave").addEventListener ("click", nodeClickEvent, false);
    }

    public showNodeInfo(nodeId: any) {
        // var nodeId: any = $(nodeId);
        console.log("nodeId: ", nodeId);
        this.checkedNodes = Array.from(this.globalVariableService.getSelectedSourceNodes()); //get the existing node id
        this.checkedNodes.push(parseInt(nodeId));  // and append the selecting nodeid
        this.globalVariableService.setSelectedSourceNodes(this.checkedNodes);
        console.log("select2: ", this.checkedNodes);
        this.onGraphSelection.emit();

        // this.checkedNodes = Array.from(this.globalVariableService.getSelectedNodes()); //get the existing node id
        // this.checkedNodes = parseInt(nodeId);  // and append the selecting nodeid
        // this.globalVariableService.setSelectedNodes(this.checkedNodes);
        // console.log("select22: ", this.checkedNodes);
        // this.onGraphSelection.emit();

        // this.node_name = "piyush";
        // this.modalRef = this.modalService.open(this.show_nodes, { size: 'lg', keyboard: false, backdrop: 'static' });
    }

    nodeClickEvent = function () {
        console.log("test: ");
    }


    searchConnections22 = () => {
        // searchConnections = function () {
        console.log("sdfsfs");
        alert("sfsfsf");
        // Declare variables
        var input: any, filter: any, ul: any, li: any, a: any, i: any, txtValue: any;
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
