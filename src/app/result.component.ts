import { Component,PipeTransform, Pipe, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {ResultService } from './result.service';
import {BrowserModule, DomSanitizer,SafeResourceUrl} from '@angular/platform-browser'
import { DataService } from './app.dataSerive';
import { BehaviorSubject } from "rxjs";
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import {AgWordCloudModule, AgWordCloudData} from 'angular4-word-cloud';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  templateUrl: './result.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}, ResultService]
})

export class ResultsComponent {
  title = 'app';
  description:string = "";
  shipperList = [];
  imageList = [];
  otherDetails = [];
  resultsList = [];
  WatsonResults = [];
  src:string = "";
  imageID:string = "";
  urlLink:string = "";
  siv_lin_oid_nr:string = "";
  public data;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  urlClicked:boolean = false;
  wordToDelete:string = 'Select Word To Delete';
  wordcloudmap = [];
  wordData: Array<AgWordCloudData> = [];
  score:string;
  text:string;
  deleteImageList = [];
  AllImages = [];
  deleteUrlList = [];
  AllLinks = [];
  
  constructor(private router: Router,private location: Location, private resultService : ResultService, private _dataService: DataService) {this.location = location;}

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });
    this.isLoading$.next(true);

    this.data = this._dataService.getOption();
    this.siv_lin_oid_nr = this.data.siv_LIN_OID_NR;
    let querydata = {siv_lin_oid_nr : this.siv_lin_oid_nr};
    
    this.resultService.getAllResearchResuls(querydata)
    .subscribe(ResultsSet => {
      
      if(ResultsSet['description'] == null || ResultsSet['shipperurllist'] == null || ResultsSet['wordcloudmap'] == null || ResultsSet['imageurllist'] == null) {
        
        this.isLoading$.next(false);
      }
      this.description = ResultsSet['description'];
      this.shipperList = new Array();
      this.shipperList = ResultsSet['shipperurllist'];
      this.wordcloudmap = new Array();
      this.wordcloudmap = ResultsSet['wordcloudmap'];
      this.imageList = new Array();
      this.otherDetails = new Array();
      this.otherDetails = ResultsSet['imageurllist'];
      this.resultsList = new Array();
      this.WatsonResults = new Array();
      
      for(var i = 0; i < this.otherDetails.length; i++) 
      {
        this.imageList.push({imageId : this.otherDetails[i].autogenerateimageid, image : this.otherDetails[i].imageurl});
        this.resultsList = this.otherDetails[i].vrresultlist.images[0].classifiers[0].classes;

        for(var j = 0; j < this.resultsList.length; j++) 
        {
          this.WatsonResults.push({imageId : this.otherDetails[i].autogenerateimageid, classes: this.resultsList[j].class})
        }
      }

      this.isLoading$.next(false);
      this.scrollToTop();
      /* console.log("description",this.description);
      console.log("shipperList",this.shipperList);
      console.log("WatsonResults",this.WatsonResults);
      console.log("Images",this.imageList); 
      console.log("wordCloud", this.wordcloudmap);
      //console.log("wordCloud", this.wordData);*/

     this.wordData = this.wordcloudmap;      
    },
    err => {
      this.isLoading$.next(false);
      console.log('Failed to fetch');
    })
  }

  public scrollToTop(): void {
    if (this.directiveRef) {
      this.directiveRef.scrollToTop();
    } else if (this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToTop();
    }
  }

  fetchVisualDetails(id) {
    this.imageID = id;
  }

  OpenLink(url) {
    this.urlClicked = true;
    this.urlLink = url;
  }

  wordToBeDeleted(text) {
    this.wordToDelete = text;
  }

  deleteWord() {
    this.wordData = [];
    setTimeout(() => {    
      this.wordcloudmap = this.wordcloudmap.filter(word => word.text !== this.wordToDelete);
      this.wordToDelete = 'Select Word To Delete'; 
      this.wordData = this.wordcloudmap; 
    }, 1000);
  }

  addText(word,score) {
    this.wordData = [];
    this.score = '';
    this.text = '';
    setTimeout(() => {    
      this.wordcloudmap.push({size: score, text: word})
      this.wordData = this.wordcloudmap; 
    }, 1000);
  }

  selectImage(imageName) {
    this.deleteImageList.push(imageName);
    console.log("Delete Image List",this.deleteImageList);
  }

  deleteImage() {
    this.AllImages = this.imageList;
    this.imageList = [];

    setTimeout(() => {
      for(var j = 0; j < this.deleteImageList.length; j++) {    
        this.imageList = this.AllImages.filter(images => images.image !== this.deleteImageList[j]);
      }
    }, 1000);
    
  }

  selectLink(url) {
    this.deleteUrlList.push(url);
  }
  
  deleteLinks() {
    this.AllLinks = this.shipperList;
    this.shipperList = [];

    setTimeout(() => {
      for(var j = 0; j < this.deleteUrlList.length; j++) {    
        this.shipperList = this.AllLinks.filter(Links => Links !== this.deleteUrlList[j]);
      }
    }, 1000);    
  }

  addshipperlogo = "fa fa-plus-square";
  addImagelogo = "fa fa-plus-square";
  addShipper = false;
  addImageIcon = false;
  addImage(imagelink) {

  }

  addLink(shipperlink) {

  }

  addLinkLogo() {
    this.addShipper = !this.addShipper;
    if(this.addShipper == false) {
      this.addshipperlogo = "fa fa-plus-square";
    }
    else {
      this.addshipperlogo = "fa fa-minus-square";
    }
  }

  addImageLogo() {
    this.addImageIcon = !this.addImageIcon;
    if(this.addImageIcon == false) {
      this.addImagelogo = "fa fa-plus-square";
    }
    else {
      this.addImagelogo = "fa fa-minus-square";
    }
  }

  editText = false;
  editlogo = "fa fa-pencil-square-o";
  editContent(){
    this.editText = !this.editText;
    if(this.editText == false) {
      this.editlogo = "fa fa-pencil-square-o";
    }
    else {
      this.editlogo = "fa fa-times";
    }
  }
  options = {
  settings: {
    minFontSize: 20,
    maxFontSize: 100,
  },
  margin: {
    top: 5,
    right: 0,
    bottom: 10,
    left: 10
  },
  labels: true // false to hide hover labels
  };


}
