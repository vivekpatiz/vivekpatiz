import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FullMortgageApplicationService } from '../../shared/services/full-mortgage-application.service';
import * as _ from 'lodash';
import { loadStripe } from '@stripe/stripe-js/pure';
import { DealGetSetService } from '@mmortgage/deal-pipeline-shared-lib';
import { LPPSharedService } from '../../shared/services/lppSharedService.service';
import { DealPipelineApplicationService } from '../../shared/services/deal-pipeline-application.service';
import { LeftSideMenuList } from '../../shared/models/shared.model';
import { FullapplicationComponent } from '../full-application-landing/fullapplication.component';
import { HttpClient } from '@angular/common/http';
import CryptoJS from 'crypto-js';
import { CommonGridFunctions, EnvironmentService, MortgageMAService } from '@mmortgage/core-shared-lib';
import { FmaUserAccessService } from '../../shared/services/fma-user-access.service';
import { FrameworkUtilityComponent } from '../../shared/form-utlity/framework-utility';
import { responsecodes } from '@mmortgage/digi-common-utility';
import { StatusMessage } from '../../shared/services/deal-pipeline-application.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GRID_EMIT_OBJECT, GRID_HEIGHT_VALUE, GridConfiguration, MORT_GRID_COLUMN_TYPE, PAGINATION_POSITION, WIDTH_TYPE } from '@mmortgage/grid';
import { FormBuilder } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-online-payment',
  templateUrl: './online-payment.component.html',
  styleUrls: ['./online-payment.component.less']
})
export class OnlinePaymentComponent implements OnInit {
  SHASIGN: any = "";
  enumData: any;
  appId;
  grid_Configuration: GridConfiguration;
  feeDetailsList:any;
  loadGrid: boolean = false;
  noDataFound: boolean = false;
  @ViewChild('paymentFeeGrid', { static: false }) paymentFeeGrid: any;
  @ViewChild("currencyTemplate", { static: false }) currencyTemplate: TemplateRef<any>;

  appNumber;
  loanData: any;
  productSelection: any;
  bookingFlag: boolean = false;
  mortgageFlag: boolean = false;
  legalFlag: boolean = false;
  dangerAlertShow?: boolean = false;
  reinspectionFlag: boolean = false;
  third_partyFlag: boolean = false;
  valuationFlag: boolean = false;
  nofeeFlag: boolean = false;
  priceId: any;
  feeLength: number = 0;
  applicationId: any;
  paymentFlag: boolean = false;
  params: any;
  flag: any;
  allowedAction:any=[];
  removeMortgageFlag: boolean = true;
  removeBookingFlag: boolean = true;
  removeLegalFlag: boolean = true;
  removeReFlag: boolean = true;
  removeValuationFlag: boolean = true;
  removeThirdFlag: boolean = true;
  refundLegalFlag: boolean = false;
  refundBookingFlag: boolean = false;
  refundReinspectionFlag: boolean = false;
  refundValuationFlag: boolean = false;
  refundThirdPartyFlag: boolean = false;
  refundAll_Flag: boolean = false;
  refundedAll: boolean = false;
  endFlag: boolean = false;
  changeFlag: boolean = false;
  productFlag: boolean = false;
  removeEndFlag: boolean = true;
  removeChangeFlag: boolean = true;
  removeProductFlag: boolean = true;
  keys = [];
  value = [];
  fee = [];
  feeTypes = [];
  fees = [];
  i = 0;
  totalFee: Number = 0;
  refundFee: Number = 0;
  selectedfee: any;
  totalSelectedFee: Number = 0;
  selectedFeeFlag: boolean = false;
  feeCopy: any[];
  count: number = 0;
  transactionDetails: any;
  paymentDetails: any = [];
  firstSave: boolean = false;
  Allpay_flag: boolean = false;
  showRefund_flag: boolean = false;
  applicationList: any;
  message: any;
  paidFees: any = [];
  removeintermedFlag: boolean = true;
  removeUWFlag: boolean = true;
  intermedFlag: boolean = false;
  underwritingFlag: boolean = false;
  refundProduct: boolean = false;
  refundIntermed: boolean = false;
  refundUnderwriting: boolean = false;
  reinspectionAmount: any;
  bookingAmount: any;
  valuationAmount: any;
  legalAmount: any;
  productAmount: any;
  intermediaryAmount: any;
  underwritingAmount: any;
  thirdpartyAmount: any;
  mortgagePurpose: any;
  leftMenuListFromAPI: any;
  leftMenuList = new LeftSideMenuList();
  isValidated: any;
  app_feeFlag: boolean = false;
  comp_feeFlag: boolean = false;
  refundAPPFeeFlag: boolean = false;
  removeAPPFeeFlag: boolean = true;
  refundCompFeeFlag: boolean = false;
  removeCompFeeFlag: boolean = true;
  totalPaymentDetails: any;
  isFormReadOnly: boolean;
  statusMessage: StatusMessage = new StatusMessage();
  modalMessage: any = null;
  modalErrorMessage: any = null;
  modalSuccessMessage: any = null;
  modalShowProgressBar: any = null;
  modalPopupRef: NgbModalRef;
  disableSaveBtn: boolean = false;
  msgPnl: boolean = true;
  @ViewChild('transactProcessing') transactPopupRef: TemplateRef<any>;
  errorTxnId: any;
  entityConfig: any;
  custFunObj: any;
  isAddedBalance: any = '';
  submitFeeType:any=[];
  amountSplit:any=[];
  isOverrideClicked:boolean=false;
  ischeckboxClicked:boolean=false;
  signUpForm1: any;
  checkedCondition1: boolean = false;
  checkedCondition2: boolean = false;
  checkedCondition3: boolean = false;
  checkedCondition4: boolean = false;
  checkedCondition: boolean;
  constructor(
    private formUtiObj: FrameworkUtilityComponent,
    private router: Router,
    private FullMortgageApplicationService: FullMortgageApplicationService,
    private dealGetSetService: DealGetSetService,
    private dealsetgetService: DealGetSetService,
    private route: ActivatedRoute,
    private fullApplication: FullapplicationComponent,
    private sharedService: LPPSharedService,
    private dealapplicationservice: DealPipelineApplicationService,
    private fmaService: FmaUserAccessService,
    private http: HttpClient,
    private modalService: NgbModal,
    private mmortgageService: MortgageMAService,
    private injector: Injector,
    public fb: FormBuilder,
  ) {
    this.mmortgageService.onUWEntityConfig.subscribe((data) => {
      this.entityConfig = data;
      this.custFunObj = this.injector.get(this.entityConfig?.custom_functions_provider_name);
    });
    
    this.signUpForm1 = this.fb.group({
      checkedCondition1: [false, ''],
      checkedCondition2: [false, ''],
      checkedCondition3: [false, ''],
      checkedCondition4: [false, '']
    });
  }

  ngOnInit() {
    console.log("get EnumData===>");
    this.sharedService.getEnumDataforAip().subscribe((result) => {
      console.log("enum data", result);
      this.enumData = result.body.data;
      this.selectedfee = [];
    });
    //get Application ID
    this.dealGetSetService.onApplicationSelect.subscribe(data => {
      this.applicationList = data;
      if (this.applicationList.applicationId) {
        this.appId = this.applicationList.applicationId;
      }
      else { this.appId = this.applicationList.appId; }

    })
    // let response = JSON.parse(sessionStorage.getItem('pay_user_details'));
    // console.log(response, "this.applicationList")
    // this.appId = response.applicationId;
    // this.appNumber = response.applicationFormNumber;
    if (this.appId)
    {
      this.getFeeDetails()
      this.InitData();
    }
    this.FullMortgageApplicationService.formProgress.next(20);
    if (this.appId == undefined) {
      this.route.params.subscribe((params: any) => (this.params = params));
      this.paymentFlag = true;
      // this.appId = this.params.id;
      // this.flag = this.params.flag;
      let transactionStatus = JSON.parse(sessionStorage.getItem('transaction'));
      this.appId = transactionStatus.appId;
      this.flag = transactionStatus.flag
      let requestObj = _.cloneDeep(this.route.snapshot.queryParams);
      sessionStorage.removeItem('transaction');
      console.log(requestObj);
      console.log(this.params, "params");
      this.applicationId = this.appId;
      requestObj["applicantId"] = "412356",
        requestObj["applicationId"] = this.appId;
      let saveTransactionRequest={}
      saveTransactionRequest["AAVZIP"]=requestObj.AAVZIP;
      saveTransactionRequest["Amount"]=requestObj.amount;
      saveTransactionRequest["NCERROR"]=requestObj.NCERROR;
      saveTransactionRequest["orderID"]=requestObj.orderID;
      saveTransactionRequest["PAYID"]=requestObj.PAYID;
      saveTransactionRequest["SHASIGN"]=requestObj.SHASIGN;
      saveTransactionRequest["STATUS"]=requestObj.STATUS;
      saveTransactionRequest["applicationId"]=this.appId;
      saveTransactionRequest["applicantId"]="";
      this.FullMortgageApplicationService.saveTransaction(saveTransactionRequest).subscribe(res => {
          this.getFeeDetails()
          this.InitData();         
      });
    }
    this.enableUserRoleAccess();
  }
  onMenuOptionChange(ischeckedCondition3 = false) {
    if (this.checkedCondition1 == false) {
      this.checkedCondition2 = false;
      this.checkedCondition3 = false;
      this.checkedCondition4 = false;
      this.checkedCondition = false;
    }
    if (this.checkedCondition2 == false) {
      this.checkedCondition3 = false;
      this.checkedCondition4 = false;
      this.checkedCondition = false;
    }
    if (this.checkedCondition3 == false) {
      this.checkedCondition4 = false;
      this.checkedCondition = false;
    }
  }
  InitData() {
    this.loanData = _.cloneDeep(this.dealsetgetService.getDealData());
    this.leftMenuListFromAPI = this.loanData.menu_list;
    this.mortgagePurpose = this.loanData.basic_Details.purposeOfMortgage;
    if (this.paymentFlag) {
      this.loanData.applicationId = this.appId;
      this.loanData.applicationFormNumber = this.loanData.appFormNumber;
      this.dealGetSetService.onApplicationSelect.next(this.loanData);
      this.dealsetgetService.onApplicationSelect.subscribe((objApp) => {
        console.log("objApp", objApp);
        this.appId = objApp.applicationId;
        this.appNumber = objApp.applicationFormNumber;

      });
    }
    this.isAddedBalance = this.loanData.basic_Details.addedBalance ? this.loanData.basic_Details.addedBalance : '';
    if (this.loanData.product_details.length > 0) {
      this.productSelection = this.loanData.product_details[0];
      console.log(this.productSelection, "this.productSelection");
      // this.payment();
      // this.retrieveTransactionDetails();
    } else {
      this.nofeeFlag = true;
    }
  }

  // retrieveFeeDetails(){
  //   let feeDetailsRequest={
  //     "applicationId":this.appId
  //   }
  //   this.FullMortgageApplicationService.getFeeDetails(feeDetailsRequest).subscribe((response)=>{
  //     if(response.head.statusCd===responsecodes.statuscode.SUCCESS){
  //       this.paymentDetails = response.body.feeDetails;
  //     }else{
        
  //     }
  //   })
  // }

      getFeeDetails(){
      let getFeeRequest={
          "applicationId":this.appId
      }
      this.FullMortgageApplicationService.getFeeDetails(getFeeRequest).subscribe((response)=>{
        if(response.head.statusCd===responsecodes.statuscode.SUCCESS){
          this.feeDetailsList=response.body.feeDetails;
          // {
          //   name: "Adjust to Loan Amount",
          //   imageURL: "",
          //   showButton: true,
          // },
          if(this.feeDetailsList != undefined){
            this.feeDetailsList.map((item,idx)=>{
                for(let i=0;i<item.allowedActions.length;i++){
                  let obj={
                    name:item.allowedActions[i],
                    imageURL: "",
                    showButton: true,
                  }
                  this.allowedAction.push(obj,...this.allowedAction)
                }
            })
            console.log("allowerd",this.allowedAction)
            this.getGridConfiguration()
            this.paymentFeeGrid.UpdateGridWithNewValues(this.feeDetailsList);
          }
          this.loadGrid = true;
        }else{
          this.loadGrid = false;
          this.noDataFound = true;
        }
      })
    }

    formatAmount(colfObj, dataSource) {
      let valueKey = colfObj.dataName;
      if (dataSource[valueKey]) {
        let amount = parseFloat(dataSource[valueKey]);
        let formattedAmount = amount.toLocaleString("en-GB", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
          style: "currency",
          currency: "GBP",
        });
        return formattedAmount;
      } else {
        return "";
      }
    }

    getGridConfiguration(){
      this.grid_Configuration = {
        Grid_config: {
          displayLoading: true,
          gridHeight: GRID_HEIGHT_VALUE.AUTO,
          canDisplayPagination: false,
          paginationPosition: PAGINATION_POSITION.BOTTOM,
          totalCount: 1, //some dynamic variable to be put here --> this.totalCount
          currentPage: 1,
          perPageCount: 50,
          topPaginationHideAt: null,
          bottomPaginationHideAt: null,
          injectRowTemplate: null,
          canDisplayPaginationDetail: true,
          canDisplayPerPageDropDown: true,
          columWidthType: WIDTH_TYPE.PIXELS
        },
        Coloum_Config: [
          {
            coloumType: MORT_GRID_COLUMN_TYPE.CHECK_BOX_BUTTON,
            displayName: null,
            dataName: null,
            hasSorting: false,
            columnWidth: "70px",
            isClickable: false,
            hideAt: [
              'XS',
              'S'
            ],
            actionItems: null,
            expaViewObject: null,
            multipleButton: null,
            customRenderFunction: null,
            injectColoumTemplate: null,
            text_align: null,
            text_color: null,
            text_selectedColor: null,
            defaultSortingOrder: null
          },

          {
            coloumType: MORT_GRID_COLUMN_TYPE.TEXT,
            displayName: "Fee Type",
            dataName: "feeType",
            hasSorting: true,
            columnWidth: "100px",
            isClickable: false,
            hideAt: ["XS", "S"],
            actionItems: null,
            expaViewObject: null,
            multipleButton: null,
            customRenderFunction: null,
            injectColoumTemplate: null,
            text_align: "left",
            text_color: null,
            text_selectedColor: null,
            defaultSortingOrder: null,
          },
          {
            coloumType: MORT_GRID_COLUMN_TYPE.TEXT,
            displayName: "Amount",
            dataName: "feeAmount",
            hasSorting: true,
            columnWidth: "100px",
            isClickable: false,
            hideAt: ["XS", "S"],
            actionItems: null,
            expaViewObject: null,
            multipleButton: null,
            customRenderFunction: null,
            injectColoumTemplate: {
              hasColoumnTemplate: true,
              coloumnTemplate: this.currencyTemplate,
            },
            text_align: "left",
            text_color: null,
            text_selectedColor: null,
            defaultSortingOrder: null,
          },
          {
            coloumType: MORT_GRID_COLUMN_TYPE.TEXT,
            displayName: "Payment Status",
            dataName: "status",
            hasSorting: true,
            columnWidth: "100px",
            isClickable: false,
            hideAt: ["XS", "S"],
            actionItems: null,
            expaViewObject: null,
            multipleButton: null,
            customRenderFunction: null,
            injectColoumTemplate: null,
            text_align: "left",
            text_color: null,
            text_selectedColor: null,
            defaultSortingOrder: null,
          },
           {
          coloumType: MORT_GRID_COLUMN_TYPE.ACTION_BUTTON,
          displayName: "Action",
          dataName: "",
          hasSorting: false,
          columnWidth:"100px",
          isClickable: true,
          hideAt: ["XS", "S"],
          actionItems: this.allowedAction,
          expaViewObject: null,
          multipleButton: null,
          customRenderFunction: null,
          injectColoumTemplate: {
            hasColoumnTemplate: true,
            coloumnTemplate: null,
          },
          text_align: "center",
          text_color: "#053c6d",
          text_selectedColor: null,
          defaultSortingOrder: null,
        },
        ]
      }
      this.loadGrid = true;
    }

    gridEmitData(eve: GRID_EMIT_OBJECT) {
      if (eve.selectedValue == true) {
        this.ischeckboxClicked=true;
        if (eve.Button_Clicked_For == "Row_CheckBox_Clicked") {
            let index = this.feeDetailsList.findIndex((p) => p.feeType ==eve.dataSource[0].feeType);
          this.selectedfee.push(this.feeDetailsList[index]);
            this.calcSelectedFee();
          }
         else if(eve.Button_Clicked_For == "All_CheckBox_Clicked"){
          this.selectedfee=this.feeDetailsList
          this.calcSelectedFee();
        }
      }
      if (eve.selectedValue == false) {
        this.ischeckboxClicked=false;
        if (eve.Button_Clicked_For == "Row_CheckBox_Clicked") {
          let index = this.selectedfee.findIndex((p) => p.feeType == eve.dataSource[0].feeType);
          this.selectedfee.splice(index, 1);
          this.calcSelectedFee();
        }
        else if(eve.Button_Clicked_For == "All_CheckBox_Clicked"){
          this.selectedfee=[];
          this.calcSelectedFee();
        }
      }

      if (eve.Button_Clicked_For == "Action_Button") {
        if (eve.selectedValue.name == "override") {
          this.isOverrideClicked=true;
          $('#overrideModal').modal('show')
        }
      }
  }

  initiateOverride(){

  }

  cancelOverride(){
    $('#overrideModal').modal('hide')
  }

  // retrieveTransactionDetails() {
  //   this.FullMortgageApplicationService.retrieveTransactionDetails(this.appId).subscribe(response => {
  //     if (response.head.statusCd === "100") {
  //       this.paymentDetails = response.body.payment_details;
  //       this.totalPaymentDetails = response.body;
  //       // let data = sessionStorage.getItem('productChange');
  //       this.paymentDetails.forEach(data => {
  //         if (data.fee_type == "APP") {
  //           data.fee_type = "Aplication";
  //         }
  //         else if (data.fee_type == "Comp") {
  //           data.fee_type = "Completion";
  //         }
  //         else if (data.fee_type == "Re-Inspection Fees") {
  //           data.fee_type = "Reinspection"
  //         } else if (data.fee_type == "Real Estate Commission") {
  //           data.fee_type = "ThirdParty"
  //         } else if (data.fee_type == "Underwriting Fees") {
  //           data.fee_type = "underwriting"
  //         } else if (data.fee_type == "Intermmediaries Fees") {
  //           data.fee_type = "intermmediaries"
  //         } else if (data.fee_type == "Product Fees") {
  //           data.fee_type = "ProductSwitch"
  //         } else if (data.fee_type === "Legal Fees") {
  //           data.fee_type = "Legal"
  //         } else if (data.fee_type === "Valuation Fees") {
  //           data.fee_type = "Valuation"
  //         } else if (data.fee_type === "Booking Fees") {
  //           data.fee_type = "Booking"
  //         }
  //       });
  //       console.log(this.paymentDetails, "payment details ------>")

  //       if (Number(this.productSelection.product_code) != response.body.product_code) {
  //         this.paymentDetails = [];
  //       } else {
  //         this.paymentDetails.forEach(data => {
  //           if (data.transaction_status === 'Y') {
  //             this.showRefund_flag = true;
  //             if (data.fee_type === "APP" || data.fee_type === "APP Fees") {
  //               this.removeAPPFeeFlag = false;
  //               if (data.refund_initiated === 'Y') {
  //                 this.refundAPPFeeFlag = true;
  //               }
  //             }
  //             else if (data.fee_type === "Comp" || data.fee_type === "Comp Fees") {
  //               this.removeCompFeeFlag = false;
  //               if (data.refund_initiated === 'Y') {
  //                 this.refundCompFeeFlag = true;
  //               }
  //             }
  //             else if (data.fee_type === "Booking" || data.fee_type === "Booking Fees") {
  //               this.removeBookingFlag = false;
  //               if (data.refund_initiated === 'Y') {
  //                 this.refundBookingFlag = true;
  //               }
  //             } else if (data.fee_type === "Reinspection" || data.fee_type === "Re-Inspection Fees") {
  //               this.removeReFlag = false;
  //               if (data.refund_initiated === 'Y') {
  //                 this.refundReinspectionFlag = true;
  //               }
  //             } else if (data.fee_type === "Legal" || data.fee_type === "Legal Fees") {
  //               this.removeLegalFlag = false;
  //               if (data.refund_initiated === 'Y') {
  //                 this.refundLegalFlag = true;
  //               }
  //             } else if (data.fee_type === "Mortgage") {
  //               this.removeMortgageFlag = false;
  //             } else if (data.fee_type === "Valuation" || data.fee_type === "Valuation Fees") {
  //               this.removeValuationFlag = false;
  //               if (data.refund_initiated === 'Y') {
  //                 this.refundValuationFlag = true;
  //               }
  //             }
  //             else if (data.fee_type === "ProductSwitch" || data.fee_type === "Product Fees") {
  //               this.removeProductFlag = false;
  //               if (data.refund_initiated === 'Y') {
  //                 this.refundProduct = true;
  //               }
  //             }
  //             // else if (data.fee_type === "ProductSwitch") {
  //             //   this.removeProductFlag = false;
  //             //   if (data.refund_initiated === 'Y') {
  //             //     this.refundProduct = true;
  //             //   }
  //             // }
  //             else if (data.fee_type === "ThirdParty" || data.fee_type === "Real Estate Commission") {
  //               this.removeThirdFlag = false;
  //               if (data.refund_initiated === 'Y') {
  //                 this.refundThirdPartyFlag = true;
  //               }
  //             } else if (data.fee_type === "ERC_End") {
  //               this.removeEndFlag = false;
  //             } else if (data.fee_type === "ERC_Change") {
  //               this.removeChangeFlag = false;
  //             }
  //             else if (data.fee_type === "intermmediaries" || data.fee_type === "Intermmediaries Fees") {
  //               this.removeintermedFlag = false;
  //               if (data.refund_initiated === 'Y') {
  //                 this.refundIntermed = true;
  //               }
  //             } else if (data.fee_type === "underwriting" || data.fee_type === "Underwriting Fees") {
  //               this.removeUWFlag = false;
  //               if (data.refund_initiated === 'Y') {
  //                 this.refundUnderwriting = true;
  //               }
  //             }
  //           }
  //           if (data.transaction_status === 'Y' && data.refund_initiated != 'Y') {
  //             this.refundAll_Flag = true;
  //           }
  //         })
  //       }
  //       this.payment('retrieve');
  //       // this.saveTransactionDetails(this.flag, this.applicationId, false);
  //     } else if (response.head.statusCd === "98") {
  //       this.payment('save');
  //       //this.saveTransactionDetails(this.flag, this.applicationId, true);
  //     }
  //   })
  // }

  saveTransactionDetails(flag, appID, saveData) {

    let saveRequest = [];
    if (saveData === false && this.fees.length === this.paymentDetails.length) {
      let selectedfee = [];
      if (flag != undefined) {
        if (flag.includes("Reinspection")) {
          selectedfee.push("Reinspection")
        }
        if (flag.includes("Booking")) {
          selectedfee.push("Booking")
        }
        if (flag.includes("Valuation")) {
          selectedfee.push("Valuation")
        }
        if (flag.includes("ThirdParty")) {
          selectedfee.push("ThirdParty")
        }
        if (flag.includes("ERC_End")) {
          selectedfee.push("ERC_End")
        }
        if (flag.includes("ERC_Change")) {
          selectedfee.push("ERC_Change")
        }
        if (flag.includes("ProductSwitch")) {
          selectedfee.push("ProductSwitch")
        }
        if (flag.includes("Mortgage")) {
          selectedfee.push("Mortgage")
        }
        if (flag.includes("Legal")) {
          selectedfee.push("Legal")
        }
        if (flag.includes("intermmediaries")) {
          selectedfee.push("intermmediaries")
        }
        if (flag.includes("underwriting")) {
          selectedfee.push("underwriting")
        }
      }
      this.paymentDetails.forEach(data => {
        if (data.fee_type === flag) {
          data.transaction_status = "Y"
        } else if (flag === 'PayAll') {
          data.transaction_status = "Y"
          this.Allpay_flag = true;
        } else if (flag != undefined) {
          for (let j = 0; j < selectedfee.length; j++) {
            if (selectedfee[j] === data.fee_type) {
              data.transaction_status = "Y"
            }
          }
        }
      })

      //To show button disable function
      let count = 0;
      this.paymentDetails.forEach(item => {
        if (item.transaction_status === 'Y') {
          count = count + 1;
        }
        if (count === this.paymentDetails.length) {
          this.Allpay_flag = true;
        }
      })
      saveRequest = _.cloneDeep(this.paymentDetails);
    }
    else {
      console.log(this.fees, "else fees list")
      this.fees.forEach(data => {
        this.transactionDetails = {
          fee_type: "",
          transaction_status: "",
          transaction_amount: 0,
          transaction_ref_no: "",
          refund_initiated: "N"
        }
        this.transactionDetails.fee_type = data.key;
        this.transactionDetails.transaction_amount = data.value;
        saveRequest.push(this.transactionDetails)
        this.paymentDetails = _.cloneDeep(saveRequest)
      })
      console.log("saveRequest ---->", saveRequest)
      let selectedfee = [];
      if (flag != undefined) {
        if (flag.includes("Reinspection")) {
          selectedfee.push("Reinspection")
        }
        if (flag.includes("Booking")) {
          selectedfee.push("Booking")
        }
        if (flag.includes("Valuation")) {
          selectedfee.push("Valuation")
        }
        if (flag.includes("ThirdParty")) {
          selectedfee.push("ThirdParty")
        }
        if (flag.includes("ERC_End")) {
          selectedfee.push("ERC_End")
        }
        if (flag.includes("ERC_Change")) {
          selectedfee.push("ERC_Change")
        }
        if (flag.includes("ProductSwitch")) {
          selectedfee.push("ProductSwitch")
        }
        if (flag.includes("Mortgage")) {
          selectedfee.push("Mortgage")
        }
        if (flag.includes("Legal")) {
          selectedfee.push("Legal")
        }
        if (flag.includes("intermmediaries")) {
          selectedfee.push("intermmediaries")
        }
        if (flag.includes("underwriting")) {
          selectedfee.push("underwriting")
        }
      }
      saveRequest.forEach(data => {
        if (data.fee_type === flag) {
          data.transaction_status = "Y"
        } else if (flag === "PayAll") {
          data.transaction_status = "Y"
        } else if (flag != undefined) {
          for (let j = 0; j < selectedfee.length; j++) {
            if (selectedfee[j] === data.fee_type) {
              data.transaction_status = "Y"
            }
          }
        }
        else {
          data.transaction_status = "N"
        }
      })
    }

    let request = {
      "application_id": this.appId,
      "payment_mode": "Stripe_Gateway",
      "product_code": Number(this.productSelection.product_code),
      "payment_details": saveRequest
    }
    console.log("request---->", request)
    this.FullMortgageApplicationService.saveTransactionDetails(request).subscribe(response => {
      if (response.head.statusCd === "100") {
        response.body.payment_details.forEach(data => {
          if (data.transaction_status === "Y") {
            if (data.fee_type === "APP") {
              this.removeAPPFeeFlag = false;
            } else if (data.fee_type === "Comp") {
              this.removeCompFeeFlag = false;
            } else if (data.fee_type === "Booking") {
              this.removeBookingFlag = false;
            } else if (data.fee_type === "Reinspection") {
              this.removeReFlag = false;
            } else if (data.fee_type === "Legal") {
              this.removeLegalFlag = false;
            } else if (data.fee_type === "Mortgage") {
              this.removeMortgageFlag = false;
            } else if (data.fee_type === "Valuation") {
              this.removeValuationFlag = false;
            } else if (data.fee_type === "ThirdParty") {
              this.removeThirdFlag = false;
            } else if (data.fee_type === "ERC_End") {
              this.removeEndFlag = false;
            } else if (data.fee_type === "ERC_Change") {
              this.removeChangeFlag = false;
            } else if (data.fee_type === "ProductSwitch") {
              this.removeProductFlag = false;
            } else if (data.fee_type === "intermmediaries") {
              this.removeintermedFlag = false;
            } else if (data.fee_type === "underwriting") {
              this.removeUWFlag = false;
            }
          }

          if (data.transaction_status === 'Y' && data.refund_initiated != 'Y') {
            this.refundAll_Flag = true;
          }


        })
        this.totalFee = 0;
        this.refundFee = 0;
        for (let i = 0; i < response.body.payment_details.length; i++) {
          if (response.body.payment_details[i].transaction_status === 'N' || response.body.payment_details[i].transaction_status === "") {
            this.totalFee = Number(this.totalFee) + Number(response.body.payment_details[i].transaction_amount);
          } else if (response.body.payment_details[i].transaction_status === 'Y' && (response.body.payment_details[i].refund_initiated === 'N' ||
            response.body.payment_details[i].refund_initiated === null)) {
            // } else if (response.body.payment_details[i].transaction_status === 'Y') {
            this.refundFee = Number(this.refundFee) + Number(response.body.payment_details[i].transaction_amount);
            this.refundedAll = true;
          }
        }
        //retrieve_fee-------------------->for updating fee status in consolidated monies
        let retrieveReq = {
          application_id: this.appId,
          product_code: this.productSelection.product_code
        }
        this.FullMortgageApplicationService.retrieveFeeDetails(retrieveReq).subscribe(responseData => {
          if (responseData.head.statusCd == "100") {
            let retrieveRes = responseData.body;
            let feeDetails = [];
            this.paidFees = [];
            feeDetails = retrieveRes.fee_details
            //update_Fee----------------------->                      
            feeDetails.forEach(element => {
              if ((element.fee_name == "APP") && (!this.removeAPPFeeFlag) && (!this.refundAPPFeeFlag)) {
                //this.paidFees = element;
                element.status = "Paid";
                //this.update_Fees(this.paidFees);
              } else if ((element.fee_name == "APP") && (!this.removeAPPFeeFlag) && (this.refundAPPFeeFlag)) {
                //this.paidFees = element;
                element.status = "Refunded";
                //this.update_Fees(this.paidFees);
              }
              if ((element.fee_name == "Comp") && (!this.removeCompFeeFlag) && (!this.refundCompFeeFlag)) {
                //this.paidFees = element;
                element.status = "Paid";
                //this.update_Fees(this.paidFees);
              } else if ((element.fee_name == "Comp") && (!this.removeCompFeeFlag) && (this.refundCompFeeFlag)) {
                //this.paidFees = element;
                element.status = "Refunded";
                //this.update_Fees(this.paidFees);
              }
              if ((element.fee_name == "Booking Fees") && (!this.removeBookingFlag) && (!this.refundBookingFlag)) {
                //this.paidFees = element;
                element.status = "Paid";
                //this.update_Fees(this.paidFees);
              } else if ((element.fee_name == "Booking Fees") && (!this.removeBookingFlag) && (this.refundBookingFlag)) {
                //this.paidFees = element;
                element.status = "Refunded";
                //this.update_Fees(this.paidFees);
              }
              if ((element.fee_name == "Legal Fees") && (!this.removeLegalFlag) && (!this.refundLegalFlag)) {
                //this.paidFees = element;
                element.status = "Paid";
                //this.update_Fees(this.paidFees);
              } else if ((element.fee_name == "Legal Fees") && (!this.removeLegalFlag) && (this.refundLegalFlag)) {
                //this.paidFees = element;
                element.status = "Refunded";
                //this.update_Fees(this.paidFees);
              }
              if ((element.fee_name == "Re-Inspection Fees") && (!this.removeReFlag) && (!this.refundReinspectionFlag)) {
                //this.paidFees = element;
                element.status = "Paid";
                //this.update_Fees(this.paidFees);
              } else if ((element.fee_name == "Re-Inspection Fees") && (!this.removeReFlag) && (this.refundReinspectionFlag)) {
                //this.paidFees = element;
                element.status = "Refunded";
                //this.update_Fees(this.paidFees);
              }
              if ((element.fee_name == "Real Estate Commission") && (!this.removeThirdFlag) && (!this.refundThirdPartyFlag)) { //note:fee_tagged_name: "third_party_fees"
                //this.paidFees = element;
                element.status = "Paid";
                //this.update_Fees(this.paidFees);
              } else if ((element.fee_name == "Real Estate Commission") && (!this.removeThirdFlag) && (this.refundThirdPartyFlag)) { //note:fee_tagged_name: "third_party_fees"
                //this.paidFees = element;
                element.status = "Refunded";
                //this.update_Fees(this.paidFees);
              }
              if ((element.fee_name == "Valuation Fees") && (!this.removeValuationFlag) && (!this.refundValuationFlag)) {
                //this.paidFees = element;
                element.status = "Paid";
                //this.update_Fees(this.paidFees);
              } else if ((element.fee_name == "Valuation Fees") && (!this.removeValuationFlag) && (this.refundValuationFlag)) {
                //this.paidFees = element;
                element.status = "Refunded";
                //this.update_Fees(this.paidFees);
              }
              if ((element.fee_name == "Intermmediaries Fees") && (!this.removeintermedFlag) && (!this.refundIntermed)) { //"fee_tagged_name": "intermmediaries_fees"
                //this.paidFees = element;
                element.status = "Paid";
                //this.update_Fees(this.paidFees);
              } else if ((element.fee_name == "Intermmediaries Fees") && (!this.removeintermedFlag) && (this.refundIntermed)) { //"fee_tagged_name": "intermmediaries_fees"
                //this.paidFees = element;
                element.status = "Refunded";
                //this.update_Fees(this.paidFees);
              }
              if ((element.fee_name == "Underwriting Fees") && (!this.removeUWFlag) && (!this.refundUnderwriting)) { //"fee_tagged_name": "underwriting_fees"
                //this.paidFees = element;
                element.status = "Paid";
                //this.update_Fees(this.paidFees);
              } else if ((element.fee_name == "Underwriting Fees") && (!this.removeUWFlag) && (this.refundUnderwriting)) { //"fee_tagged_name": "underwriting_fees"
                //this.paidFees = element;
                element.status = "Refunded";
                //this.update_Fees(this.paidFees);
              }
              if ((element.fee_name == "Product Fees") && (!this.removeProductFlag) && (!this.refundProduct)) { //"fee_tagged_name": "product_switch_fees"
                //this.paidFees = element;
                element.status = "Paid";
                //this.update_Fees(this.paidFees);
              } else if ((element.fee_name == "Product Fees") && (!this.removeProductFlag) && (this.refundProduct)) { //"fee_tagged_name": "product_switch_fees"
                //this.paidFees = element;
                element.status = "Refunded";
                //this.update_Fees(this.paidFees);
              }
              this.paidFees.push(element);
            });
            this.update_Fees(this.paidFees);
          }
        });
      }
    })
  }
  //update_Fee-----------------------> 
  update_Fees(feePaid) {
    let updateReq = {
      application_id: this.appId,
      product_code: this.productSelection.product_code,
      fee_details: feePaid
    }
    this.FullMortgageApplicationService.updateFeeDetails(updateReq).subscribe(responseUp => {
      if (responseUp.head.statusCd == "100") {
        console.log("Updated Paid Fees Successfully");
      }
    });
  }

  payment(input) {  //payment() ->commenting this function
    console.log(this.paymentDetails, "payment details in payment")

    if (input == 'retrieve') {
      //this.retrieveTransactionDetails();
      console.log(input, "payment details in payment2")

      this.paymentDetails.forEach(element => {
        console.log(element, "elemane in payment")
        if (element.fee_type == "APP") {  // && this.productSelection.booking_fee
          this.productSelection.booking_fee = element.transaction_amount;
        } else if (element.fee_type == "Comp") {  // && this.productSelection.booking_fee
          this.productSelection.booking_fee = element.transaction_amount;
        } else if (element.fee_type == "Booking") {  // && this.productSelection.booking_fee
          this.productSelection.booking_fee = element.transaction_amount;
        } else if (element.fee_type == "ThirdParty") { // && this.productSelection.third_party_fees
          this.productSelection.third_party_fees = element.transaction_amount;
        } else if (element.fee_type == "Reinspection") { // && this.productSelection.reinspection_fees
          this.productSelection.reinspection_fees = element.transaction_amount;
        } else if (element.fee_type == "underwriting") { // && this.productSelection.underwriting_fees
          this.productSelection.underwriting_fees = element.transaction_amount;
        } else if (element.fee_type == "intermmediaries") {  // && this.productSelection.intermmediaries_fees
          this.productSelection.intermmediaries_fees = element.transaction_amount;
        } else if (element.fee_type == "ProductSwitch") {  // && this.productSelection.product_switch_fees
          this.productSelection.product_switch_fees = element.transaction_amount;
        } else if (element.fee_type == "Legal") {  // && this.productSelection.legal_fees
          this.productSelection.legal_fees = element.transaction_amount;
          console.log(this.productSelection.legal_fees, "this.productSelection.legal_fees")
        } else if (element.fee_type == "Valuation") {  // && this.productSelection.valuation_fees
          this.productSelection.valuation_fees = element.transaction_amount;
        }
      });
    }
    console.log(input, "payment details in payment3")
    if (this.productSelection.booking_fee_applicable_flag == "Yes") {
      this.bookingFlag = true;
      this.keys.push("Booking Fee");
      this.feeTypes.push("Booking");
      this.value.push(this.productSelection.booking_fee);
      this.count++;
    }
    if (this.productSelection.app_fee != "" && this.productSelection.app_fee > 0) {
      this.app_feeFlag = true;
      this.keys.push("APP Fee");
      this.feeTypes.push("Application");
      this.value.push(this.productSelection.app_fee);
      console.log(this.productSelection.app_fee, "==>testing");
      this.count++;
    }
    if (this.productSelection.comp_fee != "" && this.productSelection.comp_fee > 0) {
      if (this.isAddedBalance != 'Yes') {
        this.comp_feeFlag = true;
        this.keys.push("Comp Fee");
        this.feeTypes.push("Completion");
        this.value.push(this.productSelection.comp_fee);
        console.log(this.productSelection.comp_fee, "==>testing");
        this.count++;
      }
    }
    // else{
    //   this.getFromRetrieveTransaction("Booking")
    // }

    if (this.productSelection.free_legal_flag && this.productSelection.legal_fees != "") {
      this.legalFlag = true;
      this.keys.push("Legal Fee");
      this.feeTypes.push("Legal");
      this.value.push(this.productSelection.legal_fees);
      this.count++;
    }
    // else{
    //   this.getFromRetrieveTransaction("Legal")
    // }
    if (this.productSelection.reinspection_fees && this.productSelection.reinspection_fees != 'N/A' && this.productSelection.reinspection_fees != 'NA' && this.productSelection.reinspection_fees != '' ) {
      this.reinspectionFlag = true;
      this.keys.push("ReInspection Fee");
      this.feeTypes.push("Reinspection");
      this.value.push(this.productSelection.reinspection_fees);
      this.count++;
    }
    // else{
    //   this.getFromRetrieveTransaction("Reinspection")
    // }
    if (this.productSelection.third_party_fees > 0 && this.productSelection.third_party_fees != "") {
      this.third_partyFlag = true;
      this.keys.push("Third Party Fee");
      this.feeTypes.push("ThirdParty");
      this.value.push(this.productSelection.third_party_fees);
      this.count++;
    }
    // else{
    //   this.getFromRetrieveTransaction("ThirdParty")
    // }
    if (
      this.productSelection.valuation_fees &&
      this.productSelection.valuation_fees != 0
    ) {
      this.valuationFlag = true;
      this.keys.push("Valuation Fee");
      this.feeTypes.push("Valuation");
      this.value.push(this.productSelection.valuation_fees);
      this.count++;
    }
    // else{
    //   this.getFromRetrieveTransaction("Valuation")
    // }
    if (
      this.productSelection.intermmediaries_fees &&
      this.productSelection.intermmediaries_fees != 0
    ) {
      this.intermedFlag = true;
      this.keys.push("Intermmediaries Fees");
      this.feeTypes.push("intermmediaries");
      this.value.push(this.productSelection.intermmediaries_fees);
      this.count++;
    }
    // else{
    //   this.getFromRetrieveTransaction("intermmediaries")
    // }
    if (
      this.productSelection.underwriting_fees &&
      this.productSelection.underwriting_fees != 0
    ) {
      this.underwritingFlag = true;
      this.keys.push("Underwriting Fees");
      this.feeTypes.push("underwriting");
      this.value.push(this.productSelection.underwriting_fees);
      this.count++;
    }
    // else{
    //   this.getFromRetrieveTransaction("underwriting")
    // }
    if (
      this.productSelection.product_switch_fees &&
      this.productSelection.product_switch_fees != 0
    ) {
      this.productFlag = true;
      this.keys.push("Product Fees");
      this.feeTypes.push("ProductSwitch");
      this.value.push(this.productSelection.product_switch_fees);
      this.count++;
    }
    // else{
    //   this.getFromRetrieveTransaction("ProductSwitch")
    // }
    console.log(this.keys, this.value, "test keys value");


    this.calcTotalFee(input);

    if (
      this.productSelection.booking_fee_applicable_flag == "No" &&
      !this.productSelection.app_fee &&
      !this.productSelection.comp_fee &&
      !this.productSelection.mortgage_exit_fees &&
      !this.productSelection.legal_fees &&
      !this.productSelection.reinspection_fees &&
      !this.productSelection.third_party_fees &&
      !this.productSelection.valuation_fees &&
      !this.productSelection.erc_end_mortgage &&
      !this.productSelection.erc_change_mortgage &&
      !this.productSelection.product_switch_fees &&
      !this.productSelection.underwriting_fees &&
      !this.productSelection.intermmediaries_fees
    ) {
      this.nofeeFlag = true;
    }

  }

  // payment(){  //get the fee details from retrieve_payment_details
  //   console.log(this.paymentDetails,"this.paymentDetails.=========>")    
  //   this.paymentDetails.forEach(data => {
  //     if ((data.fee_type == "Reinspection")) {
  //       this.reinspectionFlag = true;
  //       this.keys.push("ReInspection Fee");
  //       this.feeTypes.push("Reinspection");
  //       this.value.push(data.transaction_amount);
  //       this.count++;
  //       this.reinspectionAmount = data.transaction_amount;
  //     }  if ((data.fee_type == "ThirdParty")) {
  //       this.third_partyFlag = true;
  //       this.keys.push("Third Party Fee");
  //       this.feeTypes.push("ThirdParty");
  //       this.value.push(data.transaction_amount);
  //       this.count++;
  //       this.thirdpartyAmount = data.transaction_amount;
  //     } if ((data.fee_type == "underwriting")) {
  //       this.underwritingFlag = true;
  //       this.keys.push("Underwriting Fees");
  //       this.feeTypes.push("underwriting");
  //       this.value.push(data.transaction_amount);
  //       this.count++;
  //       this.underwritingAmount = data.transaction_amount;
  //     }  if ((data.fee_type == "intermmediaries")) {
  //       this.intermedFlag = true;
  //       this.keys.push("Intermmediaries Fees");
  //       this.feeTypes.push("intermmediaries");
  //       this.value.push(data.transaction_amount);
  //       this.count++;
  //       this.intermediaryAmount = data.transaction_amount;
  //     }  if ((data.fee_type == "ProductSwitch")) {
  //       this.productFlag = true;
  //       this.keys.push("Product Fees");
  //       this.feeTypes.push("ProductSwitch");
  //       this.value.push(data.transaction_amount);
  //       this.count++;
  //       this.productAmount = data.transaction_amount;
  //     }  if ((data.fee_type == "Legal")) {
  //       this.legalFlag = true;
  //       this.keys.push("Legal Fee");
  //       this.feeTypes.push("Legal");
  //       this.value.push(data.transaction_amount);
  //       this.count++;
  //       this.legalAmount = data.transaction_amount;
  //     }  if ((data.fee_type == "Valuation")) {
  //       this.valuationFlag = true;
  //       this.keys.push("Valuation Fee");
  //       this.feeTypes.push("Valuation");
  //       this.value.push(data.transaction_amount);
  //       this.count++;
  //       this.valuationAmount = data.transaction_amount;
  //     }  if ((data.fee_type == "Booking")) {
  //       this.bookingFlag = true;
  //       this.keys.push("Booking Fee");
  //       this.feeTypes.push("Booking");
  //       this.value.push(data.transaction_amount);
  //       this.count++;
  //       this.bookingAmount = data.transaction_amount;
  //     }
  //   });
  //   this.calcTotalFee();

  //   if (
  //     this.productSelection.booking_fee_applicable_flag == "No" &&
  //     !this.productSelection.mortgage_exit_fees &&
  //     !this.productSelection.legal_fees &&
  //     !this.productSelection.reinspection_fees &&
  //     !this.productSelection.third_party_fees &&
  //     !this.productSelection.valuation_fees &&
  //     !this.productSelection.erc_end_mortgage &&
  //     !this.productSelection.erc_change_mortgage &&
  //     !this.productSelection.product_switch_fees &&
  //     !this.productSelection.underwriting_fees &&
  //     !this.productSelection.intermmediaries_fees
  //   ) {
  //     this.nofeeFlag = true;
  //   }
  // }
  calcTotalFee(input) {
    console.log(this.keys, "keys------------->")
    console.log(this.feeTypes, "feeTypes------------->")
    this.keys = this.keys.filter((el, i, a) => i === a.indexOf(el))
    this.feeTypes = this.feeTypes.filter((el, i, a) => i === a.indexOf(el))
    for (var i = 0; i < this.keys.length; i++) {
      this.fee.push({
        key: this.keys[i],
        value: this.value[i],
      });
      this.totalFee = Number(this.totalFee) + Number(this.value[i]);
    }

    for (var i = 0; i < this.feeTypes.length; i++) {
      this.fees.push({
        key: this.feeTypes[i],
        value: this.value[i],
      });
      // this.totalFee = Number(this.totalFee) + Number(this.value[i]);
    }

    if (this.paymentDetails.length <= 0) {
      this.totalFee = 0;
      for (let i = 0; i < this.paymentDetails.length; i++) {
        if (this.paymentDetails[i].status == 'Yet to Pay') {
          this.totalFee = Number(this.totalFee) + Number(this.paymentDetails[i].feeAmount);
        }
      }
    }
    console.log(this.keys, "keys------------->")
    console.log(this.feeTypes, "feeTypes------------->")
    console.log("this.fee", this.fee);
    // this.selectedfee = _.cloneDeep(this.feeTypes);
    if (input == 'retrieve') {
      this.saveTransactionDetails(this.flag, this.applicationId, false)
    } else if (input == 'save') {
      this.saveTransactionDetails(this.flag, this.applicationId, true)
    }
  }
  calcSelectedFee() {
    this.selectedFeeFlag = true;

    this.totalSelectedFee = 0;

    for (var i = 0; i < this.selectedfee.length; i++) {
      if(this.selectedfee[i].status =="Yet to Pay"){
        this.totalSelectedFee =
          Number(this.totalSelectedFee) + Number(this.selectedfee[i].feeAmount);
        }
      }
  }

  //   remove(e,i,key1){
  //         if(e.target.checked){
  //           let index= this.selectedfee.findIndex(p => p.key == key1)
  //       this.selectedfee.splice(index,1)
  //     console.log(this.selectedfee,"test splice")
  //     this.calcSelectedFee();

  //     }else{
  // console.log(key1,"test key")
  //       let index= this.fee.findIndex(p => p.key == key1)
  //       this.selectedfee.push(this.fee[index])
  //     console.log(this.selectedfee,"test splice")
  //     if(this.selectedfee.length==this.count){
  //       this.selectedFeeFlag=false
  //     }
  //     else{
  //       this.calcSelectedFee();
  //     }

  //   }
  // }

  remove(e, key1) {
    if (e.checked) {
      console.log(key1, "test key");
      let index = this.paymentDetails.findIndex((p) => p.feeType == key1);
      this.selectedfee.push(this.paymentDetails[index]);
        this.calcSelectedFee();
    } else {
      let index = this.selectedfee.findIndex((p) => p.feeType == key1);
      this.selectedfee.splice(index, 1);
      this.calcSelectedFee();
    }
  }


  // remove(e, key1) {
  //   if (e.target.checked) {
  //     console.log(key1, "test key");
  //     let index = this.fee.findIndex((p) => p.key == key1);
  //     this.selectedfee.push(this.fee[index]);
  //     console.log(this.selectedfee, "test splice");
  //     if (this.selectedfee.length == 0) {
  //       this.selectedFeeFlag = false;
  //     } else {
  //       this.calcSelectedFee();
  //     }
  //   } else {
  //     let index = this.selectedfee.findIndex((p) => p.key == key1);
  //     this.selectedfee.splice(index, 1);
  //     console.log(this.selectedfee, "test splice");
  //     if (this.selectedfee.length == 0) {
  //       this.selectedFeeFlag = false;
  //     } else {
  //       this.calcSelectedFee();
  //     }
  //   }
  // }

  // async SubmitBooking() {
  //   var location = window.location.origin;
  //   var stripe = await loadStripe(
  //     "pk_test_51K8fB3Jk8Ce3wA6YIuOlYXN7LND8wh5VGtZvKPmlKZA498VNlNTu81r0NSUguT9H33N4hIW2bkvYkVswqjqtIkVK00sM9x5pcG"
  //   );
  //   stripe
  //     .redirectToCheckout({
  //       lineItems: [{ price: "price_1KCOm0Jk8Ce3wA6YY9pyx1jq", quantity: 1 }],
  //       mode: "payment",
  //       successUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/Booking",
  //       cancelUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/:flag",
  //     })
  //     .then(function (result) {
  //       if (result.error) {
  //         var displayError = document.getElementById("error-message");
  //         displayError.textContent = result.error.message;
  //       }
  //     });
  // }
  // async SubmitMortgage() {
  //   var location = window.location.origin;
  //   var stripe = await loadStripe(
  //     "pk_test_51K8fB3Jk8Ce3wA6YIuOlYXN7LND8wh5VGtZvKPmlKZA498VNlNTu81r0NSUguT9H33N4hIW2bkvYkVswqjqtIkVK00sM9x5pcG"
  //   );
  //   stripe
  //     .redirectToCheckout({
  //       lineItems: [{ price: "price_1J7fUSSBmM8qvAZq2eVwNhj3", quantity: 1 }],
  //       mode: "payment",
  //       successUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/Mortgage",
  //       cancelUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/:flag",
  //     })
  //     .then(function (result) {
  //       if (result.error) {
  //         var displayError = document.getElementById("error-message");
  //         displayError.textContent = result.error.message;
  //       }
  //     });
  // }
  // async SubmitLegal() {
  //   var location = window.location.origin;
  //   var stripe = await loadStripe(
  //     "pk_test_51K8fB3Jk8Ce3wA6YIuOlYXN7LND8wh5VGtZvKPmlKZA498VNlNTu81r0NSUguT9H33N4hIW2bkvYkVswqjqtIkVK00sM9x5pcG"
  //   );
  //   stripe
  //     .redirectToCheckout({
  //       lineItems: [{ price: "price_1KCOx3Jk8Ce3wA6YGvvsyRwp", quantity: 1 }],
  //       mode: "payment",
  //       successUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/Legal",
  //       cancelUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/:flag",
  //     })
  //     .then(function (result) {
  //       console.log("result --->", result)
  //       if (result.error) {
  //         var displayError = document.getElementById("error-message");
  //         displayError.textContent = result.error.message;
  //       }
  //     });
  // }
  // async SubmitValuation() {
  //   var location = window.location.origin;
  //   var stripe = await loadStripe(
  //     "pk_test_51K8fB3Jk8Ce3wA6YIuOlYXN7LND8wh5VGtZvKPmlKZA498VNlNTu81r0NSUguT9H33N4hIW2bkvYkVswqjqtIkVK00sM9x5pcG"
  //   );
  //   stripe
  //     .redirectToCheckout({
  //       lineItems: [{ price: "price_1KCOxsJk8Ce3wA6YLN2pAjSE", quantity: 1 }],
  //       mode: "payment",
  //       successUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/Valuation",
  //       cancelUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/:flag",
  //     })
  //     .then(function (result) {
  //       if (result.error) {
  //         var displayError = document.getElementById("error-message");
  //         displayError.textContent = result.error.message;
  //       }
  //     });
  // }
  // async SubmitRe() {
  //   var location = window.location.origin;
  //   var stripe = await loadStripe(
  //     "pk_test_51K8fB3Jk8Ce3wA6YIuOlYXN7LND8wh5VGtZvKPmlKZA498VNlNTu81r0NSUguT9H33N4hIW2bkvYkVswqjqtIkVK00sM9x5pcG"
  //   );
  //   stripe
  //     .redirectToCheckout({
  //       lineItems: [{ price: "price_1KCOypJk8Ce3wA6YROkAySVy", quantity: 1 }],
  //       mode: "payment",
  //       successUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/Reinspection",
  //       cancelUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/:flag",
  //     })
  //     .then(function (result) {
  //       if (result.error) {
  //         var displayError = document.getElementById("error-message");
  //         displayError.textContent = result.error.message;
  //       }
  //     });
  // }
  // async SubmitThirdPArty() {
  //   var location = window.location.origin;
  //   var stripe = await loadStripe(
  //     "pk_test_51K8fB3Jk8Ce3wA6YIuOlYXN7LND8wh5VGtZvKPmlKZA498VNlNTu81r0NSUguT9H33N4hIW2bkvYkVswqjqtIkVK00sM9x5pcG"
  //   );
  //   stripe
  //     .redirectToCheckout({
  //       lineItems: [{ price: "price_1KCOzWJk8Ce3wA6YaCLroZt7", quantity: 1 }],
  //       mode: "payment",
  //       successUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/ThirdParty",
  //       cancelUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/:flag",
  //     })
  //     .then(function (result) {
  //       if (result.error) {
  //         var displayError = document.getElementById("error-message");
  //         displayError.textContent = result.error.message;
  //       }
  //     });
  // }
  // async SubmitProduct() {
  //   var location = window.location.origin;
  //   var stripe = await loadStripe(
  //     "pk_test_51K8fB3Jk8Ce3wA6YIuOlYXN7LND8wh5VGtZvKPmlKZA498VNlNTu81r0NSUguT9H33N4hIW2bkvYkVswqjqtIkVK00sM9x5pcG"
  //   );
  //   stripe
  //     .redirectToCheckout({
  //       lineItems: [{ price: "price_1KWEyZJk8Ce3wA6YwP3kRL5x", quantity: 1 }],
  //       mode: "payment",
  //       successUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/ProductSwitch",
  //       cancelUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/:flag",
  //     })
  //     .then(function (result) {
  //       if (result.error) {
  //         var displayError = document.getElementById("error-message");
  //         displayError.textContent = result.error.message;
  //       }
  //     });
  // }
  // async SubmitIntermed() {
  //   var location = window.location.origin;
  //   var stripe = await loadStripe(
  //     "pk_test_51K8fB3Jk8Ce3wA6YIuOlYXN7LND8wh5VGtZvKPmlKZA498VNlNTu81r0NSUguT9H33N4hIW2bkvYkVswqjqtIkVK00sM9x5pcG"
  //   );
  //   stripe
  //     .redirectToCheckout({
  //       lineItems: [{ price: "price_1KWDtzJk8Ce3wA6Y0KCdTJ3N", quantity: 1 }],
  //       mode: "payment",
  //       successUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/intermmediaries",
  //       cancelUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/:flag",
  //     })
  //     .then(function (result) {
  //       if (result.error) {
  //         var displayError = document.getElementById("error-message");
  //         displayError.textContent = result.error.message;
  //       }
  //     });
  // }
  // async SubmitUnderwriting() {
  //   var location = window.location.origin;
  //   var stripe = await loadStripe(
  //     "pk_test_51K8fB3Jk8Ce3wA6YIuOlYXN7LND8wh5VGtZvKPmlKZA498VNlNTu81r0NSUguT9H33N4hIW2bkvYkVswqjqtIkVK00sM9x5pcG"
  //   );
  //   stripe
  //     .redirectToCheckout({
  //       lineItems: [{ price: "price_1KWEvzJk8Ce3wA6YvvYx5pI9", quantity: 1 }],
  //       mode: "payment",
  //       successUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/underwriting",
  //       cancelUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/:flag",
  //     })
  //     .then(function (result) {
  //       if (result.error) {
  //         var displayError = document.getElementById("error-message");
  //         displayError.textContent = result.error.message;
  //       }
  //     });
  // }
  // async SubmitChange() {
  //   var location = window.location.origin;
  //   var stripe = await loadStripe(
  //     "pk_test_51K8fB3Jk8Ce3wA6YIuOlYXN7LND8wh5VGtZvKPmlKZA498VNlNTu81r0NSUguT9H33N4hIW2bkvYkVswqjqtIkVK00sM9x5pcG"
  //   );
  //   stripe
  //     .redirectToCheckout({
  //       lineItems: [{ price: "price_1J8OQCSBmM8qvAZq87oYbX5R", quantity: 1 }],
  //       mode: "payment",
  //       successUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/ERC_Change",
  //       cancelUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/:flag",
  //     })
  //     .then(function (result) {
  //       if (result.error) {
  //         var displayError = document.getElementById("error-message");
  //         displayError.textContent = result.error.message;
  //       }
  //     });
  // }
  
  // async SubmitEnd() {
  //   var location = window.location.origin;
  //   var stripe = await loadStripe(
  //     "pk_test_51K8fB3Jk8Ce3wA6YIuOlYXN7LND8wh5VGtZvKPmlKZA498VNlNTu81r0NSUguT9H33N4hIW2bkvYkVswqjqtIkVK00sM9x5pcG"
  //   );
  //   stripe
  //     .redirectToCheckout({
  //       lineItems: [{ price: "price_1J8OQzSBmM8qvAZqzYolosOD", quantity: 1 }],
  //       mode: "payment",
  //       successUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/ERC_End",
  //       cancelUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/:flag",
  //     })
  //     .then(function (result) {
  //       console.log("result --->", result)
  //       if (result.error) {
  //         var displayError = document.getElementById("error-message");
  //         displayError.textContent = result.error.message;
  //       }
  //     });
  // }

  // async SubmitSelectedFees() {
  //   sessionStorage.setItem("selectedItems", JSON.stringify(this.selectedfee))
  //   let successURL = "#/landing/fullApplication/payment/" + this.appId + "/" + "selectedFee_";
  //   var location = window.location.origin;
  //   let line_items = [];
  //   for (let i = 0; i < this.selectedfee.length; i++) {
  //     let selectedItems = {
  //       price: "",
  //       quantity: 1
  //     }
  //     if (this.selectedfee[i].fee_type === 'Booking') {
  //       selectedItems.price = "price_1KCOm0Jk8Ce3wA6YY9pyx1jq"
  //       successURL = successURL + this.selectedfee[i].fee_type;
  //     } else if (this.selectedfee[i].fee_type === 'Legal') {
  //       selectedItems.price = "price_1KCOx3Jk8Ce3wA6YGvvsyRwp"
  //       successURL = successURL + this.selectedfee[i].fee_type;
  //     } else if (this.selectedfee[i].fee_type === 'Reinspection') {
  //       selectedItems.price = "price_1KCOypJk8Ce3wA6YROkAySVy"
  //       successURL = successURL + this.selectedfee[i].fee_type;
  //     } else if (this.selectedfee[i].fee_type === 'ThirdParty') {
  //       selectedItems.price = "price_1KCOzWJk8Ce3wA6YaCLroZt7"
  //       successURL = successURL + this.selectedfee[i].fee_type;
  //     } else if (this.selectedfee[i].fee_type === 'Valuation') {
  //       selectedItems.price = "price_1KCOxsJk8Ce3wA6YLN2pAjSE"
  //       successURL = successURL + this.selectedfee[i].fee_type;
  //     } else if (this.selectedfee[i].fee_type === 'Mortgage') {
  //       selectedItems.price = "price_1J7fUSSBmM8qvAZq2eVwNhj3"
  //       successURL = successURL + this.selectedfee[i].fee_type;
  //     }
  //     else if (this.selectedfee[i].fee_type === 'ProductSwitch') {
  //       selectedItems.price = "price_1KWEyZJk8Ce3wA6YwP3kRL5x"
  //       successURL = successURL + this.selectedfee[i].fee_type;
  //     }
  //     else if (this.selectedfee[i].fee_type === 'underwriting') {
  //       selectedItems.price = "price_1KWEvzJk8Ce3wA6YvvYx5pI9"
  //       successURL = successURL + this.selectedfee[i].fee_type;
  //     }
  //     else if (this.selectedfee[i].fee_type === 'intermmediaries') {
  //       selectedItems.price = "price_1KWDtzJk8Ce3wA6Y0KCdTJ3N"
  //       successURL = successURL + this.selectedfee[i].fee_type;
  //     }
  //     line_items.push(selectedItems);
  //   }
  //   console.log("lineItems ---->", line_items)
  //   console.log("successURL --->", successURL)
  //   var stripe = await loadStripe(
  //     "pk_test_51K8fB3Jk8Ce3wA6YIuOlYXN7LND8wh5VGtZvKPmlKZA498VNlNTu81r0NSUguT9H33N4hIW2bkvYkVswqjqtIkVK00sM9x5pcG"
  //   );
  //   stripe
  //     .redirectToCheckout({
  //       lineItems: line_items,
  //       mode: "payment",
  //       successUrl: location + window.location.pathname + successURL,
  //       cancelUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/:flag",
  //     })
  //     .then(function (result) {
  //       if (result.error) {
  //         var displayError = document.getElementById("error-message");
  //         displayError.textContent = result.error.message;
  //       }
  //     });
  // }



  // async SubmitAllFee() {
  //   var location = window.location.origin;
  //   let line_items = [];
  //   this.showRefund_flag = true;
  //   for (let i = 0; i < this.paymentDetails.length; i++) {
  //     let selectedItems = {
  //       price: "",
  //       quantity: 1
  //     }
  //     if (this.paymentDetails[i].fee_type === 'Booking' && (this.paymentDetails[i].transaction_status === 'N' || this.paymentDetails[i].transaction_status === "")) {
  //       selectedItems.price = "price_1KCOm0Jk8Ce3wA6YY9pyx1jq"
  //       line_items.push(selectedItems);
  //     } else if (this.feeTypes[i] === 'Legal' && (this.paymentDetails[i].transaction_status === 'N' || this.paymentDetails[i].transaction_status === "")) {
  //       selectedItems.price = "price_1KCOx3Jk8Ce3wA6YGvvsyRwp"
  //       line_items.push(selectedItems);
  //     } else if (this.feeTypes[i] === 'Reinspection' && (this.paymentDetails[i].transaction_status === 'N' || this.paymentDetails[i].transaction_status === "")) {
  //       selectedItems.price = "price_1KCOypJk8Ce3wA6YROkAySVy"
  //       line_items.push(selectedItems);
  //     } else if (this.feeTypes[i] === 'ThirdParty' && (this.paymentDetails[i].transaction_status === 'N' || this.paymentDetails[i].transaction_status === "")) {
  //       selectedItems.price = "price_1KCOzWJk8Ce3wA6YaCLroZt7"
  //       line_items.push(selectedItems);
  //     } else if (this.feeTypes[i] === 'Valuation' && (this.paymentDetails[i].transaction_status === 'N' || this.paymentDetails[i].transaction_status === "")) {
  //       selectedItems.price = "price_1KCOxsJk8Ce3wA6YLN2pAjSE"
  //       line_items.push(selectedItems);
  //     } else if (this.feeTypes[i] === 'Mortgage' && (this.paymentDetails[i].transaction_status === 'N' || this.paymentDetails[i].transaction_status === "")) {
  //       selectedItems.price = "price_1J7fUSSBmM8qvAZq2eVwNhj3"
  //       line_items.push(selectedItems);
  //     }
  //     else if (this.feeTypes[i] === 'ProductSwitch' && (this.paymentDetails[i].transaction_status === 'N' || this.paymentDetails[i].transaction_status === "")) {
  //       selectedItems.price = "price_1KWEyZJk8Ce3wA6YwP3kRL5x"
  //       line_items.push(selectedItems);
  //     }
  //     else if (this.feeTypes[i] === 'intermmediaries' && (this.paymentDetails[i].transaction_status === 'N' || this.paymentDetails[i].transaction_status === "")) {
  //       selectedItems.price = "price_1KWDtzJk8Ce3wA6Y0KCdTJ3N"
  //       line_items.push(selectedItems);
  //     }
  //     else if (this.feeTypes[i] === 'underwriting' && (this.paymentDetails[i].transaction_status === 'N' || this.paymentDetails[i].transaction_status === "")) {
  //       selectedItems.price = "price_1KWEvzJk8Ce3wA6YvvYx5pI9"
  //       line_items.push(selectedItems);
  //     }

  //   }
  //   console.log("lineItems ---->", line_items)
  //   var stripe = await loadStripe(
  //     "pk_test_51K8fB3Jk8Ce3wA6YIuOlYXN7LND8wh5VGtZvKPmlKZA498VNlNTu81r0NSUguT9H33N4hIW2bkvYkVswqjqtIkVK00sM9x5pcG"
  //   );
  //   stripe
  //     .redirectToCheckout({
  //       lineItems: line_items,
  //       mode: "payment",
  //       successUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/PayAll",
  //       cancelUrl:
  //         location + window.location.pathname +
  //         "#/landing/fullApplication/payment/" +
  //         this.appId +
  //         "/:flag",
  //     })
  //     .then(function (result) {
  //       if (result.error) {
  //         var displayError = document.getElementById("error-message");
  //         displayError.textContent = result.error.message;
  //       }
  //     });
  // }


  //Refund Transaction 
  // async RefundAmount(amount, feeType) {

  //   let Amount = Number(amount)
  //   let chargeRequest = `amount=${Amount}&currency=${'gbp'}&source=${'tok_amex'}`
  //   let RefundFee = feeType;
  //   this.dealapplicationservice.createCharge(chargeRequest).subscribe(data => {
  //     console.log("charge Created----->", data)
  //     let chargeID = data.id;

  //     let body = `charge=${chargeID}`;
  //     console.log("body------>", body)
  //     this.dealapplicationservice.stripeRefund(body).subscribe(response => {
  //       console.log("refund data---->", response)
  //       if (response.status === "succeeded") {

  //         this.paymentDetails.forEach(data => {
  //           if (Number(data.transaction_amount) === response.amount) {
  //             if (data.fee_type === 'Legal' || data.fee_type === 'Legal Fees') {
  //               this.refundLegalFlag = true;
  //               data.refund_initiated = 'Y'
  //             } else if (data.fee_type === 'Booking' || data.fee_type === 'Booking Fees') {
  //               this.refundBookingFlag = true;
  //               data.refund_initiated = 'Y'
  //             } else if (data.fee_type === 'Reinspection' || data.fee_type === 'Re-Inspection Fees') {
  //               this.refundReinspectionFlag = true;
  //               data.refund_initiated = 'Y'
  //             } else if (data.fee_type === 'ThirdParty' || data.fee_type === 'Real Estate Commission') {
  //               this.refundThirdPartyFlag = true;
  //               data.refund_initiated = 'Y'
  //             } else if (data.fee_type === 'Valuation' || data.fee_type === 'Valuation Fees') {
  //               this.refundValuationFlag = true;
  //               data.refund_initiated = 'Y'
  //             } else if (data.fee_type === 'ProductSwitch' || data.fee_type === 'Product Fees') {
  //               this.refundProduct = true;
  //               data.refund_initiated = 'Y'
  //             } else if (data.fee_type === 'intermmediaries' || data.fee_type === 'Intermmediaries Fees') {
  //               this.refundIntermed = true;
  //               data.refund_initiated = 'Y'
  //             } else if (data.fee_type === 'underwriting' || data.fee_type === 'Underwriting Fees') {
  //               this.refundUnderwriting = true;
  //               data.refund_initiated = 'Y'
  //             }
  //           }
  //         })
  //         let feeName: any = [];
  //         if (RefundFee === 'All') {
  //           this.paymentDetails.forEach(data => {
  //             if (data.transaction_status === 'Y') {
  //               data.refund_initiated = 'Y'
  //               feeName.push(data.fee_type);
  //             }
  //           })
  //           feeName.forEach(element => {
  //             if (element === 'Legal' || element === 'Legal Fees') {
  //               this.refundLegalFlag = true;
  //             } else if (element === 'Booking' || element === 'Booking Fees') {
  //               this.refundBookingFlag = true;
  //             } else if (element === 'Reinspection' || element === 'Re-Inspection Fees') {
  //               this.refundReinspectionFlag = true;
  //             } else if (element === 'ThirdParty' || element === 'Real Estate Commission') {
  //               this.refundThirdPartyFlag = true;
  //             } else if (element === 'Valuation' || element === 'Valuation Fees') {
  //               this.refundValuationFlag = true;
  //             } else if (element === 'ProductSwitch' || element === 'Product Fees') {
  //               this.refundProduct = true;
  //             } else if (element === 'intermmediaries' || element === 'Intermmediaries Fees') {
  //               this.refundIntermed = true;
  //             } else if (element === 'underwriting' || element === 'Underwriting Fees') {
  //               this.refundUnderwriting = true;
  //             }
  //           });
  //         }
  //         $('#refundMessage').modal('show');
  //         this.message = "Refunded Successfully";

  //         this.saveTransactionDetails(RefundFee, this.applicationId, false);

  //       } else {
  //         this.message = "Something went wrong, please try again later"
  //       }
  //     })
  //   })

  //   console.log("PaymentDetails---->", this.paymentDetails)

  // }


  backBtn() {
    this.router.navigate(['/landing/fullApplication/productSelectionDetails']);
  }
  cancelBtn() {
    this.router.navigate(["/landing/fullApplication/aipFullApplication/aipAppSummary"]);
  }

  resetModalMessage() {
    this.modalMessage = 'Please wait while we are working on your request..';
    this.modalErrorMessage = null;
    this.modalSuccessMessage = null;
    this.modalShowProgressBar = true;
  }
  showStatusMessage(msgType: string, errorCode: string, infoMsg: string, warningMsg: string, moduleName: string, warningMsgs: any, closePopup: boolean) {
    this.statusMessage = new StatusMessage();
    this.statusMessage.appName = "digiHome";
    // this.statusMessage.entityName = this.entityConfig.entityName;
    this.statusMessage.showMsg = true;
    this.statusMessage.moduleName = moduleName;
    this.statusMessage.warnignMessages = warningMsgs ? warningMsgs : [];
    this.statusMessage.msgType = msgType;
    this.statusMessage.errorCode = errorCode;
    this.statusMessage.infoMsg = infoMsg;
    this.statusMessage.warningMsg = warningMsg;
    if (closePopup) {
      this.modalService.dismissAll();
    }
    this.onMessageCall();
  }
  onMessageCall() {
    setTimeout(() => {
      this.msgPnl = false;
    }, 5000);
    this.msgPnl = true;
  }
  OnNextClick() {
    if (this.mortgagePurpose == 'Self Build') {
      this.router.navigate(['/landing/fullApplication/reqForFunds'])
    } else {
      this.router.navigate(['/landing/fullApplication/marketingPreference']);
    }
  }
  onValidateAndSave(eventType: any) {
    if (this.disableSaveBtn) {
      return;
    }
    this.disableSaveBtn = true;
    this.statusMessage = new StatusMessage();
    this.resetModalMessage();
    this.modalPopupRef = this.modalService.open(this.transactPopupRef, {
      size: 'l',
      backdrop: 'static',
      windowClass: 'transactPopup',
      keyboard: false,
      centered: true
    });
    setTimeout(() => {
      this.disableSaveBtn = false;
    }, 2000);
    let isFormsValid = this.formUtiObj.checkIsFormFieldsAreValid();
    if (isFormsValid) {
      this.setLeftMenuStatus("OnlinePayment", true);
      this.isValidated = true;
    }
    else {
      this.setLeftMenuStatus("OnlinePayment", false);
      this.isValidated = false;
    }

    if ((eventType == "SaveNext" && isFormsValid) || eventType == "Save") {
      this.fullApplication.onLeftMenuValidation("OnlinePayment", this.isValidated);
      console.log("template", this.loanData)
      let requestBody = this.loanData
      this.FullMortgageApplicationService.loanSave(requestBody).subscribe((data) => {
        let response: any = data
        console.log("save", data);
        if (response.head.statusCd == responsecodes.statuscode.SUCCESS) {
          this.loanData.data_version = response.body.data.data_version;
          let applicantlength = response.body.data.applicants.length;
          for (let j = 0; j < applicantlength; j++) {
            this.loanData.applicants[j].data_version = response.body.data.applicants[j].data_version;
          }
          let dealData = _.cloneDeep(this.loanData);
          this.dealsetgetService.setDealData(dealData);
          //this.router.navigate(['/landing/fullApplication/review-summary']);
          if (eventType == "SaveNext") {
            this.modalPopupRef.close();
            if (this.mortgagePurpose == 'Self Build') {
              this.router.navigate(['/landing/fullApplication/reqForFunds'])
            } else {
              this.router.navigate(['/landing/fullApplication/marketingPreference']);
            }
          }
          else {
            this.showStatusMessage("Success", "Error_100", "", "", "common", [], true);
          }
        }
        else {
          this.showStatusMessage("Error", "Error_" + response.head.statusCd, "", "", "common", [], true);
          this.errorTxnId = response.head.txnID;
        }
      }, (error) => {
        this.showStatusMessage("Error", "Error_" + error.errorCode, "", "", "common", [], true);
      });
    }
  }
  setLeftMenuStatus(menuName: String, isFormValid: boolean) {
    if (!this.loanData.menu_list) {
      this.loanData.menu_list = [];
    }
    let currentMenu = this.loanData.menu_list.filter(function (item) {
      return item.id === menuName;
    })[0];
    if (currentMenu == undefined) {
      this.loanData.menu_list.push({ 'id': menuName, 'isValidated': isFormValid });
    } else {
      currentMenu.isValidated = isFormValid;
    }
  }
  onSubmit(event, amount, id, flag?: any) {
    event.preventDefault();
    let ismultipleFee=false;
    // let finalamount=amount*100;
    if(this.selectedfee.length>1){
        // logic for multiple fee selection
        ismultipleFee=true
      this.selectedfee.map((item,idx)=>{
        this.submitFeeType.push(item.feeType);
        this.amountSplit.push(item.feeAmount)
      })
    }else{
      let temp=this.selectedfee[0].feeType
      this.submitFeeType.push(temp);
      console.log('',this.submitFeeType)
    }
    let body = {
      "applicationId": this.appId,
      "feeTypes": this.submitFeeType,
      "totalAmount": amount,
      "amountSplit":ismultipleFee?this.amountSplit:[],
      "payMode":"upi",
        "productCode":"2322",
        "payId":"24321",
    };
    this.FullMortgageApplicationService.createOrder(body).subscribe(res => {
      let obj = {
        'status': 'In-Progress',
        'appId': this.appId,
        'flag':  'payment'
      }
      sessionStorage.setItem('transaction', JSON.stringify(obj));
      this.SHASIGN = "07DFDDFF2391B8D531F49550BED2995CC88F8776";
      let form = (document.getElementById(id) as HTMLFormElement);
      let orderId = res.body.orderId;// Math.round(Math.random() * 100);//
      form.elements['ORDERID'].value = orderId;
      form.elements['AMOUNT'].value = amount;
      let ShaString = "ACCEPTURL=http://localhost:4205/#/landing/fullApplication/payment3654b20d-3bec-416b-a952-02d5c8b3e25aAMOUNT=" + amount + "3654b20d-3bec-416b-a952-02d5c8b3e25aCURRENCY=GBP3654b20d-3bec-416b-a952-02d5c8b3e25aLANGUAGE=en_US3654b20d-3bec-416b-a952-02d5c8b3e25aORDERID=" + orderId + "3654b20d-3bec-416b-a952-02d5c8b3e25aPSPID=tcsbancstest3654b20d-3bec-416b-a952-02d5c8b3e25a"
      let SHASIGN = CryptoJS.SHA1(ShaString);
      form.elements['SHASIGN'].value = SHASIGN; //"07DFDDFF2391B8D531F49550BED2995CC88F8776";
      form.method = "post";
      form.action = "https://mdepayments.epdq.co.uk/ncol/test/orderstandard_utf8.asp";
      form.submit();
    });


  }

  enableUserRoleAccess() {
    let userRoles = this.fmaService.userRoleFunctions;
    if (userRoles.functionKeys.indexOf('LA_FMA_PAYMENT_EDIT') == -1 || userRoles.isFormReadOnly) {
      this.isFormReadOnly = true;
    }
  }

  submit() {
        this.directdebitVL = new DebitCardVL();
        Loader.start();
        this.directdebitVL.getDebitDetails(this.fromaccountdetail, this.debitcarddetails).pipe(finalize(() => {
            Loader.stop();
        })).subscribe((data) => {
            if (data.error) {
                this.submitErrorMsg = ExceptionHandler.getInstance().prepareExceptionData(data.error);
                this.messageOptions.options.showMessageContent = true;
                this.messageOptions.options.messageType = 'error';
                if (this.submitErrorMsg && this.submitErrorMsg.fieldName && this.submitErrorMsg.description) {
                    this.messageOptions.options.message = this.submitErrorMsg.description;
                } else {
                    this.messageOptions.options.message = this.submitErrorMsg;
                }
            } else {
                let crtid = data[0].dataEntity[0].referenceDataList[1].identifier;
                let membershipNo = this.utils.getStartingZerosTruncated(this.customerDetails.customerId);
                const tempForm = document.createElement('form');
                let orderID = data[0].dataEntity[0].referenceDataList[1].identifier;
                tempForm.elements['ORDERID'].value = orderID;
                tempForm.elements['AMOUNT'].value = this.debitcarddetails.amount;
                let ShaString = "ACCEPTURL=http://localhost:1113/#/app/core/retail/widescreen/login/login-landing/payment3654b20d-3bec-416b-a952-02d5c8b3e25aAMOUNT=" + this.debitcarddetails.amount + "3654b20d-3bec-416b-a952-02d5c8b3e25aCURRENCY=GBP3654b20d-3bec-416b-a952-02d5c8b3e25aLANGUAGE=en_US3654b20d-3bec-416b-a952-02d5c8b3e25aORDERID=" + orderID + "3654b20d-3bec-416b-a952-02d5c8b3e25aPSPID=tcsbancstest3654b20d-3bec-416b-a952-02d5c8b3e25a"
                let SHASIGN = CryptoJS.SHA1(ShaString);
                tempForm.elements['SHASIGN'].value = SHASIGN; //"07DFDDFF2391B8D531F49550BED2995CC88F8776";
                tempForm.method = "post";
                tempForm.action = "https://mdepayments.epdq.co.uk/ncol/test/orderstandard_utf8.asp";
                tempForm.submit();

                // window.open(this.WorldpayDomain + "?&testMode=" + this.WorldpaytestMode + "&instId=" + this.WorldpayinstId + "&cartId=" + membershipNo + "&amount=" + this.debitcarddetails.amount + "&currency=GBP&shopperAdditionalAccountNumber=" + this.fromaccountdetail.fromAccount.accountNumberTruncated + "&MC_requestId=" + crtid + "&MC_opt=IB", '_self');
                // window.open( this.WorldpayDomain+"?&testMode="+this.WorldpaytestMode+"&instId="+this.WorldpayinstId+"&cartId="+crtid+"&amount="+this.debitcarddetails.amount+"&currency=GBP&shopperAdditionalAccountNumber="+this.fromaccountdetail.fromAccount.accountNumberTruncated+"&C_requestId="+this.fromaccountdetail.fromAccount.accountNumberTruncated+"&successURL="+ this.callbackURL+"cartId="+crtid+"&balance"+this.fromaccountdetail.fromAccount.availableBalance+"&pendingURL="+this.callbackURL+"&failureURL="+this.callbackURL+"&cancelURL"+this.callbackURL,'_self');
                // this.logoutFunc();
            }
        });
    }
}
