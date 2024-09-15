$uri = "http://localhost:3010/candidates"

$body = @{
    firstName = "Alberto"
    lastName = "Saeliceso"
    email = "albert.saelices0@gmail.com"
    phone = "656874938"
    address = "Calle Sant Dalmir 2, 5ºB. Barcelona"
    educations = @(
        @{
            institution = "UC3M"
            title = "Computer Science"
            startDate = "2006-12-31"
            endDate = "2010-12-26"
        }
    )
    workExperiences = @(
        @{
            company = "Coca Cola"
            position = "SWE"
            description = ""
            startDate = "2011-01-13"
            endDate = "2013-01-17"
        }
    )
    cv = @{
        filePath = "uploads/1715760936750-cv.pdf"
        fileType = "application/pdf"
    }
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri $uri -Method Post -Body $body -Headers $headers