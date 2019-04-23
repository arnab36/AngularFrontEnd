import { Component, OnInit, ViewChild } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { LoginService } from './login.service';
import { Authtenticate } from './login.interface';
import { DataService } from './app.dataSerive';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.login.html',
  styleUrls: ['./app.component.css'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}, LoginService]
})
export class LoginComponent {
  title = 'app';
  location: Location;
  loginSucess:Authtenticate[] = [];
  message:string = '';
  registerForm: FormGroup;
  submitted = false;
  loginMessage:boolean = true;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  
  constructor(location: Location, private router: Router, private loginservice : LoginService, private _dataService: DataService, private formBuilder: FormBuilder) { this.location = location;}
  
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });

    this.registerForm = this.formBuilder.group({
        username: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators]]
    });
  } 

// convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.registerForm.invalid) {
          return;
      }
  }

  authenticateUser(user,pass){
   if((user != "" && pass != "") && ((user != undefined && pass != undefined))){
    this.isLoading$.next(true);
    let querydata = { username : user, password : pass};
    this._dataService.setOption('username', user); 

    this.loginservice.authenticateUser(querydata)
    .subscribe(loginSucess => {this.loginSucess = loginSucess;
        if(loginSucess['success'] == true)
        {
          this.router.navigate(['/success']);
          this.isLoading$.next(false);
        }
        else 
        {
          this.loginMessage = false;
          console.log("Failed");
          this.router.navigate(['/success']);
          this.message = "Username Or Password incorrect"
          this.isLoading$.next(false);
        }
      },
      err => {
        console.log("Authentication Failed");
        this.isLoading$.next(false);
      })
   }
  }

}
