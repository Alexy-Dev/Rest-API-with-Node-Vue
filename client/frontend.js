import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js';

Vue.component('loader', {
    template:`
   <div style="display: flex;justify-content: center;align-items: center">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    `
})

new Vue({
    el: '#app',  //указываем селектор по которому можно получить данный эллемент
    data() {
      return{
        loading: false,
        form: {
            name: '',
            value: ''
        },
        contacts: [
            // {id: 1, name: 'Alex', value: '+38-050-355-92-35', marked:false} - значение по умолчанию хранится на сервере
        ]
      }
    },
    computed: {
        canCreate() {
            return this.form.value.trim() && this.form.name.trim()
        }
    },
    methods: {
        async createContact() {
            const {...contact} = this.form

            const newContact = await request('/api/contacts', 'POST', contact)
            
            this.contacts.push(newContact)

            this.form.name = this.form.value = ''    //очистить форму после отправки
        },
        async markContact(id) {
            const contact = this.contacts.find(c => c.id === id)
            const updated = await request(`/api/contacts/${id}`, 'PUT', {
                ...contact,
                marked: true
            }) 
            contact.marked = updated.marked    //синхронизируем frontend/backend

        },
        async removeContact(id) {
            await request(`/api/contacts/${id}`, 'DELETE')          //получаем подтверждение с сервера
            this.contacts = this.contacts.filter(c => c.id !== id)

        }
    },
    async mounted () {                    //асинхронный метод, вызывается когда компонент готов
        this.loading = true
        this.contacts = await request('/api/contacts')
        this.loading = false        
    }
})
async function request(url, method = 'GET', data = null) {
    try {
        const headers = {}
        let body

        if (data) {
            headers['Content-Type'] = 'application/json'
            body = JSON.stringify(data)
        }
        const response = await fetch(url, {  //подождем пока компонент будет создан
            method,
            headers,
            body
        })
        return await response.json()   //вернем компонент
    } catch (e) {
     console.warn('Error:', e.message)

    }
}