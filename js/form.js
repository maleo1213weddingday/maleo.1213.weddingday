new Vue({
    el: '#app',
    data() {
        return {
            isSubmitting: false,
            form: {
                name: '',
                phone: '',
                relation: '',
                attend: '',
                adults: '',
                children: '',
                childSeat: '',
                vegetarian: '',
                needCard: '',
                address: '',
                message: ''
            },
            errors: {}
        }
    },
    watch: {
        // 👇 如果改成「不出席」，自動清空人數資料
        'form.attend'(val) {
            if (val !== '可以參加' || form.attend !== '我一定會參加，但是我不確定要攜幾個伴 或是隱+3 ，所以我先填表 (+80分)' || form.attend !== '我原本有事....但為了這個婚禮，決定排除萬難決定參加了！！ (+120分)') {
                this.form.adults = '';
                this.form.children = '';
                this.form.childSeat = '';
                this.form.vegetarian = '';
            }
        },
        // 👇 新增這個
        'form.needCard'(val) {
            if (val !== '我需要紙本喜帖收藏一輩子！') {
                this.form.address = '';
            }
        },

        'form.name'(val) {
            this.errors.name = val ? '' : '• 請輸入姓名'
        },

        'form.relation'(val) {
            this.errors.relation = val ? '' : '• 請選擇與新人的關係'
        },

        'form.attend'(val) {

            this.errors.attend = val ? '' : '• 請選擇是否出席'

            if (!this.needAttendanceFields) {

                this.form.adults = ''
                this.form.children = ''
                this.form.childSeat = ''
                this.form.vegetarian = ''

                this.errors.adults = ''
                this.errors.children = ''
                this.errors.childSeat = ''
                this.errors.vegetarian = ''
            }
        },
        'form.adults'(val) {
            if (this.needAttendanceFields) {
                this.errors.adults = val ? '' : '• 請選擇出席的成人人數'
            }
        },

        'form.children'(val) {
            if (this.needAttendanceFields) {
                this.errors.children = val ? '' : '• 請選擇出席的兒童人數'
            }
        },

        'form.childSeat'(val) {
            if (this.needAttendanceFields) {
                this.errors.childSeat = val ? '' : '• 請選擇兒童椅'
            }
        },

        'form.vegetarian'(val) {
            if (this.needAttendanceFields) {
                this.errors.vegetarian = val ? '' : '• 請選擇素食'
            }
        },

    },
    computed: {
        needAttendanceFields() {
            return [
                '可以參加',
                '我一定會參加，但是我不確定要攜幾個伴 或是隱+3 ，所以我先填表 (+80分)',
                '我原本有事....但為了這個婚禮，決定排除萬難決定參加了！！ (+120分)'
            ].includes(this.form.attend)
        }
    },
    methods: {
        clearError(field) {
            this.errors[field] = ''
        },
        validateForm() {
            this.errors = {}

            if (!this.form.name) {
                this.errors.name = '• 請輸入姓名'
            }

            if (!this.form.relation) {
                this.errors.relation = '• 請選擇與新人的關係'
            }

            if (!this.form.attend) {
                this.errors.attend = '• 請選擇是否出席'
            }

            if (this.needAttendanceFields && !this.form.adults) {
                this.errors.adults = '• 請選擇出席的成人人數'
            }

            if (this.needAttendanceFields && !this.form.children) {
                this.errors.children = '• 請選擇出席的兒童人數'
            }

            if (this.needAttendanceFields && !this.form.childSeat) {
                this.errors.childSeat = '• 請選擇兒童椅'
            }

            if (this.needAttendanceFields && !this.form.vegetarian) {
                this.errors.vegetarian = '• 請選擇素食'
            }
            return Object.keys(this.errors).length === 0
        },
        submitForm() {
            if (!this.validateForm()) {
                this.$nextTick(() => {
                    const el = document.querySelector('.is-invalid')
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                })
                return
            }
            // if (this.isSubmitting) return;

            this.isSubmitting = true;

            const url = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSe8JBDp3w3mpUkgKLiroimht5Wh9EwCHqEItagSg___dB1wMg/formResponse';
            const data = new URLSearchParams();

            data.append('entry.1762393778', this.form.name);
            data.append('entry.394096408', this.form.phone);
            data.append('entry.860678026', this.form.relation);
            data.append('entry.322896695', this.form.attend);
            data.append('entry.494800778', this.form.adults);
            data.append('entry.1261669332', this.form.children);
            data.append('entry.1447994629', this.form.childSeat);
            data.append('entry.1843907932', this.form.vegetarian);
            data.append('entry.178777539', this.form.needCard);  // 是否需要實體喜帖
            data.append('entry.460748155', this.form.address);
            data.append('entry.1177404314', this.form.message);

            axios.post(url, data)
                .then(this.successHandler)
                .catch(this.successHandler);


        },
        successHandler() {
            swal({
                title: "♥ 送出成功 ♥",
                text: "我們已收到您的回覆，期待相見！",
                icon: "success",
                buttons: false,   // 不顯示按鈕
                closeOnEsc: false,
                closeOnClickOutside: false
            });
            setTimeout(() => {
                swal.close();
                location.reload();
            }, 2000);
            // 若你想送出後清空表單
            this.form = {
                name: '',
                phone: '',
                relation: '',
                attend: '',
                adults: '',
                children: '',
                childSeat: '',
                vegetarian: '',
                needCard: '',
                address: '',
                message: ''
            };
            this.errors = {
                name: '',
                phone: '',
                relation: '',
                attend: '',
                adults: '',
                children: '',
                childSeat: '',
                vegetarian: '',
                needCard: '',
                address: '',
                message: ''
            };

        }
    }
});
