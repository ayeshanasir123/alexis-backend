component rest="true" output="false" restpath="fileupload" {

    this.dsn = "alexis_cms";

    remote function uploadFile() returnFormat="json" returnType="struct" restPath="/" httpmethod="POST" produces="application/json" {
        // Set CORS headers
        cfheader(name="Access-Control-Allow-Origin", value="*");
        cfheader(name="Access-Control-Allow-Methods", value="GET, POST, PUT, DELETE, OPTIONS");
        cfheader(name="Access-Control-Allow-Headers", value="Content-Type, Authorization");

        var response = {};

        try {
            // Define the upload path
            var uploadPath = "/path/to/upload/directory/";

            // Check if file was uploaded
            if (!structKeyExists(form, "fileUpload")) {
                throw ("File not provided.");
            }

            // Create a unique filename
            var uploadedFileName = createUUID() & "_" & form.fileUpload.fileName;

            // Upload the file
            cffile action="upload" 
                   fileField="fileUpload" 
                   destination="#uploadPath#" 
                   nameConflict="makeUnique" 
                   result="uploadResult";

            // Build the response structure
            response.success = true;
            response.message = "File uploaded successfully.";
            response.fileName = uploadResult.serverFile;

        } catch (any e) {
            // Handle errors
            response.success = false;
            response.message = e.message;
        }

        return response;
    }
}
