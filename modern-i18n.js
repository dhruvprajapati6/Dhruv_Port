(() => {
  const langs = {
    en: { short: 'EN', custom: {
      'modern.nav.settings':'Settings','modern.nav.hire':'Hire Me','modern.footer.crafted':'Crafted with','modern.footer.in_gujarat':'in Gujarat.',
      'modern.home.greeting':'Hi, I’m','modern.home.bio':'I build clean, performant web experiences and explore the world of cyber security. Currently in my final year of BCA at B.K. Mehta IT Center, Palanpur, and open to internships, freelance work, and meaningful tech collaborations.','modern.home.github':'GitHub','modern.home.featured':'FEATURED WORK','modern.home.selected':'Selected projects','modern.home.all_projects':'All projects','modern.home.stack':'TECH STACK','modern.home.stack_title':'Things I work with','modern.home.stack_hint':'Grab and throw them around.','modern.stats.technologies':'Technologies','modern.stats.hours':'Hours Coded','modern.stats.coffee':'Coffee Cups','modern.projects.filter_python':'Python','modern.projects.filter_security':'Security','modern.projects.filter_software':'Software'
    }},
    gu: { short: 'GU', custom: {
      'modern.nav.settings':'સેટિંગ્સ','modern.nav.hire':'સંપર્ક કરો','modern.footer.crafted':'પ્રેમથી બનાવ્યું','modern.footer.in_gujarat':'ગુજરાતમાં.',
      'modern.home.greeting':'નમસ્તે, હું છું','modern.home.bio':'હું સ્વચ્છ અને ઝડપી વેબ અનુભવ બનાવું છું તથા સાયબર સુરક્ષામાં રસ ધરાવું છું. હાલમાં પાલનપુરની બી. કે. મહેતા આઈટી સેન્ટરમાં BCAના અંતિમ વર્ષમાં છું અને ઇન્ટર્નશિપ, ફ્રીલાન્સ તથા ટેક સહયોગ માટે ઉપલબ્ધ છું.','modern.home.github':'GitHub','modern.home.featured':'મુખ્ય કામ','modern.home.selected':'પસંદગીના પ્રોજેક્ટ્સ','modern.home.all_projects':'બધા પ્રોજેક્ટ્સ','modern.home.stack':'ટેકનોલોજી','modern.home.stack_title':'હું જે ટેકનોલોજી વાપરું છું','modern.home.stack_hint':'પકડીને ફેંકી જુઓ.','modern.stats.technologies':'ટેકનોલોજી','modern.stats.hours':'કોડિંગના કલાકો','modern.stats.coffee':'કોફી કપ','modern.projects.filter_python':'પાયથન','modern.projects.filter_security':'સાયબર સુરક્ષા','modern.projects.filter_software':'સોફ્ટવેર'
    }},
    hi: { short: 'HI', custom: {
      'modern.nav.settings':'सेटिंग्स','modern.nav.hire':'संपर्क करें','modern.footer.crafted':'प्यार से बनाया','modern.footer.in_gujarat':'गुजरात में.',
      'modern.home.greeting':'नमस्ते, मैं हूँ','modern.home.bio':'मैं साफ़ और तेज़ वेब अनुभव बनाता हूँ और साइबर सुरक्षा में रुचि रखता हूँ। अभी पालनपुर के बी. के. मेहता आईटी सेंटर में BCA के अंतिम वर्ष में हूँ और इंटर्नशिप, फ्रीलांस व तकनीकी सहयोग के लिए उपलब्ध हूँ।','modern.home.github':'GitHub','modern.home.featured':'मुख्य काम','modern.home.selected':'चुने हुए प्रोजेक्ट','modern.home.all_projects':'सभी प्रोजेक्ट','modern.home.stack':'टेक स्टैक','modern.home.stack_title':'जिन तकनीकों पर मैं काम करता हूँ','modern.home.stack_hint':'खींचें और उछालें।','modern.stats.technologies':'तकनीकें','modern.stats.hours':'कोडिंग के घंटे','modern.stats.coffee':'कॉफी कप','modern.projects.filter_python':'पायथन','modern.projects.filter_security':'साइबर सुरक्षा','modern.projects.filter_software':'सॉफ्टवेयर'
    }}
  };
  const key='dp-lang'; let locale={};
  const get=(obj,path)=>path.split('.').reduce((v,k)=>v?.[k],obj);
  async function apply(lang){
    const entry=langs[lang]||langs.en;
    try { const response=await fetch(`locales/${lang}.json`); locale=response.ok?await response.json():{}; } catch { locale={}; }
    document.documentElement.lang=locale.meta?.lang||lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n,v=entry.custom[k]??get(locale,k);if(typeof v==='string')el.textContent=v;});
    document.querySelectorAll('[data-i18n-ph]').forEach(el=>{const v=get(locale,el.dataset.i18nPh);if(typeof v==='string')el.placeholder=v;});
    document.querySelectorAll('.lang-option').forEach(el=>el.classList.toggle('active',el.dataset.lang===lang));
    const current=document.getElementById('langCurrent'); if(current)current.textContent=entry.short;
    const role=document.getElementById('typedRole'); if(role&&locale.hero?.typing_texts){role.dataset.roles=JSON.stringify(locale.hero.typing_texts);window.dispatchEvent(new CustomEvent('portfolio:roles',{detail:locale.hero.typing_texts}));}
    localStorage.setItem(key,lang);
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const trigger=document.getElementById('langTrigger'),dropdown=document.getElementById('langDropdown');
    trigger?.addEventListener('click',e=>{e.stopPropagation();dropdown?.classList.toggle('open');trigger.setAttribute('aria-expanded',String(dropdown?.classList.contains('open')));});
    document.querySelectorAll('.lang-option').forEach(btn=>btn.addEventListener('click',()=>{apply(btn.dataset.lang);dropdown?.classList.remove('open');trigger?.setAttribute('aria-expanded','false');}));
    document.addEventListener('click',()=>{dropdown?.classList.remove('open');trigger?.setAttribute('aria-expanded','false');});
    const saved=localStorage.getItem(key); apply(langs[saved]?saved:'en');
  });
})();
