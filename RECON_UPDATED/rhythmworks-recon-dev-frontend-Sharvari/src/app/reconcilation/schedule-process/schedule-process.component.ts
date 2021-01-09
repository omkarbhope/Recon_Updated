import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiHubService } from 'src/app/services/api-hub.service';
import { ReconcilationService } from 'src/app/services/reconcilation.service';
import Swal from "sweetalert2";
import{ GlobalConstants } from 'src/app/global/global-constants';

declare const $: any;

@Component({
  selector: 'app-schedule-process',
  templateUrl: './schedule-process.component.html',
  styleUrls: ['./schedule-process.component.sass']
})
export class ScheduleProcessComponent implements OnInit {
  frontEndUrl = GlobalConstants.frontEndUrl;

  scheduleBatchForm: FormGroup;
  btnValue = "Submit";
  submitted = false;
  scheduleBatchMstData = [];
  reconProcessMasterData = [];
  frequencyType = [];

  constructor(private reconService: ReconcilationService, private formBuilder: FormBuilder, private apiService: ApiHubService) { }

  ngOnInit(): void {
    this.showList();

    this.scheduleBatchForm = this.formBuilder.group({
      id: ['', Validators.required],
      process_ref_id: ['', Validators.required],
      frequency_ref_id: ['', Validators.required],
      start_time: ['', Validators.required],
      planned_execution_ref_id: ['', Validators.required],
      application_id: "RHYTHMWORKS",
      sub_application_id: "RHYTHMWORKS"
    });

    $( document ).ready(function() {
      $('#new_entry_form').hide();
      $('#new_entry_title').hide();
      $('#btn_list').hide();
    });

    this.reconService.getScheduleBatchMstData().subscribe(data => {
      this.scheduleBatchMstData = data;
    });

    this.reconService.getReconProcessMasterData().subscribe(data => {
      this.reconProcessMasterData = data;
    });

    this.reconService.getTblMasterData().subscribe(data => {
      this.frequencyType = data.filter(function (data: any) {
        return data.master_type == 'Type of Frequency';
      });
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
  }

  get f() {
    return this.scheduleBatchForm.controls;
  }


  onSubmit() {
    this.submitted = true;
    this.reconService.saveScheduleProcessMstData(this.scheduleBatchForm.value).subscribe((data: any) => {
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
      let exact_frontEndUrl = this.frontEndUrl + "/#/reconcilation/sechedule_process";
      setTimeout(function(){location.href= exact_frontEndUrl} , 2000);
      //setTimeout(function () { location.href = 'http://127.0.0.1:4200/#/reconcilation/sechedule_process'; }, 2000);
    });

  }

  editScheduleBatch(payload) {
    this.showNewEntry();

    this.scheduleBatchForm.patchValue({
      id: payload.id,
      process_ref_id: payload.process_ref_id,
      frequency_ref_id: payload.frequency_ref_id,
      start_time: payload.start_time,
      planned_execution_ref_id: payload.planned_execution_ref_id,
      updated_date_time: new Date(),
    });

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

  deleteScheduleBatch(value: any) {
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
        this.reconService.deleteScheduleProcessMstData(value).subscribe((data: any) => {
          if (data.status == 1) {
            this.scheduleBatchMstData.splice(
              this.scheduleBatchMstData.findIndex(data => data.id === value.id), 1)
            Swal.fire({
              title: 'Your record has been deleted successfully!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            let exact_frontEndUrl = this.frontEndUrl + "/#/reconcilation/sechedule_process";
            setTimeout(function(){location.href= exact_frontEndUrl} , 2000);
           // setTimeout(function () { location.href = 'http://127.0.0.1:4200/#/reconcilation/sechedule_process'; }, 2000);
          }
        });
      }
    });
  }

}
