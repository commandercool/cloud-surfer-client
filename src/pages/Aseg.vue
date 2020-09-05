<template>
  <div class="content">
    <div class="container-fluid">

      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h5 class="title">Aseg to table</h5>
            </template>

            <autocomplete
              :search="search"
              placeholder="Specify the tag to filter by"
              aria-label="Specify the tag to filter by"
              @submit="submit">
            </autocomplete>


            <b-button @click="preview()">Preview</b-button>
            <b-button style="margin-left: 2px" @click="download()">
              Download .txt
            </b-button>
            <b-button style="margin-left: 2px" @click="downloadXls()">
              Download .xls
            </b-button>

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
      env: {
        base: process.env.VUE_APP_BACKEND_BASE
      },
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
    },
    download: function() {
      this.$http({
        method: "get",
        url: process.env.VUE_APP_BACKEND_BASE + "/container/v1/download/aseg2table",
        responseType: 'blob',
        params: {
          tag: this.tag
        }
      })
      .then((response) => {
        const blob = new Blob([response.data], { type: 'text/plain' })
        const link = document.createElement('a')
        link.setAttribute('download', this.tag)
        link.href = URL.createObjectURL(blob)
        link.click()
        URL.revokeObjectURL(link.href)
      });
    },
    downloadXls: function() {
      this.$http({
        method: "get",
        url: process.env.VUE_APP_BACKEND_BASE + "/container/v1/download/aseg2table/xls",
        responseType: 'blob',
        params: {
          tag: this.tag
        }
      })
      .then((response) => {
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const link = document.createElement('a')
        link.setAttribute('download', this.tag)
        link.href = URL.createObjectURL(blob)
        link.click()
        URL.revokeObjectURL(link.href)
      });
    }
  }
};
</script>