import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './views/Login.vue'
import Todo from './views/Todo.vue'
import Register from './views/Register.vue'



Vue.use(VueRouter)

export default 
    new VueRouter({
        routes: [
            {
                name:"login",
                path:'/',
                component:Login 
            },
            {
                name:"register",
                path:'/register',
                component:Register
            },
            {
                name:"todo",
                path:'/todo', 
                component: Todo
            },
            
        ],
        mode:"history"
    })



