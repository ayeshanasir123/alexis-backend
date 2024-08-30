component {
    this.name = "alexis";
    this.sessionManagement = true;

    // This function is called once when the application starts.
    function onApplicationStart() {
        // Initialize any application-wide variables or data structures here.
        this.swishcallbacks = {};
        this.customers = {};
    }

}
