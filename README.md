[![React](https://img.shields.io/badge/React-19-blue)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-blue)](#)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC)](#)
[![MobX](https://img.shields.io/badge/MobX-6.x-orange)](#)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF)](#)
[![Laravel](https://img.shields.io/badge/Laravel-13.x-FF2D20)](#)
[![version](https://badgen.net/badge/version/v.1.0.0?icon=tag&scale=1)](#)

# ToolBox – платформа веб-инструментов под конкретные задачи

**ToolBox** – fullstack-платформа, объединяющая набор специализированных веб-инструментов в единой экосистеме с общей системой авторизации, пользовательским профилем и масштабируемой модульной архитектурой.

> [!IMPORTANT]
>
> Посмотреть проект в деле:
>
> [![ToolBox](https://img.shields.io/badge/ToolBox-LIVE_DEMO-4F46E5?style=for-the-badge&logo=appveyor&logoColor=white)](https://letunoff.ru/toolbox)

## Технологический стек

Проект построен на современном fullstack-стеке:

### Frontend

- **React** + **TypeScript** – компонентная архитектура и строгая типизация;
- **FSD (Feature-Sliced Design)** – модульная организация кода и четкое разделение ответственности;
- **Tailwind CSS** – единый дизайн-код и быстрая адаптивная разработка;
- **MobX** – реактивное управление состоянием приложения;
- **Vite** – быстрый запуск и оптимизированная сборка.

### Backend

- **Laravel** – REST API и серверная бизнес-логика;
- **Sanctum** – безопасная cookie-based аутентификация;
- **MySQL** – хранение пользовательских данных и истории операций;
- **Resend** – работа с транзакционными письмами и подтверждением почты.

## Что внутри?

### Общая инфраструктура платформы

- cookie-based аутентификация через Laravel Sanctum;
- email verification и password reset через Resend;
- интернационализация (i18n);
- поддержка светлой и тёмной темы;
- полностью адаптивный интерфейс для desktop и mobile;
- защищённые маршруты для авторизованных пользователей;
- централизованное управление состоянием через MobX;
- масштабируемая система подключения новых инструментов.

### Пакетный переименователь файлов

**Массовое переименование файлов по заданному шаблону:**

- загрузка произвольного набора файлов через drag & drop или диалог;
- задание префикса и суффикса относительно порядкового номера через маску;
- мгновенный предпросмотр итоговых имён до скачивания;
- скачивание переименованных файлов одним ZIP-архивом.

### Сократитель ссылок

**Генерация коротких ссылок с полноценным менеджером истории:**

- создание короткой ссылки из любого URL в один клик;
- отдельная таблица истории всех сокращённых ссылок;
- возможность быстро поделиться ссылкой или QR-кодом;
- быстрые действия для каждой записи: открыть, скопировать, удалить, показать QR-код;
- закрепление ссылок от удаления для постоянного пользования;
- хранение ссылок на сервере с сохранением между сессиями.

## Скриншоты

<details>
  <summary>Показать</summary>

  <p align="center">
    <img src="./docs/screenshots/auth.webp" alt="Auth" width="800">
    <br>
    <img src="./docs/screenshots/home.webp" alt="Home" width="800">
    <br>
    <img src="./docs/screenshots/renamer.webp" alt="Renamer" width="800">
    <br>
    <img src="./docs/screenshots/shortener.webp" alt="Shortener" width="800">
  </p>

</details>

## Автор

> [!TIP]
>
> #### Евгений Летунов
>
> [![Евгений Летунов](https://img.shields.io/badge/%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9_%D0%9B%D0%B5%D1%82%D1%83%D0%BD%D0%BE%D0%B2-Frontend_Dev-0A66C2?style=for-the-badge&logo=react&logoColor=white)](https://letunoff.ru)
> [![Telegram](https://img.shields.io/badge/@defrazo-Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/defrazo)
