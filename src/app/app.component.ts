import { Component, OnInit } from '@angular/core';
import { UserService } from './services/users.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  result: any;
  user: any;
  error = "false";
  errorMessage = "";

  constructor(private userService: UserService, private router: Router) {
    this.result = JSON.parse(sessionStorage.getItem('currentUser') || "null");

    // if (this.userService.isLoggednIn() == false) {
    //   this.autologout();
    // }
    // this.user = JSON.parse(this.userService.getCurrentUser());
    // console.log("idToken:: ", localStorage.getItem('id_token'));

    // if (this.userService.isLoggednIn() == true) {
    // }
    // else {
    //   this.error = "true";
    //   this.errorMessage = "Your session is expired..";
    //   this.router.navigate(['login'], { queryParams: { error: this.error, errorMessage: this.errorMessage } }); // when user is not logged in app is redirected to login page 
    // }

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

  ngOnInit(): void {
  }

}
