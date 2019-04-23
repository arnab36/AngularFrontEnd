import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule} from '@angular/http';
import { FormsModule, FormControlDirective } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgWordCloudModule, AgWordCloudData } from 'angular4-word-cloud';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HashLocationStrategy, Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

import { SummaryComponent }   from './summary.component';
import { DiscoveryComponent }   from './discovery.component';
import { SecurityComponent }      from './security.component';
import { BlockChainComponent }  from './blockchain.component';
import { MoreInformationComponent }  from './moreInformation.component';
import { ResultsComponent, SafePipe }  from './result.component';
import { LoginComponent }  from './login.component';
import { HomeComponent }  from './home.component';
import { FileComponent }  from './file.component';
import { DataService } from './app.dataSerive';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
 // wheelPropagation: true,
  suppressScrollX: false 
};
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'success', component: HomeComponent,
    children: [
      { path: '', redirectTo: 'summary/fileHistory', pathMatch: 'full' },
      { path: 'summary/fileHistory', component: FileComponent },
      { path: 'summary/fileDetails', component: SummaryComponent, pathMatch: 'full'},
      { path: 'discovery', component: DiscoveryComponent, pathMatch: 'full' },
      { path: 'security', component: SecurityComponent },
      { path: 'blockchain', component: BlockChainComponent, pathMatch: 'full' },
      { path: 'moreinformation', component: MoreInformationComponent, pathMatch: 'full' },
      { path: 'summary/research', component: ResultsComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent, DiscoveryComponent, SecurityComponent, BlockChainComponent, MoreInformationComponent, SummaryComponent, ResultsComponent, LoginComponent, HomeComponent, FileComponent, SafePipe
  ],
  imports: [
    BrowserModule, RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'}), HttpModule, FormsModule, PerfectScrollbarModule, ReactiveFormsModule, NgxPaginationModule, AgWordCloudModule.forRoot(), NgbModule.forRoot()
  ],
  exports: [ RouterModule ],
  providers: [ FormControlDirective, DataService],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
