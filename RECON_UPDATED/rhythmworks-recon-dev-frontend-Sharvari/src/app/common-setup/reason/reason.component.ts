import { Component, OnInit, ViewChild,  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicScriptLoaderService } from './../../services/dynamic-script-loader.service';
import { CommonSetupService } from 'src/app/services/common-setup.service';
import Swal from 'sweetalert2'; 
import { DatatableComponent } from '@swimlane/ngx-datatable';
import{ GlobalConstants } from 'src/app/global/global-constants';

declare const $: any;
//declare const swal: any;

@Component({
  selector: 'app-reason',
  templateUrl: './reason.component.html',
  styleUrls: ['./reason.component.sass'],
  providers: [CommonSetupService]
})
export class ReasonComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  frontEndUrl = GlobalConstants.frontEndUrl;
  rejectionreasonForm: FormGroup;
  submitted = false;
  BTN_VAL='Submit';
  rejectionreasondata = [];
 
  APPLICATION_ID: string;
  USERID: string;
  SUB_APPLICATION_ID: string;
  CREATED_BY: string;

  tbl_FilteredData = [];
  columns = [
    { name: 'Reason Code' },
    { name: 'Reason Description' }   
  ];

  // tslint:disable-next-line:max-line-length
  constructor(private formBuilder: FormBuilder,private commonSetupService: CommonSetupService,private dynamicScriptLoader: DynamicScriptLoaderService) {}

  ngOnInit() {
    this.APPLICATION_ID = localStorage.getItem('APPLICATION_ID');
    this.USERID = localStorage.getItem('ID');
    this.SUB_APPLICATION_ID = localStorage.getItem('SUB_APPLICATION_ID');
    this.CREATED_BY = localStorage.getItem('USER_ID');

    this.rejectionreasonForm = this.formBuilder.group({
      rej_reason_code: ['', Validators.required],
      rej_reason: ['', Validators.required],
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
  
    this.commonSetupService.getRejectionReasonData().subscribe((data: []) => {
      this.rejectionreasondata = data.filter(function (data: any) {
        return data.is_deleted == 'N';
      });
      this.tbl_FilteredData = data.filter(function (data: any) {
        return data.is_deleted == 'N';
      });
    });

    'use strict';
    this.startScript();
  }

  editRejectionReasonData(rejectionreason){
    this.rejectionreasonForm.patchValue({
      rej_reason_code: rejectionreason.rej_reason_code,
      rej_reason: rejectionreason.rej_reason,
      ID: rejectionreason.id,     
      updated_date_time : new Date(),
      USERID : rejectionreason.USERID     
    });
    
    this.BTN_VAL='Update';

    var id=$("#ID").val();
		if(id != '')
		{
      $("#new_entry_form").show();
 			$("#new_entry_title").show();
			$("#btn_list").hide();
			$("#btn_new_entry").hide();
			$("#list_form").hide();
			$("#list_title").hide();
		}
  }

  deleteRejectionReasonData(value: any){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        value.is_deleted = 'Y';
        this.commonSetupService.deleteReason(value).subscribe((data: any) => {
          if (data.status == 1) {
            this.rejectionreasondata.splice(
              this.rejectionreasondata.findIndex(data => data.id === value.id), 1
            )
            Swal.fire({
              title: 'Your record has been deleted successfully!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
          let exact_frontEndUrl = this.frontEndUrl + "/#/common-setup/reason";
          setTimeout(function(){location.href= exact_frontEndUrl} , 2000);
        });
      }
    });
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
  

  showNewEntry()
  {
    $("#list_form").hide(); 
    $("#list_title").hide();
    $("#btn_new_entry").hide();
    $("#btn_list").show();
    $("#new_entry_form").show();
    $("#new_entry_title").show();
  }

	showList()
  {
    $("#list_form").show();
    $("#list_title").show();
    $("#btn_new_entry").show();
    $("#btn_list").hide();
    $("#new_entry_form").hide();
    $("#new_entry_title").hide();
  }

  // convenience getter for easy access to form fields
  get f() { return this.rejectionreasonForm.controls; }

  tbl_FilterDatatable(event) {
    const val = event.target.value;
    let colsAmt = 12;
    const keys = Object.keys(this.tbl_FilteredData[0]);
    this.rejectionreasondata = this.tbl_FilteredData.filter(function(item) {
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
   
    // stop here if form is invalid
    if (this.rejectionreasonForm.invalid) {
      return;
    }
    else {
      this.commonSetupService.saveReasonData(this.rejectionreasonForm.value).subscribe((data: any) => {
          //Addition of new data
          if (data.status === 1) {           
            Swal.fire({
              title: 'Your record has been updated successfully!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });           
            this.rejectionreasondata.push(data);
            this.showList();
          }
          //Updating data
          if (data.status === 2) {
            this.showList();
            this.rejectionreasondata[this.rejectionreasondata.findIndex(item => item.id == data['id'])] = data;
            Swal.fire({
              title: 'Your record has been added successfully!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
          let exact_frontEndUrl = this.frontEndUrl + "/#/common-setup/reason";
          setTimeout(function(){location.href= exact_frontEndUrl} , 2000);
      },
      error => {
        //Failure
        console.log(error);
        Swal.fire('Record Already Exists!')
        }
       );
    }
  }

}
