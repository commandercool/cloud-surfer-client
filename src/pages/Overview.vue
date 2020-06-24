<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-warning">
              <i class="fa fa-book text-warning"></i>
            </div>
            <div slot="content">
              <p class="card-category">Subjects</p>
              <h4 class="card-title">{{subjects.length}}</h4>
            </div>
            <!-- <div slot="footer">
              <i class="fa fa-signal"></i>Limit of 50
            </div>-->
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-success">
              <i class="fa fa-check-circle text-success"></i>
            </div>
            <div slot="content">
              <p class="card-category">Success</p>
              <h4 class="card-title">{{subjects.filter(s => s.status == 2).length}}</h4>
            </div>
            <!-- <div slot="footer">
              <i class="fa fa-calendar-o"></i>Last day
            </div>-->
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-danger">
              <i class="fa fa-times-circle text-danger"></i>
            </div>
            <div slot="content">
              <p class="card-category">Error</p>
              <h4 class="card-title">{{subjects.filter(s => s.status == 3).length}}</h4>
            </div>
            <!-- <div slot="footer">
              <i class="fa fa-clock-o"></i>Last day
            </div>-->
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-info">
              <i class="fa fa-refresh text-primary"></i>
            </div>
            <div slot="content">
              <p class="card-category">In progress</p>
              <h4 class="card-title">{{subjects.filter(s => s.status == 1).length}}</h4>
            </div>
            <!-- <div slot="footer">
              <i class="fa fa-refresh"></i>Updated now
            </div>-->
          </stats-card>
        </div>
      </div>

      <div class="row">
        <div class="col-md">
          <card>
            <template slot="header">
              <h5 class="title">Upload subject</h5>
              <!-- <p class="category">Active subjects for the current research</p> -->
            </template>
            <b-form-group size="sm">
              <b-form-file
                v-model="file"
                placeholder="Choose a *.nii file or drop it here..."
                drop-placeholder="Drop file here..."
                accept=".nii"
              ></b-form-file>
              <b-button @click="uploadSubject()">Upload</b-button>
            </b-form-group>
          </card>
        </div>
      </div>

      <div class="row">
        <div class="col-md">
          <card>
            <template slot="header">
              <h5 class="title">Subjects</h5>
              <p class="category">Active subjects for the current research</p>
            </template>

            <b-form-input
              size="sm"
              v-model="filter.name"
              type="search"
              id="filterInput"
              placeholder="Type to Filter by NAME, TAG or STATUS [1,2,3]"
            ></b-form-input>

            <div>
              <b-table :filter="filter.name" striped hover :items="subjects" :fields="fields">
                <template v-slot:cell(name)="data">
                  <router-link :to="{path:'/admin/info/' + data.item.name}">{{data.item.name}}</router-link>
                </template>

                <template v-slot:cell(tags)="data">
                  <b-badge
                    v-for="tag in data.item.tags"
                    :key="tag"
                    variant="secondary"
                    style="margin-left: 1px"
                  >{{tag}}</b-badge>
                </template>

                <template v-slot:cell(status)="data">
                  <i v-if="data.item.status === 1" class="fa fa-refresh text-primary"></i>
                  <i v-if="data.item.status === 2" class="fa fa-check-circle text-success"></i>
                  <i v-if="data.item.status === 3" class="fa fa-times-circle text-danger"></i>
                </template>
              </b-table>
            </div>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import ChartCard from "src/components/Cards/ChartCard.vue";
import StatsCard from "src/components/Cards/StatsCard.vue";
import Vue from "vue";
// import LTable from "src/components/Table.vue";

export default {
  components: {
    // LTable,
    // ChartCard,
    StatsCard
  },
  data() {
    return {
      subjects: [],
      fields: [
        { key: "name", label: "subject" },
        { key: "tags", label: "tags" },
        { key: "status", lable: "status" }
      ],
      progress: 50,
      filter: {
        name: null
      },
      file: null
    };
  },
  methods: {
    loadSubjects: function() {
      this.isLoading = true;
      this.$http
        .get("http://localhost:8080/mri/v1/subjects")
        .then(response => response.data)
        .then(data => {
          this.subjects = data.subjects;
        })
        .then(() => {
          this.isLoading = false;
        });
    },
    uploadSubject: function() {
      console.log(this.file);
      var bodyFormData = new FormData();
      bodyFormData.append("upload", this.file);
      this.$http({
        method: "post",
        url: "http://localhost:8080/mri/v1/upload",
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data; boundary=fuckit"
        },
        params: {
          src: this.file.name,
          subj: this.file.name
        }
      }).then(response => {
        console.log(response);
        Vue.toasted.show("New subject was uploaded").goAway(3000);
        this.loadSubjects();
      });
    }
  },
  mounted() {
    this.loadSubjects();
  }
};
</script>