import { Component, OnInit } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';
import { DataService} from './app.dataSerive';
import { BehaviorSubject } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  //providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class HomeComponent {

  location: Location;
  userName:string = '';
  public data;
 
  
  constructor(location: Location, private router: Router, private _dataService: DataService) { this.location = location;}

  ngOnInit() {
    this.data = this._dataService.getOption();
    this.userName = this.data.username;
  }

  do() {
    return this.userName;
  }
}
