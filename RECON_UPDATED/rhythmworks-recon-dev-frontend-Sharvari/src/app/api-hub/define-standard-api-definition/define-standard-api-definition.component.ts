import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { DynamicScriptLoaderService } from './../../services/dynamic-script-loader.service';
import { ApiHubService } from 'src/app/services/api-hub.service';
import Swal from 'sweetalert2';
import{ GlobalConstants } from 'src/app/global/global-constants';

declare const $: any;

@Component({
  selector: 'app-define-standard-api-definition',
  templateUrl: './define-standard-api-definition.component.html',
  styleUrls: ['./define-standard-api-definition.component.sass']
})

export class DefineStandardApiDefinitionComponent implements OnInit {
  frontEndUrl = GlobalConstants.frontEndUrl;
  defineStandardApiForm: FormGroup;
  fromDateControl: FormControl;
  companyData = [];
  channelData = [];
  typeOfRequest = [];
  typeOfAPI = [];
  protocol = [];
  authentication = [];
  typeOfCommunication = [];
  sessionKeyEncryption = [];
  encryptionType = [];
  verificationAlgo = [];
  standardApiMasterData = [];
  typeOfFormat = [];
  btnValue = "Submit";
  todayDate = new Date().toJSON().split('T')[0];
  submitted = false;
  self_api_checked = false;
  typeOfEncryptionData = [];
  APPLICATION_ID: string;
  USERID: string;
  SUB_APPLICATION_ID: string;
  CREATED_BY: string;

  constructor(private apiHubService: ApiHubService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.showList();

    this.APPLICATION_ID = localStorage.getItem('APPLICATION_ID');
    this.USERID = localStorage.getItem('USER_ID');
    this.SUB_APPLICATION_ID = localStorage.getItem('SUB_APPLICATION_ID');
    this.CREATED_BY = localStorage.getItem('USER_ID');

    this.defineStandardApiForm = this.formBuilder.group({
      id: ['', Validators.required],
      company_ref_id: ['', Validators.required],
      channel_ref_id: ['', Validators.required],
      from_date: [this.fromDateControl, Validators.required],
      to_date: ['2099-12-31'],
      revision_status: ['', Validators.required],
      self_api: ['', Validators.required],
      // sub_application_id: "RHYTHMFLOWS",
      // application_id: "RHYTHMFLOWS",
      sub_application_id: [this.SUB_APPLICATION_ID],
      application_id: [this.APPLICATION_ID],
      created_by: [this.CREATED_BY],
      initialItemRow: this.formBuilder.array([this.initialitemRow()])
    });

    $(document).ready(function () {
      $('#new_entry_form').hide();
      $('#new_entry_title').hide();
      $('#btn_list').hide();
    });

    this.defineStandardApiForm.get("from_date").valueChanges.subscribe(val => {
      if (val != null) {
        if (val === this.todayDate) {
          this.defineStandardApiForm.get("revision_status").setValue("Effective");
        } else {
          this.defineStandardApiForm.get("revision_status").setValue("Future");
        }
      }
    });

    this.apiHubService.getStandardApiMaster().subscribe(data => {
      this.standardApiMasterData = data;
    })

    this.apiHubService.getCompanyData().subscribe(data => {
      this.companyData = data;
    });

    this.defineStandardApiForm.get('company_ref_id').valueChanges.subscribe(val => {
      this.channelData = [];
      if (val != null) {
        this.apiHubService.getChannelAccCompanyData(val).subscribe(data => {
          this.channelData = data['companies'];
        })
      }
    });

    // this.apiHubService.getChannelDataAccCompany('').subscribe(data => {
    //   this.channelData = data;
    // });

    this.apiHubService.getTypeofRequestForAPI().subscribe((data: []) => {
      this.typeOfRequest = data;
    });

    this.apiHubService.getTypeofAPIData().subscribe((data: []) => {
      this.typeOfAPI = data;
    });

    this.apiHubService.getTypeofProtocol().subscribe((data: []) => {
      this.protocol = data;
    });
    this.apiHubService.getTypeofFileData().subscribe((data: []) => {
      this.typeOfFormat = data;
    });

    this.apiHubService.getTypeofAuthenticationData().subscribe((data: []) => {
      this.authentication = data;
    });

    this.apiHubService.getTypeofCommumnicationData().subscribe((data: []) => {
      this.typeOfCommunication = data;
    });

    this.apiHubService.getTypeOfEncryptionData().subscribe((data: []) => {
      this.typeOfEncryptionData = data;
    });


  }

  showList() {
    $('#list_form').show();
    $('#list_title').show();
    $('#btn_new_entry').show();
    $('#btn_list').hide();
    $('#new_entry_form').hide();
    $('#new_entry_title').hide();
  }
  showNewEntry() {
    $('#new_entry_form').show();
    $('#new_entry_title').show();
    $('#btn_list').show();
    $('#list_form').hide();
    $('#list_title').hide();
    $('#btn_new_entry').hide();
    this.submitted = false;

  }

  get f() {
    return this.defineStandardApiForm.controls;
  }

  initialitemRow() {
    return this.formBuilder.group({
      id: [''],
      request_type_ref_id: ['', Validators.required],
      api_type_ref_id: ['', Validators.required],
      protocol_type_ref_id: ['', Validators.required],
      file_format_type_ref_id: ['', Validators.required],
      authentication_type_ref_id: ['', Validators.required],
      communication_ref_id: ['', Validators.required],
      session_key_encryption_type_ref_id: ['', Validators.required],
      encryption_type_ref_id: ['', Validators.required],
      port: ['', Validators.required],
      verification_algorithm_ref_id: ['', Validators.required],
      end_point_url: ['', Validators.required],
      time_out: ['', Validators.required],
      sub_application_id: [this.SUB_APPLICATION_ID],
      application_id: [this.APPLICATION_ID],
      created_by: [this.CREATED_BY]
    });
  }

  get formArray() {
    return this.defineStandardApiForm.get('initialItemRow') as FormArray;
  }

  addNewRow() {
    this.formArray.push(this.initialitemRow());
  }

  deleteRow(index) {
    if (this.formArray.length == 1) {
      return false;
    } else {
      this.formArray.removeAt(index);
      return true;
    }
  }

  isItSelfAPI(e) {
    var is_self_api = e.checked == false ? 'N' : 'Y';
    this.defineStandardApiForm.get("self_api").setValue(is_self_api);
    this.self_api_checked = !this.self_api_checked;
  }

  cancelForm() {
    this.defineStandardApiForm.reset({
      sub_application_id: [this.SUB_APPLICATION_ID],
      ID: [''],
      application_id: [this.APPLICATION_ID],
      USERID: [this.USERID],
      updated_date_time: [Date],
    })
    this.submitted = false;
    this.showList();
  }

  onSubmit() {
    this.submitted = true;
    this.apiHubService.saveStandardApiData(this.defineStandardApiForm.value).subscribe((data: any) => {
      if (data.status === 1) {
        Swal.fire({
          title: 'Your Record has been added successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
      else if (data.status === 2) {
        Swal.fire({
          title: 'Your record has been updated successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
      else if (data.status === 0) {
        Swal.fire({
          title: 'Record Already Exist!',
          icon: 'warning',
          timer: 2000,
          showConfirmButton: false
        });
      }
      let exact_frontEndUrl = this.frontEndUrl + "/#/api-hub/define_standard_api";
      setTimeout(function () { location.href = exact_frontEndUrl }, 2000);
    });
  }

  setExistingArray(initialArray = []): FormArray {
    const formArray = new FormArray([]);
    initialArray.forEach(element => {
      formArray.push(this.formBuilder.group({
        id: element.id,
        request_type_ref_id: element.request_type_ref_id,
        api_type_ref_id: element.api_type_ref_id,
        protocol_type_ref_id: element.protocol_type_ref_id,
        file_format_type_ref_id: element.file_format_type_ref_id,
        authentication_type_ref_id: element.authentication_type_ref_id,
        communication_ref_id: element.communication_ref_id,
        session_key_encryption_type_ref_id: element.session_key_encryption_type_ref_id,
        encryption_type_ref_id: element.encryption_type_ref_id,
        port: element.port,
        verification_algorithm_ref_id: element.verification_algorithm_ref_id,
        end_point_url: element.end_point_url,
        time_out: element.time_out,
        sub_application_id: "RHYTHMFLOWS",
        application_id: "RHYTHMFLOWS"
      }));
    });
    return formArray;
  }

  editStandardApi(payload) {
    this.showNewEntry();
    this.self_api_checked = payload.self_api == 'Y' ? true : false;
    this.defineStandardApiForm.patchValue({
      id: payload.id,
      company_ref_id: payload.company_ref_id,
      channel_ref_id: payload.channel_ref_id,
      from_date: payload.from_date,
      to_date: payload.to_date,
      revision_status: payload.revision_status,
      updated_date_time: new Date(),
    });
    this.defineStandardApiForm.setControl('initialItemRow', this.setExistingArray(payload.initialItemRow));
    this.btnValue = 'Update';

    const id = $('#id').val();
    if (id != '') {
      $('#new_entry_form').show();
      $('#new_entry_title').show();
      $('#btn_list').show();
      $('#list_form').hide();
      $('#list_title').hide();
      $('#btn_new_entry').hide();
    }
  }

  deleteData(value: any) {
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
        for (var i = 0; i < value.initialItemRow.length; i++) {
          value.initialItemRow[i].is_deleted = 'Y';
        }
        this.apiHubService.deleteStandardAPI(value).subscribe((data: any) => {
          if (data.status == 1) {
            this.standardApiMasterData.splice(
              this.standardApiMasterData.findIndex(data => data.id === value.id), 1
            )
            Swal.fire({
              title: 'Your record has been deleted successfully!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            let exact_frontEndUrl = this.frontEndUrl + "/#/api-hub/define_standard_api";
            setTimeout(function () { location.href = exact_frontEndUrl }, 2000);
          }
        });
      }
    });
  }
  }