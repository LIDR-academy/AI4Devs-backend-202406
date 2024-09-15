$positionId = 2  # Replace with a valid position ID
$uri = "http://localhost:3010/positions/$positionId/candidates"

$response = Invoke-RestMethod -Uri $uri -Method Get

if ($response) {
    Write-Host "Candidates for Position $positionId"
    $response | ForEach-Object {
        Write-Host "Full Name: $($_.fullName)"
        Write-Host "Current Interview Step: $($_.currentInterviewStep)"
        Write-Host "Average Score: $($_.averageScore)"
        Write-Host "------------------------"
    }
} else {
    Write-Host "No candidates found for Position $positionId"
}