const exp = require('constants');
const express = require('express');      //подключаем express
const path = require('path');
const {v4} = require('uuid')
const app = express();                   //создаем объект приложения

let CONTACTS = [
    {id: v4(), name: 'Alexy', value: '+38-050-355-92-35', marked:false}
]
app.use(express.json())  //midlewear для работы с json request

//GET
app.get('/api/contacts', (req, res) => {
    res.status(200).json(CONTACTS)          //создаем первое соединение между клиентом и сервером
})

//POST
app.post('/api/contacts', (req, res) => {
    const contact = {...req.body, id: v4(), marked: false}  //в более серьезных приложениях надо добавить еще и серверную валидацию
    CONTACTS.push(contact)  //добавляем в базу
    res.status(201).json(contact);          //передаем первую инфо от клиента на сервер (статус 201 - эллемент создан)
})

//DELETE
app.delete('/api/contacts/:id', (req, res) => {
    CONTACTS = CONTACTS.filter(c => c.id !== req.params.id);  //удаляем из базы
    res.status(200).json({message: 'Contact was delete'})          //передаем инфо от сервера на клиент (статус 500 - ошибка сервера)
})

//PUT
app.put('/api/contacts/:id', (req, res) => {
    const idx = CONTACTS.findIndex(c => c.id === req.params.id);  //изменяем данную запись под id
    CONTACTS[idx] = req.body          //изменяем данную запись под id в базе
    res.json(CONTACTS[idx])    
})

app.use(express.static(path.resolve(__dirname, 'client'))); //указываем статический путь к клиенту

app.get('*', (req, res) => {                                    //express будет смотреть за любыми get запросами
    res.sendFile(path.resolve(__dirname, 'client', 'index.html')); //выполняем эту функцию, которая показывает путь к html
});

app.listen(3000, () => console.log('Server has been started on port 3000...'));     //запускаем сермер