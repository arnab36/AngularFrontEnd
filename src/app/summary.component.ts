import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SummaryService } from './summary.service';
import { SummaryData } from './summary.interface';
import { BehaviorSubject } from "rxjs";
import { DataService } from './app.dataSerive';

@Component({
  templateUrl: './summary.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SummaryService]
})

export class SummaryComponent {
  title = 'app';
  summaryData: SummaryData[] = [];
  allSummaryData: any[] = [];
  finalsummaryData: any[] = [];
  public data;
  seshId:string;
  p: number = 1;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  edit:boolean = false;
  indexval:number = -1;
  editlogo:string = "fa fa-pencil-square-o";
  reasonslist = [{num:"1",value:''},
                 {num:"2",value:"Yes"},
                 {num:"3",value:"NO"}];

  constructor(private router: Router, private summaryService : SummaryService, private _dataService: DataService) {}


  loadresults(id){
    this._dataService.setOption('siv_LIN_OID_NR', id); 
    this.router.navigate(['/success/summary/research']);
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });

    this.isLoading$.next(true);

    this.data = this._dataService.getOption();
    this.seshId = this.data.seshid;

    let querydata = {"seshid" : this.seshId };
    this.summaryService.getAllData(querydata)
    .subscribe(summaryData => {this.summaryData = summaryData;
      this.finalsummaryData = new Array();
      this.finalsummaryData = summaryData["invoicesummaryresponselist"];
      this.isLoading$.next(false);
    },
    err => {
      console.log("Failed to fetch data");
      this.isLoading$.next(false);
    })
  }

  showedit:boolean = true;
  enableediting(index){
    this.edit = !this.edit;
    this.showedit = !this.showedit;
    this.indexval = index;
    if(this.edit == false) {
      this.editlogo = "fa fa-pencil-square-o";
    }
    else {
      this.editlogo = "fa fa-times";
    }
    
  }

  saveChanges(id,description,watsonRater,bossRater,htscode,reason,shipmentnumber,rowId,comments,watsonAccurate,Value,watsonReasons,Historical) {
    //console.log("id"+" "+id+" "+"description"+" "++"htscode"+" "+htscode+" "+"reason"+" "+reason+" "+"comments"+" "+comments);
    console.log(id+" "+description+" "+watsonRater+" "+bossRater+" "+htscode+" "+reason+" "+shipmentnumber+" "+rowId+" "+comments+" "+watsonAccurate+" "+Value+" "+watsonReasons+" "+Historical);
    this.showedit = !this.showedit;    
    this.isLoading$.next(true);
    let editdata = {
                      "siv_lin_oid_nr": id,
                      "seshrowid": rowId,
                      "description": description,
                      "watsonraterhtscode": watsonRater,
                      "overridereasoncode": reason,
                      "overridereasoncomments": comments,
                      "historical": Historical,
                      "overridehtscode": htscode,
                      "invshipmentnumber": shipmentnumber,
                      "invsiv_lin_tot_a": Value,
                      "shiptarrifnum": "",
                      "prmrytarnr": bossRater,
                      "watsonaccurate": watsonAccurate,
                      "watsonreasons": watsonReasons
                  }
                  
    this.summaryService.updateInvoiceData(editdata)
    .subscribe(data => {
      console.log("data",data)
      this.isLoading$.next(false);
    },
    err => {
      console.log("Failed to fetch data");
      this.isLoading$.next(false);
    })
  }

  stylewatsonRater(watsonRater,bossRater){
    if((watsonRater != bossRater) && (watsonRater != "") && (bossRater != ""))
    {
      return {'backgroundColor' : 'yellow'}
    }

    if((watsonRater.includes("82")) || (watsonRater.includes("83")) ||(watsonRater.includes("84")) || (watsonRater.includes("85")))
    {
      return {'backgroundColor' : 'yellow'}
    }
  }

  styleBossRater(watsonRater,bossRater){
    if((watsonRater != bossRater) && (watsonRater != "") && (bossRater != "")) 
    {
      return {'backgroundColor' : 'yellow'}
    }

    if((bossRater.includes("82")) || (bossRater.includes("83")) ||(bossRater.includes("84")) || (bossRater.includes("85")))
    {
      return {'backgroundColor' : 'yellow'}
    }
  }
}


