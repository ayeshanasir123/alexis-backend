
<cfscript>
qryPosts = queryExecute(
    "SELECT * FROM posts",
    [],  // No query parameters
    { 
        datasource : "alexis_cms"  // Specify the datasource directly
    }
);

// Check if there are any records

if (qryPosts.recordCount > 0) {
    
    for (row in qryPosts) {
        writeOutput(row.CREATED_AT & "<br>");
        writeOutput("<p>");
        writeOutput("ID: " & row.ID & "<br>");
        writeOutput("Created At: " & row.CREATED_AT & "<br>");
        writeOutput("Description: " & row.DESCRIPTION & "<br>");
        writeOutput("End Date: " & row.ENDDATE & "<br>");
        writeOutput("Image: " & row.IMAGE & "<br>");
        writeOutput("Start Date: " & row.STARTDATE & "<br>");
        writeOutput("Summary: " & row.SUMMARY & "<br>");
        writeOutput("Title: " & row.TITLE & "<br>");
        writeOutput("Updated At: " & row.UPDATED_AT);
        writeOutput("</p>");
    }
} else {
    // No records found
    writeOutput("No posts found.");
}
 
// Output the results for debugging
// writeDump(qryPosts);

</cfscript>


