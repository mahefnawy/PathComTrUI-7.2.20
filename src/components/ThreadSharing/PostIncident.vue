<template>
  <div class="incident-container">
    <div class="incident-inner">
      <v-card light class="incident-card pb-4 pa-6" style="border-radius: 0 !important">
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon medium left color="blue" class="ml-2">
              mdi-send
            </v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">
              Post an Incident
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <div class="incident-steps">
          <div class="steps">
            <div v-if="step < 2" :class="{ 'active-step': step === 1 }" class="step-number">
              1
            </div>
            <v-icon v-else color="#2196f3" class="pr-1">mdi-check-circle</v-icon>
            <span
              :class="{
                'active-step-span': step === 1,
                'hide-step': step === 3 || step === 4 || step === 5
              }"
              class="step-name"
              >Select Incident</span
            >
          </div>
          <div class="steps">
            <hr />
          </div>
          <div class="steps">
            <div v-if="step < 3" :class="{ 'active-step': step === 2 }" class="step-number">
              2
            </div>
            <v-icon v-else color="#2196f3" class="pr-1">mdi-check-circle</v-icon>
            <span
              :class="{
                'active-step-span': step === 2,
                'hide-step': step === 1 || step === 4 || step === 5
              }"
              class="step-name"
              >General Info</span
            >
          </div>
          <div class="steps">
            <hr />
          </div>
          <div class="steps">
            <div v-if="step < 4" :class="{ 'active-step': step === 3 }" class="step-number">
              3
            </div>
            <v-icon v-else color="#2196f3" class="pr-1">mdi-check-circle</v-icon>
            <span
              :class="{
                'active-step-span': step === 3,
                'hide-step': step === 1 || step === 2 || step === 5
              }"
              class="step-name"
              >Incident Details</span
            >
          </div>
          <div class="steps">
            <hr />
          </div>
          <div class="steps">
            <div v-if="step < 5" :class="{ 'active-step': step === 4 }" class="step-number">
              4
            </div>
            <v-icon v-else color="#2196f3" class="pr-1">mdi-check-circle</v-icon>
            <span
              :class="{
                'active-step-span': step === 4,
                'hide-step': step === 1 || step === 2 || step === 3
              }"
              class="step-name"
              >Attributes</span
            >
          </div>
          <div class="steps">
            <hr />
          </div>
          <div class="steps">
            <div v-if="step < 6" :class="{ 'active-step': step === 5 }" class="step-number">
              5
            </div>
            <v-icon v-else color="#2196f3" class="pr-1">mdi-check-circle</v-icon>
            <span
              :class="{
                'active-step-span': step === 5,
                'hide-step': step === 1 || step === 2 || step === 3 || step === 4
              }"
              class="step-name"
              >Preview</span
            >
          </div>
        </div>
        <div v-if="step === 1">
          <div class="incident-header pb-6">
            <p>Select Incident</p>
            <span>Search for the reported incident or upload an email to post as an incident</span>
          </div>
          <div v-if="!selectedEmail && !uploadRespond.CommunityPostEmails" class="incident-content">
            <div class="input-header">Find Incident</div>
            <div class="input-sub">Search and find emails among reported incidents</div>
            <input style="display: none;" type="text" name="fakeusernameremembered" />
            <v-autocomplete
              v-model="selectedEmail"
              :items="listedIncidents"
              :search-input.sync="searchIncident"
              chips
              clearable
              hide-selected
              item-text="Subject"
              item-value="MailId"
              label="Search for incident name or status"
              class="first-select input-select mb-6"
              solo
              :rules="autocomplete"
              required
            >
              <template v-slot:selection="{ attrs, item }">
                <v-chip v-bind="attrs" color="#2196f3" :input-value="item.Subject" label small>
                  <span class="pr-2">
                    {{ item.Subject }}
                  </span>
                </v-chip>
              </template>
              <template v-slot:item="{ item }">
                <div class="select-row-wrap">
                  <div class="email-name">{{ item.Subject }}</div>
                  <div class="select-row-inline">
                    <div class="file-type-wrap">
                      <v-icon v-if="item.AttachmentCount != 0" class="email-icon"
                        >mdi-paperclip</v-icon
                      >
                      <div
                        v-for="(st, ind) of item.Status"
                        :key="ind + st"
                        class="email-type"
                        :class="[
                          st === 'being analyzed' ? 'btn-pending' : '',
                          st === 'malicious' ? 'btn-cancelled' : '',
                          st === 'non-malicious' ? 'btn-active' : '',
                          st === 'phishing' ? 'btn-warning' : ''
                        ]"
                        v-if="st.length"
                      >
                        <span>{{ st }}</span>
                      </div>
                    </div>
                    <div class="email-time">{{ item.ReportDate }}</div>
                  </div>
                </div>
              </template>
            </v-autocomplete>
            <div class="input-header mb-6">- or -</div>
            <div class="input-header">Upload Email</div>
            <div class="input-sub">.eml or .msg files only.</div>
            <div class="upload-wrapper">
              <v-file-input
                v-model="msgEmlFile"
                class="up-btn"
                show-size
                counter
                :clearable="false"
                placeholder="Upload"
                multiple
                dense
                :prepend-icon="'false'"
                prepend-inner-icon="mdi-upload"
                @change="uploadFile"
              >
              </v-file-input>
            </div>
            
            <span v-if="selectedEmail || msgEmlFile == null" class="select-error"
              >Please select at least 1 attribute</span
            >
          </div>
          <div
            class="mt-2"
            v-else-if="
              selectedEmail ||
                (uploadRespond.CommunityPostEmails && uploadRespond.CommunityPostEmails.length)
            "
          >
            <v-card light class="pb-4 pt-0 mt-2 pa-6 investigation-content" style="width: 600px;">
              <div class="mail-preview pt-0">
                <v-icon class="close-incident" @click="closePreview()">mdi-close-circle</v-icon>
                <div class="preview-header pt-0">
                  <h2
                    v-for="(el, ind) of shareSettings.subject"
                    :key="ind + el.Id"
                    v-if="
                      uploadRespond.CommunityPostEmails[0] &&
                        uploadRespond.CommunityPostEmails[0].Subject.length &&
                        el.IsShow
                    "
                    style="padding: 0 2px; border-bottom: 1px solid transparent;"
                  >
                    Subject: {{ uploadRespond.CommunityPostEmails[0].Subject }}
                  </h2>
                  <h2
                    v-else-if="
                      uploadRespond.CommunityPostEmails[0] &&
                        uploadRespond.CommunityPostEmails[0].Subject.length &&
                        !el.IsShow
                    "
                    style="padding: 0 2px; border-bottom: 1px solid transparent;"
                  >
                    Subject: ************
                  </h2>
                  <div class="header-info pb-5">
                    <span
                      v-for="(el, ind) of shareSettings.senderInfo"
                      :key="ind + el.Id"
                      v-if="
                        uploadRespond.CommunityPostEmails[0] &&
                          uploadRespond.CommunityPostEmails[0].From.length &&
                          el.IsShow
                      "
                      >From: {{ uploadRespond.CommunityPostEmails[0].From }}<br
                    /></span>
                    <span
                      v-else-if="
                        uploadRespond.CommunityPostEmails[0] &&
                          uploadRespond.CommunityPostEmails[0].From.length &&
                          !el.IsShow
                      "
                      >From: ************
                    </span>
                    <div
                      v-for="(el, ind) of shareSettings.receiverInfo"
                      :key="ind + el.Id"
                      v-if="
                        uploadRespond.CommunityPostEmails[0] &&
                          uploadRespond.CommunityPostEmails[0].To.length &&
                          el.IsShow
                      "
                      style="padding: 0 2px; border-bottom: 1px solid transparent;"
                    >
                      To: {{ uploadRespond.CommunityPostEmails[0].To }}
                    </div>
                    <div
                      v-else-if="
                        uploadRespond.CommunityPostEmails[0] &&
                          uploadRespond.CommunityPostEmails[0].To.length &&
                          !el.IsShow
                      "
                      style="padding: 0 2px; border-bottom: 1px solid transparent;"
                    >
                      To: ************
                    </div>
                    <div
                      v-for="(el, ind) of shareSettings.receiverInfo"
                      :key="ind + el.Id"
                      v-if="
                        uploadRespond.CommunityPostEmails[0] &&
                          uploadRespond.CommunityPostEmails[0].Cc.length &&
                          el.IsShow
                      "
                      style="padding: 0 2px; border-bottom: 1px solid transparent;"
                    >
                      CC: {{ uploadRespond.CommunityPostEmails[0].Cc }}
                    </div>
                    <div
                      v-else-if="
                        uploadRespond.CommunityPostEmails[0] &&
                          uploadRespond.CommunityPostEmails[0].Cc.length &&
                          !el.IsShow
                      "
                      style="padding: 0 2px; border-bottom: 1px solid transparent;"
                    >
                      CC: ************
                    </div>
                    <div v-if="uploadRespond.CommunityPostEmails[0]">
                      Date:
                      {{ uploadRespond.CommunityPostEmails[0].ReceivedDate.slice(0, 10) }}
                      {{ uploadRespond.CommunityPostEmails[0].ReceivedDate.slice(11, 16) }}<br />
                    </div>
                  </div>
                </div>
                <div class="preview-body" v-html="uploadRespond.CommunityPostEmails[0].Body"></div>
                <div
                  class="preview-footer"
                  v-if="shareSettings.attachments && shareSettings.attachments.length"
                >
                  <h2>Attachments</h2>
                  <div class="attachment-wrapper">
                    <div
                      v-for="(att, ind) of shareSettings.attachments"
                      :key="ind + att.Id"
                      class="attachment red-attach"
                      :class="[
                        att.IsMalicious ? 'red-attach' : '',
                        !att.IsMalicious ? 'blue-attach' : '',
                        att.IsShow ? 'clean-attach' : ''
                      ]"
                    >
                      <div v-if="att.IsMalicious" class="attach-icon red-icon">
                        <v-icon color="white" style="font-size: 20px">mdi-alert</v-icon>
                      </div>
                      <div v-else class="attach-icon blue-icon">
                        <v-icon color="white" style="font-size: 20px">mdi-paperclip</v-icon>
                      </div>
                      <div v-if="att.IsShow" class="file-name max-char">{{ att.Name }}</div>
                      <div v-if="!att.IsShow" class="file-name max-char">**********</div>
                    </div>
                  </div>
                </div>
              </div>
            </v-card>
          </div>
        </div>
        <div class="step-container" v-if="step === 2">
          <div class="incident-header">
            <p>General Info</p>
            <span
              >Include title, description of incident and neccessary files(pics, documents, or
              code)</span
            >
          </div>
          <div class="incident-content">
            <div class="input-header">Title</div>
            <v-text-field
              @mouseover.native="hover = true"
              label="Title"
              outlined
              dense
              class="title-field filter-field pt-4"
              v-model="uploadRespond.Title"
              solo
              requied
              :rules="[titleRule.regex, titleRule.required]"
            ></v-text-field>
            <span class="required">*Required</span>

            <div class="input-header pt-6">Description</div>
            <div class="input-sub pb-1">Describe the incident briefly (Max. 300 characters)</div>
            <v-textarea
              @mouseover.native="hover = true"
              outlined
              dense
              auto-grow
              class="comment-input"
              rows="5"
              row-height="15"
              solo
              :rules="[descRule.regex, descRule.required]"
              v-model="uploadRespond.Description"
            ></v-textarea>

            <div class="input-header pt-6">Category</div>
            <div class="input-sub pb-1">Select threat categories</div>
            <v-select
              class="cat-select"
              v-model="uploadRespond.CommunityPostCategory"
              :items="categories"
              requied
              solo
              multiple
              outlined
              :class="{
                'errored-selectbox':
                  uploadRespond.CommunityPostCategory &&
                  uploadRespond.CommunityPostCategory.length < 1
              }"
            >
              <template v-slot:append-item> </template>
            </v-select>
            <span class="required">*Required</span>
          </div>
        </div>
        <div class="step-container" v-if="step === 3">
          <div class="incident-header">
            <p>Incident Details</p>
            <span
              >Enter information on discovery of threat, how it affects and how to fight
              against</span
            >
          </div>
          <div class="incident-content">
            <div class="input-header">Discovery and Detection</div>
            <div class="input-sub">
              Explain how the threat was detected and what tools were used?
            </div>
            <v-textarea
              v-model="uploadRespond.DiscoveryAndDetection"
              @mouseover.native="hover = true"
              outlined
              dense
              auto-grow
              class="comment-input"
              rows="5"
              row-height="15"
              :rules="[explanationRules.regex, explanationRules.required]"
              solo
            ></v-textarea>

            <div class="input-header pb-5 pt-7">Impact Range</div>
            <div class="input-sec-header">Affect Area</div>
            <div class="input-sub">Which systems and programs are affected by the threat?</div>
            <v-combobox
              v-model="uploadRespond.AffectArea"
              :search-input.sync="affectSearch"
              label="Windows 10 etc."
              multiple
              :clearable="true"
              append-icon
              chips
              deletable-chips
              class="affect-combobox affect-input"
              @keyup.tab="updateTags"
              @paste="updateTags"
              solo
              outlined
              dense
              :rules="[affectRules.regex]"
              hint="Maximum of 5 tags"
            >
            </v-combobox>

            <div class="input-sec-header pt-3">Scope</div>
            <div class="input-sub">How does it work and affect your systems?</div>
            <v-text-field
              @mouseover.native="hover = true"
              label="Explain"
              outlined
              dense
              class="filter-field"
              v-model="uploadRespond.Scope"
              solo
              :rules="[scopeRules.regex, scopeRules.required]"
            ></v-text-field>
          </div>
        </div>
        <div v-if="step === 4">
          <div class="investigate-header">
            <p>Attributes</p>
            <span
              >Select the information you want to share, and hide others. Select at least 1
              attribute.</span
            >
          </div>
          <div class="investigation-content">
            <div class="mail-preview">
              <div class="preview-header">
                <h2
                  v-for="(el, ind) of shareSettings.subject"
                  :key="ind + el.Id"
                  v-if="
                    uploadRespond.CommunityPostEmails[0] &&
                      uploadRespond.CommunityPostEmails[0].Subject.length &&
                      el.IsShow
                  "
                  :class="{ 'text-selected': el.IsShow }"
                  style="padding: 0 2px; border-bottom: 1px solid transparent;"
                >
                  Subject: {{ uploadRespond.CommunityPostEmails[0].Subject }}
                </h2>
                <h2
                  v-else-if="
                    uploadRespond.CommunityPostEmails[0] &&
                      uploadRespond.CommunityPostEmails[0].Subject.length &&
                      !el.IsShow
                  "
                  :class="{ 'text-selected': el.IsShow }"
                  style="padding: 0 2px; border-bottom: 1px solid transparent;"
                >
                  Subject: ************
                </h2>
                <div class="header-info pb-5">
                  <span
                    v-for="(el, ind) of shareSettings.senderInfo"
                    :key="ind + el.Id"
                    v-if="
                      uploadRespond.CommunityPostEmails[0] &&
                        uploadRespond.CommunityPostEmails[0].From.length &&
                        el.IsShow
                    "
                    :class="{ 'text-selected': el.IsShow }"
                    >From: {{ uploadRespond.CommunityPostEmails[0].From }}<br
                  /></span>
                  <span
                    v-else-if="
                      uploadRespond.CommunityPostEmails[0] &&
                        uploadRespond.CommunityPostEmails[0].From.length &&
                        !el.IsShow
                    "
                    :class="{ 'text-selected': el.IsShow }"
                    >From: ************
                  </span>
                  <div
                    v-for="(el, ind) of shareSettings.receiverInfo"
                    :key="ind + el.Id"
                    v-if="
                      uploadRespond.CommunityPostEmails[0] &&
                        uploadRespond.CommunityPostEmails[0].To.length &&
                        el.IsShow
                    "
                    :class="{ 'text-selected': el.IsShow }"
                    style="padding: 0 2px; border-bottom: 1px solid transparent;"
                  >
                    To: {{ uploadRespond.CommunityPostEmails[0].To }}
                  </div>
                  <div
                    v-else-if="
                      uploadRespond.CommunityPostEmails[0] &&
                        uploadRespond.CommunityPostEmails[0].To.length &&
                        !el.IsShow
                    "
                    :class="{ 'text-selected': el.IsShow }"
                    style="padding: 0 2px; border-bottom: 1px solid transparent;"
                  >
                    To: ************
                  </div>
                  <div
                    v-for="(el, ind) of shareSettings.receiverInfo"
                    :key="ind + el.Id"
                    v-if="
                      uploadRespond.CommunityPostEmails[0] &&
                        uploadRespond.CommunityPostEmails[0].Cc.length &&
                        el.IsShow
                    "
                    :class="{ 'text-selected': el.IsShow }"
                    style="padding: 0 2px; border-bottom: 1px solid transparent;"
                  >
                    CC: {{ uploadRespond.CommunityPostEmails[0].Cc }}
                  </div>
                  <div
                    v-else-if="
                      uploadRespond.CommunityPostEmails[0] &&
                        uploadRespond.CommunityPostEmails[0].Cc.length &&
                        !el.IsShow
                    "
                    :class="{ 'text-selected': el.IsShow }"
                    style="padding: 0 2px; border-bottom: 1px solid transparent;"
                  >
                    CC: ************
                  </div>
                  <div v-if="uploadRespond.CommunityPostEmails[0]">
                    Date:
                    {{ uploadRespond.CommunityPostEmails[0].ReceivedDate.slice(0, 10) }}
                    {{ uploadRespond.CommunityPostEmails[0].ReceivedDate.slice(11, 16) }}<br />
                  </div>
                </div>
              </div>
              <div class="preview-body" v-html="uploadRespond.CommunityPostEmails[0].Body"></div>
              <div
                class="preview-footer"
                v-if="shareSettings.attachments && shareSettings.attachments.length"
              >
                <h2>Attachments</h2>
                <div class="attachment-wrapper">
                  <div
                    v-for="(att, ind) of shareSettings.attachments"
                    :key="ind + att.Id"
                    class="attachment red-attach"
                    :class="[
                      att.IsMalicious ? 'red-attach' : '',
                      !att.IsMalicious ? 'blue-attach' : '',
                      att.IsShow ? 'clean-attach' : ''
                    ]"
                  >
                    <div v-if="att.IsMalicious" class="attach-icon red-icon">
                      <v-icon color="white" style="font-size: 20px">mdi-alert</v-icon>
                    </div>
                    <div v-else class="attach-icon blue-icon">
                      <v-icon color="white" style="font-size: 20px">mdi-paperclip</v-icon>
                    </div>
                    <div v-if="att.IsShow" class="file-name max-char">{{ att.Name }}</div>
                    <div v-if="!att.IsShow" class="file-name max-char">**********</div>
                  </div>
                </div>
              </div>
            </div>
            <div :class="{ 'minify-filter': !filterOpened }" class="investigation-filters">
              <div :class="{ 'minify-part': !filterOpened }" class="filter-header">
                <div class="select-header" v-if="filterOpened">Select Attributes</div>
                <v-icon @click="filterOpened = true" :class="{ 'display-none': filterOpened }"
                  >mdi-arrow-left</v-icon
                >
                <v-icon @click="filterOpened = false" :class="{ 'display-none': !filterOpened }"
                  >mdi-arrow-right</v-icon
                >
              </div>
              <div :class="{ 'minify-part': !filterOpened }" class="filter-part">
                <div
                  v-for="(s, ind) of shareSettings.allHeader"
                  :key="ind + s.Id"
                  :class="{ 'minify-switch': !filterOpened }"
                  class="switch-row"
                >
                  <div class="img-wrapper">
                    <img src="../../assets/img/filter-icons/header-all.svg" />
                  </div>
                  <v-switch v-model="allHeader"></v-switch>
                  <label v-if="filterOpened">All Header</label>
                </div>
                <div
                  v-for="(s, ind) of shareSettings.subject"
                  :key="ind + s.Id"
                  :class="{ 'minify-switch': !filterOpened }"
                  class="switch-row"
                >
                  <div class="img-wrapper">
                    <img src="../../assets/img/filter-icons/short-text.svg" />
                  </div>
                  <v-switch v-model="s.IsShow"></v-switch>
                  <label v-if="filterOpened">Subject</label>
                </div>
                <div
                  v-for="(s, ind) of shareSettings.senderInfo"
                  :key="ind + s.Id"
                  :class="{ 'minify-switch': !filterOpened }"
                  class="switch-row"
                >
                  <div class="img-wrapper">
                    <img src="../../assets/img/filter-icons/user-out.svg" />
                  </div>
                  <v-switch v-model="s.IsShow"></v-switch>
                  <label v-if="filterOpened">Sender Info</label>
                </div>
                <div
                  v-for="(s, ind) of shareSettings.receiverInfo"
                  :key="ind + s.Id"
                  :class="{ 'minify-switch': !filterOpened }"
                  class="switch-row"
                >
                  <div class="img-wrapper">
                    <img src="../../assets/img/filter-icons/user-in.svg" />
                  </div>
                  <v-switch v-model="s.IsShow"></v-switch>
                  <label v-if="filterOpened">Receiver Info</label>
                </div>
              </div>
              <div :class="{ 'minify-part': !filterOpened }" class="filter-part pt-4">
                <div
                  v-for="(s, ind) of shareSettings.allLinks"
                  :key="ind + s.Id"
                  :class="{ 'minify-switch': !filterOpened }"
                  class="switch-row"
                >
                  <div class="img-wrapper">
                    <img src="../../assets/img/filter-icons/link.svg" />
                  </div>
                  <v-switch
                    v-if="shareSettings.links && shareSettings.links.length < 1"
                    :disabled="true"
                    :value="false"
                  ></v-switch>
                  <v-switch v-else v-model="allLinks"></v-switch>
                  <label v-if="filterOpened">All Links</label>
                </div>
                <div
                  v-for="(s, ind) of shareSettings.links"
                  :key="ind + s.Id"
                  :class="{ 'minify-switch': !filterOpened }"
                  class="switch-row"
                >
                  <div class="img-wrapper">
                    <img src="../../assets/img/filter-icons/link-red.svg" />
                  </div>
                  <v-switch class="phishing-switchs" v-model="s.IsShow"></v-switch>
                  <label v-if="filterOpened">“{{ s.Name }}”</label>
                </div>
              </div>

              <div :class="{ 'minify-part': !filterOpened }" class="filter-part pt-5">
                <div
                  v-for="(s, ind) of shareSettings.allAttachments"
                  :key="ind + s.Id"
                  :class="{ 'minify-switch': !filterOpened }"
                  class="switch-row"
                >
                  <div class="img-wrapper">
                    <img src="../../assets/img/filter-icons/attachment-all.svg" />
                  </div>
                  <v-switch
                    v-if="shareSettings.attachments && shareSettings.attachments.length < 1"
                    :disabled="true"
                    :value="false"
                  ></v-switch>
                  <v-switch v-else v-model="allAttachments"></v-switch>
                  <label v-if="filterOpened">All Attachments</label>
                </div>
                <div
                  v-for="(s, ind) of shareSettings.attachments"
                  :key="ind + s.Id"
                  :class="{ 'minify-switch': !filterOpened }"
                  class="switch-row"
                >
                  <div v-if="s.Type === 'Attachment'" class="img-wrapper">
                    <img src="../../assets/img/filter-icons/attach-file.svg" />
                  </div>
                  <div v-else class="img-wrapper">
                    <img src="../../assets/img/filter-icons/attach-red.svg" />
                  </div>
                  <v-switch v-model="s.IsShow"></v-switch>
                  <label v-if="filterOpened">{{ s.Name }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="step === 5">
          <div class="incident-header pb-8">
            <p>Preview</p>
            <span>See how your post will look like</span>
          </div>
          <div class="post-wrapper">
            <v-expansion-panels v-model="panel" multiple class="mb-4">
              <v-expansion-panel>
                <div class="threat-sharing-content">
                  <div class="ts-header">
                    <div class="ts-title">
                      <span v-if="uploadRespond.Title">{{ uploadRespond.Title }}</span>
                      <span v-else>Post Title</span>
                    </div>
                    <div class="flex-grow-1"></div>
                    <div class="ts-header-btn-1">
                      <v-expansion-panel-header
                        class="pa-0"
                        style="min-height: 36px;"
                        @click="toggle = !toggle"
                        disable-icon-rotate
                        ref="expandIncident"
                      >
                        <template v-slot:actions mandatory="true">
                          <v-btn v-if="toggle" outlined rounded medium color="blue">
                            COLLAPSE
                          </v-btn>
                          <v-btn v-else outlined rounded medium color="blue">
                            DETAILS
                          </v-btn>
                        </template>
                      </v-expansion-panel-header>
                    </div>
                  </div>

                  <div class="ts-user-comp">
                    <div class="ts-user-comp-detail">
                      by
                      <a v-if="userGetter.fullName" href="#" class="pl-1 pr-1">
                        {{ userGetter.fullName }}</a
                      >
                      <a v-else href="#" class="pl-1 pr-1"> {{ userGetter.fullName }}</a> from
                      <a
                        v-if="userGetter.currentCompany && userGetter.currentCompany.name"
                        href="#"
                        class="pl-1"
                        >{{ userGetter.currentCompany.name }}</a
                      >
                      <a v-else class="pl-1">Company Name</a>
                    </div>
                    <div class="ts-user-date">
                      <span>{{ date }}</span>
                    </div>
                  </div>
                  <div class="ts-body">
                    <v-clamp v-if="uploadRespond.Description" autoresize :max-lines="3">
                      {{ uploadRespond.Description }}
                    </v-clamp>
                    <v-clamp v-else autoresize :max-lines="3">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                      quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                      consequat.
                    </v-clamp>
                  </div>
                  <div class="ts-footer d-flex row wrap">
                    <div class="ts-like mt-1">
                      <v-btn text x-small icon color="grey">
                        <v-icon>mdi-thumb-up</v-icon>
                      </v-btn>
                      <span class="ts-action-counter">6</span>
                    </div>
                    <div class="ts-message mt-1">
                      <v-btn text x-small icon color="grey">
                        <v-icon>mdi-message-reply-text</v-icon>
                      </v-btn>
                      <span class="ts-action-counter">4</span>
                    </div>
                    <div class="ts-harmful mt-1">
                      <v-btn text x-small icon color="red">
                        <v-icon style="font-size: 14px">mdi-alert-circle</v-icon>
                      </v-btn>
                      <span class="ts-actions">1 harmful items</span>
                    </div>
                    <!-- solution field missing for now
                    <div class="ts-success mt-1">
                      <v-btn text x-small icon color="grey">
                        <v-icon style="font-size: 14px" color="#43a047">mdi-check-circle</v-icon>
                      </v-btn>
                      <span class="ts-actions">Solution</span>
                    </div>
                    -->
                    <div class="flex-grow-1"></div>
                    <div class="ts-tags">
                      <v-btn
                        v-if="shareSettings.attachments && shareSettings.attachments.length < 2"
                        text
                        small
                        rounded
                        outlined
                        class="tag-btn text-none"
                        >Attachments</v-btn
                      >
                      <div
                        style="position: relative;"
                        v-if="
                          uploadRespond.CommunityPostCategory &&
                            uploadRespond.CommunityPostCategory.length > 1
                        "
                      >
                        <v-btn
                          text
                          small
                          rounded
                          outlined
                          class="tag-btn ml-1 text-none"
                          @mouseover="hoverTool = true"
                          @mouseleave="hoverTool = false"
                        >
                          +{{ uploadRespond.CommunityPostCategory.length }}
                        </v-btn>
                        <div v-show="hoverTool" class="tooltip-wrapper">
                          <span
                            v-for="(item, ind) of uploadRespond.CommunityPostCategory"
                            :key="ind"
                          >
                            {{ item }} <br />
                          </span>
                        </div>
                      </div>
                      <div
                        style="position: relative;"
                        v-else-if="
                          uploadRespond.CommunityPostCategory &&
                            uploadRespond.CommunityPostCategory.length == 1
                        "
                      >
                        <v-btn
                          text
                          small
                          rounded
                          outlined
                          class="tag-btn ml-1 text-none"
                          @mouseover="hoverTool = true"
                          @mouseleave="hoverTool = false"
                          v-for="(item, ind) of uploadRespond.CommunityPostCategory"
                          :key="ind"
                        >
                          {{ item }}
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </div>
                <v-expansion-panel-content eager class="expand-body member-company-body pb-3 pa-0">
                  <v-tabs
                    v-model="tab"
                    background-color="transparent"
                    color="basil"
                    class="tab-bar"
                  >
                    <v-tab>
                      Details
                    </v-tab>
                    <v-tab>
                      Email Preview
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items v-model="tab">
                    <v-tab-item>
                      <div class="detail-parts">
                        <p class="detail-black">Header</p>
                        <p
                          v-for="(el, ind) of shareSettings.senderInfo"
                          :key="ind + el.Id"
                          v-if="el.Type == 'SenderInfo' && el.IsShow"
                          class="detail-black detail-red"
                        >
                          From: {{ uploadRespond.CommunityPostEmails[0].From }}
                        </p>
                        <p v-else class="detail-black detail-red">
                          From: ***********
                        </p>
                        <p
                          v-for="(el, ind) of shareSettings.links"
                          :key="ind + el.Id"
                          v-if="el.IsMalicious"
                          class="detail-black"
                        >
                          The sender email address has been reported as harmful email sender.
                        </p>
                        <!--
                          <p class="detail-black">
                            The sender email address has been reported as harmful email sender.
                          </p>
                        -->
                      </div>
                      <div class="detail-parts">
                        <p class="detail-black">Body</p>
                        <p
                          v-for="(el, ind) of shareSettings.links"
                          :key="ind + el.Id"
                          v-if="el.Type == 'Link' && el.IsShow"
                          class="detail-black detail-red"
                        >
                          Link: {{ el.Value }}
                        </p>
                        <p
                          v-for="(el, ind) of shareSettings.links"
                          :key="ind + el.Id"
                          v-if="el.Type == 'Link' && !el.IsShow"
                          class="detail-black detail-red"
                        >
                          Link: ************
                        </p>
                        <p
                          v-for="(el, ind) of shareSettings.links"
                          :key="ind + el.Id"
                          v-if="el.IsMalicious"
                          class="detail-black"
                        >
                          This link has been reported as a phising link
                        </p>
                      </div>
                      <div class="detail-parts">
                        <div
                          class="preview-footer"
                          v-if="shareSettings.attachments && shareSettings.attachments.length"
                        >
                          <h2>Attachments</h2>
                          <div class="attachment-wrapper">
                            <div
                              v-for="(att, ind) of shareSettings.attachments"
                              :key="ind + att.Id"
                              class="attachment red-attach"
                              :class="[
                                att.IsMalicious ? 'red-attach' : '',
                                !att.IsMalicious ? 'blue-attach' : ''
                              ]"
                            >
                              <div v-if="att.IsMalicious" class="attach-icon red-icon">
                                <v-icon color="white" style="font-size: 20px">mdi-alert</v-icon>
                              </div>
                              <div v-else class="attach-icon blue-icon">
                                <v-icon color="white" style="font-size: 20px">mdi-paperclip</v-icon>
                              </div>
                              <div v-if="att.IsShow" class="file-name max-char">{{ att.Name }}</div>
                              <div v-if="!att.IsShow" class="file-name max-char">
                                **********
                              </div>
                              <p v-if="att.IsMalicious" class="detail-black">
                                The sender email address has been reported as harmful email sender.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="detail-discovery">
                        <div v-if="uploadRespond.DiscoveryAndDetection" class="disc-header">
                          Discovery and Detection
                        </div>
                        <p v-if="uploadRespond.DiscoveryAndDetection" class="discovery-p">
                          {{ uploadRespond.DiscoveryAndDetection }}
                        </p>
                        <div v-if="uploadRespond.AffectArea" class="disc-header mb-1">
                          Impact Range
                        </div>
                        <div v-if="uploadRespond.AffectArea" class="impact-row">
                          <div class="impact-left">Effect area:</div>
                          <div
                            v-for="(a, ind) of uploadRespond.AffectArea"
                            :key="ind + a"
                            style="width: max-content; padding-right: 13px;"
                            class="impact-right"
                          >
                            {{ a }}
                          </div>
                        </div>
                        <div v-if="uploadRespond.Scope" class="impact-row">
                          <div class="impact-left">Scope:</div>
                          <div class="impact-right">
                            {{ uploadRespond.Scope }}
                          </div>
                        </div>
                      </div>
                    </v-tab-item>
                    <v-tab-item>
                      <div class="preview-header pt-0">
                        <h2
                          v-for="(el, ind) of shareSettings.subject"
                          :key="ind + el"
                          v-if="
                            uploadRespond.CommunityPostEmails[0] &&
                              uploadRespond.CommunityPostEmails[0].Subject.length &&
                              el.IsShow
                          "
                          style="padding: 0 2px; border-bottom: 1px solid transparent;"
                        >
                          Subject: {{ uploadRespond.CommunityPostEmails[0].Subject }}
                        </h2>
                        <h2
                          v-else-if="
                            uploadRespond.CommunityPostEmails[0] &&
                              uploadRespond.CommunityPostEmails[0].Subject.length &&
                              !el.IsShow
                          "
                          style="padding: 0 2px; border-bottom: 1px solid transparent;"
                        >
                          Subject: ************
                        </h2>
                        <div class="header-info pb-5">
                          <span
                            v-for="(el, ind) of shareSettings.senderInfo"
                            :key="ind + el"
                            v-if="
                              uploadRespond.CommunityPostEmails[0] &&
                                uploadRespond.CommunityPostEmails[0].From.length &&
                                el.IsShow
                            "
                            >From: {{ uploadRespond.CommunityPostEmails[0].From }}<br
                          /></span>
                          <span
                            v-else-if="
                              uploadRespond.CommunityPostEmails[0] &&
                                uploadRespond.CommunityPostEmails[0].From.length &&
                                !el.IsShow
                            "
                            >From: ************
                          </span>
                          <div
                            v-for="(el, ind) of shareSettings.receiverInfo"
                            :key="ind + el"
                            v-if="
                              uploadRespond.CommunityPostEmails[0] &&
                                uploadRespond.CommunityPostEmails[0].To.length &&
                                el.IsShow
                            "
                            style="padding: 0 2px; border-bottom: 1px solid transparent;"
                          >
                            To: {{ uploadRespond.CommunityPostEmails[0].To }}
                          </div>
                          <div
                            v-else-if="
                              uploadRespond.CommunityPostEmails[0] &&
                                uploadRespond.CommunityPostEmails[0].To.length &&
                                !el.IsShow
                            "
                            style="padding: 0 2px; border-bottom: 1px solid transparent;"
                          >
                            To: ************
                          </div>
                          <div
                            v-for="(el, ind) of shareSettings.receiverInfo"
                            :key="ind + el"
                            v-if="
                              uploadRespond.CommunityPostEmails[0] &&
                                uploadRespond.CommunityPostEmails[0].Cc.length &&
                                el.IsShow
                            "
                            style="padding: 0 2px; border-bottom: 1px solid transparent;"
                          >
                            CC: {{ uploadRespond.CommunityPostEmails[0].Cc }}
                          </div>
                          <div
                            v-else-if="
                              uploadRespond.CommunityPostEmails[0] &&
                                uploadRespond.CommunityPostEmails[0].Cc.length &&
                                !el.IsShow
                            "
                            style="padding: 0 2px; border-bottom: 1px solid transparent;"
                          >
                            CC: ************
                          </div>
                          <div v-if="uploadRespond.CommunityPostEmails[0]">
                            Date:
                            {{ uploadRespond.CommunityPostEmails[0].ReceivedDate.slice(0, 10) }}
                            {{ uploadRespond.CommunityPostEmails[0].ReceivedDate.slice(11, 16)
                            }}<br />
                          </div>
                        </div>
                      </div>
                      <div class="preview-body" v-html="uploadRespond.CommunityPostEmails[0].Body">
                      </div>
                      <div
                        class="preview-footer"
                        v-if="shareSettings.attachments && shareSettings.attachments.length"
                      >
                        <h2>Attachments</h2>
                        <div class="attachment-wrapper">
                          <div
                            v-for="(att, ind) of shareSettings.attachments"
                            :key="ind + att.Id"
                            class="attachment red-attach"
                            :class="[
                              att.IsMalicious ? 'red-attach' : '',
                              !att.IsMalicious ? 'blue-attach' : ''
                            ]"
                          >
                            <div v-if="att.IsMalicious" class="attach-icon red-icon">
                              <v-icon color="white" style="font-size: 20px">mdi-alert</v-icon>
                            </div>
                            <div v-else class="attach-icon blue-icon">
                              <v-icon color="white" style="font-size: 20px">mdi-paperclip</v-icon>
                            </div>
                            <div v-if="att.IsShow" class="file-name max-char">{{ att.Name }}</div>
                            <div v-if="!att.IsShow" class="file-name max-char">
                              **********
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="preview-buttons">
                        <v-btn>
                          <v-icon>mdi-thumb-up</v-icon>
                          Useful 7
                        </v-btn>
                        <v-btn
                          :class="{ 'active-act': commentOpened }"
                          @click="commentOpened = !commentOpened"
                        >
                          <v-icon :class="{ 'active-act': commentOpened }">mdi-comment</v-icon>
                          Comments (4)
                        </v-btn>
                      </div>
                      <div class="preview-comments" :class="{ 'open-comments': commentOpened }">
                        <div v-if="comments.length">
                          <div v-for="(com, ind) of comments" :key="ind" class="comment-row">
                            <div class="user-wrapper">
                              <span class="username">{{ com.name }}</span>
                              from
                              <span class="company-name">{{ com.company }}</span>
                              <p class="the-comment">
                                {{ com.comment }}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div v-else class="comment-row">
                          <div class="user-wrapper">
                            <span class="username">User Name</span>
                            from
                            <span class="company-name">Company Name</span>
                            <p class="the-comment">
                              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                              eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                          </div>
                        </div>

                        <div v-if="seeComments" class="hidden-comments">
                          <div class="comment-row">
                            <div class="user-wrapper">
                              <span class="username">User Name</span>
                              from
                              <span class="company-name">Company Name</span>
                              <p class="the-comment">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                              </p>
                            </div>
                          </div>
                          <div class="comment-row">
                            <div class="user-wrapper">
                              <span class="username">User Name</span>
                              from
                              <span class="company-name">Company Name</span>
                              <p class="the-comment">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                              </p>
                            </div>
                          </div>
                          <div class="comment-row">
                            <div class="user-wrapper">
                              <span class="username">User Name</span>
                              from
                              <span class="company-name">Company Name</span>
                              <p class="the-comment">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="!seeComments"
                          class="see-all-comments"
                          @click="seeComments = true"
                        >
                          <span>See all 3 comments</span>
                        </div>
                      </div>
                    </v-tab-item>
                  </v-tabs-items>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </div>
      </v-card>
      <div class="footer-actions">
        <v-btn class="cancel-btn" text color="#f56c6c" @click="onCancelClicked">Cancel</v-btn>
        <div>
          <v-btn
            v-if="step === 2 || step === 3 || step === 4 || step === 5"
            class="previous-btn mr-4"
            text
            color="#2196f3"
            @click="step = step - 1"
            >Previous</v-btn
          >
          <v-btn
            v-if="step === 1"
            :disabled="!selectedEmail && !uploadRespond.IsActive"
            :class="{ 'disabled-cursor': !selectedEmail && !uploadRespond.IsActive }"
            class="create-btn"
            text
            color="#2196f3"
            @click="onContinue"
            >Next</v-btn
          >
          <v-btn
            v-if="step === 2"
            :disabled="!stepTwoDisabled()"
            :class="{ 'disabled-cursor': !stepTwoDisabled() }"
            class="create-btn"
            text
            color="#2196f3"
            @click="onContinue"
            >Next</v-btn
          >
          <v-btn
            v-if="step === 3"
            :disabled="!stepThreeDisabled()"
            :class="{ 'disabled-cursor': !stepThreeDisabled() }"
            class="create-btn"
            text
            color="#2196f3"
            @click="onThirdStep"
            >Next</v-btn
          >
          <v-btn v-if="step === 4" class="create-btn" text color="#2196f3" @click="onBeforeLastStep"
            >Next</v-btn
          >
          <v-btn v-if="step === 5" class="create-btn" text color="#2196f3" @click="onFinish"
            >Post</v-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import VClamp from 'vue-clamp'
export default {
  components: {
    VClamp
  },
  props: {
    updatePost: {
      type: String,
      required: false
    }
  },
  computed: {
    ...mapGetters({
      businessCategories: 'threadSharing/businessCategoryGetter',
      selectedCommunity: 'threadSharing/selectedCommunityGetter',
      userGetter: 'auth/userGetter',
      uploadResponseGetter: 'threadSharing/uploadResponseGetter',
      listedIncidents: 'threadSharing/listedIncidentGetter',
      selectedIncident: 'threadSharing/selectedIncidentGetter',
      postDetail: 'threadSharing/postDetailGetter'
    })
  },
  data: () => ({
    step: 1,
    search: '',
    searchIncident: '',
    items: [],
    categories: ['Malicious', 'Non-malicious', 'Phishing'],
    model: [],
    activator: null,
    attach: null,
    colors: ['#e0e0e0'],
    editing: null,
    index: -1,
    nonce: 1,
    menu: false,
    x: 0,
    warnItem: true,
    selectedEmail: '',
    affectSearch: null,
    emails: [
      {
        name: 'File Format Exploit',
        icon: 'mdi-paperclip',
        type: 'Malicious',
        time: '1w'
      },
      {
        name: 'File Format Exploit',
        icon: 'mdi-paperclip',
        type: 'Malicious',
        time: '1w'
      },
      {
        name: 'File Format Exploit',
        icon: 'mdi-paperclip',
        type: 'Malicious',
        time: '1w'
      }
    ],
    header: {
      allHeader: true,
      subject: true,
      sender: true,
      receiver: true
    },
    body: {
      allLinks: true,
      phishingLinks: true,
      phishing1: true,
      phishing2: false
    },
    footer: {
      allAttachments: true,
      attachment1: true,
      attachment2: true
    },
    valid: false,
    autocomplete: [v => !!v &&
        /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) || 'You should select an incident or upload a .eml or .msg file'],
    title: [v => !!v || 'Title is required'],
    category: [v => !!v || 'Category is required'],
    titleRule: {
      required: v => (!!v && v.length >= 4 && v.length <= 80) || 'Title must be between 4 and 80 characters long',
      regex: v =>
        /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
        'Only use letters, digits, period, comma, underline and hyphen'
    },
    descRule: {
      required:  v =>
        (!!v && v.length >= 5 && v.length <= 300) || 'Description should be between 5 - 300 characters long',
      regex: v =>
        /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
        'Only use letters, digits, period, comma, underline and hyphen'
    },
    explanationRules: {
      required:  v =>
        (!!v && v.length <= 300) || 'Explanation should be maximum of 300 characters long',
      regex: v =>
        /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
        'Only use letters, digits, period, comma, underline and hyphen'
    },
    scopeRules: {
      required: v =>
      (!!v && v.length <= 200) || 'Explanation should be maximum of 200 characters long',
      regex: v =>
        /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
        'Only use letters, digits, period, comma, underline and hyphen'
    },
    affectRules: {
      regex: v =>
        /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
        'Only use letters, digits, period, comma, underline and hyphen'
    },
    createInc: {
      postId: '',
      title: 'Subject: Subject comes here',
      description: '',
      category: '',
      discovery: '',
      affect: [],
      affectSearch: null,
      scope: '',
      select: ['add-tags-with', 'enter', 'tab', 'paste'],
      items: [],
      search: '',
      createUser: '',
      createCompany: '',
      onPreview: true
    },
    filterOpened: true,
    flagData: {
      subject: false,
      sender: false,
      receiver: false,
      phishing: false,
      link: false,
      attachment: false
    },
    msgEmlFile: null,
    toggle: false,
    panel: [],
    expanded: false,
    tab: 1,
    commentOpened: false,
    userComment: '',
    comments: [],
    hoverTool: false,
    seeComments: false,
    date: new Date().toISOString().slice(0, 10),
    uploadRespond: {},
    shareSettings: {},
    allHeader: false,
    allLinks: false,
    allAttachments: false
  }),
  watch: {
    'shareSettings.allHeader': function(newVal, oldVal) {
      this.allHeader = newVal[0].IsShow
    },
    allHeader(val) {
      if (val === true) {
        this.shareSettings.subject[0].IsShow = true
        this.shareSettings.senderInfo[0].IsShow = true
        this.shareSettings.receiverInfo[0].IsShow = true
      } else {
        this.shareSettings.subject[0].IsShow = false
        this.shareSettings.senderInfo[0].IsShow = false
        this.shareSettings.receiverInfo[0].IsShow = false
      }
    },
    'header.sender': function(newVal, oldVal) {
      if (newVal === false && newVal != oldVal) {
        this.header.allHeader = false
      }
    },
    'header.receiver': function(newVal, oldVal) {
      if (newVal === false && newVal != oldVal) {
        this.header.allHeader = false
      }
    },
    'shareSettings.allAttachments': function(newVal, oldVal) {
      this.allAttachments = newVal[0].IsShow
    },
    allAttachments(val) {
      for (let a = 0; a < this.shareSettings.attachments.length; a++) {
        if (val === true) {
          this.shareSettings.attachments[a].IsShow = true
        } else {
          this.shareSettings.attachments[a].IsShow = false
        }
      }
    },
    'shareSettings.allLinks': function(newVal, oldVal) {
      this.allLinks = newVal[0].IsShow
    },
    allLinks(val) {
      for (let a = 0; a < this.shareSettings.links.length; a++) {
        if (val === true) {
          this.shareSettings.links[a].IsShow = true
        } else {
          this.shareSettings.links[a].IsShow = false
        }
      }
    },
    'uploadRespond.AffectArea': function(newVal, oldVal) {
      if (newVal && newVal.length > 5) {
        this.$nextTick(() => this.uploadRespond.AffectArea.pop())
      }
    },
    affectSearch(val) {
      if (val && val.length > 20) {
        this.affectSearch = ''
      }
    },
    uploadResponseGetter(val) {
      if (val) {
        this.handleIncident(val)
      }
    },
    postDetail(val) {
      if (val) {
        this.handleIncident(val.Data)
      }
    },
    selectedEmail(val) {
      if (val) {
        this.$store.dispatch('threadSharing/getIncident', val)
      }
    },
    shareSettings: {
      deep: true,
      handler(val) {
        for (let a of val.links) {
          var els = document.querySelectorAll('[href="' + decodeURI(a.Value) + '"]')
          // val.CommunityPostEmails[0].Body.includes(`a[href="${a.Value}"]`);
          for (var i = 0, l = els.length; i < l; i++) {
            var el = els[i]
            if (!a.IsShow) {
              el.innerHTML = '************'
            } else {
              el.innerHTML = a.Name
            }
            if (a.IsMalicious) {
              el.classList.add('malicious-link')
            }
          }
        }
      }
    },
    searchIncident(val) {
      this.$store.dispatch('threadSharing/fetchListedIncidents', val)
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
    }
  },
  methods: {
    onCancelClicked() {
      this.$emit('closePostIncident')
    },
    stepChange(num) {
      this.step = num
    },
    onContinue() {
      return this.step++
    },
    onThirdStep() {
      if(this.affectSearch && !this.regexChar(this.affectSearch)) {
        return false
      } else {
        this.step++
        const refThis = this
        setTimeout(function() {
          refThis.previewHideShow()
        }, 1000)
      }
    },
    uploadFile() {
      if (this.selectedCommunity.id != null) {
        var uploadObj = {
          Attachment: this.msgEmlFile[0],
          CommunityId: this.selectedCommunity.id,
          CompanyId: localStorage.getItem('companyId'),
          CreateUserId: this.userGetter.id
        }
      } else {
        var uploadObj = {
          Attachment: this.msgEmlFile[0],
          CommunityId: localStorage.getItem('communityId'),
          CompanyId: localStorage.getItem('companyId'),
          CreateUserId: localStorage.getItem('userId')
        }
      }
      if (this.uploadRespond != null) {
        uploadObj.CommunityPostId = this.uploadRespond.CommunityPostId || ''
      }
      this.$store.dispatch('threadSharing/postAnIncident', uploadObj).then(() => {
        this.msgEmlFile = null
      })
    },
    onBeforeLastStep() {
      this.createInc.createUser = this.$store.state.auth.user.fullName
      this.createInc.createCompany = this.$store.state.auth.user.currentCompany.name
      this.createInc.onPreview = true
      this.step++
      const refThis = this
      setTimeout(function() {
        refThis.previewHideShow()
      }, 1000)
    },
    onFinish() {
      const newSettings = []
      newSettings.push(this.shareSettings.senderInfo[0])
      newSettings.push(this.shareSettings.subject[0])
      newSettings.push(this.shareSettings.receiverInfo[0])
      this.shareSettings.allHeader[0].IsShow = this.allHeader
      newSettings.push(this.shareSettings.allHeader[0])
      this.shareSettings.allLinks[0].IsShow = this.allLinks
      newSettings.push(this.shareSettings.allLinks[0])
      this.shareSettings.allAttachments[0].IsShow = this.allAttachments
      newSettings.push(this.shareSettings.allAttachments[0])
      for (let a of this.shareSettings.attachments) {
        newSettings.push(a)
      }
      for (let b of this.shareSettings.links) {
        newSettings.push(b)
      }
      this.uploadRespond.IsPreview = true
      this.uploadRespond.CommunityPostEmails[0].body = null
      if (
        this.uploadRespond.AffectArea != null &&
        typeof this.uploadRespond.AffectArea !== 'string'
      ) {
        this.uploadRespond.AffectArea = this.uploadRespond.AffectArea.join(',')
      }
      this.uploadRespond.CommunityPostEmails[0].ShareSettings = newSettings

      this.$store.dispatch('threadSharing/publishPostIncident', this.uploadRespond).then(() => {
        this.$router.push('/community/' + localStorage.getItem('companyName'))
      })
      this.createInc.onPreview = false
      this.$store.commit('common/SET_IS_LOADING', false, { root: true })
      this.$emit('closePostIncident')
    },
    updateTags() {
      this.$nextTick(() => {
        this.createInc.select.push(...this.createInc.search.split(','))
        this.$nextTick(() => {
          this.search = ''
        })
      })
    },
    closePreview() {
      this.selectedEmail = ''
      this.uploadRespond = {}
      this.msgEmlFile = null
      this.shareSettings = {}
      this.$store.dispatch('threadSharing/postAnIncident', false)
    },
    handleIncident(val) {
      if (val && val.CommunityPostEmails[0] && val.CommunityPostEmails[0].ShareSettings.length) {
        this.uploadRespond = val
        const ShareSettings = {
          senderInfo: val.CommunityPostEmails[0].ShareSettings.filter(f => f.Type === 'SenderInfo'),
          subject: val.CommunityPostEmails[0].ShareSettings.filter(f => f.Type === 'Subject'),
          receiverInfo: val.CommunityPostEmails[0].ShareSettings.filter(
            f => f.Type === 'ReceiverInfo'
          ),
          attachments: val.CommunityPostEmails[0].ShareSettings.filter(
            f => f.Type === 'Attachment'
          ),
          links: val.CommunityPostEmails[0].ShareSettings.filter(f => f.Type === 'Link'),
          allHeader: val.CommunityPostEmails[0].ShareSettings.filter(f => f.Type === 'AllHeader'),
          allLinks: val.CommunityPostEmails[0].ShareSettings.filter(f => f.Type === 'AllLinks'),
          allAttachments: val.CommunityPostEmails[0].ShareSettings.filter(
            f => f.Type === 'AllAttachments'
          )
        }
        if (ShareSettings.links && ShareSettings.links.length) {
          setTimeout(function() {
            for (let a of ShareSettings.links) {
              var els = document.querySelectorAll('[href="' + decodeURI(a.Value) + '"]')
              // val.CommunityPostEmails[0].Body.includes(`a[href="${a.Value}"]`);
              for (var i = 0, l = els.length; i < l; i++) {
                var el = els[i]
                if (!a.IsShow) {
                  el.innerHTML = '************'
                  // el.setAttribute('href', '#')
                }
                if (a.IsMalicious) {
                  el.classList.add('malicious-link')
                }
              }
            }
          }, 1000)
        }
        if (val.AffectArea != null && val.AffectArea.length > 1) {
          this.uploadRespond.AffectArea = val.AffectArea.split(',')
        }
        this.shareSettings = ShareSettings
      }
    },
    previewHideShow() {
      if (this.uploadRespond && this.uploadRespond.CommunityPostEmails[0]) {
        this.uploadRespond.CommunityPostEmails[0].Body = unescape(
          this.uploadRespond.CommunityPostEmails[0].Body
        )
      }
      if (this.shareSettings.links && this.shareSettings.links.length) {
        for (let a of this.shareSettings.links) {
          var els = document.querySelectorAll('[href="' + decodeURI(a.Value) + '"]')
          for (var i = 0, l = els.length; i < l; i++) {
            var el = els[i]
            if (!a.IsShow) {
              el.innerHTML = '************'
              // el.setAttribute('href', '#')
            }
            if (a.IsMalicious) {
              el.classList.add('malicious-link')
            }
          }
        }
      }
    },
    stepTwoDisabled() {
      if (
        this.uploadRespond.Description &&
        this.uploadRespond.Description.length >= 5 &&
        this.uploadRespond.Description.length <= 300 &&
        this.regexChar(this.uploadRespond.Description) &&
        this.uploadRespond.Title &&
        this.uploadRespond.Title.length >= 4 &&
        this.uploadRespond.Title.length <= 80 &&
        this.regexChar(this.uploadRespond.Title) &&
        this.uploadRespond.CommunityPostCategory &&
        this.uploadRespond.CommunityPostCategory.length > 0
      ) {
        return true
      } else {
        return false
      }
    },
    stepThreeDisabled() {
      if (
        this.uploadRespond.DiscoveryAndDetection &&
        this.uploadRespond.DiscoveryAndDetection.length <= 300 &&
        this.regexChar(this.uploadRespond.DiscoveryAndDetection) &&
        this.uploadRespond.Scope &&
        this.uploadRespond.Scope.length <= 200 &&
        this.regexChar(this.uploadRespond.Scope) &&
        this.regexChar(this.uploadRespond.AffectArea)
      ) {
        return true
      } else {
        return false
      }
    },
    regexChar(val) {
      return /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(val)
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
  },
  mounted() {
    let businessCats = []
    for (let cat of this.businessCategories) {
      businessCats.push(cat.IDESC)
    }
    this.items = businessCats
    this.$store.dispatch('threadSharing/fetchListedIncidents')

    // If user wants to edit the post
    if (this.updatePost && this.updatePost.length) {
      const postDetailObj = {
        communId: this.selectedCommunity.id || localStorage.getItem('communityId'),
        companyId: this.userGetter.userCompany.id || localStorage.getItem('companyId'),
        communPostId: this.updatePost
      }
      this.$store.dispatch('threadSharing/getPostDetail', postDetailObj)
    }
  }
}
</script>
<style lang="scss" scoped>
.incident-container {
  min-height: 100vh;
  width: 100%;

  .incident-inner {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;

    .incident-card {
      width: 100%;
      min-height: 100vh;
      padding: 0 !important;
      padding: 32px 96px !important;
      padding-bottom: 100px !important;
    }
    .incident-steps {
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: #f5f7fa;
      margin: 25px -96px;
      padding-left: 96px;
      height: 57px;

      .active-step {
        border: solid 1px #409eff !important;
        color: #409eff !important;
      }

      .steps {
        align-items: center;
        display: flex;
        flex-direction: row;
        margin-right: 10px;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.5);

        .step-number {
          align-items: center;
          display: flex;
          justify-content: center;
          border-radius: 50%;
          border: solid 1px #909399;
          width: 24px;
          height: 24px;
          margin-right: 8px;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.87);
        }
        .active-step-num {
          border: solid 1px rgba(0, 0, 0, 0.87) !important;
        }
        .active-step-span {
          color: rgba(0, 0, 0, 0.87) !important;
        }

        hr {
          width: 69px;
          height: 1px;
          border: 1px solid #757575;
          margin: 0 10px;
          @media only screen and (max-width: 1025px) {
            width: 32px !important;
            margin: 0 4px;
          }
        }
      }
    }
    .incident-header {
      p {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.29;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
        margin-bottom: 0 !important;
      }
      span {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
      }
    }
  }
}
.footer-actions {
  align-items: center;
  bottom: 0;
  background-color: #f5f7fa;
  display: flex;
  left: 0;
  position: fixed;
  justify-content: space-between;
  padding: 0 96px;
  height: 68px;
  width: 100%;
  z-index: 9999;

  .cancel-btn {
    background-color: transparent !important;
    border-radius: 18px !important;
    border: solid 1px #f56c6c !important;
    color: #f56c6c !important;
    z-index: 9999;
  }
  .previous-btn {
    border-radius: 18px !important;
    border: solid 1px #2196f3 !important;
    color: #2196f3 !important;
    z-index: 9999;
  }
  .create-btn {
    border-radius: 18px !important;
    box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
    background-color: #2196f3 !important;
    color: #fff !important;
    z-index: 9999;
  }
}
::v-deep .v-text-field--outlined.error--text fieldset {
  border: 1px solid #ff5252 !important;
}
::v-deep .v-text-field--outlined.errored-selectbox fieldset {
  border: 1px solid #ff5252 !important;
}
::v-deep .v-autocomplete.affect-combobox .v-input__slot {
  height: auto !important;
}
::v-deep .v-autocomplete.affect-combobox {
  .v-messages__message {
    color: #f56c6c !important;
  }
}
.v-card-headline {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.35;
  letter-spacing: normal;
  color: #000;
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

.incident-header {
  p {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 24px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 0 !important;
  }
  span {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
}
.incident-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 24px;

  .input-header {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
  .input-sec-header {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
  .input-sub {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 10px;
  }
  .input-select {
    max-width: 205px;
    color: rgba(0, 0, 0, 0.72);
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px !important;
    margin-bottom: 32px;
  }
  .first-select {
    max-width: 554px;
  }
  ::v-deep .input-select > .v-input__control {
    max-width: 554px !important;
    align-items: center;
    display: flex;
    height: 40px !important;
  }
  .date-row {
    max-width: 390px !important;
  }
}
::v-deep .v-input {
  .v-input__slot {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.72);
    border-radius: 8px !important;
  }
}
::v-deep .v-text-field {
  .v-input__slot {
    box-shadow: unset !important;
  }
}
::v-deep .v-select {
  .v-input__slot {
    box-shadow: unset !important;
    height: 40px !important;
  }
}
::v-deep .v-autocomplete {
  .v-input__slot {
    border: 1px solid rgba(0, 0, 0, 0.16) !important;
    box-shadow: unset !important;
    height: 40px !important;
  }
}
.upload-wrapper {
  max-width: 109px;
  margin-top: -2px;
  border: unset !important;

  ::v-deep .up-btn {
    align-items: center;
    border-radius: 18px !important;
    box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
    background-color: #2196f3 !important;
    text-transform: none !important;
    padding: 0 !important;
    display: flex !important;
    justify-content: center !important;
    max-height: 36px !important;
    width: 100%;

    .v-input__prepend-outer {
      display: none !important;
    }
    .v-input__control {
      cursor: pointer !important;

      .v-input__prepend-inner {
        margin-left: 8px !important;
        margin-right: 0 !important;
        margin-top: 7px;
        i {
          color: #fff !important;
        }
      }
      .v-btn__content {
        margin-left: -5px !important;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.71;
        letter-spacing: normal;
      }
      .v-input__slot {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 0 !important;
        cursor: pointer !important;

        .v-text-field__slot {
          flex: unset !important;
          position: absolute;
          width: 100%;
          text-align: left;
          z-index: 13;
        }

        .v-file-input__text {
          color: #fff !important;
          display: block !important;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding-left: 42px;
          padding-top: 8px;
          height: 35px;
          width: 100%;
          border-radius: 20px;
        }
        .v-input__icon {
          min-width: 15px !important;
          width: 16px !important;
          position: absolute;
          left: 23px;
          z-index: 12;
        }
      }
      .v-input__slot::before,
      .v-input__slot::after {
        display: none !important;
      }

      i {
        font-size: 18px !important;
        margin-top: 2px;
        padding-right: 10px !important;
      }
    }
  }
  ::v-deep .v-input__append-inner {
    display: none !important;
  }
}
.step-container {
  max-width: 554px;
}

.investigate-header {
  p {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 24px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 0 !important;
  }
  span {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
}
.investigation-content {
  border-radius: 12px !important;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  .mail-preview {
    width: 100%;
    max-width: 600px;
    position: relative;
  }

  .investigation-filters {
    width: 300px;
    background-color: white;
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12);
    align-items: center;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    margin-left: 32px;
    transition: all 0.3s ease-in-out;
    position: relative;

    @media only screen and (max-width: 1025px) {
      position: absolute;
      top: 170px;
      right: 0;
      z-index: 99999;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
        0 1px 1px -1px rgba(204, 204, 204, 0.12);
      border: solid 1px #2196f3;
    }

    .filter-part {
      border-bottom: 1px solid #b3d4fc;
      display: flex;
      flex-direction: column;
      padding-top: 24px;
      padding-bottom: 30px;
      width: 240px;
      max-height: 300px;
      overflow-y: auto;
      transition: all 0.3s ease-in-out;

      ::v-deep .v-input--selection-controls.v-input {
        margin-top: 10px !important;
      }

      .select-header {
        transition: all 0.3s ease-in-out;
      }

      .switch-row {
        align-items: center;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;

        .img-wrapper {
          align-items: center;
          display: flex;
          min-width: 40px;
          max-width: 40px;

          img {
            padding-top: 25%;
            padding-right: 8px;
          }
        }
        label {
          margin-top: 10px;
          margin-left: 5px;
          max-width: 170px;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      ::v-deep .v-input--selection-controls:not(.v-input--hide-details) .v-input__slot {
        height: 25px !important;
        min-height: 25px !important;
        margin-bottom: 0 !important;
        max-width: 210px;

        label {
          height: 24px !important;
          margin-left: 8px !important;
          font-family: 'Open Sans', sans-serif !important;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.5;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.87);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          display: block;
          max-width: 100%;
        }
      }
      ::v-deep .accent--text {
        color: #2196f3 !important;
      }
      ::v-deep .theme--light.v-messages {
        display: none !important;
      }
    }
    .filter-part:last-child {
      border-bottom: unset !important;
    }
    .filter-part:nth-child(2) {
      height: auto;
      max-height: 300px;
      overflow: auto;
    }
    .filter-part:first-child {
      padding-top: 14.2px !important;
    }
    .attr-error {
      position: absolute;
      bottom: -20px;
      right: 0;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 9px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #d0021b;
    }
  }
}
.filters-content {
  display: flex;
  flex-direction: column;
  margin-top: 24px;

  .input-header {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
  .input-sub {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 16px;
  }
  .input-select {
    max-width: 205px;
    color: rgba(0, 0, 0, 0.72);
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px !important;
    margin-bottom: 32px;
  }
  .first-select {
    max-width: 554px;
  }

  ::v-deep .input-select > .v-input__control {
    max-width: 554px !important;
    align-items: center;
    display: flex;
    height: 40px !important;
  }

  .date-row {
    max-width: 390px !important;
  }
}

.underlined-warn {
  border-bottom: 1px solid #f56c6c;
  color: inherit;

  .icon {
    color: #f56c6c !important;
    font-size: 24px !important;
    text-decoration: none !important;
    margin-left: 20px;
    margin-bottom: 7px;
  }
}
.post-wrapper {
  max-width: 696px;
}
.select-error {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 9px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #d0021b;
  margin-left: 8px;
  margin-top: 17px;
}
.select-row-wrap {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 2px;

  .select-row-inline {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 10px;
    width: 230px;

    .file-type-wrap {
      display: flex;
      justify-content: space-between;
    }
  }
}
.email-name {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
  display: block;
  width: 270px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.email-icon {
  font-size: 19px !important;
  padding-right: 24px;
}
.email-type {
  height: 25px;
  border-radius: 4px;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 6px;
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
.email-time {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}

.v-card-headline {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.35;
  letter-spacing: normal;
  color: #000;
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

.preview-header {
  margin-top: 24px;

  h2 {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 16px;
    width: 100%;
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-height: 80px;
  }

  .header-info {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    padding-bottom: 43px;
    border-bottom: 1px solid #b3d4fc;
  }
}
.preview-body {
  margin-top: 24px;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
  border-bottom: 1px solid #b3d4fc;
  position: relative;
  padding-bottom: 24px;
  min-height: auto;
  max-height: 500px;
  overflow: auto;

  h2 {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    padding-bottom: 16px;
  }

  .company-img {
    display: flex;
    position: absolute;
    right: 0;
    top: 20px;
    width: 84px;
    height: 84px;

    img {
      width: 100%;
      height: auto;
    }
  }
}
.bodyExpanded {
  height: 100% !important;
  max-height: 100% !important;
  padding-bottom: 56px;
}
.preview-footer {
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  padding-bottom: 24px;
  overflow: auto;
  max-width: 100%;
  height: auto;

  h2 {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    padding-bottom: 16px;
  }
  .attachment-wrapper {
    display: flex;
    flex-direction: row;

    .attachment {
      width: 182px;
      height: 32px;
      align-items: center;
      display: flex;
      flex-direction: row;
      margin-right: 16px;
      border: 1px solid transparent;

      .attach-icon {
        min-width: 40px;
        height: 32px;
        align-items: center;
        display: flex;
        justify-content: center;
      }
      .red-icon {
        background-color: #bb2a45 !important;
      }
      .blue-icon {
        background-color: #2196f3 !important;
      }
      .file-name {
        width: 142px;
        text-align: left;
        display: block;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.58;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
        padding-left: 7px;
      }
    }
    .red-attach {
      border: 1px solid #bb2a45;
    }
    .blue-attach {
      border: 1px solid #2196f3;
    }
  }
}
.unselected-warn {
  border-bottom: 1px solid #bb2a45;
  color: #bb2a45;
  padding: 0 2px !important;
}
::v-deep .v-autocomplete {
  .v-input__slot {
    box-shadow: unset !important;
    border: 1px solid rgba(0, 0, 0, 0.24) !important;
  }
}
::v-deep .v-text-field.v-text-field--enclosed .v-input__append-inner {
  margin-top: 0 !important;
  display: flex;
  align-items: center;
}
.first-date {
  ::v-deep .v-input__slot {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-right: none !important;

    label {
      padding-left: 65px !important;
    }
  }
}
.sec-date {
  ::v-deep .v-input__slot {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-left: none !important;

    label {
      padding-left: 60px !important;
    }
  }
}
.date-picker {
  font-family: 'Open Sans', sans-serif !important;
  ::v-deep .v-input__slot {
    box-shadow: unset !important;
    border: 1px solid rgba(0, 0, 0, 0.24);
    border-radius: 4px;
    text-align: center;

    input {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 13px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.54);
      padding-left: 50px !important;
      padding-top: 8px !important;
    }
    label {
      padding-top: 0 !important;
    }
  }
  ::v-deep .v-input__slot::after,
  ::v-deep .v-input__slot::before {
    display: none;
  }
}
.date-col {
  position: relative;
}
.date-icon {
  top: 12px;
  left: 25px;
  position: absolute;
  font-size: 18px !important;
  z-index: 99;
}
.date-to {
  position: absolute;
  left: 0;
  top: 11px;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.72);
  z-index: 13;
}
.max-char {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
  max-width: 100%;
}
.text-selected {
  border-radius: 1px !important;
  background-color: #d1e9fc !important;
  border-bottom: 1px solid #2196f3 !important;
  color: rgba(0, 0, 0, 0.87) !important;
  width: max-content;
}
.clean-link {
  padding: 0 2px !important;
  border-radius: 1px !important;
  border-bottom: 1px solid #2196f3 !important;
  color: #2196f3 !important;
}
.selected-link {
  background-color: #d1e9fc !important;
}
.phishing-link {
  background-color: #f3e1e5 !important;
  border-bottom: 1px solid #bb2a45 !important;
  color: #bb2a45 !important;
  width: max-content;
}
.clean-attach {
  background-color: #f1f8fe;
  border: 1px solid transparent !important;
}
.malicious-attach {
  background-color: #f3e1e5;
  border: 1px solid transparent !important;
}
::v-deep .v-input > .v-input__control > .v-text-field__details {
  bottom: -24px !important;
  position: absolute;
  left: 0;
}
::v-deep .v-application input {
  border-radius: 8px !important;
  border: solid 1px rgba(0, 0, 0, 0.16) !important;
}
.required {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 9px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #474747;
  margin-left: 6px;
  margin-top: -2px;
}
.close-incident {
  position: absolute;
  right: -13px;
  top: 13px;
}
::v-deep
  .affect-input.v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)
  > .v-input__control
  > .v-input__slot {
  border: none !important;
}
.row-with-icon {
  align-items: center;
  display: flex;
  flex-direction: row;
}
.icon-btn {
  margin-top: unset;
  margin-left: -5px;
  height: 25px !important;
  width: 25px !important;
}
.step-name {
  width: max-content;
}
.filter-header {
  align-items: center;
  display: none;
  justify-content: space-between;
  padding-top: 24px;
  width: 240px;
  transition: all 0.3s ease-in-out;

  .select-header {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    transition: all 0.3s ease-in-out;
  }

  i {
    margin-top: 3px;
    font-size: 27px;
  }
}
.minify-filter {
  width: 120px !important;
}
.minify-part,
.minify-switch {
  padding-left: 10px;
  width: 100% !important;
}

// Email Preview css
.preview-header {
  margin-top: 24px;

  h2 {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 16px;
    width: 100%;
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-height: 80px;
  }

  .header-info {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
}
.preview-body {
  margin-top: 24px;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
  border-bottom: 1px solid #b3d4fc;
  position: relative;
  padding-bottom: 24px;
  min-height: auto;
  max-height: 500px;
  overflow: auto;

  .company-img {
    display: flex;
    position: absolute;
    right: 0;
    top: 20px;
    width: 84px;
    height: 84px;

    img {
      width: 100%;
      height: auto;
    }
  }
}
.bodyExpanded {
  height: 100% !important;
  max-height: 100% !important;
  padding-bottom: 56px;
}
.preview-footer {
  display: flex;
  flex-direction: column;
  margin-top: 24px;

  h2 {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    padding-bottom: 16px;
  }
  .attachment-wrapper {
    display: flex;
    flex-direction: row;

    .attachment {
      width: 182px;
      height: 32px;
      align-items: center;
      display: flex;
      flex-direction: row;
      margin-right: 16px;

      .attach-icon {
        min-width: 40px;
        height: 32px;
        align-items: center;
        display: flex;
        justify-content: center;
      }
      .red-icon {
        background-color: #bb2a45 !important;
      }
      .blue-icon {
        background-color: #2196f3 !important;
      }
      span {
        width: 100%;
        text-align: center;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.58;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
      }
    }
    .red-attach {
      background-color: #f3e1e5;
    }
    .blue-attach {
      background-color: #f1f8fe;
    }
  }
}
.preview-buttons {
  margin-top: 24px;
  padding-bottom: 13px;
  display: flex;
  flex-direction: row;
  border-top: 1px solid #b3d4fc;
  padding-top: 24px;

  ::v-deep .v-btn {
    border-radius: 18px !important;
    border: solid 1px #909399;
    box-shadow: unset !important;
    background-color: #fff !important;
    margin-right: 16px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 0, 0, 0.87);
    padding-left: 16px !important;

    .v-icon {
      color: #909399;
      font-size: 19px !important;
      margin-right: 8px;
      margin-top: 1px;
      border: unset !important;
    }
  }
  .active-act {
    color: #2196f3 !important;
    border: solid 1px #2196f3 !important;
  }
}
.preview-border {
  border-top: 1px solid #b3d4fc;
  padding-top: 24px;
}

// Details css
.detail-parts:first-child {
  margin-top: 24px !important;
}
.detail-parts {
  margin-top: 16px;

  .detail-black {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 4px !important;
  }
  .detail-red {
    color: rgba(219, 37, 37, 0.87) !important;
  }
}
.detail-discovery {
  margin-top: 24px;

  .disc-header {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    padding-bottom: 8px;
  }
  .discovery-p {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
}
.impact-row {
  display: flex;
  flex-direction: row;
  padding-bottom: 8px;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);

  .impact-left {
    min-width: 100px;
    font-weight: 600 !important;
  }
  .impact-right {
    margin-top: 2px;
    width: 100%;
  }
}
.border-padding {
  padding-bottom: 8px;
  border-bottom: 1px solid #b3d4fc;
}
.member-company-body {
  ::v-deep .v-slide-group__content {
    border-bottom: unset !important;
  }
}
.expand-contaniner {
  width: 100%;
  height: 50px;
  position: absolute;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  bottom: 0;
  background-image: linear-gradient(to bottom, transparent, #fff 50%);

  button,
  .v-btn:not(.v-btn--round).v-size--default {
    width: auto !important;
    height: 24px !important;
    border-radius: 12px !important;
    background-color: #409eff !important;
    box-shadow: unset !important;
    color: #fff;
    text-transform: capitalize !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    padding-left: 13px !important;

    i {
      width: 18px !important;
    }
  }
}
.opacityExpanded {
  background-image: none !important;
}
.preview-comments {
  height: 0;
  opacity: 0;
  transition: max-height 0.25s ease-in;
  overflow: hidden;

  .comment-row {
    display: flex;
    flex-direction: row;
    padding-top: 6px;

    .comment-input {
      margin-top: 3px;
      margin-right: 16px;

      ::v-deep .v-input__slot {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 13px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.54);
        padding-left: 24px !important;
        max-height: 70px;
        min-height: 40px;

        textarea {
          max-height: 70px;
          overflow: auto;
          margin-bottom: 5px;
          margin-top: 2px;
          margin-right: 2px;
        }
        label {
          top: 10px;
        }
        fieldset {
          padding-left: 18px !important;
        }
      }
    }
    .send-btn {
      border-radius: 18px !important;
      box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3) !important;
      background-color: #2196f3 !important;
      color: #fff !important;
      height: 36px !important;
      margin-top: 5px;

      i {
        font-size: 18px !important;
        padding-right: 8px;
      }
    }
  }
  .comment-row {
    border-radius: 4px;
    background-color: #f5f7fa;
    display: flex;
    padding: 16px;
    margin-bottom: 8px;

    .user-wrapper {
      .username,
      .company-name {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #2196f3;
        padding-right: 4px;
        cursor: pointer;
      }
      .company-name {
        padding-left: 4px;
      }
    }
    .the-comment {
      margin-bottom: 0 !important;
      padding-top: 8px !important;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
    }
  }
  .see-all-comments {
    padding-top: 16px;
    padding-bottom: 24px;

    span {
      text-decoration: none;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #2196f3;
      cursor: pointer;
    }
  }
}
.open-comments {
  min-height: 226px;
  height: auto !important;
  transition: max-height 0.25s ease-in;
  padding-bottom: 24px;
  opacity: 1;
  z-index: -5;
}
.add-comment {
  background-color: #fff !important;
  height: 60px;
  padding: 0 !important;
}
.unselected-warn {
  border-bottom: 1px solid #bb2a45;
  color: #bb2a45;
  padding: 0 2px !important;
}
.hide-buttons {
  opacity: 0;
  padding: 0 !important;
  height: 20px !important;
}
.display-none {
  display: none !important;
}
.tooltip-wrapper {
  max-width: 250px;
  width: 130px;
  border-radius: 4px;
  background-color: #6d6d6d;
  position: absolute;
  top: -70px;
  left: -35px;
  border-radius: 4px;
  box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8) !important;
  padding: 8px;

  span {
    color: rgba(255, 255, 255, 0.87) !important;
    font-size: 12px !important;
    line-height: 1.33 !important;
    font-family: 'Open Sans', sans-serif !important;
    font-weight: 400;
  }
}

// Threat sharing Content
.threat-sharing-content {
  min-height: 200px;
  width: 100%;
  padding: 24px !important;
  background-color: #ffffff;
  border-radius: 20px !important;

  @media only screen and (max-width: 500px) {
    padding: 16px !important;
  }
}
.ts-header {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.ts-header-btn-1 {
  display: flex;
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
  max-width: 85%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
}
// Threat sharing Content End

.notification-wrapper {
  background-color: #fff;
  padding: 0;
}
.v-menu__content {
  border-radius: 8px !important;
  box-shadow: 0 5px 12px 2px rgba(200, 200, 200, 0.8) !important;

  .v-list-item {
    padding-left: 29px !important;
    padding-right: 16px !important;
  }
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
  margin-top: 8px;
}
::v-deep .v-btn--contained {
  border-radius: 18px !important;
  box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
}
::v-deep .v-data-footer {
  margin-top: 24px !important;
}
::v-deep .v-data-footer__select {
  .v-select {
    margin: 0 !important;
    margin-top: 3px !important;
    margin-left: 32px !important;
    height: 30px !important;
  }
  .v-text-field > .v-input__control > .v-input__slot:after {
    border: none !important;
    display: none !important;
  }
  .theme--light.v-text-field > .v-input__control > .v-input__slot:before {
    border: none !important;
  }
  .v-input__append-inner {
    margin-left: 0 !important;
    margin-top: 3px !important;
    margin-right: 5px !important;
    padding-left: 0 !important;
  }
  .v-select__slot {
    align-items: center;
    display: flex;
    justify-content: center;
    height: 27px !important;
    background-color: #f2f2f2 !important;

    .v-select__selections {
      margin-left: 10px;
    }
  }
  .v-input__icon {
    width: 20px !important;
    min-width: 20px !important;
    height: 20px !important;
  }
}
::v-deep .v-btn:not(.v-btn--round).v-size--default,
::v-deep .v-btn--icon.v-size--default {
  height: 36px !important;
}
::v-deep .v-btn--icon.v-size--default {
  margin-left: 4px;
  width: 36px !important;
}

.ts-tags {
  align-items: center;
  display: flex;
  flex-direction: row;
  max-width: max-content;

  > .tag-btn,
  > div > .tag-btn {
    border-radius: 18px;
    border: solid 1.5px #c0c4cc;
    background-color: #fff;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #000000;
    height: 32px !important;
  }
}
.ts-footer {
  align-items: center;
  display: flex;
  margin-top: 22px;
  margin-left: 0;
  margin-right: 0;
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
  align-items: center;
  display: flex;

  span {
    align-items: center;
    font-size: inherit;
    line-height: unset;
    line-height: 2;
    margin-left: 4px;
  }
}
.ts-message {
  margin-right: 40px;
  align-items: center;
  display: flex;

  span {
    align-items: center;
    font-size: inherit;
    line-height: unset;
    line-height: 2;
    margin-left: 4px;
  }
}
.ts-harmful {
  margin-right: 15px;
  align-items: center;
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
  align-items: center;

  span {
    align-items: center;
    font-size: inherit;
    line-height: unset;
    line-height: 2;
  }
}
.ts-body {
  margin-top: 10px;
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
    font-family: 'Open Sans', sans-serif !important;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.58;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
}
.ts-action-counter {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #4a4a4a;
}
.ts-actions {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.58;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
  margin-left: 3px;
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
::v-deep .v-expansion-panel-header {
  box-shadow: unset !important;
  border: unset !important;
}

.tab-bar {
  width: 100%;
  height: 48px;
  padding: 0;
  background-color: #f5f7fa;
  border-radius: 0 !important;

  ::v-deep .v-slide-group__wrapper {
    padding-left: 0 !important;
  }
  ::v-deep .v-slide-group__content {
    margin-right: 0 !important;
  }
  ::v-deep .v-tab--active {
    color: #2196f3 !important;
  }
  ::v-deep .v-tab {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    text-transform: uppercase;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center !important;
    margin-right: 32px !important;
    padding: 0 !important;
    padding-right: 3px !important;
    min-width: auto !important;
  }
  ::v-deep .v-tabs-bar {
    padding: 0 24px;
    height: 48px !important;
    border-radius: 0 !important;
  }
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
::v-deep .title-field {
  .v-text-field__details {
    margin-bottom: 0 !important;
  }
}
::v-deep .v-text-field.v-text-field--enclosed .v-text-field__details {
  margin-bottom: 8px;
}
.disabled-cursor,
button:disabled {
  cursor: no-drop !important;
  pointer-events: all !important;
}
@media only screen and (max-width: 1025px) {
  .hide-step {
    display: none !important;
  }
  .filter-header {
    display: flex;
  }
}
.display-none {
  display: none !important;
}
</style>
