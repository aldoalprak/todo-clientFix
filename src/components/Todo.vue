<template>
    <div v-on:load="handleClientLoad()">
        <div class="fixed-action-btn">
            <button class="btn-floating btn-large waves-effect waves-light  red lighten-2 pulse modal-trigger" data-target="modal1" v-on:click="modalJs()"><i class="material-icons">add</i></button>
        
        </div>
        <div id="modal1" class="modal modal-fixed-footer">
            <div class="modal-content">
                Add new Todo
                <div class="row">
                    <div class="input-field col s12">
                        <input type="text" id="task_name" v-model="task_name" name="task_name" v-validate="'required'">
                        <span class="helper-text">{{errors.first("task_name")}}</span>
                        <label for="task_name">Task Name</label>
                    </div>
                    <div class="input-field col s12">
                        <input type="text" id="description" v-model="description" >
                        <label for="description">Description</label>
                    </div>
                    <div class="input-field col s12" v-if="isSignedIn == false">
                        <div >
                            <label for="date">Due Date</label>
                            <p>Please login to your google account</p>
                            <button class="loginBtn loginBtn--google" style="cursor: pointer;" v-on:click="handleAuthClick()">Login with Google</button>
                        </div>
                    </div>
                    <div v-else>
                        <div class="input-field col s12" >
                            <div>
                                <label for="date">Due Date</label>
                                <input type="datetime-local" id="date" v-model="date">
                                
                            </div>
                        </div>
                        <div class="input-field col s12">
                            <div >
                                <label for="reminder">Remind me</label>
                                <input type="number" id="reminder" placeholder="example: 1 (means 1 day before due date)" v-model.number="reminder">
                            
                            </div>
                        </div>
                    </div>
                              
                </div>
            </div>
            <div class="modal-footer">
                <button class="modal-close waves-effect waves-green btn" v-on:click="addTodo()">submit</button>
            </div>
        </div>

        <table>
        <thead>
          <tr>
              <th>Todo</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Options</th>
          </tr>
        </thead>

        <!-- <tbody v-for="todo in todoList">  -->
        <tbody v-for="(todo, index) in todoList" :key="index">
          <tr>
            <td>{{todo.task_name}}</td>
            <td>{{todo.description}}</td>
            <td>{{todo.dueDate}}</td>
            <td><button class="btn-floating btn-small waves-effect waves-light" v-on:click="updateTodo(todo)"><i class="material-icons">edit</i></button>
            <button class="btn-floating btn-small waves-effect red waves-light" v-on:click="deleteTodo(todo)"><i class="material-icons">delete</i></button>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
</template>

<script >
import axios from 'axios'

export default {
    created() {
        if(localStorage.hasOwnProperty("token")){
                this.getTodo()
                 this.handleClientLoad()
        }else{
            this.$router.push("/")
        }
        
    },
    beforeMount() {
        this.handleClientLoad()
    },
    data() {
        return{
            googleInit:null,
            isSignedIn:false,
            todoList:[],
            task_name:"",
            description:"",
            date:"",
            reminder:""
        }
    },
    methods:{
        getTodo() {
            axios({
                method:"get",
                url:"https://api_todo.alprak.net/todos/show",
                headers:{
                   token: localStorage.getItem("token")
                }
            })
            .then(({data})=>{
                this.todoList = data
                console.log(data)
            })
        },
        modalJs() {
            var elems = document.querySelectorAll('.modal');
            var instances = M.Modal.init(elems);
        },
        addTodo() {
            let self = this
            this.$validator.validate().then(result=>{
                if(!result) {
                    swal(
                        "Warning!",
                        "Task Name required",
                        "warning"
                    )
                }else{
                    var event = {
                        'summary': this.task_name,
                        'location': 'kedoya',
                        'start': {
                        'dateTime': `${this.date}:00Z`,
                        },
                        'end': {
                        'dateTime': `${this.date}:00Z`,
                        
                        },
                        'reminders': {
                        'useDefault': false,
                        'overrides': [
                            {'method': 'email', 'minutes': this.reminder * 24 * 60},
                            {'method': 'popup', 'minutes': 10}
                        ]
                        }
                    };

                    var request = gapi.client.calendar.events.insert({
                        'calendarId': 'primary',
                        'resource': event
                    })
                    request.execute(function(event) {
                        axios({
                            method:"post",
                            url:"https://api_todo.alprak.net/todos/add",
                            data:{
                                task_name:self.task_name,
                                description:self.description,
                                dueDate:self.date,
                                eventId:event.id
                            },
                            headers: {
                                token: localStorage.getItem("token")
                            }
                        })
                        .then(response=>{
                            self.task_name=""
                            self.description=""
                            self.dueDate=""
                            self.getTodo()
                            swal({
                                type: 'success',
                                title:'Todo Succesfully Added !',
                                text:'Let\'s do it!! ',
                                customClass: 'animated bounceInLeft'
                            })
                        })
                    });
        
                }
            })
                       
        },
        deleteTodo(todo) {
            swal({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yoi, delete it!'
            })
            .then((result) => {
                
                if (result.value) {
                    var request = gapi.client.calendar.events.delete({
                        'calendarId': 'primary',
                        'eventId': `${todo.eventId}`
                    })

                    request.execute(function(event) {
                        console.log(event)
                    })

                    axios({
                        method:"delete",
                        url:`https://api_todo.alprak.net/todos/delete/${todo._id}`,
                        headers: {
                            token:localStorage.getItem("token")
                        }
                    })
                    .then(result=>{
                        this.getTodo()
                        swal(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                    })
                    
                }
            })
            
        },

        updateTodo(todo) {
            let self = this
            swal.mixin({
                input: 'text',
                confirmButtonText: 'Next &rarr;',
                showCancelButton: true,
                progressSteps: ['1', '2', '3']
                }).queue([
                {
                    title: 'Todo Name',
                    text: 'Please edit your todo in text box below ',
                    inputValue: todo.task_name
                },
                {
                    title: 'Description',
                    text: 'Please edit your todo\'s description in text box below',
                    inputValue: todo.description
                },
                {
                    title: 'Due date',
                    text: 'Please edit your todo\'s due date in text box below',
                    inputValue: todo.dueDate
                }
                ]).then((result) => {
                    console.log(result)
                if (result.value) {
                    var event = gapi.client.calendar.events.get({
                        "calendarId": 'primary',
                        "eventId": `${todo.eventId}`
                    });
                    console.log(`${result.value[2]}:00Z`)
                    event.summary = result.value[0]
                    event.start = {
                        'dateTime': `${result.value[2]}:00Z`
                    }
                    event.end = {
                        'dateTime': `${result.value[2]}:00Z`
                    }
                   

                    var request = gapi.client.calendar.events.patch({
                        'calendarId': 'primary',
                        'resource': event,
                        'eventId' : `${todo.eventId}`
                    })

                    request.execute(function(event) {
                        console.log(event)
                        axios({
                            method:"put",
                            url: `https://api_todo.alprak.net/todos/update/${todo._id}`,
                            data: {
                                task_name: result.value[0],
                                description: result.value[1],
                                dueDate: result.value[2]
                            },
                            headers:{
                                token: localStorage.getItem("token")
                            }
                        })
                        .then(result=>{
                            console.log(result)
                            self.getTodo()
                            swal({
                                title: 'Todo Updated!',
                                confirmButtonText: 'Great!'
                            })
                        })
                    })
                    print
                    
                    
                }
            })
        },
        handleClientLoad() {
            console.log("handle=========")
            let self= this
            gapi.load('client:auth2', function(){
                 gapi.client.init({
                    apiKey: 'AIzaSyDYw5ks3UZmArO-lXBAtws0mPx0L--GCuQ',
                    clientId: '41254868352-7t9fouq701bcbhpdnoqob3obmi3bci6v.apps.googleusercontent.com',
                    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
                    scope: "https://www.googleapis.com/auth/calendar"
                    }).then(function () {
                        console.log("masuks kah")
                    // Listen for sign-in state changes.
                    gapi.auth2.getAuthInstance().isSignedIn.listen(self.updateSigninStatus);

                    // Handle the initial sign-in state.
                    self.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());;
                    self.googleInit = true
                });

            });
        },
        updateSigninStatus(isSignedIn) {
            this.isSignedIn = isSignedIn
            console.log(this.isSignedIn,"ccc")
            if(isSignedIn) {
                console.log("horeee")
            }
        },
        handleAuthClick() {
            console.log(this.googleInit)
            if(this.googleInit) {
                gapi.auth2.getAuthInstance().signIn();
            }
            
                
        }
    }
}


</script>

<style scoped>
.helper-text{
    color:red
}

/*====================== google button ================*/

/* Shared */
.loginBtn {
  box-sizing: border-box;
  position: relative;
  /* width: 13em;  - apply for fixed size */
  margin: 0.2em;
  padding: 0 15px 0 46px;
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

.loginBtn--google {
  /*font-family: "Roboto", Roboto, arial, sans-serif;*/
  background: #DD4B39;
}
.loginBtn--google:before {
  border-right: #BB3F30 1px solid;
  background: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/14082/icon_google.png') 6px 6px no-repeat;
}
.loginBtn--google:hover,
.loginBtn--google:focus {
  background: #E74B37;
}
</style>
