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
    name: 'PRODUCT_UPDATE_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'Product update successfully.'
      };
    }
  },
  {
    name: 'PRODUCT_UPDATE_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'Product update fail.'
      };
    }
  }, 
  {
    name: 'IMAGE_ADDED_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'Image added successfully.'
      };
    }
  },
  {
    name: 'IMAGE_ADDED_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'Image add fail.'
      };
    }
  },
  {
    name: 'IMAGE_DELETED_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'Image delete successfully.'
      };
    }
  },
  {
    name: 'IMAGE_DELETED_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'Image delete fail.'
      };
    }
  },
  {
    name: 'EXPENSE_ADDED_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'Expense added successfully.'
      };
    }
  },
  {
    name: 'EXPENSE_ADDED_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'Expense add fail.'
      };
    }
  },
  {
    name: 'EXPENSE_DELETED_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'Expense delete successfully.'
      };
    }
  },
  {
    name: 'EXPENSE_DELETED_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'Expense delete fail.'
      };
    }
  },
  {
    name: 'EXPENSE_EDIT_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'Expense edited successfully.'
      };
    }
  },
  {
    name: 'EXPENSE_EDIT_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'Expense edited fail.'
      };
    }
  },
  {
    name: 'CATEGORY_ADDED_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'Category added successfully.'
      };
    }
  },
  {
    name: 'CATEGORY_ADDED_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'Category add fail.'
      };
    }
  },
  {
    name: 'CATEGORY_DELETED_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'Category delete successfully.'
      };
    }
  },
  {
    name: 'CATEGORY_DELETED_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'Category delete fail.'
      };
    }
  },
  {
    name: 'CATEGORY_EDIT_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'Category edit successfully.'
      };
    }
  },
  {
    name: 'CATEGORY_EDIT_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'Category edit fail.'
      };
    }
  },
  {
    name: 'TERM_ADDED_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'Term added successfully.'
      };
    }
  },
  {
    name: 'TERM_ADDED_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'Term add fail.'
      };
    }
  },
  {
    name: 'TERM_DELETED_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'Term delete successfully.'
      };
    }
  },
  {
    name: 'TERM_DELETED_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'Term delete fail.'
      };
    }
  },
  {
    name: 'TERM_EDIT_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'Term edited successfully.'
      };
    }
  },
  {
    name: 'TERM_EDIT_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'Term edited fail.'
      };
    }
  },
  {
    name: 'USER_ADDED_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'User added successfully.'
      };
    }
  },
  {
    name: 'USER_ADDED_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'User add fail.'
      };
    }
  },
  {
    name: 'USER_DELETED_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'User delete successfully.'
      };
    }
  },
  {
    name: 'USER_DELETED_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'User delete fail.'
      };
    }
  },
  {
    name: 'USER_EDIT_SUCCESS',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'green',
        text: 'User edit successfully.'
      };
    }
  },
  {
    name: 'USER_EDIT_FAIL',
    callback: function (e) {
      this.snackbar = {
        show: true,
        color: 'red',
        text: 'User edit fail.'
      };
    }
  }
];
