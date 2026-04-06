# FLUX — Audit Report

**Stan na:** 06.04.2026

---

## 1. Status projektu

### Zrealizowane funkcjonalności

- **Autoryzacja:** pełna konfiguracja Auth.js v5 (Google OAuth i Credentials)
- **Middleware:** ochrona tras `/dashboard` przed nieautoryzowanym dostępem
- **UI Foundation:** Shadcn UI, Tailwind CSS, Framer Motion
- **Nawigacja:** dynamiczny Sidebar z obsługą `usePathname`
- **Walidacja:** React Hook Form + Zod zintegrowane z Server Actions

---

## 2. Cel strategiczny: wymuszony onboarding (Setup Wizard)

W celu zapewnienia wysokiej jakości danych i zwiększenia retencji użytkowników, projekt **FLUX** wykorzystuje model **Mandatory Banking Connection**.

### Logika

Użytkownik po zalogowaniu nie otrzymuje dostępu do Dashboardu, dopóki nie połączy przynajmniej jednego konta bankowego.

### Zaleta

Eliminuje to problem pustych wykresów i pozwala natychmiast dostarczyć użytkownikowi realną wartość finansową.

---

## 3. Szczegółowa lista TODO

### ETAP 1: Warstwa danych (Prisma i baza danych)

- [ ] Rozbudowa `schema.prisma`
  - [ ] Model `PlaidItem` — klucz do API Plaid (`accessToken`, `itemId`)
  - [ ] Model `BankAccount` — dane o saldzie i typie konta
  - [ ] Model `Transaction` — historia operacji finansowych
- [ ] Migracja: `npx prisma migrate dev` w celu synchronizacji bazy danych
- [ ] Konfiguracja instancji DB: `Direct URL` dla stabilnych połączeń (Supabase/Neon)

### ETAP 2: Infrastruktura Plaid (backend)

- [ ] Instalacja zależności: `npm install plaid react-plaid-link`
- [ ] Konfiguracja kluczy Sandbox w `.env`
- [ ] Utworzenie `lib/plaid.ts` do inicjalizacji SDK
- [ ] Server Action: `createLinkToken` — generowanie tokena startowego
- [ ] Server Action: `exchangePublicToken` — wymiana tokena na stały dostęp i zapis w bazie danych

### ETAP 3: Logika onboardingu (middleware i routing)

- [ ] Aktualizacja middleware o sprawdzenie `hasBankConnection` dla zalogowanych użytkowników
- [ ] Automatyczne przekierowanie z `/dashboard` na `/onboarding` przy braku kont bankowych
- [ ] Stworzenie minimalistycznej strony `/onboarding` z komponentem Plaid Link

### ETAP 4: Synchronizacja i dashboard (data delivery)

- [ ] Initial Sync: pobranie kont i transakcji natychmiast po wymianie tokena
- [ ] Balance Logic: obliczanie sumarycznego salda użytkownika
- [ ] Transaction Feed: wyświetlenie listy transakcji z mapowaniem kategorii Plaid

---

## 4. Architektura produkcyjna — zasady

### Security First

Nigdy nie przesyłamy `accessToken` do klienta. Cała komunikacja z Plaid odbywa się wyłącznie w Server Actions.

### Error Handling

Każda operacja na API Plaid musi być opakowana w blok `try/catch` i zwracać czytelny komunikat dla użytkownika.

### Performance

Dla komponentów ładujących dane bankowe używamy `Suspense`, aby uniknąć blokowania renderowania całego Dashboardu.

---

## 5. Dane testowe (Plaid Sandbox)

Do testowania integracji należy używać poniższych poświadczeń:

- **Instytucja:** dowolna, np. *Plaid Gold Standard Bank*
- **Username:** `user_good`
- **Password:** `password_good`
- **MFA:** `1234` (jeśli wymagane)

