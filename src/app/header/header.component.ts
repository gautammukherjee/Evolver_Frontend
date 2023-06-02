import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/users.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  result: any;
  error = "false";
  errorMessage = "";
  userName: any = '';

  constructor(private userService: UserService, private router: Router) {
    this.result = JSON.parse(sessionStorage.getItem('currentUser') || "null");

    // if (this.userService.isLoggednIn() == false) {
    //   this.autologout();
    // }

    // if (this.result !== null) {
    // }
    // else {
    //   this.error = "true";
    //   this.errorMessage = "Your session is expired..";
    //   this.router.navigate(['login'], { queryParams: { error: this.error, errorMessage: this.errorMessage } }); // when user is not logged in app is redirected to login page 
    // }

  }

  ngOnInit(): void {
    var sessVal = sessionStorage.getItem('currentUser');
    this.userName = JSON.parse(sessionStorage.getItem('currentUser') || "null");
    if (sessVal == null) {
      this.router.navigate(['login']);
    }
  }

  autologout() {
    setTimeout(() => {
      this.error = "true";
      this.errorMessage = "Your session is expired..";
      sessionStorage.removeItem('currentUser');
      // localStorage.removeItem('id_token');
      // localStorage.removeItem('expires_at');
      this.router.navigate(['login'], { queryParams: { error: this.error, errorMessage: this.errorMessage } }); // when user is not logged in app is redirected to login page 
    }, 1000);
  }

}
