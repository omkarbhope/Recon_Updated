import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicScriptLoaderService } from './../../services/dynamic-script-loader.service';
import { CommonSetupService } from 'src/app/services/common-setup.service';
import Swal from 'sweetalert2';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import{ GlobalConstants } from 'src/app/global/global-constants';
declare const $: any;
// declare const Swal: any;

// @ts-ignore
@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.sass']
})
export class UomComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  frontEndUrl = GlobalConstants.frontEndUrl;

  uomForm: FormGroup;
  submitted = false;
  BTN_VAL='Submit';
  APPLICATION_ID: string;
  USERID: string;
  SUB_APPLICATION_ID: string;
  CREATED_BY: string;
  uomdata = [];

  columns = [
    { name: 'UOM Code' },
    { name: 'UOM Description' },
  ];

  tbl_FilteredData = [];
  private uom_code: number;
  private uom_description: string;
  private id: number;

  constructor(private formBuilder: FormBuilder,private commonSetupService: CommonSetupService,private dynamicScriptLoader: DynamicScriptLoaderService) { }

  ngOnInit() {
    this.showList()
    this.APPLICATION_ID = localStorage.getItem('APPLICATION_ID');
    this.USERID = localStorage.getItem('USER_ID');
    this.SUB_APPLICATION_ID = localStorage.getItem('SUB_APPLICATION_ID');
    this.CREATED_BY = localStorage.getItem('USER_ID');

    this.uomForm = this.formBuilder.group({
      uom_code: ['', Validators.required],
      uom_description: ['', Validators.required],
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

  this.commonSetupService.getUomData().subscribe((data:[])=>{
    this.uomdata = data;
    this.tbl_FilteredData = data.filter(function (data: any) {
      return data.is_deleted == 'N';
    });   
  });
  'use strict';
  this.startScript();
  }

  editUomData(uom){
    this.uomForm.patchValue({
      uom_code: uom.uom_code,
      uom_description: uom.uom_description,
      ID: uom.id
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

  deleteUomData(ID){
	Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
  		showCancelButton: true,
  		confirmButtonText: 'Yes, delete it!',
  		cancelButtonText: 'No, keep it'
	}).then((result) => {
  			if (result.value){
  				this.commonSetupService.deleteUomData(ID).subscribe((data:any)=>{
            Swal.fire({
              title: 'Your record has been deleted successfully!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });

        		})
          let exact_frontEndUrl = this.frontEndUrl + "/#/common-setup/uom";
          setTimeout(function(){location.href= exact_frontEndUrl} , 2000);
  			}
			else if (result.dismiss === Swal.DismissReason.cancel){
    			Swal.fire({icon: 'error', title: 'Canceled!', text: 'Your file is safe :)', showConfirmButton: false, timer: 3000})
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
  get f() { return this.uomForm.controls; }

  tbl_FilterDatatable(event) {
    const val = event.target.value;
    let colsAmt = 12;
    const keys = Object.keys(this.tbl_FilteredData[0]);
    this.uomdata = this.tbl_FilteredData.filter(function(item) {
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

  onSubmit() {
    this.submitted = true;
    if (this.uomForm.invalid) {
        return;
    }
    else{
      this.commonSetupService.saveUomData(this.uomForm.value).subscribe((data:any)=>{
        if (data['status'] == 1) {
          this.showList();
          this.uomdata.push(data);
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
          this.uomdata[this.uomdata.findIndex(item => item.id == data['id'])] = data;
          Swal.fire({
            title: 'Your record has been added successfully!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });          
        }
        let exact_frontEndUrl = this.frontEndUrl + "/#/common-setup/uom";
        setTimeout(function(){location.href= exact_frontEndUrl} , 2000);
      },
            error => {
            //Failure
            console.log(error);
            Swal.fire('Record Already Exists!')
      });
    }
  }
}
