# AnimBook-server 🔥

## 🛠 Технологии:
- **Nest JS**
- **TypeScript**
- **bcryptjs**
- **Jwt**
- **Typeorm** (ORM)
- **cloudinary** (хранение картинок)
- **yookassa.ru** (оплата)

# База данных:
- **PostgreSQL**

## Запуск Backend:
 ```shell
pnpm install
pnpm start:dev
```

## Менеджер пакетов

Node.js >=24.15.0, pnpm 12.14.0. Версия pnpm закреплена в `package.json`.
Если pnpm ещё не установлен, активируйте его через `corepack enable pnpm`.

Зависимости фиксируются в `pnpm-lock.yaml`. Для воспроизводимой установки, в том числе в CI:

```sh
pnpm install --frozen-lockfile
```

Проверки: `pnpm typecheck`, `pnpm lint`, `pnpm build`. Тесты: `pnpm test`.
