<template>
    <div class="login">
        <div class="container">
            <Login/>
        </div>
        
    </div>
    
</template>

<script>
import Login from '../components/Login.vue'

export default {
    name:"login",
    components:{
        Login   
    }
}
</script>

<style scoped>
.login {
    background-image: url("http://www.dream-wallpaper.com/free-wallpaper/art-wallpaper/minimalist-design-1-wallpaper/1920x1200/free-wallpaper-23.jpg");
    background-size: cover
}


</style>
