import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { DynamicScriptLoaderService } from './../../services/dynamic-script-loader.service';
import { ReconcilationService } from 'src/app/services/reconcilation.service';

import Swal from 'sweetalert2';
import { json } from 'ngx-custom-validators/src/app/json/validator';
import { analyzeAndValidateNgModules } from '@angular/compiler';

declare const $: any;

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.sass']
})
export class SourceComponent implements OnInit {

  companydata = [];
  masterdata = [];
  sourcedata = [];
  networks_types = [];
  source_table_field_data = [];
  file_types = [];
  field_types = [];
  section_types = [];
  dynamicArray: Array<any> = [];
  // public dynamicArray: any[] = [{ sr_no: "", section: "", field_name: "", field_type: "", length: "", is_key: "", id: 1000 }];
  newDynamic: any = {};
  channeldata = [];
  channel_idControl: FormControl;
  sectionControl: FormControl;
  fromDateControl: FormControl;
  fieldControl: FormControl;
  sourceForm: FormGroup;
  submitted = false;
  BTN_VAL = 'Submit';
  application_id: string;
  userid: string;
  sub_application_id: string;
  revision_status: string;
  counter = 1000;
  //-----------------------------------------------------------
  initialItemRow: [];
  newItem: FormGroup;
  //-----------------------------------------------------------

  todayDate = new Date().toJSON().split('T')[0];
  dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD'];
  // section_types1: any;
  // timepass: any;
  constructor(private formBuilder: FormBuilder, private reconciliationService: ReconcilationService, private dynamicScriptLoader: DynamicScriptLoaderService) { }


  ngOnInit(): void {
    var mainScope = this;
    this.application_id = localStorage.getItem('APPLICATION_ID');
    this.sub_application_id = localStorage.getItem('SUB_APPLICATION_ID');
    this.userid = localStorage.getItem('ID');
    this.channel_idControl = new FormControl(null, Validators.required)
    this.channel_idControl.disable();
    'use strict';
    this.startScript();
    this.showList();

    this.sourceForm = this.formBuilder.group({
      company_ref_id: [null, Validators.required],
      channel_ref_id: this.channel_idControl,
      source_name: ['', Validators.required],
      network_type_ref_id: [null, Validators.required],
      file_type_ref_id: [null, Validators.required],
      id: [''],
      // application_id: "Unknown",      //[this.application_id],
      application_id: [this.application_id],
      sub_application_id: "Unknown",
      from_date: this.fromDateControl,
      to_date: ['2099-12-31'],
      revision_status: ['', Validators.required],
      version_number: ['1'],

      initialItemRow: this.formBuilder.array([this.initialitemRow()])
    })

    $(document).ready(function () {
      $('#new_entry_form').hide();
      $('#new_entry_title').hide();
      $('#btn_list').hide();

      $(document).on('change', 'select[id^="field_data_type_ref_id"]', function (e) {
        var currentRow = $(this).closest('tr');
        var fieldLengthCol = $(currentRow).find(".field-length-col");
        var tableHeader = $(this).closest('table').find('th').eq($(fieldLengthCol).index());
        if ($(this).val() == 41) {
          tableHeader.text('Date Format');
          $(fieldLengthCol).find('input').hide();
          $(fieldLengthCol).find('select').show();
        } else {
          $(fieldLengthCol).find('input').val('').show();
          if ($(this).val() == 21) {
            tableHeader.text('Boolean Value');
            $(fieldLengthCol).find('input').attr('placeholder', 'e.g. true/false')
          } else if ($(this).val() == 22) {
            tableHeader.text('Decimal & Precision');
            $(fieldLengthCol).find('input').attr('placeholder', 'e.g. 10,2')
          } else {
            tableHeader.text('Length');
            $(fieldLengthCol).find('input').attr('placeholder', 'Enter valid integer')
          }
          $(fieldLengthCol).find('select').hide();
        }
      });

      $(document).on('change', 'select#date-format-feild', function (e) {
        var gridRow = (<FormArray>(mainScope.sourceForm.get("initialItemRow"))).at($(this).closest('tr').index());
        gridRow.get("field_length").setValue($(this).val());
      });
    });

    this.sourceForm.get("company_ref_id").valueChanges.subscribe(val => {
      this.channeldata = [];
      if (val != "null") {
        this.reconciliationService.getChannelData(val).subscribe((data: []) => {
          this.channeldata = data['companies'] // companies here returns name of channel for the selected company
        });
        this.channel_idControl.enable();
      }
      else {
        this.channel_idControl.disable();
      }
    })
    this.sourceForm.get("from_date").valueChanges.subscribe(val => {
      if (val != null) {
        if (val === this.todayDate) {
          this.sourceForm.get("revision_status").setValue("Effective")
        }
        else {
          this.sourceForm.get("revision_status").setValue("Future")
        }
      }
    })
    //Get Company data
    this.reconciliationService.getCompanyData().subscribe((data: []) => {
      this.companydata = data.filter(function (data: any) {
        return data.is_deleted == 'N';
      });
    });

    //Get Source data
    //  this.reconciliationService.getSourceData().subscribe((data: []) => {
    //   this.sourcedata = data.filter(function (data: any) {
    //     data.initialItemRow = data.initialItemRow.filter(item => !(item.is_deleted == 'Y'));
    //     return data.is_deleted == 'N';
    //   });
    // });
    this.reconciliationService.getSourceData().subscribe(data => {
      this.sourcedata = data;
      // console.log(this.reconMasterData, 'table dataaaaaaaa');
    });

    //Get Network data
    this.reconciliationService.getMasterData().subscribe((data: []) => {
      this.networks_types = data.filter(function (data: any) {
        return data.is_deleted == 'N' && data.master_type == 'Type of Network';
      });

      //Get File data
      this.file_types = data.filter(function (data: any) {
        return data.is_deleted == 'N' && data.master_type == 'Type of File';
      });

      //Get Fields
      this.field_types = data.filter(function (data: any) {
        return data.is_deleted == 'N' && data.master_type == 'Type of Field';
      });

      //Get Sections
      this.section_types = data.filter(function (data: any) {
        return data.is_deleted == 'N' && data.master_type == 'Type of Section';
      });

    });
    this.reconciliationService.getSourceTableFieldData().subscribe((data: any) => {
      this.source_table_field_data = data;
      console.log("source_table_field_data in NGONINIT====", data);
      console.log("source_table_field_data in NGONINIT====", this.source_table_field_data.length);
    });
  }
  initialitemRow() {
    return this.formBuilder.group({
      id: [''],
      sr_no: [''],
      section_identifier_id: [this.section_types],
      field_data_type_ref_id: [this.field_types],
      field_name: ['', Validators.required],
      field_length: ['', Validators.required],
      // field_length: [null, this.fieldLengthValidator],
      is_key_field: [false, Validators.required],
      is_primary_field: [false, Validators.required],
      application_id: ['Unknown', Validators.required],
      sub_application_id: ['Unknown', Validators.required]
    })
  }

  // fieldLengthValidator(control: AbstractControl): { [key: string]: boolean } | null {
  //   // console.log(this.mainScope.sourceForm);

  //   // var gridRow = (<FormArray>(this.sourceForm.get("initialItemRow"))).at(0);
  //   // if(gridRow.get('field_data_type_ref_id').value == 19 && control.value !== undefined && !isNaN(control.value) ) {
  //   //   console.log('this is an invalid input length');  
  //   //   return { 'validLength': true };
  //   // }
  //   // return null;
  //   if (control.value !== undefined && (isNaN(control.value))) {
  //     console.log('this is an invalid input length');  
  //     return { 'validLength': true };
  //   }
  //   console.log('this is an invalid input length field');  
  //   return null;
  // }

  get formArr() {
    return this.sourceForm.get('initialItemRow') as FormArray
  }

  addNewRow() {
    this.formArr.push(this.initialitemRow());
  }
  //-----------------------------------------------------------
  showList() {
    $('#list_form').show();
    $('#list_title').show();
    $('#btn_new_entry').show();
    $('#btn_list').hide();
    $('#new_entry_form').hide();
    $('#new_entry_title').hide();
    this.submitted = false;
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

  onSubmit() {
    this.submitted = true;

    for (let index = 0; index < $('.main-tbody').length; index++) {
      var gridRow = (<FormArray>(this.sourceForm.get("initialItemRow"))).at(index);
      if (gridRow.get('field_data_type_ref_id').value == 19 && isNaN($('#field_length_col').find('input').val())) {
        alert('Please Enter a valid Integer in length field!');
        return;
      }
    }
    // stop here if form is invalid
    if (this.sourceForm.invalid) {
      console.log("FORM DATA=>", this.sourceForm.value)
      return;
    } else {
      console.log("FormDATA=>", this.sourceForm.value)

      this.reconciliationService.saveSourceData(this.sourceForm.value).subscribe((data: any) => {
        //Insert Data
        if (data.status === 1) {
          Swal.fire({
            title: 'Your record has been added successfully!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.sourcedata.push(data);
          this.showList()
        }
        //Update Data
        if (data.status === 2) {
          // console.log("Upoddated = = ", data)
          var i = data.initialItemRow.length
          let updated_data = data.initialItemRow
          while (i--) {
            if (updated_data[i].is_deleted == 'Y') {
              updated_data.splice(i, 1);
            }
          }
          // console.log("Upoddated = = ", data)
          // data.filter(function (data: any) {
          //   data.initialItemRow = data.initialItemRow.filter(item => !(item.is_deleted == 'Y'));
          //   return data.is_deleted == 'N';
          // });
          Swal.fire({
            title: 'Your record has been updated successfully!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          let index = this.sourcedata.findIndex(item => item.id === data.id)
          this.sourcedata[index] = data
          this.showList()
        }
        if (data == 0) {
          Swal.fire({
            title: 'Record Already Exist!',
            icon: 'warning',
            timer: 2000,
            showConfirmButton: false
          });
        }
        // setTimeout(function () { location.href = 'http://127.0.0.1:4200/#/common-setup/currency'; }, 2000);
      },
        (error: any) => {
          console.log("ERRRRROR", error)
          let error_message = "";
          try {
            error_message = error.error.source_name
          } catch (err) {
          }
          if (error_message) {
            Swal.fire({
              title: "Source Name Already Exists",
              icon: 'warning',
              showConfirmButton: false
            });
          }
          else {
            Swal.fire({
              title: "Server Error",
              icon: 'warning',
              showConfirmButton: false
            });
          }
        });

      let init = this.sourceForm.value.initialItemRow
      let table = [];
      let header_schema = [];
      let details_schema = [];
      let dispute_details_schema = [];



      console.log("source_table_field_data====", this.source_table_field_data);
      console.log("source_table_field_data====", this.source_table_field_data.length);

      for (var i = 0; i < init.length; i++) {
        if (init[i].section_identifier_id == '17') {
          header_schema.push({
            "field_name": init[i].field_name,
            "field_data_type": init[i].field_data_type_ref_id,
            "field_length": init[i].field_length,
            "is_key": init[i].is_key_field,
            "is_primary_key": init[i].is_primary_field,
          });
        }
        else {
          details_schema.push({
            "field_name": init[i].field_name,
            "field_data_type": init[i].field_data_type_ref_id,
            "field_length": init[i].field_length,
            "is_key": init[i].is_key_field,
            "is_primary_key": init[i].is_primary_field,
          });
          dispute_details_schema.push({
            "field_name": init[i].field_name,
            "field_data_type": init[i].field_data_type_ref_id,
            "field_length": init[i].field_length,
            "is_key": init[i].is_key_field,
            "is_primary_key": init[i].is_primary_field,
          });
        }
      }

      for (var i = 0; i < this.source_table_field_data.length; i++) {
        if (this.source_table_field_data[i].section_identifier == 'Header') {
          header_schema.push({
            "field_name": this.source_table_field_data[i].field_name,
            "field_data_type": this.source_table_field_data[i].field_data_type_ref_id,
            "field_length": this.source_table_field_data[i].field_length,
            "is_key": this.source_table_field_data[i].is_key_field,
            "is_primary_key": this.source_table_field_data[i].is_primary_field,
          });
        }
        else if (this.source_table_field_data[i].section_identifier == 'Details') {
          details_schema.push({
            "field_name": this.source_table_field_data[i].field_name,
            "field_data_type": this.source_table_field_data[i].field_data_type_ref_id,
            "field_length": this.source_table_field_data[i].field_length,
            "is_key": this.source_table_field_data[i].is_key_field,
            "is_primary_key": this.source_table_field_data[i].is_primary_field,
          });
        }
        else if (this.source_table_field_data[i].section_identifier == 'Dispute') {
          dispute_details_schema.push({
            "field_name": this.source_table_field_data[i].field_name,
            "field_data_type": this.source_table_field_data[i].field_data_type_ref_id,
            "field_length": this.source_table_field_data[i].field_length,
            "is_key": this.source_table_field_data[i].is_key_field,
            "is_primary_key": this.source_table_field_data[i].is_primary_field,
          });
        }
      }

      table.push({
        "table_name": "tbl_" + this.sourceForm.value.source_name + "_header",
        "schema": header_schema
      })
      table.push({
        "table_name": "tbl_" + this.sourceForm.value.source_name + "_details",
        "schema": details_schema
      })
      table.push({
        "table_name": "tbl_" + this.sourceForm.value.source_name + "_dispute_details",
        "schema": dispute_details_schema
      })
      console.log("Tables = >", table)
      //Temporarily commented
      this.reconciliationService.createTable(table).subscribe((data: any) => {
        console.log("Create Table Data = > ", data)
      });
    }
  }

  editSource(source) {
    console.log("source ", (source))
    // console.log("Json",JSON.stringify(source.initialItemRow))
    let init = JSON.stringify(source.initialItemRow);
    // this.sourceForm.patchValue({'initialItemRow':init})
    // this.sourceForm.setControl('initialItemRow', this.formBuilder.array(source.initialItemRow || []));
    this.sourceForm.patchValue({
      company_ref_id: source.company_ref_id,
      channel_ref_id: source.channel_ref_id,
      source_name: source.source_name,
      id: source.id,
      network_type_ref_id: source.network_type_ref_id,
      file_type_ref_id: source.file_type_ref_id,
      from_date: source.from_date,
      to_date: source.to_date,
      revision_status: source.revision_status,
      version_number: source.version_number + 1,
      application_id: "Unknown",
      sub_application_id: "Unknown",
      updated_date_time: new Date(),
      initialItemRow: source.initialItemRow
    });
    this.sourceForm.setControl('initialItemRow', this.setExistingArray(source.initialItemRow));
    console.log("Init =  ", this.sourcedata)
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
  // setExistingSkills(skillSets: []): FormArray {
  //   const formArray = new FormArray([]);
  //   skillSets.forEach(s => {
  //     formArray.push(this.formBuilder.group({
  //       id: s.id,
  //       experienceInYears: s.experienceInYears,
  //       proficiency: s.proficiency
  //     }));
  //   });

  //   return formArray;
  // }
  setExistingArray(initialArray = []): FormArray {
    const formArray = new FormArray([]);
    initialArray.forEach(element => {
      formArray.push(this.formBuilder.group({
        id: element.id,
        section_identifier_id: element.section_identifier_id,
        table_name: element.table_name,
        field_name: element.field_name,
        field_data_type_ref_id: element.field_data_type_ref_id,
        field_length: element.field_length,
        application_id: "RHYTHMWORKS",
        sub_application_id: "RHYTHMWORKS",
        is_key_field: element.is_key_field,
        is_primary_field: element.is_primary_field,
        sr_no: element.sr_no
      }));
    });

    return formArray;
  }
  checkValue(event: any) {

    // let x = parseInt($(self).val());
    let x = event.target.value;
    console.log("X is", x);
    if (x == 1) {
      // alert("This is Header");
      console.log("This is Header");
    }
    else if (x == 2) {
      // alert("This is Details");
      console.log("This is Details");
    }
    else {
      // alert("Nothing was done");
      console.log("Nothing was done");
    }
  }

  //Delete Source Data
  deleteSource(value: any) {
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
        this.reconciliationService.deleteSource(value).subscribe((data: any) => {
          if (data.status == 1) {
            this.sourcedata.splice(
              this.sourcedata.findIndex(data => data.id === value.id), 1
            )
            Swal.fire({
              title: 'Your record has been deleted successfully!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
        });
      }
    });
  }

  async startScript() {
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
  get f() { return this.sourceForm.controls; }

  deleteRow(index) {
    if (this.formArr.length == 1) {
      return false;
    } else {
      this.formArr.removeAt(index);
      return true;
    }
  }

}
