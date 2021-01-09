import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowService } from 'src/app/services/workflow.service';
import Swal from "sweetalert2";
import { DynamicScriptLoaderService } from './../../services/dynamic-script-loader.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import{ GlobalConstants } from 'src/app/global/global-constants';

declare const $: any;

@Component({
  selector: 'app-define-workflow',
  templateUrl: './define-workflow.component.html',
  styleUrls: ['./define-workflow.component.sass']
})
export class DefineWorkflowComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  frontEndUrl = GlobalConstants.frontEndUrl;

  submitted = false;
  workflowForm: FormGroup;
  btnValue = 'Submit';
  workflowMasterData = [];
  tbl_FilteredData = [];

  APPLICATION_ID: string;
  USERID: string;
  SUB_APPLICATION_ID: string;

  columns = [
    { name: 'Name' },
    { name: 'Description' }
  ];

  constructor(private formBuilder: FormBuilder, private workflowService: WorkflowService, private dynamicScriptLoader: DynamicScriptLoaderService) { }
  
  ngOnInit(): void {
    this.APPLICATION_ID = localStorage.getItem('APPLICATION_ID');
    this.USERID = localStorage.getItem('ID');
    this.SUB_APPLICATION_ID = localStorage.getItem('SUB_APPLICATION_ID');

    this.showList();
    this.workflowForm = this.formBuilder.group({
      id: ['', Validators.required],
      workflow_name: ['', Validators.required],
      workflow_description: ['', Validators.required],
      sub_application_id: [this.SUB_APPLICATION_ID],
      application_id: [this.APPLICATION_ID],
      USERID: [this.USERID]      
    });

    $( document ).ready(function() {
      $('#new_entry_form').hide();
      $('#new_entry_title').hide();
      $('#btn_list').hide();
    });

   
    this.workflowService.getWorkflowMstdata().subscribe((data:any) => {
      this.workflowMasterData = data.filter(function (data: any) {
        return data.is_deleted == 'N';
      });
      this.tbl_FilteredData = data.filter(function (data: any) {
        return data.is_deleted == 'N';
      });
    });

    'use strict';
    this.startScript();

  }

 // Table 
 tbl_FilterDatatable(event) {
  const val = event.target.value;
  let colsAmt = 9;
  const keys = Object.keys(this.tbl_FilteredData[0]);
  this.workflowMasterData = this.tbl_FilteredData.filter(function(item) {
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

  showList() {
    $('#list_form').show();
    $('#list_title').show();
    $('#btn_new_entry').show();
    $('#btn_list').hide();
    $('#new_entry_form').hide();
    $('#new_entry_title').hide();
    this.submitted = false;
   // this.workflowForm.reset({sub_application_id:"Unknown",application_id:"Unknown",updated_date_time:new Date()});
    console.log("sub_application_id:",this.workflowForm)
  }

  showNewEntry() {
    $('#list_form').hide();
    $('#list_title').hide();
    $('#btn_new_entry').hide();
    $('#new_entry_form').show();
    $('#new_entry_title').show();
    $('#btn_list').show();   
    this.btnValue = 'Sumbit';
  }

  get f() {
    return this.workflowForm.controls;
  }

  
  onSubmit() {
    this.submitted = true;
    this.workflowService.saveWorkflowMstdata(this.workflowForm.value).subscribe((data: any) => {
      if (data.status === 1) {
        Swal.fire({
          title: 'Your Record has been added successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        this.workflowMasterData.push(data);
        this.showList()
      }
      else if (data['status'] == 2) {
        this.showList();
        this.workflowMasterData[this.workflowMasterData.findIndex(item => item.id == data['id'])] = data;
        Swal.fire({
          title: 'Your record has been updated successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        this.workflowForm.reset({
          sub_application_id: [this.SUB_APPLICATION_ID],
          ID: [''],
          application_id: [this.APPLICATION_ID],
          USERID: [this.USERID],
          updated_date_time: [Date],
        })
        this.submitted = false;
      }
      let exact_frontEndUrl = this.frontEndUrl + "/#/workflow/define_workflow";
      setTimeout(function(){location.href= exact_frontEndUrl} , 2000);
      //setTimeout(function(){location.href='http://localhost:4200/#/workflow/define_workflow'} , 2000);
    },
    error => {
      //Failure
      console.log(error);
      Swal.fire('Record Already Exists!')
    });
    
  }
         
  editWorkFlow(row) {
    this.workflowForm.patchValue({
      id: row.id,
      workflow_name: row.workflow_name,
      workflow_description: row.workflow_description,
      updated_date_time: new Date()
    });
    this.btnValue = 'Update';
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

  cancelForm() {
    this.workflowForm.reset({
      sub_application_id: [this.SUB_APPLICATION_ID],
      ID: [''],
      application_id: [this.APPLICATION_ID],
      USERID: [this.USERID],
      updated_date_time: [Date],
    })
    this.submitted = false;
    this.showList();
  }

  deleteWorkFlow(value: any) {
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
        this.workflowService.deleteWorkflowMstdata(value).subscribe((data: any) => {
          if (data.status == 1) {
            this.workflowMasterData.splice(
              this.workflowMasterData.findIndex(data => data.id === value.id), 1
              )
            Swal.fire({
              title: 'Your record has been deleted successfully!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            setTimeout(function(){location.href='http://localhost:4200/#/workflow/define_workflow'} , 2000);
          }
        });
      }
    });
  }

}
