component rest="true" output="false" restpath="offer" {

    this.dsn = "alexis_cms";

    // Get all offers
    remote function getOffers() returnFormat="json" returnType="struct" restPath="/" httpmethod="GET" produces="application/json" {
        // Set CORS headers
        cfheader(name="Access-Control-Allow-Origin", value="*");
        cfheader(name="Access-Control-Allow-Methods", value="GET, POST, PUT, DELETE, OPTIONS");
        cfheader(name="Access-Control-Allow-Headers", value="Content-Type, Authorization");

        // Execute the query
        var qryOffers = queryExecute(
            "SELECT id, image, link, startdate, enddate FROM offers",
            [],  // No query parameters
            { 
                datasource : this.dsn  // Specify the datasource directly
            }
        );

        // Prepare the result
        var result = {
            offers: []
        };

        // Check if there are any records
        if (qryOffers.recordCount > 0) {
            // Use a for loop to iterate through the rows by index
            for (var i = 1; i <= qryOffers.recordCount; i++) {
                arrayAppend(result.offers, {
                    id: qryOffers.ID[i],
                    image: qryOffers.IMAGE[i],
                    link: qryOffers.LINK[i],
                    startDate: qryOffers.STARTDATE[i],
                    endDate: qryOffers.ENDDATE[i]
                });
            }
        }

        return result;
    }

    // Add a new offer
    remote function addOffer(
        required string jsonString restargsource="body"
    ) returnFormat="json" returnType="struct" restPath="/addoffer" httpmethod="POST" produces="application/json" {
        // Set CORS headers
        cfheader(name="Access-Control-Allow-Origin", value="*");
        cfheader(name="Access-Control-Allow-Methods", value="GET, POST, PUT, DELETE, OPTIONS");
        cfheader(name="Access-Control-Allow-Headers", value="Content-Type, Authorization");

        try {
            var jsonObj = deserializeJSON(jsonString);

            if (not structKeyExists(jsonObj, "image") or 
                not structKeyExists(jsonObj, "link") or 
                not structKeyExists(jsonObj, "startDate") or 
                not structKeyExists(jsonObj, "endDate")) {

                throw(type="Application", message="Missing required fields.");
            }

            if (structKeyExists(jsonObj, "id") and not isNull(jsonObj.id)) {
                // Update existing offer
                var updateResult = queryExecute(
                    "UPDATE offers SET image = :image, link = :link, startdate = :startDate, enddate = :endDate WHERE id = :id",
                    {
                        image : jsonObj.image,
                        link : jsonObj.link,
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
                    message: "Offer updated successfully"
                };
            } else {
                // Add new offer
                var insertResult = queryExecute(
                    "INSERT INTO offers (image, link, startdate, enddate) VALUES (:image, :link, :startDate, :endDate)",
                    {
                        image : jsonObj.image,
                        link : jsonObj.link,
                        startDate : jsonObj.startDate,
                        endDate : jsonObj.endDate
                    },
                    {
                        datasource : this.dsn
                    }
                );

                var result = {
                    data: jsonObj,
                    message: "Offer added successfully"
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

   
   

    // Delete an offer
   remote function deleteOffer() returnFormat="json" returnType="struct" restPath="delete" httpmethod="DELETE" produces="application/json" {
    // Set CORS headers
    cfheader(name="Access-Control-Allow-Origin", value="*");
    cfheader(name="Access-Control-Allow-Methods", value="GET, POST, PUT, DELETE, OPTIONS");
    cfheader(name="Access-Control-Allow-Headers", value="Content-Type, Authorization");

    try {
        // Get the request body as JSON
        var requestBody = deserializeJSON(getHttpRequestData().content);
        
        // Extract the ID from the request body
        var id = requestBody["id"];

        if (isNull(id)) {
            throw(type="Application", message="ID parameter is missing.");
        }

        // Execute the delete query
        queryExecute(
            "DELETE FROM offers WHERE id = :id",
            { id: id },
            { datasource: this.dsn }
        );

        // Prepare the result
        return {
            message: "Offer deleted successfully",
            error: false
        };
    } catch (any e) {
        return {
            error: true,
            message: "An error occurred: #e.message#"
        };
    }
}
}
