import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';

const url = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'vue-hexschool-product-list';

let productModal = null;
let delProductModal = null;

// 可以新增、編輯、刪除商品
// 商品啟用、關閉可以使用不同的顏色標示

// 1. 建立元件
// 2. 生成 vue 元件
// 3. 渲染至畫面上
const app = {
    data() {
        return {
            products: [],
            operateType: '',
            tempProduct: {
                imagesUrl: []
            },
            pagination: {},
            pageNum: 1,
        }
    },
    methods: {
        checkLogin() {
            axios.post(`${url}/api/user/check`)
            .then(res => {
                // 驗證成功
                this.getProducts();
            })
            .catch(err => {
                alert(err.data.message);
                window.location = 'index.html';
            });
        },

        getProducts() {
            axios.get(`${url}/api/${apiPath}/admin/products?page=${this.pageNum}`)
            .then(res => {
                this.products = res.data.products;
                this.pagination = res.data.pagination;
            })
            .catch(err => {
                alert(err.data.message);
            })
        },

        openModal(operateType, product) {
            this.operateType = operateType;
            if(operateType === 'create') {
                this.tempProduct = {
                    imagesUrl: []
                }
                productModal.show();
            } else if(operateType === 'modify') {
                this.tempProduct = {
                    ...product
                }
                productModal.show();
            } else if(operateType === 'delete') {
                this.tempProduct = {
                    ...product
                }
                delProductModal.show();
            }
        },

        // 新增圖片
        createImagesUrl() {
            if(!this.tempProduct.imagesUrl) {
                this.tempProduct.imagesUrl = [];
            }
            this.tempProduct.imagesUrl.push('');
        },

        // 刪除圖片
        deleteImagesUrl() {
            this.tempProduct.imagesUrl.pop();
        },

        // 新增 & 修改 產品
        saveProduct() {
            if(this.operateType === 'create') {
                axios.post(`${url}/api/${apiPath}/admin/product`,{ data: this.tempProduct })
                .then(res => {
                    alert(res.data.message);
                    productModal.hide();
                    this.getProducts();
                })
                .catch(err => {
                    alert(err.data.message);
                });
            } else if(this.operateType === 'modify') {
                axios.put(`${url}/api/${apiPath}/admin/product/${this.tempProduct.id}`,{ data: this.tempProduct })
                .then(res => {
                    alert(res.data.message);
                    productModal.hide();
                    this.getProducts();
                })
                .catch(err => {
                    alert(err.data.message);
                });
            }
        },

        // 刪除商品
        deleteProduct() {
            axios.delete(`${url}/api/${apiPath}/admin/product/${this.tempProduct.id}`,{ data: this.tempProduct })
            .then(res => {
                alert(res.data.message);
                delProductModal.hide();
                this.getProducts();
            })
            .catch(err => {
                alert(err.data.message);
            });
        }
    },
    mounted() {
        // 取出 cookie 的 token
        const token =  document.cookie.replace(/(?:(?:^|.*;\s*)w3-token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // 加入 header
        axios.defaults.headers.common['Authorization'] = token;
        this.checkLogin();

        // dom 生成後，再取得 model
        productModal = new bootstrap.Modal(document.getElementById('productModal'), { keyboard: false });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), { keyboard: false });
    },
    watch: {
        pageNum() {
            this.getProducts();
        }
    }

}

createApp(app).mount('#app');