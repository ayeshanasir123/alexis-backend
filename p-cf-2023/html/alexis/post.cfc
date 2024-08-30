component rest="true" output="false" restpath="post" {
    
    this.dsn = "alexis_cms";

    remote function getPosts() returnFormat="json" returnType="struct" restPath="/" httpmethod="GET" produces="application/json" {
        // Set CORS headers
        cfheader(name="Access-Control-Allow-Origin", value="*");
        cfheader(name="Access-Control-Allow-Methods", value="GET, POST, PUT, DELETE, OPTIONS");
        cfheader(name="Access-Control-Allow-Headers", value="Content-Type, Authorization");

        // Execute the query
        var qryPosts = queryExecute(
            "SELECT * FROM posts",
            [],  // No query parameters
            { 
                datasource : this.dsn  // Specify the datasource directly
            }
        );

        // Prepare the result
        var result = {
            posts: []
        };

        // Check if there are any records
        if (qryPosts.recordCount > 0) {
            // Use a `for` loop to iterate through the rows by index
            for (var i = 1; i <= qryPosts.recordCount; i++) {
                arrayAppend(result.posts, {
                    id: qryPosts.ID[i],
                    createdAt: qryPosts.CREATED_AT[i],
                    description: qryPosts.DESCRIPTION[i],
                    endDate: qryPosts.ENDDATE[i],
                    image: qryPosts.IMAGE[i],
                    startDate: qryPosts.STARTDATE[i],
                    summary: qryPosts.SUMMARY[i],
                    title: qryPosts.TITLE[i]
                });
            }
        }
        return result;
    }

  

remote function addPost(
    required string jsonString restargsource="body"
) returnFormat="json" returnType="struct" restPath="/addpost" httpmethod="POST" produces="application/json" {
    // Set CORS headers
    cfheader(name="Access-Control-Allow-Origin", value="*");
    cfheader(name="Access-Control-Allow-Methods", value="GET, POST, PUT, DELETE, OPTIONS");
    cfheader(name="Access-Control-Allow-Headers", value="Content-Type, Authorization");

    try {
        var jsonObj = deserializeJSON(jsonString);

        if (not structKeyExists(jsonObj, "image") or 
            not structKeyExists(jsonObj, "title") or 
            not structKeyExists(jsonObj, "summary") or 
            not structKeyExists(jsonObj, "description") or 
            not structKeyExists(jsonObj, "startDate") or 
            not structKeyExists(jsonObj, "endDate")) {
            
            throw(type="Application", message="Missing required fields.");
        }

        if (structKeyExists(jsonObj, "id") and not isNull(jsonObj.id)) {
            // Update existing post
            var updateResult = queryExecute(
                "UPDATE posts SET IMAGE = :image, TITLE = :title, SUMMARY = :summary, DESCRIPTION = :description, STARTDATE = :startDate, ENDDATE = :endDate WHERE ID = :id",
                {
                    image : jsonObj.image,
                    title : jsonObj.title,
                    summary : jsonObj.summary,
                    description : jsonObj.description,
                    startDate : jsonObj.startDate,
                    endDate : jsonObj.endDate,
                    id : jsonObj.id
                },
                {
                    datasource : this.dsn
                }
            );
            
            var result = {
                data: jsonObj,
                message: "Post updated successfully"
            };
        } else {
            // Add new post
            var insertResult = queryExecute(
                "INSERT INTO posts (IMAGE, TITLE, SUMMARY, DESCRIPTION, STARTDATE, ENDDATE) VALUES (:image, :title, :summary, :description, :startDate, :endDate)",
                {
                    image : jsonObj.image,
                    title : jsonObj.title,
                    summary : jsonObj.summary,
                    description : jsonObj.description,
                    startDate : jsonObj.startDate,
                    endDate : jsonObj.endDate
                },
                {
                    datasource : this.dsn
                }
            );

            var result = {
                data: jsonObj,
                message: "Post added successfully"
            };
        }

        return result;
    } catch (any e) {
        var result = {
            error: true,
            message: "An error occurred: #e.message#"
        };

        writeOutput("Error Details: #e.message#");
        return result;
    }
}
 
remote function deletePost() returnFormat="json" returnType="struct" restPath="delete" httpmethod="DELETE" produces="application/json" {
    // Set CORS headers
    cfheader(name="Access-Control-Allow-Origin", value="*");
    cfheader(name="Access-Control-Allow-Methods", value="GET, POST, PUT, DELETE, OPTIONS");
    cfheader(name="Access-Control-Allow-Headers", value="Content-Type, Authorization");

    try {
        // Get the request body as JSON
        var requestBody = deserializeJSON(getHttpRequestData().content);
        
        // Extract the ID from the request body
        var id = requestBody["id"];

        // Log ID parameter for debugging
        writeOutput("ID Parameter: #id#<br>");

        if (isNull(id)) {
            throw(type="Application", message="ID parameter is missing.");
        }

        // Execute the delete query
        queryExecute(
            "DELETE FROM posts WHERE ID = :id",
            { id: id },
            { datasource: this.dsn }
        );

        // Prepare the result
        var result = {
            message: "Post deleted successfully",
            error: false
        };

        return result;
    } catch (any e) {
        var result = {
            error: true,
            message: "An error occurred: #e.message#"
        };

        // Log the error
        writeOutput("Error Details: #e.message#<br>");
        return result;
    }
}
   remote function uploadFile()
    restpath="/upload" 
    httpmethod="POST" 
    produces="application/json"
    returnFormat="json" 
    returnType="struct" {

    // Set CORS headers
    cfheader(name="Access-Control-Allow-Origin", value="*");
    cfheader(name="Access-Control-Allow-Methods", value="GET, POST, PUT, DELETE, OPTIONS");
    cfheader(name="Access-Control-Allow-Headers", value="Content-Type, Authorization");

    try {
        // Generate a unique filename
        var fileName = createUUID() & ".png"; 
        var filePath = "/var/www/html/alexis/files/" & fileName;

        // Use cffile to handle the file upload
        cffile(action="upload", filefield="file", destination=filePath, nameconflict="overwrite");

        // Return success response with file path
        return {
            success: true,
            filePath: "http://195.24.225.55/alexis/files/" & fileName // Return path relative to the web root
        };
    } catch (any e) {
        return {
            error: true,
            message: "An error occurred: #e.message#"
        };
    }
}
}