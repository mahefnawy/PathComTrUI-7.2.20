import {
  getCompanyInformation,
  getLastFiveCompaignsStats,
  getPhishingCampaigns,
  getDropdownCompanies,
  selectCompany,
  getMenus,
  logoutUser,
  getOverallStats,
  getNotifications,
  notificationSeen,
  sendFeedback
} from '../../api/dashboard'
import AuthenticationService from '../../services/authentication'
import router from '../../router'

const dashboard = {
  namespaced: true,
  state: {
    isSessionExpired: false,
    popupFeedback: false,
    overallMonths: [],
    notificationList: [],
    menuList: [],
    pieChartData: [],
    pieChartDataLabels: [],
    chartOptionColors: ['#66bb6a', '#2196f3', '#00bcd4', '#ffce56', '#e91e63'],
    firstCampaignList: [],
    lastFiveCampaignList: [],
    singleCampaignList: [],
    dropdownCompanies: [],
    selectedCompany: 'Loading...',
    overallStatsList: [],
    switchAccountDropdown: [
      {
        companyId: 'default',
        manager: 'Switch Account'
      }
    ],
    isSwitchDialogOpen: false,
    companyInformation: {
      name: '',
      awarenessScore: '',
      awarenessColor: '#e6a23c',
      licenceStatus: '5000 registered users of 5000',
      endsAt: '25.07.2020',
      isLicenceStatusValid: false,
      licenseStatusMessage:
        'You reached the user license limit. To add more users, please contract your administrator to upgrade your plan.'
    }
  },
  getters: {
    isPopupOpened: state => state.popupFeedback,
    getIsSessionExpired: state => state.isSessionExpired,
    getOverallMonths: state => state.overallMonths,
    getNotificationList: state => state.notificationList,
    getOverallStatsList: state => state.overallStatsList,
    getMenuList: state => state.menuList,
    getIsSwitchDialogOpen: state => state.isSwitchDialogOpen,
    getSwitchAccountDropdown: state => state.switchAccountDropdown,
    getSelectedCompany: state => state.selectedCompany,
    getCompanyDropdowns: state => state.dropdownCompanies,
    getPieChartLabels: state => state.pieChartDataLabels,
    getFirstCampaignList: state => state.firstCampaignList,
    getLastFiveCampaignList: state => state.lastFiveCampaignList,
    getSingleCampaignList: state => state.singleCampaignList,
    getcompanyName: state => state.companyName
  },
  mutations: {
    SET_PHISHING_CAMPAIGNS(state, payload) {
      payload.sort((x, y) => (x.campaignCount < y.campaignCount ? 1 : -1))
      state.chartOptionColors = payload.map(x => x.color)
      state.pieChartDataLabels = payload.map(x => `${x.description} (${x.campaignCount})`)
      state.pieChartData = payload.map(x => x.campaignCount)
    },
    SET_LAST_FIVE_CAMPAIGNS(state, payload) {
      state.firstCampaignList = payload.map(x => ({
        campaignName: x.name
      }))
      state.lastFiveCampaignList = payload.map(x => ({
        // campaignName: x.Name,
        company: x.companyName,
        behaviour: [
          `${x.notResponse} No response`,
          `${x.readCount} Read`,
          `${x.clickedCount} Clicked`,
          `${x.capturedCount} Data Submitted`
        ],
        series: [x.notResponse, x.readCount, x.clickedCount, x.capturedCount],
        delivery: '4/4',
        status: x.status
      }))
      state.singleCampaignList = payload.map(x => ({
        campaignName: x.name,
        company: x.companyName,
        behaviour: [
          `${x.notResponse} No response`,
          `${x.readCount} Read`,
          `${x.clickedCount} Clicked`,
          `${x.capturedCount} Data Submitted`
        ],
        series: [x.notResponse, x.readCount, x.clickedCount, x.capturedCount],
        delivery: '4/4',
        status: x.status
      }))
    },

    SET_COMPANY_INFORMATION(state, payload) {
      const scoreValue = getAwarenesColor(parseInt(payload.score))
      state.companyInformation = {}
      state.companyInformation.awarenessColor = scoreValue.color
      state.companyInformation.isLicenceStatusValid = true
      state.companyInformation.name = payload.companyName
      state.companyInformation.licenceStatus = `${payload.userCount} registered users of ${payload.limits}`
      state.companyInformation.awarenessScore = scoreValue.letter
      const date = new Date(payload.createDate)
      state.companyInformation.endsAt = `${date.getDate()}.${date.getMonth()}.${date.getFullYear() +
        1}`
    },
    SET_DROPDOWN_COMPANIES(state, payload) {
      state.dropdownCompanies = payload
    },
    SET_SELECTED_COMPANY(state, payload) {
      const defaultAccountDropdown = []
      state.selectedCompany = payload
      defaultAccountDropdown.push(payload)
      defaultAccountDropdown.push({
        companyId: 'default',
        manager: 'Switch Account',
        index: this.state.auth.user.role.id
      })
      state.switchAccountDropdown = defaultAccountDropdown
    },
    SET_SWITCH_DIALOG(state, payload) {
      state.isSwitchDialogOpen = payload
    },
    SET_MENUS(state, payload) {
      const iconList = {
        9999: {
          title: 'Dashboard',
          icon: 'mdi-home',
          name: 'dashboard'
        },
        6: {
          title: 'Profile',
          icon: 'mdi-account',
          name: 'mnUserManager'
        },
        10: {
          title: 'Campaign Manager',
          icon: 'mdi-shape',
          name: 'mnCampaign'
        },
        22: {
          title: 'Trainings',
          icon: 'mdi-whistle',
          name: 'mnCampaign'
        },
        31: {
          title: 'Transcript',
          icon: 'mdi-school',
          name: 'mnTranscript'
        },
        33: {
          title: 'Vishing',
          icon: 'mdi-bag-personal',
          name: 'mnVishing'
        },
        1: {
          title: 'Phishing Simulator',
          icon: 'mdi-email',
          name: 'mnTraining'
        },
        4: {
          title: 'Awareness Educator',
          icon: 'mdi-book',
          name: 'mnTraining'
        },
        55: {
          title: 'Email Threat Simulator',
          icon: 'mdi-earth',
          name: 'mEts'
        },
        59: {
          title: 'Threat Intelligence',
          icon: 'mdi-security',
          name: 'Threat Intelligence'
        },
        14: {
          title: 'Incident Responder',
          icon: 'mdi-flash',
          name: 'mnCampaign1'
        },
        998: {
          title: 'Threat Sharing',
          icon: 'mdi-flag',
          name: 'threadSharing'
        },
        24: {
          title: 'Report Manager',
          icon: 'mdi-poll-box',
          name: 'mnCampaignManager'
        },
        35: {
          title: 'Company',
          icon: 'mdi-briefcase',
          name: 'mnUserSettings'
        },
        42: {
          title: 'Advanced Settings',
          icon: 'mdi-settings',
          name: 'mnUserSettings'
        },
        53: {
          title: 'Analytics',
          icon: 'mdi-settings',
          name: 'mnAnalytics'
        }
      }
      const newList = []
      newList.push({
        id: 9999,
        title: 'Dashboard',
        icon: 'mdi-home',
        name: 'dashboard',
        active: true,
        childs: []
      })
      payload.forEach(item => {
        let childs = []
        if (item.parents != undefined && item.parents.length > 0) {
          childs = item.parents.map(child => ({
            id: child.menuId,
            title: child.text,
            icon: null,
            name: child.name
          }))
        }
        let iconValue = ''
        if (iconList[item.menuId] != undefined && iconList[item.menuId].icon != undefined) {
          iconValue = iconList[item.menuId].icon
        }
        newList.push({
          id: item.menuId,
          title: item.text,
          icon: iconValue,
          name: item.name,
          childs
        })
      })
      state.menuList = newList
    },
    SET_OVERALL_STATS(state, payload) {
      const newOverallStats = []
      if (payload.phishingSimulatorScore.filter(x => x !== 0).length > 0) {
        newOverallStats.push({
          name: 'Phishing Simulator Score',
          data: payload.phishingSimulatorScore
        })
      }
      if (payload.awarenessEducatorScore.filter(x => x !== 0).length > 0) {
        newOverallStats.push({
          name: 'Awareness Educator',
          data: payload.awarenessEducatorScore
        })
      }
      if (payload.threatIntelligence.filter(x => x !== 0).length > 0) {
        newOverallStats.push({
          name: 'Threat Intelligence',
          data: payload.threatIntelligence
        })
      }
      if (payload.incidentResponder.filter(x => x !== 0).length > 0) {
        newOverallStats.push({
          name: 'Incident Responder',
          data: payload.incidentResponder
        })
      }
      state.overallStatsList = newOverallStats
    },
    SET_NOTIFICATIONS(state, payload) {
      state.notificationList = payload
    },
    SET_DUMMY_COMPANY_INFO(state, payload) {
      state.companyInformation = payload
    },
    CHANGE_FEEDBACK_POPUP(state, payload) {
      state.popupFeedback = payload
    }
  },
  actions: {
    notificationSeen({ commit }, payload) { // eslint-disable-line
      notificationSeen(payload.id).then(() => {})
    },
    getNotifications({ commit }) {
      getNotifications().then(response => {
        const result = response.data
        commit('SET_NOTIFICATIONS', result)
      })
    },
    getOverallStats({ commit }, payload) {
      getOverallStats(payload).then(response => {
        const result = response.data
        commit('SET_OVERALL_STATS', result)
      })
    },
    logoutUser({ commit }) {
      AuthenticationService.removeToken()
      commit('common/SET_SNACK_STATUS', false, { root: true })
      commit('common/SET_SNACKBAR_COLOR', '', { root: true })
      commit('common/SET_ERROR_MESSAGE', '', {
        root: true
      })
      commit('common/SET_ERROR_STATE', false, { root: true })
      router.push('/login')
      logoutUser()
    },
    getMenus({ commit }) {
      getMenus().then(response => {
        const result = response.data
        commit('SET_MENUS', result)
      })
    },
    setSwitchDialog({ commit }, payload) {
      commit('SET_SWITCH_DIALOG', payload)
    },
    selectCompany({ commit, dispatch }, payload) {
      selectCompany(payload).then(() => {
        commit('SET_SELECTED_COMPANY', payload)
        dispatch('getLastFiveCompaignsStats')
        dispatch('getPhishingCampaigns', 999)
        dispatch('getOverallStats', 12)
        dispatch('getCompanyInformation')
        dispatch('getDropdownCompanies')
      })
    },
    getLastFiveCompaignsStats({ commit }) {
      getLastFiveCompaignsStats().then(response => {
        const result = response.data
        commit('SET_LAST_FIVE_CAMPAIGNS', result)
      })
    },
    getPhishingCampaigns({ commit }, payload) {
      getPhishingCampaigns(payload)
        .then(response => {
          const result = response.data
          commit('SET_PHISHING_CAMPAIGNS', result)
        })
        .catch(() => {})
    },
    getCompanyInformation({ commit }) {
      getCompanyInformation()
        .then(response => {
          const result = response.data
          commit('SET_COMPANY_INFORMATION', result)
        })
        .catch(() => {
          const dummyComp = {
            name: this.state.dashboard.selectedCompany.manager,
            awarenessScore: '',
            awarenessColor: '#e6a23c',
            licenceStatus: '5000 registered users of 5000',
            endsAt: '25.07.2020',
            isLicenceStatusValid: false,
            licenseStatusMessage:
              'You reached the user license limit. To add more users, please contract your administrator to upgrade your plan.'
          }
          commit('SET_DUMMY_COMPANY_INFO', dummyComp)
        })
    },
    getDropdownCompanies({ commit }) {
      function getUnique(arr, comp) {
        const unique = arr
          .map(e => e[comp])

          // store the keys of the unique objects
          .map((e, i, final) => final.indexOf(e) === i && i)

          // eliminate the dead keys & store unique objects
          .filter(e => arr[e])
          .map(e => arr[e])

        return unique
      }

      getDropdownCompanies().then(response => {
        const result = response.data
        const orderedArr = []
        if (this.state.auth.user && this.state.auth.user.userCompany) {
          const curCompany = result.find(c => c.companyId === this.state.auth.user.userCompany.id)
          orderedArr.push(curCompany)
          const filteredArr = result.filter(
            comp => comp.companyId !== this.state.auth.user.userCompany.id
          )
          const orderAccount = [...orderedArr, ...filteredArr]
          commit('SET_DROPDOWN_COMPANIES', getUnique(orderAccount, 'companyId'))
        }
      })
    },
    changeFeedbackPopup({ commit }, payload) {
      commit('CHANGE_FEEDBACK_POPUP', payload)
    },
    sendFeedback({ commit, dispatch }, payload) {
      sendFeedback(payload)
        .then(() => {
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch('common/setErrorMessage', 'Feedback Sended Successful', { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          dispatch('changeFeedbackPopup', false)
        })
        .catch(() => {
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch('common/setErrorMessage', 'Error Occured', { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          dispatch('changeFeedbackPopup', false)
        })
    }
  }
}

export default dashboard

export function getAwarenesColor(score) {
  if (score >= 0 && score < 40) {
    return {
      letter: 'F',
      color: '#800F15'
    }
  }
  if (score >= 40 && score < 60) {
    return {
      letter: 'D',
      color: '#D3441A'
    }
  }
  if (score >= 60 && score < 80) {
    return {
      letter: 'C',
      color: '#E6BB0C'
    }
  }
  if (score >= 80 && score < 90) {
    return {
      letter: 'B',
      color: '#73AF26'
    }
  }
  return {
    letter: 'A',
    color: '#298A08'
  }
}
