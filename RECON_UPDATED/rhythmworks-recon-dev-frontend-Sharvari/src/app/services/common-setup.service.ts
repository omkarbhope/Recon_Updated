import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import{ GlobalConstants } from 'src/app/global/global-constants';
@Injectable({
  providedIn: 'root'
})
export class CommonSetupService {
 // private baseUrl = "http://localhost:8000/";
 
  private baseUrl = GlobalConstants.baseUrl;
  constructor(private http: HttpClient) { }

  getCountryData() {
    return this.http.get(this.baseUrl.concat('/country/'));
  }

  getStateData(country_id) {
    return this.http.get(this.baseUrl.concat('/state/'));
  }

  getCityData() {
    return this.http.get(this.baseUrl.concat('/city/'));
  }

  getLocationData() {
    return this.http.get(this.baseUrl.concat('/location/'));
  }

  getUomData() {
    return this.http.get(this.baseUrl.concat('/uom/'));
  }

  getTermData() {
    return this.http.get(this.baseUrl.concat('/term/'));
  }

  getCurrencyData() {
    return this.http.get(this.baseUrl.concat('/currency/'));
  }

  getRejectionReasonData(){
    return this.http.get(this.baseUrl.concat('/reason/'));
  }


  saveUomData(value) { 
  if (value.ID) {
    //Update Data
    return this.http.put(this.baseUrl.concat('/uom/' + value.ID + '/'), value)
      .pipe(map(data => {
        data['status'] = 1;
        return data;
      }),
        catchError(this.errorHandler));
  }
  else {
    console.log("FORMVALUE:",value)
    return this.http.post(this.baseUrl.concat('/uom/'), value)
      .pipe(map(data => {
        data['status'] = 2;
        return data;
      }),
        catchError(this.errorHandler)
      );
  }
}

  saveLocationData(form) {  
    if(form.id)
    {
      return this.http.put(this.baseUrl.concat('/location/'+form.id+'/'), form).pipe(map(data => {
        data['status'] = 1;
        return data;
      }));
    }
    else
    {
      return this.http.post(this.baseUrl.concat('/location/'), form).pipe(map(data => {
        data['status'] = 2;
        return data;
      }));
    }
  }

  deleteLocationData(id) {
    console.log("In Service deleteLocationData");
    console.log(id);
    return this.http.delete(this.baseUrl.concat('/location/'+id+'/'), id);
  }

  deleteCurrency(value: any) {
    return this.http.put(this.baseUrl.concat(`/currency/${value.id}/`), value)
      .pipe(map(data => {
        data['status'] = 1;
        return data;
      }));
  }

  deleteReason(value: any) {
    return this.http.put(this.baseUrl.concat(`/reason/${value.id}/`), value)
      .pipe(map(data => {
        data['status'] = 1;
        return data;
      }));
  }

  deleteTermData(value: any) {
    return this.http.put(this.baseUrl.concat('/term/' + value.ID + '/'),
      value
    ).pipe(map(data => {
      data['status'] = 1;
      return data;
    }));
  }

  deleteUomData(ID) {
    return this.http.delete(this.baseUrl.concat(`/uom/${ID}/`));
  }

  saveCurrencyData(value) {
    if (value.id) {
      //Update Data
      return this.http.put(this.baseUrl.concat('/currency/' + value.id + '/'), value)
        .pipe(map(data => {
          data['status'] = 1;
          return data;
        }),
          catchError(this.errorHandler));
    }
    else {
      console.log("FORMVALUE:",value)
      return this.http.post(this.baseUrl.concat('/currency/'), value)
        .pipe(map(data => {
          data['status'] = 2;
          return data;
        }),
          catchError(this.errorHandler)
        );
    }
  }

  saveReasonData(value) {
    if (value.ID) {
      //Update Data
      return this.http.put(this.baseUrl.concat('/reason/' + value.ID + '/'), value)
        .pipe(map(data => {
          data['status'] = 1;
          return data;
        }));
    }
    else {
      console.log("FORMVALUE:",value)
      return this.http.post(this.baseUrl.concat('/reason/'), value)
        .pipe(map(data => {
          data['status'] = 2;
          return data;
        })
        );
    }
  }

  saveTermData(value: any) {
    if (value.ID) {
      return this.http.put(
        this.baseUrl.concat('/term/' + value.ID + '/'),
        value
      ).pipe(map(data => {
        data['status'] = 1;
        return data;
      }))
    }
    return this.http.post(
      this.baseUrl.concat('/term/'),
      value
    ).pipe(map(data => {
      data['status'] = 2;
      return data;
    }))
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error || "Server Error")
  }
}
