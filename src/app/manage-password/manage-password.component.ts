import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-manage-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  templateUrl: './manage-password.component.html',
  styleUrls: ['./manage-password.component.scss']
})
export class ManagePasswordComponent {

}
