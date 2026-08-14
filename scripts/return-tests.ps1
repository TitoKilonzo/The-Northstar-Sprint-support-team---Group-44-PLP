$tests = @(
  @{name='NS-90001 eligible'; body=@{order_id='NS-90001'; item_id='NS-90001-ITEM1'; reason='Wrong size'; condition='New, unused, original packaging'}; expect=$true},
  @{name='NS-90002 outside window'; body=@{order_id='NS-90002'; item_id='NS-90002-ITEM1'; reason='Changed mind'; condition='New, unused, original packaging'}; expect=$false},
  @{name='NS-90003 not delivered'; body=@{order_id='NS-90003'; item_id='NS-90003-ITEM1'; reason='Defective'; condition='New, unused, original packaging'}; expect=$false},
  @{name='NS-90004 final sale'; body=@{order_id='NS-90004'; item_id='NS-90004-ITEM1'; reason='Wrong item'; condition='New, unused, original packaging'}; expect=$false},
  @{name='NS-90005 delivered today'; body=@{order_id='NS-90005'; item_id='NS-90005-ITEM1'; reason='Wrong size'; condition='New, unused, original packaging'}; expect=$true},
  @{name='NS-90006 in transit'; body=@{order_id='NS-90006'; item_id='NS-90006-ITEM1'; reason='Changed mind'; condition='New, unused, original packaging'}; expect=$false},
  @{name='NS-90007 window fails before final_sale'; body=@{order_id='NS-90007'; item_id='NS-90007-ITEM1'; reason='Damaged'; condition='New, unused, original packaging'}; expect=$false},
  @{name='Missing reason'; body=@{order_id='NS-90001'; item_id='NS-90001-ITEM1'; reason=''; condition='New, unused, original packaging'}; expect=$false},
  @{name='Invalid condition'; body=@{order_id='NS-90001'; item_id='NS-90001-ITEM1'; reason='Wrong color'; condition='Used'}; expect=$false}
)

$results = @()
foreach ($t in $tests) {
  try {
    $bodyJson = $t.body | ConvertTo-Json -Depth 10
    $res = Invoke-WebRequest -Uri 'http://localhost:3001/api/return-eligibility' -Method Post -Body $bodyJson -ContentType 'application/json' -ErrorAction Stop
    $responseBody = $res.Content | ConvertFrom-Json
    $eligible = $false
    if ($responseBody.PSObject.Properties.Name -contains 'eligible') { $eligible = [bool]$responseBody.eligible }
    $pass = $eligible -eq $t.expect
    $results += @{ test = $t.name; status = $res.StatusCode; response = $responseBody; pass = $pass }
  } catch {
    $results += @{ test = $t.name; error = $_.Exception.Message; pass = $false }
  }
}

$results | ConvertTo-Json -Depth 10 | Out-File -FilePath 'scripts/return-tests-output.json' -Encoding utf8
Get-Content 'scripts/return-tests-output.json'
