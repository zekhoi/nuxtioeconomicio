<template>
  <div>
    <hot-table :settings="hotSettings" />
  </div>
</template>

<script>
import { HotTable } from "@handsontable/vue";
import { ContextMenu } from "handsontable/plugins/contextMenu";
import "handsontable/dist/handsontable.full.css";
import {
  refreshSize,
  clearTable,
  updatePattern,
  getTableData,
  getIncome,
  loadData,
  downloadCSV,
  findTable,
  numberValidation,
} from "../../lib/helpers";
import {
  getLeontiefInv,
  getGhoshianInv,
  getImpactAnalysis,
  getOutputMultiplier,
  getIncomeMultiplier,
  getEmploymentMultiplier,
  getInputOrSupplyMultiplier,
  getKeySector,
} from "../../lib/matrix";
import { registerAllModules } from "handsontable/registry";
registerAllModules();

const tableset = require("../../data/tableset.json");
export default {
  components: {
    HotTable,
  },
  data() {
    return {
      inputoutputtable: "TableInputOutput",
      scenariotable: "TableScenario",
      incometable: "TableIncome",
      employmenttable: "TableEmployment",
      resulttable: "TableResult",
      transactiontable: "TableTransaction",
      hotSettings: {
        startCols: 8,
        startRows: 8,
        ...tableset,
        contextMenu: {
          items: {
            refresh: {
              name: "Refresh",
              callback: () => {
                refreshSize(this);
              },
            },
            row_above: {},
            row_below: {},

            col_left: {},
            col_right: {},

            remove_row: {},
            remove_col: {},

            alignment: {},
            separator1: ContextMenu.SEPARATOR,
            basic: {
              name: "Basic IO Analysis",
              submenu: {
                items: [
                  {
                    key: "basic:01",
                    name: "Leontief Inverse",
                    callback: () => {
                      let transaction = numberValidation(
                        getTableData(findTable(this, this.transactiontable))
                      );
                      let inputoutput = numberValidation(
                        getTableData(findTable(this, this.inputoutputtable))
                      )[0];
                      let result = getLeontiefInv(
                        transaction,
                        inputoutput
                      )._data;
                      // updatePattern(findTable(this, this.resulttable), {
                      //   type: "numeric",
                      //   numericFormat: {
                      //     pattern: "0,0.0000000000",
                      //   },
                      // });
                      loadData(findTable(this, this.resulttable), result);
                    },
                  },
                  {
                    key: "basic:02",
                    name: "Ghosian Inverse",
                    callback: () => {
                      let transaction = numberValidation(
                        getTableData(findTable(this, this.transactiontable))
                      );
                      let inputoutput = numberValidation(
                        getTableData(findTable(this, this.inputoutputtable))
                      )[0];
                      let result = getGhoshianInv(
                        transaction,
                        inputoutput
                      )._data;
                      // updatePattern(findTable(this, this.resulttable), {
                      //   type: "numeric",
                      //   numericFormat: {
                      //     pattern: "0,0.0000000000",
                      //   },
                      // });
                      loadData(findTable(this, this.resulttable), result);
                    },
                  },
                  {
                    key: "basic:03",
                    name: "Impact Analysis",
                    callback: () => {
                      let transaction = numberValidation(
                        getTableData(findTable(this, this.transactiontable))
                      );
                      let inputoutput = numberValidation(
                        getTableData(findTable(this, this.inputoutputtable))
                      )[0];
                      let scenario = numberValidation(
                        getTableData(findTable(this, this.scenariotable))
                      );
                      let result = getImpactAnalysis(
                        transaction,
                        inputoutput,
                        scenario
                      );
                      // updatePattern(findTable(this, this.resulttable), {
                      //   type: "numeric",
                      //   numericFormat: {
                      //     pattern: "0,0.00",
                      //   },
                      // });
                      loadData(findTable(this, this.resulttable), result);
                    },
                  },
                  {
                    key: "basic:04",
                    name: "Output Multiplier",
                    callback: () => {
                      let transaction = numberValidation(
                        getTableData(findTable(this, this.transactiontable))
                      );
                      let inputoutput = numberValidation(
                        getTableData(findTable(this, this.inputoutputtable))
                      )[0];
                      let result = getOutputMultiplier(
                        transaction,
                        inputoutput
                      );
                      // updatePattern(findTable(this, this.resulttable), {
                      //   type: "numeric",
                      //   numericFormat: {
                      //     pattern: "0,0.0000000000",
                      //   },
                      // });
                      loadData(findTable(this, this.resulttable), result);
                    },
                  },
                  {
                    key: "basic:05",
                    name: "Income Multiplier",
                    callback: () => {
                      let transaction = numberValidation(
                        getTableData(findTable(this, this.transactiontable))
                      );
                      let inputoutput = numberValidation(
                        getTableData(findTable(this, this.inputoutputtable))
                      )[0];
                      let income = getIncome(
                        numberValidation(
                          getTableData(findTable(this, this.incometable))
                        )
                      );
                      let result = getIncomeMultiplier(
                        transaction,
                        inputoutput,
                        income
                      );
                      // updatePattern(findTable(this, this.resulttable), {
                      //   type: "numeric",
                      //   numericFormat: {
                      //     pattern: "0,0.0000000000",
                      //   },
                      // });
                      loadData(findTable(this, this.resulttable), result);
                    },
                  },
                  // {
                  //   key: "basic:06",
                  //   name: "Employment Multiplier",
                  //   callback: () => {
                  //     let transaction = numberValidation(
                  //       getTableData(findTable(this, this.transactiontable))
                  //     );
                  //     let inputoutput = numberValidation(
                  //       getTableData(findTable(this, this.inputoutputtable))
                  //     )[0];
                  //     let employment = numberValidation(
                  //       getTableData(findTable(this, this.employmenttable))
                  //     )[0];
                  //     let result = getEmploymentMultiplier(
                  //       transaction,
                  //       inputoutput,
                  //       employment
                  //     );
                  // updatePattern(
                  //   findTable(this, this.resulttable),
                  //   "0,0.0000000000"
                  // );
                  //     loadData(findTable(this, this.resulttable), result);
                  //   },
                  // },
                  {
                    key: "basic:07",
                    name: "Input or Supply Multiplier",
                    callback: () => {
                      let transaction = numberValidation(
                        getTableData(findTable(this, this.transactiontable))
                      );
                      let inputoutput = numberValidation(
                        getTableData(findTable(this, this.inputoutputtable))
                      )[0];
                      let result = getInputOrSupplyMultiplier(
                        transaction,
                        inputoutput
                      );

                      // updatePattern(findTable(this, this.resulttable), {
                      //   type: "numeric",
                      //   numericFormat: {
                      //     pattern: "0,0.0000000000",
                      //   },
                      // });
                      loadData(findTable(this, this.resulttable), result);
                    },
                  },
                ],
              },
            },
            advance: {
              name: "Advance IO Analysis",
              submenu: {
                items: [
                  {
                    key: "advance:01",
                    name: "Key Sector",
                    callback: () => {
                      let transaction = numberValidation(
                        getTableData(findTable(this, this.transactiontable))
                      );
                      let inputoutput = numberValidation(
                        getTableData(findTable(this, this.inputoutputtable))
                      )[0];
                      let result = getKeySector(transaction, inputoutput);

                      // updatePattern(findTable(this, this.resulttable), {
                      //   columns: [
                      //     {
                      //       data: "sectorforward",
                      //       type: "text",
                      //     },
                      //     {
                      //       data: "valueforward",
                      //       type: "numeric",
                      //       numericFormat: {
                      //         pattern: "0,0.0000000000",
                      //       },
                      //     },
                      //     {
                      //       data: "sectorbackward",
                      //       type: "text",
                      //     },
                      //     {
                      //       data: "valuebackward",
                      //       type: "numeric",
                      //       numericFormat: {
                      //         pattern: "0,0.0000000000",
                      //       },
                      //     },
                      //   ],
                      // });
                      loadData(findTable(this, this.resulttable), result);
                    },
                  },
                  // {
                  //     key: "advance:02",
                  //     name: "Decomposition",
                  //     callback: () => {
                  //         alert("This is a Decomposition function");
                  //     },
                  // },
                  // {
                  //     key: "advance:03",
                  //     name: "MPM Analysis",
                  //     callback: () => {
                  //         alert("This is a MPM Analysis function");
                  //     },
                  // },
                  // {
                  //     key: "advance:04",
                  //     name: "Extraction Method",
                  //     callback: () => {
                  //         alert("This is a Extraction Method function");
                  //     },
                  // },
                  // {
                  //     key: "advance:05",
                  //     name: "Pull Analysis",
                  //     callback: () => {
                  //         alert("This is a Pull Analysis function");
                  //     },
                  // },
                  // {
                  //     key: "advance:06",
                  //     name: "Push Analysis",
                  //     callback: () => {
                  //         alert(getTableData(this, this.transactiontable));
                  //     },
                  // },
                  // {
                  //     key: "advance:07",
                  //     name: "FOI1",
                  //     callback: () => {
                  //         loadData(resultTable, getTableData(this, this.transactiontable));
                  //     },
                  // },
                ],
              },
            },
            separator2: ContextMenu.SEPARATOR,
            exportas_csv: {
              name: "Export as csv",
              callback: () => {
                downloadCSV(findTable(this, this.resulttable));
              },
            },
            // exportas_txt: {
            //   name: "Export as txt",
            //   callback: () => {
            //     alert("This is a Export as txt function");
            //   },
            // },
          },
        },
      },
    };
  },
  methods: {},
};
</script>
