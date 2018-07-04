<template>
        <div id="login-page" class="row" >
            <div class="row"></div>
            <div class="row"></div>
            <div class="col s4"></div>
            <div class="col s4 z-depth-4 card-panel">
                <form class="login-form">
                    <div class="row">
                        <div class="input-field col s12 center">
                            <img src="" alt="" class="circle responsive-img valign profile-image-login">
                            <p class="center login-form-text">TODO FANCY</p>
                        </div>
                    </div>
                    <div class="row margin">
                        <div class="input-field col s12">
                            <i class="material-icons prefix">email</i>
                            <input id="email" type="text" v-model="email" name="email" v-validate="'required|email'">
                            <span class="helper-text">{{errors.first('email')}}</span>
                            <label for="email" class="center-align">Email</label>
                        </div>
                    </div>
                    <div class="row margin">
                        <div class="input-field col s12">
                            <i class="material-icons prefix">lock</i>
                            <input id="password" type="password" v-model="password" name="password" v-validate="'required|alpha_num'">
                            <span class="helper-text">{{errors.first('password')}}</span>
                            <label for="password">Password</label>
                        </div>
                    </div>
                
                </form>
                <div class="row">
                    <div class="col s12">
                        <button id="loginButton" class="btn waves-effect waves-light col s12" v-on:click="signIn()">Login</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12">
                        <button id="fbLoginButton" class="loginBtn loginBtn--facebook col s12" v-on:click="signInFb()">Login with Facebook</button>
                    </div>
                    
                </div>
                <div class="row">
                    <div class="input-field col s6 offset-s4">
                        <p class="margin medium-small"><a href v-on:click="registerLink()">Register Now!</a></p>
                    </div>
                             
                </div>
                
            </div>
            

            <div class="row"></div>
            <div class="row"></div>
        </div>

</template>

<script>
import axios from "axios"

export default {
    data() {
        return {
            email:"",
            password:""
        }
        
    },
    created: function() {
        if(localStorage.hasOwnProperty("token")) {
            this.$router.push("todo")
        }else{
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

            window.fbAsyncInit = function() {
                console.log("msk")
                
                FB.init({
                appId      : '262897097612945',
                cookie     : true,                       
                xfbml      : true,  
                version    : 'v2.8' 
                });
            };
        }
        

    },
    methods:{

        signIn() {
            this.$validator.validate().then(result=>{
                if(!result) {
                    swal(
                        'Warning!',
                        'Please fill the required field!',
                        'warning'
                    )
                }else{
                    axios.post('http://localhost:3000/users/signin',{
                        email:this.email,
                        password:this.password
                    })
                    .then(({data})=>{
                        console.log("masuk2")
                        if(data) {

                            localStorage.setItem("token",data.token)
                            this.$router.push("todo")
                        }
                        console.log(data,"masuk");
                    })
                    .catch(err=>{
                        console.log("error")
                        console.log(err.response.data)
                    })
                }
            })
            
        },
        signInFb() {
            console.log("maskk")
            let self= this                      
           FB.login(function(response) {
               if(response.status === "connected") {
                   FB.api('/me',{fields:["email","first_name"]},function(dataUser) {
                       console.log(dataUser)
                       axios({
                           method:"post",
                           url:'http://localhost:3000/users/signin',
                           data: {
                               email: dataUser.email,
                               username: dataUser.first_name,
                               userId: dataUser.id
                           }
                       })
                       .then(({data})=>{
                           localStorage.setItem("token",data.token)
                            self.$router.push("todo")
                       })
                   })
               }
            })
        },
        registerLink() {
            this.$router.push("register")
        }

        
    }    



}


</script>



<style scoped>

#loginButton {
    background-color:#e57373
}

.helper-text {
    color:red
}
/* =============facebook login button ===============*/
.loginBtn {
  box-sizing: border-box;
  position: relative;
  /* width: 13em;  - apply for fixed size */
  margin: 0.2em;
  padding: 0 15px 0 76px;
  border: none;
  text-align: left;
  line-height: 34px;
  white-space: nowrap;
  border-radius: 0.2em;
  font-size: 16px;
  color: #FFF;
}

.loginBtn:before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 34px;
  height: 100%;
}

.loginBtn:focus {
  outline: none;
}
.loginBtn:active {
  box-shadow: inset 0 0 0 32px rgba(0,0,0,0.1);
}
.loginBtn--facebook {
  background-color: #4C69BA;
  background-image: linear-gradient(#4C69BA, #3B55A0);
  /*font-family: "Helvetica neue", Helvetica Neue, Helvetica, Arial, sans-serif;*/
  text-shadow: 0 -1px 0 #354C8C;
}
.loginBtn--facebook:before {
  border-right: #364e92 1px solid;
  background: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/14082/icon_facebook.png') 6px 6px no-repeat;
}
.loginBtn--facebook:hover,
.loginBtn--facebook:focus {
  background-color: #5B7BD5;
  background-image: linear-gradient(#5B7BD5, #4864B1);
}

</style>

