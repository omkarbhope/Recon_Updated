import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { ReconcilationService } from 'src/app/services/reconcilation.service';

declare const $: any;

@Component({
  selector: 'app-dispute-resolution',
  templateUrl: './dispute-resolution.component.html',
  styleUrls: ['./dispute-resolution.component.sass']
})
export class DisputeResolutionComponent implements OnInit {

  disputeResolutionForm: FormGroup;
  btnValue = 'Submit';
  disputeResolutionForm1: FormGroup;
  submitted = false;
  companyData = [];
  channelData = [];
  reconDefMstData = [];
  channel_idControl: FormControl;
  sourceDetails = [];
  roleMasterdata = [];
  self_company_id: string;

  constructor(private formbuilder: FormBuilder, private reconService: ReconcilationService) { }

  sourceTables = [];
  disputeSourceTables = [];
  subSourceDetails = {};

  ngOnInit(): void {
    this.self_company_id = localStorage.getItem('COMPANY_ID');
    this.channel_idControl = new FormControl(null, Validators.required);
    this.channel_idControl.disable();

    this.disputeResolutionForm = this.formbuilder.group({
      company_ref_id: ['', Validators.required],
      channel_ref_id: this.channel_idControl
    });

    this.reconService.getCompanyData().subscribe(data => {
      this.companyData = data;
    });

    this.disputeResolutionForm1 = this.formbuilder.group({
    });

    this.disputeResolutionForm.get("company_ref_id").valueChanges.subscribe(val => {
      this.channelData = [];
      if (val != "null") {
        this.reconService.getChannelData(val).subscribe((data: []) => {
          this.channelData = data['companies'];
        });
        this.channel_idControl.enable();
      }
      else {
        this.channel_idControl.disable();
      }
    });

    this.reconService.getReconcilationMaster().subscribe(data => {
      this.reconDefMstData = data;
    });

    this.reconService.getSourceDetails('').subscribe(data => {
      this.sourceDetails = data;
    });

    this.reconService.getRoleMasterData().subscribe(data => {
      this.roleMasterdata = data;
    });
  }

  filterCompanyName(currentCompanyName){
    for (let index = 0; index < this.reconDefMstData.length; index++) {
      if (this.reconDefMstData[index]['id'] == currentCompanyName) {
        var gridRow = this.disputeResolutionForm;
        $("#company_ref_id" + "_text").val(this.reconDefMstData[index]['company_ref_id']);
        gridRow.get('company_ref_id').setValue(this.reconDefMstData[index]['id']);
      }
    }
  }

  filterSourcesNames(id) {
    // for company
    // for (let index = 0; index < this.reconDefMstData.length; index++) {
    //   if (this.reconDefMstData[index]['id'] == id) {
    //     var gridRow = this.disputeResolutionForm;
    //     $("#company_ref_id" + "_text").val(this.reconDefMstData[index]['company_ref_id']);
    //     gridRow.get('company_ref_id').setValue(this.reconDefMstData[index]['id']);
    //   }
    // }

    var mainScope = this;
    $("#tableExport").empty();
    $('#field-details').remove();
    this.sourceTables = [];
    this.disputeSourceTables = [];
    this.subSourceDetails = {};

    for (let mainIndex = 0; mainIndex < this.reconDefMstData.length; mainIndex++) {

      // to check and to filter only selected element
      if (this.reconDefMstData[mainIndex]['id'] == id) {
        var reconRule = this.reconDefMstData[mainIndex]['recon_rule'];
        var selectPart1 = 'SELECT ';
        var selectPart2 = '';
        var unionAllPart1 = '';
        var unionAllPart2 = '';
        var unionAllPart3 = '';
        var unionAllPart4 = '';
        var joinTable1 = '';
        var joinTable2 = '';
        var joinTable3 = '';
        var joinTable4 = '';
        var numberOfDetailsRefIds = 0;

        // get names of sources from recon master table
        var source_name1_ref_name = this.reconDefMstData[mainIndex]['source_name_1'];
        var source_name2_ref_name = this.reconDefMstData[mainIndex]['source_name_2'];
        var source_name3_ref_name = this.reconDefMstData[mainIndex]['source_name_3'];
        var source_name4_ref_name = this.reconDefMstData[mainIndex]['source_name_4'];

        // get ids of sources from recon master table
        var source_name1_ref_id = this.reconDefMstData[mainIndex]['source_name1_ref_id'];
        var source_name2_ref_id = this.reconDefMstData[mainIndex]['source_name2_ref_id'];
        var source_name3_ref_id = this.reconDefMstData[mainIndex]['source_name3_ref_id'];
        var source_name4_ref_id = this.reconDefMstData[mainIndex]['source_name4_ref_id'];

        // get company ids from recon master table

        // get field names based on is_key_field and header_ref_id
        if (source_name2_ref_name != null) {
          this.subSourceDetails[source_name1_ref_name] = this.sourceDetails.filter(function (data: any) {
            return data.is_key_field == true && data.header_ref_id == source_name1_ref_id;
          });
        }

        if (source_name2_ref_name != null) {
          this.subSourceDetails[source_name2_ref_name] = this.sourceDetails.filter(function (data: any) {
            return data.is_key_field == true && data.header_ref_id == source_name2_ref_id;
          });
        }

        if (source_name3_ref_name != null) {
          this.subSourceDetails[source_name3_ref_name] = this.sourceDetails.filter(function (data: any) {
            return data.is_key_field == true && data.header_ref_id == source_name3_ref_id;
          });
        }

        if (source_name4_ref_name != null) {
          this.subSourceDetails[source_name4_ref_name] = this.sourceDetails.filter(function (data: any) {
            return data.is_key_field == true && data.header_ref_id == source_name4_ref_id;
          });
        }

        // build grid structure-1
        var roleHeader = '<th rowspan="2" style="text-align:center">' + 'Role' + '</th>';
        var tableHeader = '<thead><tr>' + roleHeader;
        var subHeader = '';
        var subString = '<th style="text-align:center">Total no of Records</th><th style="text-align:center">Total no of non-reconciled Records</th>';
        var table = $("#tableExport");
        var fieldNamesSubHeaderArray = [];

        if (source_name1_ref_id != null) {
          this.sourceTables.push("tbl_" + source_name1_ref_name + "_details");
          this.disputeSourceTables.push("tbl_" + source_name1_ref_name + "_dispute_details");
          tableHeader += '<th colspan="2" style="text-align:center">' + this.reconDefMstData[mainIndex]['source_name_1'] + '</th>';
          subHeader += subString;
          joinTable1 = 'public.tbl_' + source_name1_ref_name + '_dispute_details as a';
          reconRule = reconRule.replaceAll("tbl_" + source_name1_ref_name + "_details", 'a');
          selectPart1 += ' a.details_ref_id as details_ref_id_1, ';
          unionAllPart1 += ' details_ref_id as details_ref_id_1, ';
          unionAllPart2 += ' null as details_ref_id_2, ';
          unionAllPart3 += ' null as details_ref_id_3, ';
          unionAllPart4 += ' null as details_ref_id_4, ';
          numberOfDetailsRefIds++;
        }

        if (source_name2_ref_id != null) {
          this.sourceTables.push("tbl_" + source_name2_ref_name + "_details");
          this.disputeSourceTables.push("tbl_" + source_name2_ref_name + "_dispute_details");
          tableHeader += '<th colspan="2" style="text-align:center">' + this.reconDefMstData[mainIndex]['source_name_2'] + '</th>';
          subHeader += subString;
          joinTable2 += 'public.tbl_' + source_name2_ref_name + '_dispute_details as b';
          reconRule = reconRule.replaceAll("tbl_" + source_name2_ref_name + "_details", 'b');
          selectPart1 += ' b.details_ref_id as details_ref_id_2, ';
          unionAllPart1 += ' null as details_ref_id_1, ';
          unionAllPart2 += ' details_ref_id as details_ref_id_2, ';
          unionAllPart3 += ' null as details_ref_id_3, ';
          unionAllPart4 += ' null as details_ref_id_4, ';
          numberOfDetailsRefIds++;
        }

        if (source_name3_ref_id != null) {
          this.sourceTables.push("tbl_" + source_name3_ref_name + "_details");
          this.disputeSourceTables.push("tbl_" + source_name3_ref_name + "_dispute_details");
          tableHeader += '<th colspan="2" style="text-align:center">' + this.reconDefMstData[mainIndex]['source_name_3'] + '</th>';
          subHeader += subString;
          joinTable3 += 'public.tbl_' + source_name3_ref_name + '_dispute_details as c';
          reconRule = reconRule.replaceAll("tbl_" + source_name3_ref_name + "_details", 'c');
          selectPart1 += ' c.details_ref_id as details_ref_id_3, ';
          unionAllPart1 += ' null as details_ref_id_1, ';
          unionAllPart2 += ' null as details_ref_id_2, ';
          unionAllPart3 += ' details_ref_id as details_ref_id_3, ';
          unionAllPart4 += ' null as details_ref_id_4, ';
          numberOfDetailsRefIds++;
        }

        if (source_name4_ref_id != null) {
          this.sourceTables.push("tbl_" + source_name4_ref_name + "_details");
          this.disputeSourceTables.push("tbl_" + source_name4_ref_name + "_dispute_details");
          tableHeader += '<th colspan="2" style="text-align:center">' + this.reconDefMstData[mainIndex]['source_name_4'] + '</th>';
          subHeader += subString;
          joinTable4 += 'public.tbl_' + source_name4_ref_name + '_dispute_details as d';
          reconRule = reconRule.replaceAll("tbl_" + source_name4_ref_name + "_details", 'd');
          selectPart1 += ' d.details_ref_id as details_ref_id_4, ';
          unionAllPart1 += ' null as details_ref_id_1, ';
          unionAllPart2 += ' null as details_ref_id_2, ';
          unionAllPart3 += ' null as details_ref_id_3, ';
          unionAllPart4 += ' details_ref_id as details_ref_id_4 ';
          numberOfDetailsRefIds++;
        }

        var a_b_recon_rule = '';
        var a_b_c_recon_rule = '';
        var a_b_c_d_recon_rule = '';
        var tempReconRuleArray = [];
        var resultReconRule = [];

        // for a_b_recon_rule(2 way)
        tempReconRuleArray.push(reconRule.match(/a\."*([a-zA-Z_*^\.]*)"*=b\."*([a-zA-Z_*^\.]*)"*\s*/g));
        tempReconRuleArray.push(reconRule.match(/b\."*([a-zA-Z_*^\.]*)"*=a\."*([a-zA-Z_*^\.]*)"*\s*/g));

        for (let index = 0; index < tempReconRuleArray.length; index++) {
          if (0 == resultReconRule.length && null != tempReconRuleArray[index]) {
            resultReconRule = tempReconRuleArray[index]
          } else if (null != tempReconRuleArray[index]) {
            resultReconRule = resultReconRule.concat(tempReconRuleArray[index])
          }
        }
        a_b_recon_rule = resultReconRule.join(" OR ");
        // return true;
        // for a_b_c_recon_rule(3 way)
        tempReconRuleArray = [];
        resultReconRule = [];
        tempReconRuleArray.push(reconRule.match(/a\."*([a-zA-Z_*^\.]*)"*=c\."*([a-zA-Z_*^\.]*)"*\s*/g));
        tempReconRuleArray.push(reconRule.match(/b\."*([a-zA-Z_*^\.]*)"*=c\."*([a-zA-Z_*^\.]*)"*\s*/g));

        tempReconRuleArray.push(reconRule.match(/c\."*([a-zA-Z_*^\.]*)"*=a\."*([a-zA-Z_*^\.]*)"*\s*/g));
        tempReconRuleArray.push(reconRule.match(/c\."*([a-zA-Z_*^\.]*)"*=b\."*([a-zA-Z_*^\.]*)"*\s*/g));
        for (let index = 0; index < tempReconRuleArray.length; index++) {
          if (0 == resultReconRule.length && null != tempReconRuleArray[index]) {
            resultReconRule = tempReconRuleArray[index]
          } else if (null != tempReconRuleArray[index]) {
            resultReconRule = resultReconRule.concat(tempReconRuleArray[index])
          }
        }
        a_b_c_recon_rule = resultReconRule.join(" OR ");

        // for a_b_c_d_recon_rule(4 way)
        tempReconRuleArray = [];
        resultReconRule = [];
        tempReconRuleArray.push(reconRule.match(/a\."*([a-zA-Z_*^\.]*)"*=d\."*([a-zA-Z_*^\.]*)"*\s*/g));
        tempReconRuleArray.push(reconRule.match(/b\."*([a-zA-Z_*^\.]*)"*=d\."*([a-zA-Z_*^\.]*)"*\s*/g));
        tempReconRuleArray.push(reconRule.match(/c\."*([a-zA-Z_*^\.]*)"*=d\."*([a-zA-Z_*^\.]*)"*\s*/g));

        tempReconRuleArray.push(reconRule.match(/d\."*([a-zA-Z_*^\.]*)"*=a\."*([a-zA-Z_*^\.]*)"*\s*/g));
        tempReconRuleArray.push(reconRule.match(/d\."*([a-zA-Z_*^\.]*)"*=b\."*([a-zA-Z_*^\.]*)"*\s*/g));
        tempReconRuleArray.push(reconRule.match(/d\."*([a-zA-Z_*^\.]*)"*=c\."*([a-zA-Z_*^\.]*)"*\s*/g));
        for (let index = 0; index < tempReconRuleArray.length; index++) {
          if (0 == resultReconRule.length && null != tempReconRuleArray[index]) {
            resultReconRule = tempReconRuleArray[index]
          } else if (null != tempReconRuleArray[index]) {
            resultReconRule = resultReconRule.concat(tempReconRuleArray[index])
          }
        }
        a_b_c_d_recon_rule = resultReconRule.join(" OR ");

        // Append grid details table
        if ($("#tableExport thead").length == 0) {
          tableHeader += '</tr><tr>' + subHeader + '</tr></thead>';
          table.append(tableHeader);
        }

        // Prepare select columns part of final query
        for (const key in this.subSourceDetails) {
          if (Object.prototype.hasOwnProperty.call(this.subSourceDetails, key)) {                         //check if object has property 
            for (let index = 0; index < this.subSourceDetails[key].length; index++) {
              const element = this.subSourceDetails[key][index]['field_name'];
              if (source_name1_ref_name != null && key == source_name1_ref_name) {
                fieldNamesSubHeaderArray.push(element);
                selectPart1 += 'a."' + element + '" as ' + element + '_1,';
                unionAllPart1 += '"' + element + '" as ' + element + '_1,';
                unionAllPart2 += ' null as ' + element + '_1,';
                unionAllPart3 += ' null as ' + element + '_1,';
                unionAllPart4 += ' null as ' + element + '_1,';
              } else if (source_name2_ref_name != null && key == source_name2_ref_name) {
                fieldNamesSubHeaderArray.push(element);
                selectPart1 += 'b."' + element + '" as ' + element + '_2,';
                unionAllPart1 += ' null as ' + element + '_2,';
                unionAllPart2 += '"' + element + '" as ' + element + '_2,';
                unionAllPart3 += ' null as ' + element + '_2,';
                unionAllPart4 += ' null as ' + element + '_2,';
              } else if (source_name3_ref_name != null && key == source_name3_ref_name) {
                fieldNamesSubHeaderArray.push(element);
                selectPart1 += 'c."' + element + '" as ' + element + '_3,';
                unionAllPart1 += ' null as ' + element + '_3,';
                unionAllPart2 += ' null as ' + element + '_3,';
                unionAllPart3 += '"' + element + '" as ' + element + '_3,';
                unionAllPart4 += ' null as ' + element + '_3,';
              } else if (source_name4_ref_name != null && key == source_name4_ref_name) {
                fieldNamesSubHeaderArray.push(element);
                selectPart1 += 'd."' + element + '" as ' + element + '_4,';
                unionAllPart1 += ' null as ' + element + '_4,';
                unionAllPart2 += ' null as ' + element + '_4,';
                unionAllPart3 += ' null as ' + element + '_4,';
                unionAllPart4 += '"' + element + '" as ' + element + '_4,';
              }
            }
          }
        }

        selectPart1 = selectPart1.slice(0, -1);     //TO REMOVE LAST COMMA
        selectPart1 += ' FROM ';

        var subSelectQuery = joinTable1 + ' JOIN ' + joinTable2 + ' ON (' + a_b_recon_rule + ')';
        
        if (joinTable3 != '') {
          subSelectQuery += ' JOIN ' + joinTable3 + ' ON (' + a_b_c_recon_rule + ')';
        }
        if (joinTable4 != '') {
          subSelectQuery += ' JOIN ' + joinTable4 + ' ON (' + a_b_c_d_recon_rule + ')';
        }

        selectPart1 += subSelectQuery;

        if (source_name1_ref_name != null) {
          selectPart2 += ' UNION ALL ( SELECT ' + unionAllPart1.slice(0, -1) + ' FROM ' + joinTable1.slice(0, -5) + ' WHERE id NOT IN ( SELECT a.id FROM ' + subSelectQuery + ' ))';
        }
        if (source_name2_ref_name != null) {
          selectPart2 += ' UNION ALL ( SELECT ' + unionAllPart2.slice(0, -1) + ' FROM ' + joinTable2.slice(0, -5) + ' WHERE id NOT IN ( SELECT b.id FROM ' + subSelectQuery + '))';
        }
        if (source_name3_ref_name != null) {
          selectPart2 += ' UNION ALL ( SELECT ' + unionAllPart3.slice(0, -1) + ' FROM ' + joinTable3.slice(0, -5) + ' WHERE id NOT IN ( SELECT c.id FROM ' + subSelectQuery + '))';
        }
        if (source_name4_ref_name != null) {
          selectPart2 += ' UNION ALL ( SELECT ' + unionAllPart4.slice(0, -1) + ' FROM ' + joinTable4.slice(0, -5) + ' WHERE id NOT IN ( SELECT d.id FROM ' + subSelectQuery + '))';
        }

        this.reconService.getTablesDetails({ "sourceTables": this.sourceTables, "disputeSourceTables": this.disputeSourceTables, 'selectSql': selectPart1 + selectPart2 }).subscribe(data => {

          var tableBody = '<tbody><tr class="show_hide_details">';
          var role = '<td id="roleData">' + this.roleMasterdata[0].role_name + '</td>';
          var columnString = '';
          var detailsRow = '';

          // to display counts for Total no of Records & Total no of non-reconciled Records in the grid
          for (let index = 0; index < data['sourceResult'].length; index++) {
            const sourceElement = data['sourceResult'][index];
            const disputeSourceElement = data['disputeSourceResult'][index];
            for (const key in data['sourceResult'][index]) {
              if (Object.prototype.hasOwnProperty.call(sourceElement, key) && Object.prototype.hasOwnProperty.call(disputeSourceElement, key)) {
                columnString += '<td style="text-align:center">' + sourceElement[key][0] + '</td><td style="text-align:center">' + disputeSourceElement[key][0] + '</td>';
              }
            }
          }

          // prepare 2nd table header.
          //-- [formGroup]="disputeResolutionForm1"
          var fieldDetailsTable = '<form id="disputeResolutionForm1"><div id="field-details" class="collapsable" style="display: none;"><table class="display table table-hover table-checkable order-column m-t-20 width-per-100 table-bordered"><thead><tr>'
          var actionHeader = '<th rowspan="2" style="text-align:center">' + 'Action' + '</th>';
          var sourceNamesHeader = actionHeader;
          var fieldNamesSubHeader = '';
          var arrRecordsToBeReconciled = {};
          var mainHeaderIndex = 0;
          for (const key in this.subSourceDetails) {
            sourceNamesHeader += '<th style="text-align:center" class="main-header" colspan="' + this.subSourceDetails[key].length + '">' + key + '</th>';
            arrRecordsToBeReconciled[key] = [];
            if (Object.prototype.hasOwnProperty.call(this.subSourceDetails, key)) {
              for (let index = 0; index < this.subSourceDetails[key].length; index++) {
                fieldNamesSubHeader += '<th style="text-align:center" main-header-index="' + mainHeaderIndex + '" class="sub-header">' + this.subSourceDetails[key][index]['field_name'] + '</th>';
              }
            }
            mainHeaderIndex++;
          }

          fieldNamesSubHeader = '<tr>' + fieldNamesSubHeader + '</tr>';
          sourceNamesHeader = sourceNamesHeader + '</tr>' + fieldNamesSubHeader;
          
          //build table details
          var hiddenInputFields = '';
          var hiddenCompanyID = '<input type="hidden" name="" value="">';
          for (let i = 0; i < data['dataRows'].length; i++) {
            detailsRow += '<tr row-id="' + i + '"><td class="form-check-td"><input style="margin-left: auto;" class="form-check-input" type="checkbox" name="row_' + i + '"></td>';
            const element = data['dataRows'][i];
            for (let j = 0; j < element.length; j++) {
              if (j < numberOfDetailsRefIds) {
                hiddenInputFields += '<input type="hidden" name="' + i + '_details_ref_id_' + (j + 1) + '" value="' + element[j] + '">';
              } else {
                if (element[j] != null) {
                  detailsRow += '<td class="editable" style="text-align:center" default-value="' + element[j] + '">' + element[j] + '</td>';
                } else {
                  detailsRow += '<td class="editable"></td>';
                }
              }
            }
            detailsRow += '</tr>';
          }

          fieldDetailsTable = fieldDetailsTable + sourceNamesHeader + detailsRow + '</thead></table>';
          fieldDetailsTable += '<div class="card"><div class="body" style="text-align: center;">' +
            '<div class="button-demo">' +
            '<button type="submit" class="btn btn-primary btn-border-radius waves-effect">Submit</button>' +
            '<button type="button" class="btn btn-danger btn-border-radius waves-effect cancelButton">Cancel</button>' +
            '</div></div></div>' +
            '</div>' + hiddenInputFields + '</form>';

          tableBody += role + columnString + '</tr></tbody>';
          $("#tableExport tbody").remove();
          table.append(tableBody);

          $(document).ready(function () {
            var fieldNameKey = '';
            var fieldsTobeUpdated = {};

            // to collapse/expand details table on click of counts table row
            $('.show_hide_details').on('click', function () {
              if ($("#field-details").length == 0) {
                $('#detailed-data').append(fieldDetailsTable);
              }
              $(".collapsable").slideToggle();
            });

            // to make table cells editable
            $(document).on('click', '.form-check-input', function () {
              if (this.checked == true) {
                $(this).parents('tr').find('.editable').attr('contenteditable', true);
              } else {
                $(this).parents('tr').find('.editable').removeAttr('contenteditable');
              }
            });

            // to track changed field values (in datatable)
            $(document).on('focus', '[contenteditable]', function () {
              const $this = $(this);
              mainHeaderIndex = $this.closest('table').find('th.sub-header').eq($this.index() - 1).attr('main-header-index');
              fieldNameKey = $this.closest('table').find('th.main-header').eq(mainHeaderIndex).html() + '-' + $this.closest('table').find('th.sub-header').eq($this.index() - 1).html() + '-' + data['dataRows'][$this.parents('tr').attr('row-id')][mainHeaderIndex];
            }).on('blur keyup paste input', '[contenteditable]', function () {
              const $this = $(this);
              if ($this.attr('default-value') !== $this.html()) {
                fieldsTobeUpdated[fieldNameKey] = $this.html();
              } else if (Object.prototype.hasOwnProperty.call(fieldsTobeUpdated, fieldNameKey)) {
                delete fieldsTobeUpdated[fieldNameKey];
              }
            });

            // submit form data for reconciliation
            $(document).on('submit', '#disputeResolutionForm1', function (e) {
              // e.preventDefault();
              var disputeForm = $(this);
              var checkedRows = disputeForm.find("input[type='checkbox']").serializeArray();
              var rowsToBeUpdated = disputeForm.find("input[type='hidden']").serializeArray();
              var recordsToBeReconciled = {};
              var rowIds = [];
              for (const key in checkedRows) {
                if (Object.prototype.hasOwnProperty.call(checkedRows, key)) {
                  const element = checkedRows[key];
                  rowIds.push(element['name'].split('_')[1]);
                }
              }

              for (const key in rowsToBeUpdated) {
                if (Object.prototype.hasOwnProperty.call(rowsToBeUpdated, key)) {
                  const element = rowsToBeUpdated[key];
                  let splitName = element['name'].split('_');
                  if (rowIds.includes(splitName[0])) {
                    let sourceNameIndex = splitName.pop();
                    let sourceName = 'source_name_' + sourceNameIndex;
                    if (undefined == recordsToBeReconciled[mainScope.reconDefMstData[mainIndex][sourceName] + '-' + sourceNameIndex + '-' + mainScope.reconDefMstData[mainIndex]['company_ref_id']]) {
                      recordsToBeReconciled[mainScope.reconDefMstData[mainIndex][sourceName] + '-' + sourceNameIndex + '-' + mainScope.reconDefMstData[mainIndex]['company_ref_id']] = [];
                    }
                    recordsToBeReconciled[mainScope.reconDefMstData[mainIndex][sourceName] + '-' + sourceNameIndex + '-' + mainScope.reconDefMstData[mainIndex]['company_ref_id']].push(element['value']);
                  }
                }
              }

              mainScope.reconService.updateDisputedRecords({ "recordsToBeReconciled": recordsToBeReconciled, "fieldsTobeUpdated": fieldsTobeUpdated, "COMPANY_ID": mainScope.self_company_id }).subscribe(data => {
                console.log(data, 'Data is successfully updated');
              });
            });

            // to collapse table-details on click of Cancel Button
            $(document).on('click', '.cancelButton', function () {
              $(".collapsable").slideToggle();
            });

          });
        });

      } // end of if
    } // end of for 

  } // end of function

}
