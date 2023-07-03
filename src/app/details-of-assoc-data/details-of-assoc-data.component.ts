import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RelationDistributionService } from '../services/relation-distribution.service';
import { GlobalVariableService } from 'src/app/services/common/global-variable.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-details-of-assoc-data',
  templateUrl: './details-of-assoc-data.component.html',
  styleUrls: ['./details-of-assoc-data.component.scss']
})
export class DetailsOfAssocDataComponent implements OnInit {
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
    
    this._RDS.details_of_association_type(this.filterParams).subscribe(
      (response: any) => {
        this.data = response.nodeSelectsRecords;
        this.drawColumnChart();
      },
      (error: any) => { 
        console.error(error)
        this.errorMsg = error;
      }
    );
    
  }

  drawColumnChart() {
    console.log("In drawColumnChart");
    console.log(this.data);
    this.graphLoader = false;
  }

}
