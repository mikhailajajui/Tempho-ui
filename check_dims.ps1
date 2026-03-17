Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("c:\Users\redra\Downloads\tempho\public\reviews\review_card_emily.png")
Write-Output "Width: $($img.Width) Height: $($img.Height)"
$img.Dispose()
