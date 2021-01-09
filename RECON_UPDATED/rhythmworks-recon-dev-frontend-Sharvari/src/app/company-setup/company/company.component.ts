import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, FormControl } from '@angular/forms';
import { DynamicScriptLoaderService } from './../../services/dynamic-script-loader.service';
import { CompanySetupService } from 'src/app/services/company-setup.service';
import Swal from 'sweetalert2';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import{ GlobalConstants } from 'src/app/global/global-constants';

declare const $: any;

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.sass']
})
export class CompanyComponent implements OnInit {

  frontEndUrl = GlobalConstants.frontEndUrl;

  companyForm: FormGroup;
  country_idControl: FormControl;
  state_idControl: FormControl;
  city_idControl: FormControl;
  locationControl: FormControl;
  currency_idControl: FormControl;
  belongs_toControl: FormControl;
  management_belongs_toControl: FormControl;
  isBranch: boolean;
  isManagedBy: boolean;
  locationSelected; boolean;
  companyData = [];
  BTN_VAL = 'Submit';
  submitted = false;
  stateData = [];
  countryData = [];
  cityData = [];
  locationData = [];
  userData = [];
  currencyData = [];
  ownershipStatusData = [];
  APPLICATION_ID: string;
  USERID: string;
  SUB_APPLICATION_ID: string;
  constructor(private formBuilder: FormBuilder, private companySetupService: CompanySetupService, private dynamicScriptLoader: DynamicScriptLoaderService) { }

  ngOnInit(): void {
    this.APPLICATION_ID = localStorage.getItem('APPLICATION_ID');
    this.USERID = localStorage.getItem('ID');
    this.SUB_APPLICATION_ID = localStorage.getItem('SUB_APPLICATION_ID');
    this.country_idControl = new FormControl(null);
    this.state_idControl = new FormControl(null);
    this.city_idControl = new FormControl(null);
    this.locationControl = new FormControl(null, Validators.required);
    this.currency_idControl = new FormControl();
    this.belongs_toControl = new FormControl(null);
    this.management_belongs_toControl = new FormControl(null);
    this.country_idControl.disable();
    this.state_idControl.disable();
    this.city_idControl.disable();
    this.locationSelected = false;
    this.isBranch = false;
    this.isManagedBy = false;

    this.companyForm = this.formBuilder.group({
      company_name: ['', Validators.required],
      company_shortname: ['', Validators.required],
      // status : ['', Validators.required],
      country_id: this.country_idControl,
      state_id: this.state_idControl,
      city_id: this.city_idControl,
      location_ref_id: this.locationControl,
      ownership_status_ref_id: [null, Validators.required],
      // cin: ['', [Validators.required, Validators.pattern('[L,U]{1}[0-9]{5}[A-Z]{2}[1-9]{1}[0-9]{3}[A-Z]{3}[0-9]{6}')]],
      // pan: ['', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      // tan: ['', [Validators.required, Validators.pattern('[A-Z]{4}[0-9]{5}[A-Z]{1}')]],
      // gst: ['', [Validators.required, Validators.pattern('[0-3]{1}[0-9]{1}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9]{1}Z[0-9A-Z]{1}')]],
      cin: ['', Validators.required],
      pan: ['', Validators.required],
      tan: ['', Validators.required],
      gst: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      contact_person_name: ['', Validators.required],
      currency_id: this.currency_idControl,
      is_holding_company: [false, Validators.required],
      belongs_to_company_id: this.belongs_toControl,
      percentage_holding: [null, [Validators.max(100), Validators.min(0), Validators.required]],
      is_group_company: [false, Validators.required],
      // contact_person_mobile_number: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('[1-9]{1}[0-9]{9}')]],
      contact_person_mobile_number: ['', Validators.required],
      is_this_branch: [false, Validators.required],
      is_this_under_same_management: [false, Validators.required],
      management_belongs_to_company_id: this.management_belongs_toControl,
      pincode: ['', [Validators.required, Validators.maxLength(8), Validators.pattern('[0-9]*')]],
      ad_code: [null],
      iec_code: [null],
      import_ad_code: [null],
      import_iec_code: [null],
      sub_application_id: [this.SUB_APPLICATION_ID],
      ID: [''],
      application_id: [this.APPLICATION_ID],
      USERID: [this.USERID],
      updated_date_time: [Date],
      entity_share_id: [''],
      share_id: ['',Validators.required]
    })

    this.companyForm.get('location_ref_id').valueChanges.subscribe(val => {
      if (val != null) {  
        this.locationSelected = true;
        this.companySetupService.getLocation(val).subscribe((data: []) => {
          this.companySetupService.getCountryData(data['country_id']).subscribe((data: []) => {
            this.countryData = data;
            this.companySetupService.getCurrencyData(this.countryData['id']).subscribe((data: []) => {
              this.currencyData = data;
              this.companyForm.controls['currency_id'].setValue(this.currencyData['id'])
            })
          })
          this.companySetupService.getStateData(data['state_id']).subscribe((data: []) => {
            this.stateData = data;
          })
          this.companySetupService.getCityData(data['city_id']).subscribe((data: []) => {
            this.cityData = data;
          })
        })
      }
    })


    this.companySetupService.getCompanyData().subscribe((data: []) => {
      this.companyData = data.filter(function (data: any) {
        return data.is_deleted == 'N';
      });
    });

    this.companySetupService.getLocationData().subscribe((data: []) => {
      this.locationData = data;
    })

    this.companySetupService.getOwnerStatusData().subscribe((data: []) => {
      this.ownershipStatusData = data;
      console.log("ownershipStatusData")
      console.log(data)
    })

    'use strict';
    this.startScript();

    this.showList()
  }

  async startScript() {
    // tslint:disable-next-line:max-line-length
    await this.dynamicScriptLoader.load('form.min', 'bootstrap-colorpicker', 'dataTables.buttons', 'buttons.flash', 'jszip', 'buttons.html5', 'buttons.print').then(data => {
      this.loadData();
    }).catch(error => { });
  }

  private loadData() {
    $('#tableExport').DataTable({
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ]
    });

    $("#new_entry_form").hide();
    $("#new_entry_title").hide();
    $("#btn_list").hide();
  }

  showNewEntry() {
    $("#list_form").hide();
    $("#list_title").hide();
    $("#btn_new_entry").hide();
    $("#btn_list").show();
    $("#new_entry_form").show();
    $("#new_entry_title").show();
  }

  showList() {
    this.BTN_VAL = 'Submit';
    $('#tableExport').show();
    $("#list_form").show();
    $("#list_title").show();
    $("#btn_new_entry").show();
    $("#btn_list").hide();
    $("#new_entry_form").hide();
    $("#new_entry_title").hide();
  }

  // convenience getter for easy access to form fields
  get f() { return this.companyForm.controls; }

  onSubmit(event) {

    this.submitted = true;
    Object.keys(this.companyForm.controls).forEach(key => {

      const controlErrors: ValidationErrors = this.companyForm.get(key).errors;
      if (controlErrors != null) {
            Object.keys(controlErrors).forEach(keyError => {
              console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
            });
          }
        });
    console.log('Vlaue', this.companyForm.value)
    event.preventDefault();
    if (this.companyForm.invalid) {
      return;
    }
    var companyValue = this.companyForm.value;
    this.companySetupService.saveCompanyData(companyValue).subscribe(data => {
      //Addition of new data
      if (data['status'] == 1) {
        this.showList();
        this.companyData.push(data);
        Swal.fire('Your record has been added successfully!');
      }
      //Updating data
      if (data['status'] == 2) {
        this.showList();
        this.companyData[this.companyData.findIndex(item => item.id == data['id'])] = data;
        Swal.fire('Your record has been updated successfully!',);
      }

      let exact_frontEndUrl = this.frontEndUrl + "/#/company-setup/term";
      setTimeout(function(){location.href= exact_frontEndUrl} , 2000);
      // setTimeout(function () { location.href = 'http://127.0.0.1:4200/#/common-setup/term' }, 2000);
    },
      error => {
        //Failure
        Swal.fire('Record Already Exists')

      });
    this.BTN_VAL = 'Submit';
  }

  editCompanyData(company) {
    for (let control in company) {
      if (company[control] === true) {
        company[control] = "True";
      }
      if (company[control] === false) {
        company[control] = "False";
      }
    }
    company.ID = company.id;
    company.updated_date_time = new Date();
    company.USERID = this.USERID;
    this.companyForm.patchValue(company);
    this.BTN_VAL = 'Update';

    var id = $("#ID").val();
    if (id != '') {
      $("#new_entry_form").show();
      $("#new_entry_title").show();
      $("#btn_list").hide();
      $("#btn_new_entry").hide();
      $("#list_form").hide();
      $("#list_title").hide();
    }
  }

  cancelForm() {
    this.companyForm.reset({
      sub_application_id: [this.SUB_APPLICATION_ID],
      ID: [''],
      application_id: [this.APPLICATION_ID],
      USERID: [this.USERID],
      updated_date_time: [Date],
      entity_share_id: [''],
    })
    this.submitted = false;
    this.isBranch = false;
    this.isManagedBy = false;
    this.locationSelected = false;
    this.showList();
  }

  deleteCompanyData(company) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        company.is_deleted = 'Y';
        company.ID = company.id;
        this.companySetupService.deleteCompanyData(company)
          .subscribe((data: any) => {
            if (data.status == 1) {
              this.companyData.splice(
                this.companyData.findIndex(data => data.id === company.ID)
              );
              Swal.fire(
                'Deleted!',
                'Your imaginary file has been deleted.',
                'success'
              )
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
  }

  isThisBranchChange(event: MatSlideToggleChange){
    if (event.checked) {
      this.isBranch = true;
      this.belongs_toControl.setValidators(Validators.required);
    }
    else {
      this.isBranch = false;
      this.belongs_toControl.clearValidators();
      this.belongs_toControl.updateValueAndValidity();
    }
  }

  isThisUnderSameManagement(event: MatSlideToggle){
    if (event.checked) {
      this.isManagedBy = true;
      this.management_belongs_toControl.setValidators(Validators.required);
    }
    else {
      this.isManagedBy = false;
      this.management_belongs_toControl.clearValidators();
      this.management_belongs_toControl.updateValueAndValidity();
    }
  }
}
