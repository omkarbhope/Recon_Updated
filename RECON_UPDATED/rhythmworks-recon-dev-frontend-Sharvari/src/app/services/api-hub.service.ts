import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import{ GlobalConstants } from 'src/app/global/global-constants';

@Injectable({
  providedIn: 'root'
})
export class ApiHubService {

baseUrl = GlobalConstants.baseUrl;

constructor(private http: HttpClient) { }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error || "Server Error");
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  getCompanyData() {
    return this.http.get<any[]>(`${this.baseUrl}/company`);
  }

  // getChannelData(id) {
  //   return this.http.get<any[]>(`${this.baseUrl}/channel/` + id);
  // }

  getChannelData() {
    return this.http.get<any[]>(`${this.baseUrl}/channel`);
  }

  getChannelAccCompanyData(id) {
    return this.http.get<any[]>(`${this.baseUrl}/company/` + id);
  }

  getMasterData() {
    return this.http.get<any[]>(`${this.baseUrl}/master`);
  }

  getApiMasterData() {
    return this.http.get<any[]>(`${this.baseUrl}/apimaster/`);
  }

  saveApiHubData(data) {
    if (data.id) {
      for (var i = 0; i < data.initialItemRow.length; i++) {
        if (data.initialItemRow[i].id == '') {
          delete data.initialItemRow[i].id;
        }
      }
      return this.http.put(this.baseUrl.concat('/apimaster/' + data.id + '/'), data)
        .pipe(map(data => {
          data['status'] = 2;
          return data;
        }),
          catchError(this.errorHandler)
        );
    }
    else {
      delete data['id']
      let initialItemRow = data.initialItemRow.filter(function (props) {
        delete props.id;
        return true;
      });

      return this.http.post(this.baseUrl.concat('/apimaster/'), data)
        .pipe(map(data => {
          data['status'] = 1;
          return data;
        }),
          catchError(this.errorHandler)
        );
    }
  }

  deleteDefineApi(value: any) {
    return this.http.put(this.baseUrl.concat(`/apimaster/${value.id}/`), value)
      .pipe(map(data => {
        data['status'] = 1;
        return data;
      }));
  }

  // Standard API 

  getStandardApiMaster() {
    return this.http.get<any[]>(`${this.baseUrl}/standardapimaster/`);
  }

  saveStandardApiData(data) {
    if (data.id) {
      for (var i = 0; i < data.initialItemRow.length; i++) {
        if (data.initialItemRow[i].id == '') {
          delete data.initialItemRow[i].id;
        }
      }
      return this.http.put(this.baseUrl.concat('/standardapimaster/' + data.id + '/'), data)
        .pipe(map(data => {
          data['status'] = 2;
          return data;
        }),
          catchError(this.errorHandler));
    }
    else {
      delete data['id'];
      let initialItemRow = data.initialItemRow.filter(function (props) {
        delete props.id;
        return true;
      });

      return this.http.post(this.baseUrl.concat('/standardapimaster/'), data)
        .pipe(map(data => {
          data['status'] = 1;
          return data;
        }),
          catchError(this.errorHandler));
    }
  }

  deleteStandardAPI(data: any) {
    return this.http.put(this.baseUrl.concat('/standardapimaster/' + data.id + '/'), data)
      .pipe(map(data => {
        data['status'] = 1;
        return data;
      }));
  }

  // master data
  getTypeOfEncryptionData() {
    return this.http.get(this.baseUrl.concat('/master/oftype/Type of Encryption'));
  }

  getTypeofCommumnicationData() {
    return this.http.get(this.baseUrl.concat('/master/oftype/Type of Communication'));
  }

  getTypeofAuthenticationData() {
    return this.http.get(this.baseUrl.concat('/master/oftype/Type of Authentication'));
  }

  getTypeofFileData() {
    return this.http.get(this.baseUrl.concat('/master/oftype/Type of File'));
  }

  getTypeofProtocol() {
    return this.http.get(this.baseUrl.concat('/master/oftype/Type of Protocol'));
  }

  getTypeofAPIData() {
    return this.http.get(this.baseUrl.concat('/master/oftype/Type of API'));
  }

  getTypeofRequestForAPI() {
    return this.http.get(this.baseUrl.concat('/master/oftype/Type of Request for API'));
  }

  getTypeofFieldData() {
    return this.http.get(this.baseUrl.concat('/master/oftype/Type of Field'));

  }

}
