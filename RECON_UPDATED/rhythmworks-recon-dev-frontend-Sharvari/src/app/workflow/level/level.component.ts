import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ReconcilationService } from 'src/app/services/reconcilation.service';
import { CommonSetupService } from 'src/app/services/common-setup.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DynamicScriptLoaderService } from './../../services/dynamic-script-loader.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import { WorkflowService } from 'src/app/services/workflow.service';
import { GlobalConstants } from 'src/app/global/global-constants';
declare const $: any;


@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.sass']
})
export class LevelComponent implements OnInit {

  @ViewChild('roleTemplate', { static: true }) roleTemplate: TemplateRef<any>;
  
  frontEndUrl = GlobalConstants.frontEndUrl;
  
  register: FormGroup;
  hide = true;
  agree = false;

  levelData: any = [];
  activityData: any = [];
  actionData: any = [];
  BTN_VAL = 'Submit';
  submitted = false;
  APPLICATION_ID: string;
  SUB_APPLICATION_ID: string;
  CREATED_BY: string;

  ngOnInit(): void {
    this.APPLICATION_ID = localStorage.getItem('APPLICATION_ID');
    this.SUB_APPLICATION_ID = localStorage.getItem('SUB_APPLICATION_ID');
    this.CREATED_BY = localStorage.getItem('ID');
    this.startScript();
    $('#list_form').show();
    $('#list_title').show();
    $('#btn_new_entry').show();
    $('#btn_list').hide();
    $('#new_entry_form').hide();
    $('#new_entry_title').hide();
    this.register = this.fb.group({
      level: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      termcondition: [false],
      sub_application_id: [this.SUB_APPLICATION_ID],
      application_id: [this.APPLICATION_ID],
      created_by: [this.CREATED_BY],
      initialItemRow: this.fb.array([this.initialitemRow()])
    });
  }

  initialitemRow() {
    return this.fb.group({
      id: [''],
      activity_ref_id: ['', Validators.required],
      sequence_number: ['', [Validators.required,Validators.pattern('[0-9]+')]],
      action_ref_id: ['', Validators.required],
      next_sequence_number: ['', [Validators.required,Validators.pattern('[0-9]+')]],
      sub_application_id: [this.SUB_APPLICATION_ID],
      application_id: [this.APPLICATION_ID],
    });
  }

  get formArr() {
    return this.register.get('initialItemRow') as FormArray;
  }

  addNewRow() {
    this.formArr.push(this.initialitemRow());
  }

  deleteRow(index) {
    if (this.formArr.length == 1) {
      return false;
    } else {
      this.formArr.removeAt(index);
      return true;
    }
  }

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  constructor(private fb: FormBuilder,private workflowService: WorkflowService,private commonSetupService: CommonSetupService,private reconcilationService: ReconcilationService,private dynamicScriptLoader: DynamicScriptLoaderService,private _snackBar: MatSnackBar) {
    this.workflowService.getLevelData().subscribe((data: []) => {
      this.levelData = data;
    });
    this.workflowService.getActivityData().subscribe((data: []) => {
      this.activityData = data;
    });
    this.workflowService.getActionData().subscribe((data: []) => {
      this.actionData = data;
    });
    
  }
  
  onRegister() {
    console.log('Form Value', this.register.value);
    this.submitted = true;
  
      if (this.register.invalid) {
        return;
      } else {
        this.workflowService.saveLevelData(this.register.value).subscribe((data: any) => {
        console.log("In save function ");
        console.log(data);
          if (data.status === 1) {
            Swal.fire({
              icon: 'success',
              title: 'Your record has been added successfully!',
              showConfirmButton: false,
              timer: 2000
            });
            //this.ActivityData.push(data);
          }
        
          if (data.status === 2) {
            Swal.fire({
              title: 'Your record has been updated successfully!',
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
          let exact_frontEndUrl = this.frontEndUrl + "/#/workflow/level";
          setTimeout(function(){location.href= exact_frontEndUrl} , 2000);
          //setTimeout(function(){location.href='http://localhost:4200/#/workflow/level'} , 2000);
        },
          (error: any) => {
            // console.log("ERROR",error.error.split(" ")[0])
            console.log("ERRRRROR", error)
            console.log("sub_application_id:",this.register)
  
            //Error Meassage
            let message=""
            try
            {
              //Get the error message from exception thrown by the django
              message=error.error.substring(1,100) 
            }catch(err){
              console.log(err)
            }
            if(message.includes("activity_name")){
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

  async startScript() {
    console.log("In startScript");
    // tslint:disable-next-line:max-line-length
    await this.dynamicScriptLoader.load('form.min', 'bootstrap-colorpicker', 'dataTables.buttons', 'buttons.flash', 'jszip', 'buttons.html5', 'buttons.print').then(data => {
      this.loadData();
    }).catch(error => console.log(error));
  }

  private loadData() {
    $(".select2").select2();
    $('#tableExport').DataTable({
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ]
    });

    $('#new_entry_form').hide();
    $('#new_entry_title').hide();
    $('#btn_list').hide();
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
  }

  setExistingArray(initialArray = []): FormArray {
    const formArray = new FormArray([]);
    initialArray.forEach(element => {
      formArray.push(this.fb.group({
      id: element.id,
      activity_ref_id: element.activity_ref_id,
      sequence_number: element.sequence_number,
      action_ref_id: element.action_ref_id,
      next_sequence_number: element.next_sequence_number,
      sub_application_id: [this.SUB_APPLICATION_ID],
      application_id: [this.APPLICATION_ID],
      }));
    });

    return formArray;
  }

  editLevelData(location) {
    this.register.patchValue({
      level: location.level,
      id: location.id,
      initialItemRow: location.initialItemRow,
    });
    this.register.setControl('initialItemRow', this.setExistingArray(location.initialItemRow))
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

  deleteLevelData(id){
    this.workflowService.deleteLevelData(id).subscribe((data:any)=>{
      if (data == 1) {
        Swal.fire({
          title: 'Your record has been deleted successfully!',
          icon: 'warning',
          showConfirmButton: false
        });
    }
    let exact_frontEndUrl = this.frontEndUrl + "/#/workflow/level";
    setTimeout(function(){location.href= exact_frontEndUrl} , 2000);
    //setTimeout(function(){location.href='http://localhost:4200/#/workflow/level'} , 2000);
    });
    
  }   /////// Delete function remaining from define api hub

}
