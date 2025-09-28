# PumpPal – opis aplikacije

**PumpPal** je full-stack aplikacija za pametnu podršku treninzima, zasnovana na **React** frontendu sa **Chakra UI** komponentama i **Laravel** REST API backendom koji koristi **MySQL** bazu. Fokus je na jednostavnom korisničkom iskustvu, brzim AI odgovorima u chatu i jasnim administratorskim uvidima u korišćenje sistema.

---

## 🎨 Paleta brenda (UI)

- **NAVY_DEEP:** `#0f1f36` (primarna pozadina)
- **PANEL:** `#232941` (karte/paneli)
- **YELLOW:** `#F5B400` i **YELLOW_2:** `#FFC53D` (naglasci/CTA)
- **LIGHT:** `#c9d4e6` i **LIGHT_FADE:** `rgba(255,255,255,0.06)` (tipografija i suptilne pozadine)

UI je građen isključivo Chakra UI primitivama (Box, Flex, Stack, Text, Button…), što omogućava dosledan, moderan i responzivan dizajn bez dodatnih stilskih biblioteka.

---

## 🧱 Tehnologije i arhitektura

- **Frontend:** React 18, React Router, Chakra UI; sesija u `sessionStorage` (token + podaci o korisniku). Role-aware navigacija: meni i link logo-a se dinamički prilagođavaju ulozi korisnika.
- **Backend:** Laravel (REST API), Eloquent modeli i resursi (User, Chat, Message, Response), middleware zaštita i provera uloga.
- **Baza:** MySQL (relacije 1-N: korisnik → chatovi; chat → poruke; poruka → AI odgovor).
- **Autentikacija:** Bearer token; frontend čuva token u `sessionStorage`, backend potvrđuje ovlašćenja i uloge.

---

## 🧭 UX i navigacija

Aplikacija je podeljena na jasno definisane celine:

- **Auth** (Login/Registration) – jedina dostupna neulogovanom korisniku.
- **Home** – marketinško-informativni “hero” prikaz sa CTA dugmadima (npr. ka chatu i About stranici).
- **My Chats** – glavni radni prostor za korisnike: kreiranje, preimenovanje i brisanje chatova; slanje poruka i prijem AI odgovora (Markdown podrška).
- **About Us** – prezentaciona stranica sa informacijama o timu i misiji.
- **Admin**:  
  - **Dashboard** – KPI kartice (ukupni korisnici/administratori/chatovi/poruke), izvedene metrike (proseci, novi korisnici u poslednjih 7 dana), “top korisnici” po broju chatova i mini trend grafici.  
  - **Users Analytics** – paginirana tabela (4 korisnika po strani), pretraga po imenu, sortiranje A–Z/Z–A i inline izmena imena/email-a.

- **Breadcrumbs** – dinamičke mrvice za sve stranice *osim* Auth, Home i Dashboard (jasna hijerarhija navigacije).
- **Footer** – minimalistički, uvek vidljiv kontakt podrške.

---

## 👤 Slučajevi korišćenja – neulogovani korisnik

- Vidi samo **Auth** stranicu (registracija/prijava).
- Nakon uspešne prijave:  
  - regularni korisnik → **Home**  
  - administrator → **Dashboard**  
- Direktan pristup zaštićenim rutama preusmerava na Auth.

---

## 🏋️ Slučajevi korišćenja – regularni korisnik

- **Home**: brzi uvod u pogodnosti, CTA ka chatu i informacijama.
- **My Chats**:
  - Kreiranje novih chatova, preimenovanje i brisanje postojećih.
  - Slanje pitanja i prijem AI odgovora.
  - Poruke vizuelno odvojene (avatar korisnika iz sesije, avatar bota je logo).
  - **Markdown render**: naslovi, **bold**, *italic*, liste, kod blokovi.
  - Dok AI odgovara: polje za unos i taster “Send” su blokirani; prikazuje se indikator učitavanja; nakon odgovora UI se odblokira.

---

## 🔐 Slučajevi korišćenja – administrator

- **Dashboard**:
  - KPI kartice: ukupni korisnici, broj administratora, chatovi, poruke.
  - Izvedene metrike: prosečan broj chatova po korisniku, prosečan broj poruka po chatu, broj korisnika kreiranih u poslednjih 7 dana, broj korisnika sa bar jednim chatom.
  - Lista **top 5 korisnika** po broju chatova.
  - Mini “bar” trend grafici (izrađeni Chakra primitivama radi performansi i jednostavnosti).
- **Users Analytics**:
  - Paginuje korisnike (4 po strani).
  - Pretraga po imenu, sortiranje A–Z/Z–A.
  - Inline izmena **imena** i **email-a** uz validaciju i sigurnosne provere (backend role guard).
- Navigacija: logo vodi na **/dashboard**, stavke menija su **Dashboard** i **Users Analytics**.

---

## 🛡️ Bezbednost i pravila pristupa

- Frontend: uslovni prikaz elemenata po ulozi, zaštita ruta i redirekcije.
- Backend: **autorizacija** na nivou API rute (samo administrator vidi statistiku i menja korisnike).
- Logout: poziv backend odjave (ako postoji), brisanje `sessionStorage` i preusmerenje na Auth.

---

## ⚡ Performanse i dostupnost

- Chakra UI primitivni blokovi → lagan i konzistentan UI.
- Responzivni layout-i sa visokim kontrastom i jasnim CTA elementima.
- Minimalni re-render: tabela korisnika, liste chatova i paneli koriste jednostavne kolekcije i optimizovanu render logiku.

---

## ✅ Razlozi za izbor tehnologija

- **React + Chakra UI**: brz razvoj, pristupačnost, čist dizajn, mala kompleksnost stilova.
- **Laravel + MySQL**: zreo ekosistem, jasne Eloquent relacije, stabilna baza, jednostavna integracija politika pristupa.
- Dizajn omogućava lako proširenje (npr. planovi treninga, timske funkcionalnosti, napredna analitika) bez prekrajanja postojećih modula.

---

## 🧩 Kratak rezime po ulozi

- **Gost**: registracija i prijava (drugi delovi nedostupni).
- **Regularni korisnik**: Home, About, **My Chats** (kreiranje/izmene/brisanje chatova, komunikacija sa AI).
- **Administrator**: **Dashboard** (KPI + trendovi + top korisnici), **Users Analytics** (paginacija, pretraga, sortiranje, inline izmene).

---

**PumpPal** spaja elegantan i brz web interfejs sa pouzdanim API slojem: regularnim korisnicima donosi prijatan AI chat i motivacione funkcije, a administratorima jasan uvid u rast i angažman korisničke baze. Dizajn je moderan, dosledan i spreman za dalji razvoj.


## ⚙️ Instalacija i pokretanje
---------------------------

1. Klonirajte repozitorijum:
```bash
    git clone https://github.com/elab-development/internet-tehnologije-2024-projekat-pumppal_20210051_2020_0024.git
```
2. Pokrenite backend:
```bash
   cd pumppal-back
   composer install
   php artisan migrate:fresh --seed
   php artisan serve
```
    
3. Pokrenite frontend:
```bash
   cd pumppal-front
   npm install
   npm start
```
    
4.  Frontend pokrenut na: [http://localhost:3000](http://localhost:3000) Backend API pokrenut na: [http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)