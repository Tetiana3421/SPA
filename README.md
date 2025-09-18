# Pets SPA (Angular 18, Standalone)

Готовий шаблон **SPA "Домашні тварини"** з мок-бекендом в `localStorage` через інтерцептор.
Підтримує: роутинг, охорону маршрутів, автентифікацію (демо), CRUD для тварин, реактивні форми,
кастомну директиву та пайп.

## Швидкий старт
```bash
npm install
npm start
# відкрий http://localhost:4200
```
> Потрібні Node 18+ і Chrome (для юніт-тестів headless).

## Структура
- `features/pets` — список/деталі/створення/редагування
- `features/auth` — логін/реєстрація (демо, без реального бекенда)
- `features/breeds` — довідник порід (мок-дані)
- `core/interceptors/in-memory-backend.interceptor.ts` — симульований REST API (`/api/*`)
- `core/guards/auth.guard.ts` — захист маршрутів
- `shared/directives/highlight-invalid.directive.ts` — підсвітка невалідних полів
- `shared/pipes/breed-name.pipe.ts` — приклад пайпа

## Тести
Налаштовано каркас Karma/Jasmine. Додай свої `.spec.ts` у відповідні каталоги і виконай `npm test`.

## Перехід на реальний бекенд
1. Видали `in-memory-backend.interceptor` з `app.config.ts`.
2. У `PetsService` та `BreedsService` встанови реальні URL до твого REST API.
3. Реалізуй `AuthService` через Firebase/Supabase та токен у `auth.interceptor`.

## Git Flow під захист
- Роби етапи в окремих гілках `step-01-...` → PR → merge в `main`.

## Реальний бекенд (json-server + auth)
У новому терміналі:
```bash
npm run backend
# бекенд на http://localhost:3000
```
У іншому терміналі (фронтенд):
```bash
npm start
# http://localhost:4200
```

## Тестування
### Unit/інтеграційні
```bash
npm test
```

### E2E (Playwright)
1) Запусти фронтенд і бекенд як вище.
2) Потім:
```bash
npx playwright install
npm run e2e
```


## Публічні REST API для сторінки порід
- **Собаки:** https://api.thedogapi.com/v1/breeds
- **Коти:** https://api.thecatapi.com/v1/breeds

> Ми використовуємо їх без ключів (на невеликий трафік цього достатньо). За потреби додай API-ключі у запити.
