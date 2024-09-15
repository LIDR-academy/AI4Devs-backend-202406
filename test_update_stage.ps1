$candidateId = 1  # Replace with a valid candidate ID
$positionId = 2  # Replace with a valid position ID
$newStageId = 3   # Replace with a valid new stage ID
$uri = "http://localhost:3010/candidates/$candidateId/stage"

$body = @{
    newStageId = $newStageId
    positionId = $positionId
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri $uri -Method Put -Body $body -Headers $headers

    Write-Host "Candidate stage updated successfully:"
    Write-Host "Message: $($response.message)"
    Write-Host "Updated Candidate Data:"
    $response.data | Format-List
} catch {
    Write-Host "Error updating candidate stage:"
    Write-Host $_.Exception.Message
}