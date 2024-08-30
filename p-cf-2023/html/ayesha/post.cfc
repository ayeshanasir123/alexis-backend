

    component output="false" rest="true" restPath="/post" displayname="PostComponent" {

    remote function getPosts() httpmethod="GET" returnformat="json" restPath="/" {
        // Execute the query
        var qryPosts = queryExecute(
            "SELECT * FROM posts",
            [],  // No query parameters
            { 
                datasource : "alexis_cms"  // Specify the datasource directly
            }
        );

        // Prepare the result
        var posts = [];

        // Check if there are any records
        if (qryPosts.recordCount > 0) {
            for (var i = 1; i <= qryPosts.recordCount; i++) {
                arrayAppend(posts, {
                    id: qryPosts[i].ID,
                    createdAt: qryPosts[i].CREATED_AT,
                    description: qryPosts[i].DESCRIPTION,
                    endDate: qryPosts[i].ENDDATE,
                    image: qryPosts[i].IMAGE,
                    startDate: qryPosts[i].STARTDATE,
                    summary: qryPosts[i].SUMMARY,
                    title: qryPosts[i].TITLE,
                    updatedAt: qryPosts[i].UPDATED_AT
                });
            }
        }

        return posts;
    }

}




