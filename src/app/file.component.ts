import { Component, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { AllFileHistory } from './home.interface';
import { HomeService } from './home.service';
import { BehaviorSubject } from "rxjs";
import { DataService} from './app.dataSerive';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { saveAs } from 'file-saver/FileSaver';

@Component({
  templateUrl: './fileUpload.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}, HomeService]
})

export class FileComponent {
  title = 'app';
  userName = 'abc12@google.com';
  location: Location;
  allFileData:AllFileHistory[] = [];
  fileSummaryList:any[];
  fileHistoryData:any[];
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isFileUploading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public data;
  myFiles = [];
  fileUploadSuccessMessage:string = '';
  fileUploadFailedMessage:string = '';
  username:string;
  fileUpload:string = '';
  p: number = 1;
  fileselected:boolean = false;
  csvdata = [];
  

  constructor(location: Location, private router: Router, private homeService : HomeService, private _dataService: DataService) { this.location = location;}
 
  getFileDetails (e) {
    this.fileUpload = '';
    this.fileselected = true
    for (var i = 0; i < e.target.files.length; i++) { 
      this.myFiles.push(e.target.files[i]);
    }
  }

  uploadFiles () {
    this.isFileUploading$.next(true);
    const frmData = new FormData();
    this.fileUpload = '';
    this.fileselected = false;
    for (var i = 0; i < this.myFiles.length; i++) { 
      frmData.append("file", this.myFiles[i]);
    }
  
    frmData.append("userid", this.username);
    let querydata = {filetype:"something", userid:this.username};
    this.homeService.uploadAllFiles(frmData,querydata)
    .subscribe(data => {
      if(data['message'] == "true") {
        this.isFileUploading$.next(false);
        this.fileUpload = 'success'
        this.fileUploadSuccessMessage = 'Files Uploaded Successfully';
      }
      else {
        this.isFileUploading$.next(false);
        this.fileUpload = 'Failed'
        this.fileUploadFailedMessage = 'Failed to Upload Files';
      } 
    },
    err => {
      console.log('Failed to upload');
      this.isFileUploading$.next(false);
    })
  }

  ngOnInit(){
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });

    this.isLoading$.next(true);
    
    this.data = this._dataService.getOption();
    this.username = this.data.username;
    
    let querydata = {"userid" : this.username}
    this.homeService.getAllFileHistory(querydata)
    .subscribe(allFileData => {this.allFileData = allFileData
      let fileSummaryList = new Array();
      this.fileHistoryData = new Array();

      if(allFileData['filesummarylist'] ==  null)
      {
        this.isLoading$.next(false);
      }
      fileSummaryList = allFileData['filesummarylist'];
     
      for(var i = 0; i < fileSummaryList.length; i++) 
      {
        this.fileHistoryData.push({seshid:fileSummaryList[i].seshid,filename:fileSummaryList[i].filename,numrows:fileSummaryList[i].numrows,status:fileSummaryList[i].status,uploaddate:fileSummaryList[i].uploaddate,fileid:fileSummaryList[i].fileid,
        username:fileSummaryList[i].seshusername});
      }
      this.isLoading$.next(false);
    },
    err => {
      console.log('Failed to Fetch');
      this.isLoading$.next(false);
    });
  }

  fetchFileData(id) {
    this._dataService.setOption('seshid', id); 
    this.router.navigate(['/success/summary/fileDetails']);
  }

  dowloadFile(seshid,fileName){
    this.isLoading$.next(true);
    let filedata =  { "seshid":seshid, "filename":fileName }
    //let filedata = { "seshid":"14675", "filename":"dr_180713-1030.csv" }
    this.homeService.dowloadFile(filedata)
    .subscribe(data => {
      this.csvdata = new Array();
      this.csvdata = data["_body"];
     // console.log("data",data["_body"]);
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf("MSIE ");
      var is_edge = navigator.userAgent.toLowerCase().indexOf('edge') > -1;

      if(is_edge === true)
      {
      var blob = new Blob( [ this.csvdata ], { type: "data:text/csv;charset=utf-8"} );
      window.navigator.msSaveOrOpenBlob( blob, fileName);
      } 
      else if(msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      
      {
        var blob = new Blob( [ this.csvdata ], { type: "data:text/csv;charset=utf-8"} );
        window.navigator.msSaveOrOpenBlob( blob, fileName);
      } 
      else
      {  
        var blob = new Blob([this.csvdata], {type: "data:text/csv;charset=utf-8"});
        saveAs(blob, fileName);
      }
      this.isLoading$.next(false);
    },
    err => {
      console.log('Failed to download');
      this.isLoading$.next(false);
    }
    )
  }
}