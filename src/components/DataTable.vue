<template>
  <div class="wrapper">
    <v-overlay fixed :opacity="0.46" :value="isWantToDownload" :z-index="999">
      <v-card light class="download-card pb-4 pa-6" style="max-width: 580px;">
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon medium left color="blue" class="ml-2">
              mdi-download
            </v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">Download Current Page</v-list-item-title>
            <v-list-item-subtitle class="v-card-sub-header">Select file type</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="check-wrapper pl-0 pr-0">
          <div class="check-row">
            <v-checkbox color="#2196f3" v-model="download.xls" label="XLS" value="XLS" />
          </div>
          <div class="check-row">
            <v-checkbox color="#2196f3" v-model="download.csv" label="CSV" value="CSV" />
          </div>
          <div class="check-row">
            <v-checkbox color="#2196f3" v-model="download.pdf" label="PDF" value="PDF" />
          </div>
        </v-list-item>
        <div class="d-flex download-buttons flex-row flex-wrap">
          <v-btn text color="#f56c6c" @click="isWantToDownload = false">CANCEL</v-btn>
          <v-btn text color="#2196f3">DOWNLOAD</v-btn>
        </div>
      </v-card>
    </v-overlay>
    <v-card class="card">
      <v-list-item v-if="title.icon" class="pl-2 pr-0 pb-8">
        <div class="v-btn v-cart-icon-wrapper">
          <v-icon medium left color="blue" class="ml-2">
            {{ title.icon }}
          </v-icon>
        </div>
        <v-list-item-content class="pt-0 pb-0">
          <v-list-item-title class="v-card-headline"> {{ title.title }}</v-list-item-title>
          <v-list-item-subtitle> {{ title.subtitle }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <div class="table-wrapper">
        <div v-show="isSettingsOpened" class="settings-popup">
          <div class="settings-header">
            <span>Table Settings</span>
            <v-icon @click="isSettingsOpened = false" class="close-icon">mdi-close</v-icon>
          </div>
          <div class="sub-header">Show / Hide Columns</div>
          <div class="popup-row" v-for="(col, ind) of columns" :key="ind">
            {{ col.label }} <v-switch v-model="col.show"></v-switch>
          </div>
          <div class="sub-header">Freeze Columns</div>
          <div class="popup-row">First Column <v-switch v-model="firstColFixed"></v-switch></div>
          <div class="popup-row">Last Column <v-switch v-model="lastColFixed"></v-switch></div>
        </div>
        <div v-if="filterable || options" class="table-header">
          <div v-if="filterable" class="table-search">
            <v-icon class="pl-5 pr-6">mdi-magnify</v-icon>
            <v-text-field
              @mouseover.native="hover = true"
              label="Not working for now..."
              outlined
              dense
              class="filter-field"
              v-model="search"
            ></v-text-field>
            <v-icon class="filter-icon pl-2">mdi-filter-variant</v-icon>
          </div>
          <div v-if="options" class="table-settings">
            <v-menu v-if="addUsers" offset-y transition="scale-transition">
              <template v-slot:activator="{ on }">
                <v-btn icon class="btn-hover mr-1" v-on="on">
                  <v-icon @click="isWantToAddUsers = true">mdi-plus-circle</v-icon>
                </v-btn>
              </template>
              <v-list class="v-cart-dropdown-list">
                <v-list-item>
                  <v-list-item-title>
                    Add users manually
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    Import .xls
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    LDAP Integration
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-btn icon class="btn-hover mr-1" v-on="on">
                  <v-icon @click="isWantToDownload = true">mdi-download</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Download options</span>
            </v-tooltip>
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-btn icon class="btn-hover mr-1" v-on="on">
                  <v-icon>mdi-printer</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Print Options</span>
            </v-tooltip>
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-btn icon class="btn-hover mr-1" v-on="on">
                  <v-icon @click="isSettingsOpened = true">mdi-settings</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Table Settings</span>
            </v-tooltip>
          </div>
        </div>
        <div v-if="multipleSelection.length" class="selection-row">
          <v-checkbox
            @click.native="toggleAll()"
            v-model="selectionCheckbox"
            class="selection-all-check"
            color="white"
          ></v-checkbox>
          <span class="selection-span"> {{ multipleSelection.length }} Selected</span>
          <div class="action-icons">
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-btn icon class="btn-selected-hover mr-1" v-on="on">
                  <v-icon color="white" class="selection-icons">mdi-clipboard-text</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Clipboard</span>
            </v-tooltip>
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-btn icon class="btn-selected-hover mr-1" v-on="on">
                  <v-icon color="white" class="selection-icons">mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Edit selected rows</span>
            </v-tooltip>
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-btn icon class="btn-selected-hover mr-1" v-on="on">
                  <v-icon color="white" class="selection-icons">mdi-delete</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Delete selected rows</span>
            </v-tooltip>
            <v-tooltip bottom opacity="1" z-index="99999999">
              <template v-slot:activator="{ on }">
                <v-btn icon class="btn-selected-hover mr-1" v-on="on">
                  <v-icon color="white" class="selection-icons">mdi-download</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Download selected rows</span>
            </v-tooltip>
          </div>
        </div>
        <div class="table-container" v-if="tableData && tableData.length">
          <el-table
            :ref="refName"
            :data="tableData"
            :highlight-current-row="false"
            :row-class-name="tableRowClassName"
            :default-sort="{ prop: defaultSort || '', order: defaultSort || '' }"
            row-key="id"
            @selection-change="handleSelectionChange"
            lazy
          >
            <el-table-column
              v-if="selectable"
              type="selection"
              width="60"
              align="center"
            ></el-table-column>
            <el-table-column
              v-for="(col, ind) of columns"
              :key="ind"
              v-if="col.type === 'text' && col.show && col.property !== 'company'"
              :sortable="col.sortable"
              :prop="col.property"
              :fixed="col.fixed"
              :label="col.label"
              :align="col.align"
              :width="col.width || ''"
              :minWidth="col.minWidth || ''"
            >
            </el-table-column>
            <el-table-column
              v-for="(col, ind) of columns"
              :key="ind"
              v-if="col.type === 'text' && col.show && col.property === 'company'"
              class-name="company-cell"
              :sortable="col.sortable"
              :prop="col.property"
              :fixed="col.fixed"
              :label="col.label"
              :align="col.align"
              :width="col.width || ''"
              :minWidth="col.minWidth || ''"
            ></el-table-column>
            <el-table-column
              v-for="(col, ind) of columns"
              :key="ind"
              v-if="col.type === 'chart'"
              v-show="col.show"
              :sortable="col.sortable"
              :prop="col.property"
              :fixed="col.fixed"
              :label="col.label"
              :align="col.align"
              :width="col.width || ''"
              :minWidth="col.minWidth || ''"
            >
              <template slot-scope="scope">
                <v-tooltip bottom opacity="1">
                  <template v-slot:activator="{ on }">
                    <div class="ml-3" v-on="on">
                      <apexchart
                        type="pie"
                        width="65"
                        height="65"
                        :options="chartOptions"
                        :series="scope.row.series"
                      ></apexchart>
                    </div>
                  </template>
                  <p class="tooltip-line">{{ scope.row.series[0] }} No Response</p>
                  <p class="tooltip-line">{{ scope.row.series[1] }} Read</p>
                  <p class="tooltip-line">{{ scope.row.series[2] }} Click</p>
                  <p class="tooltip-line">{{ scope.row.series[3] }} Share</p>
                </v-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(col, ind) of columns"
              :key="ind"
              v-if="col.type === 'progress'"
              v-show="col.show"
              :sortable="col.sortable"
              :prop="col.property"
              :fixed="col.fixed"
              :label="col.label"
              :align="col.align"
              :width="col.width || ''"
              :minWidth="col.minWidth || ''"
            >
              <template slot-scope="scope">
                <div style="max-width: 80px; margin: 0 auto;">
                  <span class="progress-per"> {{ scope.row.progress }}% </span>
                  <v-progress-linear
                    background-color="#b3d4fc"
                    color="#2196f3"
                    reactive
                    rounded
                    height="4"
                    :value="scope.row.progress"
                  ></v-progress-linear>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(col, ind) of columns"
              :key="ind"
              v-if="col.type === 'status'"
              v-show="col.show"
              :sortable="col.sortable"
              :prop="col.property"
              :fixed="col.fixed"
              :label="col.label"
              :align="col.align"
              :width="col.width || ''"
              :minWidth="col.minWidth || ''"
            >
              <template slot-scope="scope">
                <v-btn
                  :class="[
                    'btn-status',
                    scope.row.status === 'Pending' ? 'btn-pending' : '',
                    scope.row.status === 'Clean' ? 'btn-pending' : '',
                    scope.row.status === 'Active' ? 'btn-active' : '',
                    scope.row.status === 'Inactive' ? 'btn-inactive' : '',
                    scope.row.status === 'Warning' ? 'btn-warning' : '',
                    scope.row.status === 'Malicious' ? 'btn-warning' : '',
                    scope.row.status === 'Cancelled' ? 'btn-cancelled' : '',
                    scope.row.status === 'Phishing' ? 'btn-cancelled' : ''
                  ]"
                  @click.native.prevent="deleteRow(scope.$index, tableData)"
                  block
                  rounded
                >
                  {{ scope.row.status }}
                </v-btn>
              </template>
            </el-table-column>
            <el-table-column
              v-if="rowActions && rowActions.length > 1"
              :fixed="actionFixed"
              label="Actions"
              align="center"
              width="106"
            >
              <template slot-scope="scope">
                <v-btn icon class="btn-hover">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-menu offset-y transition="scale-transition">
                  <template v-slot:activator="{ on }">
                    <v-btn icon class="btn-hover" v-on="on">
                      <v-icon @click="isWantToAddUsers = true">mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list class="v-cart-dropdown-list">
                    <v-list-item
                      v-for="(act, ind) of rowActions"
                      :key="ind"
                      v-if="!act.subElements"
                      class="sub-menu-el"
                    >
                      <v-list-item-title @click="rowAct(act.action)">
                        <v-icon class="pr-3">{{ act.icon }}</v-icon>
                        <span>{{ act.name }}</span>
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-for="(act, ind) of rowActions"
                      :key="ind + 'sub-item'"
                      v-if="act.subElements && act.subElements.length"
                    >
                      <v-menu open-on-hover bottom offset-y>
                        <template v-slot:activator="{ on }">
                          <v-list-item-title class="sub-element-wrapper" v-on="on">
                            <v-icon class="pr-3">{{ act.icon }}</v-icon>
                            <span>{{ act.name }}</span>
                            <v-icon style="float: right;">mdi-chevron-right</v-icon>
                          </v-list-item-title>
                        </template>
                        <v-list>
                          <v-list-item v-for="(item, ind) of act.subElements" :key="ind">
                            {{ item }}
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </el-table-column>
            <el-table-column
              v-if="rowActions && rowActions.length == 1"
              :fixed="actionFixed"
              label="Actions"
              align="center"
              width="106"
            >
              <template slot-scope="scope">
                <v-btn @click.native="$router.push('/target-users')" icon class="btn-hover">
                  <v-icon>{{ rowActions[0].icon }}</v-icon>
                </v-btn>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else class="empty-table">
          <div class="empty-inline">
            <h2>{{ empty.message }}</h2>
            <p>{{ empty.subMes }}</p>
            <v-btn class="empty-btn">
              <v-icon class="mr-2">{{ empty.icon }}</v-icon>
              {{ empty.btn }}
            </v-btn>
          </div>
        </div>
      </div>
      <div class="pagination block" v-if="pageSizes.length">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="pageSizes || [5, 10, 20, 50, 100]"
          :page-size="countRow || rowCount"
          layout="total, sizes, prev, pager, next"
          :total="initialData.length"
          style="font-family: 'Open Sans', sans-serif !important;"
        >
        </el-pagination>
      </div>
    </v-card>
  </div>
</template>
<script>
import Vue from 'vue'
window.Vue = Vue
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import VueApexCharts from 'vue-apexcharts'
Vue.use(ElementUI, { locale })

export default {
  components: {
    apexchart: VueApexCharts
  },
  props: {
    columns: {
      type: Array,
      required: true
    },
    table: {
      type: Array,
      required: false
    },
    refName: {
      type: String,
      required: true
    },
    title: {
      type: Object,
      required: true
    },
    pageSizes: {
      type: Array,
      required: false
    },
    defaultSort: {
      type: String,
      required: false
    },
    selectable: {
      type: Boolean,
      required: false
    },
    countRow: {
      type: Number,
      required: false
    },
    filterable: {
      type: Boolean,
      required: false
    },
    options: {
      type: Boolean,
      required: false
    },
    rowActions: {
      type: Array,
      required: false
    },
    addUsers: {
      type: Boolean,
      required: false
    },
    empty: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      initialData: [],
      tableData: [],
      rowCount: 10,
      totalCount: 100,
      currentPage: 1,
      multipleSelection: [],
      selectionCheckbox: false,
      selectionAll: false,
      series: [44, 55, 13, 43],
      chartOptions: {
        chart: {
          width: 65,
          height: 65,
          type: 'pie',
          offsetX: -10,
          offsetY: 5
        },
        labels: ['Team A', 'Team B', 'Team C', 'Team D'],
        colors: ['#67c23a', '#409eff', '#f56c6c', '#ffcc33'],
        legend: {
          show: false
        },
        tooltip: {
          enabled: false
        },
        dataLabels: {
          enabled: false
        }
      },
      search: '',
      isSettingsOpened: false,
      isWantToDownload: false,
      isWantToAddUsers: false,
      firstColFixed: true,
      lastColFixed: true,
      download: {
        xls: false,
        csv: false,
        pdf: false
      },
      actionFixed: 'right'
    }
  },
  watch: {
    tableData(data) {
      if (!this.tableData || this.tableData.length === 0) return []
      else return data
    },
    firstColFixed(val) {
      if (!val) {
        const fixedCol = this.columns.filter(c => c.fixed === 'left')
        if(fixedCol && fixedCol.length) {
          fixedCol[0].fixed = false
          this.firstColFixed = false
        }
      } else {
        const disabledCol = this.columns.filter(c => c.fixed === false)
        disabledCol[0].fixed = 'left'
        this.firstColFixed = true
      }
    },
    lastColFixed(val) {
      if (!val) {
        const fixedCol = this.columns.filter(c => c.fixed === 'right')
        if(fixedCol && fixedCol.length) {
          fixedCol[0].fixed = false
          this.lastColFixed = false
        } else {
          this.columns[this.columns.length - 1].fixed = false
        }
      } else {
        const disabledCol = this.columns.filter(c => c.fixed === false)
        if(disabledCol && disabledCol.length) {
          disabledCol[disabledCol.length - 1].fixed = 'right'
          this.lastColFixed = true
        } else {
          this.columns[this.columns.length - 1].fixed = 'right'
        }
      }
    },
    multipleSelection(selecteds) {
      if (this.countRow && this.countRow == selecteds.length) {
        this.selectionCheckbox = true
      } else if (this.rowCount && this.rowCount == selecteds.length) {
        this.selectionCheckbox = true
      } else {
        this.selectionCheckbox = false
      }
    }
  },
  created() {
    if (this.table.length) {
      this.initialData = this.table
      this.tableData = this.table
    }
    this.tableData = this.tableData.slice(0, this.countRow || this.rowCount)
    if (this.countRow) this.rowCount = this.countRow
  },
  mounted() {
    if (window.outerWidth < 768) {
      this.actionFixed = false
      const leftFixed = this.columns.filter(col => col.fixed === 'left')
      if (leftFixed) leftFixed[0].fixed = false

      const rightFixed = this.columns.filter(col => col.fixed === 'right')
      if (rightFixed) rightFixed[0].fixed = false
    }
  },
  methods: {
    tableRowClassName(row) {
      if (this.multipleSelection.some(r => r.id === row.row.id)) {
        return 'selected-row'
      }
    },
    handleSelectionChange(val) {
      if (this.currentPage === 1) {
        this.multipleSelection = val
      } else {
        this.multipleSelection.push(val)
      }
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    handleSizeChange(rows) {
      this.rowCount = rows
      if (this.currentPage === 1) {
        this.tableData = this.initialData.slice(0, rows)
      } else {
        this.tableData = this.initialData.slice(
          (this.currentPage - 1) * rows,
          this.currentPage * rows
        )
      }
    },
    handleCurrentChange(pageNum) {
      this.currentPage = pageNum
      if (pageNum === 1) {
        this.tableData = this.initialData.slice(0, this.rowCount)
      } else {
        this.tableData = this.initialData.slice(
          (pageNum - 1) * this.rowCount,
          pageNum * this.rowCount
        )
      }
    },
    toggleAll() {
      this.$refs.testTable.toggleAllSelection()
    },
    rowAct(action) {
      switch (action) {
        case 'details':
          this.$router.push('/analysis-details')
          break
        default:
          return false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  border-radius: 20px;
  padding-bottom: 24px;
  position: relative;
  height: max-content;

  @media only screen and (max-width: 500px) {
    padding-bottom: 200px;
  }

  .card {
    padding: 24px;
    border-radius: 12px !important;
    box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
    background-color: #fff;
    display: flex;
    justify-content: center;
    flex-direction: column;

    @media only screen and (max-width: 500px) {
      padding: 13px 0;
    }

    .table-wrapper {
      max-width: 100%;
      height: auto;
      position: relative;
      display: block;
      font-family: 'Open Sans', sans-serif !important;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
        0 1px 1px -1px rgba(204, 204, 204, 0.12);
      padding: 16px 0;

      .table-container {
        width: auto;
        max-width: 100%;
      }
      .settings-popup {
        background-color: #fff;
        top: 40px;
        border: 1px solid #2196f3;
        border-radius: 12px;
        box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
          0 1px 1px -1px rgba(204, 204, 204, 0.12);
        padding: 24px;
        position: absolute;
        right: 0;
        z-index: 999999;
        width: 277px;

        .settings-header {
          align-items: center;
          display: flex;
          justify-content: space-between;
          flex-direction: row;
          padding-bottom: 19px;

          .close-icon {
            cursor: pointer;
          }

          span {
            font-family: 'Open Sans', sans-serif !important;
            font-size: 24px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.29;
            letter-spacing: normal;
            color: rgba(0, 0, 0, 0.87);
          }
        }

        .sub-header {
          display: block;
          font-family: 'Open Sans', sans-serif !important;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.75;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.87);
          margin-bottom: 14px;
        }

        .popup-row {
          align-items: center;
          padding-bottom: 10px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;

          ::v-deep .v-input--selection-controls {
            margin-top: 0 !important;

            .accent--text {
              color: #2196f3 !important;
            }
            .v-input__slot {
              margin-bottom: 0 !important;
            }
            .v-messages {
              display: none !important;
            }
          }
        }
      }
      ::v-deep .el-table {
        border-bottom: unset !important;
        margin: 0 auto;
        width: max-content !important;
      }
      ::v-deep .el-table::before {
        display: none;
      }
      ::v-deep .el-table td {
        border-bottom: 1px solid #b3d4fc;
        padding: 2px 0 !important;
      }
      ::v-deep .el-table th {
        border-bottom: 1px solid #9e9e9e;
        padding: 5px 0 !important;

        .el-checkbox {
          z-index: 99999;
        }
        .el-checkbox__inner {
          margin-bottom: 3px;
        }
      }

      ::v-deep .el-table tr:nth-child(even) {
        background-color: #fafafa;
      }
      ::v-deep .el-table .hover-row {
        background-color: #f1f8fe !important;
      }
      ::v-deep .el-table td > .cell {
        color: #212121;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
      }
      ::v-deep .el-table th > .cell {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 12px;
        font-weight: 600;
        line-height: 1.3rem;
        color: #000000;
        min-height: 21px;

        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: #2196f3;
          border-color: #2196f3 !important;
        }
        .el-checkbox__input.is-checked .el-checkbox__inner {
          background-color: #2196f3;
          border-color: #2196f3 !important;
        }
        .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
          content: '';
          position: absolute;
          display: block;
          background-color: #fff;
          height: 3px;
          left: -1.4px;
          right: 0;
          top: 5px;
          width: 16px;
        }
      }
      ::v-deep .el-checkbox__input {
        line-height: 0;
      }
      ::v-deep .el-checkbox__inner {
        border: 1.5px solid #757575;
        border-radius: 3px;
        height: 16px;
        width: 16px;
      }
      ::v-deep .el-checkbox__input.is-checked > .el-checkbox__inner {
        border: 1.5px solid #2196f3;
      }
      ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner::after {
        border: 1.3px solid #fff;
        border-left: 0;
        border-top: 0;
        height: 8px;
        left: 4px;
        top: 0px;
        width: 4px;
      }
      ::v-deep .v-progress-linear {
        margin-bottom: 7px !important;
        margin-top: 5px !important;
      }
      .progress-per {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 10px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.9;
        letter-spacing: normal;
        text-align: center;
        color: rgba(0, 0, 0, 0.87);
      }
      .btn-status {
        border-radius: 18px !important;
        box-shadow: unset !important;
        color: #fff;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px !important;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.71;
        margin-bottom: 3px;
        margin: 0 auto;
        text-transform: capitalize;
        min-width: 80px !important;
        max-width: 100px !important;
        width: 90px !important;
        height: 32px !important;
      }
      .btn-pending {
        background-color: #00bcd4;
      }
      .btn-active {
        background-color: #2196f3;
      }
      .btn-inactive {
        background-color: #757575;
      }
      .btn-warning {
        background-color: #e6a23c;
      }
      .btn-cancelled {
        background-color: #f56c6c;
      }
      ::v-deep .selected-row {
        background-color: #bde0ff !important;
      }
      .selection-row {
        align-items: center;
        background-color: #2196f3;
        display: flex;
        height: 47px;
        padding: 0 12px;
        position: absolute;
        top: 75px;
        width: 100%;
        z-index: 999;

        .selection-span {
          font-family: 'Open Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: #fff;
          margin-left: 20px;
        }
        .action-icons {
          margin-left: 109px;

          .selection-icons {
            cursor: pointer;
          }
        }
      }

      .table-header {
        align-items: center;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-bottom: 20px;
        position: relative;
        width: 100%;
        min-height: 50px;

        @media only screen and (max-width: 500px) {
          flex-direction: column;
          .table-search {
            width: 100% !important;
          }
        }

        .table-search {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 40px;
          width: 60%;

          ::v-deep .v-text-field.v-text-field--enclosed {
            height: 40px !important;
          }
        }

        .table-settings {
          cursor: pointer;

          @media only screen and (max-width: 500px) {
            padding-right: 0;
            padding-top: 13px;
          }
        }

        ::v-deep label {
          font-family: 'Open Sans', sans-serif;
          font-size: 13px !important;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.54);
        }

        > div {
          padding-right: 10px;
        }

        .filter-icon {
          cursor: pointer;
        }
      }
    }

    .pagination {
      padding-top: 20px;
      align-items: center;
      display: flex;
      justify-content: flex-end;
      width: 100%;
    }
    ::v-deep .el-pagination .el-select .el-input {
      width: 90px;

      .el-input__inner {
        background-color: #f2f2f2;
      }
    }
    ::v-deep .el-select .el-input .el-select__caret {
      color: rgba(0, 0, 0, 0.87);
      font-weight: 700;
    }
    ::v-deep .el-pager {
      padding-left: 0 !important;
    }
    ::v-deep .el-pager > li {
      font-family: 'Open Sans', sans-serif;
      font-size: 12px;
      min-width: 13px;
    }
  }
}

.v-tooltip__content {
  background: #6d6d6d !important;
}
::v-deep .tooltip-line {
  font-size: 12px !important;
  font-family: 'Open Sans', sans-serif !important;
  margin-bottom: 3px !important;
}

::v-deep .k-grid td.k-state-selected,
::v-deep .k-grid tr.k-state-selected > td {
  background-color: rgba(0, 188, 212, 0.05) !important;
}

.v-list-item__subtitle {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.2 !important;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87) !important;
}

.v-sheet {
  border-radius: 20px !important;
}

.v-card-headline {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 24px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.2;
  letter-spacing: normal;
  color: #2196f3;
}

.v-cart-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  margin-right: 24px;
  box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
  border: solid 1px rgba(100, 181, 246, 0.5);
  background-color: #e3f2fd;
}
.download-card {
  display: flex;
  flex-direction: column;

  .check-wrapper {
    display: flex;
    flex-direction: column;

    .check-row {
      padding-left: 70px;
      width: 100%;

      ::v-deep .v-input--selection-controls.v-input {
        margin-top: 0 !important;
      }
      ::v-deep .v-label {
        font-size: 14px !important;
      }
      ::v-deep .v-messages {
        display: none;
      }
    }
    .check-row:first-child {
      padding-top: 27px;
    }
    .check-row:last-child {
      padding-bottom: 18px;
    }
  }
  .download-buttons {
    justify-content: space-between;
  }
}
.btn-hover:hover {
  color: #2196f3;
}
.btn-selected-hover {
  color: rgba(0, 0, 0, 0.87) !important;
}
.tooltip-span {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: rgba(255, 255, 255, 0.87);
}
::v-deep .v-sheet {
  border-radius: unset !important;
}
.sub-menu-el {
  cursor: pointer;
}
.sub-element-wrapper {
  cursor: pointer;
}
.empty-table {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  width: 100%;

  .empty-inline {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    h2 {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 24px;
      line-height: 1.29;
      font-weight: 400 !important;
      color: rgba(0, 0, 0, 0.87);
      padding-bottom: 16px;
      margin-bottom: 0 !important;
    }
    p {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 8px !important;
    }
    .empty-btn {
      border-radius: 18px;
      box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
      background-color: #2196f3 !important;
      color: #fff !important;
      text-transform: capitalize !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      height: 36px !important;
    }
  }
}
</style>
