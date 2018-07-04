<template>
    <div class="register">
        <div class="container">
            <Register/>
        </div>
        
    </div>
    
</template>

<script>
import Register from '../components/Register.vue'

export default {
    name:"register",
    components:{
        Register   
    }
}
</script>

<style scoped>
.register {
    background-image: url("http://www.dream-wallpaper.com/free-wallpaper/art-wallpaper/minimalist-design-1-wallpaper/1920x1200/free-wallpaper-23.jpg");
    background-size: cover
}


</style>
