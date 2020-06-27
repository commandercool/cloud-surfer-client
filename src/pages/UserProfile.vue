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
                    v-model="file"
                    placeholder="Choose a *.txt license file or drop it here..."
                    drop-placeholder="Drop file here..."
                    accept=".txt"
                    label="License"
                    :state="false"
                  ></b-form-file>
                  <b-button @click="uploadSubject()">Upload</b-button>
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
export default {
  data() {
    return {
      userInfo: ""
    };
  },
  methods: {
    fetchUserInfo: function() {
      this.$http({
        method: "get",
        url: "http://localhost:8080/user/v1/info"
      }).then(response => {
        this.userInfo = response.data;
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
