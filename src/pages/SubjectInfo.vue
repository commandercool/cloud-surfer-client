<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h3 class="title">Subject info: {{info.name}}</h3>
            </template>
            Tags:
            <div v-if="tagger.mode === 'show'">
              <b-badge
                v-for="tag in info.tags"
                :key="tag"
                variant="secondary"
                style="margin-left: 1px"
              >{{tag}}</b-badge>
              <i class="fa fa-pencil" style="cursor: pointer" @click="editTags()"></i>
            </div>
            <div v-if="tagger.mode === 'edit'">
              <vue-tags-input
                ref="editor"
                v-model="tagger.tag"
                :tags="tagger.tags"
                @tags-changed="newTags => tagger.tags = newTags"
              ></vue-tags-input>
              <i class="fa fa-check" style="cursor: pointer" aria-hidden="true" @click="saveTags()"></i>
              <i
                class="fa fa-times"
                style="cursor: pointer"
                @click="cancelEdit()"
                aria-hidden="true"
              ></i>
            </div>
          </card>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h5 class="title">Controls</h5>
            </template>
            <b-button
              :disabled="reconStarting || info.status === 1"
              variant="primary"
              @click="runReconAll()"
            >
              <b-spinner small v-if="reconStarting"></b-spinner>Run recon-all
            </b-button>
            <b-button
              variant="outline-primary"
              :disabled="true"
              style="margin-left: 1px"
            >Download results</b-button>
            <b-button
              variant="danger"
              style="margin-left: 1px"
            >Delete</b-button>
          </card>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h5 class="title">Progress</h5>
            </template>
            <b-progress height="2px" :value="progress"></b-progress>
          </card>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h5 class="title">Detailed info</h5>
            </template>

            <b-form-input
              size="sm"
              v-model="filter"
              type="search"
              id="filterInput"
              placeholder="Type to Filter by Step NAME or STATUS [1,2,3]"
            ></b-form-input>

            <b-table striped hover :items="steps" :fields="fields" :filter="filter">
              <template v-slot:cell(status)="data">
                <i v-if="data.item.status === 0" class="fa fa-minus-circle text-info"></i>
                <b-spinner v-if="data.item.status === 1" small variant="primary" label="Spinning"></b-spinner>
                <i v-if="data.item.status === 2" class="fa fa-check-circle text-success"></i>
                <i v-if="data.item.status === 3" class="fa fa-times-circle text-danger"></i>
              </template>
            </b-table>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueTagsInput from "@johmun/vue-tags-input";
import qs from "qs";

export default {
  components: {
    VueTagsInput
  },
  data() {
    return {
      tagger: {
        mode: "show",
        tags: [],
        oldTags: [],
        tag: ""
      },
      filter: null,
      steps: null,
      info: null,
      progress: 0,
      timer: "",
      reconStarting: false,
      fields: [
        { key: "name", label: "step" },
        { key: "status", lable: "status" }
      ]
    };
  },
  methods: {
    cancelEdit: function() {
      this.tagger.tags = this.tagger.oldTags;
      this.tagger.mode = "show";
    },
    saveTags: function() {
      var tagNames = [];
      this.tagger.tags.forEach(e => {
        tagNames.push(e.text);
      });
      this.$http({
        method: "put",
        url: process.env.VUE_APP_BACKEND_BASE + "/subject/v1/tags",
        params: {
          tags: tagNames,
          name: this.info.name
        },
        paramsSerializer: params => {
          return qs.stringify(params, { indices: false });
        }
      })
      .then(() => {
        this.tagger.oldTags = this.tagger.tags;
        this.info.tags = tagNames;
        this.tagger.mode = "show";
      });
    },
    editTags: function() {
      this.tagger.mode = "edit";
      this.$nextTick(() => {
        console.log(this.$refs.editor.$el.children[0].children[0].children[1].children[0])
        this.$refs.editor.$el.children[0].children[0].children[1].children[0].focus();
        });
    },
    fetchInfo: function() {
      this.$http({
        method: "get",
        url: process.env.VUE_APP_BACKEND_BASE + "/subject/v1/info",
        params: {
          name: this.$route.params.name
        }
      })
        .then(response => response.data)
        .then(data => {
          this.info = data;
          this.steps = data.steps;
          if (this.tagger.tags.length == 0 && this.tagger.mode == "show") {
            this.info.tags.forEach(element => {
              if (element != null) {
                this.tagger.tags.push({
                  text: element,
                  tiClasses: ["ti-valid"]
                });
              }
            });
            this.tagger.oldTags = this.tagger.tags;
          }
          this.progress = Math.round((data.progress / data.steps.length) * 100);
        });
    },
    runReconAll: function() {
      this.reconStarting = true;
      this.$http({
        method: "post",
        url: process.env.VUE_APP_BACKEND_BASE + "/container/v1/run",
        params: {
          subj: this.$route.params.name
        }
      })
        .then(() => {
          this.fetchInfo();
          Vue.toasted.show("Recon-all started").goAway(3000);
        })
        .finally(() => {
          this.reconStarting = false;
        });
    }
  },
  mounted() {
    this.fetchInfo();
    this.timer = window.setInterval(this.fetchInfo, 10000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>