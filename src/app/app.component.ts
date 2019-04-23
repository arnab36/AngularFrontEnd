import { Component, OnInit } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.home.html',
  styleUrls: ['./app.component.css'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class AppComponent {
  location: Location;

  
  constructor(location: Location, private router: Router) { this.location = location;}
  
  ngOnInit(){
   // this.router.navigate(['/login']);
  }

}
