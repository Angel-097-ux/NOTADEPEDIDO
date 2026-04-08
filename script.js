// Fecha Actual
document.getElementById('fecha-actual').innerText = new Date().toLocaleDateString();

// Función inicial para que la primera fila ya sume
vincularEventos();

function agregarFila() {
    const cuerpo = document.getElementById('cuerpo-tabla');
    const filas = document.getElementsByClassName('fila-producto');
    const nuevaFila = filas[0].cloneNode(true);
    
    // Limpiamos los datos de la fila clonada
    nuevaFila.querySelectorAll('input').forEach(i => {
        i.value = "";
        if(i.classList.contains('total-cant')) i.value = 0;
    });
    nuevaFila.querySelector('.fila-subtotal').innerText = "$0";
    
    cuerpo.appendChild(nuevaFila);
    vincularEventos(); // Vinculamos los cálculos a la nueva fila
}

function vincularEventos() {
    document.querySelectorAll('.fila-producto').forEach(fila => {
        const talles = fila.querySelectorAll('.t');
        const precioI = fila.querySelector('.art-precio');
        
        const calcular = () => {
            let cant = 0;
            talles.forEach(t => cant += Number(t.value || 0));
            
            // Ponemos el total de unidades en la columna "Cant"
            fila.querySelector('.total-cant').value = cant;
            
            // Calculamos subtotal
            let p = Number(precioI.value || 0);
            fila.querySelector('.fila-subtotal').innerText = `$${(cant * p).toLocaleString()}`;
            
            sumarTodo();
        };

        // Escuchar cambios en talles y precio
        talles.forEach(t => t.oninput = calcular);
        precioI.oninput = calcular;
    });
}

function sumarTodo() {
    let total = 0;
    document.querySelectorAll('.fila-subtotal').forEach(s => {
        // Limpiamos el texto para convertirlo a número puro
        let valor = s.innerText.replace('$', '').replace(/\./g, '').replace(/,/g, '');
        total += Number(valor || 0);
    });
    document.getElementById('total-final').innerText = `$${total.toLocaleString()}`;
}

function enviarWhatsapp() {
    const fabrica = document.getElementById('fabrica-nombre').value || "General";
    const nroPedido = document.getElementById('nro-pedido').value || "S/N";
    const cliente = document.getElementById('cliente').value || "Cliente";
    
    let mensaje = `*📦 PEDIDO N° ${nroPedido} - ${fabrica.toUpperCase()}*%0A`;
    mensaje += `*Cliente:* ${cliente}%0A--------------------------%0A`;
    
    document.querySelectorAll('.fila-producto').forEach(fila => {
        const art = fila.querySelector('.art-cod').value;
        const total = fila.querySelector('.total-cant').value;
        if(art && total > 0) {
            mensaje += `• *${art}* | Cant: ${total} | Sub: ${fila.querySelector('.fila-subtotal').innerText}%0A`;
        }
    });

    mensaje += `--------------------------%0A*TOTAL: ${document.getElementById('total-final').innerText}*`;
    window.open(`https://wa.me/5493426112097?text=${mensaje}`, '_blank');
}

function generarPDF() {
    const elemento = document.getElementById('hoja-pedido');
    const nroPedido = document.getElementById('nro-pedido').value || '001';
    const fabrica = document.getElementById('fabrica-nombre').value || 'PEDIDO';

    // AJUSTE CRÍTICO: Forzamos un ancho que contenga toda la tabla antes de capturar
    const anchoOriginal = elemento.style.width;
    elemento.style.width = "1300px"; 

    const opciones = {
        margin: 0.2,
        filename: `${fabrica}_Nro_${nroPedido}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true,
            logging: false,
            letterRendering: true
        },
        jsPDF: { 
            unit: 'in', 
            format: 'a3', 
            orientation: 'landscape' 
        }
    };

    html2pdf().set(opciones).from(elemento).save().then(() => {
        elemento.style.width = anchoOriginal; // Volvemos a la normalidad
    });
}