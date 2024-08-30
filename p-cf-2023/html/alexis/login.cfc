component rest="true" output="false" restpath="login" {

    this.dsn = "alexis_cms"; 

    remote function login() returnFormat="json" returnType="struct" restPath="/" httpmethod="POST" produces="application/json" {
        // Set CORS headers
        cfheader(name="Access-Control-Allow-Origin", value="*");
        cfheader(name="Access-Control-Allow-Methods", value="POST, OPTIONS");
        cfheader(name="Access-Control-Allow-Headers", value="Content-Type, Authorization");

        try {
            // Get the request body content
            var requestBody = toString(getHttpRequestData().content);
            var credentials = deserializeJSON(requestBody);

            var email = credentials.email;
            var password = credentials.password;

            // Hash the provided password using MD5
            var hashedPassword = hash(password, "MD5");

            // Query to check user credentials
            var result = queryExecute(
                "SELECT id FROM users WHERE email = :email AND password = :password",
                { 
                    email: { value: email },
                    password: { value: hashedPassword }
                },
                { 
                    datasource: this.dsn
                }
            );

            // Check if user exists
            if (result.recordCount > 0) {
                return { success: true, message: "Login successful" };
            } else {
                return { success: false, message: "Invalid email or password" };
            }
        } catch (any e) {
            // Log the error and return a user-friendly message
            writeLog(file="login", text="Login error: #e.message#");
            return { success: false, message: "An error occurred during login. Please try again later." };
        }
    }
}