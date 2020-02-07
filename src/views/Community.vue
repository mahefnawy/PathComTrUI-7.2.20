<template>
  <div class="page-wrapper">
    <v-overlay fixed :opacity="0.46" :value="isWantToEditCommunity" :z-index="999">
      <edit-community @closeEdit="onEditClose" />
    </v-overlay>
    <v-overlay fixed :opacity="0.46" :value="notificationSettingsOpened" :z-index="999">
      <v-card light class="pb-4 pa-6" style="width: 370px;">
        <v-list-item class="pl-0 pr-0 pb-8 pt-2">
          <span class="community-notification-header">
            Community Notification Settings
          </span>
        </v-list-item>
        <v-list-item
          class="community-notification-row pa-0"
          style="border-bottom: 1px solid rgba(80, 80, 80, 0.14);"
        >
          Notifications
          <v-switch
            v-model="notifications.IsNotificationsEnabled"
            color="#2196f3"
            hide-details
            class="community-notification-switch mt-0"
          />
        </v-list-item>
        <v-list-item class="community-notification-row pa-0">
          Dashboard notifications
          <v-switch
            v-model="notifications.IsDashboardEnabled"
            color="#2196f3"
            hide-details
            class="community-notification-switch mt-0"
            :disabled="!notifications.IsNotificationsEnabled"
          />
        </v-list-item>
        <v-list-item class="community-notification-row pa-0">
          Email notifications
          <v-switch
            v-model="notifications.IsEmailEnabled"
            color="#2196f3"
            hide-details
            class="community-notification-switch mt-0"
            :disabled="!notifications.IsNotificationsEnabled"
          />
        </v-list-item>
        <v-list-item class="community-notification-row pa-0">
          SMS notifications
          <v-switch
            v-model="notifications.IsWhatsappEnabled"
            color="#2196f3"
            hide-details
            class="community-notification-switch mt-0"
            :disabled="!notifications.IsNotificationsEnabled"
          />
        </v-list-item>
        <div class="d-flex flex-row flex-wrap justify-end pt-2">
          <v-btn text color="#f56c6c" class="pa-0" @click="notificationSettingsOpened = false"
            >CANCEL</v-btn
          >
          <v-btn text color="#2196f3" class="pa-0" @click="saveNotifications">SAVE</v-btn>
        </div>
      </v-card>
    </v-overlay>
    <v-overlay fixed :opacity="0.46" :value="isWantToDeleteCommunity" :z-index="999">
      <v-card light class="pb-4 pa-6" style="width: 444px;">
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon medium left color="blue" class="ml-2">
              mdi-delete
            </v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">Delete Community?</v-list-item-title>
            <v-list-item-subtitle class="v-card-sub-header">Community Name</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="pl-0 pr-0">
          <span class="delete-info">
            All incidents and data will be lost
          </span>
        </v-list-item>
        <div class="d-flex flex-row flex-wrap justify-end">
          <v-btn text color="#f56c6c" @click="onCancelDelete">CANCEL</v-btn>
          <v-btn text color="#2196f3" @click="onDelete">DELETE</v-btn>
        </div>
      </v-card>
    </v-overlay>
    <v-overlay fixed :opacity="0.46" :value="isWantToAddMembers" :z-index="999">
      <v-card light class="pb-4 pa-6" style="width: 600px;">
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon medium left color="blue" class="ml-2">
              mdi-account-multiple-plus
            </v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">Invite Members</v-list-item-title>
            <v-list-item-subtitle class="invite-sub-header v-card-sub-header"
              >Bring new members to the community</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="pl-0 pr-0 pt-10">
          <v-combobox
            v-model="model"
            :hide-no-data="!inviteSearch"
            :search-input.sync="inviteSearch"
            hide-selected
            label="Enter email addresses of the companies to be invited"
            multiple
            small-chips
            solo
            class="invite-input"
          >
            <template v-slot:selection="{ attrs, item, parent, selected }">
              <v-chip
                v-if="item === Object(item)"
                v-bind="attrs"
                :color="`${item.color} lighten-3`"
                :input-value="selected"
                label
                small
                class="invite-chip"
              >
                <span class="pr-2">
                  {{ item.text }}
                </span>
                <v-icon small @click="parent.selectItem(item)">mdi-close-circle</v-icon>
              </v-chip>
            </template>
            <template v-slot:item="{ index, item }">
              <v-text-field
                v-if="editing === item"
                v-model="editing.text"
                autofocus
                flat
                background-color="transparent"
                hide-details
                solo
                @keyup.enter="edit(index, item)"
              ></v-text-field>
              <v-chip v-else :color="`${item.color} lighten-3`" dark label small>
                {{ item.text }}
              </v-chip>
              <v-spacer></v-spacer>
              <v-list-item-action @click.stop>
                <v-btn icon @click.stop.prevent="edit(index, item)">
                  <v-icon>{{ editing !== item ? 'mdi-pencil' : 'mdi-check' }}</v-icon>
                </v-btn>
              </v-list-item-action>
            </template>
          </v-combobox>
        </v-list-item>
        <div class="d-flex flex-row flex-wrap justify-end">
          <v-btn text color="#f56c6c" @click="onCancelInvite">CANCEL</v-btn>
          <v-btn text color="#2196f3" @click="onInvite">INVITE</v-btn>
        </div>
      </v-card>
    </v-overlay>
    <v-overlay
      :value="isWantToAddNewCommunity"
      :class="{ newCommunityOverlay: isWantToAddNewCommunity }"
      :opacity="1"
      :z-index="999"
      color="white"
    >
      <new-community @closeAdd="onAddClose" />
    </v-overlay>
    <v-overlay
      fixed
      :opacity="0.46"
      :value="isWantToPostIncident"
      :z-index="999"
      color="white"
      class="post-incident-overlay"
    >
      <post-incident @closePostIncident="closePost()" />
    </v-overlay>
    <v-overlay
      :opacity="0.46"
      :value="isMobileInfo"
      :z-index="999"
      class="right-col-overlay"
      style="overflow: auto;"
    >
      <div class="right-col-wrapper">
        <right-column
          :pageView="true"
          @closeCommunity="isMobileInfo = false"
          @openNotifications="notificationSettingsOpened = true"
          @postIncident="isWantToPostIncident = true"
          @addMembers="isWantToAddMembers = true"
          @editCommunity="isWantToEditCommunity = true"
          @createCommunity="isWantToAddNewCommunity = true"
        />
      </div>
    </v-overlay>
    <v-layout wrap>
      <v-col class="main-column pr-0" cols="12" md="8">
        <v-card class="pl-1 pt-2 pr-1">
          <v-tabs v-model="tab" background-color="transparent" color="basil">
            <v-tab>
              Incidents
            </v-tab>
            <v-tab @click="getMembers">
              Members
            </v-tab>
            <div class="tablet-info-btn">
              <v-btn class="create-com-btn" @click="isMobileInfo = true" block rounded>
                <v-icon class="pr-1">mdi-information</v-icon>INFO
              </v-btn>
            </div>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <incidents :posts="postsGetter.Data" />
            </v-tab-item>
            <v-tab-item>
              <members />
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
      <v-col class="right-column" cols="12" md="4">
        <right-column
          class="right-col-desktop"
          @openNotifications="notificationSettingsOpened = true"
          @postIncident="isWantToPostIncident = true"
          @addMembers="isWantToAddMembers = true"
          @editCommunity="isWantToEditCommunity = true"
          @createCommunity="isWantToAddNewCommunity = true"
        />
      </v-col>
    </v-layout>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AuthenticationService from '../services/authentication'
import Incidents from '../components/ThreadSharing/Incidents'
import Members from '../components/ThreadSharing/Members'
import EditCommunity from '../components/ThreadSharing/EditCommunity'
import NewCommunity from '../components/ThreadSharing/NewCommunity'
import PostIncident from '../components/ThreadSharing/PostIncident'
import RightColumn from '../components/ThreadSharing/RightColumn'

export default {
  name: 'ThreatSharing',
  components: {
    Incidents,
    Members,
    EditCommunity,
    NewCommunity,
    PostIncident,
    RightColumn
  },
  data: () => ({
    search: '',
    itemsPerPageOptions: [5, 10, 20],
    itemsPerPage: 5,
    tab: null,
    items2: ['Incidents', 'Members'],
    text:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    notificationSettingsOpened: false,
    isWantToAddNewCommunity: false,
    isWantToEditCommunity: false,
    isWantToDeleteCommunity: false,
    isWantToAddMembers: false,
    isWantToPostIncident: false,
    ex11: true,
    inviteEmail: '',
    activator: null,
    attach: null,
    colors: ['#e0e0e0'],
    editing: null,
    index: -1,
    items: [],
    nonce: 1,
    menu: false,
    model: [],
    x: 0,
    inviteSearch: null,
    y: 0,
    IsNotificationsEnabled: false,
    yourPosts: [],
    isMobileInfo: false
  }),
  computed: {
    ...mapGetters({
      notifications: 'threadSharing/notificationGetter',
      suggestedCommunities: 'threadSharing/suggestedCommunGetter',
      selectedCommunity: 'threadSharing/selectedCommunityGetter',
      userGetter: 'auth/userGetter',
      postsGetter: 'threadSharing/postsGetter'
    })
  },
  watch: {
    model(val, prev) {
      if (val.length === prev.length) return

      this.model = val.map(v => {
        if (typeof v === 'string') {
          v = {
            text: v,
            color: this.colors[this.nonce - 1]
          }
          this.items.push(v)
          this.nonce++
        }
        return v
      })
    },
    IsNotificationsEnabled() {
      if (this.IsNotificationsEnabled) {
        this.notifications.IsDashboardEnabled = true
        this.notifications.IsEmailEnabled = true
        this.notifications.IsWhatsappEnabled = true
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (AuthenticationService.isAuthenticated()) {
        this.getCurrentUser()
      }
    }),
      this.$store.dispatch('threadSharing/getCommunities')
    this.$store.dispatch('threadSharing/getCommunityInfo')
    this.$store.dispatch('threadSharing/getBusinessCategories')
    this.$store.dispatch('threadSharing/getSuggestedCommunities')
    const compId =
      (this.userGetter.currentCompany && this.userGetter.currentCompany.id) ||
      localStorage.getItem('companyId')
    const communId = this.selectedCommunity.id || localStorage.getItem('communityId')
    this.$store.dispatch('threadSharing/fetchCommunityPosts', {
      companyId: compId,
      communId: communId
    })
    if (this.selectedCommunity && this.selectedCommunity.id) {
      this.$store.dispatch(
        'threadSharing/getMemberRequests',
        this.selectedCommunity.id || localStorage.getItem('communityId')
      )
    }
  },
  methods: {
    ...mapActions({
      getCurrentUser: 'auth/getCurrentUser'
    }),
    getMembers() {
      this.$store.dispatch('threadSharing/getMembers')
      this.$store.dispatch(
        'threadSharing/getMemberRequests',
        this.selectedCommunity.id || localStorage.getItem('communityId')
      )
    },
    onEditClose() {
      this.isWantToEditCommunity = false
    },
    onCancelDelete() {
      this.isWantToDeleteCommunity = false
    },
    onDelete() {},
    onCancelInvite() {
      this.isWantToAddMembers = false
    },
    onInvite() {
      this.$store.dispatch('threadSharing/inviteMembers').then(() => {
        this.isWantToAddMembers = false
      })
    },
    onAddClose() {
      this.isWantToAddNewCommunity = false
    },
    saveNotifications() {
      this.notifications.CommunityId = localStorage.getItem('communityId')
      this.notifications.UserId = localStorage.getItem('userId')
      const refThis = this
      this.$store.dispatch('threadSharing/saveNotifications', this.notifications).then(() => {
        refThis.notificationSettingsOpened = false
      })
    },
    joinCommunity(communityId, creatorId) {
      this.$store.dispatch('threadSharing/joinCommunity', {
        CommunityId: communityId,
        CreatorId: creatorId
      })
    },
    closePost() {
      this.isWantToPostIncident = false
      this.isWantToPostFromParent = false
    },
    edit(index, item) {
      if (!this.editing) {
        this.editing = item
        this.index = index
      } else {
        this.editing = null
        this.index = -1
      }
    },
    filter(item, queryText, itemText) {
      if (item.header) return false
      const hasValue = val => (val != null ? val : '')
      const text = hasValue(itemText)
      const query = hasValue(queryText)

      return (
        text
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
      )
    }
  }
}
</script>

<style scoped lang="scss">
.page-wrapper {
  height: 100%;
  position: relative;
}
.container {
  max-width: 100%;
}
::v-deep .suggested-card > .row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
::v-deep .v-data-footer {
  display: none !important;
}
.right-side- {
  &title {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
}
.ts-tags {
  align-items: center;
}
.ts-footer {
  display: flex;
  margin-top: 10px;
  margin-left: 0px;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.58;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}

.ts-like {
  margin-right: 10px;
  display: flex;
  span {
    align-items: center;
    font-size: inherit;
    line-height: unset;
    line-height: 2;
  }
}
.ts-message {
  margin-right: 40px;
  display: flex;
  span {
    align-items: center;
    font-size: inherit;
    line-height: unset;
    line-height: 2;
  }
}
.ts-harmful {
  margin-right: 15px;
  display: flex;

  span {
    align-items: center;
    font-size: inherit;
    line-height: unset;
    line-height: 2;
  }
}
.ts-success {
  display: flex;

  span {
    align-items: center;
    font-size: inherit;
    line-height: unset;
    line-height: 2;
  }
}
.ts-body {
  margin-top: 8px;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}
.ts-user-comp {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.58;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);

  a {
    text-decoration: none;
  }

  .ts-user-date {
    font-weight: bold;
  }
}
::v-deep .main-column > .v-card {
  border-radius: 20px !important;
  box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
}

// Threat sharing Content
.threat-sharing-content {
  min-height: 200px;
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
    0 3px 1px -2px rgba(80, 80, 80, 0.12);
  background-color: #ffffff;
  padding: 29px 32px 16px 32px;
}
.ts-header {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.ts-title {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 24px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}
// Threat sharing Content End

.v-tab {
  padding: 0 !important;
  font-size: 20px;
  font-weight: 400;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.15;
  letter-spacing: normal;
  text-transform: none;
  color: rgba(0, 0, 0, 0.87);
  min-width: min-content !important;
  text-align: left !important;
}
::v-deep .v-slide-group__wrapper {
  padding-left: 20px !important;
}
.v-card.v-sheet.theme--light {
  padding-top: 0;
  padding-left: 3px;
  padding-right: 3px;
  border-radius: 20px;
}

//search Input css
::v-deep .v-label--active {
  transform: translateY(-15px) scale(0.75);
}
::v-deep .v-text-field--outlined .v-label {
  top: 11px;
}
::v-deep .v-input__slot {
  -webkit-box-align: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
  min-height: 40px !important;
}
::v-deep label.v-label.theme--light {
  font-size: 12px;
}
.v-input {
  font-size: 13px !important;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.54);
}
// end search input

::v-deep .v-slide-group__content {
  border-bottom: 2px solid #e4e7ed;
  margin-right: 20px;
}
::v-deep .v-tabs-slider-wrapper {
  bottom: -1px !important;
  color: #0486fe !important;
}

::v-deep .v-tabs-bar {
  height: 60px !important;

  .v-tab {
    font-family: 'Open Sans', sans-serif !important;
    font-weight: 400;
    font-weight: 400;
    margin-right: 48px;
  }
}

::v-deep .community-selector {
  .v-tabs-bar {
    height: 44px !important;
  }
}
::v-deep .community-selector .v-slide-group__wrapper {
  background-color: #f5f7fa !important;
  height: 44px !important;
  padding-left: 0 !important;

  .v-tab {
    font-weight: 400;
    font-size: 14px !important;
    margin-top: 6px;
    margin-right: 32px !important;
  }
}
::v-deep .community-selector .v-slide-group__wrapper > div {
  height: 100%;
  margin-right: 0 !important;
}
::v-deep .v-text-field--outlined fieldset {
  border-radius: 6px !important;
}

.search-wrapper {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  > div {
    padding-right: 10px;
  }

  .filter-icon {
    color: rgba(0, 0, 0, 0.34) !important;
    cursor: pointer;
  }
}
.filter-field {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 13px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.54);
}
.create-com-btn {
  background-color: #2196f3 !important;
  color: #fff;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  height: 36px !important;
  text-transform: unset !important;
}
.ts-community-industry {
  color: rgba(0, 0, 0, 0.87) !important;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
}
.ts-people-icon {
  font-size: 16px;
}
.notification-wrapper {
  background-color: #fff;
  padding: 0 10px;
}
.v-menu__content {
  border-radius: 8px !important;
  box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8) !important;

  .v-list-item__title {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: var(--black-87);
  }
}
.v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 10px !important;
}
.ts-user-comp-detail {
  align-items: center;
  display: flex;
}
::v-deep .v-application--is-ltr .v-data-footer__select .v-select {
  margin: 0 !important;
}
::v-deep .v-btn:not(.v-btn--round).v-size--default,
::v-deep .v-btn--icon.v-size--default {
  height: 36px !important;
}
::v-deep .v-btn--icon.v-size--default {
  margin-left: 4px;
  width: 36px !important;
}

// Right Column
.right-side-content {
  a {
    text-decoration: none !important;
  }
  a:hover {
    text-decoration: underline !important;
  }
}
.right-side-title {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}
.right-side-sub-title {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #2196f3;
}
.about-community {
  display: flex;
  justify-content: space-between;
}
.about-community-statement {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}
.about-community-table-td {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}
.about-community-table-td-sec {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}
::v-deep .right-side-like .v-icon,
::v-deep .right-side-message .v-icon {
  height: 14px !important;
  width: 14px !important;
  font-size: 14px !important;
}
.right-side-like-comment-wrapper {
  align-items: center;
  display: flex;
  flex-direction: row;
}
.like-count,
.comment-count {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.58;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
  padding-left: 2px;
}
.suggested-card {
  display: flex;
  flex-direction: row;
  min-height: 76px;
  margin-bottom: 8px;
  border-radius: 4px !important;
  box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
    0 3px 1px -2px rgba(80, 80, 80, 0.12);

  .suggested-title {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-top: 6px;
    padding-bottom: 4px;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .suggested-com-detail {
    font-size: 12px;

    .suggested-people-icon {
      font-size: 14px !important;
    }
    .suggested-industry {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.58;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
    }
  }

  .suggested-right-action {
    align-items: center;
    display: flex;

    .suggested-btn {
      align-items: center;
      background-color: #2196f3 !important;
      color: #fff !important;
      text-transform: capitalize;
      display: flex;
      justify-content: center;

      @media only screen and (max-width: 500px) {
        padding: 0 3px !important;
      }
    }
  }
}
.community-notification-header {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: normal;
  color: #000;
}
.community-notification-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 25px !important;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);

  .community-notification-switch {
    align-items: center;
    display: flex;
    height: 25px !important;
    margin-top: 10px !important;
  }
}
.community-notification-row:first-child {
  border-bottom: 1px solid gray !important;
}
.v-card-headline {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: normal;
  color: #2196f3;
}
.v-card-sub-header {
  font-family: Helvetica;
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  color: #000 !important;
}
.edit-name-textfield,
.edit-description,
.edit-select {
  font-size: 13px !important;
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
.delete-info {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.72);
}
.invite-sub-header {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}
::v-deep .invite-input > .v-input__control > .v-input__slot {
  align-items: center;
  border-radius: 8px;
  border: solid 1px rgba(0, 0, 0, 0.16);
  background-color: #fff;
  box-shadow: unset !important;
  display: flex;

  .v-label {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.54);
    display: flex;
    align-items: center;
  }

  .invite-chip {
    border-radius: 18px !important;
    > span > span {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      color: #000000;
    }
  }
  .mdi-menu-down {
    display: none !important;
  }
}
.newCommunityOverlay {
  background-color: #fff !important;
  overflow: auto !important;
  height: 100% !important;
  max-width: 100vw !important;
  width: 100% !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;

  > ::v-deep .v-overlay__content {
    height: auto;
    width: 100%;
  }
}
.empty-posts {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #212121;
}
.empty-suggested-span {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
}
.create-first-btn {
  min-width: 70% !important;
  width: 221px !important;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 13px !important;
  font-weight: 400 !important;
  font-stretch: normal !important;
  font-style: normal !important;
  line-height: 1.71 !important;
  letter-spacing: normal !important;
}
::v-deep .investigate-overlay,
::v-deep .post-incident-overlay,
::v-deep .right-col-overlay {
  .v-overlay__content {
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    overflow-y: scroll;
  }
}

.right-col-wrapper {
  align-items: center;
  display: flex;
  padding: 78px;
  position: relative;
  width: 100%;

  @media only screen and (max-width: 769px) {
    padding: 16px !important;
  }

  @media only screen and (max-width: 500px) {
    padding: 5px !important;
    margin-right: -5px;
    width: 97%;
  }
}
::v-deep .v-slide-group__wrapper {
  contain: unset !important;
  overflow: visible !important;
}
.tablet-info-btn {
  display: none;
  position: absolute;
  right: -24px;
  top: -16px;
  z-index: 13;

  @media only screen and (max-width: 769px) {
    display: block;
  }
}
@media only screen and (max-width: 769px) {
  .v-application .main-column {
    padding: 0 16px !important;
  }
  .right-col-desktop {
    display: none !important;
  }
}
</style>
