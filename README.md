[![React](https://img.shields.io/badge/React-19-149ECA)](#технологический-стек)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6)](#технологический-стек)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4)](#технологический-стек)
[![MobX](https://img.shields.io/badge/MobX-7.x-FF9955)](#технологический-стек)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF)](#технологический-стек)
[![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20)](#технологический-стек)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1)](#технологический-стек)
[![Version](https://img.shields.io/badge/version-1.5.0-e98224)](#)

<div align="center">

# ToolBox – твои инструменты в одном месте

</div>

**ToolBox** – веб-приложение, объединяющее специализированные инструменты для решения повседневных задач в едином рабочем пространстве.

<p align="center">
  <a href="https://toolbox.letunoff.ru">
    <img src="https://img.shields.io/badge/Открыть_ToolBox-7c5cff?style=for-the-badge" alt="Открыть ToolBox">
  </a>
</p>

<div align="center">
  <img src="./docs/screenshots/home.webp" alt="Home" width="800">
</div>

## Модули

### Переименование файлов

**Пакетный переименователь** для массового изменения имён файлов по заданному шаблону с предварительным просмотром результатов.

- загрузка файлов через drag & drop или диалог выбора;
- настройка префикса, суффикса и порядковой нумерации;
- предварительный просмотр новых имён до скачивания;
- скачивание обработанных файлов одним ZIP-архивом.

### Сокращение ссылок

**Менеджер коротких ссылок** для создания, хранения и управления сокращёнными URL.

- сокращение исходных URL;
- просмотр и управление историей созданных ссылок;
- возможность быстро поделиться ссылкой или QR-кодом;
- открытие, удаление и закрепление ссылок;
- сохранение данных между сессиями.

## Технологический стек

### Frontend

- **React** и **TypeScript** – компонентная архитектура и строгая типизация;
- **FSD (Feature-Sliced Design)** – чёткое разделение ответственности и масштабируемая структура;
- **Tailwind CSS** – единый визуальный стиль и быстрая адаптивная вёрстка;
- **MobX** – реактивное управление состоянием с лаконичным синтаксисом;
- **Vite** – быстрый запуск и оптимизированная сборка.

### Backend

- **Laravel** и **Sanctum** – серверная бизнес-логика, REST API и сессионная аутентификация;
- **PostgreSQL** – реляционное хранение данных и управление связями между сущностями;
- **Laravel Queues** и **Scheduler** – асинхронное выполнение задач и автоматизация периодических процессов.

### DevOps & Infrastructure

- **Docker** и **Docker Compose** – контейнеризация приложений и унификация окружения;
- **Nginx** – reverse proxy и раздача приложений;
- **VPS** – деплой и администрирование проекта.

## Возможности

- **Авторизация** – регистрация, вход по email и через OneMate по OAuth 2.0;
- **Учётная запись** – управление профилем, смена пароля и восстановление доступа;
- **Связанные приложения** – привязка и отключение OneMate без потери доступа к аккаунту ToolBox;
- **Интерфейс** – адаптивная вёрстка для всех устройств, светлая и тёмная темы;
- **Локализация** – поддержка нескольких языков интерфейса;
- **Демо-режим** – знакомство с возможностями без регистрации.

## Скриншоты

<details>
  <summary>Показать</summary>
  <p align="center">
    <img src="./docs/screenshots/auth.webp" alt="Auth" width="800">
    <img src="./docs/screenshots/renamer.webp" alt="Renamer" width="800">
    <img src="./docs/screenshots/shortener.webp" alt="Shortener" width="800">
  </p>
</details>

## Автор

[![Евгений Летунов](https://img.shields.io/badge/%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9_%D0%9B%D0%B5%D1%82%D1%83%D0%BD%D0%BE%D0%B2-Fullstack_Dev-0A66C2?style=for-the-badge&logo=github&logoColor=white)](https://letunoff.ru) [![Telegram](https://img.shields.io/badge/@defrazo-Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/defrazo)
