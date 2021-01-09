import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiHubService } from 'src/app/services/api-hub.service';
import { ReconcilationService } from 'src/app/services/reconcilation.service';
import Swal from "sweetalert2";
import{ GlobalConstants } from 'src/app/global/global-constants';

declare const $: any;

@Component({
  selector: 'app-define-reconciliation-process',
  templateUrl: './define-reconciliation-process.component.html',
  styleUrls: ['./define-reconciliation-process.component.sass']
})

export class DefineReconciliationProcessComponent implements OnInit {
  frontEndUrl = GlobalConstants.frontEndUrl;

  defineReconProcess: FormGroup;
  btnValue = "Submit";
  submitted = false;
  isLoading = false;
  isNotLoading = null;
  operationNames = [];
  reconcilationMstName = [];
  apiNames = [];
  sourceNames = [];
  typeOfRequests = [];
  filteredSourceNames = [];
  reconProcessMasterData = [];

  constructor(private reconService: ReconcilationService, private formBuilder: FormBuilder, private apiService: ApiHubService) { }

  ngOnInit(): void {
    this.showList();
    this.defineReconProcess = this.formBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      reconcilation_ref_id: ['', Validators.required],
      sub_application_id: "RHYTHMFLOWS",
      application_id: "RHYTHMFLOWS",
      initialItemRow: this.formBuilder.array([this.initialitemRow()])
    });

    $( document ).ready(function() {
      $('#new_entry_form').hide();
      $('#new_entry_title').hide();
      $('#btn_list').hide();
    });

    this.reconService.getReconProcessMasterData().subscribe(data => {
      this.reconProcessMasterData = data;
    });


    this.reconService.getTblMasterData().subscribe(data => {
      this.operationNames = data.filter(function (data: any) {
        return data.master_type == 'Operation Name for Recon Process';
      });
    });

    this.reconService.getReconcilationMaster().subscribe(data => {
      this.reconcilationMstName = data;
    });

    this.reconService.getTblAPIDefMasterData().subscribe(data => {
      this.apiNames = data;
    });

    this.apiService.getApiMasterData().subscribe(data => {
      this.typeOfRequests = data;
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

  initialitemRow() {
    return this.formBuilder.group({
      id: ['', Validators.required],
      operation_ref_id: ['', Validators.required],
      source_name_ref_id: ['', Validators.required],
      api_ref_id: ['', Validators.required],
      request_type_ref_id: ['', Validators.required],
      sub_application_id: "RHYTHMFLOWS",
      application_id: "RHYTHMFLOWS",
    });
  }

  get formArray() {
    return this.defineReconProcess.get('initialItemRow') as FormArray;
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

  get f() {
    return this.defineReconProcess.controls;
  }


  // get source names according to reconames => true == Number.isInteger(this.reconcilationMstName[index]['source_name1_ref_id']) &&
  filterSourceNames(currentReconName) {
    for (let index = 0; index < this.reconcilationMstName.length; index++) {
      if (this.reconcilationMstName[index]['id'] == currentReconName) {
        if (0 != this.reconcilationMstName[index]['source_name1_ref_id']) {
          this.filteredSourceNames.push({ 'id': this.reconcilationMstName[index]['source_name1_ref_id'], 'source_name': this.reconcilationMstName[index]['source_name_1'] });
        }
        if (0 != this.reconcilationMstName[index]['source_name2_ref_id']) {
          this.filteredSourceNames.push({ 'id': this.reconcilationMstName[index]['source_name2_ref_id'], 'source_name': this.reconcilationMstName[index]['source_name_2'] });
        }
        if (0 != this.reconcilationMstName[index]['source_name3_ref_id']) {
          this.filteredSourceNames.push({ 'id': this.reconcilationMstName[index]['source_name3_ref_id'], 'source_name': this.reconcilationMstName[index]['source_name_3'] });
        }
        if (0 != this.reconcilationMstName[index]['source_name4_ref_id']) {
          this.filteredSourceNames.push({ 'id': this.reconcilationMstName[index]['source_name4_ref_id'], 'source_name': this.reconcilationMstName[index]['source_name_4'] });
        }
      }
    }
  }

  requestType: any;
  filterRequestType(currentRequestName, rowNum) {
    for (let index = 0; index < this.apiNames.length; index++) {
      if (this.apiNames[index]['id'] == currentRequestName) {
        var gridRow = (<FormArray>(this.defineReconProcess.get('initialItemRow'))).at(rowNum);
        $("#request_type_ref_id" + parseInt(rowNum + 1) + "_text").val(this.apiNames[index]['master_key']);
        gridRow.get('request_type_ref_id').setValue(this.apiNames[index]['id']);
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    this.isLoading = true;
    // this.reconService.saveReconcilationProcessData(this.defineReconProcess.value).subscribe((data: any) => {
    //   console.log(this.defineReconProcess.value, 'formmmmmmmmmmmmmmmmmmmmmm');

    //   if (data.status === 1) {
    //     Swal.fire({
    //       title: 'Your Record has been added successfully',
    //       icon: 'success',
    //       timer: 2000,
    //       showConfirmButton: false
    //     });

    //   }
    //   else if (data.status === 2) {
    //     Swal.fire({
    //       title: 'Your record has been updated successfully!',
    //       icon: 'success',
    //       timer: 2000,
    //       showConfirmButton: false
    //     });
    //   }
    //   else if (data.status === 0) {
    //     Swal.fire({
    //       title: 'Record Already Exist!',
    //       icon: 'warning',
    //       timer: 2000,
    //       showConfirmButton: false
    //     });
    //   }
    //  // setTimeout(function () { location.href = 'http://127.0.0.1:4200/#/reconcilation/define_reconcilation_process'; }, 2000);
    // });
    // this.reconService.saveReconcilationProcessData(this.defineReconProcess.value).subscribe((data: any) => {
    //     console.log(this.defineReconProcess.value, 'formmmmmmmmmmmmmmmmmmmmmm');
    // });
    this.reconService.saveReconcilationProcessData(this.defineReconProcess.value).subscribe((data: any) => {
        console.log(this.defineReconProcess.value, 'formmmmmmmmmmmmmmmmmmmmmm');
    });
    let reconcilation_ref_id_arr =[];

    reconcilation_ref_id_arr.push({
        "reconcilation_ref_id": this.defineReconProcess.value.reconcilation_ref_id,
        "reconcilation_operation_arr":   this.defineReconProcess.value.initialItemRow
    })

    console.log("Recon ID = >", this.defineReconProcess.value.reconcilation_ref_id)
    console.log("reconcilation_ref_id_arr ID = >", reconcilation_ref_id_arr)
      //Temporarily commented
      this.reconService.load_data(reconcilation_ref_id_arr).subscribe((data: any) => {
        this.isLoading = false;
        if (data.status === 1) {
          console.log("Executed Successfully ", data)
              Swal.fire({
                title: 'Load Data & Recon Successful',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
            }
        else{
              Swal.fire({
                title: 'Failed',
                icon: 'warning',
                timer: 2000,
                showConfirmButton: false
              });
            } 
        let exact_frontEndUrl = this.frontEndUrl + "/#/reconcilation/define_reconcilation_process";
        setTimeout(function(){location.href= exact_frontEndUrl} , 7000);
      });
  }

  setExistingArray(initialArray = []): FormArray {
    const formArray = new FormArray([]);
    initialArray.forEach(element => {
      formArray.push(this.formBuilder.group({
        id: element.id,
        operation_ref_id: element.operation_ref_id,
        source_name_ref_id: element.source_name_ref_id,
        api_ref_id: element.api_ref_id,
        request_type_ref_id: element.request_type_ref_id,
        application_id: "RHYTHMWORKS",
        sub_application_id: "RHYTHMWORKS",
      }));
    });

    return formArray;
  }

  editReconProcess(payload) {
    this.showNewEntry();
    this.defineReconProcess.patchValue({
      id: payload.id,
      name: payload.name,
      reconcilation_ref_id: payload.reconcilation_ref_id,
      updated_date_time: new Date(),
    });
    this.defineReconProcess.setControl('initialItemRow', this.setExistingArray(payload.initialItemRow))
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

  deleteReconProcess(value: any) {
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
        this.reconService.deleteReconProcessData(value).subscribe((data: any) => {
          if (data.status == 1) {
            this.reconProcessMasterData.splice(
              this.reconProcessMasterData.findIndex(data => data.id === value.id), 1)
            Swal.fire({
              title: 'Your record has been deleted successfully!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            let exact_frontEndUrl = this.frontEndUrl + "/#/reconcilation/define_reconcilation_process";
            setTimeout(function(){location.href= exact_frontEndUrl} , 2000);
          }
        });
      }
    });
  }

  runRecon(){
    let reconcilation_ref_id_arr =[];
    
    reconcilation_ref_id_arr.push({
        "reconcilation_ref_id": this.defineReconProcess.value.reconcilation_ref_id
    })

    console.log("Recon ID = >", this.defineReconProcess.value.reconcilation_ref_id)
    console.log("reconcilation_ref_id_arr ID = >", reconcilation_ref_id_arr)
      //Temporarily commented
      this.reconService.run_reconciliation(reconcilation_ref_id_arr).subscribe((data: []) => {
        console.log("Executed Successfully ", data)
      });
  }

}
