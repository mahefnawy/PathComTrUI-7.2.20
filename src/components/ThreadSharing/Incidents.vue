<template>
  <v-card flat color="basil">
    <v-overlay fixed :opacity="0.46" :value="isWantToShareIncident" :z-index="999">
      <v-card light class="pb-4 pa-6" style="width: 600px;">
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon medium left color="blue" class="ml-2">
              mdi-send
            </v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">Share Incidents</v-list-item-title>
            <v-list-item-subtitle class="invite-sub-header v-card-sub-header"
              >Share this incident via email</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="share-inline-wrapper pl-0 pr-0 pt-10">
          <p class="share-combo-label">Recievers</p>
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
          <v-btn text color="#f56c6c" @click="isWantToShareIncident = false">CANCEL</v-btn>
          <v-btn text class="send-incident" color="#2196f3" @click="onSendIncident">SEND</v-btn>
        </div>
      </v-card>
    </v-overlay>
    <v-overlay
      fixed
      :opacity="0.46"
      :value="isWantToInvestigate"
      :z-index="999"
      color="white"
      class="investigate-overlay"
    >
      <transition name="fade">
        <investigate v-show="isWantToInvestigate" @closeInvestigate="isWantToInvestigate = false" />
      </transition>
    </v-overlay>
    <v-overlay
      fixed
      :opacity="0.46"
      :value="isWantToPostIncident"
      :z-index="999"
      color="white"
      class="post-incident-overlay"
    >
      <postIncident @closePostIncident="closePost()" :updatePost="postId" />
    </v-overlay>
    <v-card-text class="pt-0">
      <v-data-iterator
        :items="postList"
        :items-per-page.sync="itemsPerPage"
        :footer-props="{ itemsPerPageOptions }"
        :search="search"
      >
        <template v-slot:header>
          <div class="search-wrapper">
            <v-text-field
              @mouseover.native="hover = true"
              label="Filter by attributes or keywords"
              outlined
              dense
              class="filter-field pt-6"
              v-model="search"
            ></v-text-field>
            <v-icon class="filter-icon">mdi-filter-variant</v-icon>
          </div>
        </template>
        <template v-slot:default="items" v-if="items">
          <v-expansion-panels :multiple="false">
            <v-expansion-panel
              v-for="(post, ind) of items.items"
              :key="ind + post.CommunityPostId"
              style="border-image: none !important;"
              class="mb-4 mt-0"
            >
              <singlePost :post="post" @editIncident="editTheIncident" @deleteIncident="deleteTheIncident" />
            </v-expansion-panel>
          </v-expansion-panels>
        </template>
        <template slot="no-data">
          <div class="empty-communities">
            <div class="empty-communities-inline">
              <span class="no-community">
                No incident has been shared, yet
              </span>
              <v-btn :disabled="!isJoined(fetchedCommunity.CommunityId)" @click="isWantToPostIncident = true" class="post-inc-btn mb-11" block rounded>
                Post Incident
              </v-btn>
            </div>
          </div>
        </template>
      </v-data-iterator>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Investigate from '../ThreadSharing/Investigate'
import PostIncident from '../ThreadSharing/PostIncident'
import SinglePost from '../ThreadSharing/SinglePost'
export default {
  components: {
    Investigate,
    PostIncident,
    SinglePost
  },
  props: {
    posts: {
      type: Array,
      required: false
    }
  },
  data: () => ({
    search: '',
    itemsPerPageOptions: [5, 10, 20],
    itemsPerPage: 5,
    items2: ['Incidents', 'Communities', 'Members'],
    toggle: false,
    tab: null,
    expanded: false,
    commentOpened: false,
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
    isWantToPostIncident: false,
    postList: [],
    postId: null
  }),
  computed: {
    ...mapGetters({
      postedIncident: 'threadSharing/incidentGetter',
      postsGetter: 'threadSharing/postsGetter',
      selectedCommunity: 'threadSharing/selectedCommunityGetter',
      userGetter: 'auth/userGetter',
      fetchedCommunity: 'threadSharing/fetchedCommunGetter',
      myCommunities: 'threadSharing/myCommunitiesGetter'
    }),
    isWantToPostFromParent: {
      get() {
        return this.$store.state.threadSharing.isWantToPostIncident
      },
      set(bool) {
        this.$store.state.threadSharing.isWantToPostIncident = bool
      }
    },
    isWantToInvestigate: {
      get() {
        return this.$store.state.threadSharing.isWantToInvestigate
      },
      set(bool) {
        this.$store.state.threadSharing.isWantToInvestigate = bool
      }
    },
    isWantToShareIncident: {
      get() {
        return this.$store.state.threadSharing.isWantToShareIncident
      },
      set(bool) {
        this.$store.state.threadSharing.isWantToShareIncident = bool
      }
    }
  },
  methods: {
    editTheIncident(postId) {
      this.isWantToPostIncident = true
      this.postId = postId
    },
    deleteTheIncident(postId) {
      const compId =
        (this.userGetter.currentCompany && this.userGetter.currentCompany.id) ||
        localStorage.getItem('companyId')
      const communId = this.selectedCommunity.id || localStorage.getItem('communityId')
      const userId = localStorage.getItem('userId')
      this.$store.dispatch('threadSharing/deleteTheIncident', {
        'CompanyId': compId,
        'CommunityId': communId,
        'CommunityPostId': postId,
        'ModifyUserId': userId
      })
    },
    closePost() {
      this.isWantToPostIncident = false
      this.isWantToPostFromParent = false
    },
    onSendIncident() {},
    isJoined(id) {
        debugger
      if (id && id.currentCompany && id.currentCompany.id) {
        return this.myCommunities.some(
          cId => cId.CommunityCompany[0].CompanyId == id.currentCompany.id
        )
      } else {
        return this.myCommunities.some(cId => cId.CommunityId == id)
      }
    }
  },
  watch: {
    postsGetter(arr) {
      if(arr && arr.Data && arr.Data.length) {
        const propData = arr.Data.sort(function(a, b) {
          if (a.Title.toLowerCase() < b.Title.toLowerCase()) {
            return -1
          }
          if (a.Title.toLowerCase() > b.Title.toLowerCase()) {
            return 1
          }
          return 0
        })
        this.postList = propData
      } else if (this.posts.Data && this.posts.Data.length) {
        const postsData = this.posts.Data.sort(function(a, b) {
          if (a.Title.toLowerCase() < b.Title.toLowerCase()) {
            return -1
          }
          if (a.Title.toLowerCase() > b.Title.toLowerCase()) {
            return 1
          }
          return 0
        })
        this.postList = postsData
      }
    },
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
    isWantToPostFromParent(bool) {
      this.isWantToPostIncident = bool
    }
  },
  mounted() {
    if (this.$route.name === 'Threat Sharing') {
      const compId =
        (this.userGetter.currentCompany && this.userGetter.currentCompany.id) ||
        localStorage.getItem('companyId')
      const communId = ''
      this.$store.dispatch('threadSharing/fetchCommunityPosts', {
        companyId: compId,
        communId: ''
      })
    } else {
      const compId =
        (this.userGetter.currentCompany && this.userGetter.currentCompany.id) ||
        localStorage.getItem('companyId')
      const communId = this.selectedCommunity.id || localStorage.getItem('communityId')
      this.$store.dispatch('threadSharing/fetchCommunityPosts', {
        companyId: compId,
        communId: communId
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
.v-tab {
  padding: 0 3px !important;
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
.share-inline-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;

  .share-combo-label {
    width: 100%;
    text-align: left;
    margin-bottom: 8px;
    font-family: Helvetica;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
  .v-input {
    width: 100%;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.54);
  }
}
::v-deep .v-overlay__scrim {
  border-radius: 0 !important;
}
::v-deep .v-card:not(.v-sheet--tile):not(.v-card--shaped) {
  border-radius: 12px !important;
}
::v-deep .v-overlay__content {
  border-radius: 12px !important;
  box-shadow: 0 11px 15px -7px rgba(80, 80, 80, 0.2), 0 24px 38px 0 rgba(80, 80, 80, 0.14),
    0 9px 46px 8px rgba(201, 113, 113, 0.12) !important;
}
.send-incident {
  margin-right: -18px;
}

::v-deep .investigate-overlay,
::v-deep .post-incident-overlay {
  .v-overlay__content {
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    overflow-y: scroll;
  }
}
::v-deep .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s !important;
}
::v-deep .fade-enter-active {
  transition: all 0.3s ease;
}
::v-deep .fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
::v-deep .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0 !important;
}
.empty-communities {
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;
  min-height: 300px;
  width: 100%;

  .empty-communities-inline {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 420px;

    span {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 24px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.29;
      letter-spacing: normal;
      color: #000;
      text-align: center;
      width: 100%;
      padding-top: 50px;
      padding-bottom: 16px;
    }
  }
}

.post-inc-btn {
  align-items: center;
  background-color: #2196f3 !important;
  color: #fff;
  display: flex;
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

::v-deep .v-expansion-panel {
  border-radius: 20px !important;
  box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
    0 3px 1px -2px rgba(80, 80, 80, 0.12) !important;
  background-color: #fff;
  border: unset !important;
}
::v-deep .v-expansion-panel::before {
  box-shadow: unset !important;
}
::v-deep .v-expansion-panel::after {
  border: unset !important;
}
::v-deep .v-expansion-panel-header {
  box-shadow: unset !important;
  border: unset !important;
}
::v-deep .v-window {
  border-radius: 20px !important;
  margin: 0 24px !important;
}
::v-deep .v-expansion-panel-content {
  border-radius: 20px !important;
  font-family: 'Open Sans', sans-serif !important;
}
::v-deep .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>
