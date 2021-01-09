import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicScriptLoaderService } from './../../services/dynamic-script-loader.service';
import { CommonSetupService } from 'src/app/services/common-setup.service';
import Swal from 'sweetalert2';
import{ GlobalConstants } from 'src/app/global/global-constants';
import { DatatableComponent } from '@swimlane/ngx-datatable';

declare const $: any;

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.sass']
})
export class TermComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  frontEndUrl = GlobalConstants.frontEndUrl;
  
  termForm: FormGroup;
  submitted = false;
  BTN_VAL = 'Submit';
  token: string;
  APPLICATION_ID: string;
  SUB_APPLICATION_ID: string;
  USERID: string;
  CREATED_BY: string;
  tbl_FilteredData = [];

  columns = [
    { name: 'Term Code' },
    { name: 'Term Description' },
  ];

  termdata = [];

  constructor(private formBuilder: FormBuilder, private commonSetupService: CommonSetupService, private dynamicScriptLoader: DynamicScriptLoaderService) { }

  ngOnInit() {
    this.showList();
  //  this.token = localStorage.getItem('token');
    this.APPLICATION_ID = localStorage.getItem('APPLICATION_ID');
    this.USERID = localStorage.getItem('ID');
    this.SUB_APPLICATION_ID = localStorage.getItem('SUB_APPLICATION_ID');
    this.CREATED_BY = localStorage.getItem('USER_ID');

    this.termForm = this.formBuilder.group({
      term_code: ['', Validators.required],
      term_description: ['', Validators.required],
      sub_application_id: [this.SUB_APPLICATION_ID],
      is_deleted: 'N',
      ID: [''],
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

    this.commonSetupService.getTermData().subscribe((data: []) => {
      this.termdata = data.filter(function (data: any) {
        return data.is_deleted == 'N';
      });
      this.tbl_FilteredData = data.filter(function (data: any) {
        return data.is_deleted == 'N';
      });
    });

    'use strict';
    this.startScript();

  }

  //Setting up the edit environment
  editTermData(term) {
    this.termForm.patchValue({
      term_code: term.term_code,
      term_description: term.term_description,
      ID: term.id,
      updated_date_time: new Date(),
    });
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

  cancelForm(){
    this.termForm.reset({
      sub_application_id: [this.SUB_APPLICATION_ID],
      ID: [''],
      application_id: [this.APPLICATION_ID],
      USERID: [this.USERID],
      updated_date_time: [Date]
    });
    this.showList()
  }

  deleteTermData(value: any) {
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
        value.ID = value.id;
        this.commonSetupService.deleteTermData(value)
          .subscribe((data: any) => {
            if (data.status == 1) {
              this.termdata.splice(
                this.termdata.findIndex(data => data.id === value.ID)
              );
              Swal.fire({
                title: 'Your record has been deleted successfully!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });  
            }
          });
          let exact_frontEndUrl = this.frontEndUrl + "/#/common-setup/term";
          setTimeout(function(){location.href= exact_frontEndUrl} , 2000);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your record file is safe :)',
          'error'
        )
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
    $("#list_form").hide();
    $("#list_title").hide();
    $("#btn_new_entry").hide();
    $("#btn_list").show();
    $("#new_entry_form").show();
    $("#new_entry_title").show();
  }

  showList() {
    $('#tableExport').show();
    $("#list_form").show();
    $("#list_title").show();
    $("#btn_new_entry").show();
    $("#btn_list").hide();
    $("#new_entry_form").hide();
    $("#new_entry_title").hide();
  }

  // convenience getter for easy access to form fields
  get f() { return this.termForm.controls; }

  tbl_FilterDatatable(event) {
    const val = event.target.value;
    let colsAmt = 12;
    const keys = Object.keys(this.tbl_FilteredData[0]);
    this.termdata = this.tbl_FilteredData.filter(function(item) {
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


  onSubmit(event: Event) {
   
    this.submitted = true;
    event.preventDefault()
    // stop here if form is invalid
    if (this.termForm.invalid) {
      return;
    }
    else {
      this.commonSetupService.saveTermData(this.termForm.value)
        .subscribe((data: any) => {
          //Addition of new data
          if (data['status'] == 1) {
            this.showList();
            this.termdata.push(data);
            Swal.fire({
              title: 'Your record has been updated successfully!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
          //Updating data
          if (data['status'] == 2) {
            this.showList();
            this.termdata[this.termdata.findIndex(item => item.id == data['id'])] = data;
            Swal.fire({
              title: 'Your record has been added successfully!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            this.termForm.reset({
              sub_application_id: [this.SUB_APPLICATION_ID],
              ID: [''],
              application_id: [this.APPLICATION_ID],
              USERID: [this.USERID],
              updated_date_time: [Date],
            })
            this.submitted = false;
          }
          let exact_frontEndUrl = this.frontEndUrl + "/#/common-setup/term";
          setTimeout(function(){location.href= exact_frontEndUrl} , 2000);
        },
          error => {
            //Failure
            console.log(error);
            Swal.fire('Record Already Exists')

          });

    }
    this.BTN_VAL = 'Submit';
  }

}