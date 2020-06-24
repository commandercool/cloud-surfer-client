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
            <b-button variant="primary" @click="runReconAll()">Run recon-all</b-button>
            <b-button variant="outline-primary" :disabled="true" style="margin-left: 1px">Download results</b-button>
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
            <b-table striped hover :items="info.steps" :fields="fields">
              <template v-slot:cell(status)="data">
                <i v-if="data.item.status === 0" class="fa fa-minus-circle text-info"></i>
                <i v-if="data.item.status === 1" class="fa fa-refresh text-primary"></i>
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
export default {
  data() {
    return {
      info: "",
      progress: 0,
      timer: "",
      fields: [
        { key: "name", label: "step" },
        { key: "status", lable: "status" }
      ]
    };
  },
  methods: {
    fetchInfo: function() {
      console.log(this.$keycloak.token);
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
          this.progress = Math.round((data.progress / data.steps.length) * 100);
        });
    },
    runReconAll: function() {
      this.$http({
        method: "post",
        url: "http://localhost:8080/container/v1/run?subj",
        params: {
          subj: this.$route.params.name
        }
      }).then(() => {
        // Vue.$toast.info("Started recon-all");
        this.fetchInfo();
      });
      // .catch(error => {
      // Vue.$toast.error("Error fetching subjects: " + error);
      // });
    }
  },
  mounted() {
    this.fetchInfo();
    // this.timer = window.setInterval(this.fetchInfo, 10000);
  }
};
</script>