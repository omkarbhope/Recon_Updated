import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ReconcilationService } from 'src/app/services/reconcilation.service';
import Swal from "sweetalert2";
import{ GlobalConstants } from 'src/app/global/global-constants';
// import * as $ from "jquery";

declare const $: any;
declare const swal: any;
declare const flatpickr: any;

@Component({
  selector: 'app-define-reconcilation',
  templateUrl: './define-reconcilation.component.html',
  styleUrls: ['./define-reconcilation.component.sass']
})
export class DefineReconcilationComponent implements OnInit {
  frontEndUrl = GlobalConstants.frontEndUrl;

  defineReconcilationForm: FormGroup;
  submitted = false;
  gridSourceNameDetails = {};

  APPLICATION_ID: string;
  USERID: string;
  SUB_APPLICATION_ID: string;

  reconcilationList = true;
  reconcilationNewEntry = false;
  showTwoWays: boolean = false;
  showThreeWays: boolean = false;
  showFourWays: boolean = false;
  submitButton = "Submit";

  reconMasterData: any = [];
  companyData: any = [];
  reconTypeData: any = [];
  sourcesData: any = [];
  sourceNameMaster: any = [];
  sourceNameDetails: any = [];
  defaultoptionIds: any = [];

  constructor(private formBuilder: FormBuilder, private reconcilationService: ReconcilationService) { }

  ngOnInit(): void {

    this.showList();

    this.APPLICATION_ID = localStorage.getItem('APPLICATION_ID');
    this.USERID = localStorage.getItem('ID');
    this.SUB_APPLICATION_ID = localStorage.getItem('SUB_APPLICATION_ID');

    this.defineReconcilationForm = this.formBuilder.group({
      id: ['', Validators.required],
      company_ref_id: ['', Validators.required],
      name: ['', Validators.required],
      recon_type_ref_id: ['', Validators.required],
      source_name1_ref_id: ['', Validators.required],
      source_name2_ref_id: ['', Validators.required],
      source_name3_ref_id: ['', Validators.required],
      source_name4_ref_id: ['', Validators.required],
      sub_application_id: [this.SUB_APPLICATION_ID],
      application_id: [this.APPLICATION_ID],
      USERID: [this.USERID],
      recon_rule: "",
      probable_match_rule: "",
      initialItemRow: this.formBuilder.array([this.initialItemRow2()]),
      initialItemRow1: this.formBuilder.array([this.initialitemRow3()]),
    });

    $( document ).ready(function() {
      $('#new_entry_form').hide();
      $('#new_entry_title').hide();
      $('#btn_list').hide();
    });

    this.reconcilationService.getReconcilationMaster().subscribe(data => {
      this.reconMasterData = data;
    });

    // company name  data
    this.reconcilationService.getCompanyData().subscribe(data => {
      this.companyData = data;
    });

    // Recon Type Data
    this.reconcilationService.getReconTypeData().subscribe(data => {
      this.reconTypeData = data.filter(function (data: any) {
        return data.master_type == 'Recon Type';
      });
    });

    // Source Names from Src Master
    this.reconcilationService.getSourceMaster().subscribe(data => {
      this.sourceNameMaster = data;
      // for (let i = 0; i < data.length; i++) {
      //   this.sourcesData[data[i].id] = data;
      //   this.defaultoptionIds[i] = parseInt(data[i].id);
      // }
    });

  }

  showSources(event) {
    if (event == '5') {
      this.showTwoWays = true;
      this.showThreeWays = false;
      this.showFourWays = false;
    } else if (event == '6') {
      this.showTwoWays = false;
      this.showThreeWays = true;
      this.showFourWays = false;
    } else if (event == '7') {
      this.showTwoWays = false;
      this.showThreeWays = false;
      this.showFourWays = true;
    } else {
      this.showTwoWays = false;
      this.showThreeWays = false;
      this.showFourWays = false;
    }
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

  filterSources(currentSelectId) {
    var allSelectedSourceIds = {};

    // get selected value of every dropdown 
    $('.sources').each(function (s) {
      if ('' != this.options[this.selectedIndex].value) {
        allSelectedSourceIds[this.id] = parseInt(this.options[this.selectedIndex].value);
      }
    });

    // remove selected option from other dropdowns in header sources
    $('.sources').each(function (s) {
      var currentDropdown = this;
      $(this.options).each(function (o) {
        if (-1 < Object.values(allSelectedSourceIds).indexOf(parseInt(this.value)) &&
          currentDropdown.options[currentDropdown.selectedIndex].value != parseInt(this.value)
          && currentSelectId != currentDropdown.id && '' != this.value) {
          $(this).remove();
        }
      });
    });

    // Source Names from Src Details in both grids
    this.getGridSouceNameDetails(allSelectedSourceIds[currentSelectId], currentSelectId);
  }

  getGridSouceNameDetails(sourceVal, sourceId) {
    this.reconcilationService.getSourceDetails(sourceVal).subscribe(data => {
    //  this.gridSourceNameDetails[sourceId] = data;
    //  console.log("Source data",data);
      this.gridSourceNameDetails[sourceId] = data.filter(function (data: any) {
        return data.section_identifier_id != 17;
      });
    });
  }

  changeSourceName(currentGridSelect, rowId) {
    var attr_id = currentGridSelect.id;
    var ref_id = attr_id.replace('field_id', 'ref_id');
    var field_name = attr_id.replace('field_id', 'field_name');
    var section_identifier_id = attr_id.replace('field_id', 'section_identifier_id');

    // at => get selected grid row
    if ($(currentGridSelect).parents('table').attr('id') == 'recon_rule_grid') {
      var gridRow = (<FormArray>(this.defineReconcilationForm.get('initialItemRow'))).at(rowId);
      gridRow.get(ref_id.slice(0, -1)).patchValue($(currentGridSelect.options[currentGridSelect.selectedIndex]).attr('headerRefId'));
      gridRow.get(field_name.slice(0, -1)).patchValue(currentGridSelect.options[currentGridSelect.selectedIndex].text);
      gridRow.get(section_identifier_id.slice(0, -1)).patchValue($(currentGridSelect.options[currentGridSelect.selectedIndex]).attr('sectionId'));
    } else {
      var gridRow1 = (<FormArray>(this.defineReconcilationForm.get('initialItemRow1'))).at(rowId);
      gridRow1.get(ref_id.slice(2, -1)).patchValue($(currentGridSelect.options[currentGridSelect.selectedIndex]).attr('headerRefId'));
      gridRow1.get(field_name.slice(2, -1)).patchValue(currentGridSelect.options[currentGridSelect.selectedIndex].text);
      gridRow1.get(section_identifier_id.slice(2, -1)).patchValue($(currentGridSelect.options[currentGridSelect.selectedIndex]).attr('sectionId'));
    }
  }

  storeReconProbableRule() {
    var headerSouceNameStrings = [];
    var reconRuleSouceNameStrings = [];
    var probableSouceNameStrings = [];

    $('.sources').each(function (s) {
      if ("" != this.options[this.selectedIndex].text) {
        headerSouceNameStrings.push(('tbl_' + this.options[this.selectedIndex].text).toLowerCase().replace(' ', '_'));
      }
    });
    console.log("headerSouceNameStrings",headerSouceNameStrings);
    reconRuleSouceNameStrings = this.getSourceNameStringArrays($('#recon_rule_grid tr').not('.table_header_field_names'), headerSouceNameStrings);
    probableSouceNameStrings = this.getSourceNameStringArrays($('#probable_match_rule tr').not('.table_header_field_names'), headerSouceNameStrings);
   
    
    this.defineReconcilationForm.get('recon_rule').patchValue(this.generateFinalString(reconRuleSouceNameStrings));
    this.defineReconcilationForm.get('probable_match_rule').patchValue(this.generateFinalString(probableSouceNameStrings));
  }

  getSourceNameStringArrays(grid, headerSouceNameStrings) {
    console.log("In getSourceNameStringArrays");
    console.log("grid",grid);
    
    var ruleSouceNameStrings = [];
    var allRowsFromGrid = [];

    $(grid).each(function () {
      let selectTdArray = $(this).find('td.col_input select');
      
      for (let index = 0; index < selectTdArray.length; index++) {
        let currentSelect = $(selectTdArray[index])[0];
        let currentSelectedOptionText = '';
        if (0 != currentSelect.selectedIndex) {
          currentSelectedOptionText = currentSelect.options[currentSelect.selectedIndex].text;

          let identifierName = 'header';
          if (parseInt($(currentSelect.options[currentSelect.selectedIndex]).attr('sectionId')) == 18) {
            identifierName = 'details';
          }
          ruleSouceNameStrings.push(headerSouceNameStrings[index] + '_' + identifierName + '.' + currentSelectedOptionText)
        }
      }
      allRowsFromGrid.push(ruleSouceNameStrings);
      ruleSouceNameStrings = [];
    });
    return allRowsFromGrid;
  }

  generateFinalString(souceNameStrings) {
    console.log(souceNameStrings, '12344545');
    var reconString = ''
    for (let i = 0; i < souceNameStrings.length; i++) {
      for (let j = 0; j < souceNameStrings[i].length - 1; j++) {
        for (let k = 0; k < souceNameStrings[i].length - (j+1); k++) {
          reconString += souceNameStrings[i][j] + '=' + souceNameStrings[i][j + k + 1] + ' AND ';
        }
      }
    }
    return reconString.slice(0, -5);
  }

  //Grid 1
  initialItemRow2() {
    return this.formBuilder.group({
      details_id: [''],
      probable_match_flag: 'N',
      source_name_1_field_id: [''],
      source_name_2_field_id: [''],
      source_name_3_field_id: [''],
      source_name_4_field_id: [''],

      source_name_1_ref_id: [''],
      source_name_1_field_name: [''],
      source_name_1_section_identifier_id: [''],

      source_name_2_ref_id: [''],
      source_name_2_field_name: [''],
      source_name_2_section_identifier_id: [''],

      source_name_3_ref_id: [''],
      source_name_3_field_name: [''],
      source_name_3_section_identifier_id: [''],

      source_name_4_ref_id: [''],
      source_name_4_field_name: [''],
      source_name_4_section_identifier_id: [''],

      sub_application_id: [this.SUB_APPLICATION_ID],
      application_id: [this.APPLICATION_ID],
    });
  }

  get formArr() {
    return this.defineReconcilationForm.get('initialItemRow') as FormArray;
  }

  addNewRow() {
    this.formArr.push(this.initialItemRow2());
  }

  deleteRow(index) {
    if (this.formArr.length == 1) {
      return false;
    } else {
      this.formArr.removeAt(index);
      return true;
    }
  }

  // Grid 2
  initialitemRow3() {
    return this.formBuilder.group({
      details_id: [''],
      probable_match_flag: 'Y',
      source_name_1_field_id: [''],
      source_name_2_field_id: [''],
      source_name_3_field_id: [''],
      source_name_4_field_id: [''],

      source_name_1_ref_id: [''],
      source_name_1_field_name: [''],
      source_name_1_section_identifier_id: [''],

      source_name_2_ref_id: [''],
      source_name_2_field_name: [''],
      source_name_2_section_identifier_id: [''],

      source_name_3_ref_id: [''],
      source_name_3_field_name: [''],
      source_name_3_section_identifier_id: [''],

      source_name_4_ref_id: [''],
      source_name_4_field_name: [''],
      source_name_4_section_identifier_id: [''],

      sub_application_id: [this.SUB_APPLICATION_ID],
      application_id: [this.APPLICATION_ID],
    });
  }

  get formArr1() {
    return this.defineReconcilationForm.get('initialItemRow1') as FormArray;
  }

  addNewRow1() {
    this.formArr1.push(this.initialitemRow3());
  }

  deleteRow1(index) {
    if (this.formArr1.length == 1) {
      return false;
    } else {
      this.formArr1.removeAt(index);
      return true;
    }
  }

  get f() {
    return this.defineReconcilationForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.storeReconProbableRule();
    console.log(this.defineReconcilationForm.value);
   
    let stringifiedData = JSON.stringify(this.defineReconcilationForm.value);
    var parsedStringifiedData = JSON.parse(stringifiedData);

    for (let index = 0; index < parsedStringifiedData.initialItemRow1.length; index++) {
      var obj = parsedStringifiedData.initialItemRow1[index];
      parsedStringifiedData.initialItemRow.push(obj);
    }
    delete parsedStringifiedData.initialItemRow1;
    console.log(parsedStringifiedData, 'formData');
    // return true;
    this.reconcilationService.saveReconcilationData(parsedStringifiedData).subscribe((data: any) => {
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
      this.showList();

      let exact_frontEndUrl = this.frontEndUrl + "/#/reconcilation/define_reconcilation";
      setTimeout(function(){location.href= exact_frontEndUrl} , 2000);
      //setTimeout(function () { location.href = 'http://127.0.0.1:4200/#/reconcilation/define_reconcilation'; }, 2000);
    });

  }


  setExistingArray(initialArray = []): FormArray {
    const formArray = new FormArray([]);
    initialArray.forEach(element => {
      formArray.push(this.formBuilder.group({
        probable_match_flag: element.probable_match_flag,
        details_id: element.details_id,

        source_name_1_field_id: element.source_name_1_field_id,
        source_name_2_field_id: element.source_name_2_field_id,
        source_name_3_field_id: element.source_name_3_field_id,
        source_name_4_field_id: element.source_name_4_field_id,

        source_name_1_ref_id: element.source_name_1_ref_id,
        source_name_1_field_name: element.source_name_1_field_name,
        source_name_1_section_identifier_id: element.source_name_1_section_identifier_id,

        source_name_2_ref_id: element.source_name_2_ref_id,
        source_name_2_field_name: element.source_name_2_field_name,
        source_name_2_section_identifier_id: element.source_name_2_section_identifier_id,

        source_name_3_ref_id: element.source_name_3_ref_id,
        source_name_3_field_name: element.source_name_3_field_name,
        source_name_3_section_identifier_id: element.source_name_3_section_identifier_id,

        source_name_4_ref_id: element.source_name_4_ref_id,
        source_name_4_field_name: element.source_name_4_field_name,
        source_name_4_section_identifier_id: element.source_name_4_section_identifier_id,

        sub_application_id: [this.SUB_APPLICATION_ID],
        application_id: [this.APPLICATION_ID],
      }));
    });
    return formArray;
  }

  editDefineReconcilation(source) {
    this.showList();
    this.showSources(source.recon_type_ref_id);
    this.getGridSouceNameDetails(source.source_name1_ref_id, 'source-1');
    this.getGridSouceNameDetails(source.source_name2_ref_id, 'source-2');
    this.getGridSouceNameDetails(source.source_name3_ref_id, 'source-3');
    this.getGridSouceNameDetails(source.source_name4_ref_id, 'source-4');

    this.defineReconcilationForm.patchValue({
      id: source.id,
      company_ref_id: source.company_ref_id,
      name: source.name,
      recon_type_ref_id: source.recon_type_ref_id,
      source_name1_ref_id: source.source_name1_ref_id,
      source_name2_ref_id: source.source_name2_ref_id,
      source_name3_ref_id: source.source_name3_ref_id,
      source_name4_ref_id: source.source_name4_ref_id,
      recon_rule: source.recon_rule,
      probable_match_rule: source.probable_match_rule,
    });

    var firstFormArray = [];
    var secondFormArray = [];

    for (let index = 0; index < source.initialItemRow.length; index++) {
      const element = source.initialItemRow[index];
      if (element.probable_match_flag === 'Y') {
        secondFormArray.push(element);
      } else {
        firstFormArray.push(element);
      }
    }

    this.defineReconcilationForm.setControl('initialItemRow', this.setExistingArray(firstFormArray));
    this.defineReconcilationForm.setControl('initialItemRow1', this.setExistingArray(secondFormArray));
    this.submitButton = 'Update';
    const id = $('#id').val();
    if (id !== '') {
      $('#new_entry_form').show();
      $('#new_entry_title1').show();
      $('#new_entry_title').hide();
      $('#new_reconcilation').hide();
      $('#btn_list').hide();
      $('#list_form').hide();
    }
  }

  deleteDefineReconcilation(value: any) {
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
       
        this.reconcilationService.deleteReconcilationData(value).subscribe((data: any) => {
          if (data.status == 1) {
            this.reconMasterData.splice(
              this.reconMasterData.findIndex(data => data.id === value.id), 1
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


}