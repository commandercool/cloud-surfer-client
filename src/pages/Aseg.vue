<template>
  <div class="content">
    <div class="container-fluid">

      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h5 class="title">Aseg to table</h5>
            </template>

            <!-- <b-form-input
              size="sm"
              v-model="tag"
              id="filterInput"
              placeholder="Enter tag name to filter by"
            ></b-form-input> -->
            <autocomplete
              :search="search"
              placeholder="Specify the tag to filter by"
              aria-label="Specify the tag to filter by"
              @submit="submit"
            ></autocomplete>


            <b-button @click="preview()">Preview</b-button>

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
import Autocomplete from '@trevoreyre/autocomplete-vue'
import qs from "qs";

export default {
  components: {
    VueTagsInput,
    Autocomplete
  },
  data() {
    return {
      aseginfo: [],
      tag: "",
    };
  },
  methods: {
    search: function(input){
      return new Promise(resolve => {
        this.$http({
        method: "get",
        url: process.env.VUE_APP_BACKEND_BASE + "/subject/v1/tags",
      })
      .then((response) => {
        console.log(response.data);
        resolve(response.data.filter(tag => {
          return tag.toLowerCase().startsWith(input.toLowerCase())
        }));
      });
      })
    },
    submit: function(result) {
      console.log(result);
      this.tag = result;
    },
    preview: function() {
      this.$http({
        method: "get",
        url: process.env.VUE_APP_BACKEND_BASE + "/container/v1/download/aseg2table/preview",
        params: {
          tag: this.tag
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