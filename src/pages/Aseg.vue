<template>
  <div class="content">
    <div class="container-fluid">

      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h5 class="title">Aseg to table</h5>
            </template>

            <b-form-input
              size="sm"
              id="filterInput"
              placeholder="Enter tag name to filter by"
            ></b-form-input>

            <b-button @click="preview()">Preview aseg2table</b-button>

            <b-table striped hover :items="aseginfo" style="display: block; overflow-x: auto">
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
      aseginfo: ""
    };
  },
  methods: {
    preview: function() {
      this.$http({
        method: "get",
        url: process.env.VUE_APP_BACKEND_BASE + "/container/v1/download/aseg2table/preview",
        params: {
          tag: "cloudsurfer"
        }
      })
      .then((response) => {
        console.log(response.data)
        this.aseginfo = response.data.stats;
      });
    }
  }
};
</script>