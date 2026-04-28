
# Installation de l’environnement (XAMPP, PHP, Composer, Git, Laravel)

## 1. Installer XAMPP

Télécharger et installer **XAMPP** pour obtenir **PHP, Apache et MySQL**.

---

# 2. Ajouter PHP dans les variables d’environnement

1. Aller dans le dossier :

```
C:\xampp\php
```

2. Copier ce chemin.

3. Ajouter le chemin dans :

**Variables d’environnement → Variables système → Path**

---

# 3. Vérifier la version de PHP

Ouvrir **CMD** et exécuter :

```
php -v
```

Si PHP est bien configuré, la version s’affiche.

---

# 4. Installer Composer

Télécharger **Composer** :

[https://getcomposer.org/](https://getcomposer.org/)

Installer Composer normalement.

---

# 5. Vérifier l’installation de Composer

Dans **CMD** :

```
composer -v
```

---

# 6. Préparer PHP avant l’installation de Laravel

Avant d’installer Laravel :

* Activer l’extension **ZIP**
* Installer **Git**

### Activer ZIP

Ouvrir :

```
C:\xampp\php\php.ini
```

Chercher :

```
;extension=zip
```

Supprimer `;` :

```
extension=zip
```

Enregistrer le fichier.

---

# 7. Vérifier l’extension ZIP

Dans **CMD** :

```
php -m
```

La liste doit contenir :

```
zip
```

---

# 8. Installer Git

Télécharger **Git** :

[https://git-scm.com/](https://git-scm.com/)

Vérifier l’installation :

```
git --version
```

---

# 9. Installer Laravel

Créer un dossier pour le projet, ouvrir **PowerShell** dans ce dossier et exécuter :

```
composer create-project laravel/laravel backend
```

Cela crée un projet **Laravel** nommé **backend**.

---

# 10. Configuration de la base de données

Ouvrir le fichier :

```
backend/.env
```

Modifier la configuration :

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=etn_database
DB_USERNAME=root
DB_PASSWORD=
```

Créer la base de données **etn_database** dans **phpMyAdmin**.

---

# 11. Lancer les migrations

Dans le dossier **backend**, exécuter :

```
php artisan migrate
```

Cela va créer les tables dans la base de données.

---

# 12. Lancer le serveur Laravel

Dans le dossier **backend** :

```
php artisan serve
```

Laravel sera accessible sur :

```
http://127.0.0.1:8000
```

---

✅ L’environnement est maintenant prêt pour développer l’application.

---


comme dans les projets **open-source professionnels**.
=======
<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

