import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicScriptLoaderService } from './../../services/dynamic-script-loader.service';
import { CommonSetupService } from 'src/app/services/common-setup.service';
import Swal from 'sweetalert2';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import{ GlobalConstants } from 'src/app/global/global-constants';

declare const $: any;
//declare const swal: any;

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.sass']
})
export class LocationComponent implements OnInit {
  @ViewChild('roleTemplate', { static: true }) roleTemplate: TemplateRef<any>;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  frontEndUrl = GlobalConstants.frontEndUrl;

  locationForm: FormGroup;
  locationdata=[]; 
  countrydata:[];
  statedata:[];
  citydata:[];
  currencydata:[];
  submitted = false;
  BTN_VAL = 'Submit';
  APPLICATION_ID: string;
  USERID: string;
  SUB_APPLICATION_ID: string;
  CREATED_BY: string;
  tbl_data = [];
  tbl_FilteredData = [];
  columns = [
    { name: 'Location' },
    { name: 'Address1' },
    { name: 'Address2' },
    { name: 'Address3' },
    { name: 'Country' },
    { name: 'State' },
    { name: 'City' }
  ];
 
  constructor(private formBuilder: FormBuilder, private commonSetupService: CommonSetupService, private dynamicScriptLoader: DynamicScriptLoaderService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.APPLICATION_ID = localStorage.getItem('APPLICATION_ID');
    this.USERID = localStorage.getItem('ID');
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

    //this.userid = localStorage.getItem('id');

      this.locationForm = this.formBuilder.group({
      id:'',
      location_name: [null, Validators.required],
      address1: [null, Validators.required],
      address2: [null, Validators.required],
      address3: [null, Validators.required],
      country_id: [null, Validators.required],
      state_id: [this.statedata],
      city_id: [null, Validators.required],
      sub_application_id: [this.SUB_APPLICATION_ID],
      is_deleted: 'N',
      ID: [''],
      application_id:  [this.APPLICATION_ID],
      USERID: [this.USERID],
      created_by: [this.CREATED_BY],
      
    });

    $( document ).ready(function() {
      $('#new_entry_form').hide();
      $('#new_entry_title').hide();
      $('#btn_list').hide();
    });

    this.commonSetupService.getCountryData().subscribe((data: []) => {
      this.countrydata = data;
    });

    this.commonSetupService.getLocationData().subscribe((data: []) => {
      this.locationdata = data;
      this.tbl_FilteredData = data.filter(function (data: any) {
        return data.is_deleted == 'N';
      });
    });

    this.locationForm.get('country_id').valueChanges.subscribe(val => {
      this.statedata = [];
      console.log(val);
      if (val != null) {
        this.commonSetupService.getStateData(val).subscribe((data: []) => {
        this.statedata = data;
        })
      }
    })

    this.locationForm.get('state_id').valueChanges.subscribe(val => {
      this.citydata = [];
      if (val != null) {
        this.commonSetupService.getCityData().subscribe((data: []) => {
          this.citydata = data;
        })
      }
    })
  }

  async startScript() {
    await this.dynamicScriptLoader.load('dataTables.buttons', 'buttons.flash', 'jszip', 'buttons.html5', 'buttons.print').then(data => {
      this.loadData();
    }).catch(error => console.log(error));
  }

  private loadData() {
    $('#table').DataTable({
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ]
    });
  }

    showNewEntry() {
      $('#list_form').hide();
      $('#list_title').hide();
      $('#btn_new_entry').hide();
      $('#btn_list').show();
      $('#new_entry_form').show();
      $('#new_entry_title').show();
      this.BTN_VAL = 'Submit';
    }
  
    showList() {
      $('#list_form').show();
      $('#list_title').show();
      $('#btn_new_entry').show();
      $('#btn_list').hide();
      $('#new_entry_form').hide();
      $('#new_entry_title').hide();
      this.submitted = false;
      this.locationForm.reset({sub_application_id:"Unknown",application_id:"Unknown",updated_date_time:new Date()});
      console.log("sub_application_id:",this.locationForm)
    }
  
    // convenience getter for easy access to form fields
    get f() { return this.locationForm.controls; }

    // Table 
    tbl_FilterDatatable(event) {
    const val = event.target.value;
    let colsAmt = 12;
    const keys = Object.keys(this.tbl_FilteredData[0]);
    this.locationdata = this.tbl_FilteredData.filter(function(item) {
      for (let i = 0; i < colsAmt; i++) {
        console.log("In For Loop");
        console.log("item[keys[i]]====",item[keys[i]]);
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


    onSubmit() {
      this.submitted = true;
      if (this.locationForm.invalid) {
        return;
      } else {
        this.commonSetupService.saveLocationData(this.locationForm.value).subscribe((data: any) => {
        console.log("In save function ");
        console.log(data);
          if (data.status === 1) {
            Swal.fire({
              icon: 'success',
              title: 'Your record has been updated successfully!',
              showConfirmButton: false,
              timer: 2000
            });
            //this.locationdata.push(data);
          }
        
          if (data.status === 2) {
            Swal.fire({
              title: 'Your record has been added successfully!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
          if (data == 0) {
            Swal.fire({
              title: 'Record Already Exist!',
              icon: 'warning',
              timer: 2000,
              showConfirmButton: false
            });
          }
          let exact_frontEndUrl = this.frontEndUrl + "/#/common-setup/location";
          setTimeout(function(){location.href= exact_frontEndUrl} , 5000);
      
        },
          (error: any) => {
            //Error Meassage
            let message=""
            try
            {
              //Get the error message from exception thrown by the django
              message=error.error.substring(1,100) 
            }catch(err){
              console.log(err)
            }
            if(message.includes("location_name")){
            // if (error.error.currency_code) {
              Swal.fire({
                title: 'Location Name Already Exist!',
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

    editLocation(location) {
      this.locationForm.patchValue({
        location_name: location.location_name,
        address1: location.address1,
        address2: location.address2,
        address3: location.address3,
        id: location.id,
        state_id: location.state_id,
        city_id: location.city_id,
        country_id: location.country_id,       
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
  
    deleteLocationData(ID){      
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.value){
              this.commonSetupService.deleteLocationData(ID).subscribe((data:any)=>{
                Swal.fire({
                  title: 'Your record has been deleted successfully!',
                  icon: 'success',
                  timer: 2000,
                  showConfirmButton: false
                });
    
                })
                let exact_frontEndUrl = this.frontEndUrl + "/#/common-setup/location";
                setTimeout(function(){location.href= exact_frontEndUrl} , 5000);
            }
          else if (result.dismiss === Swal.DismissReason.cancel){
              Swal.fire({icon: 'error', title: 'Canceled!', text: 'Your file is safe :)', showConfirmButton: false, timer: 3000})
            }
        })
      }
  }
  
