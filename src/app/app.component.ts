import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { UserService } from './services/users.service';

import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  user: any;
  error = "false";
  errorMessage = "";

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.user = JSON.parse(this.userService.getCurrentUser());
    // console.log("idToken:: ", localStorage.getItem('id_token'));

    if (this.userService.isLoggednIn() == true) {
    }
    else {
      this.error = "true";
      this.errorMessage = "Your session is expired..";
      this.router.navigate(['login'], { queryParams: { error: this.error, errorMessage: this.errorMessage } }); // when user is not logged in app is redirected to login page 
    }

  }

  ngOnInit(): void {
  }

}
