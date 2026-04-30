# Sync static site to S3. Requires AWS CLI v2 and credentials (aws configure).
# Usage: .\aws\sync-to-s3.ps1 -BucketName your-unique-bucket-name

param(
  [Parameter(Mandatory = $true)][string]$BucketName
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

Push-Location $ProjectRoot
try {
  aws s3 sync . "s3://$BucketName/" `
    --delete `
    --exclude ".git/*" `
    --exclude ".vercel/*" `
    --exclude ".cursor/*" `
    --exclude "aws/*" `
    --exclude ".DS_Store"

  Write-Host ""
  Write-Host "Sync complete. Invalidate CloudFront if needed:" -ForegroundColor Cyan
  Write-Host "  aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths `"/*`"" -ForegroundColor Gray
}
finally {
  Pop-Location
}
