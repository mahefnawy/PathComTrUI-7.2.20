<template>
  <v-card light class="pb-4 pa-6" style="width: 600px;">
    <v-list-item class="pl-0 pr-0">
      <div class="v-btn v-cart-icon-wrapper">
        <v-icon medium left color="blue" class="ml-2">
          mdi-pencil
        </v-icon>
      </div>
      <v-list-item-content class="pt-0 pb-0">
        <v-list-item-title class="v-card-headline">Edit Community</v-list-item-title>
        <v-list-item-subtitle class="v-card-sub-header"
          >Edit general information and settings</v-list-item-subtitle
        >
      </v-list-item-content>
    </v-list-item>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-list-item class="edit-name-area pt-10 pa-0">
        <v-list-item-content class="pt-0 pb-0">
          <label class="pb-3 edit-labels">Name</label>
          <v-text-field
            v-model="name"
            required
            placeholder="Placeholder"
            outlined
            :rules="[nameRules.regex, nameRules.required]"
            class="edit-name-textfield"
          >
          </v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="edit-descrition-area pa-0">
        <v-list-item-content class="pt-0 pb-0">
          <label class="edit-labels">Description</label>
          <label class="edit-sub-labels">
            Describe the community’s goals and rules. (Max. 300 characters)
          </label>
          <v-textarea
            v-model="description"
            name="description"
            outlined
            :rules="[descriptionRules.regex, descriptionRules.required]"
            class="edit-description"
            placeholder="Description"
            required
            no-resize
          ></v-textarea>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="edit-industry-area pb-4 pa-0">
        <v-list-item-content class="pt-0 pb-0">
          <label class="edit-labels">Industry</label>
          <label class="edit-sub-labels">Select an industry category</label>
          <v-select
            :items="categories"
            :label="categories[0]"
            outlined
            class="edit-select"
            v-model="selectedCategory"
            required
          ></v-select>
        </v-list-item-content>
      </v-list-item>
    </v-form>
    <v-list-item class="edit-privacy-area pb-6 pt-4 pa-0">
      <v-list-item-content class="pt-0 pb-0">
        <label class="edit-labels">Privacy</label>
        <label class="edit-sub-labels">Select an industry category</label>
        <div class="edit-privacy-buttons">
          <button :class="{ btnActive: !this.privacy }" @click="privacy = false" class="public-btn">
            PUBLIC
          </button>
          <button :class="{ btnActive: this.privacy }" @click="privacy = true" class="private-btn">
            PRIVATE
          </button>
        </div>
        <label class="edit-privacy-bottom-label">
          Anyone can find the community and see posted threats
        </label>
      </v-list-item-content>
    </v-list-item>
    <div class="d-flex flex-row flex-wrap justify-end">
      <v-btn text color="#f56c6c" @click="onCancelClicked">CANCEL</v-btn>
      <v-btn text color="#2196f3" @click="onSaveClicked">SAVE</v-btn>
    </div>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      name: '',
      description: '',
      privacy: false,
      categories: [],
      selectedCategory: '',
      valid: false,
      nameRules: {
        required: v =>
          (v && v.length >= 5 && v.length <= 80) || 'Community Name must between 5-80 characters',
        regex: v =>
          /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
          'Only use letters, digits, period, comma, underline and hyphen'
      },
      descriptionRules: {
        required: v =>
          (!!v && v.length >= 5 && v.length <= 300) ||
          'Description required and must between 5-300 characters.',
        regex: v =>
          /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
          'Only use letters, digits, period, comma, underline and hyphen'
      }
    }
  },
  computed: {
    ...mapGetters({
      selectedCommunity: 'threadSharing/selectedCommunityGetter',
      businessCategories: 'threadSharing/businessCategoryGetter'
    })
  },
  methods: {
    onCancelClicked() {
      this.$emit('closeEdit')
      this.name = ''
      this.description = ''
      this.selectedCategory = ''
    },
    onSaveClicked() {
      if (this.$refs.form.validate()) {
        const updateObj = {
          communityId: this.$store.state.threadSharing.selectedCommunity.id,
          name: this.name,
          description: this.description,
          privacy: this.privacy,
          userId: localStorage.getItem('userId'),
          ikey: this.getIKEY(),
          companyId: localStorage.getItem('companyId')
        }
        const refThis = this
        this.$store.dispatch('threadSharing/updateCommunity', updateObj).then(() => {
          refThis.$emit('closeEdit')
          localStorage.setItem('communityName', refThis.name)
          localStorage.setItem('communityDesc', refThis.description)
        })
      }
    },
    getIKEY() {
      let theIKEY = this.businessCategories.filter(c => c.IDESC == this.selectedCategory)
      return theIKEY[0].IKEY
    }
  },
  mounted() {
    this.name = this.selectedCommunity.name || localStorage.getItem('communityName')
    this.description = this.selectedCommunity.description || localStorage.getItem('communityDesc')
    this.selectedCategory = this.selectedCommunity.industry || localStorage.getItem('communityCat')
    this.privacy = this.selectedCommunity.privacy
    let businessCats = []
    for (let cat of this.businessCategories) {
      businessCats.push(cat.IDESC)
    }
    this.categories = businessCats
  }
}
</script>
<style scoped lang="scss">
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

.edit-labels {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
  margin-bottom: 0 !important;
  padding-bottom: 3px;
}
.edit-sub-labels {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.58;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
  margin-bottom: 0 !important;
  padding-bottom: 8px;
}
::v-deep .edit-select > .v-input__control {
  align-items: center;
  display: flex;
  height: 40px !important;
}
::v-deep .v-text-field.v-text-field--enclosed .v-input__append-inner {
  margin-top: 8px !important;
}
.edit-privacy-buttons {
  align-items: center;
  display: flex;
  width: 168px;

  button {
    border-radius: 18px !important;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px !important;
    font-weight: 400 !important;
    font-stretch: normal !important;
    font-style: normal !important;
    line-height: 1.71 !important;
    letter-spacing: normal !important;
    text-transform: none !important;
    padding: 0 16px !important;
  }
  .public-btn {
    border: 1px solid #757575;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    height: 36px;
  }
  .private-btn {
    border: 1px solid #757575;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    height: 36px;
    margin-left: 9px;
  }
}
.edit-privacy-bottom-label {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #909399;
  padding-top: 8px;
  margin: 0 !important;
}
.edit-privacy-bottom-label {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #909399;
  padding-top: 8px;
  margin: 0 !important;
}
.theme--light.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: unset;
}
.v-btn:not(.v-btn--text):not(.v-btn--outlined).v-btn--active:before {
  opacity: 1;
}
.v-btn-toggle > .v-btn.v-btn--active,
.v-btn-toggle > .v-btn.v-btn--active::before {
  color: #fff;
}
.btnActive {
  height: 36px;
  border-radius: 18px;
  border: solid 1px #757575;
}
.btnActive,
.btnActive:active,
.btnActive:hover,
.btnActive:focus {
  border: unset !important;
  outline: 0 !important;
}
.btnActive,
.btnActive::before {
  border: unset !important;
  border-color: unset !important;
  color: #fff;
  background-color: #2196f3 !important;
  box-shadow: 0 2px 5px 0 #2196f3 !important;
}
.private-btn.v-btn.v-btn--active {
  border-left: transparent !important;
}
.v-btn-toggle--group > .v-btn.v-btn {
  border-color: #757575;
  border-left: 1px solid #757575 !important;
}
.v-btn:before {
  top: -1px !important;
  left: -1px !important;
}
</style>
