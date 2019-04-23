import { Injectable } from '@angular/core';  
  
@Injectable()  
export class DataService {  
  
private data = {}; 
  
 setOption(options,value) {      
    this.data[options] = value;  
  }  
  
  getOption() {
    return this.data;  
  }  
}  