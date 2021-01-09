import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, FormControl } from '@angular/forms';
import { DynamicScriptLoaderService } from './../../services/dynamic-script-loader.service';
import { CompanySetupService } from 'src/app/services/company-setup.service';
import Swal from 'sweetalert2';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import{ GlobalConstants } from 'src/app/global/global-constants';
declare const $: any;

@Component({
  selector: 'app-transaction-type',
  templateUrl: './transaction-type.component.html',
  styleUrls: ['./transaction-type.component.sass']
})
export class TransactionTypeComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  frontEndUrl = GlobalConstants.frontEndUrl;

  transactionForm: FormGroup;
  transactiontypeData = [];
  tablenameData = [];
  HeaderFieldNameData = [];
  DetailFieldNameData = [];
  BTN_VAL = 'Submit';
  submitted = false;
  is_accounting_required: boolean;
  
  APPLICATION_ID: string;
  USERID: string;
  SUB_APPLICATION_ID: string;
  CREATED_BY: string;
  tbl_FilteredData = [];

  columns = [
    { name: 'Transaction Type Master' },
    { name: 'Header Table Name' },
    { name: 'Header Field Name' },
    { name: 'Detail Table Name' },
    { name: 'Detail Field Name' },  
    { name: 'Join Condition' },
    { name: 'Accounting Table Name' }    
  ];
  constructor(private formBuilder: FormBuilder, private companySetupService: CompanySetupService, private dynamicScriptLoader: DynamicScriptLoaderService) { }

  ngOnInit(): void {
    this.APPLICATION_ID = localStorage.getItem('APPLICATION_ID');
    this.USERID = localStorage.getItem('ID');
    this.SUB_APPLICATION_ID = localStorage.getItem('SUB_APPLICATION_ID');
    this.CREATED_BY = localStorage.getItem('USER_ID');

   
    this.transactionForm = this.formBuilder.group({
      transaction_name: ['', Validators.required],
      tbl_transaction_header: ['', Validators.required],
      tbl_transaction_details: ['', Validators.required],
      tbl_transaction_header_field: ['', Validators.required],
      tbl_transaction_details_field: ['', Validators.required],
      join_condition: ['', Validators.required],
      tbl_accounting: ['', Validators.required],
      is_accounting_required : false,

      sub_application_id: [this.SUB_APPLICATION_ID],
      is_deleted: 'N',
      ID: [''],
      application_id:  [this.APPLICATION_ID],
      USERID: [this.USERID],
      created_by: [this.CREATED_BY],
      updated_date_time: [Date],
      entity_share_id: [''],
      share_id: [1],
      
    });

    $( document ).ready(function() {
      $('#new_entry_form').hide();
      $('#new_entry_title').hide();
      $('#btn_list').hide();
    });

    this.companySetupService.getTransactionTypeData().subscribe((data: []) => {
      this.transactiontypeData = data.filter(function (data: any) {
        return data.is_deleted == 'N';
      });
      this.tbl_FilteredData = data.filter(function (data: any) {
        return data.is_deleted == 'N';
      });
    });

    this.companySetupService.getTableNameData().subscribe((data: []) => {
      this.tablenameData = data;
    });

    this.transactionForm.get('tbl_transaction_header').valueChanges.subscribe(val => {
      this.companySetupService.getTableFieldName(val).subscribe((data: []) => {
        this.HeaderFieldNameData = data;
      })
    });

    this.transactionForm.get('tbl_transaction_details').valueChanges.subscribe(val => {
      this.companySetupService.getTableFieldName(val).subscribe((data: []) => {
        this.DetailFieldNameData = data;
      })
    });

    'use strict';
    this.startScript();
    this.showList()
  }  

  // Table 
  tbl_FilterDatatable(event) {
    const val = event.target.value;
    let colsAmt = 9;
    const keys = Object.keys(this.tbl_FilteredData[0]);
    this.transactiontypeData = this.tbl_FilteredData.filter(function(item) {
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

  get f() { return this.transactionForm.controls; }

  onSubmit(event) {
    this.submitted = true;
    Object.keys(this.transactionForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.transactionForm.get(key).errors;
        if (controlErrors != null) {
             Object.keys(controlErrors).forEach(keyError => {});
           }
        });
    event.preventDefault();
    if (this.transactionForm.invalid) {
      return;
    }   
    this.companySetupService.saveTransactionTypeData(this.transactionForm.value).subscribe(data => {
      if (data['status'] == 1) {
        this.showList();
        this.transactiontypeData.push(data);
        Swal.fire({
          title: 'Your record has been added successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }

      //Updating data
      if (data['status'] == 2) {
        this.showList();
        this.transactiontypeData[this.transactiontypeData.findIndex(item => item.id == data['id'])] = data;
        Swal.fire({
          title: 'Your record has been updated successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        this.transactionForm.reset({
          sub_application_id: [this.SUB_APPLICATION_ID],
          ID: [''],
          application_id: [this.APPLICATION_ID],
          USERID: [this.USERID],
          updated_date_time: [Date],
        })
        this.submitted = false;
      }
     // setTimeout(function(){location.href='http://localhost:4200//#/company-setup/transaction-type'} , 2000);
      let exact_frontEndUrl = this.frontEndUrl + "/#/company-setup/transaction-type";
      setTimeout(function(){location.href= exact_frontEndUrl} , 2000);
    },
    error => {
      //Failure
      console.log(error);
      Swal.fire('Record Already Exists!')
    });
  }

  editTransactionTypeData(transaction_type) {
    this.transactionForm.patchValue({     
      transaction_name: transaction_type.transaction_name,
      tbl_transaction_header: transaction_type.tbl_transaction_header,
      tbl_transaction_header_field: transaction_type.tbl_transaction_header_field,
      tbl_transaction_details: transaction_type.tbl_transaction_details,
      tbl_transaction_details_field: transaction_type.tbl_transaction_details_field,
      join_condition: transaction_type.join_condition,
      tbl_accounting: transaction_type.tbl_accounting,
      is_accounting_required:transaction_type.is_accounting_required,
      ID : transaction_type.id,
      updated_date_time : new Date(),
      USERID : transaction_type.USERID
    });
    this.BTN_VAL='Update';
    var id=$("#ID").val();
		if(id!='')
		{
      $("#new_entry_form").show();
			$("#new_entry_title").show();
			$("#btn_list").hide();
			$("#btn_new_entry").hide();
			$("#list_form").hide();
      $("#list_title").hide();      
    }
    
  }

  cancelForm() {
    this.transactionForm.reset({
      sub_application_id: [this.SUB_APPLICATION_ID],
      ID: [''],
      application_id: [this.APPLICATION_ID],
      USERID: [this.USERID],
      updated_date_time: [Date],
    })
    this.submitted = false;
    this.showList();
  }

  deleteTransactionTypeData(transaction_type) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        transaction_type.is_deleted = 'Y';
        transaction_type.ID = transaction_type.id;
        this.companySetupService.deleteTransactionTypeData(transaction_type).subscribe((data: any) => {
            if (data.status == 1) {
              this.transactiontypeData.splice(
                this.transactiontypeData.findIndex(data => data.id === transaction_type.ID), 1
              )
              Swal.fire({
                title: 'Your record has been deleted successfully!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
            }
            let exact_frontEndUrl = this.frontEndUrl + "/#/company-setup/transaction-type";
            setTimeout(function(){location.href= exact_frontEndUrl} , 2000);
          });
      } 
    })
  }
  
  isaccountingrequired(event: MatSlideToggle){
    if (event.checked) {     
      this.is_accounting_required= true;
    }
    else {
      this.is_accounting_required = false;
    }
  }
}

