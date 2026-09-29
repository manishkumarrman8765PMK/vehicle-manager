const panel=document.getElementById('panel');

function voiceField(id){
  return `<div class="field"><input id="${id}" placeholder="बोलकर या लिखकर भरें"><button class="mic" onclick="startVoice('${id}',this)">🎙️</button></div><div id="${id}Status" class="voice-status"></div>`;
}

function startVoice(id,button){
  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SpeechRecognition){document.getElementById(id+'Status').textContent='इस browser में voice input उपलब्ध नहीं है। Android Chrome में अनुमति देकर फिर कोशिश करें।';return;}
  const rec=new SpeechRecognition();
  rec.lang='hi-IN';
  rec.interimResults=false;
  rec.maxAlternatives=1;
  button.classList.add('listening');
  document.getElementById(id+'Status').textContent='🎙️ सुन रहा हूँ...';
  rec.onresult=e=>{
    document.getElementById(id).value=e.results[0][0].transcript;
    document.getElementById(id+'Status').textContent='✅ आवाज से जानकारी भर दी गई।';
  };
  rec.onerror=()=>{document.getElementById(id+'Status').textContent='आवाज नहीं मिली। दोबारा बोलकर कोशिश करें।';};
  rec.onend=()=>button.classList.remove('listening');
  rec.start();
}

function showSection(section){
  const data={
    vehicle:`<h2>🚗 अपना वाहन</h2><label>वाहन का प्रकार</label><select id="vehicleType"><option>Car / कार</option><option>Bike / बाइक</option><option>Truck / ट्रक</option><option>Other / अन्य</option></select><label>वाहन का नाम</label>${voiceField('vehicleName')}<label>Vehicle Number</label>${voiceField('vehicleNumber')}<button class="save" onclick="saveMessage('Vehicle details saved')">Save / सेव करें</button>`,
    fuel:`<h2>⛽ Fuel / ईंधन</h2><label>Fuel type</label><select><option>Petrol / पेट्रोल</option><option>Diesel / डीजल</option></select><label>आज का खर्च (₹)</label>${voiceField('fuelCost')}<label>Litres</label>${voiceField('litres')}<button class="save" onclick="saveMessage('Fuel entry saved')">Save / सेव करें</button>`,
    mileage:`<h2>📊 Mileage / माइलेज</h2><label>Odometer (km)</label>${voiceField('odometer')}<label>Fuel used (litres)</label>${voiceField('fuelUsed')}<button class="save" onclick="saveMessage('Mileage entry saved')">Calculate / गणना करें</button>`,
    reminders:`<h2>🔔 Reminders / याद दिलाने वाले नोटिफिकेशन</h2><label>Reminder type</label><select><option>Service</option><option>Insurance</option><option>PUC</option><option>Other</option></select><label>नोट / काम</label>${voiceField('reminderText')}<label>Date</label><input type="date"><button class="save" onclick="saveMessage('Reminder saved')">Save Reminder</button>`,
    documents:`<h2>📄 Insurance / PUC</h2><label>Document</label><select><option>Insurance</option><option>PUC</option></select><label>Expiry date</label><input type="date"><button class="save" onclick="saveMessage('Document reminder saved')">Save</button>`,
    obd:`<h2>🔌 OBD Connect</h2><p>OBD adapter को Bluetooth/Wi‑Fi से जोड़ने के लिए यह विकल्प रखा गया है। आगे compatible OBD devices के साथ diagnostics जोड़े जाएंगे।</p><button class="save" onclick="connectOBD()">🔌 Connect OBD</button><p id="obdStatus"></p>`
  };
  panel.innerHTML=data[section]||'<h2>Vehicle Manager</h2>';
}

function saveMessage(msg){alert(msg);}

async function connectOBD(){
  const status=document.getElementById('obdStatus');
  if(!navigator.bluetooth){status.textContent='इस browser में Bluetooth Web API उपलब्ध नहीं है।';return;}
  try{
    status.textContent='Bluetooth device चुनें...';
    const device=await navigator.bluetooth.requestDevice({acceptAllDevices:true});
    status.textContent='Device selected: '+(device.name||'Unknown');
  }catch(e){status.textContent='Connection cancelled or unavailable.';}
}

document.getElementById('langBtn').onclick=()=>{
  alert('Language options: Hindi / English. आगे और प्रमुख भाषाएँ जोड़ी जाएँगी।');
};
