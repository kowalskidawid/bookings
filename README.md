<div align="center">
  <img src="app/public/logo.svg" width="72" height="72" alt="Booking" />
  <h1>Booking</h1>
  <p>System rezerwacji wizyt i zarządzania terminami.</p>
  <p>
    <strong>🔗 Demo:</strong>
    <a href="https://booking-demo.ilaro.io">booking-demo.ilaro.io</a>
  </p>
</div>

---

## O projekcie

**Booking** to aplikacja do rezerwacji wizyt i zarządzania kalendarzem usług.
Umożliwia administratorom i pracownikom prowadzenie usług, dostępności,
grafików oraz obsługę wizyt klientów. Klienci mogą rezerwować terminy przez
publiczną stronę rezerwacji, a o zmianach informowani są mailowo.

Panel administracyjny pozwala zarządzać:

- 🧾 **Usługami** – oferta, czas trwania, cena
- 📅 **Dostępnościami** – grafiki i okna czasowe pracowników
- 👥 **Użytkownikami** – konta klientów
- 🪪 **Pracownikami** – osoby realizujące usługi
- 🗓️ **Wizytami** – rezerwacje wraz z ich statusem

## Stos technologiczny

| Warstwa        | Technologie                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| **Frontend**   | React 19, [Refine](https://refine.dev/) 5, Ant Design 5, Vite 6, TypeScript |
| **Backend**    | Java 21, Spring Boot 4, Spring Data JPA, MapStruct, Flyway, Thymeleaf       |
| **Baza danych**| MySQL 8                                                                     |
| **Autoryzacja**| Keycloak 26 (OAuth2 / OIDC, PKCE)                                            |
| **Poczta**     | Spring Mail + MailHog (lokalnie)                                             |
| **API docs**   | SpringDoc OpenAPI (Swagger UI)                                               |
| **Infra**      | Docker Compose                                                              |

## Struktura repozytorium

```
booking/
├── api/                 # Backend – Spring Boot (io.ilaro.booking)
├── app/                 # Frontend – Refine + React
├── keycloak/            # Eksport realmu Keycloak (realm-export.json)
└── docker-compose.yml   # Uruchomienie całego środowiska
```

## Szybki start (Docker Compose)

Najprostszy sposób – całe środowisko (frontend, backend, baza, Keycloak, poczta)
uruchamia się jednym poleceniem:

```bash
docker compose up --build
```

Po starcie dostępne są:

| Usługa                | Adres                                            |
| --------------------- | ------------------------------------------------ |
| 🖥️ Aplikacja (panel)  | http://localhost:3000                            |
| ⚙️ API (backend)      | http://localhost:8080                            |
| 📚 Swagger UI         | http://localhost:8080/swagger-ui/index.html      |
| 🔐 Keycloak           | http://localhost:8180                            |
| 🗄️ phpMyAdmin         | http://localhost:8081                            |
| 📧 MailHog (poczta)   | http://localhost:8025                            |

> Przy pierwszym uruchomieniu realm Keycloak (`booking`) wraz z kontami
> testowymi jest importowany automatycznie z `keycloak/realm-export.json`.

## Domyślne dane logowania

### Panel aplikacji (Keycloak – realm `booking`)

| Rola        | Login      | Hasło         |
| ----------- | ---------- | ------------- |
| Administrator | `admin`    | `admin123`    |
| Pracownik   | `employer` | `employer123` |

### Konsola administracyjna Keycloak

| Login   | Hasło   |
| ------- | ------- |
| `admin` | `admin` |

### Baza danych MySQL

| Użytkownik | Hasło      | Baza       |
| ---------- | ---------- | ---------- |
| `user`     | `password` | `bookings` |
| `root`     | `password` | –          |

> ⚠️ Powyższe dane są wyłącznie na potrzeby środowiska lokalnego/demo.
> W środowisku produkcyjnym należy ustawić własne, silne hasła.

## Uruchomienie lokalne (bez Dockera)

Wymagania: **Java 21**, **Node.js 20+**, **MySQL 8**, działający **Keycloak**.

### Backend (`api/`)

```bash
cd api
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

API wystartuje domyślnie na `http://localhost:8080`. Konfigurację bazy,
Keycloak i poczty ustaw w `application.properties` lub przez zmienne
środowiskowe (patrz sekcja `environment` w `docker-compose.yml`).

### Frontend (`app/`)

```bash
cd app
npm install
npm run dev
```

Konfiguracja przez plik `app/.env`:

```env
VITE_API_URL=http://localhost:8080
VITE_KEYCLOAK_URL=http://localhost:8180
VITE_KEYCLOAK_REALM=booking
VITE_KEYCLOAK_CLIENT_ID=booking-app
```

Dostępne skrypty frontendu:

| Polecenie       | Opis                          |
| --------------- | ----------------------------- |
| `npm run dev`   | tryb deweloperski (hot reload)|
| `npm run build` | build produkcyjny             |
| `npm run start` | serwowanie buildu             |

