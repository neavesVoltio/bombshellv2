import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, addDoc  } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { app } from './firebase.js'
const db = getFirestore(app) 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { auth } from './firebase.js'
console.log("attendanceAdmin");
// codigo para guardar la asistencia
let consecutivo
const miModal = new bootstrap.Modal(document.getElementById('detalleDeAsistenciaModal'));
let rowId
onAuthStateChanged(auth, (user) => {
  if(user){
    let guardarEvento = document.getElementById('guardarEvento');
    guardarEvento.addEventListener('click', function (e) {
      console.log("click guardar");
      console.log("saving attendance");
      let nombreEstilistaE = document.getElementById('nombreEstilista');
      let fechaHoraAsistenciaE = document.getElementById('fechaHoraAsistencia');
      let horaSalidaE = document.getElementById('horaSalida');
      let detallesDelSucesoE = document.getElementById('detallesDelSuceso');
      let comentariosModal = document.getElementById('comentariosModal');
      
          comentariosModal.innerHTML = detallesDelSucesoE.value

      let nombreEstilista = nombreEstilistaE.value;
      let fechaHoraAsistencia = fechaHoraAsistenciaE.value;
      let horaSalida = horaSalidaE.value;
      let detallesDelSuceso = detallesDelSucesoE.value;
      if(!nombreEstilista || !fechaHoraAsistencia || !horaSalida){
       // miModal.show();
          // Para cerrar el modal
        //miModal.hide();

        Swal.fire({
          icon: 'error',
          title: 'Faltan campos por llenar',
          text: `Por favor, rellene los campos de nombre y fechas antes de continuar!`,
          confirmButtonText: 'OK'
        });
        return
      } else {
        miModal.show()
        getAttendanceConsec()
        let editAsistencia = document.getElementById('editAsistencia');
        editAsistencia.style.display = "none"
      }
      
    });

  }else{
    console.log("no user");
  }
})

function getAttendanceConsec(){
  
const attendanceId = "A2cwCOeNG3X69AdcIcVP"; // ID que estás buscando

// Obtén el registro de attendance con el ID específico
const attendanceRef = doc(db, "attendance", attendanceId);

// Obtén los datos del documento
getDoc(attendanceRef)
  .then(async (docSnapshot) => {
    if (docSnapshot.exists()) {
      const attendanceData = docSnapshot.data();
      await updateDoc(attendanceRef, { consecutivo: attendanceData.consecutivo + 1 });
      console.log("Registro de Attendance:", attendanceData.consecutivo);
      consecutivo = attendanceData.consecutivo
      saveAttendanceToDb(attendanceData.consecutivo) 
    } else {
      console.log("No se encontró el registro de Attendance con el ID especificado.");
    }
  })
  .catch((error) => {
    console.error("Error al obtener el registro de Attendance:", error);
  });
}

async function saveAttendanceToDb(cons) {
  console.log("saving attendance");
  let nombreEstilistaE = document.getElementById('nombreEstilista');
  let fechaHoraAsistenciaE = document.getElementById('fechaHoraAsistencia');
  let horaSalidaE = document.getElementById('horaSalida');
  let detallesDelSucesoE = document.getElementById('detallesDelSuceso');
  let comentariosModal = document.getElementById('comentariosModal');
  
      comentariosModal.innerHTML = detallesDelSucesoE.value

  let nombreEstilista = nombreEstilistaE.value;
  let fechaHoraAsistencia = fechaHoraAsistenciaE.value;
  let horaSalida = horaSalidaE.value;
  let detallesDelSuceso = detallesDelSucesoE.value;

  if(!nombreEstilista || !fechaHoraAsistencia || !horaSalida ){
    console.log("complete los campos requeridos");
  } else {
    try{
    // Guarda los datos en Firestore
    const attendanceCollection = collection(db, 'attendance');
    await addDoc(attendanceCollection, {
      nombreEstilista,
      fechaHoraAsistencia,
      horaSalida,
      detallesDelSuceso,
      cons,
      timestamp: new Date() // Agrega una marca de tiempo del servidor
    });

    console.log('Datos guardados exitosamente en Firestore.');
  } catch (error) {
    console.error('Error al guardar los datos en Firestore:', error);
  }
  }
}

//   <img src="./images/Alaciado.webp" alt="" width="50px" class="mb-2">
// guardar en la coleccion attendanceImages


// START SECTION TO UPLOAD IMAGES

let customerFilesUpload =  document.querySelector('#customerFilesUpload');
  
customerFilesUpload.addEventListener('change', function (e) {
  // Inicia el sweet alert 
  const progressAlert = Swal.fire({
    title: 'loading file...',
    html: '<div class="progress"><div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>',
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false
  });
  // termina el sweet alert

  console.log('customer files upload chganged');
  let url = "https://script.google.com/macros/s/AKfycbywfFmRp00P7vFhQWgvr3k8fVwcEGIAB4GucWkM44Zxu78eB93jPxlTNcPD0KpIHb8/exec"
  console.log('file change');
  let fr = new FileReader()
  fr.addEventListener('loadend', function (e) {
    let res = fr.result
    
    let spt = res.split('base64,')[1]
    console.log(customerFilesUpload.files[0].type);
    let obj = {
      base64:spt,
      type:customerFilesUpload.files[0].type,
      name:nombreEstilista
    }
    console.log(obj);
    let response =  fetch(url, {
        method:'POST',
        body: JSON.stringify(obj),
      })
    .then(r=>r.text())
    .then(data => {
      console.log(data);
      try {
        const response = JSON.parse(data);
        console.log(response.link);
        
        saveToUtilityBillCollection(response.link)
        // Cerrar el Sweet Alert
        progressAlert.close();
        // Mostrar una alerta de éxito
        Swal.fire({
          icon: 'success',
          title: 'File loaded',
          text: `The file has been loaded`,
          confirmButtonText: 'OK'
        });
      } catch (e) {
        console.error("Error al analizar la respuesta JSON: ", e);
      }
    })
    .catch(err => {
      console.error("Error en la solicitud POST: ", err);
    });
  });
  fr.readAsDataURL(customerFilesUpload.files[0])
});

async function saveToUtilityBillCollection(link) {
  try {

    const docRef = await addDoc(collection(db, 'attendanceImages'), {
      cons: consecutivo,
      link: link,
      timestamp: new Date().toISOString()
    }).then(getImagesFromUtilityBillCollection())

  } catch (error) {
    console.error('Error al guardar los datos:', error);
  }
}

let viewCustomersImageButton = document.getElementById('imagenesDeAsistencia');

viewCustomersImageButton.addEventListener('click', function (e) {
  getImagesFromUtilityBillCollection()
});

async function getImagesFromUtilityBillCollection(){
  const billsCol = collection(db, 'attendanceImages');
  const q = query(billsCol, where('cons', '==', parseInt(consecutivo)));
  const querySnapshot = await getDocs(q);
  const bills = querySnapshot.docs.map((doc) => {
    doc.data()
    console.log(doc.data());
    generateThumbnail(doc.data().link, doc.data().cons)
  });
  //generateUtilityBillImagesHTML(bills)
  
  /*
  const thumbnailElements = bills.map((thumbnail) => {
    console.log(thumbnail);
    generateThumbnail(thumbnail.link, thumbnail.cons)

  });
  */

  //insertThumbnails(thumbnailElements);
  
}

function generateThumbnail(link, cons) {
  const container = document.getElementById('imagenesDeAsistencia');
  const customerFilesUpload = document.getElementById('customerFilesUpload');
  customerFilesUpload.value = ''

  const thumbnailDiv = document.createElement('div');
  thumbnailDiv.classList.add('col-sm-6', 'col-md-3');

  const thumbnail = document.createElement('div');
  thumbnail.classList.add('thumbnail');

  const image = document.createElement('img');
  image.classList.add('img-thumbnail', 'mb-2');
  image.src = link;
  image.alt = cons;

  const closeButton = document.createElement('button');
  closeButton.classList.add('close');
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => thumbnailDiv.remove());

  thumbnail.appendChild(image);
  //thumbnail.appendChild(closeButton);
  thumbnailDiv.appendChild(thumbnail);

  image.addEventListener('click', () => window.open(link, '_blank'));
  container.appendChild(thumbnailDiv)
  return thumbnailDiv;
}

function insertThumbnails(thumbnails) {
  const container = document.getElementById('imagenesDeAsistencia');
  const customerFilesUpload = document.getElementById('customerFilesUpload');
  customerFilesUpload.value = ''
  container.innerHTML = ''
  thumbnails.forEach((thumbnail) => container.appendChild(thumbnail));
}
// END OF UPLOAD IMAGE SECTION

// OBTENER LOS DATOS DE LA BD PARA LLENAR LA TABLA DE ASISTENCIAS
let dataRow = document.querySelectorAll('.tableRow');
dataRow.forEach(function(item) {
  item.addEventListener('click', function (e) {
    if (e.target.closest('.tableRow')) {
      consecutivo = e.target.closest('.tableRow').dataset.id
      console.log(e.target.closest('.tableRow').dataset.id);            
      getImagesFromUtilityBillCollection(rowId)
    }
  });
  
}); 
function getDbData(){
  let miConsecutivo
  // Realiza la consulta
const attendanceCollection = collection(db, 'attendance');
const q = query(attendanceCollection, where('cons', '==', miConsecutivo));

getDocs(q)
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('Registro encontrado:', data);
    });
  })
  .catch((error) => {
    console.error('Error al realizar la consulta:', error);
  });
}
