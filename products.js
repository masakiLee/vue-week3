import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js";

//先把兩個modal元素抓出來
let productModal = null;
let delProductModal = null;

const App = {
  data() {
    return {
      url: "https://vue3-course-api.hexschool.io/v2/",
      path: "masaki",
      products: [],
      isNew: false, // 依據點擊開的按鈕不同顯示不同的標題
      // 先預設 product 沒有照片 等同於 新增商品跳出視窗
      tempProduct: {
        imagesUrl: [],
      },
    };
  },
  methods: {
    checkLogin() {
      axios
        .post(`${this.url}api/user/check`)
        .then((res) => {
          this.getProducts();
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
    getProducts() {
      axios
        .get(`${this.url}api/${this.path}/admin/products/all`)
        .then((res) => {
          // console.log(res.data.products);
          this.products = res.data.products;
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
    openModal(isNew, item) {
      if (isNew === "new") {
        // 新增商品時旁邊不能有照片
        this.tempProduct = {
          imagesUrl: [],
        };
        //因點擊的是新增商品所以 需要顯示新增商品
        this.isNew = true;
        productModal.show();
      } else if (isNew === "edit") {
        // 修改商品時帶出點擊中的item 用淺複製不然會改變原始資料
        this.tempProduct = { ...item };
        //因點擊的是編輯商品所以 需要顯示編輯商品
        this.isNew = false;
        productModal.show();
      } else if (isNew === "delete") {
        // 刪除商品時帶出點擊中的item 用淺複製不然會改變原始資料
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },
    updateProduct() {
      //先預設為新增商品
      let url = `${this.url}/api/${this.path}/admin/product`;
      let http = "post";
      //如果是修改則更改url & http
      if (!this.isNew) {
        url = `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`;
        http = "put";
      }
      // 帶入不同的api
      axios[http](url, { data: this.tempProduct })
        .then((response) => {
          alert(response.data.message);
          productModal.hide();
          this.getProducts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    delProduct() {
      axios
        .delete(
          `${this.url}api/${this.path}/admin/product/${this.tempProduct.id}`
        )
        .then((response) => {
          alert(response.data.message);
          // 關閉跳出視窗
          delProductModal.hide();
          // 重新抓取getProducts
          this.getProducts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    //新增圖片
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
  },
  mounted() {
    // 首先要先取得 modal 元素 再用bs實體方式
    productModal = new bootstrap.Modal(
      document.getElementById("productModal"),
      //options 不能使用 esc 關閉
      {
        keyboard: false,
      }
    );

    delProductModal = new bootstrap.Modal(
      document.getElementById("delProductModal"),
      //options 不能使用 esc 關閉
      {
        keyboard: false,
      }
    );
    // 取出 Token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)loginToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    // defaults 每次都會帶入
    axios.defaults.headers.common.Authorization = token;
    this.checkLogin();
  },
};

createApp(App).mount("#app");
