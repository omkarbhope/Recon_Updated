import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import{ GlobalConstants } from 'src/app/global/global-constants';

@Injectable({
  providedIn: 'root'
})
export class CompanySetupService {
  
  private apiroot = GlobalConstants.baseUrl;

  constructor(  private http : HttpClient
    ) { }

  getCompanyData() {
    return this.http.get(this.apiroot.concat('/company/'));
  }

  saveCompanyData(formValue) {
    if(formValue.ID){
      formValue.updated_by = formValue.USERID
      return this.http.put(this.apiroot.concat(`/company/${formValue.ID}/`), formValue).pipe(map(data => {
        data['status'] = 2;
        return data;
      })
      );
    }
    formValue.entity_share_id = formValue.company_shortname+"-" ;
    return this.http.post(
      this.apiroot.concat('/company/'),
      formValue
    ).pipe(map(data => {
      data['status'] = 1;
      return data;
    }))
  }

  deleteCompanyData(company){
    company.is_deleted = 'Y';
    return this.http.put(this.apiroot.concat(`/company/${company.ID}/`),
      company
    ).pipe(map(data => {
      data['status'] = 1;
      return data;
    }));
  }

  getLocation(location_id){
    return this.http.get(this.apiroot.concat(`/location/${location_id}/`))
  }

  getCountryData(country_id){
    return this.http.get(this.apiroot.concat(`/country/${country_id}/`));
  }

  getStateData(state_id){
    return this.http.get(this.apiroot.concat(`/state/${state_id}/`));
  }

  getCityData(city_id){
    return this.http.get(this.apiroot.concat(`/city/${city_id}/`));
  }

  getAllCountryData(){
    return this.http.get(this.apiroot.concat(`/country/`));
  }

  getAllStateData(country_id){
    return this.http.get(this.apiroot.concat(`/country/${country_id}/`));
  }

  getAllCityData(state_id){
    return this.http.get(this.apiroot.concat(`/state/${state_id}/`));
  }

  getLocationData(){
    return this.http.get(this.apiroot.concat('/location/'));
  }

  getRoleData() {
    return this.http.get(this.apiroot.concat('/roleMst/'));
  }

  getCurrencyData(country_id){
    return this.http.get(this.apiroot.concat(`/currency/ofcountry/${country_id}/`));
  }

  getUserData(){
    return this.http.get(this.apiroot.concat('/user/'));
  }

  getOwnerStatusData(){
    return this.http.get(this.apiroot.concat('/master/oftype/Ownership'))
  }

  getTransactionTypeData(){
    return this.http.get(this.apiroot.concat('/transactiontypemst/'));
  }

  getTableNameData(){
    return this.http.get(this.apiroot.concat('/accesstablenames/'));
  }

  getTableFieldName(tablename){
    return this.http.post(this.apiroot.concat('/accesstablefieldname/'),tablename);
  }

  getUserFormData() {
    return this.http.get(this.apiroot.concat('/employee/'));
  }

  saveTransactionTypeData(formValue) {
    if(formValue.ID){
      formValue.updated_by = formValue.USERID
      return this.http.put(this.apiroot.concat(`/transactiontypemst/${formValue.ID}/`), formValue).pipe(map(data => {
        data['status'] = 2;
        return data;
      })
      );
    }
    formValue.created_by = formValue.USERID;
    formValue.entity_share_id = formValue.transaction_name+"-" ;
    return this.http.post(
      this.apiroot.concat('/transactiontypemst/'),
      formValue
    ).pipe(map(data => {
      data['status'] = 1;
      return data;
    }))
  }

  saveUserFormData(form) {
    if(form.id)
    {
      return this.http.put(this.apiroot.concat('/employee/'+form.id+'/'), form).pipe(map(data => {
        data['status'] = 1;
        return data;
      })
      );
    }
    else
    {
      return this.http.post(this.apiroot.concat('/employee/'), form).pipe(map(data => {
        data['status'] = 2;
        return data;
      })
      );
    }
  }

  SaveAuthUser(form) {
    if(form.id)
    {
      return this.http.put(this.apiroot.concat('/user/'+form.id+'/'), form).pipe(map(data => {
        data['status'] = 1;
        return data;
      })
      );
    }
    else
    {
      return this.http.post(this.apiroot.concat('/user/'), form).pipe(map(data => {
        data['status'] = 2;
        return data;
      })
      );
    }
  }
  
  deleteTransactionTypeData(transaction_type){
    transaction_type.is_deleted = 'Y';
    return this.http.put(this.apiroot.concat(`/transactiontypemst/${transaction_type.ID}/`),
    transaction_type
    ).pipe(map(data => {
      data['status'] = 1;
      return data;
    }));
  }

  deleteUserFormData(id) {
    console.log("In Service deleteLocationData");
    console.log(id);
    return this.http.delete(this.apiroot.concat('/employee/'+id+'/'), id);
  }

}
