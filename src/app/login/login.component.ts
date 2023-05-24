import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/users.service';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import * as moment from "moment";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading = false;
  error = "false";
  errorMessage = '';
  result: any;
  userCredentials: any = {};

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  constructor(
    private userService: UserService,
    private router: Router,
    private _router: ActivatedRoute
  ) {
    this._router.queryParams.subscribe(params => {
      this.error = params['error'];
      this.errorMessage = params['errorMessage'];
    });
  }

  ngOnInit() {
  }

  login() {
    this.loading = true;
    this.error = "false";
    console.warn("warn: ", this.loginForm.value);


    this.userCredentials = { email: this.loginForm.value.email, password: this.loginForm.value.password };
    this.userService.doLogin(this.userCredentials).subscribe(
      data => {
        this.result = data;
        console.log("resultStatus: ", this.result);
        if (this.result.status == 1) {
          this.setSession(this.result);


          //get the user stats details like userid, module id, ip address, browser, last login
          // this.locationService.getPosition().then(pos => {
          //   // console.log(`Positon: ${pos.lng} ${pos.lat}`);
          //   localStorage.setItem("pos_lat", `${pos.lat}`);
          //   localStorage.setItem("pos_long", `${pos.lng}`);
          //   // console.log("set Geo2: ", localStorage.getItem("pos_lat"));
          //   this.userService.remoteAccess({ lat: localStorage.getItem("pos_lat"), long: localStorage.getItem("pos_long") }).subscribe(
          //     data => {
          //       this.result = data;
          //       console.log("data2: ", this.result);
          //     });
          // });

          this.router.navigate(['./index']);
        } else {
          this.error = "true";
          this.loading = false;
          this.errorMessage = "Invalid Email or Password...";
        }
      },
      err => {
        this.error = "true";
        this.errorMessage = err.message;
        this.loading = false;
      },
      () => {
        // this.loading = false;
      }
    );

  }


  private setSession(authResult: any) {
    const expiresAt = moment().add(authResult.expiresAt, authResult.expireTimeUnit);
    sessionStorage.setItem('currentUser', JSON.stringify({ user_name: authResult.user_name, user_id: authResult.user_id }));
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

}
