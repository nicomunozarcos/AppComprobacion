const fs = require('fs');
function compararArchivos() {

  const carpeta = './Datos_Registros';
  const archivos = fs.readdirSync(carpeta);

  function filtrarArchivosPorMes(archivos) {
    return archivos.filter(archivo => archivo.endsWith('_mes.txt'));
  }

  function filtrarArchivosPorDia(archivos) {
    return archivos.filter(archivo => !archivo.endsWith('_mes.txt'));
  }

  const archivosdia = filtrarArchivosPorDia(archivos);
  const archivomes = filtrarArchivosPorMes(archivos);
  
  console.log(archivomes);
  console.log(archivosdia);
  console.log(archivos);

  const reader1 = new FileReader()
  const reader2 = new FileReader()

  // Función que se ejecutará cuando se completen ambas lecturas de archivos
  function onLoadHandler () {
    const decoder = new TextDecoder('utf-8')
    const contenido1 = decoder.decode(reader1.result)
    const contenido2 = decoder.decode(reader2.result)

    let contadorIguales = 0
    let contadorDiferentes = 0

    const lineasArchivo1 = contenido1.split('\n')
    const lineasArchivo2 = contenido2.split('\n')

    const camposarchivo1 = lineasArchivo1.map(linea => linea.split(';'))
    const camposarchivo2 = lineasArchivo2.map(linea => linea.split(';'))

    const input = document.getElementById('input-texto')
    const fechaBuscada = input.value
    const camposComparacion = [2, 4, 5, 6, 11]

    const registrosArchivo1ConFecha = camposarchivo1.filter(registro => registro[5] === fechaBuscada)
    const registrosArchivo2ConFecha = camposarchivo2.filter(registro => registro[5] === fechaBuscada)
    
    console.log(registrosArchivo1ConFecha)
    console.log(registrosArchivo2ConFecha)
    
    registrosArchivo1ConFecha.sort((a, b) => a[6] < b[6] ? -1 : 1);
    registrosArchivo2ConFecha.sort((a, b) => a[6] < b[6] ? -1 : 1);
    
    const registrosDiferentes = []
    
    const registrosArchivo2 = {}
    for (let i = 0; i < registrosArchivo2ConFecha.length; i++) {
      const registroComparacion = camposComparacion.map(j => registrosArchivo2ConFecha[i][j])
      registrosArchivo2[JSON.stringify(registroComparacion)] = registrosArchivo2ConFecha[i]
    }
    
    for (let i = 0; i < registrosArchivo1ConFecha.length; i++) {
      const registroComparacion = camposComparacion.map(j => registrosArchivo1ConFecha[i][j])
      if (registrosArchivo2[JSON.stringify(registroComparacion)]) {
        contadorIguales++
      } else {
        contadorDiferentes++
        registrosDiferentes.push(registrosArchivo1ConFecha[i])
      }
    }
    
    const registrosArchivo1 = {}
    for (let i = 0; i < registrosArchivo1ConFecha.length; i++) {
      const registroComparacion = camposComparacion.map(j => registrosArchivo1ConFecha[i][j])
      registrosArchivo1[JSON.stringify(registroComparacion)] = registrosArchivo1ConFecha[i]
    }
    
    for (let i = 0; i < registrosArchivo2ConFecha.length; i++) {
      const registroComparacion = camposComparacion.map(j => registrosArchivo2ConFecha[i][j])
      if (registrosArchivo1[JSON.stringify(registroComparacion)]) {
      } else {
        contadorDiferentes++
        registrosDiferentes.push(registrosArchivo2ConFecha[i])
      }
    }
    
  
   console.log(registrosDiferentes)
   registrosDiferentes.sort((a, b) => a[6] < b[6] ? -1 : 1);

  
    let registrosDiferentesTexto = '';
    registrosDiferentes.forEach(registro => {
      registrosDiferentesTexto += registro.join(';') + '\n'; // Separar los campos y las líneas
    });

    // Crear un enlace de descarga para el archivo
    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = URL.createObjectURL(new Blob([registrosDiferentesTexto], { type: 'text/plain' }));
    enlaceDescarga.download = `registros_diferentes_${fechaBuscada}.txt`;
    enlaceDescarga.hidden = true;
    document.body.appendChild(enlaceDescarga);

    // Simular un clic en el enlace para descargar el archivo
    enlaceDescarga.click();

    const tablaBody = document.getElementById('tablabody')
    tablaBody.innerHTML = ''

    registrosDiferentes.forEach(fila => {
      const tr = document.createElement('tr')
      fila.forEach(valor => {
        const td = document.createElement('td')
        td.textContent = valor
        tr.appendChild(td)
      })
      tablaBody.appendChild(tr)
    })

    document.getElementById('resultadocontenido1').textContent = `Se encontraron ${contadorIguales} registros iguales.`
    document.getElementById('resultadocontenido2').textContent = `Se encontraron ${contadorDiferentes} registros diferentes.`
  }

  function onProgressHandler (event) {
    // Calcular el porcentaje de carga de los archivos
    const porcentaje = Math.round((event.loaded / event.total) * 100)
    document.getElementById('barraProgreso').value = porcentaje
  }

  // Asignar las funciones de manejo de eventos a los FileReader
  reader1.onload = onLoadHandler
  reader2.onload = onLoadHandler
  reader1.onprogress = onProgressHandler
  reader2.onprogress = onProgressHandler


  reader1.readAsArrayBuffer(archivomes)
  reader2.readAsArrayBuffer(archivosdia)

  
}

const searchInput = document.getElementById('search')

searchInput.addEventListener('keyup', () => {
  const searchTerm = searchInput.value.toLowerCase()
  filterTable(searchTerm)
})

function filterTable (searchTerm) {
  const table = document.getElementById('tablabody')
  const rows = table.getElementsByTagName('tr')

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName('td')
    let found = false

    for (let j = 0; j < cells.length; j++) {
      const cellText = cells[j].textContent.toLowerCase()

      if (cellText.indexOf(searchTerm) > -1) {
        found = true
        break
      }
    }

    if (found) {
      rows[i].style.display = ''
    } else {
      rows[i].style.display = 'none'
    }
  }
}

compararArchivos();
