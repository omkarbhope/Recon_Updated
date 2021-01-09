import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import{ GlobalConstants } from 'src/app/global/global-constants';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  baseUrl = GlobalConstants.baseUrl;

  constructor(private http: HttpClient) { }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error || "Server Error");
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  getWorkflowMstdata() {
    return this.http.get<any[]>(`${this.baseUrl}/workflowmst/`);
  }

  getActivityData() {
    return this.http.get(this.baseUrl.concat('activity/'));
  }

  getCompanyData() {
    return this.http.get(this.baseUrl.concat('company/'));
  }

  getMasterData() {
    return this.http.get(this.baseUrl.concat('master/'));
  }

  getActionData() {
    return this.http.get(this.baseUrl.concat('action/'));
  }

  getLevelData() {
    return this.http.get(this.baseUrl.concat('level/'));
  }
  getWorkflowData() {
    return this.http.get(this.baseUrl.concat('workflow/'));
  }

  saveWorkflowMstdata(data) {
    if (data.id) {
      return this.http.put(this.baseUrl.concat('/workflowmst/' + data.id + '/'), data)
        .pipe(map(data => {
          data['status'] = 2;
          return data;
        }),
          catchError(this.errorHandler)
        );
    }
    else {
      delete data['id'];
      return this.http.post(this.baseUrl.concat('/workflowmst/'), data)
        .pipe(map(data => {
          data['status'] = 1;
          return data;
        }),
          catchError(this.errorHandler));
    }
  }

  saveActivityData(form) {
    if(form.id)
    {
      
      return this.http.put(this.baseUrl.concat('activity/'+form.id+'/'), form).pipe(map(data => {
        data['status'] = 1;
        return data;
      })
      );
    }
    else
    {
      
      return this.http.post(this.baseUrl.concat('activity/'), form).pipe(map(data => {
        data['status'] = 2;
        return data;
      })
      );
    }
  }

  saveLevelData(form) {
    if(form.id)
    {
      for (var i = 0; i < form.initialItemRow.length; i++) {
        if (form.initialItemRow[i].id == '') {
          delete form.initialItemRow[i].id;
        }
      }
      return this.http.put(this.baseUrl.concat('level/'+form.id+'/'), form).pipe(map(data => {
        data['status'] = 1;
        return data;
      })
      );
    }
    else
    {
      delete form['id']
      let initialItemRow = form.initialItemRow.filter(function (props) {
        delete props.id;
        return true;
      });
      return this.http.post(this.baseUrl.concat('level/'), form).pipe(map(data => {
        data['status'] = 2;
        return data;
      })
      );
    }
  }

  deleteActivityData(id) {
    console.log("In Service deleteLocationData");
    console.log(id);
    return this.http.delete(this.baseUrl.concat('activity/'+id+'/'), id);
  }

  deleteLevelData(id) {
    console.log("In Service deleteLocationData");
    console.log(id);
    return this.http.delete(this.baseUrl.concat('activity/'+id+'/'), id);
  }

  deleteWorkflowMstdata(value: any) {
    return this.http.put(this.baseUrl.concat(`/workflowmst/${value.id}/`), value)
      .pipe(map(data => {
        data['status'] = 1;
        return data;
      }));
  }
}
