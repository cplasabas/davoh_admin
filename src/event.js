export default [
  {
    name: 'APP_LOGIN_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'Login successfully.'
      };
      this.$router.push({ path: 'dashboard' });
    }
  },
  {
    name: 'APP_LOGOUT',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'Logout successfully.'
      };
      this.$router.replace({ path: '/' });
    }
  },
  {
    name: 'APP_PAGE_LOADED',
    callback: function (e) {
    }
  },
  {
    name: 'APP_AUTH_FAILED',
    callback: function (e) {
      this.$router.push('/');
      this.$message.error('Token has expired');
    }
  },
  {
    name: 'APP_BAD_REQUEST',
    // @error api response data
    callback: function (msg) {
      this.$message.error(msg);
    }
  },
  {
    name: 'APP_ACCESS_DENIED',
    // @error api response data
    callback: function (msg) {
      this.$message.error(msg);
      this.$router.push('/forbidden');
    }
  },
  {
    name: 'APP_RESOURCE_DELETED',
    // @error api response data
    callback: function (msg) {
      this.$message.success(msg);
    }
  },
  {
    name: 'APP_RESOURCE_UPDATED',
    // @error api response data
    callback: function (msg) {
      this.$message.success(msg);
    }
  },
  {
    name: 'PRODUCT_ADDED_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'Product added successfully.'
      };
    }
  },
  {
    name: 'PRODUCT_ADDED_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'Product add fail.'
      };
    }
  },
  {
    name: 'PRODUCT_DELETED_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'Product delete successfully.'
      };
    }
  },
  {
    name: 'PRODUCT_DELETED_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'Product delete fail.'
      };
    }
  },
  {
    name: 'CATEGORY_ADDED_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'category added successfully.'
      };
    }
  },
  {
    name: 'CATEGORY_ADDED_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'category add fail.'
      };
    }
  },
  {
    name: 'CATEGORY_DELETED_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'category delete successfully.'
      };
    }
  },
  {
    name: 'CATEGORY_DELETED_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'category delete fail.'
      };
    }
  },
  {
    name: 'USER_ADDED_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'user added successfully.'
      };
    }
  },
  {
    name: 'USER_ADDED_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'user add fail.'
      };
    }
  },
  {
    name: 'USER_DELETED_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'user delete successfully.'
      };
    }
  },
  {
    name: 'USER_DELETED_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'user delete fail.'
      };
    }
  }
];
