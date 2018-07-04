<template>
    <div>
        <Navbar/>
        <Todo/>
    </div>
    
</template>


<script>
import Navbar from '../components/Navbar.vue'
import Todo from '../components/Todo.vue'

export default {
    name:"todo",
    components: {
        Navbar,
        Todo
    }
}
</script>

