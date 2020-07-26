<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <card>
            <div class="row">
              <div class="col-md-6">
                <base-input
                  type="text"
                  label="Name"
                  :disabled="true"
                  placeholder="Light dashboard"
                  v-model="userInfo.fullname"
                ></base-input>
              </div>
              <div class="col-md-6">
                <base-input
                  type="text"
                  label="login"
                  :disabled="true"
                  placeholder="Light dashboard"
                  v-model="userInfo.login"
                ></base-input>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <b-form-group size="sm" label="License" v-if="userInfo.license == null">
                  <b-form-file
                    v-model="license"
                    placeholder="Choose a *.txt license file or drop it here..."
                    drop-placeholder="Drop file here..."
                    accept=".txt"
                    label="License"
                    :state="false"
                  ></b-form-file>
                  <b-button @click="uploadLicense()">Upload</b-button>
                </b-form-group>
                <b-form-group size="sm" label="License" v-if="userInfo.license != null">
                  <i class="fa fa-check-circle text-success"></i>
                </b-form-group>
              </div>
            </div>
          </card>
          <!-- <edit-profile-form>
          </edit-profile-form>-->
        </div>
        <!-- <div class="col-md-4">
          <user-card>
          </user-card>
        </div>-->
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";

export default {
  data() {
    return {
      userInfo: "",
      license: null
    };
  },
  methods: {
    fetchUserInfo: function() {
      this.$http({
        method: "get",
        url: process.env.VUE_APP_BACKEND_BASE + "/user/v1/info"
      }).then(response => {
        this.userInfo = response.data;
      });
    },
    uploadLicense: function() {
      console.log(this.license);
      var bodyFormData = new FormData();
      bodyFormData.append("upload", this.license);
      this.$http({
        method: "post",
        url: process.env.VUE_APP_BACKEND_BASE+ "/user/v1/license",
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data; boundary=fuckit"
        }
      }).then(response => {
        console.log(response);
        Vue.toasted.show("License file was uploaded").goAway(3000);
        this.fetchUserInfo();
      });
    }
  },
  mounted: function() {
    this.fetchUserInfo();
  }
};
</script>
<style>
</style>
