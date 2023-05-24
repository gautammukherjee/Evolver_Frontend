import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-no-page',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  templateUrl: './no-page.component.html',
  styleUrls: ['./no-page.component.scss']
})
export class NoPageComponent {

}
