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
