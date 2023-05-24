import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { UserService } from '../services/users.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent, FooterComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
