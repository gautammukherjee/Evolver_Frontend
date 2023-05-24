import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-data-range',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filter-data-range.component.html',
  styleUrls: ['./filter-data-range.component.scss']
})
export class FilterDataRangeComponent {

}
