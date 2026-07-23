<div align="center">

# Telegram VPN Bot

**Telegram-бот для продажи VPN-подписок на базе [Remnawave](https://github.com/remnawave/backend)**

Приём оплаты, выдача подписок, управление пользователями — автоматически.

[![Python 3.13+](https://img.shields.io/badge/Python-3.13+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## Что это

Telegram-бот, который берёт на себя весь цикл VPN-бизнеса: от регистрации до автопродления подписки. Интегрируется с панелью Remnawave и поддерживает 24+ платёжных провайдера.

### Основные возможности

- **Подписки** — гибкие тарифы, докупка трафика, управление устройствами, пробный период
- **Платежи** — Telegram Stars, YooKassa, CryptoBot, Freekassa и ещё 20+ провайдеров
- **Реферальная программа** — бонусы за приглашений, вывод средств
- **Автопродление** — автоматическое продление за 3 дня до окончания
- **Личный кабинет** — подписка, ID, трафик, устройства — всё в одном сообщении
- **Мультиязычность** — русский, английский, украинский, китайский, фарси
- **Уведомления** — покупки, продления, тикеты поддержки в топики Telegram

---

### НЕ ИСПОЛЬЗУЙТЕ ЭТОТ РЕПОЗИТОРИЙ ДЛЯ СВОЕГО БОТА
| [Bedolaga Bot Docs](https://docs.bedolagam.ru) | Оригинал |

---

### Минимальный `.env`

```env
BOT_TOKEN=123456:ABC-DEF...
ADMIN_IDS=123456789
SUPPORT_USERNAME=@support

# Remnawave панель
REMNAWAVE_API_URL=https://panel.example.com
REMNAWAVE_API_KEY=your_api_key
REMNAWAVE_AUTH_TYPE=api_key

# БД (Docker)
DATABASE_MODE=auto
POSTGRES_HOST=postgres
POSTGRES_DB=remnawave_bot
POSTGRES_USER=remnawave_user
POSTGRES_PASSWORD=secure_password_123
REDIS_URL=redis://redis:6379/0

# Платежи (включите нужные)
TELEGRAM_STARS_ENABLED=true
```

### Перезапуск после изменений

```bash
docker compose down && docker compose up -d --build
```

---

## Стек

| Компонент | Технология |
|:---|:---|
| Язык | Python 3.13, async |
| Telegram | aiogram 3.x |
| БД | PostgreSQL 15 + SQLAlchemy 2.x + Alembic |
| Кэш | Redis 7 |
| Web-сервер | FastAPI (webhook, платежи, API) |
| Логирование | structlog |
| Контейнеризация | Docker Compose |

---

## Структура проекта

```
app/
├── bot.py                  # Точка входа
├── config.py               # Все настройки (Settings)
├── handlers/               # Обработчики команд и callback
│   ├── menu.py             # Главное меню
│   └── subscription/       # Подписки, покупки, продление
├── keyboards/              # Клавиатуры (inline + reply)
│   ├── inline.py           # Инлайн-кнопки
│   └── reply.py            # Reply-клавиатура
├── services/               # Бизнес-логика
├── database/               # Модели и миграции
├── localization/           # Интерфейс (i18n)
└── webserver/              # FastAPI, webhook-хендлеры

locales/                    # Файлы локализации (ru/en/ua/zh/fa)
migrations/                 # Alembic миграции
docker-compose.yml          # Оркестрация
```

---

## Платёжные провайдеры

| Провайдер | Методы | Валюта |
|:---|:---|:---:|
| Telegram Stars | Звёзды Telegram | XTR |
| YooKassa | Карты, СБП | RUB |
| CryptoBot | USDT, TON, BTC, ETH | Crypto |
| Heleket | USDT, мульти-сеть | Crypto |
| CloudPayments | Карты, 3D-Secure | RUB |
| Freekassa | NSPK СБП, Карты | RUB |
| Kassa AI | СБП, Карты, SberPay | RUB |
| MulenPay | Карты | RUB |
| RioPay | Карты | RUB |
| SeverPay | СБП, Карты | RUB |
| PayPear | Карты, СБП, SberPay | RUB |
| RollyPay | СБП, Карты, Крипто | RUB |
| AuraPay | Карты, СБП | RUB |
| Overpay | Карты, СБП | RUB |
| Antilopay | Карты, СБП, SberPay | RUB |
| Etoplatezhi | Карты, СБП | RUB |
| Jupiter | СБП через QR | RUB |
| Donut | Карты, СБП, СБП QR | RUB |
| Lava Business | Карты, СБП | RUB |
| Apple IAP | iOS App Store | USD |
| Tribute | Telegram-платежи | RUB |

Все провайдеры работают параллельно через единый FastAPI-сервер на порту `8080`.

---

## Локализация

| Язык | Файл | Код |
|:---|:---|:---:|
| Русский | `locales/ru.json` | `ru` |
| English | `locales/en.json` | `en` |
| Українська | `locales/ua.json` | `ua` |
| 中文 | `locales/zh.json` | `zh` |
| فارسی | `locales/fa.json` | `fa` |

Для добавления нового языка — создайте файл `locales/<код>.json` и добавьте код в `AVAILABLE_LANGUAGES`.

---

## Документация

| Раздел | Описание |
|:---|:---|
| [Remnawave Backend](https://github.com/remnawave/backend) | Панель управления VPN |
| [Bedolaga Bot Docs](https://docs.bedolagam.ru) | Документация бота (оригинал) |
| [Bedolaga Cabinet](https://github.com/BEDOLAGA-DEV/bedolaga-cabinet) | Веб-кабинет (React) |

---

## Обновление

```bash
git pull origin main
docker compose down && docker compose up -d --build
```

Бот автоматически проверяет наличие новых версий через GitHub API (`werffix/remnavpn-main`).

---

## Лицензия

[MIT](LICENSE) — свободное использование для личных и коммерческих проектов.

---
