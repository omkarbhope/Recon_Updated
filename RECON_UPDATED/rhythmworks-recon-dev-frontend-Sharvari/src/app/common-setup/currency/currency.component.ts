/* tslint:disable */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicScriptLoaderService } from './../../services/dynamic-script-loader.service';
import { CommonSetupService } from 'src/app/services/common-setup.service';
import Swal from 'sweetalert2';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import{ GlobalConstants } from 'src/app/global/global-constants';

declare const $: any;

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.sass']
})
export class CurrencyComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  frontEndUrl = GlobalConstants.frontEndUrl;

  currencydata = [];
  countrydata = [];
  currencyForm: FormGroup;
  submitted = false;
  BTN_VAL = 'Submit';
  APPLICATION_ID: string;
  USERID: string;
  SUB_APPLICATION_ID: string;
  CREATED_BY: string;

  tbl_FilteredData = [];

  columns = [
    { name: 'Currency Code' },
    { name: 'Currency Full Name' },
    { name: 'Symbol' },
    { name: 'Country' }   
  ];

  constructor(private formBuilder: FormBuilder, private commonSetupService: CommonSetupService, private dynamicScriptLoader: DynamicScriptLoaderService) { }

  ngOnInit() {
    this.APPLICATION_ID = localStorage.getItem('APPLICATION_ID');
    this.USERID = localStorage.getItem('id');
    this.SUB_APPLICATION_ID = localStorage.getItem('SUB_APPLICATION_ID');
    this.CREATED_BY = localStorage.getItem('USER_ID');
    
    'use strict';
    this.startScript();

    $('#list_form').show();
    $('#list_title').show();
    $('#btn_new_entry').show();
    $('#btn_list').hide();
    $('#new_entry_form').hide();
    $('#new_entry_title').hide();

    this.currencyForm = this.formBuilder.group({
      currency_code: ['', Validators.required],
      currency_name: ['', Validators.required],
      symbol: ['', Validators.required],
      country_id: [null, Validators.required],
      sub_application_id: [this.SUB_APPLICATION_ID],
      is_deleted: 'N',
      id: [''],
      application_id:  [this.APPLICATION_ID],
      USERID: [this.USERID],
      created_by: [this.CREATED_BY],
      updated_date_time: [Date]
    });

    $( document ).ready(function() {
      $('#new_entry_form').hide();
      $('#new_entry_title').hide();
      $('#btn_list').hide();
    });

    //Display Currency data
    this.commonSetupService.getCurrencyData().subscribe((data: []) => {
      this.currencydata = data.filter(function (data: any) {
        return data.is_deleted == 'N';
      });
      this.tbl_FilteredData = data.filter(function (data: any) {
        return data.is_deleted == 'N';
      });
    });

    this.commonSetupService.getCountryData().subscribe((data: []) => {
      this.countrydata = data;
    });
  }

  // Table 
  tbl_FilterDatatable(event) {
    const val = event.target.value;
    let colsAmt = 9;
    const keys = Object.keys(this.tbl_FilteredData[0]);
    this.currencydata = this.tbl_FilteredData.filter(function(item) {
      for (let i = 0; i < colsAmt; i++) {
        if (
          item[keys[i]]
            .toString()
            .toLowerCase()
            .indexOf(val) !== -1 ||
          !val
        ) {
          return true;
        }
      }
    });
    this.table.offset = 0;
  }

  //Delete currency
  deleteCurrencyData(value: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        value.is_deleted = 'Y';
        this.commonSetupService.deleteCurrency(value).subscribe((data: any) => {
          if (data.status == 1) {
            this.currencydata.splice(
              this.currencydata.findIndex(data => data.id === value.id), 1
            )
            Swal.fire({
              title: 'Your record has been deleted successfully!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
          let exact_frontEndUrl = this.frontEndUrl + "/#/common-setup/currency";
          setTimeout(function(){location.href= exact_frontEndUrl} , 5000);

        });
      }
    });
  }


  editCurrency(currency) {
    this.currencyForm.patchValue({
      currency_code: currency.currency_code,
      currency_name: currency.currency_name,
      symbol: currency.symbol,
      id: currency.id,
      country_id: currency.country_id,
      updated_date_time: new Date()
    });
    this.BTN_VAL = 'Update';
    const id = $('#id').val();
    if (id !== '') {
      $('#new_entry_form').show();
      $('#new_entry_title').show();
      $('#btn_list').hide();
      $('#btn_new_entry').hide();
      $('#list_form').hide();
      $('#list_title').hide();
    }
  }

  async startScript() {
    await this.dynamicScriptLoader.load('form.min', 'bootstrap-colorpicker', 'dataTables.buttons', 'buttons.flash', 'jszip', 'buttons.html5', 'buttons.print').then(data => {
      this.loadData();
    }).catch(error => console.log(error));
  }

  private loadData() {
    $(".select2").select2();
    $('#tableExport').DataTable({
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ]
    });

    $('#new_entry_form').hide();
    $('#new_entry_title').hide();
    $('#btn_list').hide();
  }

  showNewEntry() {
    $('#list_form').hide();
    $('#list_title').hide();
    $('#btn_new_entry').hide();
    $('#btn_list').show();
    $('#new_entry_form').show();
    $('#new_entry_title').show();
    this.BTN_VAL = 'Sumbit';
  }

  showList() {
    $('#list_form').show();
    $('#list_title').show();
    $('#btn_new_entry').show();
    $('#btn_list').hide();
    $('#new_entry_form').hide();
    $('#new_entry_title').hide();
    this.submitted = false;
  }

  // convenience getter for easy access to form fields
  get f() { return this.currencyForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.currencyForm.invalid) {
      return;
    } else {
      this.commonSetupService.saveCurrencyData(this.currencyForm.value).subscribe((data: any) => {
        //Insert Data
        if (data.status === 1) {
          Swal.fire({
            title: 'Your record has been updated successfully!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.currencydata.push(data);
          this.showList()
        }
        //Update Data
        if (data.status === 2) {
          Swal.fire({
            title: 'Your record has been added successfully!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          let index = this.currencydata.findIndex(item => item.id === data.id)
          this.currencydata[index] = data
          this.showList()
        }
        if (data == 0) {
          Swal.fire({
            title: 'Record Already Exist!',
            icon: 'warning',
            timer: 2000,
            showConfirmButton: false
          });
        }
       let exact_frontEndUrl = this.frontEndUrl + "/#/common-setup/currency";
          setTimeout(function(){location.href= exact_frontEndUrl} , 5000);
      },
        (error: any) => {
        
          let message=""
          let message1=""
          try
          {
            //Get the error message from exception thrown by the django
            message=error.error.substring(1,1000) 
            console.log("mESSAGE=====",message);
            
          }catch(err){
            console.log(err)
          }
          if(message.includes("<title>IntegrityError")){
              Swal.fire({
                title: 'Currency Code Already Exist!',
                icon: 'warning',
                showConfirmButton: false
              });
            }
          if(message.includes("currency_code")){
            Swal.fire({
              title: 'Currency Code Already Exist!',
              icon: 'warning',
              showConfirmButton: false
            });
          }
          else if(message.includes("country_id")){
            Swal.fire({
              title: 'Country Name Already Exist!',
              icon: 'warning',
              showConfirmButton: false
            });
          }
          else{
            Swal.fire({
              title: "Server Error",
              icon: 'warning',
              showConfirmButton: false
            });
          }
        });
    }
  }
}
