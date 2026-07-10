const BAD_WORD_ROOTS = [

  "mc", "bc", "mmc", "bbc",
  "madar", "maderch", "madarch", "madarc",
  "behench", "behnch", "bhnchd", "bnchd",
  "bhosd", "bhosad", "bhosat",
  "bhosdi", "bhosdik", "bhosdek", "bhosdk",
  "bsdk", "bsdke", "bsdkw",
  "chut", "choot", "chutiy", "chootiy",
  "chutmar", "chutmarik", "chtiy",
  "ch*t", "c**t",
  "gaand", "gand", "gaandu", "gandu",
  "gaandm", "gandfat",
  "lund", "lavd", "lawd",
  "loda", "lode", "lauda", "laude",
  "lndd", "lwda",
  "randi", "raand", "rande", "rndi",
  "rand1", "r@ndi",
  "harami", "haraami", "hrami",
  "haramzad", "haramkhod",
  "kamin", "kameen",
  "jhant", "jhaat", "jhat",
  "phuddi", "fuddi", "fudi", "phudi",
  "fudd", "phud",
  "bhadw", "bhadv", "bhadwa", "bhadva",
  "chod", "choda", "chodi", "chode",
  "chodna", "chodn",
  "muth", "muutna",
  "kasbi", "veshya", "veshy", "kaasbi",
  "saala", "saali", "sala", "sali",
  "saalaa",
  "kutiy",
  "suar", "suwar", "suarr",
  "hijr", "hijda", "hijde",
  "ullu ka", "ulluka",
  "tatti", "tat", "goo", "gobar",
  "dalal", "dallal",
  "chamaar", "chamar", "bhangi",
  "neech zaat", "neechzaat",

  "bhosdino", "bhosdini", "bhosdina",
  "gaando", "gaandi", "gando", "gandi",
  "randino", "randini",
  "chhinalo", "chhinali", "chhinaalo",
  "chhinal",
  "lavdo", "lavdi", "lavda",
  "phudi", "fudi",
  "khanki", "khankini", "khaanki",
  "bhadvo", "bhadva",
  "saalo", "saali",
  "kutro", "kutri", "kutrono",
  "hijdo", "hijda",
  "chakko", "chakka",
  "mutvu", "mutan",

  "मादरचोद", "मादरच", "बेहनचोद", "बेहनच",
  "भोसड", "चुतिय", "चूत", "रंड",
  "हरामी", "हरामज़", "कमीन", "साल",
  "गांड", "लंड", "लोड", "झंट",
  "फुद्द", "भड़व", "चोद", "वेश्य",
  "कसब", "दलाल", "टट्ट", "गू",
  "नंग", "हिजड",

  "ભોસડ", "ગાંડ", "રાંડ", "છીનાળ",
  "લવડ", "ફુદ્દ", "ખાંક", "ભડવ",
  "સાળ", "કૂતર", "હીજડ", "ચક્ક",
  "વેશ્ય", "કસબ", "ઝાંટ", "ટટ્ટ",
  "મૂત", "નીચ", "ભડ",

  "fuck", "fuk", "fck", "fuc",
  "fucc", "phuck", "phuk",
  "f**k", "f*ck", "fu*k",
  "shit", "sh1t", "sht",
  "sh*t", "$hit",
  "bitch", "b1tch", "bytch",
  "biatch", "b*tch",
  "asshole", "assh", "azzhole",
  "a**hole", "@sshole",
  "cunt", "c*nt", "kunt",
  "dick", "d1ck", "dik",
  "dikk", "d*ck",
  "pussy", "pus$y", "pvssy",
  "bastard", "bastar",
  "whore", "wh0re", "slut", "sl*t",
  "motherfuck", "motheerfuck",
  "mf", "mthrfckr",
  "nigger", "nigg", "n*gger",
  "faggot", "fag", "f@g",
  "porn", "p0rn", "pr0n",
  "xxx", "rape", "rapist",
  "kys", "kill yourself",
  "kill ur self",
];

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[@a]/g, 'a')
    .replace(/[3e]/g, 'e')
    .replace(/[1!|i]/g, 'i')
    .replace(/[0o]/g, 'o')
    .replace(/[5$s]/g, 's')
    .replace(/[7t]/g, 't')
    .replace(/[vub]/g, 'b')
    .replace(/[4]/g, 'a')
    .replace(/[6]/g, 'g')
    .replace(/[8]/g, 'b')
    .replace(/[9]/g, 'g')
    .replace(/[2]/g, 'z')
    .replace(/(.)\1{2,}/g, '$1$1')
    .replace(/[\s.*\-_,#@!?^&]/g, '')
    .trim();
}

function containsBadWord(text) {
  const normalized = normalize(text);
  const original = text.toLowerCase();

  for (let root of BAD_WORD_ROOTS) {
    const normRoot = normalize(root);
    if (normalized.includes(normRoot)) return true;
    if (original.includes(root.toLowerCase())) return true;
  }
  return false;
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('feedback-form');
  const nameInput = document.getElementById('fb-name');
  const textInput = document.getElementById('fb-text');
  const errorDiv = document.getElementById('bad-word-error');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    const nameVal = nameInput ? nameInput.value : '';
    const textVal = textInput ? textInput.value : '';
    const combined = nameVal + ' ' + textVal;

    if (containsBadWord(combined)) {
      e.preventDefault();
      if (errorDiv) {
        errorDiv.innerHTML = '⚠️ Your comment contains inappropriate language. Please keep your review respectful.';
        errorDiv.style.display = 'block';
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert('⚠️ Please keep your comment respectful. Inappropriate language is not allowed.');
      }
      return false;
    }

    if (errorDiv) errorDiv.style.display = 'none';
  });

  if (textInput) {
    textInput.addEventListener('input', function () {
      if (containsBadWord(this.value)) {
        this.style.borderColor = '#e53e3e';
        if (errorDiv) {
          errorDiv.innerHTML = '⚠️ Inappropriate language detected.';
          errorDiv.style.display = 'block';
        }
      } else {
        this.style.borderColor = '';
        if (errorDiv) errorDiv.style.display = 'none';
      }
    });
  }
  
  if (nameInput) {
    nameInput.addEventListener('input', function () {
      if (containsBadWord(this.value)) {
        this.style.borderColor = '#e53e3e';
        if (errorDiv) {
          errorDiv.innerHTML = '⚠️ Inappropriate language detected in your name.';
          errorDiv.style.display = 'block';
        }
      } else {
        this.style.borderColor = '';
        if (errorDiv) errorDiv.style.display = 'none';
      }
    });
  }
});
