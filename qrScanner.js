const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputDataType = document.getElementById("outputData-type");
const outputDataName = document.getElementById("outputData-name");
const outputDataSurname = document.getElementById("outputData-surname");
const outputDataPatronymic = document.getElementById("outputData-patronymic");
const outputDataDateofbirth = document.getElementById("outputData-dateofbirth");
const outputDataPlaceofbirth = document.getElementById("outputData-placeofbirth");
const outputDataAuthority = document.getElementById("outputData-authority");
const outputDataSerie = document.getElementById("outputData-serie");
const outputDataIssued = document.getElementById("outputData-issued");
const outputDataDue = document.getElementById("outputData-due");
const btnScanQR = document.getElementById("btn-scan-qr");

let scanning = false;

class person {
  constructor(type, name, surname, patronymic, dateofbirth, placeofbirth, authority, serie, issued, due) {
    this.type = type;
    this.name = name;
    this.surname = surname;
    this.patronymic = patronymic;
    this.dateofbirth = dateofbirth;
    this.placeofbirth = placeofbirth;
    this.authority = authority;
    this.serie = serie;
    this.issued = issued;
    this.due = due;
  }
}


const GDCACV13092010 = new person("Гражданин", "Артем", "Чуйко", "Вячеславович", "13.09.2010", "Донецк, Украина", "Сенат команты", "GDC-ACV-13092010", "17.11.2023", "17.12.2023")
const GDCACV12072014 = new person("Иностранный гражданин", "Амалия", "Чуйко", "Вячеславовна", "12.07.2014", "Мелитополь, Украина", "Сенат команты", "GDC-ACV-12072014", "17.11.2023", "17.12.2023")
const unknown = new person("УДОСТОВЕРЕНИЕ НЕ РАСПОЗНАНО", "-", "-", "-", "-", "-", "Сенат команты", "-", "-", "-")

var id = GDCACV13092010;

qrcode.callback = res => {
  if (res) {
    const qrText = res;
    if (qrText == "GDC-ACV-13092010") {
        id = GDCACV13092010;
    } else if (qrText == "GDC-ACV-12072014") {
        id =  GDCACV12072014;
    } else {
        id = unknown;
    }
    outputDataType.innerText = id.type;
    outputDataName.innerText = id.name;
    outputDataSurname.innerText = id.surname;
    outputDataPatronymic.innerText = id.patronymic;
    outputDataDateofbirth.innerText = id.dateofbirth;
    outputDataPlaceofbirth.innerText = id.placeofbirth;
    outputDataAuthority.innerText = id.authority;
    outputDataSerie.innerText = id.serie;
    outputDataIssued.innerText = id.issued;
    outputDataDue.innerText = id.due;
    scanning = false;

    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });

    qrResult.hidden = false;
    canvasElement.hidden = true;
    btnScanQR.hidden = false;
  }
};

btnScanQR.onclick = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
      scanning = true;
      qrResult.hidden = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
};

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 100);
  }
}
