// Este site salva os dados (preços, textos, fotos) no Supabase, um banco de
// dados na nuvem gratuito. Troque as duas linhas abaixo pelas suas chaves,
// que você pega no painel do Supabase em Project Settings > API.
const SUPABASE_URL = 'https://qrxebbqsubnqldvofktu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_qNqX0_gMbKr9evvIUD_qow_QRdzWqJy';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const EDIT_PIN = '2620'; // combine essa senha com a cliente; pode trocar aqui no código

let state = null;
let editing = false;
let pendingPhotoTarget = null;

const defaultState = () => ({
  brand: { name: 'Flor de Luz', tagline: 'Coroas para Homenagens' },
  hero: {
    eyebrow: 'Entrega em velórios e cemitérios',
    title: 'Uma homenagem em flores, <em>entregue com cuidado</em>',
    lead: 'Escolha o modelo de coroa e finalize direto pelo WhatsApp. Sem cadastro, sem complicação — só a atenção que o momento pede.'
  },
  contact: {
    whatsapp: '5531971398831', // (31) 97139-8831 — pode trocar no modo edição
    phoneDisplay: '(31) 97139-8831',
    hours: 'Todos os dias, das 7h às 22h'
  },
  products: [
    {id:'p1', name:'Coroa Tradicional Branca', desc:'flores brancas e folhagens verdes', price:'R$ --', photo:''},
    {id:'p2', name:'Coroa Mista Colorida', desc:'', price:'R$ --', photo:''},
    {id:'p3', name:'Coroa Premium', desc:'flores nobres, montagem especial', price:'R$ --', photo:''},
    {id:'p4', name:'Coroa Pequena / Simples', desc:'', price:'R$ --', photo:''}
  ]
});

function waLink(digits, text){
  const p = (digits||'').replace(/\D/g,'');
  return 'https://wa.me/' + p + (text ? ('?text=' + encodeURIComponent(text)) : '');
}

async function loadState(){
  try{
    const { data, error } = await supabaseClient
      .from('site_data')
      .select('content')
      .eq('id', 'main')
      .single();
    if(error) throw error;
    state = (data && data.content && Object.keys(data.content).length) ? data.content : defaultState();
  }catch(e){ state = defaultState(); }
  render();
  setupReveal();
}

async function saveState(){
  try{
    const { error } = await supabaseClient
      .from('site_data')
      .update({ content: state, updated_at: new Date().toISOString() })
      .eq('id', 'main');
    if(error) throw error;
    return true;
  }catch(e){
    alert('Não consegui salvar agora. Verifique a internet e tente de novo.');
    return false;
  }
}

function compressImage(file, maxW){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale; canvas.height = img.height * scale;
        canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.onerror = reject; img.src = e.target.result;
    };
    reader.onerror = reject; reader.readAsDataURL(file);
  });
}

function render(){
  document.body.classList.toggle('editing', editing);

  const bn = document.getElementById('brandName'), bt = document.getElementById('brandTagline');
  bn.textContent = state.brand.name; bt.textContent = state.brand.tagline;
  bn.contentEditable = editing; bt.contentEditable = editing;

  const eb = document.getElementById('heroEyebrow'), ht = document.getElementById('heroTitle'), hl = document.getElementById('heroLead');
  eb.textContent = state.hero.eyebrow;
  ht.innerHTML = state.hero.title;
  hl.textContent = state.hero.lead;
  eb.contentEditable = editing; ht.contentEditable = editing; hl.contentEditable = editing;

  const fp = document.getElementById('footerPhone'), fh = document.getElementById('footerHours');
  fp.textContent = state.contact.phoneDisplay;
  fh.textContent = state.contact.hours;
  fp.contentEditable = editing; fh.contentEditable = editing;

  const msg = 'Olá, gostaria de saber sobre coroas de flores.';
  ['navWa','heroWa','ctaWa','floatWa'].forEach(id => {
    document.getElementById(id).href = waLink(state.contact.whatsapp, msg);
  });

  const grid = document.getElementById('catalogGrid');
  grid.innerHTML = '';
  state.products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card'; card.dataset.id = p.id;
    const photoStyle = p.photo ? `background-image:url(${p.photo});` : '';
    card.innerHTML = `
      <button class="remove-card" data-action="remove">×</button>
      <div class="card-photo" data-action="photo" style="${photoStyle}">${p.photo ? '' : '✿'}</div>
      <div class="card-body">
        <p class="card-name" data-field="name" contenteditable="${editing}">${p.name}</p>
        <p class="card-desc" data-field="desc" contenteditable="${editing}">${p.desc||''}</p>
        <div class="card-footer">
          <div class="price-tag" data-field="price" contenteditable="${editing}"><span>${p.price}</span></div>
          <a class="order-btn" href="${waLink(state.contact.whatsapp, `Olá, gostaria de comprar: ${p.name} (${p.price})`)}" target="_blank" rel="noopener">Comprar</a>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function collectFromDOM(){
  state.brand.name = document.getElementById('brandName').textContent.trim() || 'Flor de Luz';
  state.brand.tagline = document.getElementById('brandTagline').textContent.trim();
  state.hero.eyebrow = document.getElementById('heroEyebrow').textContent.trim();
  state.hero.title = document.getElementById('heroTitle').innerHTML.trim();
  state.hero.lead = document.getElementById('heroLead').textContent.trim();
  state.contact.phoneDisplay = document.getElementById('footerPhone').textContent.trim();
  state.contact.whatsapp = state.contact.phoneDisplay.replace(/\D/g,'').length >= 12 ? state.contact.phoneDisplay.replace(/\D/g,'') : ('55' + state.contact.phoneDisplay.replace(/\D/g,''));
  state.contact.hours = document.getElementById('footerHours').textContent.trim();

  document.querySelectorAll('#catalogGrid .card').forEach(card => {
    const p = state.products.find(x => x.id === card.dataset.id);
    if(!p) return;
    p.name = card.querySelector('[data-field="name"]').textContent.trim() || 'Coroa de flores';
    p.desc = card.querySelector('[data-field="desc"]').textContent.trim();
    const priceEl = card.querySelector('[data-field="price"]');
    p.price = (priceEl.querySelector('span') ? priceEl.querySelector('span').textContent : priceEl.textContent).trim() || 'R$ --';
  });
}

document.getElementById('editFab').addEventListener('click', () => {
  const pin = prompt('Digite a senha para editar o site:');
  if(pin === null) return;
  if(pin === EDIT_PIN){ editing = true; render(); }
  else alert('Senha incorreta.');
});

document.getElementById('saveFab').addEventListener('click', async () => {
  collectFromDOM();
  if(await saveState()){ editing = false; render(); }
});

document.getElementById('addCardBtn').addEventListener('click', () => {
  collectFromDOM();
  state.products.push({id:'p'+Date.now(), name:'Novo modelo', desc:'', price:'R$ --', photo:''});
  render();
});

document.getElementById('catalogGrid').addEventListener('click', e => {
  const rm = e.target.closest('[data-action="remove"]');
  if(rm && editing){
    const card = e.target.closest('.card');
    if(confirm('Remover este modelo do catálogo?')){
      collectFromDOM();
      state.products = state.products.filter(p => p.id !== card.dataset.id);
      render();
    }
    return;
  }
  const photoZone = e.target.closest('[data-action="photo"]');
  if(photoZone && editing){
    pendingPhotoTarget = e.target.closest('.card').dataset.id;
    document.getElementById('photoInput').click();
  }
});

document.getElementById('photoInput').addEventListener('change', async e => {
  const file = e.target.files[0];
  if(!file) return;
  const dataUrl = await compressImage(file, 600);
  const p = state.products.find(x => x.id === pendingPhotoTarget);
  if(p) p.photo = dataUrl;
  collectFromDOM();
  render();
  e.target.value = '';
});

function setupReveal(){
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, {threshold:0.15});
  els.forEach(el => io.observe(el));
}

window.addEventListener('load', loadState);