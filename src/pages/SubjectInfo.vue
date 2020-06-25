<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h3 class="title">Subject info: {{info.name}}</h3>
            </template>
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

export default {
  data() {
    return {
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
    fetchInfo: function() {
      this.$http({
        method: "get",
        url: "http://localhost:8080/subject/v1/info",
        params: {
          name: this.$route.params.name
        }
      })
        .then(response => response.data)
        .then(data => {
          this.info = data;
          this.steps = data.steps;
          this.progress = Math.round((data.progress / data.steps.length) * 100);
        });
    },
    runReconAll: function() {
      this.reconStarting = true;
      this.$http({
        method: "post",
        url: "http://localhost:8080/container/v1/run",
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