import axios from 'axios'
import AuthenticationService from '../../services/authentication'
import {
  listCommunities,
  listNotifications,
  saveNotifications,
  listCommunitiesByCompany,
  listBusinessCategories,
  saveNewCommunity,
  leaveFromCommun,
  deleteTheCommun,
  getCommunityMembers,
  inviteMembersToCommunity,
  updateTheCommunity,
  listSuggestedCommunities,
  fetchCommunityInfo,
  joinTheCommunity,
  listMemberRequests,
  acceptRequest,
  declineRequest,
  deleteCompanyFromCommunities,
  listRequestsCompany,
  listIncidents,
  fetchIncident,
  publishIncident,
  listCommunityPosts,
  fetchPostDetail,
  likeThePost,
  unlikeThePost,
  addTheComment,
  fetchTopPosts,
  fetchYourPosts,
  deletePost
} from '../../api/threadSharing'

const threadSharing = {
  namespaced: true,
  state: {
    communityList: [],
    myCommunities: [],
    selectedCommunity: {
      id: null,
      name: '',
      description: '',
      industry: '',
      privacy: false
    },
    fetchedCommunity: {
      status: false,
      BusinessCategory: [
        {
          ACount: null,
          Committed: false,
          IDESC: null,
          IKEY: null,
          INFOID: null,
          ITYPE: null
        }
      ],
      BusinessCategoryText: '',
      CommunityCompany: [
        {
          CommunityCompanyRelationId: '',
          CommunityId: '',
          CommunityName: null,
          CompanyId: '',
          CompanyName: '',
          CreateDate: '',
          CreateUserId: '',
          IsActive: false,
          LogoPath: null,
          ModifyDate: '',
          ModifyUserId: '',
          PostCount: 0,
          UserCount: 0
        }
      ],
      CommunityId: '',
      CreateDate: '',
      CreateUserId: '',
      Description: '',
      IncidentCount: null,
      IsActive: false,
      IsPrivate: false,
      MemberCount: null,
      ModifyDate: null,
      ModifyUserId: null,
      Name: ''
    },
    notifications: {
      IsDashboardEnabled: false,
      IsEmailEnabled: false,
      IsWhatsappEnabled: false,
      CommunityId: '',
      UserId: ''
    },
    businessCategories: [],
    suggestedCommunities: [],
    members: [],
    memberRequests: [],
    isWantToPostIncident: false,
    isWantToInvestigate: false,
    isWantToShareIncident: false,
    incident: {},
    requests: [],
    uploadResponse: {},
    listedIncidents: [],
    selectedIncident: {},
    communityPosts: [],
    postDetail: {},
    topPosts: [],
    yourPosts: []
  },
  getters: {
    communityGetter: state => state.communityList,
    myCommunitiesGetter: state => state.myCommunities,
    notificationGetter: state => state.notifications,
    businessCategoryGetter: state => state.businessCategories,
    selectedCommunityGetter: state => state.selectedCommunity,
    membersGetter: state => state.members,
    suggestedCommunGetter: state => state.suggestedCommunities,
    fetchedCommunGetter: state => state.fetchedCommunity,
    memberRequestsGetter: state => state.memberRequests,
    incidentGetter: state => state.incident,
    requestsGetter: state => state.requests,
    uploadResponseGetter: state => state.uploadResponse,
    listedIncidentGetter: state => state.listedIncidents,
    selectedIncidentGetter: state => state.selectedIncident,
    postsGetter: state => state.communityPosts,
    postDetailGetter: state => state.postDetail,
    topPostsGetter: state => state.topPosts,
    yourPostsGetter: state => state.yourPosts
  },
  mutations: {
    SET_COMMUNITIES(state, payload) {
      state.communityList = payload
    },
    SET_MY_COMMUNITIES(state, payload) {
      state.myCommunities = payload
    },
    SET_NOTIFICATIONS(state, payload) {
      state.notifications = payload
    },
    SET_BUSINESS_CATEGORIES(state, payload) {
      state.businessCategories = payload
    },
    SET_SELECTED_COMMUNITY(state, { id, name, description, industry, privacy }) {
      state.selectedCommunity.id = id
      state.selectedCommunity.name = name
      state.selectedCommunity.description = description
      state.selectedCommunity.industry = industry
      state.selectedCommunity.privacy = privacy
    },
    SET_MEMBERS(state, payload) {
      state.members = payload
    },
    SET_MEMBER_REQUESTS(state, reqs) {
      state.memberRequests = reqs
    },
    SET_SUGGESTED_COMMUNITIES(state, payload) {
      state.suggestedCommunities = payload
    },
    SET_FETCHED_COMMUNITY(state, obj) {
      state.fetchedCommunity = obj
      state.fetchedCommunity.status = true
    },
    SET_POSTED_INCIDENT(state, incident) {
      state.incident = incident
    },
    SET_REQUESTED_COMPANIES(state, requests) {
      state.requests = requests
    },
    SET_INCIDENT_OBJECT(state, uploadResponse) {
      state.uploadResponse = uploadResponse
    },
    SET_LISTED_INCIDENTS(state, incidents) {
      state.listedIncidents = incidents
    },
    SET_SELECTED_INCIDENT(state, incident) {
      state.selectedIncident = incident
    },
    SET_COMMUNITY_POSTS(state, posts) {
      state.communityPosts = posts
    },
    SET_POST_DETAIL(state, details) {
      state.postDetail = details
    },
    SET_TOP_POSTS(state, topPosts) {
      state.topPosts = topPosts
    },
    SET_YOUR_POSTS(state, yourPosts) {
      state.yourPosts = yourPosts
    }
  },
  actions: {
    async getCommunities({ commit }) {
      await listCommunities()
        .then(response => {
          const result = response.data
          commit('SET_COMMUNITIES', result)
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Error when getting the communities', { root: true })
        })
      const compId = localStorage.getItem('companyId')
      await listCommunitiesByCompany(compId)
        .then(response => {
          const result = response.data
          commit('SET_MY_COMMUNITIES', result)
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Error when getting the communities', { root: true })
        })
    },
    getNotifications({ commit }, id) {
      listNotifications(id, localStorage.getItem('userId'))
        .then(response => {
          const res = response.data
          commit('SET_NOTIFICATIONS', res)
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Notifications could not fetch', { root: true })
        })
    },
    saveNotifications({ commit, dispatch }, obj) {
      saveNotifications(obj)
        .then(() => {
          commit('SET_NOTIFICATIONS', obj)
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch('common/setErrorMessage', 'Saved Succesfully', { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Error when saving the notifications, try again.', {
            root: true
          })
        })
    },
    getBusinessCategories({ commit }) {
      listBusinessCategories().then(resp => {
        commit('SET_BUSINESS_CATEGORIES', resp.data)
      })
    },
    setSelectedCommunity({ commit }, { id, name, description, industry, privacy }) {
      commit('SET_SELECTED_COMMUNITY', { id, name, description, industry, privacy })
      localStorage.setItem('communityId', id)
      localStorage.setItem('communityName', name)
      localStorage.setItem('communityDesc', description)
      localStorage.setItem('communityCat', industry)
      localStorage.setItem('communityPrivacy', privacy)
    },
    createCommunity({ commit, dispatch }, obj) {
      saveNewCommunity(obj)
        .then((resp) => {
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch('common/setErrorMessage', 'Community Created Succesfully', { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          dispatch('getCommunities')
          const communId = resp.data.CommunityId
          const name = resp.data.Name
          const description = resp.data.Description
          const industry = resp.data.BusinessCategoryText
          const privacy = resp.data.IsPrivate
          commit('SET_SELECTED_COMMUNITY', { communId, name, description, industry, privacy })
          localStorage.setItem('companyId', resp.data.CommunityCompany[0].CompanyId)
          localStorage.setItem('communityId', communId)
          localStorage.setItem('communityName', name)
          localStorage.setItem('communityCat', industry)
          localStorage.setItem('communityPrivacy', privacy)
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Error when creating the community, try again.', {
            root: true
          })
        })
    },
    async leaveCommunity({ commit, dispatch }, { communityId, creatorId }) {
      const exitObj = {
        CommunityId: communityId,
        ModifyUserId: creatorId,
        CommunityCompany: [
          {
            CompanyId: localStorage.getItem('companyId')
          }
        ]
      }
      await leaveFromCommun(exitObj)
        .then(() => {
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch('common/setErrorMessage', 'Succesfully leaved from Community', { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          dispatch('getCommunities')
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Error when leaving the community, try again.', {
            root: true
          })
        })
    },
    async deleteCommunity({ commit, dispatch }, { communityId, userId }) {
      const deleteObj = {
        CommunityId: communityId,
        ModifyUserId: userId,
        CompanyId: localStorage.getItem('companyId')
      }
      await deleteTheCommun(deleteObj)
        .then(() => {
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch('common/setErrorMessage', 'Community succesfully deleted.', { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          dispatch('getCommunities')
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Error when deleting the community, try again.', {
            root: true
          })
        })
    },
    updateCommunity({ commit, dispatch }, obj) {
      const updateObj = {
        CommunityId: obj.communityId,
        Name: obj.name,
        Description: obj.description,
        IsPrivate: obj.privacy,
        ModifyUserId: obj.userId,
        BusinessCategory: [
          {
            IKEY: obj.ikey
          }
        ],
        CommunityCompany: [
          {
            CompanyId: obj.companyId
          }
        ]
      }
      updateTheCommunity(updateObj)
        .then(() => {
          const id = updateObj.CommunityId
          const name = updateObj.Name
          const description = updateObj.Description
          const industry = localStorage.getItem('communityCat')
          const privacy = updateObj.privacy
          commit('SET_SELECTED_COMMUNITY', { id, name, description, industry, privacy })
          dispatch('getCommunities')
          dispatch('getCommunityInfo')
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch('common/setErrorMessage', 'Community succesfully updated.', { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Community could not updated.', { root: true })
        })
    },
    async getMembers({ commit, getters }) {
      await getCommunityMembers(getters.selectedCommunityGetter.id)
        .then(response => {
          commit('SET_MEMBERS', response.data)
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Members could not fetch.', { root: true })
        })
    },
    async getMemberRequests({ commit }, communityId) {
      await listMemberRequests(communityId)
        .then(resp => {
          commit('SET_MEMBER_REQUESTS', resp.data)
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Members could not fetch from the server', {
            root: true
          })
        })
    },
    inviteMembers({ commit, dispatch }) {
      inviteMembersToCommunity()
        .then(() => {
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch('common/setErrorMessage', 'Members succesfully invited.', { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Members could not invited.', { root: true })
        })
    },
    getCommunityInfo({ commit }) {
      const communityId = localStorage.getItem('communityId')
      const companyId = localStorage.getItem('companyId')
      fetchCommunityInfo(communityId, companyId)
        .then(resp => {
          commit('SET_FETCHED_COMMUNITY', resp.data)
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Members could not invited.', { root: true })
        })
    },
    getSuggestedCommunities({ commit }) {
      const id = localStorage.getItem('businessCatId')
      const compId = localStorage.getItem('companyId')
      if (!id || id == 'null') {
        return
      } else {
        listSuggestedCommunities(id, compId)
          .then(resp => {
            commit('SET_SUGGESTED_COMMUNITIES', resp.data)
          })
          .catch(() => {
            commit('common/SET_SNACK_STATUS', true, { root: true })
            commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
            commit('common/SET_ERROR_STATE', true, { root: true })
            commit('common/SET_ERROR_MESSAGE', 'Suggested Communities could not fetch.', {
              root: true
            })
          })
      }
    },
    async joinCommunity({ commit, dispatch }, obj) {
      obj.CompanyId = localStorage.getItem('companyId')
      const privacy = obj.IsPrivate
      delete obj.IsPrivate
      await joinTheCommunity(obj)
        .then(() => {
          dispatch('common/setSnackStatus', true, { root: true })
          if (privacy) {
            dispatch('common/setErrorMessage', 'Join Request successfully sent', { root: true })
          } else {
            dispatch('common/setErrorMessage', 'Successfully joined the community.', { root: true })
          }
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          dispatch('getCommunities')
          dispatch('getSuggestedCommunities')
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Could not joined the Community.', { root: true })
        })
    },
    async acceptMemberRequest({ commit, dispatch }, obj) {
      await acceptRequest(obj)
        .then(() => {
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch('common/setErrorMessage', 'The request is accepted.', { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
        })
        .catch(() => {
          dispatch('common/setSnackStatus', true, { root: true })
          commit('common/SET_ERROR_STATE', true, { root: true })
          commit('common/SET_ERROR_MESSAGE', 'You are not authorized for this action.', {
            root: true
          })
        })
    },
    async declineMemberRequest({ commit, dispatch }, obj) {
      await declineRequest(obj)
        .then(() => {
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch('common/setErrorMessage', 'The request is declined.', { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', 'You are not authorized for this action.', {
            root: true
          })
        })
    },
    investigationStarted({ commit, dispatch }) {
      dispatch('common/setSnackStatus', true, { root: true })
      dispatch('common/setErrorMessage', 'The Investigation has started.', { root: true })
      commit('common/SET_SNACKBAR_COLOR', '#43a047', { root: true })
    },
    postIncident({ commit, dispatch }, incident) {
      dispatch('common/setSnackStatus', true, { root: true })
      dispatch('common/setErrorMessage', 'The Incident posted successfully.', { root: true })
      commit('common/SET_SNACKBAR_COLOR', '#43a047', { root: true })
      commit('SET_POSTED_INCIDENT', incident)
    },
    async deleteCompFromCommunity({ commit, dispatch }, obj) {
      await deleteCompanyFromCommunities(obj)
        .then(() => {
          dispatch('common/setSnackStatus', true, { root: true })
          dispatch(
            'common/setErrorMessage',
            'The Company successfully removed from your community',
            { root: true }
          )
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', 'There was an error while removing the Company', {
            root: true
          })
        })
    },
    async getRequestsCompany({ commit }, id) {
      await listRequestsCompany(id)
        .then(resp => {
          commit('SET_REQUESTED_COMPANIES', resp.data)
        })
        .catch(() => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit(
            'common/SET_ERROR_MESSAGE',
            'There was an error while fetching the Requested Communities',
            {
              root: true
            }
          )
        })
    },
    async postAnIncident({ commit }, postObj) {
      if (!postObj) {
        commit('SET_INCIDENT_OBJECT', {})
      } else {
        commit('common/SET_IS_LOADING', true, { root: true })
        var formData = new FormData()
        formData.append('Attachment', postObj.Attachment)
        formData.append('CommunityId', postObj.CommunityId)
        formData.append('CompanyId', postObj.CompanyId)
        formData.append('CreateUserId', postObj.CreateUserId)
        formData.append('CommunityPostId', postObj.CommunityPostId)
        // post incident id
        await axios
          .post(process.env.VUE_APP_WEB_API + '/CommunityPostInner/Add', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              authorization: `Bearer ${AuthenticationService.getToken()}`,
              companyId: localStorage.getItem('companyId'),
              CacheControl: 'no-cache'
            }
          })
          .then(resp => {
            commit('SET_INCIDENT_OBJECT', resp.data)
            commit('common/SET_IS_LOADING', false, { root: true })
          })
          .catch(error => {
            commit('SET_INCIDENT_OBJECT', error.response.data)
            commit('common/SET_SNACK_STATUS', true, { root: true })
            commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
            commit('common/SET_IS_LOADING', false, { root: true })
            if (error.response.status === 400) {
              commit('common/SET_ERROR_MESSAGE', 'Unsupported file type!', {
                root: true
              })
            } else {
              commit('common/SET_ERROR_MESSAGE', 'Error occurred at file loading', {
                root: true
              })
            }
          })
      }
    },
    async fetchListedIncidents({ commit }, filter) {
      await listIncidents(localStorage.getItem('companyId'), filter || '')
        .then(resp => {
          commit('SET_LISTED_INCIDENTS', resp.data)
        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })
        })
    },
    async getIncident({ commit }, mailId) {
      commit('common/SET_IS_LOADING', true, { root: true })
      await fetchIncident(
        localStorage.getItem('companyId'),
        localStorage.getItem('communityId'),
        mailId,
        localStorage.getItem('userId')
      )
        .then(resp => {
          commit('SET_SELECTED_INCIDENT', resp.data)
          commit('SET_INCIDENT_OBJECT', resp.data)
          commit('common/SET_IS_LOADING', false, { root: true })
          if (resp.data == null) {
            commit('common/SET_SNACK_STATUS', true, { root: true })
            commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
            commit('common/SET_ERROR_MESSAGE', "The incident's mail can not found", {
              root: true
            })
          }
        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })
          commit('common/SET_IS_LOADING', false, { root: true })
        })
    },
    async publishPostIncident({ commit, dispatch }, obj) {
      commit('common/SET_IS_LOADING', true, { root: true })
      await publishIncident(obj)
        .then(() => {
          commit('common/SET_IS_LOADING', false, { root: true })
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Post published', {
            root: true
          })
          dispatch('fetchCommunityPosts', obj)
        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })
          commit('common/SET_IS_LOADING', false, { root: true })
        })
    },
    async fetchCommunityPosts({ commit }, obj) {
      commit('common/SET_IS_LOADING', true, { root: true })
      await listCommunityPosts(obj)
        .then(resp => {
          commit('SET_COMMUNITY_POSTS', resp.data)
          commit('common/SET_IS_LOADING', false, { root: true })
        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })
          commit('common/SET_IS_LOADING', false, { root: true })
        })
    },
    async getPostDetail({ commit }, obj) {
      commit('common/SET_IS_LOADING', true, { root: true })
      await fetchPostDetail(obj)
        .then(resp => {
          commit('SET_POST_DETAIL', resp.data)
          commit('common/SET_IS_LOADING', false, { root: true })
        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })
          commit('common/SET_IS_LOADING', false, { root: true })
        })
    },
    async likePost({ commit, dispatch }, obj) {
      await likeThePost(obj)
        .then(() => {
          dispatch('getPostDetail', obj)
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          commit('common/SET_ERROR_MESSAGE', 'You liked the post', {
            root: true
          })
        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })
        })
    },
    async unlikePost({ dispatch, commit }, obj) {
      await unlikeThePost(obj)
        .then(() => {
          dispatch('getPostDetail', obj)
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          commit('common/SET_ERROR_MESSAGE', 'You unliked the post', {
            root: true
          })
        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })
        })
    },
    async addComment({ dispatch, commit }, obj) {
      await addTheComment(obj)
        .then(() => {
          dispatch('getPostDetail', obj)
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          commit('common/SET_ERROR_MESSAGE', 'Your comment successfully saved', {
            root: true
          })
        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })
        })
    },
    async getTopPosts({ commit }, obj) {
      await fetchTopPosts(obj).then(resp => {
        commit('SET_TOP_POSTS', resp.data)
      })
    },
    async getYourPosts({ commit }, obj) {
      await fetchYourPosts(obj).then(resp => {
        commit('SET_YOUR_POSTS', resp.data)
      })
    },
    async deleteTheIncident({ dispatch, commit }, obj) {
      await deletePost(obj)
        .then(() => {
          dispatch('getPostDetail', obj)
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'green', { root: true })
          commit('common/SET_ERROR_MESSAGE', 'The incident successfully deleted', {
            root: true
          })
        })
        .catch(error => {
          commit('common/SET_SNACK_STATUS', true, { root: true })
          commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
          commit('common/SET_ERROR_MESSAGE', error.response.data, {
            root: true
          })
        })
    }
  }
}

export default threadSharing
