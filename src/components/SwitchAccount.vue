<template>
  <div>
    <v-card class="pa-2" style="height: 100%; overflow: hidden; border-radius: 20px;">
      <v-list-item>
        <div class="v-btn v-cart-icon-wrapper">
          <v-icon medium left color="blue" class="ml-2">
            mdi-swap-horizontal
          </v-icon>
        </div>
        <v-list-item-content>
          <v-list-item-title class="v-card-headline">
            Switch Account
          </v-list-item-title>
          <v-list-item-subtitle class="connection-lost-title">
            Switch between reseller and company accounts
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <div>
        <v-container fluid>
          <v-data-iterator
            :items="orderedAccounts"
            :search="search"
            :items-per-page="9999"
            hide-default-footer
            class="container-iterator"
          >
            <template v-slot:header>
              <v-text-field
                label="Search"
                outlined
                dense
                :items="keys"
                v-model="search"
              ></v-text-field>
            </template>
            <template v-slot:default="props">
              <v-row style="max-height: 550px; overflow: auto;">
                <v-col
                  v-for="(item, index) in props.items"
                  :class="{ 'not-reseller': index === 0 }"
                  :key="index"
                  cols="12"
                  sm="12"
                  md="12"
                  lg="12"
                  class="mt-0 pt-0"
                >
                  <v-card style="border-radius: 20px;">
                    <div
                      class="switch-account-wrapper d-flex flex-wrap flex-row"
                      v-on:click="onClickSelectedAccount(item)"
                    >
                      <div class="switch-account-logo">
                        <v-img
                          src="https://picsum.photos/id/11/500/300"
                          lazy-src="https://picsum.photos/id/11/10/6"
                          aspect-ratio="1"
                          class="grey lighten-2"
                          max-width="45"
                          max-height="45"
                        ></v-img>
                      </div>
                      <div class="switch-right-wrapper">
                        <div class="swith-account-title">
                          {{ item.manager }}
                        </div>
                        <div v-if="index === 0" class="switch-account-description">
                          Manage all Companies as reseller
                        </div>
                        <div v-else class="switch-account-description">
                          Company admin. Manage this company’s activities
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-data-iterator>
        </v-container>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'SwitchAccount',
  data() {
    return {
      keys: ['manager'],
      itemsPerPageOptions: [4, 8, 12],
      itemsPerPage: 4,
      search: '',
      companies: [],
      orderedAccounts: []
    }
  },
  created() {
    this.orderedAccounts = this.getDropdown
  },
  methods: {
    ...mapActions({
      selectCompany: 'dashboard/selectCompany',
      setDialogBar: 'dashboard/setSwitchDialog'
    }),
    onClickSelectedAccount(account) {
      this.$store.dispatch('common/activateLoader', true)
      const refThis = this
      setTimeout(() => {
        refThis.$store.dispatch('common/activateLoader', false)
      }, 1000)
      this.setDialogBar(false)
      this.selectCompany(account)
      localStorage.setItem('companyId', account.companyId)
      localStorage.setItem('companyManager', account.manager)
      this.search = ''
      setTimeout(function() {
        refThis.$router.push('/')
      }, 500)
    }
  },
  computed: {
    ...mapGetters({
      isLoadingFromStore: 'common/getIsLoading',
      getDropdown: 'dashboard/getCompanyDropdowns',
      isSwitchDialogOpen: 'dashboard/getIsSwitchDialogOpen'
    }),
    ...mapState({
      currentCompany: state => state.dashboard.selectedCompany
    }),
    isLoading: {
      get() {
        return this.isLoadingFromStore
      },
      set() {}
    }
  }
}
</script>

<style scoped lang="scss">
.switch-account-wrapper {
  cursor: pointer;
  padding: 24px;
  .switch-account-logo {
    border: solid 1px #dcdcdc;
    width: 46px;
    height: 46px;
    margin-right: 16px;
  }
  .swith-account-title {
    font-family: 'Open Sans', sans-serif !important;
    margin-bottom: 5px;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.15;
    color: rgba(0, 0, 0, 0.87) !important;
  }
  .switch-account-description {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    line-height: 1.58;
    color: rgba(0, 0, 0, 0.87) !important;
  }
}

.connection-lost-title {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  color: rgba(0, 0, 0, 0.87);
}
.connection-lost-sub-title {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 13px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.54) !important;
}
.connection-lost-button {
}
.v-list-item__subtitle {
  font-family: Helvetica;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.2 !important;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87) !important;
}

.v-sheet {
  border-radius: 20px;
  background-color: white;
}

.v-card-headline {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: normal;
  color: var(--black-87);
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

.container-iterator {
  max-height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 5px;
}

/*
  .not-reseller {
    .swith-account-title {
      margin-top: 13px !important;
    }
    .switch-account-description {
      display: none !important;
    }
  }
*/
</style>
