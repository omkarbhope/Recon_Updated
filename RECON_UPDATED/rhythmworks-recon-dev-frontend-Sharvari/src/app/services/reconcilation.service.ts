import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable} from 'rxjs';
import { map , catchError } from 'rxjs/operators';
import{ GlobalConstants } from 'src/app/global/global-constants';

@Injectable({
  providedIn: 'root'
})
export class ReconcilationService {

  constructor(private http: HttpClient) { }

  baseUrl = GlobalConstants.baseUrl;
  
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  getCompanyData() {
    return this.http.get<any[]>(`${this.baseUrl}/company`);
  }

  getReconTypeData() {
    return this.http.get<any[]>(`${this.baseUrl}/master`);
  }

  getSourceMaster() {
    return this.http.get<any[]>(`${this.baseUrl}/srcmaster`);
  }

  getSourceDetails(id) {
    return this.http.get<any[]>(`${this.baseUrl}/srcdetails/` + id);
  }


  getReconcilationMaster() {
    return this.http.get<any[]>(`${this.baseUrl}/reconmst`);
  }

  getChannelData(id) {
    return this.http.get<any[]>(`${this.baseUrl}/company/` + id + `/`);
  }

  getMasterData() {
    return this.http.get<any[]>(`${this.baseUrl}/master`);
  }

  getTblMasterData(){
    return this.http.get<any[]>(`${this.baseUrl}/master/oftype/Operation Name for Recon Process`)
  }

  getSourceTableFieldData() {
    return this.http.get<any[]>(`${this.baseUrl}/sourcetableFieldsMst`);
  }

  getReconProcessMasterData() {
    return this.http.get<any[]>(`${this.baseUrl}/reconProcessMaster`);
  }

  getTblAPIDefMasterData() {
    return this.http.get<any[]>(`${this.baseUrl}/apimaster`);
  }

  addReconcilationData(data) {
    console.log(data, 'values from service');
    return this.http.post<any[]>(`${this.baseUrl}/reconmst/`, data).pipe(catchError(this.handleError));
  }

  getSourceData() {
    return this.http.get<any[]>(`${this.baseUrl}/source/`);
    // return this.http.get(this.baseUrl.concat('source/'))
  }
  
  getTablesDetails(tableNames) {
    return this.http.post(this.baseUrl.concat('/sourceNameTables'), tableNames)
      .pipe(map(data => {
        data['status'] = 1;
        return data;
      }));
  }

  updateDisputedRecords(data) {
    return this.http.post(this.baseUrl.concat('/updateDisputedRecords'), data)
      .pipe(map(data => {
        return data;
      }),
        catchError(this.errorHandler)
      );
  }

  // role master api
  getRoleMasterData() {
    return this.http.get<any[]>(`${this.baseUrl}/roleMst`);
  }

  deleteReconcilationData(value: any) {
    return this.http.put(this.baseUrl.concat(`/reconmst/${value.id}/`), value)
      .pipe(map(data => {
        data['status'] = 1;
        return data;
      }));
  }

  saveSourceData(data) {
    if (data.id) {
      // Update Data

      //Delete sr_no field
      let initialItemRow = data.initialItemRow.filter(function (props) {
        delete props.sr_no;
        return true;
      });

      for (var i = 0; i < data.initialItemRow.length; i++) { 
        if (data.initialItemRow[i].id == '') {
          delete data.initialItemRow[i].id;
        }
      }

      console.log("SERVICE=>", data)
      return this.http.put(this.baseUrl.concat(`/source/${data.id}/`), data)
        .pipe(map(data => {
          data['status'] = 2;
          return data;
        }),
          catchError(this.errorHandler)
        );
    }
    else {
      // Insert Data

      //Remove all the id field from the data
      delete data['id']
      let initialItemRow = data.initialItemRow.filter(function (props) {
        delete props.id;
        delete props.sr_no;
        return true;
      });

      
      return this.http.post(this.baseUrl.concat(`/source/`), data)
        .pipe(map(data => {
          data['status'] = 1;
          return data;
        }),
          catchError(this.errorHandler)
        );
    }

  }

  saveReconcilationData(data) {
    if (data.id) {
      return this.http.put(this.baseUrl.concat('/reconmst/' + data.id + '/'), data)
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

      return this.http.post(this.baseUrl.concat('/reconmst/'), data)
        .pipe(map(data => {
          data['status'] = 1;
          return data;
        }),
          catchError(this.errorHandler)
        );
    }
  }

  saveReconcilationProcessData(data) {
    if (data.id) {
      for (var i = 0; i < data.initialItemRow.length; i++) {
        if (data.initialItemRow[i].id == '') {
          delete data.initialItemRow[i].id;
        }
      }
      return this.http.put(this.baseUrl.concat('/reconProcessMaster/' + data.id + '/'), data)
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
      return this.http.post(this.baseUrl.concat('/reconProcessMaster/'), data)
        .pipe(map(data => {
          data['status'] = 1;
          return data;
        }),
          catchError(this.errorHandler));
    }
  }

  deleteReconProcessData(value: any) {
    return this.http.put(this.baseUrl.concat(`/reconProcessMaster/${value.id}/`), value)
      .pipe(map(data => {
        data['status'] = 1;
        return data;
      }));
  }

  deleteSource(value: any) {
    return this.http.put(this.baseUrl.concat(`source/${value.id}/`), value)
      .pipe(map(data => {
        data['status'] = 1;
        return data;
      }));
  }
  errorHandler(error: HttpErrorResponse) {
    return throwError(error || "Server Error")
  }

  createTable(value) {
    console.log("In createTable ");
    return this.http.post<any[]>(`${this.baseUrl}/source/dynamic`, value)
    // return this.http.post(this.baseUrl.concat(`/source/dynamic/`), value)
  }

  run_reconciliation(value) {
    console.log("In run_reconciliation ");
    return this.http.post<any[]>(`${this.baseUrl}/reconProcessMaster/run_reconciliation`, value)
  }

  load_data(value) {
    console.log("In load_data");
    return this.http.post<any[]>(`${this.baseUrl}/reconProcessMaster/load_data`, value).pipe(map(data => {
      data['status'] = 1;
      return data;
    }),
      catchError(this.errorHandler));
  }
// Schedule Batch

getScheduleBatchMstData() {
  return this.http.get<any[]>(`${this.baseUrl}/scheduleBatchMst`);
}

saveScheduleProcessMstData1(data) {
  return this.http.post(this.baseUrl.concat('/scheduleBatchMst/'), data)
    .pipe(map(data => {
      data['status'] = 1;
      return data;
    }),
      catchError(this.errorHandler));
}

saveScheduleProcessMstData(data) {
  console.log(data);

  if (data.id) {
    return this.http.put(this.baseUrl.concat('/scheduleBatchMst/' + data.id + '/'), data)
      .pipe(map(data => {
        data['status'] = 2;
        return data;
      }),
        catchError(this.errorHandler)
      );
  }
  else {
    delete data['id'];
    return this.http.post(this.baseUrl.concat('/scheduleBatchMst/'), data)
      .pipe(map(data => {
        data['status'] = 1;
        return data;
      }),
        catchError(this.errorHandler));
  }
}

deleteScheduleProcessMstData(value: any) {
  return this.http.put(this.baseUrl.concat(`/scheduleBatchMst/${value.id}/`), value)
    .pipe(map(data => {
      data['status'] = 1;
      return data;
    }));
}

}
