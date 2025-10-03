# Script: CopySelectedFiles.ps1
# Ruta de la carpeta a recorrer
$sourceFolder = Read-Host "Introduce la ruta de la carpeta a procesar"

# Archivo de salida donde se concatenará el contenido
$outputFile = Read-Host "Introduce la ruta completa del archivo de salida"

# Limpiar o crear el archivo de salida
Set-Content -Path $outputFile -Value ""

# Obtener todos los archivos .py, .js y .jsx recursivamente
$files = Get-ChildItem -Path $sourceFolder -Recurse -File -Include *.py,*.js,*.jsx

foreach ($file in $files) {
    Write-Host "Archivo encontrado: $($file.FullName)"
    $response = Read-Host "¿Deseas incluir este archivo? (s/n)"
    
    if ($response -eq 's') {
        # Leer contenido del archivo
        $content = Get-Content -Path $file.FullName
        
        # Agregar separador antes de cada archivo
        Add-Content -Path $outputFile -Value "`n==== Contenido de $($file.FullName) ====`n"
        
        # Agregar contenido
        Add-Content -Path $outputFile -Value $content
    }
}

Write-Host "Proceso completado. El contenido seleccionado se ha copiado en $outputFile"
