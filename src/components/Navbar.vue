<template>
    <div>
       <nav class=" blue lighten-2">
        <div class="nav-wrapper">
          <a href class="brand-logo"><i class="material-icons">date_range</i>Todo Fancy</a>
          <a href data-target="mobile-demo" class="sidenav-trigger"  v-on:click= "sideNavJs()"><i class="material-icons">menu</i></a>
          <ul class="right hide-on-med-and-down">
            <li><a href="https://calendar.google.com/calendar/" target="_blank">My Calendar</a></li>
            <li><a href v-on:click="logout()">Logout</a></li>
          </ul>
        </div>
      </nav>
    
      <ul class="sidenav" id="mobile-demo">
        <li><a href="https://calendar.google.com/calendar/" target="_blank">My Calendar</a></li>
        <li><a href v-on:click="logout()">Logout</a></li>
      </ul>
    </div>
</template>

<script>
export default {

  methods: {
    sideNavJs() {
      var elems = document.querySelectorAll('.sidenav');
      var instances = M.Sidenav.init(elems);
    },
    logout() {
      localStorage.clear()
      this.$router.push("/")
    }
  }
}
</script>

<style scoped>
  
</style>


