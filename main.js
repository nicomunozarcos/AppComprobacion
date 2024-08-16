function compararArchivos() {
  // Obtener la fecha seleccionada
  const fechaSeleccionada = document.getElementById('input-texto').value.trim();
  if (!fechaSeleccionada) {
      alert('Por favor, ingresa una fecha en el formato DD-MM-AAAA');
      return;
  }

  // Obtener los archivos seleccionados
  const archivo1 = document.getElementById('archivo1').files[0];
  const archivo2 = document.getElementById('archivo2').files[0];

  if (!archivo1 || !archivo2) {
      alert('Por favor, selecciona dos archivos para comparar');
      return;
  }

  // Leer archivos y procesar
  const lector1 = new FileReader();
  const lector2 = new FileReader();

  lector1.onload = function(event) {
      const contenido1 = event.target.result.split('\n').map(line => line.trim());
      lector2.onload = function(event) {
          const contenido2 = event.target.result.split('\n').map(line => line.trim());

          // Filtrar registros por fecha seleccionada
          const registros1 = contenido1.filter(line => line.includes(fechaSeleccionada));
          const registros2 = contenido2.filter(line => line.includes(fechaSeleccionada));

          // Comparar los registros y encontrar los diferentes
          const registrosDiferentes = encontrarDiferencias(registros1, registros2);

          // Mostrar resultados en la tabla
          mostrarResultados(registrosDiferentes);
      };
      lector2.readAsText(archivo2);
  };
  lector1.readAsText(archivo1);
}

function encontrarDiferencias(registros1, registros2) {
  const setRegistros1 = new Set(registros1);
  const setRegistros2 = new Set(registros2);

  const diferencias = [];

  // Buscar en ambos sets para identificar diferencias
  registros1.forEach(registro => {
      if (!setRegistros2.has(registro)) {
          diferencias.push(registro);
      }
  });

  registros2.forEach(registro => {
      if (!setRegistros1.has(registro)) {
          diferencias.push(registro);
      }
  });

  return diferencias;
}

function mostrarResultados(registros) {
  const tbody = document.getElementById('tablabody');
  tbody.innerHTML = ''; // Limpiar resultados previos

  if (registros.length === 0) {
      const fila = tbody.insertRow();
      const celda = fila.insertCell(0);
      celda.colSpan = 12;
      celda.textContent = 'No se encontraron diferencias';
      celda.classList.add('text-center');
  } else {
      registros.forEach(registro => {
          const campos = registro.split(';');
          const fila = tbody.insertRow();
          campos.forEach((campo, index) => {
              const celda = fila.insertCell(index);
              celda.textContent = campo;
          });
      });
  }
}
